"use client";

import React, { useMemo, useState } from "react";
import {
  DAILY_QUESTS,
  PREMIUM_DAILY_ROTATION,
  WEEKLY_QUESTS,
  RequestItem,
  SEASON_CONFIG,
} from "@/data/battlePassQuestData";
import EventTimelineSection from "./components/EventTimelineSection";
import CurrentStatusSection from "./components/CurrentStatusSection";
import DailyQuestSection from "./components/DailyQuestSection";
import WeeklyQuestSection from "./components/WeeklyQuestSection";
import SummarySection from "./components/SummarySection";
import LevelCalcSection from "./components/LevelCalcSection";
import { CalculationResult, LevelData } from "./types";
import { toThaiDateOnly } from "@/utils/timezoneUtils";

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
  } as LevelData;
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
  const [levelCalcPoints, setLevelCalcPoints] = useState<number>(0);
  
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

  // Auto-calculate level and remaining points from total
  const levelData = calculateLevelFromExp(totalPoints, isPremiumOpened);
  const currentLevel = levelData.level;
  const currentPoints = levelData.currentExp;
  const maxExpForLevel = levelData.maxExp;

  const levelCalcData = calculateLevelFromExp(levelCalcPoints, isPremiumOpened);
  const levelCalcCurrentLevel = levelCalcData.level;

  // Quest totals are derived from quest data to keep config minimal.
  const normalMonsterReward = DAILY_QUESTS[0]?.reward ?? 0;
  const sendZenyReward = DAILY_QUESTS[1]?.reward ?? 0;
  const premiumMonsterReward =
    activePremiumDailyQuest?.reward ?? PREMIUM_DAILY_ROTATION[0]?.reward ?? normalMonsterReward;

  const dailyNormalTotal = normalMonsterReward + sendZenyReward;
  const dailyPremiumTotal = premiumMonsterReward + sendZenyReward;
  const weeklyTotal = WEEKLY_QUESTS.reduce((sum, quest) => sum + quest.reward, 0);
  
  // Fixed Zeny costs for quests
  const dailyZenyCostAmount = 1000000; // 1M Zeny per day
  const weeklyZenyCostAmount = 2000000; // 2M Zeny per week

  // Calculate daily points for current account type
  const currentDailyPoints = isPremiumOpened
    ? dailyPremiumTotal
    : dailyNormalTotal;

  const calculation = useMemo<CalculationResult>(() => {
    const today = toThaiDateOnly(new Date());
    const startDate = toThaiDateOnly(SEASON_CONFIG.eventStartDate);
    const endDate1day = toThaiDateOnly(SEASON_CONFIG.eventEndDate);
    endDate1day.setDate(endDate1day.getDate() - 1); // Subtract 1 day for inclusive end date
    const endDate = toThaiDateOnly(endDate1day);

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

    // Weekly calculation - count Wednesday resets from this week (Week 1 = today's week) until endDate
    const WEDNESDAY = 3;
    let weeksRemaining = 0;
    
    // Start from the Wednesday of this week (or earlier if today is after Wed)
    const weekStartDate = new Date(today);
    const daysToWednesday = (weekStartDate.getDay() - WEDNESDAY + 7) % 7;
    weekStartDate.setDate(weekStartDate.getDate() - daysToWednesday);
    
    // Count week buckets using Wednesday as the first day of each week.
    const currentDate = new Date(weekStartDate);
    while (currentDate <= endDate) {
      if (currentDate.getDay() === WEDNESDAY) {
        weeksRemaining++;
      }
      currentDate.setDate(currentDate.getDate() + 7);
    }

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
    const daysForDailyCalc = Math.max(0, calculation.daysRemaining);
    const weeksForCalc = Math.max(0, calculation.weeksRemaining);

    let dailyPointsPerDay = 0;
    if (isPremiumOpened && activePremiumDailyQuest) {
      if (completedDailyQuests[activePremiumDailyQuest.name]) {
        dailyPointsPerDay += activePremiumDailyQuest.reward;
      }
    } else if (completedDailyQuests['Monster Hunt']) {
      dailyPointsPerDay += DAILY_QUESTS[0].reward;
    }
    if (completedDailyQuests['Send Zeny']) {
      dailyPointsPerDay += DAILY_QUESTS[1].reward;
    }

    let weeklyPointsPerWeek = 0;
    WEEKLY_QUESTS.forEach((quest) => {
      if (completedWeeklyQuests[quest.name]) {
        weeklyPointsPerWeek += quest.reward;
      }
    });

    let completionDailyPointsDeduct = 0;
    if (isDailyCompleted) {
      if (isPremiumOpened && activePremiumDailyQuest) {
        if (completedDailyQuestsList[activePremiumDailyQuest.name]) {
          completionDailyPointsDeduct += activePremiumDailyQuest.reward;
        }
      } else {
        DAILY_QUESTS.forEach((quest) => {
          if (completedDailyQuestsList[quest.name]) {
            completionDailyPointsDeduct += quest.reward;
          }
        });
      }
      if (isPremiumOpened && activePremiumDailyQuest && completedDailyQuestsList['Send Zeny']) {
        completionDailyPointsDeduct += DAILY_QUESTS[1].reward;
      }
    }

    let completionWeeklyPointsDeduct = 0;
    if (isWeeklyCompleted) {
      WEEKLY_QUESTS.forEach((quest) => {
        if (completedWeeklyQuestsList[quest.name]) {
          completionWeeklyPointsDeduct += quest.reward;
        }
      });
    }

    let lastDayDailyPoints = 0;
    if (isLastDayDailyDone) {
      if (isPremiumOpened && activePremiumDailyQuest) {
        if (isLastDayDailyQuests[activePremiumDailyQuest.name]) {
          lastDayDailyPoints += activePremiumDailyQuest.reward;
        }
      } else {
        DAILY_QUESTS.forEach((quest) => {
          if (isLastDayDailyQuests[quest.name]) {
            lastDayDailyPoints += quest.reward;
          }
        });
      }
      if (isPremiumOpened && activePremiumDailyQuest && isLastDayDailyQuests['Send Zeny']) {
        lastDayDailyPoints += DAILY_QUESTS[1].reward;
      }
    }

    let lastDayWeeklyPoints = 0;
    if (isLastDayWeeklyDone) {
      WEEKLY_QUESTS.forEach((quest) => {
        if (isLastDayWeeklyQuests[quest.name]) {
          lastDayWeeklyPoints += quest.reward;
        }
      });
    }

    const additionalPoints =
      daysForDailyCalc * dailyPointsPerDay +
      weeksForCalc * weeklyPointsPerWeek -
      completionDailyPointsDeduct -
      completionWeeklyPointsDeduct +
      lastDayDailyPoints +
      lastDayWeeklyPoints;

    const projectedTotalPoints = Math.max(0, totalPoints + additionalPoints);
    return calculateLevelFromExp(projectedTotalPoints, isPremiumOpened);
  };

  const projectedLevelData = calculateProjectedLevel();

  // Calculate days needed to reach target level
  const calculateDaysNeeded = () => {
    if (targetLevel <= levelCalcCurrentLevel) {
      return {
        daysNeeded: 0,
        weeksNeeded: 0,
        pointsNeeded: 0,
        isAlreadyReached: targetLevel <= levelCalcCurrentLevel,
      };
    }

    // Points required to reach target level
    const pointsForTargetLevel =
      targetLevel <= 0 ? 0 : 50 + (targetLevel - 1) * 10;
    const pointsNeeded = Math.max(0, pointsForTargetLevel - levelCalcPoints);

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
    <div className="mx-auto w-full max-w-7xl space-y-7 p-1 sm:p-2 lg:space-y-8">
      <div className="collapse collapse-arrow border border-slate-200/80 bg-white/75 shadow-lg backdrop-blur-sm">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title px-5 py-4 text-lg font-black tracking-tight text-slate-800 sm:text-xl">
          1. รายละเอียด Battle Pass (BP)
        </div>
        <div className="collapse-content space-y-6 px-2 pb-4 sm:px-3">
          <EventTimelineSection
            calculation={calculation}
            resourcesNeeded={resourcesNeeded}
          />

          <CurrentStatusSection
            totalPoints={totalPoints}
            setTotalPoints={setTotalPoints}
            currentLevel={currentLevel}
            currentPoints={currentPoints}
            maxExpForLevel={maxExpForLevel}
            isPremiumOpened={isPremiumOpened}
            setIsPremiumOpened={setIsPremiumOpened}
            activePremiumDailyQuest={activePremiumDailyQuest}
            completedDailyQuests={completedDailyQuests}
            setCompletedDailyQuests={setCompletedDailyQuests}
            completedWeeklyQuests={completedWeeklyQuests}
            setCompletedWeeklyQuests={setCompletedWeeklyQuests}
            isLastDayDailyDone={isLastDayDailyDone}
            handleLastDayDailyChange={handleLastDayDailyChange}
            isLastDayDailyQuests={isLastDayDailyQuests}
            setIsLastDayDailyQuests={setIsLastDayDailyQuests}
            isLastDayWeeklyDone={isLastDayWeeklyDone}
            handleLastDayWeeklyChange={handleLastDayWeeklyChange}
            isLastDayWeeklyQuests={isLastDayWeeklyQuests}
            setIsLastDayWeeklyQuests={setIsLastDayWeeklyQuests}
            isDailyCompleted={isDailyCompleted}
            handleDailyCompletedChange={handleDailyCompletedChange}
            completedDailyQuestsList={completedDailyQuestsList}
            setCompletedDailyQuestsList={setCompletedDailyQuestsList}
            isWeeklyCompleted={isWeeklyCompleted}
            handleWeeklyCompletedChange={handleWeeklyCompletedChange}
            completedWeeklyQuestsList={completedWeeklyQuestsList}
            setCompletedWeeklyQuestsList={setCompletedWeeklyQuestsList}
            projectedLevelData={projectedLevelData}
            calculation={calculation}
            formatRequest={formatRequest}
          />
        </div>
      </div>

      <div className="collapse collapse-arrow border border-slate-200/80 bg-white/75 shadow-lg backdrop-blur-sm">
        <input type="checkbox" defaultChecked={false} />
        <div className="collapse-title px-5 py-4 text-lg font-black tracking-tight text-slate-800 sm:text-xl">
          2. Daily , Weekly , Summary
        </div>
        <div className="collapse-content space-y-6 px-2 pb-4 sm:px-3">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DailyQuestSection
              isPremiumOpened={isPremiumOpened}
              formatRequest={formatRequest}
            />

            <WeeklyQuestSection
              calculation={calculation}
              formatRequest={formatRequest}
            />
          </div>

          <SummarySection
            calculation={calculation}
            formatNumber={formatNumber}
          />
        </div>
      </div>

      <div className="collapse collapse-arrow border border-slate-200/80 bg-white/75 shadow-lg backdrop-blur-sm">
        <input type="checkbox" defaultChecked={false} />
        <div className="collapse-title px-5 py-4 text-lg font-black tracking-tight text-slate-800 sm:text-xl">
          3. Level Calc
        </div>
        <div className="collapse-content px-2 pb-4 sm:px-3">
          <LevelCalcSection
            totalPoints={levelCalcPoints}
            currentLevel={levelCalcCurrentLevel}
            targetLevel={targetLevel}
            setTargetLevel={setTargetLevel}
            setTotalPoints={setLevelCalcPoints}
            isPremiumOpened={isPremiumOpened}
            setIsPremiumOpened={setIsPremiumOpened}
            daysNeededData={daysNeededData}
            currentDailyPoints={currentDailyPoints}
            dailyPremiumTotal={dailyPremiumTotal}
            dailyNormalTotal={dailyNormalTotal}
            weeklyTotal={weeklyTotal}
            formatNumber={formatNumber}
          />
        </div>
      </div>
    </div>
  );
}
