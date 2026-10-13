import React from "react";
import { WEEKLY_QUESTS, RequestItem } from "@/data/battlePassQuestData";
import { CalculationResult } from "../types";

interface WeeklyQuestSectionProps {
  calculation: CalculationResult;
  formatRequest: (request: RequestItem[] | undefined) => string;
}

const bossStyles = [
  { bg: "bg-primary/10", textStrong: "text-primary", point: "text-primary" },
  { bg: "bg-base-200", textStrong: "text-base-content/80", point: "text-primary" },
  { bg: "bg-primary/15", textStrong: "text-primary", point: "text-primary" },
];

export default function WeeklyQuestSection({
  calculation,
  formatRequest,
}: WeeklyQuestSectionProps) {
  return (
    <div className="card border border-base-300 bg-base-100 text-base-content shadow-md">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-base-content sm:text-2xl">
          <span className="text-2xl">📊</span> Weekly Quest Summary
        </h2>

        <div className="space-y-4">
          <div className="rounded-xl border-l-4 border-primary bg-base-100 p-4 text-base-content shadow-md">
            <div className="text-xs text-base-content/70 font-semibold mb-3 flex items-center gap-2">
              <span>👑 Boss Hunt</span>
            </div>
            <div className="space-y-3 text-xs">
              {WEEKLY_QUESTS.slice(0, 3).map((quest, index) => {
                const style = bossStyles[index] ?? bossStyles[0];
                return (
                  <div key={quest.name} className={`flex justify-between items-start p-2 ${style.bg} rounded`}>
                    <div>
                      <div className={`font-bold ${style.textStrong}`}>{quest.name}</div>
                      <div className="text-base-content/70">{quest.details?.location}</div>
                      <div className="text-base-content/60 mt-1">{quest.dateRange}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${style.point}`}>{quest.reward} P</div>
                      <div className="text-base-content/70">×{quest.details?.quantity || 1}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-primary bg-base-100 p-4 text-base-content shadow-md">
            <div className="text-xs text-base-content/70 font-semibold mb-3 flex items-center gap-2">
              <span>💸 Submission Quest</span>
            </div>
            <div className="rounded bg-primary/10 p-2">
              {WEEKLY_QUESTS[3] && (
                <>
                  <div className="font-bold text-primary">{WEEKLY_QUESTS[3].name}</div>
                  <div className="text-base-content/70 mt-1">{formatRequest(WEEKLY_QUESTS[3].request)}</div>
                  <div className="text-base-content/60 mt-1">{WEEKLY_QUESTS[3].dateRange}</div>
                  <div className="text-right mt-2">
                    <div className="font-bold text-primary">{WEEKLY_QUESTS[3].reward} P</div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="rounded-xl border-l-4 border-primary bg-base-100 p-4 text-base-content shadow-md">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs text-base-content/70 font-semibold mb-1">ทำ Weekly ครบ ได้แต้ม</div>
                <div className="text-2xl font-bold text-primary sm:text-3xl">{calculation.weeklyPoints}</div>
              </div>
              <div className="text-4xl">⭐</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
