export interface ApiResponse<TData> {
  success: boolean;
  message: string;
  data: TData;
  meta?: paginationMeta;
}

export interface paginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
export interface ApiErrorResponse {
  success: boolean;
  message: string;
}
