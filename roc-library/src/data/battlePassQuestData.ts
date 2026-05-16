/**
 * Battle Pass Quest Data - Unified Configuration
 * Contains all quest information and seasonal configurations
 */

// Request Item Interface
export interface RequestItem {
  name: string; // Name of the item/monster/currency (e.g., "Cornus", "Zeny", "Shard of Gigantes")
  type: 'zeny' | 'item' | 'monster'; // Type of request
  amount: number; // Quantity needed
}

// Quest Interface Definition
export interface Quest {
  type: "daily" | "weekly";
  name: string;
  reward: number; // Points earned for completing
  dateRange: string; // When available (e.g., "22/04 - 23/06")
  request?: RequestItem[]; // Items/resources needed with structured data
  details?: {
    monsterName?: string;
    quantity?: number;
    location?: string;
    rotation?: Array<{
      monster: string;
      dateRange: string;
    }>;
  };
}

// Season Configuration Interface
export interface SeasonConfig {
  eventStartDate: Date;
  eventEndDate: Date;
  dailyNormalReward: number; // Total points for normal daily
  dailyPremiumReward: number; // Total points for premium daily
  weeklyReward: number; // Total points for weekly
}

/**
 * DAILY QUESTS - Season 1 (April 22 - June 23, 2026)
 */
export const DAILY_QUESTS: Quest[] = [
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 10,
    dateRange: "22/04 - 24/06",
    request: [
      {
        name: "Cornus",
        type: "monster",
        amount: 10,
      },
    ],
    details: {
      monsterName: "Cornus",
      quantity: 10,
      location: "Cornus dungeon",
    },
  },
  {
    type: "daily",
    name: "Send Zeny",
    reward: 30,
    dateRange: "22/04 - 24/06",
    request: [
      {
        name: "Zeny",
        type: "zeny",
        amount: 1000000,
      },
    ],
  },
];

/**
 * PREMIUM DAILY QUESTS - Rotating monster
 */
export const PREMIUM_DAILY_ROTATION: Quest[] = [
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "22/04 - 06/05",
    request: [
      {
        name: "Hillsrion",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Hillsrion",
      quantity: 20,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "06/05 - 20/05",
    request: [
      {
        name: "Centipede",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Centipede",
      quantity: 20,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "20/05 - 03/06",
    request: [
      {
        name: "Tatacho",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Tatacho",
      quantity: 20,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 10,
    dateRange: "03/06 - 24/06",
    request: [
      {
        name: "Dolomedes",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Dolomedes",
      quantity: 20,
    },
  },
];

/**
 * WEEKLY QUESTS
 */
export const WEEKLY_QUESTS: Quest[] = [
  {
    type: "weekly",
    name: "Celine Kimi",
    reward: 20,
    dateRange: "22/04 - 24/06",
    request: [
      {
        name: "Celine Kimi",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Celine Kimi",
      quantity: 1,
      location: "Horror Toy Factory",
    },
  },
  {
    type: "weekly",
    name: "Faceworm Queen",
    reward: 20,
    dateRange: "22/04 - 24/06",
    request: [
      {
        name: "Faceworm Queen",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Faceworm Queen",
      quantity: 1,
      location: "The Nest of Faceworm",
    },
  },
  {
    type: "weekly",
    name: "Ancient Gigantes",
    reward: 30,
    dateRange: "22/04 - 24/06",
    request: [
      {
        name: "Ancient Gigantes",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Ancient Gigantes",
      quantity: 1,
      location: "Sarah and Fenrir",
    },
  },
  {
    type: "weekly",
    name: "Send Zeny/Items",
    reward: 30,
    dateRange: "22/04 - 24/06",
    request: [
      {
        name: "Shard of Gigantes",
        type: "item",
        amount: 1,
      },
      {
        name: "Zeny",
        type: "zeny",
        amount: 2000000,
      },
    ],
  },
];

/**
 * SEASON 1 CONFIGURATION
 * April 22 - June 24, 2026
 */
export const SEASON_CONFIG: SeasonConfig = {
  eventStartDate: new Date(2026, 3, 22, 12, 0, 0), // April 22, 2026 12:00
  eventEndDate: new Date(2026, 5, 24, 23, 59, 59, 999), // June 24, 2026 23:59
  dailyNormalReward: 40, // 10 (Monster) + 30 (Zeny)
  dailyPremiumReward: 50, // 20 (Premium Monster) + 30 (Zeny)
  weeklyReward: 100, // 20 + 20 + 30 + 30
};

/**
 * Helper Functions
 */

/**
 * Get daily quest total based on account type
 */
export const getDailyQuestTotal = (isPremium: boolean): number => {
  return isPremium
    ? SEASON_CONFIG.dailyPremiumReward
    : SEASON_CONFIG.dailyNormalReward;
};

/**
 * Get weekly quest total
 */
export const getWeeklyQuestTotal = (): number => {
  return SEASON_CONFIG.weeklyReward;
};

/**
 * Get all quests of a specific type
 */
export const getQuestsByType = (type: "daily" | "weekly"): Quest[] => {
  if (type === "daily") {
    return DAILY_QUESTS;
  }
  return WEEKLY_QUESTS;
};

/**
 * Get quest summary for display
 */
export const getQuestSummary = () => {
  return {
    daily: {
      normal: SEASON_CONFIG.dailyNormalReward,
      premium: SEASON_CONFIG.dailyPremiumReward,
    },
    weekly: SEASON_CONFIG.weeklyReward,
    totalDailyQuests: DAILY_QUESTS.length,
    totalWeeklyQuests: WEEKLY_QUESTS.length,
  };
};

/**
 * Get quest by name (utility function)
 */
export const getQuestByName = (name: string): Quest | undefined => {
  const allQuests = [
    ...DAILY_QUESTS,
    ...PREMIUM_DAILY_ROTATION,
    ...WEEKLY_QUESTS,
  ];
  return allQuests.find((quest) => quest.name === name);
};
