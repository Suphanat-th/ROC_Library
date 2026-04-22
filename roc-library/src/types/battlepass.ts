export interface BattlePassData {
  dailyNormalPoints: number;
  dailyPremiumPoints: number;
  weeklyPoints: number;
  dailyZenyCost: number;
  weeklyZenyCost: number;
  eventStartDate: Date;
  eventEndDate: Date;
}

export interface BattlePassCalculation {
  dailyNormalPoints: number;
  dailyPremiumPoints: number;
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
