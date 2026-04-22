'use client';

import React from 'react';
import CalcBPComponent from './CalcBPComponent';

export default function CalcBPPage() {
  return (
    <div className="w-full h-full flex flex-col bg-gray-50 p-4">
      {/* Header Card */}
      <div className="card bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl mb-6 text-white">
        <div className="card-body">
          <h1 className="card-title text-4xl font-bold">
            ⚔️ Battle Pass Calculator
          </h1>
          <p className="text-blue-100 text-lg">Sarah and Fenrir Season 5</p>
          <p className="text-blue-100 text-sm mt-2">
            Calculate your Battle Pass rewards, daily/weekly points, and Zeny costs
          </p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="alert alert-info shadow-lg mb-6 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h3 className="font-bold text-blue-900">Battle Pass Season 5 Information</h3>
            <div className="text-sm text-blue-800 mt-2">
              <p>• Event starts: <strong>April 22, 2026</strong></p>
              <p>• Event ends: <strong>June 24, 2026</strong></p>
              <p>• Get Battle Pass Invitation through Rodex (1 per account)</p>
              <p>• Talk to NPC Merde (Prontera 147, 301) to start Battle Pass</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <CalcBPComponent />
      </div>
    </div>
  );
}
