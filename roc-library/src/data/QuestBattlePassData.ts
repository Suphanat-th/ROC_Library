// Battle Pass Quest Configuration
// Shows Daily (Normal/Premium) and Weekly quest rewards

export interface Quest {
  name: string;
  location?: string;
  reward: number; // Points
  zenyRequired?: number; // Zeny cost (if applicable)
  dateRange?: string;
  monsterName?: string; // For monster hunts
  quantity?: number; // Number of kills required
}

export interface DailyQuests {
  normal: {
    monsterHunt: Quest;
    sendZeny: Quest;
    total: number;
  };
  premium: {
    monsterHunt: Quest;
    sendZeny: Quest;
    total: number;
  };
}

export interface WeeklyQuests {
  bosses: Quest[];
  sendZeny: Quest;
  total: number;
}

// Daily Quests Configuration
export const DAILY_QUESTS: DailyQuests = {
  normal: {
    monsterHunt: {
      name: 'Monster Hunt',
      monsterName: 'Cornus',
      quantity: 20,
      reward: 10,
      dateRange: '22/04 - 24/06',
    },
    sendZeny: {
      name: 'Send Zeny',
      zenyRequired: 1000000, // 1M Zeny
      reward: 30,
      dateRange: '22/04 - 24/06',
    },
    total: 40,
  },
  premium: {
    monsterHunt: {
      name: 'Monster Hunt (Premium)',
      quantity: 20,
      reward: 20,
      dateRange: 'Rotating',
    },
    sendZeny: {
      name: 'Send Zeny',
      zenyRequired: 1000000, // 1M Zeny
      reward: 30,
      dateRange: '22/04 - 24/06',
    },
    total: 50,
  },
};

// Premium Monster Hunt Rotation
export const PREMIUM_MONSTER_ROTATION = [
  {
    monster: 'HILLSRION',
    quantity: 20,
    dateRange: '22/04 - 06/05',
    reward: 20,
  },
  {
    monster: 'CENTIPEDE',
    quantity: 20,
    dateRange: '06/05 - 20/05',
    reward: 20,
  },
  {
    monster: 'TATACHO',
    quantity: 20,
    dateRange: '20/05 - 03/06',
    reward: 20,
  },
  {
    monster: 'DOLOMEDES',
    quantity: 20,
    dateRange: '03/06 - 24/06',
    reward: 20,
  },
];

// Weekly Quests Configuration
export const WEEKLY_QUESTS: WeeklyQuests = {
  bosses: [
    {
      name: 'Celine Kimi',
      location: 'Horror Toy Factory',
      quantity: 1,
      reward: 20,
    },
    {
      name: 'Faceworm Queen',
      location: 'The Nest of Faceworm',
      quantity: 1,
      reward: 20,
    },
    {
      name: 'Ancient Gigantes',
      location: 'Sarah and Fenrir',
      quantity: 1,
      reward: 30,
    },
  ],
  sendZeny: {
    name: 'Send Zeny (Weekly)',
    zenyRequired: 2000000, // 2M Zeny
    reward: 30,
  },
  total: 100,
};

// Helper function to get daily quest total
export const getDailyQuestTotal = (isPremium: boolean): number => {
  return isPremium ? DAILY_QUESTS.premium.total : DAILY_QUESTS.normal.total;
};

// Helper function to get weekly quest breakdown
export const getWeeklyQuestBreakdown = () => {
  const bossTotal = WEEKLY_QUESTS.bosses.reduce((sum, boss) => sum + boss.reward, 0);
  const zenyTotal = WEEKLY_QUESTS.sendZeny.reward;
  
  return {
    bosses: bossTotal,
    sendZeny: zenyTotal,
    total: bossTotal + zenyTotal,
  };
};

// Summary
export const BATTLE_PASS_QUESTS_SUMMARY = {
  daily: {
    normal: DAILY_QUESTS.normal.total,
    premium: DAILY_QUESTS.premium.total,
  },
  weekly: WEEKLY_QUESTS.total,
  weeklyBreakdown: {
    bosses: 70, // 20 + 20 + 30
    sendZeny: 30, // 2M Zeny
  },
};
