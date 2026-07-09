import React from "react";
import { SEASON_CONFIG } from "@/data/battlePassQuestData";
import { CalculationResult, ResourcesNeeded } from "../types";

interface EventTimelineSectionProps {
  calculation: CalculationResult;
  resourcesNeeded: ResourcesNeeded;
}

export default function EventTimelineSection({
  calculation,
  resourcesNeeded,
}: EventTimelineSectionProps) {
  return (
    <div className="card w-full border border-orange-200/80 bg-linear-to-br from-orange-50/95 via-amber-50/95 to-orange-100/95 shadow-2xl shadow-orange-200/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-2xl font-black tracking-tight text-orange-900 sm:text-3xl">
          <span className="text-3xl">📅</span> Event Timeline
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
            <div className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">
              เริ่มวันที่
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
              {SEASON_CONFIG.eventStartDate.getDate()}
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              {SEASON_CONFIG.eventStartDate.toLocaleDateString("en-GB", {
                month: "long",
              })}{" "}
              {SEASON_CONFIG.eventStartDate.getFullYear()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              เวลา {SEASON_CONFIG.eventStartDate.getHours().toString().padStart(2, "0")}
              :{SEASON_CONFIG.eventStartDate.getMinutes().toString().padStart(2, "0")} น.
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500">
            <div className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">
              จบวันที่
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
              {SEASON_CONFIG.eventEndDate.getDate()}
            </div>
            <div className="text-sm text-gray-700 font-semibold">
              {SEASON_CONFIG.eventEndDate.toLocaleDateString("en-GB", {
                month: "long",
              })}{" "}
              {SEASON_CONFIG.eventEndDate.getFullYear()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              เวลา {SEASON_CONFIG.eventEndDate.getHours().toString().padStart(2, "0")}
              :{SEASON_CONFIG.eventEndDate.getMinutes().toString().padStart(2, "0")} น.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow-md text-white">
            <div className="text-xs font-semibold mb-3 opacity-90 uppercase tracking-wide">
              เหลือเวลา (วัน)
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl sm:text-5xl font-bold">{calculation.daysRemaining}</div>
              <div className="text-lg font-semibold">วัน</div>
            </div>
          </div>

          <div className="bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl p-5 shadow-md text-white">
            <div className="text-xs font-semibold mb-3 opacity-90 uppercase tracking-wide">
              เหลือเวลา (อาทิตย์)
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl sm:text-5xl font-bold">{calculation.weeksRemaining}</div>
              <div className="text-lg font-semibold">สัปดาห์</div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-2 border-green-400 shadow-md">
          <div className="space-y-4 text-green-900">
            <div className="font-bold flex items-center gap-2 text-lg sm:text-xl">
              <span>💰</span> ทรัพยากรณ์ตามระยะยเวลาที่เหลือ
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 text-sm sm:text-base">
              <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-green-300">
                <div className="font-semibold text-green-800 mb-2">💵 Zeny ที่ต้องใช้</div>
                {resourcesNeeded.totalZeny > 0 ? (
                  <div className="text-green-700 font-bold text-lg">
                    {(resourcesNeeded.totalZeny / 1_000_000).toLocaleString("th-TH", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    M Zeny
                  </div>
                ) : (
                  <div className="text-gray-500 italic">ไม่มี</div>
                )}
              </div>

              <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-green-300">
                <div className="font-semibold text-green-800 mb-2">📦 Item ที่ต้องใช้</div>
                {Object.keys(resourcesNeeded.items).length > 0 ? (
                  <div className="text-green-700 font-bold space-y-1">
                    {Object.entries(resourcesNeeded.items).map(([item, quantity]) => (
                      <div key={item} className="text-sm">
                        • {quantity}x {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 italic">ไม่มี</div>
                )}
              </div>
            </div>

            {resourcesNeeded.totalZeny === 0 && Object.keys(resourcesNeeded.items).length === 0 && (
              <div className="text-center text-gray-600 italic ml-6">ไม่มีการเลือก Quest</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
