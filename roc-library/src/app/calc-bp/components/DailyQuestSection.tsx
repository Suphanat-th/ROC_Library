import React from "react";
import { DAILY_QUESTS, PREMIUM_DAILY_ROTATION, RequestItem } from "@/data/battlePassQuestData";

interface DailyQuestSectionProps {
  isPremiumOpened: boolean;
  formatRequest: (request: RequestItem[] | undefined) => string;
}

export default function DailyQuestSection({
  isPremiumOpened,
  formatRequest,
}: DailyQuestSectionProps) {
  return (
    <div className="card border border-blue-200/80 bg-linear-to-br from-blue-50/95 via-cyan-50/95 to-blue-100/95 shadow-2xl shadow-blue-200/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-blue-900 sm:text-2xl">
          <span className="text-2xl">📅</span> Daily Quest
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs text-gray-600 font-semibold mb-2">🐉 Monster Hunt</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {isPremiumOpened ? PREMIUM_DAILY_ROTATION[0].reward : DAILY_QUESTS[0].reward}
                </div>
                <div className="text-xs text-gray-500">Point</div>
              </div>
              <div className="text-4xl">⚔️</div>
            </div>
            <div className="text-xs space-y-2 bg-blue-50 rounded p-3">
              {isPremiumOpened ? (
                <>
                  {PREMIUM_DAILY_ROTATION.map((quest) => (
                    <div key={quest.dateRange} className="flex justify-between">
                      <span>{formatRequest(quest.request)}</span>
                      <span className="text-blue-600 font-bold">{quest.dateRange}</span>
                    </div>
                  ))}
                </>
              ) : (
                <div className="flex justify-between">
                  <span>{formatRequest(DAILY_QUESTS[0].request)}</span>
                  <span className="text-blue-600 font-bold">{DAILY_QUESTS[0].dateRange}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-xs text-gray-600 font-semibold mb-2">💰 {DAILY_QUESTS[1].name}</div>
                <div className="text-2xl sm:text-3xl font-bold text-green-600">{DAILY_QUESTS[1].reward}</div>
                <div className="text-xs text-gray-500">Point</div>
              </div>
              <div className="text-4xl">💸</div>
            </div>
            <div className="text-xs text-gray-600 bg-green-50 rounded p-3">
              <div>{formatRequest(DAILY_QUESTS[1].request)}</div>
              <div className="text-green-600 font-semibold mt-2">{DAILY_QUESTS[1].dateRange}</div>
            </div>
          </div>
        </div>

        <div className="bg-linear-to-r from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="text-center">
            <div className="text-xs text-blue-900 font-semibold mb-2">รวม Daily ต่อวัน</div>
            <div className="flex justify-center gap-4 items-center">
              <div>
                <div className="text-sm text-gray-700 font-medium mb-1">
                  สังหาร: {isPremiumOpened ? PREMIUM_DAILY_ROTATION[0].reward : DAILY_QUESTS[0].reward} Point
                </div>
              </div>
              <div className="text-gray-400">+</div>
              <div>
                <div className="text-sm text-gray-700 font-medium mb-1">ส่งเงิน: {DAILY_QUESTS[1].reward} Point</div>
              </div>
              <div className="text-lg font-bold text-blue-600">=</div>
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {isPremiumOpened
                    ? PREMIUM_DAILY_ROTATION[0].reward + DAILY_QUESTS[1].reward
                    : DAILY_QUESTS[0].reward + DAILY_QUESTS[1].reward}
                </div>
                <div className="text-xs text-gray-600">Point</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
