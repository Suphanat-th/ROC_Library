import type { FootprintInfo } from "@/data/costumePreview";

/** public/assets/json/CostumeIndex.json, made by scripts/extract-costume.mjs. */

export type CostumeGender = "m" | "f";
export type CostumeTier = "class12" | "high" | "extended";
export type CostumeSlot = "upper" | "middle" | "lower";

/** Body file name (without extension) for each gender; a gender the game has no body for is missing. */
export type BodyNames = Partial<Record<CostumeGender, string>>;

export interface CostumeJob {
  id: string;
  label: string;
  tier: CostumeTier;
  /** The main job (the first job of the line) it belongs to. */
  family?: string;
  /** Genders that can play the job (Kagerou is male only, Oboro female only). */
  genders: CostumeGender[];
  body: BodyNames;
  /** The creature the job can ride, with the body of the job riding it. */
  mounts?: Record<string, BodyNames>;
}

export interface CostumeItem {
  id: number;
  name: string;
  kind: "headgear" | "robe";
  /** Where a headgear sits (some take several places); a Robe is always "garment". */
  slots: (CostumeSlot | "garment")[];
  /** Names the item's packs. */
  key: string;
  genders: CostumeGender[];
  /** Draw order of a headgear (the game's table): a smaller number is drawn first. */
  layer?: number;
  /** Where its inventory icon sits in the icon picture (see CostumeIndex.icons). */
  icon?: number;
  /** The hat effect (/effect) of the item: one or more .str files in a folder under fx/, drawn behind the character or following the head as the game's table says. */
  effects?: { key: string; file: string; behind?: boolean; head?: boolean }[];
  /** An effect that is a sprite and its animation (fx/<key>/e.spr and e.act), drawn at the feet, behind the character or over it. */
  spriteEffects?: { key: string; behind: boolean }[];
  /** The item has an effect the game builds with a script, which this page cannot show. */
  effectUnsupported?: boolean;
  /** A Footprint the game leaves while the character walks: its folder under fx/ and the game's table entry. */
  footprint?: { key: string; info: FootprintInfo };
  /** The item has no picture to wear, only an effect (some Costumes are). */
  noSprite?: boolean;
}

/** A Footprint item the game gives as an enchant for a Costume garment; walking leaves its steps on the ground. */
export interface CostumeFootprintChoice {
  id: number;
  name: string;
  key: string;
  info: FootprintInfo;
}

/** An Enchant item that gives a Costume an effect ("Water Field Effect (Lower)"). */
export interface CostumeStone {
  id: number;
  name: string;
  slot: "upper" | "middle" | "lower" | "garment";
  effects?: { key: string; file: string; behind?: boolean; head?: boolean }[];
  /** The game plays this effect in a way this page cannot show. */
  unsupported?: boolean;
}

export interface CostumeIndex {
  jobs: CostumeJob[];
  /** Per gender: hairstyle number -> how many Hair colours it has. */
  hairstyles: Partial<Record<CostumeGender, Record<string, number>>>;
  /** Per gender and hairstyle: one colour to show for each Hair colour. */
  hairSwatches?: Partial<Record<CostumeGender, Record<string, string[]>>>;
  /**
   * Per gender and body name: the job's own outfit (index 0) and the alternate outfits 1-4 (an empty list when the body
   * has none), each with one colour to show for every Body colour.
   */
  bodyOutfits?: Partial<Record<CostumeGender, Record<string, string[][]>>>;
  items: CostumeItem[];
  footprints?: CostumeFootprintChoice[];
  stones?: CostumeStone[];
  /** One picture holding every item's icon, `columns` to a row. */
  icons: { url: string; size: number; columns: number };
  packs: { body: string[]; head: string[] };
}
