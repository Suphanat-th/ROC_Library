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
    <div className="card border border-blue-900/80 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
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

          <div className="rounded-xl bg-linear-to-r from-blue-600 to-blue-800 p-4 text-white shadow-md">
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
