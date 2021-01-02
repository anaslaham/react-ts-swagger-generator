export default interface IBaseListingResponse<T> {
  items: T[];
  totalCount: number;
}
