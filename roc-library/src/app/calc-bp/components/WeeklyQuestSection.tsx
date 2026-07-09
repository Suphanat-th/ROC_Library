import React from "react";
import { WEEKLY_QUESTS, RequestItem } from "@/data/battlePassQuestData";
import { CalculationResult } from "../types";

interface WeeklyQuestSectionProps {
  calculation: CalculationResult;
  formatRequest: (request: RequestItem[] | undefined) => string;
}

const bossStyles = [
  { bg: "bg-red-50", textStrong: "text-red-700", point: "text-red-600" },
  { bg: "bg-orange-50", textStrong: "text-orange-700", point: "text-orange-600" },
  { bg: "bg-purple-50", textStrong: "text-purple-700", point: "text-purple-600" },
];

export default function WeeklyQuestSection({
  calculation,
  formatRequest,
}: WeeklyQuestSectionProps) {
  return (
    <div className="card border border-purple-200/80 bg-linear-to-br from-purple-50/95 via-fuchsia-50/95 to-purple-100/95 shadow-2xl shadow-purple-200/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-purple-900 sm:text-2xl">
          <span className="text-2xl">📊</span> Weekly Quest Summary
        </h2>

        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
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

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-cyan-500">
            <div className="text-xs text-gray-600 font-semibold mb-3 flex items-center gap-2">
              <span>💸 Submission Quest</span>
            </div>
            <div className="p-2 bg-cyan-50 rounded">
              {WEEKLY_QUESTS[3] && (
                <>
                  <div className="font-bold text-cyan-700">{WEEKLY_QUESTS[3].name}</div>
                  <div className="text-gray-600 mt-1">{formatRequest(WEEKLY_QUESTS[3].request)}</div>
                  <div className="text-gray-500 mt-1">{WEEKLY_QUESTS[3].dateRange}</div>
                  <div className="text-right mt-2">
                    <div className="font-bold text-cyan-600">{WEEKLY_QUESTS[3].reward} P</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-600 font-semibold mb-1">ทำ Weekly ครบ ได้แต้ม</div>
                <div className="text-2xl sm:text-3xl font-bold text-purple-600">{calculation.weeklyPoints}</div>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
