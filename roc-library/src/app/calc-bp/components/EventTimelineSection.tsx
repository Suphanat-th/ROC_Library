import React from "react";
import { WalletCards } from "lucide-react";
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
    <div className="card w-full border border-base-300 bg-base-100 text-base-content shadow-md">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-2xl font-black tracking-tight text-base-content sm:text-3xl">
          <span className="text-3xl">📅</span> Event Timeline
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl border-l-4 border-primary bg-base-100 p-5 text-base-content shadow-md">
            <div className="text-xs text-base-content/70 font-semibold mb-2 uppercase tracking-wide">
              เริ่มวันที่
            </div>
            <div className="mb-1 text-3xl font-bold text-primary sm:text-4xl">
              {SEASON_CONFIG.eventStartDate.getDate()}
            </div>
            <div className="text-sm text-base-content/80 font-semibold">
              {SEASON_CONFIG.eventStartDate.toLocaleDateString("en-GB", {
                month: "long",
              })}{" "}
              {SEASON_CONFIG.eventStartDate.getFullYear()}
            </div>
            <div className="text-xs text-base-content/60 mt-1">
              เวลา {SEASON_CONFIG.eventStartDate.getHours().toString().padStart(2, "0")}
              :{SEASON_CONFIG.eventStartDate.getMinutes().toString().padStart(2, "0")} น.
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-primary bg-base-100 p-5 text-base-content shadow-md">
            <div className="text-xs text-base-content/70 font-semibold mb-2 uppercase tracking-wide">
              จบวันที่
            </div>
            <div className="mb-1 text-3xl font-bold text-primary sm:text-4xl">
              {SEASON_CONFIG.eventEndDate.getDate()}
            </div>
            <div className="text-sm text-base-content/80 font-semibold">
              {SEASON_CONFIG.eventEndDate.toLocaleDateString("en-GB", {
                month: "long",
              })}{" "}
              {SEASON_CONFIG.eventEndDate.getFullYear()}
            </div>
            <div className="text-xs text-base-content/60 mt-1">
              เวลา {SEASON_CONFIG.eventEndDate.getHours().toString().padStart(2, "0")}
              :{SEASON_CONFIG.eventEndDate.getMinutes().toString().padStart(2, "0")} น.
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-primary p-5 text-primary-content shadow-md">
            <div className="text-xs font-semibold mb-3 opacity-90 uppercase tracking-wide">
              เหลือเวลา (วัน) <span className="font-bold"> *** ไม่รวมวันสุดท้าย</span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl sm:text-5xl font-bold">{calculation.daysRemaining}</div>
              <div className="text-lg font-semibold">วัน</div>
            </div>
          </div>

          <div className="rounded-xl bg-secondary p-5 text-secondary-content shadow-md">
            <div className="text-xs font-semibold mb-3 opacity-90 uppercase tracking-wide">
              เหลือเวลา (อาทิตย์)
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-4xl sm:text-5xl font-bold">{calculation.weeksRemaining}</div>
              <div className="text-lg font-semibold">สัปดาห์</div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border-2 border-base-300 bg-base-200 p-6 text-base-content shadow-md">
          <div className="space-y-4 text-base-content/80">
            <div className="font-bold flex items-center gap-2 text-lg sm:text-xl">
              <WalletCards aria-hidden="true" className="h-6 w-6" /> ทรัพยากรณ์ตามระยะเวลาที่เหลือ
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 text-sm sm:text-base">
              <div className="rounded-lg border border-primary/20 bg-base-100 p-4">
                <div className="mb-2 font-semibold text-primary">💵 Zeny ที่ต้องใช้</div>
                {resourcesNeeded.totalZeny > 0 ? (
                  <div className="text-lg font-bold text-primary">
                    {(resourcesNeeded.totalZeny / 1_000_000).toLocaleString("th-TH", {
                      maximumFractionDigits: 0,
                    })}{" "}
                    M Zeny
                  </div>
                ) : (
                  <div className="text-base-content/60 italic">ไม่มี</div>
                )}
              </div>

              <div className="rounded-lg border border-primary/20 bg-base-100 p-4">
                <div className="mb-2 font-semibold text-primary">📦 Item ที่ต้องใช้</div>
                {Object.keys(resourcesNeeded.items).length > 0 ? (
                  <div className="space-y-1 font-bold text-primary">
                    {Object.entries(resourcesNeeded.items).map(([item, quantity]) => (
                      <div key={item} className="text-sm">
                        • {quantity}x {item}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-base-content/60 italic">ไม่มี</div>
                )}
              </div>
            </div>

            {resourcesNeeded.totalZeny === 0 && Object.keys(resourcesNeeded.items).length === 0 && (
              <div className="text-center text-base-content/70 italic ml-6">ไม่มีการเลือก Quest</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
