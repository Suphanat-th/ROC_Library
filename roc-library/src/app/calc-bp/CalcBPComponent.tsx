"use client";

import React, { useMemo, useState } from "react";
import { CURRENT_SEASON_CONFIG } from "./CalcBPConfig";
import { DAILY_QUESTS, PREMIUM_DAILY_ROTATION, WEEKLY_QUESTS, RequestItem } from "@/data/battlePassQuestData";

interface CalculationResult {
  dailyNormalPoints: number;
  dailyPremiumPoints: number;
  dailyZenyCost: number;
  weeklyPoints: number;
  weeklyTotalNormalPoints: number;
  weeklyTotalPremiumPoints: number;
  weeklyZenyCost: number;
  daysRemaining: number;
  weeksRemaining: number;
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
// Max level is 100
const calculateLevelFromExp = (totalPoints: number, isPremium: boolean = false) => {
  if (totalPoints < 50) {
    return {
      level: 0,
      currentExp: totalPoints,
      maxExp: 50,
    };
  }

  let level = 1 + Math.floor((totalPoints - 50) / 10);
  const currentExp = (totalPoints - 50) % 10;

  // Cap max level at 100 only for Normal Pass
  if (!isPremium && level > 100) {
    level = 100;
  }

  return {
    level,
    currentExp,
    maxExp: 10,
  };
};

// Helper function to get the currently active premium daily quest
// based on today's date and the dateRange (format: "DD/MM - DD/MM")
const getActivePremiumDailyQuest = (today: Date = new Date()): typeof PREMIUM_DAILY_ROTATION[0] | null => {
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1; // getMonth is 0-indexed
  const currentDay = today.getDate();

  for (const quest of PREMIUM_DAILY_ROTATION) {
    const [startStr, endStr] = quest.dateRange.split(' - ');
    const [startDay, startMonth] = startStr.split('/').map(Number);
    const [endDay, endMonth] = endStr.split('/').map(Number);

    // Create comparable dates (same year)
    const startDate = new Date(currentYear, startMonth - 1, startDay);
    const endDate = new Date(currentYear, endMonth - 1, endDay);
    const checkDate = new Date(currentYear, currentMonth - 1, currentDay);

    if (checkDate >= startDate && checkDate <= endDate) {
      return quest;
    }
  }

  return null;
};

export default function CalcBPComponent() {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  
  // Daily Quests - track completion by quest name (auto-checked on initial load)
  const [completedDailyQuests, setCompletedDailyQuests] = useState<Record<string, boolean>>({
    'Monster Hunt': true,
    'Send Zeny': true,
  });
  
  // Weekly Quests - track completion by quest name (auto-checked on initial load)
  const [completedWeeklyQuests, setCompletedWeeklyQuests] = useState<Record<string, boolean>>({
    'Celine Kimi': true,
    'Faceworm Queen': true,
    'Ancient Gigantes': true,
    'Send Zeny/Items': true,
  });
  
  const [isPremiumOpened, setIsPremiumOpened] = useState<boolean>(false);
  const [isLastDayDailyDone, setIsLastDayDailyDone] = useState<boolean>(false);
  const [isLastDayWeeklyDone, setIsLastDayWeeklyDone] = useState<boolean>(false);
  const [isDailyCompleted, setIsDailyCompleted] = useState<boolean>(false);
  const [isWeeklyCompleted, setIsWeeklyCompleted] = useState<boolean>(false);
  
  // Last Day quest selections
  const [isLastDayDailyQuests, setIsLastDayDailyQuests] = useState<Record<string, boolean>>({});
  const [isLastDayWeeklyQuests, setIsLastDayWeeklyQuests] = useState<Record<string, boolean>>({});
  
  // Quest Completion Status - for calculating reduced remaining days/weeks
  const [completedDailyQuestsList, setCompletedDailyQuestsList] = useState<Record<string, boolean>>({});
  const [completedWeeklyQuestsList, setCompletedWeeklyQuestsList] = useState<Record<string, boolean>>({});
  
  const [targetLevel, setTargetLevel] = useState<number>(0);

  // Get the active premium daily quest for today
  const activePremiumDailyQuest = getActivePremiumDailyQuest();

  // Helper function to get all daily quests (premium or normal)
  const getAllDailyQuests = () => {
    if (isPremiumOpened && activePremiumDailyQuest) {
      return [activePremiumDailyQuest, DAILY_QUESTS[1]]; // Premium + Send Zeny
    }
    return DAILY_QUESTS;
  };

  // Handler for Last Day Daily with auto-check children
  const handleLastDayDailyChange = (checked: boolean) => {
    setIsLastDayDailyDone(checked);
    if (checked) {
      // Auto-check all children when parent is checked
      const allDailyQuests = getAllDailyQuests();
      const newState: Record<string, boolean> = {};
      allDailyQuests.forEach(quest => {
        newState[quest.name] = true;
      });
      // Also explicitly ensure Send Zeny is checked if Premium
      if (isPremiumOpened) {
        newState['Send Zeny'] = true;
      }
      setIsLastDayDailyQuests(newState);
    } else {
      // Uncheck all children when parent is unchecked
      setIsLastDayDailyQuests({});
    }
  };

  // Handler for Last Day Weekly with auto-check children
  const handleLastDayWeeklyChange = (checked: boolean) => {
    setIsLastDayWeeklyDone(checked);
    if (checked) {
      const newState: Record<string, boolean> = {};
      WEEKLY_QUESTS.forEach(quest => {
        newState[quest.name] = true;
      });
      setIsLastDayWeeklyQuests(newState);
    } else {
      setIsLastDayWeeklyQuests({});
    }
  };

  // Handler for Daily Completed with auto-check children
  const handleDailyCompletedChange = (checked: boolean) => {
    setIsDailyCompleted(checked);
    if (checked) {
      const allDailyQuests = getAllDailyQuests();
      const newState: Record<string, boolean> = {};
      allDailyQuests.forEach(quest => {
        newState[quest.name] = true;
      });
      setCompletedDailyQuestsList(newState);
    } else {
      setCompletedDailyQuestsList({});
    }
  };

  // Handler for Weekly Completed with auto-check children
  const handleWeeklyCompletedChange = (checked: boolean) => {
    setIsWeeklyCompleted(checked);
    if (checked) {
      const newState: Record<string, boolean> = {};
      WEEKLY_QUESTS.forEach(quest => {
        newState[quest.name] = true;
      });
      setCompletedWeeklyQuestsList(newState);
    } else {
      setCompletedWeeklyQuestsList({});
    }
  };

  // Check if all daily quests are completed
  const isDailyDone = Object.values(completedDailyQuests).every((val) => val);
  
  // Check if all weekly quests are completed
  const isWeeklyDone = Object.values(completedWeeklyQuests).every((val) => val);

  // Auto-calculate level and remaining points from total
  const levelData = calculateLevelFromExp(totalPoints, isPremiumOpened);
  const currentLevel = levelData.level;
  const currentPoints = levelData.currentExp;
  const maxExpForLevel = levelData.maxExp;

  // Quest configuration from current season
  const dailyNormalTotal = CURRENT_SEASON_CONFIG.dailyQuests.normal.reward;
  const dailyPremiumTotal = CURRENT_SEASON_CONFIG.dailyQuests.premium.reward;
  const weeklyTotal = CURRENT_SEASON_CONFIG.weeklyQuests.reward;
  
  // Fixed Zeny costs for quests
  const dailyZenyCostAmount = 1000000; // 1M Zeny per day
  const weeklyZenyCostAmount = 2000000; // 2M Zeny per week

  // Calculate daily points for current account type
  const currentDailyPoints = isPremiumOpened
    ? dailyPremiumTotal
    : dailyNormalTotal;

  const calculation = useMemo<CalculationResult>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startDate = new Date(CURRENT_SEASON_CONFIG.eventStartDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(CURRENT_SEASON_CONFIG.eventEndDate);
    endDate.setHours(23, 59, 59, 999);

    // Calculate days from start to today
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysSinceStart = Math.max(
      0,
      Math.floor((today.getTime() - startDate.getTime()) / millisecondsPerDay) +
        1,
    );
    let daysRemaining = Math.max(
      0,
      Math.floor((endDate.getTime() - today.getTime()) / millisecondsPerDay),
    );

    // Weekly calculation - count Wednesday resets from this week (Week 1 = today's week) until endDate
    const WEDNESDAY = 3;
    let weeksRemaining = 0;
    
    // Start from the Wednesday of this week (or earlier if today is after Wed)
    const weekStartDate = new Date(today);
    const daysToWednesday = (weekStartDate.getDay() - WEDNESDAY + 7) % 7;
    weekStartDate.setDate(weekStartDate.getDate() - daysToWednesday);
    
    // Count Wednesdays from this week's Wednesday until endDate
    const currentDate = new Date(weekStartDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() === WEDNESDAY) {
        weeksRemaining++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    // Subtract 1 week for cooldown (จะคำนวนอาทิตย์ปัจจุบัน และ Cooldown 1 อาทิตย์)
    weeksRemaining = Math.max(0, weeksRemaining - 1);

    // Calculate current progress (days completed up to today)
    const completedDays = Math.max(0, daysSinceStart);
    
    // Count completed weeks (Wednesday resets that have occurred)
    let completedWeeks = 0;
    const checkDate = new Date(startDate);
    
    while (checkDate < today) {
      if (checkDate.getDay() === WEDNESDAY) {
        completedWeeks++;
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }

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
      weeksRemaining,
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
    isDailyCompleted,
    completedDailyQuestsList,
    isWeeklyCompleted,
    completedWeeklyQuestsList,
  ]);

  const formatNumber = (num: number | string) => {
    const numValue = typeof num === "string" ? parseInt(num, 10) : num;
    return numValue.toLocaleString("th-TH");
  };

  // Helper function to format request array to string
  const formatRequest = (request: RequestItem[] | undefined): string => {
    if (!request || request.length === 0) return 'N/A';
    
    return request
      .map((req) => `${req.amount}x ${req.name}`)
      .join(' + ');
  };

  // Total current points is just the input
  const totalCurrentPoints = totalPoints;
  const totalNormalProjectionPoints =
    totalCurrentPoints + calculation.projection.normalPoints;
  const totalPremiumProjectionPoints =
    totalCurrentPoints + calculation.projection.premiumPoints;

  const finalNormalData = calculateLevelFromExp(totalNormalProjectionPoints, false);
  const finalNormalLevel = finalNormalData.level;
  const finalNormalRemainingPoints = finalNormalData.currentExp;

  const finalPremiumData = calculateLevelFromExp(totalPremiumProjectionPoints, true);
  const finalPremiumLevel = finalPremiumData.level;
  const finalPremiumRemainingPoints = finalPremiumData.currentExp;

  // Calculate projected level based on checkboxes with smart calculation
  const calculateProjectedLevel = () => {
    // Check if any daily quest is checked in main section
    const hasDailyQuestChecked = completedDailyQuests['Monster Hunt'] || completedDailyQuests['Send Zeny'];
    
    // Check if any weekly quest is checked in main section
    const hasWeeklyQuestChecked = Object.values(completedWeeklyQuests).some((checked) => checked);

    // Daily points: Monster (10 normal / 20 premium) + Send Zeny (30) = 40 normal / 50 premium
    const dailyPoints = isPremiumOpened ? dailyPremiumTotal : dailyNormalTotal;
    
    let additionalPoints = 0;

    // Only add daily points if at least one daily quest is checked in main section
    if (hasDailyQuestChecked) {
      let daysForDailyCalc = Math.max(0, calculation.daysRemaining);
      additionalPoints += daysForDailyCalc * dailyPoints;
    }

    // Only add weekly points if at least one weekly quest is checked in main section
    if (hasWeeklyQuestChecked) {
      let weeksForCalculation = calculation.weeksRemaining;
      additionalPoints += weeksForCalculation * weeklyTotal;
    }

    // Subtract points for "Quest ที่ทำสำเร็จแล้ว - Daily" - subtract sum of checked daily quest rewards
    if (isDailyCompleted) {
      let completionDailyPointsDeduct = 0;
      if (isPremiumOpened && activePremiumDailyQuest) {
        if (completedDailyQuestsList[activePremiumDailyQuest.name]) {
          completionDailyPointsDeduct += activePremiumDailyQuest.reward;
        }
      } else {
        DAILY_QUESTS.forEach(quest => {
          if (completedDailyQuestsList[quest.name]) {
            completionDailyPointsDeduct += quest.reward;
          }
        });
      }
      if (completedDailyQuestsList['Send Zeny'] && isPremiumOpened && activePremiumDailyQuest) {
        completionDailyPointsDeduct += DAILY_QUESTS[1].reward;
      }
      // Subtract the sum of checked quest rewards
      additionalPoints -= completionDailyPointsDeduct;
    }

    // Subtract points for "Quest ที่ทำสำเร็จแล้ว - Weekly" - subtract sum of checked weekly quest rewards
    if (isWeeklyCompleted) {
      let completionWeeklyPointsDeduct = 0;
      WEEKLY_QUESTS.forEach((quest) => {
        if (completedWeeklyQuestsList[quest.name]) {
          completionWeeklyPointsDeduct += quest.reward;
        }
      });
      // Subtract the sum of checked quest rewards
      additionalPoints -= completionWeeklyPointsDeduct;
    }

    // Add Last Day Daily points - only count from CHECKED children
    if (isLastDayDailyDone) {
      let lastDayDailyPointsCalc = 0;
      if (isPremiumOpened && activePremiumDailyQuest) {
        if (isLastDayDailyQuests[activePremiumDailyQuest.name]) {
          lastDayDailyPointsCalc += activePremiumDailyQuest.reward;
        }
      } else {
        DAILY_QUESTS.forEach(quest => {
          if (isLastDayDailyQuests[quest.name]) {
            lastDayDailyPointsCalc += quest.reward;
          }
        });
      }
      if (isLastDayDailyQuests['Send Zeny'] && isPremiumOpened && activePremiumDailyQuest) {
        lastDayDailyPointsCalc += DAILY_QUESTS[1].reward;
      }
      additionalPoints += lastDayDailyPointsCalc;
    }

    // Add Last Day Weekly points - only count from CHECKED children
    if (isLastDayWeeklyDone) {
      let lastDayWeeklyPointsCalc = 0;
      WEEKLY_QUESTS.forEach((quest) => {
        if (isLastDayWeeklyQuests[quest.name]) {
          lastDayWeeklyPointsCalc += quest.reward;
        }
      });
      additionalPoints += lastDayWeeklyPointsCalc;
    }

    const projectedTotalPoints = totalPoints + additionalPoints;
    return calculateLevelFromExp(projectedTotalPoints, isPremiumOpened);
  };

  const projectedLevelData = calculateProjectedLevel();

  // Calculate days needed to reach target level
  const calculateDaysNeeded = () => {
    if (targetLevel <= currentLevel) {
      return {
        daysNeeded: 0,
        weeksNeeded: 0,
        pointsNeeded: 0,
        isAlreadyReached: targetLevel <= currentLevel,
      };
    }

    // Points required to reach target level
    const pointsForTargetLevel =
      targetLevel <= 0 ? 0 : 50 + (targetLevel - 1) * 10;
    const pointsNeeded = Math.max(0, pointsForTargetLevel - totalPoints);

    if (pointsNeeded === 0) {
      return {
        daysNeeded: 0,
        weeksNeeded: 0,
        pointsNeeded: 0,
        isAlreadyReached: true,
      };
    }

    // Daily points and weekly calculation
    const dailyPointsPerDay = isPremiumOpened
      ? dailyPremiumTotal
      : dailyNormalTotal;

    // Find minimum days where: (days × dailyPoints) + (weeks × 100) >= pointsNeeded
    // weeks = Math.ceil(days / 7)
    let daysNeeded = 0;
    let accumulatedPoints = 0;

    while (accumulatedPoints < pointsNeeded) {
      daysNeeded++;
      const weeksFromDays = Math.ceil(daysNeeded / 7);
      accumulatedPoints = (daysNeeded * dailyPointsPerDay) + (weeksFromDays * 100); // 100 = weekly points
    }

    const weeksNeeded = Math.ceil(daysNeeded / 7);

    return {
      daysNeeded,
      weeksNeeded,
      pointsNeeded,
      isAlreadyReached: false,
    };
  };

  const daysNeededData = calculateDaysNeeded();

  // Calculate total resource requirements based on checked quests × remaining time periods
  const calculateResourcesNeeded = () => {
    let totalZeny = 0;
    const items: Record<string, number> = {};

    // Daily quests - multiply by remaining days
    if (completedDailyQuests['Monster Hunt']) {
      if (isPremiumOpened && activePremiumDailyQuest) {
        // Premium monster hunt
        if (Array.isArray(activePremiumDailyQuest.request)) {
          activePremiumDailyQuest.request.forEach((req: RequestItem) => {
            if (req.type === 'zeny') {
              totalZeny += req.amount * calculation.daysRemaining;
            } else if (req.type === 'item') {
              items[req.name] = (items[req.name] || 0) + req.amount * calculation.daysRemaining;
            }
          });
        }
      } else {
        // Normal Monster Hunt
        if (Array.isArray(DAILY_QUESTS[0].request)) {
          DAILY_QUESTS[0].request.forEach((req: RequestItem) => {
            if (req.type === 'zeny') {
              totalZeny += req.amount * calculation.daysRemaining;
            } else if (req.type === 'item') {
              items[req.name] = (items[req.name] || 0) + req.amount * calculation.daysRemaining;
            }
          });
        }
      }
    }

    if (completedDailyQuests['Send Zeny']) {
      if (Array.isArray(DAILY_QUESTS[1].request)) {
        DAILY_QUESTS[1].request.forEach((req: RequestItem) => {
          if (req.type === 'zeny') {
            totalZeny += req.amount * calculation.daysRemaining;
          } else if (req.type === 'item') {
            items[req.name] = (items[req.name] || 0) + req.amount * calculation.daysRemaining;
          }
        });
      }
    }

    // Weekly quests - multiply by remaining weeks
    WEEKLY_QUESTS.forEach((quest) => {
      if (completedWeeklyQuests[quest.name] && Array.isArray(quest.request)) {
        quest.request.forEach((req: RequestItem) => {
          if (req.type === 'zeny') {
            totalZeny += req.amount * calculation.weeksRemaining;
          } else if (req.type === 'item') {
            items[req.name] = (items[req.name] || 0) + req.amount * calculation.weeksRemaining;
          }
        });
      }
    });

    return { totalZeny, items };
  };

  const resourcesNeeded = calculateResourcesNeeded();

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
      {/* Card 0: Event Timeline - TOP CARD */}
      <div className="card w-full bg-linear-to-br from-orange-50 via-orange-50 to-orange-100 shadow-xl border-2 border-orange-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-2xl sm:text-3xl font-bold text-orange-900 mb-6 flex items-center gap-2">
            <span className="text-3xl">📅</span> Event Timeline
          </h2>

          {/* Date and Time Remaining Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Start Date */}
            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-green-500">
              <div className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">เริ่มวันที่</div>
              <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">
                {CURRENT_SEASON_CONFIG.eventStartDate.getDate()}
              </div>
              <div className="text-sm text-gray-700 font-semibold">
                {CURRENT_SEASON_CONFIG.eventStartDate.toLocaleDateString("en-GB", {
                  month: "long",
                })}{" "}
                {CURRENT_SEASON_CONFIG.eventStartDate.getFullYear()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                เวลา {CURRENT_SEASON_CONFIG.eventStartDate.getHours().toString().padStart(2, "0")}:
                {CURRENT_SEASON_CONFIG.eventStartDate.getMinutes().toString().padStart(2, "0")} น.
              </div>
            </div>

            {/* End Date */}
            <div className="bg-white rounded-xl p-5 shadow-md border-l-4 border-red-500">
              <div className="text-xs text-gray-600 font-semibold mb-2 uppercase tracking-wide">จบวันที่</div>
              <div className="text-3xl sm:text-4xl font-bold text-red-600 mb-1">
                {CURRENT_SEASON_CONFIG.eventEndDate.getDate()}
              </div>
              <div className="text-sm text-gray-700 font-semibold">
                {CURRENT_SEASON_CONFIG.eventEndDate.toLocaleDateString("en-GB", {
                  month: "long",
                })}{" "}
                {CURRENT_SEASON_CONFIG.eventEndDate.getFullYear()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                เวลา {CURRENT_SEASON_CONFIG.eventEndDate.getHours().toString().padStart(2, "0")}:
                {CURRENT_SEASON_CONFIG.eventEndDate.getMinutes().toString().padStart(2, "0")} น.
              </div>
            </div>
          </div>

          {/* Time Remaining Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Days Remaining */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-xl p-5 shadow-md text-white">
              <div className="text-xs font-semibold mb-3 opacity-90 uppercase tracking-wide">เหลือเวลา (วัน)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl sm:text-5xl font-bold">{calculation.daysRemaining}</div>
                <div className="text-lg font-semibold">วัน</div>
              </div>
            </div>

            {/* Weeks Remaining */}
            <div className="bg-linear-to-br from-cyan-500 to-cyan-600 rounded-xl p-5 shadow-md text-white">
              <div className="text-xs font-semibold mb-3 opacity-90 uppercase tracking-wide">เหลือเวลา (อาทิตย์)</div>
              <div className="flex items-baseline gap-2">
                <div className="text-4xl sm:text-5xl font-bold">{calculation.weeksRemaining}</div>
                <div className="text-lg font-semibold">สัปดาห์</div>
              </div>
            </div>
          </div>

          {/* Resources Calculator for Quest Submission */}
          <div className="bg-linear-to-r from-green-100 to-emerald-100 rounded-xl p-6 border-2 border-green-400 shadow-md">
            <div className="space-y-4 text-green-900">
              <div className="font-bold flex items-center gap-2 text-lg sm:text-xl">
                <span>💰</span> ทรัพยากรณ์ตามระยะยเวลาที่เหลือ
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ml-6 text-sm sm:text-base">
                {/* Zeny Amount */}
                <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-green-300">
                  <div className="font-semibold text-green-800 mb-2">💵 Zeny ที่ต้องใช้</div>
                  {resourcesNeeded.totalZeny > 0 ? (
                    <div className="text-green-700 font-bold text-lg">
                      {(resourcesNeeded.totalZeny / 1_000_000).toLocaleString('th-TH', { maximumFractionDigits: 0 })} M Zeny
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">ไม่มี</div>
                  )}
                </div>

                {/* Items Needed */}
                <div className="bg-white bg-opacity-60 rounded-lg p-4 border border-green-300">
                  <div className="font-semibold text-green-800 mb-2">📦 Item ที่ต้องใช้</div>
                  {Object.keys(resourcesNeeded.items).length > 0 ? (
                    <div className="text-green-700 font-bold space-y-1">
                      {Object.entries(resourcesNeeded.items).map(([item, quantity]) => (
                        <div key={item} className="text-sm">
                          • {quantity}x {item}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-gray-500 italic">ไม่มี</div>
                  )}
                </div>
              </div>

              {/* No resources if nothing checked */}
              {resourcesNeeded.totalZeny === 0 && Object.keys(resourcesNeeded.items).length === 0 && (
                <div className="text-center text-gray-600 italic ml-6">ไม่มีการเลือก Quest</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Card 1: Current Points Input (w-full) */}
      <div className="card w-full bg-linear-to-br from-indigo-50 via-indigo-50 to-indigo-100 shadow-xl border-2 border-indigo-200">
        <div className="card-body p-4 sm:p-6">
          <h2 className="card-title text-xl sm:text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> Status ปัจจุบัน
          </h2>

          {/* Row 1: Current Points Input */}
          <div className="mb-6">
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
              {/* Display Current Level */}
              <div className="mt-3 bg-indigo-100 rounded-lg p-4 border border-indigo-300">
                <div className="text-center">
                  <div className="text-xs text-indigo-700 font-semibold mb-1">Level ปัจจุบัน</div>
                  <div className="text-3xl sm:text-4xl font-bold text-indigo-600">
                    {currentLevel}
                  </div>
                  <div className="text-xs text-indigo-600 mt-1">
                    {currentPoints}/{maxExpForLevel} แต้ม
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Checkboxes Section - Organized */}
          <div className="mb-6 pb-6 border-b border-indigo-200">
            <div className="text-xs font-bold text-indigo-900 mb-4">⚙️ Options & Filter</div>
            <div className="space-y-4">
              {/* Section 1: Account Type */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <div className="text-xs font-bold text-yellow-900 mb-3 flex items-center gap-2">
                  <span>💛</span> Account Type
                </div>
                <div className="form-control">
                  <label className="label cursor-pointer gap-3">
                    <input
                      type="checkbox"
                      checked={isPremiumOpened}
                      onChange={(e) => setIsPremiumOpened(e.target.checked)}
                      className="checkbox checkbox-lg checkbox-accent"
                    />
                    <span className="label-text font-semibold text-gray-700">
                      {isPremiumOpened ? '💛 Premium Pass เปิดอยู่ (+10 แต้ม/วัน)' : '⚪ Normal Pass'}
                    </span>
                  </label>
                </div>
              </div>

              {/* Section 2: Daily Quests Progress */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-2">
                  <span>✅</span> Daily Quest Progress
                </div>
                <div className="space-y-2">
                  {isPremiumOpened ? (
                    <>
                      {/* Show only the currently active Premium Daily Quest */}
                      {activePremiumDailyQuest ? (
                        <div className="form-control">
                          <label className="label cursor-pointer gap-3">
                            <input
                              type="checkbox"
                              checked={completedDailyQuests[activePremiumDailyQuest.name] || false}
                              onChange={(e) =>
                                setCompletedDailyQuests({
                                  ...completedDailyQuests,
                                  [activePremiumDailyQuest.name]: e.target.checked,
                                })
                              }
                              className="checkbox checkbox-primary"
                            />
                            <span className="label-text text-gray-700 font-medium">
                              {activePremiumDailyQuest.name} ({formatRequest(activePremiumDailyQuest.request)}) {activePremiumDailyQuest.reward} แต้ม
                            </span>
                          </label>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500">No active premium quest</div>
                      )}
                      {/* Send Zeny is same for both */}
                      <div className="form-control">
                        <label className="label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={completedDailyQuests['Send Zeny'] || false}
                            onChange={(e) =>
                              setCompletedDailyQuests({
                                ...completedDailyQuests,
                                'Send Zeny': e.target.checked,
                              })
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-gray-700 font-medium">
                            Send Zeny ({formatRequest(DAILY_QUESTS[1].request)}) {DAILY_QUESTS[1].reward} แต้ม
                          </span>
                        </label>
                      </div>
                    </>
                  ) : (
                    DAILY_QUESTS.map((quest) => (
                      <div key={quest.name} className="form-control">
                        <label className="label cursor-pointer gap-3">
                          <input
                            type="checkbox"
                            checked={completedDailyQuests[quest.name] || false}
                            onChange={(e) =>
                              setCompletedDailyQuests({
                                ...completedDailyQuests,
                                [quest.name]: e.target.checked,
                              })
                            }
                            className="checkbox checkbox-primary"
                          />
                          <span className="label-text text-gray-700 font-medium">
                            {quest.name} ({formatRequest(quest.request)}) {quest.reward} แต้ม
                          </span>
                        </label>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Section 3: Weekly Quests Progress */}
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                <div className="text-xs font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <span>🐉</span> Weekly Quest Progress
                </div>
                <div className="space-y-2">
                  {WEEKLY_QUESTS.map((quest) => (
                    <div key={quest.name} className="form-control">
                      <label className="label cursor-pointer gap-3">
                        <input
                          type="checkbox"
                          checked={completedWeeklyQuests[quest.name] || false}
                          onChange={(e) =>
                            setCompletedWeeklyQuests({
                              ...completedWeeklyQuests,
                              [quest.name]: e.target.checked,
                            })
                          }
                          className="checkbox checkbox-warning"
                        />
                        <span className="label-text text-gray-700 font-medium">
                          {quest.name} ({formatRequest(quest.request)}) {quest.reward} แต้ม
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 4: Last Day Bonus (24 มิถุนายน) */}
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                <div className="text-xs font-bold text-orange-900 mb-3 flex items-center gap-2">
                  <span>⏰</span> Last Day Bonus (24 มิถุนายน)
                </div>
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={isLastDayDailyDone}
                        onChange={(e) => handleLastDayDailyChange(e.target.checked)}
                        className="checkbox checkbox-info"
                      />
                      <span className="label-text text-gray-700 font-medium">ทำ Daily ในวันสุดท้าย</span>
                    </label>
                    {isLastDayDailyDone && (
                      <div className="ml-8 mt-2 p-2 bg-white rounded border border-orange-200 text-xs text-gray-600 space-y-1">
                        <div className="font-semibold text-orange-900 mb-2">เลือก quest ที่จะทำ:</div>
                        {isPremiumOpened ? (
                          activePremiumDailyQuest ? (
                            <div className="form-control">
                              <label className="label cursor-pointer gap-2 p-1">
                                <input
                                  type="checkbox"
                                  checked={isLastDayDailyQuests[activePremiumDailyQuest.name] || false}
                                  onChange={(e) =>
                                    setIsLastDayDailyQuests({
                                      ...isLastDayDailyQuests,
                                      [activePremiumDailyQuest.name]: e.target.checked,
                                    })
                                  }
                                  className="checkbox checkbox-xs"
                                />
                                <span className="label-text text-xs">{activePremiumDailyQuest.name} ({formatRequest(activePremiumDailyQuest.request)}) • {activePremiumDailyQuest.reward} แต้ม</span>
                              </label>
                            </div>
                          ) : null
                        ) : (
                          DAILY_QUESTS.map((quest) => (
                            <div key={quest.name} className="form-control">
                              <label className="label cursor-pointer gap-2 p-1">
                                <input
                                  type="checkbox"
                                  checked={isLastDayDailyQuests[quest.name] || false}
                                  onChange={(e) =>
                                    setIsLastDayDailyQuests({
                                      ...isLastDayDailyQuests,
                                      [quest.name]: e.target.checked,
                                    })
                                  }
                                  className="checkbox checkbox-xs"
                                />
                                <span className="label-text text-xs">{quest.name} ({formatRequest(quest.request)}) • {quest.reward} แต้ม</span>
                              </label>
                            </div>
                          ))
                        )}
                        {isPremiumOpened && activePremiumDailyQuest && (
                          <div className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={isLastDayDailyQuests['Send Zeny'] || false}
                                onChange={(e) =>
                                  setIsLastDayDailyQuests({
                                    ...isLastDayDailyQuests,
                                    'Send Zeny': e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">Send Zeny ({formatRequest(DAILY_QUESTS[1].request)}) • {DAILY_QUESTS[1].reward} แต้ม</span>
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={isLastDayWeeklyDone}
                        onChange={(e) => handleLastDayWeeklyChange(e.target.checked)}
                        className="checkbox checkbox-info"
                      />
                      <span className="label-text text-gray-700 font-medium">ทำ Weekly ในวันสุดท้าย</span>
                    </label>
                    {isLastDayWeeklyDone && (
                      <div className="ml-8 mt-2 p-2 bg-white rounded border border-orange-200 text-xs text-gray-600 space-y-1">
                        <div className="font-semibold text-orange-900 mb-2">เลือก quest ที่จะทำ:</div>
                        {WEEKLY_QUESTS.map((quest) => (
                          <div key={quest.name} className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={isLastDayWeeklyQuests[quest.name] || false}
                                onChange={(e) =>
                                  setIsLastDayWeeklyQuests({
                                    ...isLastDayWeeklyQuests,
                                    [quest.name]: e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">{quest.name} ({formatRequest(quest.request)}) • {quest.reward} แต้ม</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 5: Quest Already Completed */}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <div className="text-xs font-bold text-green-900 mb-3 flex items-center gap-2">
                  <span>✅</span> Quest ที่ทำสำเร็จแล้ว
                </div>
                <div className="space-y-3">
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={isDailyCompleted}
                        onChange={(e) => handleDailyCompletedChange(e.target.checked)}
                        className="checkbox checkbox-success"
                      />
                      <span className="label-text text-gray-700 font-medium">Daily completed</span>
                    </label>
                    {isDailyCompleted && (
                      <div className="ml-8 mt-2 p-2 bg-white rounded border border-green-200 text-xs text-gray-600 space-y-1">
                        <div className="font-semibold text-green-900 mb-2">เลือก quest ที่ทำไปแล้ว:</div>
                        {isPremiumOpened ? (
                          activePremiumDailyQuest ? (
                            <div className="form-control">
                              <label className="label cursor-pointer gap-2 p-1">
                                <input
                                  type="checkbox"
                                  checked={completedDailyQuestsList[activePremiumDailyQuest.name] || false}
                                  onChange={(e) =>
                                    setCompletedDailyQuestsList({
                                      ...completedDailyQuestsList,
                                      [activePremiumDailyQuest.name]: e.target.checked,
                                    })
                                  }
                                  className="checkbox checkbox-xs"
                                />
                                <span className="label-text text-xs">{activePremiumDailyQuest.name} • {activePremiumDailyQuest.reward} แต้ม</span>
                              </label>
                            </div>
                          ) : null
                        ) : (
                          DAILY_QUESTS.map((quest) => (
                            <div key={quest.name} className="form-control">
                              <label className="label cursor-pointer gap-2 p-1">
                                <input
                                  type="checkbox"
                                  checked={completedDailyQuestsList[quest.name] || false}
                                  onChange={(e) =>
                                    setCompletedDailyQuestsList({
                                      ...completedDailyQuestsList,
                                      [quest.name]: e.target.checked,
                                    })
                                  }
                                  className="checkbox checkbox-xs"
                                />
                                <span className="label-text text-xs">{quest.name} • {quest.reward} แต้ม</span>
                              </label>
                            </div>
                          ))
                        )}
                        {isPremiumOpened && activePremiumDailyQuest && (
                          <div className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={completedDailyQuestsList['Send Zeny'] || false}
                                onChange={(e) =>
                                  setCompletedDailyQuestsList({
                                    ...completedDailyQuestsList,
                                    'Send Zeny': e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">Send Zeny • {DAILY_QUESTS[1].reward} แต้ม</span>
                            </label>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="form-control">
                    <label className="label cursor-pointer gap-3">
                      <input
                        type="checkbox"
                        checked={isWeeklyCompleted}
                        onChange={(e) => handleWeeklyCompletedChange(e.target.checked)}
                        className="checkbox checkbox-success"
                      />
                      <span className="label-text text-gray-700 font-medium">Weekly completed</span>
                    </label>
                    {isWeeklyCompleted && (
                      <div className="ml-8 mt-2 p-2 bg-white rounded border border-green-200 text-xs text-gray-600 space-y-1">
                        <div className="font-semibold text-green-900 mb-2">เลือก quest ที่ทำไปแล้ว:</div>
                        {WEEKLY_QUESTS.map((quest) => (
                          <div key={quest.name} className="form-control">
                            <label className="label cursor-pointer gap-2 p-1">
                              <input
                                type="checkbox"
                                checked={completedWeeklyQuestsList[quest.name] || false}
                                onChange={(e) =>
                                  setCompletedWeeklyQuestsList({
                                    ...completedWeeklyQuestsList,
                                    [quest.name]: e.target.checked,
                                  })
                                }
                                className="checkbox checkbox-xs"
                              />
                              <span className="label-text text-xs">{quest.name} • {quest.reward} แต้ม</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
                  // Calculate original daily points
                  let originalDailyPoints = 0;
                  if (completedDailyQuests['Monster Hunt']) {
                    originalDailyPoints += isPremiumOpened ? 20 : 10;
                  }
                  if (completedDailyQuests['Send Zeny']) {
                    originalDailyPoints += 30;
                  }

                  // Calculate Last Day Daily points separately
                  // Only count from children that are actually checked
                  let lastDayDailyPoints = 0;
                  if (isLastDayDailyDone) {
                    // Only add points from checked children
                    if (isPremiumOpened && activePremiumDailyQuest) {
                      if (isLastDayDailyQuests[activePremiumDailyQuest.name]) {
                        lastDayDailyPoints += activePremiumDailyQuest.reward;
                      }
                    } else {
                      DAILY_QUESTS.forEach(quest => {
                        if (isLastDayDailyQuests[quest.name]) {
                          lastDayDailyPoints += quest.reward;
                        }
                      });
                    }
                    if (isLastDayDailyQuests['Send Zeny'] && isPremiumOpened && activePremiumDailyQuest) {
                      lastDayDailyPoints += DAILY_QUESTS[1].reward;
                    }
                  }

                  // Calculate Completion Status Daily points separately
                  let completionDailyPoints = 0;
                  if (isDailyCompleted) {
                    if (isPremiumOpened && activePremiumDailyQuest) {
                      if (completedDailyQuestsList[activePremiumDailyQuest.name]) {
                        completionDailyPoints += activePremiumDailyQuest.reward;
                      }
                    } else {
                      DAILY_QUESTS.forEach(quest => {
                        if (completedDailyQuestsList[quest.name]) {
                          completionDailyPoints += quest.reward;
                        }
                      });
                    }
                    if (completedDailyQuestsList['Send Zeny'] && isPremiumOpened && activePremiumDailyQuest) {
                      completionDailyPoints += DAILY_QUESTS[1].reward;
                    }
                  }

                  // Calculate original weekly points
                  let originalWeeklyPoints = 0;
                  WEEKLY_QUESTS.forEach((quest) => {
                    if (completedWeeklyQuests[quest.name]) {
                      originalWeeklyPoints += quest.reward;
                    }
                  });

                  // Calculate Last Day Weekly points separately
                  // Only count from children that are actually checked
                  let lastDayWeeklyPoints = 0;
                  if (isLastDayWeeklyDone) {
                    // Only add points from checked children
                    WEEKLY_QUESTS.forEach((quest) => {
                      if (isLastDayWeeklyQuests[quest.name]) {
                        lastDayWeeklyPoints += quest.reward;
                      }
                    });
                  }

                  // Calculate Completion Status Weekly points separately
                  let completionWeeklyPoints = 0;
                  if (isWeeklyCompleted) {
                    WEEKLY_QUESTS.forEach((quest) => {
                      if (completedWeeklyQuestsList[quest.name]) {
                        completionWeeklyPoints += quest.reward;
                      }
                    });
                  }

                  // Daily calculation: independent from weekly
                  const daysForDailyCalc = Math.max(0, calculation.daysRemaining);

                  // Weekly calculation: independent from daily
                  const weeksForCalc = calculation.weeksRemaining;

                  // Calculate total additional points
                  let totalAdditional = 0;
                  
                  // Add original daily points
                  if (originalDailyPoints > 0) {
                    totalAdditional += daysForDailyCalc * originalDailyPoints;
                  }
                  
                  // Subtract Quest Completion Daily points (simple subtraction, no multiplication)
                  if (isDailyCompleted && completionDailyPoints > 0) {
                    totalAdditional -= completionDailyPoints;
                  }
                  
                  // Add original weekly points
                  if (originalWeeklyPoints > 0) {
                    totalAdditional += weeksForCalc * originalWeeklyPoints;
                  }
                  
                  // Subtract Quest Completion Weekly points (simple subtraction, no multiplication)
                  if (isWeeklyCompleted && completionWeeklyPoints > 0) {
                    totalAdditional -= completionWeeklyPoints;
                  }
                  
                  // Add Last Day Daily points (simple addition, no multiplication)
                  if (isLastDayDailyDone && lastDayDailyPoints > 0) {
                    totalAdditional += lastDayDailyPoints;
                  }
                  
                  // Add Last Day Weekly points (simple addition, no multiplication)
                  if (isLastDayWeeklyDone && lastDayWeeklyPoints > 0) {
                    totalAdditional += lastDayWeeklyPoints;
                  }

                  return (
                    <>
                      {originalDailyPoints > 0 && (
                        <div>
                          • Daily: {daysForDailyCalc} วัน × {originalDailyPoints} ={" "}
                          {daysForDailyCalc * originalDailyPoints}
                        </div>
                      )}

                      {isDailyCompleted && completionDailyPoints > 0 && (
                        <div className="text-red-600 font-semibold">
                          • Quest Completion Daily: - {completionDailyPoints}
                        </div>
                      )}

                      {originalWeeklyPoints > 0 && (
                        <div>
                          • Weekly: {weeksForCalc} สัปดาห์ × {originalWeeklyPoints} ={" "}
                          {weeksForCalc * originalWeeklyPoints}
                        </div>
                      )}

                      {isWeeklyCompleted && completionWeeklyPoints > 0 && (
                        <div className="text-red-600 font-semibold">
                          • Quest Completion Weekly: - {completionWeeklyPoints}
                        </div>
                      )}

                      {isLastDayDailyDone && lastDayDailyPoints > 0 && (
                        <div className="text-yellow-600 font-semibold">
                          • Last Day Daily: + {lastDayDailyPoints}
                        </div>
                      )}

                      {isLastDayWeeklyDone && lastDayWeeklyPoints > 0 && (
                        <div className="text-yellow-600 font-semibold">
                          • Last Day Weekly: + {lastDayWeeklyPoints}
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
              {/* Monster Hunt Quest - From DAILY_QUESTS or PREMIUM_DAILY_ROTATION */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-2">
                      🐉 Monster Hunt
                    </div>
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
                        <div key={quest.name} className="flex justify-between">
                          <span>{formatRequest(quest.request)}</span>
                          <span className="text-blue-600 font-bold">
                            {quest.dateRange}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span>{formatRequest(DAILY_QUESTS[0].request)}</span>
                      <span className="text-blue-600 font-bold">
                        {DAILY_QUESTS[0].dateRange}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Send Zeny - From DAILY_QUESTS */}
              <div className="bg-white rounded-xl p-4 shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="text-xs text-gray-600 font-semibold mb-2">
                      💰 {DAILY_QUESTS[1].name}
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-600">
                      {DAILY_QUESTS[1].reward}
                    </div>
                    <div className="text-xs text-gray-500">Point</div>
                  </div>
                  <div className="text-4xl">💸</div>
                </div>
                <div className="text-xs text-gray-600 bg-green-50 rounded p-3">
                  <div>{formatRequest(DAILY_QUESTS[1].request)}</div>
                  <div className="text-green-600 font-semibold mt-2">
                    {DAILY_QUESTS[1].dateRange}
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
                      สังหาร: {isPremiumOpened ? PREMIUM_DAILY_ROTATION[0].reward : DAILY_QUESTS[0].reward} Point
                    </div>
                  </div>
                  <div className="text-gray-400">+</div>
                  <div>
                    <div className="text-sm text-gray-700 font-medium mb-1">
                      ส่งเงิน: {DAILY_QUESTS[1].reward} Point
                    </div>
                  </div>
                  <div className="text-lg font-bold text-blue-600">=</div>
                  <div>
                    <div className="text-3xl font-bold text-blue-600">
                      {isPremiumOpened ? PREMIUM_DAILY_ROTATION[0].reward + DAILY_QUESTS[1].reward : DAILY_QUESTS[0].reward + DAILY_QUESTS[1].reward}
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
                  {WEEKLY_QUESTS.slice(0, 3).map((quest, index) => {
                    const colors = ['red', 'orange', 'purple'];
                    return (
                      <div key={quest.name} className={`flex justify-between items-start p-2 bg-${colors[index]}-50 rounded`}>
                        <div>
                          <div className={`font-bold text-${colors[index]}-700`}>{quest.name}</div>
                          <div className="text-gray-600">{quest.details?.location}</div>
                          <div className="text-gray-500 mt-1">{quest.dateRange}</div>
                        </div>
                        <div className="text-right">
                          <div className={`font-bold text-${colors[index]}-600`}>{quest.reward} P</div>
                          <div className="text-gray-600">×{quest.details?.quantity || 1}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Send Zeny/Items Section */}
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
                          {daysNeededData.weeksNeeded}
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
                    {(() => {
                      const sumDaily = daysNeededData.daysNeeded * currentDailyPoints;
                      return (
                        <div className="flex justify-between items-center mb-3">
                          <div className="text-xs font-bold text-purple-700">
                            📋 Quest ที่ต้องทำ ({daysNeededData.daysNeeded} วัน):
                          </div>
                          <div className="text-sm font-bold text-purple-600">
                            {formatNumber(sumDaily.toString())} P
                          </div>
                        </div>
                      );
                    })()}
                    <div className="space-y-2 text-sm">
                      {/* Daily Points */}
                      <div className="flex justify-between items-center p-2 bg-blue-600 rounded text-white font-bold">
                        <span>📅 Daily Quest</span>
                        <span>
                          {isPremiumOpened
                            ? dailyPremiumTotal
                            : dailyNormalTotal}{" "}
                          P × {daysNeededData.daysNeeded} ={" "}
                          {(isPremiumOpened
                            ? dailyPremiumTotal
                            : dailyNormalTotal) * daysNeededData.daysNeeded}
                        </span>
                      </div>

                      {/* Weekly Points */}
                      {daysNeededData.weeksNeeded > 0 && (
                        <div className="flex justify-between items-center p-2 bg-purple-600 rounded text-white font-bold">
                          <span>📊 Weekly Quest</span>
                          <span>
                            {weeklyTotal} P × {daysNeededData.weeksNeeded} ={" "}
                            {weeklyTotal * daysNeededData.weeksNeeded}
                          </span>
                        </div>
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
                            2000000 * daysNeededData.weeksNeeded
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
                        {daysNeededData.weeksNeeded} ={" "}
                        {formatNumber(
                          (
                            2000000 * daysNeededData.weeksNeeded
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
                        ✓ ต้องทำ {daysNeededData.daysNeeded} วัน ({daysNeededData.weeksNeeded} สัปดาห์) เสีย{" "}
                        {formatNumber(
                          (
                            1000000 * daysNeededData.daysNeeded +
                            2000000 * daysNeededData.weeksNeeded
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
