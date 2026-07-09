/**
 * Battle Pass Quest Data - Unified Configuration
 * Contains all quest information and seasonal configurations
 */

// Request Item Interface
export interface RequestItem {
  name: string; // Name of the item/monster/currency (e.g., "Cornus", "Zeny", "Shard of Gigantes")
  type: "zeny" | "item" | "monster"; // Type of request
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
  seasonNumber?: number; // Optional season number for display
}

/**
 * DAILY QUESTS - Season 6 (July 9 - September 8, 2026)
 */
export const DAILY_QUESTS: Quest[] = [
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 10,
    dateRange: "08/07 - 09/09",
    request: [
      {
        name: "Bloody Murderer",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Bloody Murderer",
      quantity: 20,
      location: "",
    },
  },
  {
    type: "daily",
    name: "Send Zeny",
    reward: 30,
    dateRange: "08/07 - 09/09",
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
    dateRange: "08/07 - 22/07",
    request: [
      {
        name: "Disguise",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Disguise",
      quantity: 20,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "22/07 - 05/08",
    request: [
      {
        name: "Gibbet",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Gibbet",
      quantity: 20,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "05/08 - 19/08",
    request: [
      {
        name: "Dullahan",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Dullahan",
      quantity: 20,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "19/08 - 09/09",
    request: [
      {
        name: "Quve",
        type: "monster",
        amount: 20,
      },
    ],
    details: {
      monsterName: "Quve",
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
    name: "Amdarais",
    reward: 20,
    dateRange: "08/07 - 09/09",
    request: [
      {
        name: "Amdarais",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Amdarais",
      quantity: 1,
      location: "Boss ดัน Old Glast Heim",
    },
  },
  {
    type: "weekly",
    name: "Evil Believer",
    reward: 20,
    dateRange: "08/07 - 09/09",
    request: [
      {
        name: "Evil Believer",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Evil Believer",
      quantity: 1,
      location: "Boss ดัน Raid Devil Secret",
    },
  },
  {
    type: "weekly",
    name: "Torturous Redeemer",
    reward: 30,
    dateRange: "08/07 - 09/09",
    request: [
      {
        name: "Torturous Redeemer",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Torturous Redeemer",
      quantity: 1,
      location: "Boss ดัน Ghost Palace",
    },
  },
  {
    type: "weekly",
    name: "Send Zeny/Items",
    reward: 30,
    dateRange: "08/07 - 09/09",
    request: [
      {
        name: " Gray Shard",
        type: "item",
        amount: 10,
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
 * SEASON 6 CONFIGURATION
 * July 9 - September 8, 2026
 */
export const SEASON_CONFIG: SeasonConfig = {
  eventStartDate: new Date(2026, 6, 8, 14, 0, 0), // April 22, 2026 12:00
  eventEndDate: new Date(2026, 8, 9, 6, 0, 0, 0), // June 24, 2026 23:59
  seasonNumber: 6, // Season 5 for display
};

/**
 * Helper Functions
 */

/**
 * Get daily quest total based on account type
 */
export const getDailyQuestTotal = (isPremium: boolean): number => {
  const sendZenyReward = DAILY_QUESTS[1]?.reward ?? 0;
  const normalMonsterReward = DAILY_QUESTS[0]?.reward ?? 0;
  const premiumMonsterReward =
    PREMIUM_DAILY_ROTATION[0]?.reward ?? normalMonsterReward;

  return isPremium
    ? premiumMonsterReward + sendZenyReward
    : normalMonsterReward + sendZenyReward;
};

/**
 * Get weekly quest total
 */
export const getWeeklyQuestTotal = (): number => {
  return WEEKLY_QUESTS.reduce((sum, quest) => sum + quest.reward, 0);
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
      normal: getDailyQuestTotal(false),
      premium: getDailyQuestTotal(true),
    },
    weekly: getWeeklyQuestTotal(),
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
