# Battle Pass Calculator - Configuration Guide

## Overview
ตอนนี้ Battle Pass Calculator สามารถเปลี่ยน Content ได้อย่างง่ายๆ โดยไม่ต้องแก้ Component Code เอง

## Where to Edit

### 📝 Edit Configuration File
```
src/app/calc-bp/CalcBPConfig.ts
```

## What You Can Change

### 1️⃣ Event Dates
```typescript
eventStartDate: new Date(2026, 3, 22, 12, 0, 0),    // April 22, 2026 12:00
eventEndDate: new Date(2026, 5, 23, 23, 59, 59, 999), // June 23, 2026 23:59
```

- **Month**: 0 = January, 1 = February, ..., 11 = December
- **Hour**: 24-hour format (0-23)

### 2️⃣ Daily Quest Rewards
```typescript
dailyQuests: {
  normal: {
    reward: 40,  // Normal Pass: X points per day
  },
  premium: {
    reward: 50,  // Premium Pass: X points per day
  },
}
```

### 3️⃣ Weekly Quest Rewards
```typescript
weeklyQuests: {
  reward: 100,  // Points per week
}
```

## What You CAN'T Change (Stays the Same)

❌ **Level calculation logic**:
- 0-49 points = Level 0
- 50-59 points = Level 1
- 60-69 points = Level 2
- +10 points = +1 Level

❌ **Zeny costs** (hardcoded):
- Daily: 1,000,000 Zeny
- Weekly: 2,000,000 Zeny

## Example: Changing to Next Season

When Season 1 ends and Season 2 starts:

```typescript
// CURRENT SEASON: Season 2 (July 1 - August 31, 2026)
export const CURRENT_SEASON_CONFIG: CalcBPSeasonConfig = {
  eventStartDate: new Date(2026, 6, 1, 12, 0, 0),     // July 1, 2026 12:00
  eventEndDate: new Date(2026, 7, 31, 23, 59, 59, 999), // Aug 31, 2026 23:59
  
  dailyQuests: {
    normal: {
      reward: 40,  // Change if rewards differ
    },
    premium: {
      reward: 50,  // Change if rewards differ
    },
  },
  
  weeklyQuests: {
    reward: 100,  // Change if rewards differ
  },
};
```

## Component Structure

```
src/app/calc-bp/
├── CalcBPComponent.tsx    (Main component - don't edit quest details here)
└── CalcBPConfig.ts        (Seasonal config - EDIT THIS FILE ONLY)
```

## Benefits

✅ One file to update for each new season
✅ No need to modify Component logic
✅ Reusable Component across multiple seasons
✅ Clear separation: Config (seasonal) vs Logic (permanent)

## Notes

- The calculator automatically counts:
  - Days remaining until end date
  - Number of Weekly resets (Wednesday resets)
  - Daily and Weekly quest rewards based on Config
  
- All calculations are based on the Config values, so changing them will immediately update all displays
