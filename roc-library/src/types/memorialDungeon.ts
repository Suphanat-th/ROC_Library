export interface DungeonMonster {
  /** monster id; names the picture in monsterDb when there is one */
  id: number;
  name: string;
  mvp?: boolean;
}

export interface DungeonRewardGroup {
  title: string;
  items: string[];
}

/** Guide content shown beside a dungeon's Map viewer. */
export interface MemorialDungeonGuide {
  entry: { npc: string; location: string };
  minLevel: number;
  minPartySize: number;
  timeLimitMinutes: number;
  /** daily reset time, Thailand time, e.g. "04:00" */
  resetTime: string;
  route: string[];
  monsters: DungeonMonster[];
  rewards: DungeonRewardGroup[];
}
