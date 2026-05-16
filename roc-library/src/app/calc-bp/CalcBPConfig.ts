// Battle Pass Seasonal Content Configuration
// Edit this file when a new season starts to change dates
// Quest rewards are now managed in battlePassQuestData.ts

import { SEASON_CONFIG } from "@/data/battlePassQuestData";

export interface CalcBPSeasonConfig {
  // Event dates
  eventStartDate: Date;
  eventEndDate: Date;
  
  // Daily Quest configuration
  dailyQuests: {
    normal: { reward: number };
    premium: { reward: number };
  };
  
  // Weekly Quest configuration
  weeklyQuests: {
    reward: number;
  };
}

// CURRENT SEASON: Season 1 (April 22 - June 23, 2026)
// All values are synced with SEASON_CONFIG from battlePassQuestData.ts
export const CURRENT_SEASON_CONFIG: CalcBPSeasonConfig = {
  // Event Duration
  eventStartDate: SEASON_CONFIG.eventStartDate,
  eventEndDate: SEASON_CONFIG.eventEndDate,
  
  // Daily Quest Rewards
  dailyQuests: {
    normal: {
      reward: SEASON_CONFIG.dailyNormalReward,
    },
    premium: {
      reward: SEASON_CONFIG.dailyPremiumReward,
    },
  },
  
  // Weekly Quest Rewards
  weeklyQuests: {
    reward: SEASON_CONFIG.weeklyReward,
  },
};

// NOTE: When starting a new season:
// 1. Update dates, daily rewards, and weekly rewards in battlePassQuestData.ts > SEASON_CONFIG
// 2. This file will automatically sync with the new values
// 3. No need to edit this file unless you want to override specific values

