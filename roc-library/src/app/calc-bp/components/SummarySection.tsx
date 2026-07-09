import React from "react";
import { CalculationResult } from "../types";

interface SummarySectionProps {
  calculation: CalculationResult;
  formatNumber: (num: number | string) => string;
}

export default function SummarySection({
  calculation,
  formatNumber,
}: SummarySectionProps) {
  return (
    <div className="card border border-emerald-200/80 bg-linear-to-br from-emerald-50/95 via-teal-50/95 to-emerald-100/95 shadow-2xl shadow-emerald-200/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-emerald-900 sm:text-2xl">
          <span className="text-2xl">🎯</span> สรุปทั้งสัปดาห์
        </h2>

        <div className="space-y-4">
          <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-md text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold mb-1">ได้แต้มรวม</div>
                <div className="text-3xl sm:text-4xl font-bold">
                  {formatNumber(calculation.weeklyTotalNormalPoints.toString())}
                </div>
              </div>
              <div className="text-5xl">⭐</div>
            </div>
          </div>

          <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-md text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm font-semibold mb-1">จ่ายเงิน Zeny</div>
                <div className="text-3xl sm:text-4xl font-bold">
                  {formatNumber(calculation.weeklyZenyCost.toString())}
                </div>
              </div>
              <div className="text-5xl">💸</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
