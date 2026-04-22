"use client";

import React, { useState, useEffect } from "react";
import { VIP, PaginatedResponse } from "@/types/vip";

export default function VIPSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [results, setResults] = useState<PaginatedResponse<VIP> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch VIP data
  useEffect(() => {
    const fetchVIPData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          pageSize: pageSize.toString(),
          search: searchQuery,
        });

        const response = await fetch(`/api/vip?${params}`);
        if (!response.ok) throw new Error("Failed to fetch VIP data");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchVIPData();
  }, [searchQuery, currentPage, pageSize]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to page 1 when searching
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (results?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="ค้นหา VIP (รหัส / ชื่อ / Facebook / เบอร์โทร)..."
          className="input input-bordered w-full"
          value={searchQuery}
          onChange={handleSearch}
          disabled={loading}
        />
      </div>

      {/* Results Summary */}
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {loading ? (
            <span>กำลังโหลด...</span>
          ) : (
            <span>
              พบ {results?.total || 0} VIP (หน้า {currentPage} จาก {results?.totalPages || 1})
            </span>
          )}
        </div>
        <select
          className="select select-bordered select-sm"
          value={pageSize}
          onChange={(e) => {
            setPageSize(parseInt(e.target.value));
            setCurrentPage(1);
          }}
          disabled={loading}
        >
          <option value={10}>10 รายต่อหน้า</option>
          <option value={25}>25 รายต่อหน้า</option>
          <option value={50}>50 รายต่อหน้า</option>
        </select>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* VIP Table */}
      {results && results.data.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <table className="table table-zebra bg-white">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="font-bold">รหัส</th>
                  <th className="font-bold">ชื่อ - นามสกุล</th>
                  <th className="font-bold">ชื่อ Facebook</th>
                  <th className="font-bold">Link Facebook</th>
                  <th className="font-bold">เบอร์โทรศัพท์</th>
                </tr>
              </thead>
              <tbody>
                {results.data.map((vip) => (
                  <tr key={vip.id} className="hover:bg-blue-50">
                    <td className="font-semibold text-blue-600">{vip.code}</td>
                    <td className="font-medium">{vip.fullName}</td>
                    <td className="text-sm">{vip.facebookName}</td>
                    <td>
                      <a
                        href={vip.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-primary"
                      >
                        👤 Facebook
                      </a>
                    </td>
                    <td className="text-sm">{vip.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {results.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                className="btn btn-sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                ← ก่อนหน้า
              </button>

              <div className="flex gap-1">
                {Array.from({ length: results.totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`btn btn-sm ${
                        currentPage === page ? "btn-active" : ""
                      }`}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className="btn btn-sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === results.totalPages || loading}
              >
                ถัดไป →
              </button>
            </div>
          )}
        </div>
      ) : !loading ? (
        <div className="alert alert-info">
          <span>
            {searchQuery
              ? `ไม่พบผลการค้นหา "${searchQuery}"`
              : "ไม่มีข้อมูล VIP"}
          </span>
        </div>
      ) : null}
    </div>
  );
}
