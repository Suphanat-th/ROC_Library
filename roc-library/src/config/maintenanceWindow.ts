/**
 * Server Maintenance Window Configuration
 * ROC Classic Server (Baphomet/Moonlight)
 * 
 * Timezone: Asia/Bangkok (GMT+7)
 * Regular: Every Wednesday: 6:00 AM - 2:01 PM
 * Special: Add custom dates for events, closures, etc.
 */

import { getCurrentThaiTime } from '@/utils/timezoneUtils';

export const MAINTENANCE_WINDOW = {
  // Regular maintenance date and time in GMT+7 (Thailand timezone)
  startDate: new Date(2026, 3, 29),  // April 29, 2026 (Wednesday)
  endDate: new Date(2026, 3, 29),    // April 29, 2026 (same day)
  startHour: 6,      // 6:00 AM
  startMinute: 0,
  endHour: 14,       // 2:00 PM
  endMinute: 1,      // 2:01 PM
};

export interface SpecialSchedule {
  startDate: Date;
  endDate: Date;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  reason: string;
  type: 'maintenance' | 'event' | 'closure'; // maintenance = server down, event = special event, closure = server closed
}

/**
 * Special schedule for server (events, closures, etc.)
 * Add entries here with specific dates and times
 * Example: New Year event, Server migration, etc.
 */
export const SPECIAL_SCHEDULES: SpecialSchedule[] = [
  // Example format:
  // {
  //   startDate: new Date(2026, 4, 1), // May 1, 2026 (month is 0-indexed)
  //   endDate: new Date(2026, 4, 3),   // May 3, 2026
  //   startHour: 6,
  //   startMinute: 0,
  //   endHour: 14,
  //   endMinute: 1,
  //   reason: 'Server Migration',
  //   type: 'maintenance',
  // },
];

/**
 * Check if server is currently in maintenance window
 * Checks both regular maintenance and special schedules
 * Automatically handles GMT+7 timezone
 */
export function isServerInMaintenance(): boolean {
  const current = getCurrentThaiTime();
  const currentDate = new Date(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate());
  const hours = current.getUTCHours();
  const minutes = current.getUTCMinutes();
  const currentTotalMinutes = hours * 60 + minutes;
  
  // Check special schedules first
  for (const schedule of SPECIAL_SCHEDULES) {
    const startDate = new Date(schedule.startDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(schedule.endDate);
    endDate.setHours(23, 59, 59, 999);
    
    if (currentDate >= startDate && currentDate <= endDate) {
      const startTotalMinutes = schedule.startHour * 60 + schedule.startMinute;
      const endTotalMinutes = schedule.endHour * 60 + schedule.endMinute;
      
      if (currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes) {
        return schedule.type === 'maintenance' || schedule.type === 'closure';
      }
    }
  }
  
  // Check regular maintenance
  const maintenanceStartDate = new Date(MAINTENANCE_WINDOW.startDate);
  maintenanceStartDate.setHours(0, 0, 0, 0);
  const maintenanceEndDate = new Date(MAINTENANCE_WINDOW.endDate);
  maintenanceEndDate.setHours(23, 59, 59, 999);
  
  if (currentDate >= maintenanceStartDate && currentDate <= maintenanceEndDate) {
    const startTotalMinutes = MAINTENANCE_WINDOW.startHour * 60 + MAINTENANCE_WINDOW.startMinute;
    const endTotalMinutes = MAINTENANCE_WINDOW.endHour * 60 + MAINTENANCE_WINDOW.endMinute;
    
    return currentTotalMinutes >= startTotalMinutes && currentTotalMinutes <= endTotalMinutes;
  }
  
  return false;
}
