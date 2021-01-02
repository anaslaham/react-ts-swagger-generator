import ApiErrorType from "./api-error-type";

export default interface ApiError {
  errorType?: ApiErrorType;
  message?: string;
  details?: string;
  validationErrors?: validationError[];
}
export interface validationError {
  message?: string;
  members: string[];
}
