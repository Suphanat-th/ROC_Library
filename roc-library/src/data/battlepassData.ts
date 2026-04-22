export const BATTLE_PASS_CONFIG = {
  // Daily Quest Points
  dailyNormalPoints: 10, // Normal Pass: 10 points per day
  dailyPremiumPoints: 20, // Premium Pass: 20 points per day
  
  // Weekly Quest Points
  weeklyPoints: 100, // 20 + 20 + 30 + 30 from 4 quests
  
  // Zeny Costs
  dailyZenyCost: 1_000_000, // Daily quest: Send 1M Zeny
  weeklyZenyCost: 2_000_000, // Weekly quest: Send 2M Zeny
  
  // Event Duration
  eventStartDate: new Date(2026, 3, 22, 12, 0, 0), // April 22, 2026 12:00
  eventEndDate: new Date(2026, 5, 24, 5, 59, 0), // June 24, 2026 05:59
};

export const QUEST_DETAILS = {
  daily: [
    {
      name: 'Kill Cornus x20 (All time)',
      points: 10,
      description: 'Available: 22/04/2026 – 24/06/2026',
    },
    {
      name: 'Kill Rotating Monster x20',
      points: 20,
      description: 'Rotates based on event timeline',
      details: [
        'Hillslion: 22/04/2026 – 06/05/2026',
        'Centipede: 06/05/2026 – 20/05/2026',
        'Tatacho: 20/05/2026 – 03/06/2026',
        'Dolomedes: 03/06/2026 – 24/06/2026',
      ],
    },
    {
      name: 'Send 1,000,000 Zeny',
      points: 30,
      description: 'Available: 22/04/2026 – 24/06/2026',
    },
  ],
  weekly: [
    {
      name: 'Kill Celine Kimi (Horror Toy Factory Boss)',
      points: 20,
      description: 'Boss Dungeon: Horror Toy Factory',
    },
    {
      name: 'Kill Faceworm Queen (Faceworm Nest Boss)',
      points: 20,
      description: 'Boss Dungeon: The Nest of Faceworm',
    },
    {
      name: 'Kill Ancient Gigantes (Sarah and Fenrir Boss)',
      points: 30,
      description: 'Boss Dungeon: Sarah and Fenrir',
    },
    {
      name: 'Send Shard of Gigantes x1 + 2,000,000 Zeny',
      points: 30,
      description: 'Drop from Ancient Gigantes dungeon',
    },
  ],
};
