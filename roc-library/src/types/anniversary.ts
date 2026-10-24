export type AnniversaryServer = "baphomet" | "moonlight";

/** Reward type: which kind of equipment an Anniversary reward is. */
export type AnniversaryRewardType = "headGear" | "accessory";

/** One card inside an Event info section: a town's Chapter, or a Quest type. */
export interface AnniversaryInfoEntry {
  /** town or quest name */
  title: string;
  /** Chapter number in Roman numerals, e.g. "II" */
  numeral?: string;
  /** English Chapter name, e.g. "Foundation" */
  subtitle?: string;
  /** Thai Chapter name, shown in quotation marks */
  heading?: string;
  /** lines of detail; leave empty until the content is known */
  detail?: string[];
  /** the closing line of a Chapter, shown in italics */
  tagline?: string;
  /** the Chapter's picture is not revealed yet, so a "?" box stands in */
  mystery?: boolean;
}

/** A section of the 5th Anniversary page that explains part of the event. */
export interface AnniversaryInfoSection {
  /** anchor id, also used by the links in the hero */
  id: string;
  title: string;
  summary?: string;
  /**
   * route: stops along a zigzag path, one card per stop (the Chapters);
   * tiles: a few big coloured cards.
   */
  layout: "route" | "tiles";
  entries: AnniversaryInfoEntry[];
}

export type QuestTaskKind = "kill" | "collect" | "quiz" | "find" | "reward";

/** One thing a quest asks the player to do. */
export interface QuestTask {
  kind: QuestTaskKind;
  /** what to kill, collect or do, e.g. "Firewood" */
  label: string;
  count?: number;
  /** unit of the count, e.g. "ชิ้น" or "ตัว" */
  unit?: string;
  /** where it comes from, e.g. "จากการสังหาร Savage [Event]" */
  via?: string;
  /** monster whose picture shows beside the task: its id in monsterDb (an [Event] monster uses the normal one's picture) */
  monsterId?: number;
  /** the item's id: its picture is public/assets/images/anvs/items/<itemImageId>.bmp */
  itemImageId?: string | number;
  /** small extra lines under the task, e.g. what an item can and cannot do */
  details?: string[];
  /** remarks that must not be missed, shown as bold pills, e.g. the days a monster appears */
  badges?: string[];
}

/** One step of the server-wide goal of the World Event. */
export interface WorldMilestone {
  /** the mission's name, e.g. "การจุติใหม่" */
  name: string;
  nameEn: string;
  /** how many Dragon Cataclysm quests the whole server must hand in */
  target: number;
  /** what every player gets when the target is reached */
  reward: QuestTask;
}

/** A small box of facts, e.g. the buffs a reward gives and what they cost. */
export interface InfoPanel {
  title: string;
  chips?: string[];
  facts?: { label: string; value: string }[];
}

/** The quest of one Chapter, shown in the panel under the map. */
export interface ChapterQuest {
  /** matches the Chapter entry's `title` */
  town: string;
  /** the quest's name in the game */
  gameTitle: string;
  /** short label of what kind of quest it is, e.g. "สังหาร" */
  kind: string;
  intro?: string;
  tasks: QuestTask[];
  /** the closing instruction, e.g. to report back */
  outro?: string;
  notes?: string[];
  /** map coordinates to visit, e.g. "prt_q 87 339" */
  coordinates?: string[];
}

export interface RecurringQuest {
  title: string;
  tasks: QuestTask[];
  milestones?: WorldMilestone[];
  panels?: InfoPanel[];
  /** conditions and remarks of the quest */
  notes?: string[];
}

/** Daily, Weekly or World quests of the event. */
export interface RecurringQuestGroup {
  id: "daily" | "weekly" | "world";
  title: string;
  note?: string;
  quests: RecurringQuest[];
}
