/**
 * Server Maintenance Window Configuration
 * ROC Classic Server (Baphomet/Moonlight)
 * 
 * Timezone: Asia/Bangkok (GMT+7)
 * Every Wednesday: 6:00 AM - 2:01 PM
 */

import { getCurrentThaiTime } from '@/utils/timezoneUtils';

export const MAINTENANCE_WINDOW = {
  // Maintenance time in GMT+7 (Thailand timezone)
  startHour: 6,      // 6:00 AM
  startMinute: 0,
  endHour: 14,       // 2:00 PM
  endMinute: 0,
};

/**
 * Check if server is currently in maintenance window
 * Automatically handles GMT+7 timezone
 */
export function isServerInMaintenance(): boolean {
  const current = getCurrentThaiTime();
  const hours = current.getUTCHours();
  const minutes = current.getUTCMinutes();
  
  // Check if current time is within maintenance window
  const startTotalMinutes = MAINTENANCE_WINDOW.startHour * 60 + MAINTENANCE_WINDOW.startMinute;
  const endTotalMinutes = MAINTENANCE_WINDOW.endHour * 60 + MAINTENANCE_WINDOW.endMinute;
  const currentTotalMinutes = hours * 60 + minutes;
  
  return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
}
