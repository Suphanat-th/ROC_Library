# Battle Pass Quest Data Refactoring - Migration Guide

## Summary
ทำการรวม Quest Data ทั้งหมดจาก 2 ไฟล์เป็น 1 ไฟล์เดียวพร้อมปรับปรุง Interface

## Files Created (ใหม่)
✅ **src/data/battlePassQuestData.ts**
- Unified quest configuration file
- Contains all daily, premium rotation, and weekly quests
- Season configuration sync
- Helper functions

## Files to Delete (ไฟล์เก่า - ไม่ต้องใช้แล้ว)
❌ **src/data/QuestBattlePassData.ts**
- Functionality merged into battlePassQuestData.ts
- Can be safely deleted

❌ **src/data/battlepassData.ts** (ส่วน QUEST_DETAILS)
- Quest info moved to battlePassQuestData.ts
- Keep only BATTLE_PASS_CONFIG if needed

## Files Updated
✏️ **src/app/calc-bp/CalcBPConfig.ts**
- Now imports SEASON_CONFIG from battlePassQuestData.ts
- Automatically syncs with quest data changes

## New Interface Structure

```typescript
interface Quest {
  type: 'daily' | 'weekly';
  name: string;                    // Quest name
  reward: number;                  // Points earned
  dateRange: string;               // e.g., "22/04 - 23/06"
  request?: string;                // Items needed (e.g., "20x Cornus")
  details?: {
    monsterName?: string;
    quantity?: number;
    location?: string;
    rotation?: Array<{ monster, dateRange }>;
  };
}

interface SeasonConfig {
  eventStartDate: Date;
  eventEndDate: Date;
  dailyNormalReward: number;
  dailyPremiumReward: number;
  weeklyReward: number;
}
```

## How to Update for Next Season

1. Edit **src/data/battlePassQuestData.ts**
2. Update `SEASON_CONFIG`:
```typescript
export const SEASON_CONFIG: SeasonConfig = {
  eventStartDate: new Date(2026, 6, 1, 12, 0, 0),    // New start
  eventEndDate: new Date(2026, 7, 31, 23, 59, 59, 999), // New end
  dailyNormalReward: 40,
  dailyPremiumReward: 50,
  weeklyReward: 100,
};
```

3. Update quest arrays if needed:
   - DAILY_QUESTS
   - PREMIUM_DAILY_ROTATION
   - WEEKLY_QUESTS

4. CalcBPConfig.ts will automatically sync!

## Helper Functions Available

```typescript
// Get daily rewards based on account type
getDailyQuestTotal(isPremium: boolean): number

// Get weekly rewards
getWeeklyQuestTotal(): number

// Get quests by type
getQuestsByType(type: 'daily' | 'weekly'): Quest[]

// Get all quest info
getQuestSummary(): { daily, weekly, totalDailyQuests, totalWeeklyQuests }

// Find quest by name
getQuestByName(name: string): Quest | undefined
```

## Benefits of Refactoring

✅ Single source of truth for quest data
✅ Clear separation: dateRange, request, reward
✅ Easy to display seasonal info
✅ Support for rotating quests (premium monsters)
✅ Reusable interface across components
✅ All calculations sync automatically with config changes

## Clean Up Command

```bash
# After confirming all is working, delete old files:
rm src/data/QuestBattlePassData.ts
```
