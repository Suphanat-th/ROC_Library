'use client';

import React from 'react';
import VIPSearch from './VIPSearch';

export default function VIPSearchPage() {
  return (
    <div className="w-full h-full flex flex-col bg-base-200 p-4">
      {/* Header Card */}
      <div className="card bg-base-100 shadow-lg mb-4 border border-base-300">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold text-base-content">
            👥 VIP Search
          </h1>
          <p className="text-base-content/70 text-base">ค้นหาข้อมูล VIP ของกลุ่ม</p>
        </div>
      </div>

      {/* Content */}
      <div className="card bg-base-100 shadow-lg flex-1">
        <div className="card-body">
          <VIPSearch />
        </div>
      </div>
    </div>
  );
}
