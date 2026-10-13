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
    <div className="card border border-base-300 bg-base-100 text-base-content shadow-md">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-base-content sm:text-2xl">
          <span className="text-2xl">🎯</span> สรุปทั้งสัปดาห์
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl bg-primary p-4 text-primary-content shadow-md">
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

          <div className="rounded-xl bg-accent p-4 text-accent-content shadow-md">
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
