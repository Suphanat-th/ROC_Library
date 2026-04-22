'use client';

import React, { useMemo, useState } from 'react';
import { BATTLE_PASS_CONFIG, QUEST_DETAILS } from '@/data/battlepassData';

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
  const [isLastDayDone, setIsLastDayDone] = useState<boolean>(false);
  
  // Auto-calculate level and remaining points from total
  const levelData = calculateLevelFromExp(totalPoints);
  const currentLevel = levelData.level;
  const currentPoints = levelData.currentExp;
  const maxExpForLevel = levelData.maxExp;

  const calculation = useMemo<CalculationResult>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const startDate = new Date(BATTLE_PASS_CONFIG.eventStartDate);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(BATTLE_PASS_CONFIG.eventEndDate);
    endDate.setHours(23, 59, 59, 999);

    // Calculate days from start to today
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.max(0, Math.floor((today.getTime() - startDate.getTime()) / millisecondsPerDay) + 1);
    const daysRemaining = Math.max(0, Math.floor((endDate.getTime() - today.getTime()) / millisecondsPerDay) + 1);
    
    // Weekly calculation
    const weeksRemaining = Math.ceil(daysRemaining / 7);
    
    // Calculate current progress (days completed up to today)
    const completedDays = Math.max(0, daysSinceStart);
    const completedWeeks = Math.floor(completedDays / 7);
    const extraDaysAfterWeeks = completedDays % 7;

    // Normal Pass
    const normalPointsFromCompletedDays = completedDays * BATTLE_PASS_CONFIG.dailyNormalPoints;
    const normalPointsFromCompletedWeeks = completedWeeks * BATTLE_PASS_CONFIG.weeklyPoints;
    const currentNormalPoints = normalPointsFromCompletedDays + normalPointsFromCompletedWeeks;

    // Premium Pass
    const premiumPointsFromCompletedDays = completedDays * BATTLE_PASS_CONFIG.dailyPremiumPoints;
    const premiumPointsFromCompletedWeeks = completedWeeks * BATTLE_PASS_CONFIG.weeklyPoints;
    const currentPremiumPoints = premiumPointsFromCompletedDays + premiumPointsFromCompletedWeeks;

    // Projection if completing all remaining days
    const projectionNormalPoints = currentNormalPoints + (daysRemaining * BATTLE_PASS_CONFIG.dailyNormalPoints) + (weeksRemaining * BATTLE_PASS_CONFIG.weeklyPoints);
    const projectionPremiumPoints = currentPremiumPoints + (daysRemaining * BATTLE_PASS_CONFIG.dailyPremiumPoints) + (weeksRemaining * BATTLE_PASS_CONFIG.weeklyPoints);

    // Weekly cost
    const weeklyZenyCost = (BATTLE_PASS_CONFIG.dailyZenyCost * 7) + BATTLE_PASS_CONFIG.weeklyZenyCost;

    return {
      dailyNormalPoints: BATTLE_PASS_CONFIG.dailyNormalPoints,
      dailyPremiumPoints: BATTLE_PASS_CONFIG.dailyPremiumPoints,
      dailyZenyCost: BATTLE_PASS_CONFIG.dailyZenyCost,
      weeklyPoints: BATTLE_PASS_CONFIG.weeklyPoints,
      weeklyTotalNormalPoints: (BATTLE_PASS_CONFIG.dailyNormalPoints * 7) + BATTLE_PASS_CONFIG.weeklyPoints,
      weeklyTotalPremiumPoints: (BATTLE_PASS_CONFIG.dailyPremiumPoints * 7) + BATTLE_PASS_CONFIG.weeklyPoints,
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
  }, []);

  const formatNumber = (num: number | string) => {
    const numValue = typeof num === 'string' ? parseInt(num, 10) : num;
    return numValue.toLocaleString('th-TH');
  };

  // Total current points is just the input
  const totalCurrentPoints = totalPoints;
  const totalNormalProjectionPoints = totalCurrentPoints + calculation.projection.normalPoints;
  const totalPremiumProjectionPoints = totalCurrentPoints + calculation.projection.premiumPoints;
  
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
    
    let daysForCalculation = calculation.daysRemaining;
    let weeksForCalculation = 0;
    
    // Subtract 1 day for the last day (Wednesday) when server is closed
    daysForCalculation = Math.max(0, daysForCalculation - 1);
    
    // If Weekly done: Don't count this week, start from next week
    if (isWeeklyDone) {
      daysForCalculation = Math.max(0, daysForCalculation - daysRemainingInWeek);
      weeksForCalculation = Math.ceil(daysForCalculation / 7);
    } else {
      weeksForCalculation = Math.ceil(daysForCalculation / 7);
    }
    
    // If Daily done: Don't count today
    if (isDailyDone) {
      daysForCalculation = Math.max(0, daysForCalculation - 1);
    }
    
    // Daily points: Monster (10 normal / 20 premium) + Send Zeny (30) = 40 normal / 50 premium
    const dailyPoints = isPremiumOpened ? 50 : 40;
    let additionalPoints = (daysForCalculation * dailyPoints) + (weeksForCalculation * BATTLE_PASS_CONFIG.weeklyPoints);
    
    // Add Weekly points for last day if checked
    if (isLastDayDone) {
      additionalPoints += BATTLE_PASS_CONFIG.weeklyPoints;
    }
    
    const projectedTotalPoints = totalPoints + additionalPoints;
    return calculateLevelFromExp(projectedTotalPoints);
  };
  
  const projectedLevelData = calculateProjectedLevel();

  // Thai summary text
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
      <div className="card w-full bg-gradient-to-br from-indigo-50 via-indigo-50 to-indigo-100 shadow-xl border-2 border-indigo-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> Status ปัจจุบัน
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Current Level Display Only */}
            <div className="bg-white rounded-xl p-4 sm:p-5 shadow-md border-l-4 border-indigo-500">
              <label className="label">
                <span className="label-text font-bold text-gray-700 text-sm sm:text-base">Level ปัจจุบัน</span>
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
                <span className="label-text font-bold text-gray-700 text-sm sm:text-base">แต้มปัจจุบัน (รวม)</span>
              </label>
              <input
                type="text"
                value={totalPoints}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setTotalPoints(value ? parseInt(value, 10) : 0);
                }}
                placeholder="0"
                className="input input-bordered input-lg w-full bg-white focus:input-primary border-indigo-300 text-2xl sm:text-3xl font-bold text-center"
              />
              <label className="label">
                <span className="label-text-alt text-gray-500 text-xs">กรอกแต้มรวมปัจจุบัน</span>
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
                    <span className="label-text text-gray-700 font-medium ml-2">ทำ Daily แล้ว</span>
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
                    <span className="label-text text-gray-700 font-medium ml-2">ทำ Weekly แล้ว</span>
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
                    <span className="label-text text-gray-700 font-medium ml-2">Premium Account</span>
                  </label>
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isLastDayDone}
                      onChange={(e) => setIsLastDayDone(e.target.checked)}
                      className="checkbox checkbox-warning"
                    />
                    <span className="label-text text-gray-700 font-medium ml-2">ทำวันสุดท้ายหลังตี 4 ก่อน 6 โมง</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Display breakdown */}
          <div className="mt-6 pt-6 border-t border-indigo-200 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-600 font-semibold mb-2">Level</div>
              <div className="text-3xl sm:text-4xl font-bold text-indigo-600">
                {currentLevel}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 font-semibold mb-2">แต้มใน Level นี้</div>
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                {currentPoints}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-600 font-semibold mb-2">แต้มถึง Level ต่อไป</div>
              <div className="text-2xl sm:text-3xl font-bold text-green-600">
                {formatNumber((maxExpForLevel - currentPoints).toString())}
              </div>
            </div>
          </div>

          {/* Projected Final Level */}
          <div className="mt-6 pt-6 border-t border-indigo-200 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4">
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
                  
                  let daysForCalc = calculation.daysRemaining;
                  let weeksForCalc = 0;
                  
                  // Subtract 1 day for the last day (Wednesday) when server is closed
                  daysForCalc = Math.max(0, daysForCalc - 1);
                  
                  if (isWeeklyDone) {
                    daysForCalc = Math.max(0, daysForCalc - daysRemainingInWeek);
                    weeksForCalc = Math.ceil(daysForCalc / 7);
                  } else {
                    weeksForCalc = Math.ceil(daysForCalc / 7);
                  }
                  
                  if (isDailyDone) {
                    daysForCalc = Math.max(0, daysForCalc - 1);
                  }
                  
                  const dailyPoints = isPremiumOpened ? 50 : 40;
                  let totalAdditional = (daysForCalc * dailyPoints) + (weeksForCalc * BATTLE_PASS_CONFIG.weeklyPoints);
                  if (isLastDayDone) {
                    totalAdditional += BATTLE_PASS_CONFIG.weeklyPoints;
                  }
                  
                  return (
                    <>
                      {isDailyDone && (
                        <div>
                          • Daily: {daysForCalc} วัน × {dailyPoints} = {daysForCalc * dailyPoints}
                          {isWeeklyDone && <span className="text-gray-600"> (หักวันนี้, หักวันที่เหลือ week นี้, หักวันพุธสุดท้าย)</span>}
                          {!isWeeklyDone && <span className="text-gray-600"> (หักวันนี้, หักวันพุธสุดท้าย)</span>}
                        </div>
                      )}
                      {!isDailyDone && (
                        <div>
                          • Daily: {daysForCalc} วัน × {dailyPoints} = {daysForCalc * dailyPoints}
                          <span className="text-gray-600"> (หักวันพุธสุดท้าย)</span>
                        </div>
                      )}
                      
                      {isWeeklyDone && (
                        <div>
                          • Weekly: {weeksForCalc} สัปดาห์ × {BATTLE_PASS_CONFIG.weeklyPoints} = {weeksForCalc * BATTLE_PASS_CONFIG.weeklyPoints}
                          <span className="text-gray-600"> (หักสัปดาห์นี้)</span>
                        </div>
                      )}
                      {!isWeeklyDone && (
                        <div>
                          • Weekly: {weeksForCalc} สัปดาห์ × {BATTLE_PASS_CONFIG.weeklyPoints} = {weeksForCalc * BATTLE_PASS_CONFIG.weeklyPoints}
                        </div>
                      )}
                      
                      {isLastDayDone && (
                        <div>
                          • วันสุดท้าย (หลังตี 4 ก่อน 6 โมง): {BATTLE_PASS_CONFIG.weeklyPoints} (Weekly)
                        </div>
                      )}
                      
                      <div className="font-bold mt-2 text-amber-900 pt-2 border-t border-amber-200">
                        รวม: {totalPoints} + {totalAdditional} = {totalPoints + totalAdditional} แต้ม
                      </div>
                    </>
                  );
                })()}
                
                {isPremiumOpened && <div className="text-yellow-700 font-bold mt-2">💛 Premium Pass</div>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 & 3: Daily and Weekly Quests - 2 Columns on Large Screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 2: Daily Quest */}
        <div className="card bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 shadow-xl border-2 border-blue-200">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-xl sm:text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📅</span> Daily Quest
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {/* Kill Monster Quest */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-2">สังหาร Monster</div>
                    <div className="text-3xl sm:text-4xl font-bold text-blue-600">
                      {isPremiumOpened ? '20' : '10'}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Point</div>
                  </div>
                  <div className="text-4xl">⚔️</div>
                </div>
                <div className="text-xs text-gray-600 bg-blue-50 rounded p-2 mt-3">
                  {isPremiumOpened ? (
                    <div>
                      <div>Premium: 20 Point</div>
                    </div>
                  ) : (
                    <div>
                      <div>Normal: 10 Point</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Send Zeny */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-2">ส่งเงิน 1M Zeny</div>
                    <div className="text-3xl sm:text-4xl font-bold text-green-600">
                      30
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Point</div>
                  </div>
                  <div className="text-4xl">💰</div>
                </div>
                <div className="text-xs text-gray-600 bg-green-50 rounded p-2 mt-3">
                  <div>ส่ง 1,000,000 Zeny</div>
                </div>
              </div>
            </div>

            {/* Daily Summary */}
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="text-center">
                <div className="text-xs text-blue-900 font-semibold mb-2">รวม Daily ต่อวัน</div>
                <div className="flex justify-center gap-4 items-center">
                  <div>
                    <div className="text-sm text-gray-700 font-medium mb-1">สังหาร: {isPremiumOpened ? '20' : '10'} Point</div>
                  </div>
                  <div className="text-gray-400">+</div>
                  <div>
                    <div className="text-sm text-gray-700 font-medium mb-1">ส่งเงิน: 30 Point</div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">=</div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">{isPremiumOpened ? '50' : '40'}</div>
                    <div className="text-xs text-gray-600">Point</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Weekly Quest Summary */}
        <div className="card bg-gradient-to-br from-purple-50 via-purple-50 to-purple-100 shadow-xl border-2 border-purple-200">
          <div className="card-body p-4 sm:p-6">
            <h2 className="card-title text-xl sm:text-2xl font-bold text-purple-900 mb-6 flex items-center gap-2">
              <span className="text-2xl">📊</span> Weekly Quest Summary
            </h2>

            <div className="space-y-4">
              {/* Weekly Points */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-1">ทำ Weekly ครบ ได้แต้ม</div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-600">{calculation.weeklyPoints}</div>
                  </div>
                  <div className="text-4xl">⭐</div>
                </div>
              </div>

              {/* Total Weekly Points (Daily + Weekly) */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-1">รวม Daily + Weekly (7 วัน)</div>
                    <div className="text-2xl sm:text-3xl font-bold text-indigo-600">{calculation.weeklyTotalNormalPoints}</div>
                  </div>
                  <div className="text-4xl">📈</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Weekly Complete Summary */}
      <div className="card bg-gradient-to-br from-emerald-50 via-emerald-50 to-emerald-100 shadow-xl border-2 border-emerald-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🎯</span> สรุปทั้งสัปดาห์
          </h2>

          <div className="space-y-4">
            {/* Total Weekly Points */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 shadow-md text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold mb-1">ได้แต้มรวม</div>
                  <div className="text-3xl sm:text-4xl font-bold">{formatNumber(calculation.weeklyTotalNormalPoints.toString())}</div>
                </div>
                <div className="text-5xl">⭐</div>
              </div>
            </div>

            {/* Total Weekly Zeny */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 shadow-md text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm font-semibold mb-1">จ่ายเงิน Zeny</div>
                  <div className="text-3xl sm:text-4xl font-bold">{formatNumber(calculation.weeklyZenyCost.toString())}</div>
                </div>
                <div className="text-5xl">💸</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
