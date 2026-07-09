import React from "react";
import { DaysNeededData } from "../types";

interface LevelCalcSectionProps {
  totalPoints: number;
  currentLevel: number;
  targetLevel: number;
  setTargetLevel: React.Dispatch<React.SetStateAction<number>>;
  setTotalPoints: React.Dispatch<React.SetStateAction<number>>;
  isPremiumOpened: boolean;
  setIsPremiumOpened: React.Dispatch<React.SetStateAction<boolean>>;
  daysNeededData: DaysNeededData;
  currentDailyPoints: number;
  dailyPremiumTotal: number;
  dailyNormalTotal: number;
  weeklyTotal: number;
  formatNumber: (num: number | string) => string;
}

export default function LevelCalcSection({
  totalPoints,
  currentLevel,
  targetLevel,
  setTargetLevel,
  setTotalPoints,
  isPremiumOpened,
  setIsPremiumOpened,
  daysNeededData,
  currentDailyPoints,
  dailyPremiumTotal,
  dailyNormalTotal,
  weeklyTotal,
  formatNumber,
}: LevelCalcSectionProps) {
  return (
    <>
      <div className="flex items-center gap-4">
        <div className="h-px flex-1 bg-linear-to-r from-emerald-200/20 via-emerald-400/70 to-emerald-200/20"></div>
        <span className="rounded-full border border-emerald-300/60 bg-emerald-100/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-emerald-700">Level Calculator</span>
        <div className="h-px flex-1 bg-linear-to-l from-emerald-200/20 via-emerald-400/70 to-emerald-200/20"></div>
      </div>

      <div className="card w-full border border-cyan-200/80 bg-linear-to-br from-cyan-50/95 via-sky-50/95 to-cyan-100/95 shadow-2xl shadow-cyan-200/40 backdrop-blur-sm">
        <div className="card-body p-4 sm:p-6 lg:p-7">
          <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-cyan-900 sm:text-2xl">
            <span className="text-2xl">🎯</span> Level Calculator
          </h2>

          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-3">
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-gray-700">แต้มปัจจุบัน (รวม)</span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-gray-500 text-xs">กรอกแต้มปัจจุบัน</span>
                </label>
              </div>
              <input
                type="text"
                value={totalPoints}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setTotalPoints(value ? parseInt(value, 10) : 0);
                }}
                placeholder="0"
                className="input input-bordered input-lg w-full bg-white focus:input-primary border-indigo-300 text-3xl sm:text-4xl font-bold text-center text-indigo-600"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-emerald-500">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-gray-700">Level ปัจจุบัน</span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-gray-500 text-xs">คำนวณจากแต้มปัจจุบันอัตโนมัติ</span>
                </label>
              </div>
              <input
                type="text"
                value={currentLevel}
                readOnly
                className="input input-bordered input-lg w-full cursor-default border-emerald-300 bg-emerald-50 text-center text-3xl font-bold text-emerald-700 sm:text-4xl"
              />
            </div>

            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-gray-700">Level ที่อยากได้</span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-gray-500 text-xs">กรอก Level ที่ต้องการ</span>
                </label>
              </div>
              <input
                type="text"
                value={targetLevel}
                onChange={(e) => setTargetLevel(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="0"
                className="input input-bordered input-lg w-full bg-white focus:input-primary border-blue-300 text-3xl sm:text-4xl font-bold text-center text-blue-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-500 mb-6">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={isPremiumOpened}
                onChange={(e) => setIsPremiumOpened(e.target.checked)}
                className="checkbox checkbox-accent"
              />
              <span className="label-text ml-3 font-bold text-gray-700">
                {isPremiumOpened ? "💛 Premium Pass (เปิดอยู่)" : "⚪ Normal Pass"}
              </span>
              <span
                className="badge badge-lg ml-auto"
                style={{ backgroundColor: isPremiumOpened ? "#FFD700" : "#D1D5DB" }}
              >
                {isPremiumOpened ? "+10 P/วัน" : "Normal"}
              </span>
            </label>
          </div>

          {targetLevel > 0 && (
            <>
              {targetLevel > currentLevel && (
                <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300 shadow-md text-center">
                  <div className="text-sm font-bold text-purple-900">
                    🌿 ใช้มะละกอเพิ่มเติม <span className="text-3xl text-purple-600">{(targetLevel - currentLevel) * 3}</span> เม็ด หรือ Silvervine Box <span className="text-3xl text-purple-600">{Math.ceil(((targetLevel - currentLevel) * 3) / 10)}</span> กล่อง
                  </div>
                </div>
              )}

              {targetLevel <= currentLevel && targetLevel > 0 && (
                <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300 shadow-md text-center">
                  <div className="text-sm font-bold text-green-700">✅ คุณมี Level {currentLevel} ครบแล้ว ไม่ต้องใช้มะละกอเพิ่มเติม</div>
                </div>
              )}
            </>
          )}

          {targetLevel > 0 && (
            <div className="bg-linear-to-r from-cyan-100 to-blue-100 rounded-xl p-6 border-2 border-cyan-300 space-y-4">
              {daysNeededData.isAlreadyReached ? (
                <div className="bg-white rounded-lg p-4 text-center border-l-4 border-green-500 shadow-md">
                  <div className="text-xl font-bold text-green-600">✅ คุณมี Level {currentLevel} ครบแล้ว!</div>
                </div>
              ) : (
                <>
                  <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-500">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">ต้องใช้เวลา (วัน)</div>
                        <div className="text-3xl font-bold text-orange-600">{daysNeededData.daysNeeded}</div>
                        <div className="text-xs text-gray-500">วัน</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">ต้องใช้เวลา (สัปดาห์)</div>
                        <div className="text-3xl font-bold text-orange-600">{daysNeededData.weeksNeeded}</div>
                        <div className="text-xs text-gray-500">สัปดาห์</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">แต้มที่ต้องเพิ่ม</div>
                        <div className="text-3xl font-bold text-blue-600">{formatNumber(daysNeededData.pointsNeeded.toString())}</div>
                        <div className="text-xs text-gray-500">Point</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">Point/วัน</div>
                        <div className="text-3xl font-bold text-green-600">{currentDailyPoints}</div>
                        <div className="text-xs text-gray-500">P/วัน</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
                    {(() => {
                      const sumDaily = daysNeededData.daysNeeded * currentDailyPoints;
                      return (
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-xs font-bold text-purple-700">📋 Quest ที่ต้องทำ ({daysNeededData.daysNeeded} วัน):</div>
                          <div className="text-sm font-bold text-purple-600">{formatNumber(sumDaily.toString())} P</div>
                        </div>
                      );
                    })()}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-blue-600 rounded text-white font-bold">
                        <span>📅 Daily Quest</span>
                        <span>
                          {isPremiumOpened ? dailyPremiumTotal : dailyNormalTotal} P × {daysNeededData.daysNeeded} = {(isPremiumOpened ? dailyPremiumTotal : dailyNormalTotal) * daysNeededData.daysNeeded}
                        </span>
                      </div>

                      {daysNeededData.weeksNeeded > 0 && (
                        <div className="flex justify-between items-center p-2 bg-purple-600 rounded text-white font-bold">
                          <span>📊 Weekly Quest</span>
                          <span>
                            {weeklyTotal} P × {daysNeededData.weeksNeeded} = {weeklyTotal * daysNeededData.weeksNeeded}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-linear-to-r from-yellow-100 to-amber-100 rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-900">💸 เสียเงิน Zeny ทั้งสิ้น:</span>
                      <span className="text-3xl font-bold text-yellow-700">
                        {formatNumber((1000000 * daysNeededData.daysNeeded + 2000000 * daysNeededData.weeksNeeded).toString())} Zeny
                      </span>
                    </div>
                    <div className="text-xs text-yellow-700">
                      <div>
                        Daily Zeny: 1,000,000 × {daysNeededData.daysNeeded} = {formatNumber((1000000 * daysNeededData.daysNeeded).toString())} Zeny
                      </div>
                      <div>
                        Weekly Zeny: 2,000,000 × {daysNeededData.weeksNeeded} = {formatNumber((2000000 * daysNeededData.weeksNeeded).toString())} Zeny
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-accent">
                    <label className="label cursor-pointer">
                      <span className="label-text font-bold text-gray-700">
                        {isPremiumOpened ? "💛 Premium Account (เปิดอยู่)" : "⚪ Normal Account"}
                      </span>
                      <div className="badge badge-lg" style={{ backgroundColor: isPremiumOpened ? "#FFD700" : "#D1D5DB" }}>
                        {isPremiumOpened ? "+10 P/วัน" : "Normal"}
                      </div>
                    </label>
                  </div>

                  <div className="bg-white rounded-lg p-4 text-center border-l-4 border-cyan-500 shadow-md">
                    <div className="text-sm font-bold text-cyan-700 space-y-1">
                      <div>
                        ต้องการ Level {targetLevel} จากปัจจุบัน Level {currentLevel}
                      </div>
                      <div className="text-blue-600 mt-2 text-base">
                        ✓ ต้องทำ {daysNeededData.daysNeeded} วัน ({daysNeededData.weeksNeeded} สัปดาห์) เสีย {formatNumber((1000000 * daysNeededData.daysNeeded + 2000000 * daysNeededData.weeksNeeded).toString())} Zeny
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {targetLevel === 0 && (
            <div className="bg-gray-100 rounded-xl p-4 text-center border border-gray-300">
              <div className="text-sm text-gray-600">กรอกระดับที่ต้องการเพื่อดูผลการคำนวน</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
