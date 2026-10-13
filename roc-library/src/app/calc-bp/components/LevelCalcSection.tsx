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
        <div className="h-px flex-1 bg-base-300"></div>
        <span className="rounded-full border border-primary/30 bg-base-200 px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary">Level Calculator</span>
        <div className="h-px flex-1 bg-base-300"></div>
      </div>

      <div className="card w-full border border-base-300 bg-base-100 text-base-content shadow-md">
        <div className="card-body p-4 sm:p-6 lg:p-7">
          <h2 className="card-title mb-6 flex items-center gap-2 text-xl font-black tracking-tight text-base-content sm:text-2xl">
            <span className="text-2xl">🎯</span> Level Calculator
          </h2>

          <div className="grid grid-cols-1 gap-6 mb-6 sm:grid-cols-3">
            <div className="rounded-xl border-l-4 border-primary bg-base-100 p-6 text-base-content shadow-md">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-base-content/80">แต้มปัจจุบัน (รวม)</span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-base-content/60 text-xs">กรอกแต้มปัจจุบัน</span>
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
                className="input input-bordered input-lg w-full border-primary/40 bg-base-100 text-3xl text-center font-bold text-primary focus:input-primary sm:text-4xl"
              />
            </div>

            <div className="rounded-xl border-l-4 border-primary bg-base-100 p-6 text-base-content shadow-md">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-base-content/80">Level ปัจจุบัน</span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-base-content/60 text-xs">คำนวณจากแต้มปัจจุบันอัตโนมัติ</span>
                </label>
              </div>
              <input
                type="text"
                value={currentLevel}
                readOnly
                className="input input-bordered input-lg w-full cursor-default border-primary/40 bg-primary/10 text-center text-3xl font-bold text-primary sm:text-4xl"
              />
            </div>

            <div className="rounded-xl border-l-4 border-primary bg-base-100 p-6 text-base-content shadow-md">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-base-content/80">Level ที่อยากได้</span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-base-content/60 text-xs">กรอก Level ที่ต้องการ</span>
                </label>
              </div>
              <input
                type="text"
                value={targetLevel}
                onChange={(e) => setTargetLevel(Math.max(0, parseInt(e.target.value, 10) || 0))}
                placeholder="0"
                className="input input-bordered input-lg w-full bg-base-100 focus:input-primary border-primary/40 text-3xl sm:text-4xl font-bold text-center text-primary"
              />
            </div>
          </div>

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <label
              className={`group relative flex min-h-28 cursor-pointer overflow-hidden rounded-2xl border-2 bg-base-200 shadow-sm transition-colors duration-200 hover:shadow-lg ${!isPremiumOpened ? "border-4 border-primary bg-base-100 shadow-xl ring-4 ring-base-300" : "border-base-300 opacity-70 hover:opacity-100"}`}
            >
              <input
                type="radio"
                name="level-account-type"
                checked={!isPremiumOpened}
                onChange={() => setIsPremiumOpened(false)}
                className="pointer-events-none absolute h-px w-px opacity-0"
                tabIndex={-1}
              />
              <span className="flex w-14 shrink-0 items-center justify-center border-r-2 border-dashed border-base-300 bg-base-300 text-2xl text-base-content/80">
                N
              </span>
              <span className="flex flex-1 flex-col justify-center px-4 py-3">
                <span className="text-[15px] font-bold uppercase tracking-[0.18em] text-base-content">
                  Normal Battle Pass
                </span>
                <span className="mt-1 text-xs text-base-content/60">
                  รับแต้ม Daily แบบปกติ
                </span>
                <span className="mt-1 text-xs font-semibold text-error">
                  Level สูงสุดที่ 100
                </span>
              </span>
              <span
                className={`absolute right-3 top-3 h-3 w-3 rounded-full ring-2 ring-base-100 ${!isPremiumOpened ? "bg-primary" : "bg-base-300"}`}
              />
            </label>

            <label
              className={`group relative flex min-h-28 cursor-pointer overflow-hidden rounded-2xl border-2 bg-accent/10 shadow-sm transition-colors duration-200 hover:shadow-lg ${isPremiumOpened ? "border-4 border-accent bg-accent/20 shadow-xl ring-4 ring-accent/30" : "border-accent/40 opacity-70 hover:opacity-100"}`}
            >
              <input
                type="radio"
                name="level-account-type"
                checked={isPremiumOpened}
                onChange={() => setIsPremiumOpened(true)}
                className="pointer-events-none absolute h-px w-px opacity-0"
                tabIndex={-1}
              />
              <span className="flex w-14 shrink-0 items-center justify-center border-r-2 border-dashed border-accent/40 bg-accent/20 text-2xl font-black text-base-content">
                P
              </span>
              <span className="flex flex-1 flex-col justify-center px-4 py-3">
                <span className="text-[15px] font-bold uppercase tracking-[0.18em] text-base-content/80">
                  Premium Pass
                </span>
                <span className="mt-1 text-xs text-base-content/60">
                  ได้เพิ่ม +10 แต้ม/วัน
                </span>
              </span>
              <span
                className={`absolute right-3 top-3 h-3 w-3 rounded-full ring-2 ring-base-100 ${isPremiumOpened ? "bg-accent" : "bg-accent/40"}`}
              />
            </label>
          </div>

          {targetLevel > 0 && (
            <>
              {targetLevel > currentLevel && (
                <div className="rounded-xl border-2 border-primary/40 bg-linear-to-r from-primary/10 to-base-200 p-4 text-center shadow-md">
                  <div className="text-sm font-bold text-primary">
                    🌿 ใช้มะละกอเพิ่มเติม <span className="text-3xl text-primary">{(targetLevel - currentLevel) * 3}</span> เม็ด หรือ Silvervine Box <span className="text-3xl text-primary">{Math.ceil(((targetLevel - currentLevel) * 3) / 10)}</span> กล่อง
                  </div>
                </div>
              )}

              {targetLevel <= currentLevel && targetLevel > 0 && (
                <div className="rounded-xl border-2 border-primary/40 bg-linear-to-r from-primary/10 to-base-200 p-4 text-center shadow-md">
                  <div className="text-sm font-bold text-primary">✅ คุณมี Level {currentLevel} ครบแล้ว ไม่ต้องใช้มะละกอเพิ่มเติม</div>
                </div>
              )}
            </>
          )}

          {targetLevel > 0 && (
            <div className="space-y-4 rounded-xl border-2 border-primary/40 bg-linear-to-r from-primary/15 to-base-200 p-6">
              {daysNeededData.isAlreadyReached ? (
                <div className="rounded-lg border-l-4 border-primary bg-base-100 p-4 text-center shadow-md">
                  <div className="text-xl font-bold text-primary">✅ คุณมี Level {currentLevel} ครบแล้ว!</div>
                </div>
              ) : (
                <>
                  <div className="rounded-lg border-l-4 border-primary bg-base-100 p-4 text-base-content shadow-md">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div>
                        <div className="text-xs text-base-content/70 font-semibold mb-2">ต้องใช้เวลา (วัน)</div>
                        <div className="text-3xl font-bold text-primary">{daysNeededData.daysNeeded}</div>
                        <div className="text-xs text-base-content/60">วัน</div>
                      </div>
                      <div>
                        <div className="text-xs text-base-content/70 font-semibold mb-2">ต้องใช้เวลา (สัปดาห์)</div>
                        <div className="text-3xl font-bold text-primary">{daysNeededData.weeksNeeded}</div>
                        <div className="text-xs text-base-content/60">สัปดาห์</div>
                      </div>
                      <div>
                        <div className="text-xs text-base-content/70 font-semibold mb-2">แต้มที่ต้องเพิ่ม</div>
                        <div className="text-3xl font-bold text-primary">{formatNumber(daysNeededData.pointsNeeded.toString())}</div>
                        <div className="text-xs text-base-content/60">Point</div>
                      </div>
                      <div>
                        <div className="text-xs text-base-content/70 font-semibold mb-2">Point/วัน</div>
                        <div className="text-3xl font-bold text-primary">{currentDailyPoints}</div>
                        <div className="text-xs text-base-content/60">P/วัน</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-primary bg-base-100 p-4 text-base-content shadow-md">
                    {(() => {
                      const sumDaily = daysNeededData.daysNeeded * currentDailyPoints;
                      return (
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-xs font-bold text-primary">📋 Quest ที่ต้องทำ ({daysNeededData.daysNeeded} วัน):</div>
                          <div className="text-sm font-bold text-primary">{formatNumber(sumDaily.toString())} P</div>
                        </div>
                      );
                    })()}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center p-2 bg-primary rounded text-primary-content font-bold">
                        <span>📅 Daily Quest</span>
                        <span>
                          {isPremiumOpened ? dailyPremiumTotal : dailyNormalTotal} P × {daysNeededData.daysNeeded} = {(isPremiumOpened ? dailyPremiumTotal : dailyNormalTotal) * daysNeededData.daysNeeded}
                        </span>
                      </div>

                      {daysNeededData.weeksNeeded > 0 && (
                        <div className="flex items-center justify-between rounded bg-primary p-2 font-bold text-primary-content">
                          <span>📊 Weekly Quest</span>
                          <span>
                            {weeklyTotal} P × {daysNeededData.weeksNeeded} = {weeklyTotal * daysNeededData.weeksNeeded}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg border-l-4 border-primary bg-linear-to-r from-primary/15 to-base-200 p-4 shadow-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-primary">💸 เสียเงิน Zeny ทั้งสิ้น:</span>
                      <span className="text-3xl font-bold text-primary">
                        {formatNumber((1000000 * daysNeededData.daysNeeded + 2000000 * daysNeededData.weeksNeeded).toString())} Zeny
                      </span>
                    </div>
                    <div className="text-xs text-primary">
                      <div>
                        Daily Zeny: 1,000,000 × {daysNeededData.daysNeeded} = {formatNumber((1000000 * daysNeededData.daysNeeded).toString())} Zeny
                      </div>
                      <div>
                        Weekly Zeny: 2,000,000 × {daysNeededData.weeksNeeded} = {formatNumber((2000000 * daysNeededData.weeksNeeded).toString())} Zeny
                      </div>
                    </div>
                  </div>

                  <div className="bg-base-100 rounded-lg p-4 shadow-md border-l-4 border-accent">
                    <label className="label cursor-pointer">
                      <span className="label-text font-bold text-base-content/80">
                        {isPremiumOpened ? "💛 Premium Account (เปิดอยู่)" : "⚪ Normal Account"}
                      </span>
                      <div className={`badge badge-lg border-0 ${isPremiumOpened ? "bg-accent text-accent-content" : "bg-base-300 text-base-content"}`}>
                        {isPremiumOpened ? "+10 P/วัน" : "Normal"}
                      </div>
                    </label>
                  </div>

                  <div className="rounded-lg border-l-4 border-primary bg-base-100 p-4 text-center shadow-md">
                    <div className="space-y-1 text-sm font-bold text-primary">
                      <div>
                        ต้องการ Level {targetLevel} จากปัจจุบัน Level {currentLevel}
                      </div>
                      <div className="text-primary mt-2 text-base">
                        ✓ ต้องทำ {daysNeededData.daysNeeded} วัน ({daysNeededData.weeksNeeded} สัปดาห์) เสีย {formatNumber((1000000 * daysNeededData.daysNeeded + 2000000 * daysNeededData.weeksNeeded).toString())} Zeny
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {targetLevel === 0 && (
            <div className="bg-base-200 rounded-xl p-4 text-center border border-base-300">
              <div className="text-sm text-base-content/70">กรอกระดับที่ต้องการเพื่อดูผลการคำนวน</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
