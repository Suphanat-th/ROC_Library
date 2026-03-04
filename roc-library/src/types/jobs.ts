import React from 'react';
import { Crown, Maximize2, ShieldAlert, Wind } from 'lucide-react';

// ==========================================
// 1. INTERFACES (Types)
// ==========================================
export interface Job {
  name: string;
  category: string;
  icon: string;
  color: string;
}

export interface CostumeSlot {
  id: string;
  label: string;
  icon: React.ElementType; // เปลี่ยนจาก ReactNode เป็น ElementType
  color: string;
}

export interface InventoryItem {
  name: string;
  icon: string;
}

export interface EquippedItems {
  upper: InventoryItem | null;
  middle: InventoryItem | null;
  lower: InventoryItem | null;
  garment: InventoryItem | null;
}

// Props สำหรับ Components
export interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  categories: string[];
}

export interface JobGridProps {
  jobs: Job[];
  selected: string;
  onSelect: (jobName: string) => void;
}

export interface PreviewDisplayProps {
  selectedJob: string;
  equipped: EquippedItems;
}

// ==========================================
// 2. CONSTANTS (Data)
// ==========================================

export const CATEGORIES: string[] = [
  'All', 
  'NOVICE', 
  '1ST JOB', 
  '2ND JOB', 
  'TRANSCENDENCE',
  'EXPANDED'
];
export const ALL_JOBS: Job[] = [
  // NOVICE
  { name: 'Novice', category: 'NOVICE', icon: '🔰', color: 'from-blue-500 to-blue-600' },

  // 1ST JOB
  { name: 'Swordman', category: '1ST JOB', icon: '⚔️', color: 'from-orange-500 to-red-600' },
  { name: 'Magician', category: '1ST JOB', icon: '🪄', color: 'from-blue-400 to-indigo-600' },
  { name: 'Archer', category: '1ST JOB', icon: '🏹', color: 'from-green-400 to-emerald-600' },
  { name: 'Acolyte', category: '1ST JOB', icon: '⛪', color: 'from-yellow-200 to-amber-500' },
  { name: 'Merchant', category: '1ST JOB', icon: '💰', color: 'from-yellow-500 to-orange-400' },
  { name: 'Thief', category: '1ST JOB', icon: '🗡️', color: 'from-slate-500 to-slate-800' },

  // 2ND JOB
  { name: 'Knight', category: '2ND JOB', icon: '🐎', color: 'from-red-600 to-red-800' },
  { name: 'Crusader', category: '2ND JOB', icon: '🛡️', color: 'from-blue-300 to-blue-500' },
  { name: 'Wizard', category: '2ND JOB', icon: '🔥', color: 'from-blue-600 to-purple-700' },
  { name: 'Sage', category: '2ND JOB', icon: '📖', color: 'from-indigo-400 to-blue-500' },
  { name: 'Hunter', category: '2ND JOB', icon: '🦅', color: 'from-green-600 to-green-900' },
  { name: 'Bard', category: '2ND JOB', icon: '🎸', color: 'from-emerald-400 to-emerald-600' },
  { name: 'Dancer', category: '2ND JOB', icon: '💃', color: 'from-pink-400 to-pink-600' },
  { name: 'Priest', category: '2ND JOB', icon: '✨', color: 'from-amber-100 to-yellow-400' },
  { name: 'Monk', category: '2ND JOB', icon: '👊', color: 'from-slate-300 to-slate-500' },
  { name: 'Blacksmith', category: '2ND JOB', icon: '🔨', color: 'from-zinc-500 to-zinc-700' },
  { name: 'Alchemist', category: '2ND JOB', icon: '🧪', color: 'from-lime-400 to-green-600' },
  { name: 'Assassin', category: '2ND JOB', icon: '👤', color: 'from-purple-900 to-black' },
  { name: 'Rogue', category: '2ND JOB', icon: '🎭', color: 'from-slate-600 to-slate-900' },

  // TRANSCENDENCE
  { name: 'Lord Knight', category: 'TRANSCENDENCE', icon: '🚩', color: 'from-red-500 to-red-900' },
  { name: 'Paladin', category: 'TRANSCENDENCE', icon: '🛡️', color: 'from-blue-400 to-indigo-800' },
  { name: 'High Wizard', category: 'TRANSCENDENCE', icon: '⚡', color: 'from-blue-400 to-purple-600' },
  { name: 'Professor', category: 'TRANSCENDENCE', icon: '📜', color: 'from-blue-500 to-indigo-700' },
  { name: 'Sniper', category: 'TRANSCENDENCE', icon: '🎯', color: 'from-emerald-500 to-emerald-900' },
  { name: 'Clown', category: 'TRANSCENDENCE', icon: '🤡', color: 'from-red-400 to-red-600' },
  { name: 'Gypsy', category: 'TRANSCENDENCE', icon: '🌹', color: 'from-pink-500 to-pink-800' },
  { name: 'High Priest', category: 'TRANSCENDENCE', icon: '🌟', color: 'from-yellow-200 to-amber-400' },
  { name: 'Champion', category: 'TRANSCENDENCE', icon: '💥', color: 'from-slate-400 to-slate-700' },
  { name: 'Whitesmith', category: 'TRANSCENDENCE', icon: '🛠️', color: 'from-zinc-400 to-zinc-600' },
  { name: 'Creator', category: 'TRANSCENDENCE', icon: '⚗️', color: 'from-green-400 to-emerald-700' },
  { name: 'Assassin Cross', category: 'TRANSCENDENCE', icon: '❌', color: 'from-indigo-900 to-slate-900' },
  { name: 'Stalker', category: 'TRANSCENDENCE', icon: '👣', color: 'from-neutral-700 to-black' },

  // EXPANDED 1ST
  { name: 'Taekwon', category: 'EXPANDED 1ST', icon: '🦶', color: 'from-green-300 to-green-500' },
  { name: 'Ninja', category: 'EXPANDED 1ST', icon: '🌑', color: 'from-neutral-700 to-neutral-900' },
  { name: 'Gunslinger', category: 'EXPANDED 1ST', icon: '🔫', color: 'from-amber-700 to-amber-900' },
  { name: 'Super Novice', category: 'EXPANDED 1ST', icon: '✨', color: 'from-yellow-300 to-orange-400' },

  // EXPANDED 2ND
  { name: 'Star Gladiator', category: 'EXPANDED 2ND', icon: '☀️', color: 'from-yellow-300 to-orange-500' },
  { name: 'Soul Linker', category: 'EXPANDED 2ND', icon: '🏮', color: 'from-pink-400 to-pink-700' },
  
  // EXPANDED 3RD
  { name: 'Star Emperor', category: 'EXPANDED 3RD', icon: '👑', color: 'from-yellow-500 to-orange-600' },
  { name: 'Soul Reaper', category: 'EXPANDED 3RD', icon: '💀', color: 'from-purple-600 to-purple-900' },
  { name: 'Kagerou', category: 'EXPANDED 3RD', icon: '⚔️', color: 'from-red-700 to-red-900' },
  { name: 'Oboro', category: 'EXPANDED 3RD', icon: '🌙', color: 'from-indigo-700 to-indigo-900' },
  { name: 'Rebellion', category: 'EXPANDED 3RD', icon: '💣', color: 'from-neutral-600 to-neutral-800' },
  { name: 'Ex. Super Novice', category: 'EXPANDED 3RD', icon: '🎖️', color: 'from-yellow-400 to-amber-600' },
];

export const COSTUME_SLOTS: CostumeSlot[] = [
  { id: 'upper', label: 'C. Upper', icon: Crown, color: 'text-yellow-400' }, // ส่งตัวแปร Crown ไปเลย ไม่ต้องมี < />
  { id: 'middle', label: 'C. Middle', icon: Maximize2, color: 'text-blue-400' },
  { id: 'lower', label: 'C. Lower', icon: ShieldAlert, color: 'text-green-400' },
  { id: 'garment', label: 'C. Garment', icon: Wind, color: 'text-purple-400' },
];

export const INVENTORY_ITEMS: Record<string, InventoryItem[]> = {
  upper: Array(10).fill({ name: 'Hat', icon: '🎩' }).concat(Array(10).fill({ name: 'Ribbon', icon: '🎀' })),
  middle: Array(20).fill({ name: 'Glasses', icon: '🕶️' }),
  lower: Array(20).fill({ name: 'Mask', icon: '😷' }),
  garment: Array(20).fill({ name: 'Wing', icon: '🦋' }),
};