"use client";

import React, { useMemo, useState } from "react";
import { BATTLE_PASS_CONFIG } from "@/data/battlepassData";
import { DAILY_QUESTS, WEEKLY_QUESTS } from "@/data/QuestBattlePassData";

interface CalculationResult {
  dailyNormalPoints: number;
  dailyPremiumPoints: number;
  dailyZenyCost: number;
  weeklyPoints: number;
  weeklyTotalNormalPoints: number;
  weeklyTotalPremiumPoints: number;
  weeklyZenyCost: number;
  daysRemaining: number;
  currentProgress: {
    normalPoints: number;
    premiumPoints: number;
    days: number;
  };
  projection: {
    normalPoints: number;
    premiumPoints: number;
  };
}

// Calculate level from points: >= 50 = Level 1, every 10 points = 1 level
// 50-59 = Level 1, 60-69 = Level 2, 70-79 = Level 3, etc.
const calculateLevelFromExp = (totalPoints: number) => {
  if (totalPoints < 50) {
    return {
      level: 0,
      currentExp: totalPoints,
      maxExp: 50,
    };
  }

  const level = 1 + Math.floor((totalPoints - 50) / 10);
  const currentExp = (totalPoints - 50) % 10;

  return {
    level,
    currentExp,
    maxExp: 10,
  };
};

export default function CalcBPComponent() {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [isDailyDone, setIsDailyDone] = useState<boolean>(false);
  const [isWeeklyDone, setIsWeeklyDone] = useState<boolean>(false);
  const [isPremiumOpened, setIsPremiumOpened] = useState<boolean>(false);
  const [isLastDayDailyDone, setIsLastDayDailyDone] = useState<boolean>(false);
  const [isLastDayWeeklyDone, setIsLastDayWeeklyDone] =
    useState<boolean>(false);
  const [targetLevel, setTargetLevel] = useState<number>(0);

  // Auto-calculate level and remaining points from total
  const levelData = calculateLevelFromExp(totalPoints);
  const currentLevel = levelData.level;
  const currentPoints = levelData.currentExp;
  const maxExpForLevel = levelData.maxExp;

  // Quest configuration from QuestBattlePassData
  const dailyNormalTotal = DAILY_QUESTS.normal.total;
  const dailyPremiumTotal = DAILY_QUESTS.premium.total;
  const dailyMonsterNormalReward = DAILY_QUESTS.normal.monsterHunt.reward;
  const dailyMonsterPremiumReward = DAILY_QUESTS.premium.monsterHunt.reward;
  const dailySendZenyReward = DAILY_QUESTS.normal.sendZeny.reward;
  const weeklyTotal = WEEKLY_QUESTS.total;
  const weeklySendZenyReward = WEEKLY_QUESTS.sendZeny.reward;
  const dailyZenyCostAmount: number =
    DAILY_QUESTS.normal.sendZeny.zenyRequired ?? 1000000;
  const weeklyZenyCostAmount: number =
    WEEKLY_QUESTS.sendZeny.zenyRequired ?? 2000000;

  // Calculate daily points for current account type
  const currentDailyPoints = isPremiumOpened
    ? dailyPremiumTotal
    : dailyNormalTotal;

  const calculation = useMemo<CalculationResult>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(BATTLE_PASS_CONFIG.eventStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(BATTLE_PASS_CONFIG.eventEndDate);
    endDate.setHours(23, 59, 59, 999);

    // Calculate days from start to today
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.max(
      0,
      Math.floor((today.getTime() - startDate.getTime()) / millisecondsPerDay) +
        1,
    );
    const daysRemaining = Math.max(
      0,
      Math.floor((endDate.getTime() - today.getTime()) / millisecondsPerDay) +
        1,
    );

    // Weekly calculation
    const weeksRemaining = Math.ceil(daysRemaining / 7);

    // Calculate current progress (days completed up to today)
    const completedDays = Math.max(0, daysSinceStart);
    const completedWeeks = Math.floor(completedDays / 7);

    // Normal Pass
    const normalPointsFromCompletedDays = completedDays * dailyNormalTotal;
    const normalPointsFromCompletedWeeks = completedWeeks * weeklyTotal;
    const currentNormalPoints =
      normalPointsFromCompletedDays + normalPointsFromCompletedWeeks;

    // Premium Pass
    const premiumPointsFromCompletedDays = completedDays * dailyPremiumTotal;
    const premiumPointsFromCompletedWeeks = completedWeeks * weeklyTotal;
    const currentPremiumPoints =
      premiumPointsFromCompletedDays + premiumPointsFromCompletedWeeks;

    // Projection if completing all remaining days
    const projectionNormalPoints =
      currentNormalPoints +
      daysRemaining * dailyNormalTotal +
      weeksRemaining * weeklyTotal;
    const projectionPremiumPoints =
      currentPremiumPoints +
      daysRemaining * dailyPremiumTotal +
      weeksRemaining * weeklyTotal;

    // Weekly cost
    const weeklyZenyCost = dailyZenyCostAmount * 7 + weeklyZenyCostAmount;

    return {
      dailyNormalPoints: dailyNormalTotal,
      dailyPremiumPoints: dailyPremiumTotal,
      dailyZenyCost: dailyZenyCostAmount,
      weeklyPoints: weeklyTotal,
      weeklyTotalNormalPoints: dailyNormalTotal * 7 + weeklyTotal,
      weeklyTotalPremiumPoints: dailyPremiumTotal * 7 + weeklyTotal,
      weeklyZenyCost,
      daysRemaining,
      currentProgress: {
        normalPoints: currentNormalPoints,
        premiumPoints: currentPremiumPoints,
        days: completedDays,
      },
      projection: {
        normalPoints: projectionNormalPoints,
        premiumPoints: projectionPremiumPoints,
      },
    };
  }, [
    dailyNormalTotal,
    dailyPremiumTotal,
    weeklyTotal,
    dailyZenyCostAmount,
    weeklyZenyCostAmount,
  ]);

  const formatNumber = (num: number | string) => {
    const numValue = typeof num === "string" ? parseInt(num, 10) : num;
    return numValue.toLocaleString("th-TH");
  };

  // Total current points is just the input
  const totalCurrentPoints = totalPoints;
  const totalNormalProjectionPoints =
    totalCurrentPoints + calculation.projection.normalPoints;
  const totalPremiumProjectionPoints =
    totalCurrentPoints + calculation.projection.premiumPoints;

  const finalNormalData = calculateLevelFromExp(totalNormalProjectionPoints);
  const finalNormalLevel = finalNormalData.level;
  const finalNormalRemainingPoints = finalNormalData.currentExp;

  const finalPremiumData = calculateLevelFromExp(totalPremiumProjectionPoints);
  const finalPremiumLevel = finalPremiumData.level;
  const finalPremiumRemainingPoints = finalPremiumData.currentExp;

  // Calculate projected level based on checkboxes with smart calculation
  const calculateProjectedLevel = () => {
    const today = new Date();
    const WEDNESDAY = 3; // Wednesday = first day of week
    const dayOfWeek = today.getDay();

    // Calculate day index in current week (Wednesday = 0, Thursday = 1, ..., Tuesday = 6)
    const dayIndexInWeek = (dayOfWeek - WEDNESDAY + 7) % 7;

    // Days remaining in current week (including today)
    const daysRemainingInWeek = 7 - dayIndexInWeek;

    // Days for daily calculation: starts with full remaining days, minus last Wednesday
    let daysForDailyCalc = Math.max(0, calculation.daysRemaining - 1);

    // If Daily quest is done: Don't count today
    if (isDailyDone) {
      daysForDailyCalc = Math.max(0, daysForDailyCalc - 1);
    }

    // Days for weekly calculation: independent from daily
    let daysForWeeklyCalc = calculation.daysRemaining - 1; // Always subtract last Wednesday
    let weeksForCalculation = 0;

    // If Weekly quest is done: Don't count remaining days in current week
    if (isWeeklyDone) {
      daysForWeeklyCalc = Math.max(0, daysForWeeklyCalc - daysRemainingInWeek);
      weeksForCalculation = Math.ceil(daysForWeeklyCalc / 7);
    } else {
      // Not done with weekly: include this week's remaining days
      weeksForCalculation = Math.ceil(daysForWeeklyCalc / 7);
    }

    // Daily points: Monster (10 normal / 20 premium) + Send Zeny (30) = 40 normal / 50 premium
    const dailyPoints = isPremiumOpened ? dailyPremiumTotal : dailyNormalTotal;
    let additionalPoints =
      daysForDailyCalc * dailyPoints + weeksForCalculation * weeklyTotal;

    // Add Daily points for last day if checked
    if (isLastDayDailyDone) {
      additionalPoints += dailyPoints;
    }

    // Add Weekly points for last day if checked
    if (isLastDayWeeklyDone) {
      additionalPoints += weeklyTotal;
    }

    const projectedTotalPoints = totalPoints + additionalPoints;
    return calculateLevelFromExp(projectedTotalPoints);
  };

  const projectedLevelData = calculateProjectedLevel();

  // Calculate days needed to reach target level
  const calculateDaysNeeded = () => {
    if (targetLevel <= currentLevel) {
      return {
        daysNeeded: 0,
        pointsNeeded: 0,
        isAlreadyReached: targetLevel <= currentLevel,
      };
    }

    // Points required to reach target level
    const pointsForTargetLevel =
      targetLevel <= 0 ? 0 : 50 + (targetLevel - 1) * 10;
    const pointsNeeded = Math.max(0, pointsForTargetLevel - totalPoints);

    // Daily points (without last day bonus, just regular daily)
    const dailyPointsPerDay = isPremiumOpened
      ? dailyPremiumTotal
      : dailyNormalTotal;

    // Days needed (ceil to round up)
    const daysNeeded =
      pointsNeeded > 0 ? Math.ceil(pointsNeeded / dailyPointsPerDay) : 0;

    return { daysNeeded, pointsNeeded, isAlreadyReached: false };
  };

  const daysNeededData = calculateDaysNeeded();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const generateThaiSummary = () => {
    const days = calculation.daysRemaining;
    const weeks = Math.ceil(days / 7);
    const totalZeny = calculation.weeklyZenyCost * weeks;

    return `
    ✅ หากทำครบทุกวัน ทุกอาทิตย์เป็นเวลา ${weeks} สัปดาห์ (${days} วัน):

    💙 Normal Pass:
    • ระดับปัจจุบัน: ${currentLevel} (${currentPoints}/${maxExpForLevel} แต้ม)
    • ระดับสุดท้าย: ${finalNormalLevel} (${finalNormalRemainingPoints}/${finalNormalData.maxExp} แต้ม)
    • แต้มที่ได้เพิ่มเติม: ${formatNumber(calculation.projection.normalPoints.toString())} แต้ม

    💛 Premium Pass:
    • ระดับปัจจุบัน: ${currentLevel} (${currentPoints}/${maxExpForLevel} แต้ม)
    • ระดับสุดท้าย: ${finalPremiumLevel} (${finalPremiumRemainingPoints}/${finalPremiumData.maxExp} แต้ม)
    • แต้มที่ได้เพิ่มเติม: ${formatNumber(calculation.projection.premiumPoints.toString())} แต้ม

    💰 ค่าใช้สอย Zeny ทั้งสิ้น: ${formatNumber(totalZeny.toString())} Zeny

    📅 ระยะเวลา: ${days} วัน (${weeks} สัปดาห์)
    `;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-2 sm:p-4">
      {/* Card 1: Current Points Input (w-full) */}
      <div className="card w-full bg-linear-to-br from-indigo-50 via-indigo-50 to-indigo-100 shadow-xl border-2 border-indigo-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> Status ปัจจุบัน
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Current Level Display Only */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border-l-4 border-indigo-500">
              <label className="label">
                <span className="label-text font-bold text-gray-700 text-sm sm:text-base">
                  Level ปัจจุบัน
                </span>
              </label>
              <div className="text-4xl sm:text-5xl font-bold text-indigo-600 mt-3 text-center">
                {currentLevel}
              </div>
              <div className="text-center text-xs text-gray-600 mt-2">
                ระดับ Battle Pass ปัจจุบัน
              </div>
            </div>

            {/* Current Points Input */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-bold text-gray-700 text-sm sm:text-base">
                  แต้มปัจจุบัน (รวม)
                </span>
              </label>
              <input
                type="text"
                value={totalPoints}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");
                  setTotalPoints(value ? parseInt(value, 10) : 0);
                }}
                placeholder="0"
                className="input input-bordered input-lg w-full bg-white focus:input-primary border-indigo-300 text-2xl sm:text-3xl font-bold text-center text-indigo-600"
              />
              <label className="label">
                <span className="label-text-alt text-gray-500 text-xs">
                  กรอกแต้มรวมปัจจุบัน
                </span>
              </label>

              {/* Checkboxes */}
              <div className="space-y-3 mt-4">
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isDailyDone}
                      onChange={(e) => setIsDailyDone(e.target.checked)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text text-gray-700 font-medium ml-2">
                      ทำ Daily แล้ว
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isWeeklyDone}
                      onChange={(e) => setIsWeeklyDone(e.target.checked)}
                      className="checkbox checkbox-primary"
                    />
                    <span className="label-text text-gray-700 font-medium ml-2">
                      ทำ Weekly แล้ว
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPremiumOpened}
                      onChange={(e) => setIsPremiumOpened(e.target.checked)}
                      className="checkbox checkbox-accent"
                    />
                    <span className="label-text text-gray-700 font-medium ml-2">
                      Premium Account
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLastDayDailyDone}
                      onChange={(e) => setIsLastDayDailyDone(e.target.checked)}
                      className="checkbox checkbox-warning"
                    />
                    <span className="label-text text-gray-700 font-medium ml-2">
                      ทำวันสุดท้ายหลังตี 4 (พุธ 24 มิถุนายน) Daily
                    </span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLastDayWeeklyDone}
                      onChange={(e) => setIsLastDayWeeklyDone(e.target.checked)}
                      className="checkbox checkbox-warning"
                    />
                    <span className="label-text text-gray-700 font-medium ml-2">
                      ทำวันสุดท้ายหลังตี 4 (พุธ 24 มิถุนายน) Weekly
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Display breakdown */}
          <div className="mt-6 pt-6 border-t border-indigo-200 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-600 font-semibold mb-2">
                Level
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600">
                {currentLevel}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 font-semibold mb-2">
                แต้มใน Level นี้
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {currentPoints}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 font-semibold mb-2">
                แต้มถึง Level ต่อไป
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {formatNumber((maxExpForLevel - currentPoints).toString())}
              </div>
            </div>
          </div>

          {/* Projected Final Level */}
          <div className="mt-6 pt-6 border-t border-indigo-200 bg-linear-to-r from-amber-50 to-orange-50 rounded-xl p-4">
            <div className="text-center">
              <div className="text-sm font-bold text-amber-900 mb-3">
                จนถึงวันสุดท้าย จะได้ Level ถ้าทำ Daily, Weekly ครบ
              </div>
              <div className="text-4xl sm:text-5xl font-bold text-amber-600">
                Level {projectedLevelData.level}
              </div>

              {/* Calculation Breakdown */}
              <div className="text-xs text-amber-900 bg-white bg-opacity-60 rounded p-3 mt-2 space-y-1">
                <div className="font-bold mb-2">📊 การคำนวน:</div>
                <div>• แต้มปัจจุบัน: {totalPoints}</div>

                {(() => {
                  const today = new Date();
                  const WEDNESDAY = 3;
                  const dayOfWeek = today.getDay();
                  const dayIndexInWeek = (dayOfWeek - WEDNESDAY + 7) % 7;
                  const daysRemainingInWeek = 7 - dayIndexInWeek;

                  // Daily calculation: independent from weekly
                  let daysForDailyCalc = Math.max(
                    0,
                    calculation.daysRemaining - 1,
                  ); // Always subtract last Wednesday
                  if (isDailyDone) {
                    daysForDailyCalc = Math.max(0, daysForDailyCalc - 1); // Don't count today
                  }

                  // Weekly calculation: independent from daily
                  let daysForWeeklyCalc = calculation.daysRemaining - 1; // Always subtract last Wednesday
                  let weeksForCalc = 0;
                  if (isWeeklyDone) {
                    daysForWeeklyCalc = Math.max(
                      0,
                      daysForWeeklyCalc - daysRemainingInWeek,
                    );
                    weeksForCalc = Math.ceil(daysForWeeklyCalc / 7);
                  } else {
                    weeksForCalc = Math.ceil(daysForWeeklyCalc / 7);
                  }

                  const dailyPoints = isPremiumOpened ? 50 : 40;
                  let totalAdditional =
                    daysForDailyCalc * dailyPoints + weeksForCalc * weeklyTotal;

                  // Add last day bonuses to display
                  if (isLastDayDailyDone) {
                    totalAdditional += dailyPoints;
                  }
                  if (isLastDayWeeklyDone) {
                    totalAdditional += weeklyTotal;
                  }

                  return (
                    <>
                      {isDailyDone && (
                        <div>
                          • Daily: {daysForDailyCalc} วัน × {dailyPoints} ={" "}
                          {daysForDailyCalc * dailyPoints}
                          <span className="text-gray-600"> (หักวันนี้)</span>
                        </div>
                      )}
                      {!isDailyDone && (
                        <div>
                          • Daily: {daysForDailyCalc} วัน × {dailyPoints} ={" "}
                          {daysForDailyCalc * dailyPoints}
                        </div>
                      )}

                      {isWeeklyDone && (
                        <div>
                          • Weekly: {weeksForCalc} สัปดาห์ × {weeklyTotal} ={" "}
                          {weeksForCalc * weeklyTotal}
                          <span className="text-gray-600">
                            {" "}
                            (หักสัปดาห์นี้)
                          </span>
                        </div>
                      )}
                      {!isWeeklyDone && (
                        <div>
                          • Weekly: {weeksForCalc} สัปดาห์ × {weeklyTotal} ={" "}
                          {weeksForCalc * weeklyTotal}
                        </div>
                      )}

                      {isLastDayDailyDone && (
                        <div>
                          • วันสุดท้าย (หลังตี 4): {dailyPoints} (Daily)
                        </div>
                      )}

                      {isLastDayWeeklyDone && (
                        <div>
                          • วันสุดท้าย (หลังตี 4): {weeklyTotal} (Weekly)
                        </div>
                      )}

                      <div className="font-bold mt-2 text-amber-900 pt-2 border-t border-amber-200">
                        รวม: {totalPoints} + {totalAdditional} ={" "}
                        {totalPoints + totalAdditional} แต้ม
                      </div>
                    </>
                  );
                })()}

                {isPremiumOpened && (
                  <div className="text-yellow-700 font-bold mt-2">
                    💛 Premium Pass
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 & 3: Daily and Weekly Quests - 2 Columns on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2: Daily Quest */}
        <div className="card bg-linear-to-br from-blue-50 via-blue-50 to-blue-100 shadow-xl border-2 border-blue-200">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-xl sm:text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📅</span> Daily Quest
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Monster Hunt Quest */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-2">
                      🐉 Monster Hunt
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {isPremiumOpened ? "20" : "10"}
                    </div>
                    <div className="text-xs text-gray-500">Point</div>
                  </div>
                  <div className="text-4xl">⚔️</div>
                </div>
                <div className="text-xs space-y-2 bg-blue-50 rounded p-3">
                  {isPremiumOpened ? (
                    <>
                      <div className="flex justify-between">
                        <span>HILLSRION ×20</span>
                        <span className="text-blue-600 font-bold">
                          22/04 - 06/05
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>CENTIPEDE ×20</span>
                        <span className="text-blue-600 font-bold">
                          06/05 - 20/05
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>TATACHO ×20</span>
                        <span className="text-blue-600 font-bold">
                          20/05 - 03/06
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>DOLOMEDES ×20</span>
                        <span className="text-blue-600 font-bold">
                          03/06 - 24/06
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>Cornus ×20</span>
                      <span className="text-blue-600 font-bold">
                        22/04 - 24/06
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Send Zeny */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-2">
                      💰 Send Zeny
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      30
                    </div>
                    <div className="text-xs text-gray-500">Point</div>
                  </div>
                  <div className="text-4xl">💸</div>
                </div>
                <div className="text-xs text-gray-600 bg-green-50 rounded p-3">
                  <div>ส่ง 1,000,000 Zeny</div>
                  <div className="text-green-600 font-semibold mt-2">
                    22/04 - 24/06
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Summary */}
            <div className="bg-linear-to-r from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-xs text-blue-900 font-semibold mb-2">
                  รวม Daily ต่อวัน
                </div>
                <div className="flex justify-center gap-4 items-center">
                  <div>
                    <div className="text-sm text-gray-700 font-medium mb-1">
                      สังหาร: {isPremiumOpened ? "20" : "10"} Point
                    </div>
                  </div>
                  <div className="text-gray-400">+</div>
                  <div>
                    <div className="text-sm text-gray-700 font-medium mb-1">
                      ส่งเงิน: 30 Point
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">=</div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {isPremiumOpened ? "50" : "40"}
                    </div>
                    <div className="text-xs text-gray-600">Point</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Weekly Quest Summary */}
        <div className="card bg-linear-to-br from-purple-50 via-purple-50 to-purple-100 shadow-xl border-2 border-purple-200">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-xl sm:text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span> Weekly Quest Summary
            </h2>

            <div className="space-y-4">
              {/* Boss Hunt Section */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-red-500">
                <div className="text-xs text-gray-600 font-semibold mb-3 flex items-center gap-2">
                  <span>👑 Boss Hunt</span>
                </div>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-start p-2 bg-red-50 rounded">
                    <div>
                      <div className="font-bold text-red-700">Celine Kimi</div>
                      <div className="text-gray-600">Horror Toy Factory</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-red-600">20 P</div>
                      <div className="text-gray-600">×1</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start p-2 bg-orange-50 rounded">
                    <div>
                      <div className="font-bold text-orange-700">
                        Faceworm Queen
                      </div>
                      <div className="text-gray-600">The Nest of Faceworm</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">20 P</div>
                      <div className="text-gray-600">×1</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-start p-2 bg-purple-50 rounded">
                    <div>
                      <div className="font-bold text-purple-700">
                        Ancient Gigantes
                      </div>
                      <div className="text-gray-600">Sarah and Fenrir</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-purple-600">30 P</div>
                      <div className="text-gray-600">×1</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Weekly Points */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-1">
                      ทำ Weekly ครบ ได้แต้ม
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">
                      {calculation.weeklyPoints}
                    </div>
                  </div>
                  <div className="text-4xl">⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Weekly Complete Summary */}
      <div className="card bg-linear-to-br from-emerald-50 via-emerald-50 to-emerald-100 shadow-xl border-2 border-emerald-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span> สรุปทั้งสัปดาห์
          </h2>

          <div className="space-y-4">
            {/* Total Weekly Points */}
            <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-md text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold mb-1">ได้แต้มรวม</div>
                  <div className="text-3xl sm:text-4xl font-bold">
                    {formatNumber(
                      calculation.weeklyTotalNormalPoints.toString(),
                    )}
                  </div>
                </div>
                <div className="text-5xl">⭐</div>
              </div>
            </div>

            {/* Total Weekly Zeny */}
            <div className="bg-linear-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-md text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold mb-1">
                    จ่ายเงิน Zeny
                  </div>
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

      {/* Divider Line */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-1 bg-linear-to-r from-emerald-200 via-emerald-300 to-emerald-200"></div>
        <span className="text-emerald-600 font-bold text-sm">
          Level Calculator
        </span>
        <div className="flex-1 h-1 bg-linear-to-l from-emerald-200 via-emerald-300 to-emerald-200"></div>
      </div>

      {/* Card 5: Level Calculator */}
      <div className="card w-full bg-linear-to-br from-cyan-50 via-cyan-50 to-cyan-100 shadow-xl border-2 border-cyan-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold text-cyan-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span> Level Calculator
          </h2>

          {/* Input Row: Current Level vs Target Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            {/* Left: Current Level Input */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-indigo-500">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-gray-700">
                  Level ปัจจุบัน
                </span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-gray-500 text-xs">
                    กรอก Level ปัจจุบัน
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={currentLevel}
                onChange={(e) => {
                  const newLevel = Math.max(
                    0,
                    parseInt(e.target.value, 10) || 0,
                  );
                  // Convert level back to totalPoints (minimum points for that level)
                  const newTotalPoints =
                    newLevel <= 0 ? 0 : 50 + (newLevel - 1) * 10;
                  setTotalPoints(newTotalPoints);
                }}
                placeholder="0"
                className="input input-bordered input-lg w-full bg-white focus:input-primary border-indigo-300 text-3xl sm:text-4xl font-bold text-center text-indigo-600"
              />
            </div>

            {/* Right: Target Level Input */}
            <div className="bg-white rounded-xl p-6 shadow-md border-l-4 border-blue-500">
              <label className="label justify-center mb-3">
                <span className="label-text font-bold text-gray-700">
                  Level ที่อยากได้
                </span>
              </label>
              <div>
                <label className="label justify-center mt-3">
                  <span className="label-text-alt text-gray-500 text-xs">
                    กรอก Level ที่ต้องการ
                  </span>
                </label>
              </div>
              <input
                type="text"
                value={targetLevel}
                onChange={(e) =>
                  setTargetLevel(Math.max(0, parseInt(e.target.value, 10) || 0))
                }
                placeholder="0"
                className="input input-bordered input-lg w-full bg-white focus:input-primary border-blue-300 text-3xl sm:text-4xl font-bold text-center text-blue-600"
              />
            </div>
          </div>

          {/* Premium Checkbox for Level Calculator */}
          <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-yellow-500 mb-6">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                checked={isPremiumOpened}
                onChange={(e) => setIsPremiumOpened(e.target.checked)}
                className="checkbox checkbox-accent"
              />
              <span className="label-text ml-3 font-bold text-gray-700">
                {isPremiumOpened ? '💛 Premium Pass (เปิดอยู่)' : '⚪ Normal Pass'}
              </span>
              <span className="badge badge-lg ml-auto" style={{ backgroundColor: isPremiumOpened ? '#FFD700' : '#D1D5DB' }}>
                {isPremiumOpened ? '+10 P/วัน' : 'Normal'}
              </span>
            </label>
          </div>

          {/* Silvervine Calculation Section - Show when target level is set */}
          {targetLevel > 0 && (
            <>
              {/* Total Silvervine Needed */}
              {targetLevel > currentLevel && (
                <div className="bg-linear-to-r from-purple-100 to-pink-100 rounded-xl p-4 border-2 border-purple-300 shadow-md text-center">
                  <div className="text-sm font-bold text-purple-900">
                    🌿 ใช้มะละกอเพิ่มเติม{" "}
                    <span className="text-3xl text-purple-600">
                      {(targetLevel - currentLevel) * 3}
                    </span>{" "}
                    เม็ด หรือ Silvervine Box{" "}
                    <span className="text-3xl text-purple-600">
                      {Math.ceil(((targetLevel - currentLevel) * 3) / 10)}
                    </span>
                    {" "}กล่อง
                  </div>
                </div>
              )}

              {targetLevel <= currentLevel && targetLevel > 0 && (
                <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-xl p-4 border-2 border-green-300 shadow-md text-center">
                  <div className="text-sm font-bold text-green-700">
                    ✅ คุณมี Level {currentLevel} ครบแล้ว
                    ไม่ต้องใช้มะละกอเพิ่มเติม
                  </div>
                </div>
              )}
            </>
          )}

          {/* Result Section */}
          {targetLevel > 0 && (
            <div className="bg-linear-to-r from-cyan-100 to-blue-100 rounded-xl p-6 border-2 border-cyan-300 space-y-4">
              {/* Status Check */}
              {daysNeededData.isAlreadyReached ? (
                <div className="bg-white rounded-lg p-4 text-center border-l-4 border-green-500 shadow-md">
                  <div className="text-xl font-bold text-green-600">
                    ✅ คุณมี Level {currentLevel} ครบแล้ว!
                  </div>
                </div>
              ) : (
                <>
                  {/* Time needed Summary */}
                  <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-orange-500">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      {/* Days */}
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">
                          ต้องใช้เวลา (วัน)
                        </div>
                        <div className="text-3xl font-bold text-orange-600">
                          {daysNeededData.daysNeeded}
                        </div>
                        <div className="text-xs text-gray-500">วัน</div>
                      </div>

                      {/* Weeks */}
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">
                          ต้องใช้เวลา (สัปดาห์)
                        </div>
                        <div className="text-3xl font-bold text-orange-600">
                          {Math.ceil(daysNeededData.daysNeeded / 7)}
                        </div>
                        <div className="text-xs text-gray-500">สัปดาห์</div>
                      </div>

                      {/* Points Needed */}
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">
                          แต้มที่ต้องเพิ่ม
                        </div>
                        <div className="text-3xl font-bold text-blue-600">
                          {formatNumber(daysNeededData.pointsNeeded.toString())}
                        </div>
                        <div className="text-xs text-gray-500">Point</div>
                      </div>

                      {/* Points per Day */}
                      <div>
                        <div className="text-xs text-gray-600 font-semibold mb-2">
                          Point/วัน
                        </div>
                        <div className="text-3xl font-bold text-green-600">
                          {currentDailyPoints}
                        </div>
                        <div className="text-xs text-gray-500">P/วัน</div>
                      </div>
                    </div>
                  </div>

                  {/* Quest Breakdown */}
                  <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-purple-500">
                    <div className="text-xs font-bold text-purple-700 mb-3">
                      📋 Quest ที่ต้องทำ ({daysNeededData.daysNeeded} วัน):
                    </div>
                    <div className="space-y-2 text-sm">
                      {/* Daily: Monster Hunt */}
                      <div className="flex justify-between items-center p-2 bg-blue-600 rounded text-white">
                        <span>🐉 Daily: Monster Hunt</span>
                        <span className="font-bold">
                          {isPremiumOpened
                            ? dailyMonsterPremiumReward
                            : dailyMonsterNormalReward}{" "}
                          P × {daysNeededData.daysNeeded} ={" "}
                          {(isPremiumOpened
                            ? dailyMonsterPremiumReward
                            : dailyMonsterNormalReward) *
                            daysNeededData.daysNeeded}
                        </span>
                      </div>

                      {/* Daily: Send Zeny */}
                      <div className="flex justify-between items-center p-2 bg-green-600 rounded text-white">
                        <span>💰 Daily: Send Zeny (1M)</span>
                        <span className="font-bold">
                          {dailySendZenyReward} P × {daysNeededData.daysNeeded}{" "}
                          = {dailySendZenyReward * daysNeededData.daysNeeded}
                        </span>
                      </div>

                      {/* Weekly: Boss Hunt */}
                      {Math.ceil(daysNeededData.daysNeeded / 7) > 0 && (
                        <>
                          <div className="border-t border-gray-300 my-2 pt-2">
                            <div className="text-xs font-bold text-gray-700 mb-2">
                              Weekly ({Math.ceil(daysNeededData.daysNeeded / 7)}{" "}
                              สัปดาห์):
                            </div>
                          </div>

                          <div className="flex justify-between items-center p-2 bg-red-600 rounded text-xs text-white">
                            <span>👑 Celine Kimi</span>
                            <span className="font-bold">
                              {WEEKLY_QUESTS.bosses[0].reward} P ×{" "}
                              {Math.ceil(daysNeededData.daysNeeded / 7)} ={" "}
                              {WEEKLY_QUESTS.bosses[0].reward *
                                Math.ceil(daysNeededData.daysNeeded / 7)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center p-2 bg-orange-600 rounded text-xs text-white">
                            <span>👑 Faceworm Queen</span>
                            <span className="font-bold">
                              {WEEKLY_QUESTS.bosses[1].reward} P ×{" "}
                              {Math.ceil(daysNeededData.daysNeeded / 7)} ={" "}
                              {WEEKLY_QUESTS.bosses[1].reward *
                                Math.ceil(daysNeededData.daysNeeded / 7)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center p-2 bg-purple-600 rounded text-xs text-white">
                            <span>👑 Ancient Gigantes</span>
                            <span className="font-bold">
                              {WEEKLY_QUESTS.bosses[2].reward} P ×{" "}
                              {Math.ceil(daysNeededData.daysNeeded / 7)} ={" "}
                              {WEEKLY_QUESTS.bosses[2].reward *
                                Math.ceil(daysNeededData.daysNeeded / 7)}
                            </span>
                          </div>

                          {/* Weekly: Send Zeny */}
                          <div className="flex justify-between items-center p-2 bg-yellow-600 rounded text-xs text-white">
                            <span>💰 Weekly: Send Zeny (2M)</span>
                            <span className="font-bold">
                              {weeklySendZenyReward} P ×{" "}
                              {Math.ceil(daysNeededData.daysNeeded / 7)} ={" "}
                              {weeklySendZenyReward *
                                Math.ceil(daysNeededData.daysNeeded / 7)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Total Cost in Zeny */}
                  <div className="bg-linear-to-r from-yellow-100 to-amber-100 rounded-lg p-4 shadow-md border-l-4 border-yellow-500">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-900">
                        💸 เสียเงิน Zeny ทั้งสิ้น:
                      </span>
                      <span className="text-3xl font-bold text-yellow-700">
                        {formatNumber(
                          (
                            1000000 * daysNeededData.daysNeeded +
                            2000000 * Math.ceil(daysNeededData.daysNeeded / 7)
                          ).toString(),
                        )}{" "}
                        Zeny
                      </span>
                    </div>
                    <div className="text-xs text-yellow-700">
                      <div>
                        Daily Zeny: 1,000,000 × {daysNeededData.daysNeeded} ={" "}
                        {formatNumber(
                          (1000000 * daysNeededData.daysNeeded).toString(),
                        )}{" "}
                        Zeny
                      </div>
                      <div>
                        Weekly Zeny: 2,000,000 ×{" "}
                        {Math.ceil(daysNeededData.daysNeeded / 7)} ={" "}
                        {formatNumber(
                          (
                            2000000 * Math.ceil(daysNeededData.daysNeeded / 7)
                          ).toString(),
                        )}{" "}
                        Zeny
                      </div>
                    </div>
                  </div>

                  {/* Premium Account Check */}
                  <div className="bg-white rounded-lg p-4 shadow-md border-l-4 border-accent">
                    <label className="label cursor-pointer">
                      <span className="label-text font-bold text-gray-700">
                        {isPremiumOpened
                          ? "💛 Premium Account (เปิดอยู่)"
                          : "⚪ Normal Account"}
                      </span>
                      <div
                        className="badge badge-lg"
                        style={{
                          backgroundColor: isPremiumOpened
                            ? "#FFD700"
                            : "#D1D5DB",
                        }}
                      >
                        {isPremiumOpened ? "+10 P/วัน" : "Normal"}
                      </div>
                    </label>
                  </div>

                  {/* Summary */}
                  <div className="bg-white rounded-lg p-4 text-center border-l-4 border-cyan-500 shadow-md">
                    <div className="text-sm font-bold text-cyan-700 space-y-1">
                      <div>
                        ต้องการ Level {targetLevel} จากปัจจุบัน Level{" "}
                        {currentLevel}
                      </div>
                      <div className="text-blue-600 mt-2 text-base">
                        ✓ ต้องทำ {daysNeededData.daysNeeded} วัน เสีย{" "}
                        {formatNumber(
                          (
                            1000000 * daysNeededData.daysNeeded +
                            2000000 * Math.ceil(daysNeededData.daysNeeded / 7)
                          ).toString(),
                        )}{" "}
                        Zeny
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {targetLevel === 0 && (
            <div className="bg-gray-100 rounded-xl p-4 text-center border border-gray-300">
              <div className="text-sm text-gray-600">
                กรอกระดับที่ต้องการเพื่อดูผลการคำนวน
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
