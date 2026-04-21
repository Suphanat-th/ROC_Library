'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the map component with SSR disabled
const FacewormNestMap = dynamic(() => import('./FacewormNestMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    </div>
  ),
});

export default function FacewormNestGuidePage() {

  return (
    <div className="w-full h-full flex flex-col bg-gray-100 p-4">
      {/* Header Card */}
      <div className="card bg-white shadow-lg mb-4 border border-gray-200">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold text-gray-900">
            🗺️ Faceworm Nest Guide
          </h1>
          <p className="text-gray-600 text-base">Interactive map with boss & mini-boss locations</p>
          <p className="text-gray-500 text-sm mt-3 italic">*ขอบคุณข้อมูลจาก Peet ROC</p>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 rounded-lg overflow-hidden shadow-lg bg-gray-200">
        <FacewormNestMap />
      </div>
    </div>
  );
}
