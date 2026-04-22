import { VIP, PaginationParams, PaginatedResponse } from "@/types/vip";
import { vipDatabase } from "@/data/vipDatabase";

/**
 * ค้นหา VIP ตามคำค้นหา
 */
export function searchVIPByQuery(query: string): VIP[] {
  if (!query.trim()) return vipDatabase;

  const lowerQuery = query.toLowerCase();
  return vipDatabase.filter((vip) =>
    vip.code.toLowerCase().includes(lowerQuery) ||
    vip.fullName.toLowerCase().includes(lowerQuery) ||
    vip.facebookName.toLowerCase().includes(lowerQuery) ||
    vip.phoneNumber.includes(lowerQuery)
  );
}

/**
 * ได้รับ VIP พร้อม Pagination
 */
export function getVIPWithPagination(
  params: PaginationParams
): PaginatedResponse<VIP> {
  const { page = 1, pageSize = 10, search = "" } = params;

  // ค้นหา VIP ตามคำค้นหา
  const filteredVIPs = searchVIPByQuery(search);

  // คำนวณ pagination
  const total = filteredVIPs.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const data = filteredVIPs.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * ได้รับ VIP ทั้งหมดโดยไม่มี Pagination (ใช้เมื่อต้องการข้อมูลทั้งหมด)
 */
export function getAllVIP(search?: string): VIP[] {
  if (!search) return vipDatabase;
  return searchVIPByQuery(search);
}
