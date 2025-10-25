export interface IError {
  success: boolean;
  key: string[];
  error: string;
}

export interface IPagination {
  page: number;
  limit: number;
  totalRecords: number;
  totalPages: number;
}

