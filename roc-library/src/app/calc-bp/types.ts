export interface CalculationResult {
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

export interface LevelData {
  level: number;
  currentExp: number;
  maxExp: number;
}

export interface DaysNeededData {
  daysNeeded: number;
  weeksNeeded: number;
  pointsNeeded: number;
  isAlreadyReached: boolean;
}

export interface ResourcesNeeded {
  totalZeny: number;
  items: Record<string, number>;
}
