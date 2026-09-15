import React from "react";
import { WEEKLY_QUESTS, RequestItem } from "@/data/battlePassQuestData";
import { CalculationResult } from "../types";

interface WeeklyQuestSectionProps {
  calculation: CalculationResult;
  formatRequest: (request: RequestItem[] | undefined) => string;
}

const bossStyles = [
  { bg: "bg-blue-50", textStrong: "text-blue-700", point: "text-blue-600" },
  { bg: "bg-slate-100", textStrong: "text-slate-700", point: "text-blue-600" },
  { bg: "bg-blue-100", textStrong: "text-blue-800", point: "text-blue-700" },
];

export default function WeeklyQuestSection({
  calculation,
  formatRequest,
}: WeeklyQuestSectionProps) {
  return (
    <div className="card border border-blue-900/80 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
          <span className="text-2xl">📊</span> Weekly Quest Summary
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-4 text-slate-900 shadow-md">
            <div className="text-xs text-gray-600 font-semibold mb-3 flex items-center gap-2">
              <span>👑 Boss Hunt</span>
            </div>
            <div className="space-y-3 text-xs">
              {WEEKLY_QUESTS.slice(0, 3).map((quest, index) => {
                const style = bossStyles[index] ?? bossStyles[0];
                return (
                  <div key={quest.name} className={`flex justify-between items-start p-2 ${style.bg} rounded`}>
                    <div>
                      <div className={`font-bold ${style.textStrong}`}>{quest.name}</div>
                      <div className="text-gray-600">{quest.details?.location}</div>
                      <div className="text-gray-500 mt-1">{quest.dateRange}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${style.point}`}>{quest.reward} P</div>
                      <div className="text-gray-600">×{quest.details?.quantity || 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-4 text-slate-900 shadow-md">
            <div className="text-xs text-gray-600 font-semibold mb-3 flex items-center gap-2">
              <span>💸 Submission Quest</span>
            </div>
            <div className="rounded bg-blue-50 p-2">
              {WEEKLY_QUESTS[3] && (
                <>
                  <div className="font-bold text-blue-700">{WEEKLY_QUESTS[3].name}</div>
                  <div className="text-gray-600 mt-1">{formatRequest(WEEKLY_QUESTS[3].request)}</div>
                  <div className="text-gray-500 mt-1">{WEEKLY_QUESTS[3].dateRange}</div>
                  <div className="text-right mt-2">
                    <div className="font-bold text-blue-600">{WEEKLY_QUESTS[3].reward} P</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-4 text-slate-900 shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-600 font-semibold mb-1">ทำ Weekly ครบ ได้แต้ม</div>
                <div className="text-2xl font-bold text-blue-600 sm:text-3xl">{calculation.weeklyPoints}</div>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
