export interface VIP {
  id: number;
  code: string; // รหัส VIP
  fullName: string; // ชื่อ - นามสกุล
  facebookName: string; // ชื่อ Facebook
  facebookUrl: string; // Link Facebook
  phoneNumber: string; // เบอร์โทรศัพท์
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
