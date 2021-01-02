import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";
import RequestConfig from "./request-config";
import ApiError, { validationError } from "./api-error";
import ApiErrorType from "./api-error-type";
import ApiResult from "./api-result";
import eventManager, { EVENT_UNAUTHORIZED } from "../event-manager";

interface IBaseApiResponse<T> {
  result: T;
  success: boolean;
  error: {
    code: number;
    message: string;
    details: string;
    validationErrors: {
      message: string;
      members: string[];
    }[];
  };
  unAuthorizedRequest: boolean;
}

export default class ApiProvider {
  private api: AxiosInstance;
  public constructor(config: RequestConfig) {
    this.api = axios.create(config);
  }
  public async request<T>(config: RequestConfig): Promise<ApiResult<T>> {
    let result: T | ApiError = {
      errorType: ApiErrorType.UNKNOWN,
    };
    try {
      const response = await this.api.request<IBaseApiResponse<T>>(config);
      const { data } = response;
      result = data.result;
    } catch (error) {
      result = this.handleError<T>(error);
    } finally {
      return result;
    }
  }

  private handleError<T>(error: AxiosError<IBaseApiResponse<T>>): ApiError {
    if (error.response) {
      // The request was made and the server responded with an error status code.
      const message: string = error.response.data.error.message;
      //the request error details
      const details: string = error.response.data.error.details;
      //the error validation errors
      const validationErrors: validationError[] =
        error.response.data.error.validationErrors;
      let type: ApiErrorType;
      switch (error.response.status) {
        case 400:
          type = ApiErrorType.BAD_REQUEST;
          break;
        case 401:
          type = ApiErrorType.UNAUTHORIZED;
          eventManager.emit(EVENT_UNAUTHORIZED);
          break;
        case 403:
          type = ApiErrorType.FORBIDDEN;
          break;
        case 404:
          type = ApiErrorType.NOT_FOUND;
          break;
        case 409:
          type = ApiErrorType.CONFLICT;
          break;
        case 500:
          type = ApiErrorType.INTERNAL_SERVER_ERROR;
          break;
        default:
          type = ApiErrorType.UNKNOWN;
          break;
      }
      return { errorType: type, message, validationErrors, details };
    } else if (error.request) {
      // The request was made but no response was received.
      return { errorType: ApiErrorType.CONNECTION };
    } else {
      return { errorType: ApiErrorType.UNKNOWN };
    }
  }
}
