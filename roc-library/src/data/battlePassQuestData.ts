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
  type: "daily" | "weekly" | "season";
  name: string;
  reward: number; // Points earned for completing
  dateRange: string; // When available (e.g., "22/04 - 23/06")
  image?: string; // Public path of the image shown on the quest ticket
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
 * DAILY QUESTS - Season 6 (October 7, 2026 - January 13, 2027)
 */
export const DAILY_QUESTS: Quest[] = [
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 10,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/1278.gif",
    request: [
      {
        name: "Stalactic Golem",
        type: "monster",
        amount: 10,
      },
    ],
    details: {
      monsterName: "Stalactic Golem",
      quantity: 10,
      location: "",
    },
  },
  {
    type: "daily",
    name: "Send Zeny",
    reward: 20,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/horrortoyfactory/treasure.gif",
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
    dateRange: "07/10 - 21/10",
    image: "/assets/images/monsterDb/3020.gif",
    request: [
      {
        name: "Fire Condor",
        type: "monster",
        amount: 10,
      },
    ],
    details: {
      monsterName: "Fire Condor",
      quantity: 10,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "21/10 - 25/11",
    image: "/assets/images/monsterDb/3022.gif",
    request: [
      {
        name: "Fire Frilldora",
        type: "monster",
        amount: 10,
      },
    ],
    details: {
      monsterName: "Fire Frilldora",
      quantity: 10,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "25/11 - 09/12",
    image: "/assets/images/monsterDb/3023.gif",
    request: [
      {
        name: "Fire Golem",
        type: "monster",
        amount: 10,
      },
    ],
    details: {
      monsterName: "Fire Golem",
      quantity: 10,
    },
  },
  {
    type: "daily",
    name: "Monster Hunt",
    reward: 20,
    dateRange: "09/12 - 13/01",
    image: "/assets/images/monsterDb/3021.gif",
    request: [
      {
        name: "Fire Sandman",
        type: "monster",
        amount: 10,
      },
    ],
    details: {
      monsterName: "Fire Sandman",
      quantity: 10,
    },
  },
];

/**
 * WEEKLY QUESTS
 */
export const WEEKLY_QUESTS: Quest[] = [
  {
    type: "weekly",
    name: "Torturous Redeemer",
    reward: 15,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/2959.gif",
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
    name: "Infinite Tao Gunka",
    reward: 15,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/1583.gif",
    request: [
      {
        name: "Infinite Tao Gunka",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Infinite Tao Gunka",
      quantity: 1,
    },
  },
  {
    type: "weekly",
    name: "Awakened Ferre",
    reward: 20,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/3073.gif",
    request: [
      {
        name: "Awakened Ferre",
        type: "monster",
        amount: 1,
      },
    ],
    details: {
      monsterName: "Awakened Ferre",
      quantity: 1,
    },
  },
  {
    type: "weekly",
    name: "Send Zeny/Items",
    reward: 20,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/horrortoyfactory/treasure.gif",
    request: [
      {
        name: "Tooth of Jitterbug",
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
 * SEASON QUESTS - Premium only, one-time each
 */
export const SEASON_QUESTS: Quest[] = [
  {
    type: "season",
    name: "Ferre (Dancer)",
    reward: 100,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/3072.gif",
    request: [{ name: "Ferre (Dancer)", type: "monster", amount: 850 }],
    details: { monsterName: "Ferre (Dancer)", quantity: 850 },
  },
  {
    type: "season",
    name: "Ferre (Hammer)",
    reward: 100,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/3071.gif",
    request: [{ name: "Ferre (Hammer)", type: "monster", amount: 350 }],
    details: { monsterName: "Ferre (Hammer)", quantity: 350 },
  },
  {
    type: "season",
    name: "Ferre (Guitar)",
    reward: 100,
    dateRange: "07/10 - 13/01",
    image: "/assets/images/monsterDb/3070.gif",
    request: [{ name: "Ferre (Guitar)", type: "monster", amount: 950 }],
    details: { monsterName: "Ferre (Guitar)", quantity: 950 },
  },
];

/**
 * SEASON 6 CONFIGURATION
 * October 7, 2026 - January 13, 2027
 */
export const SEASON_CONFIG: SeasonConfig = {
  eventStartDate: new Date(2026, 9, 7, 14, 0, 0), // 7 Oct 2026 14:00
  eventEndDate: new Date(2027, 0, 13, 6, 0, 0, 0), // 13 Jan 2027 06:00
  seasonNumber: 6,
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
export const getQuestsByType = (
  type: "daily" | "weekly" | "season",
): Quest[] => {
  if (type === "daily") {
    return DAILY_QUESTS;
  }
  if (type === "season") {
    return SEASON_QUESTS;
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
    ...SEASON_QUESTS,
  ];
  return allQuests.find((quest) => quest.name === name);
};
