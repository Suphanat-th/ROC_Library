import React from "react";
import Image from "next/image";
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
    <div className="card border border-blue-900/80 bg-linear-to-br from-slate-950 via-slate-900 to-blue-950 text-white shadow-2xl shadow-slate-950/40 backdrop-blur-sm">
      <div className="card-body p-4 sm:p-6 lg:p-7">
        <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
          <span className="text-2xl">📅</span> Daily Quest
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-4 text-slate-900 shadow-md">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50">
                <Image
                  src="/assets/images/Events/monsterx3.png"
                  alt="Monster Hunt"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold text-gray-600">Monster Hunt</div>
                <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                  {isPremiumOpened ? PREMIUM_DAILY_ROTATION[0].reward : DAILY_QUESTS[0].reward}
                </div>
                <div className="text-xs text-gray-500">Point</div>
              </div>
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

          <div className="relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-white p-4 text-slate-900 shadow-md">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50">
                <Image
                  src="/assets/images/horrortoyfactory/treasure.gif"
                  alt="Send Zeny"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="mb-2 text-xs font-semibold text-gray-600">{DAILY_QUESTS[1].name}</div>
                <div className="text-2xl font-bold text-blue-600 sm:text-3xl">{DAILY_QUESTS[1].reward}</div>
                <div className="text-xs text-gray-500">Point</div>
              </div>
            </div>
            <div className="rounded bg-blue-50 p-3 text-xs text-gray-600">
              <div>{formatRequest(DAILY_QUESTS[1].request)}</div>
              <div className="mt-2 font-semibold text-blue-600">{DAILY_QUESTS[1].dateRange}</div>
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
