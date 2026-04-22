'use client';

import React from 'react';
import VIPSearch from './VIPSearch';

export default function VIPSearchPage() {
  return (
    <div className="w-full h-full flex flex-col bg-gray-100 p-4">
      {/* Header Card */}
      <div className="card bg-white shadow-lg mb-4 border border-gray-200">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold text-gray-900">
            👥 VIP Search
          </h1>
          <p className="text-gray-600 text-base">ค้นหาข้อมูล VIP ของกลุ่ม</p>
        </div>
      </div>

      {/* Content */}
      <div className="card bg-white shadow-lg flex-1">
        <div className="card-body">
          <VIPSearch />
        </div>
      </div>
    </div>
  );
}
