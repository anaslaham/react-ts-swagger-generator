import axios, { AxiosInstance } from "axios";
import RequestConfig from "./request-config";

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
  public async request<T>(config: RequestConfig): Promise<any> {
    const response = await this.api.request<IBaseApiResponse<T>>(config);
    return response.data.result;
  }
}
