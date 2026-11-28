"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, ImagePlus, Loader2, RotateCcw, Search, Sparkles, X } from "lucide-react";
import { CostumeGender, CostumeIndex, CostumeItem, CostumeJob } from "@/types/costume";
import JobPicker from "./JobPicker";
import SpriteThumb from "./SpriteThumb";

type IconSheet = CostumeIndex["icons"];
import { Bounds, Character, loadSpriteFiles, measureCharacter } from "@/utils/spriteComposer";
import { createStrRenderer, measureStr, StrEffect, StrRenderer } from "@/utils/strEffect";
import { costumeFileUrl } from "@/utils/costumePack";
import { loadCostumeEffect, loadCostumeFootprint } from "@/utils/costumeEffects";
import {
  exportCostumeGif,
  GIF_DEFAULTS,
  GIF_FPS,
  GIF_SECONDS,
  GIF_WIDTHS,
  gifHeight,
  GifSettings,
  paintScene,
  Scene,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "@/utils/costumeScene";
import { LOGO_SRC } from "@/app/patch-convert/inlineImages";
import { Footprint } from "@/utils/footprintEffect";
import { loadBody, loadHead, loadWorn } from "@/utils/costumeCharacter";

const CANVAS_WIDTH = STAGE_WIDTH;
const CANVAS_HEIGHT = STAGE_HEIGHT;
const PADDING = 16;
const MAX_SCALE = 2;
/** How long a choice waits for the next one before the character is built for it. */
const BUILD_DELAY_MS = 250;
/** How long "ยืนยันรีเซ็ต?" stays before the button goes back to "เริ่มใหม่". */
const RESET_CONFIRM_MS = 4000;
/** Where the character's middle sits, as a share of the stage height: low, so the name fits under the feet and there is room above for wings and auras. */
const STAGE_CENTRE_Y = 0.75;
/** The zoom the player can set, as a share of the usual size. */
const ZOOMS = [0.5, 0.65, 0.8, 1, 1.25, 1.5, 2];

/** An ACT holds 8 directions for each pose: action = pose type × 8 + direction. */
const POSES = [
  { type: 0, label: "ยืน" },
  { type: 2, label: "นั่ง" },
  { type: 1, label: "เดิน" },
];

/** Direction 0 faces the viewer; each step turns the character towards the viewer's left. */
const DIRECTIONS = ["หน้า", "หน้าซ้าย", "ซ้าย", "หลังซ้าย", "หลัง", "หลังขวา", "ขวา", "หน้าขวา"];

const PLACES = [
  { slot: "upper", label: "บน", english: "Upper" },
  { slot: "middle", label: "กลาง", english: "Middle" },
  { slot: "lower", label: "ล่าง", english: "Lower" },
  { slot: "garment", label: "ผ้าคลุม", english: "Garment" },
] as const;

type Place = (typeof PLACES)[number]["slot"];

/** Each place has its own colour wherever it is named (slot bar, list, notes), so which places an item takes reads at a glance. */
const PLACE_TONE: Record<Place, { chip: string; tab: string }> = {
  upper: { chip: "bg-info text-info-content", tab: "border-info/70 bg-info/10 hover:border-info" },
  middle: { chip: "bg-success text-success-content", tab: "border-success/70 bg-success/10 hover:border-success" },
  lower: { chip: "bg-warning text-warning-content", tab: "border-warning/70 bg-warning/10 hover:border-warning" },
  garment: { chip: "bg-accent text-accent-content", tab: "border-accent/70 bg-accent/10 hover:border-accent" },
};
const PLACE_LABEL: Record<Place, string> = { upper: "บน", middle: "กลาง", lower: "ล่าง", garment: "ผ้าคลุม" };

/** The places an item takes, one coloured tag each, in the order of the slot bar. */
function PlaceChips({ slots, size = "sm" }: { slots: readonly Place[]; size?: "sm" | "md" }) {
  const ordered = PLACES.map((place) => place.slot).filter((slot) => slots.includes(slot));
  return (
    <span className="inline-flex max-w-full items-center justify-center gap-0.5">
      {ordered.map((slot) => (
        <span
          key={slot}
          className={`rounded px-1 font-bold ${size === "md" ? "text-[11px] leading-4" : "text-[10px] leading-[14px]"} ${PLACE_TONE[slot].chip}`}
        >
          {PLACE_LABEL[slot]}
        </span>
      ))}
    </span>
  );
}
type Picks = Record<Place, number | null>;

const NONE: Picks = { upper: null, middle: null, lower: null, garment: null };

/** The height of every place in the slot bar, whatever it holds (name, icon, two lines, room for the socket button). */
const SLOT_HEIGHT = "h-[5.75rem]";

const MOUNT_NAMES: Record<string, string> = { peco: "Peco Peco", poring: "Poring", toad: "Toad" };

/** A grid of faint lines, like graph paper, so the stage reads as a place and not a blank box. */
const STAGE_GRID =
  "bg-[linear-gradient(to_right,color-mix(in_oklab,var(--color-base-content)_7%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--color-base-content)_7%,transparent)_1px,transparent_1px)] bg-[size:28px_28px]";

type Background = { url: string; image: HTMLImageElement; name: string };

/** Opens a picture the player gave (picked, dropped or pasted): `accept` gets it, `fail` gets what went wrong. */
function openBackground(file: File | undefined, accept: (background: Background) => void, fail: (message: string) => void) {
  if (!file) return;
  if (!file.type.startsWith("image/")) return fail("ไฟล์นี้ไม่ใช่รูปภาพ");
  if (file.size > 15 * 1024 * 1024) return fail("ไฟล์ใหญ่เกิน 15 MB");
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.onload = () => accept({ url, image, name: file.name || "รูปที่วาง" });
  image.onerror = () => {
    URL.revokeObjectURL(url);
    fail("เปิดรูปนี้ไม่ได้");
  };
  image.src = url;
}

const ALL_ACTIONS = POSES.flatMap((entry) => DIRECTIONS.map((_, direction) => entry.type * 8 + direction));

const fit = (b: Bounds | null) =>
  Math.min(
    MAX_SCALE,
    (CANVAS_WIDTH - PADDING * 2) / (b ? b.maxX - b.minX || 1 : 1),
    (CANVAS_HEIGHT - PADDING * 2) / (b ? b.maxY - b.minY || 1 : 1),
  );

/**
 * Where to draw: the stage does not move. Size and place depend only on the character itself (body and head, over
 * every pose and direction), never on what it wears, so a wide Robe or effect is cropped by the window as it is on
 * the game's screen instead of pushing the character away.
 */
function frameOf(character: Character) {
  const bare = measureCharacter({ body: character.body, head: character.head }, ALL_ACTIONS);
  const scale = Math.min(MAX_SCALE, fit(bare));
  const centreX = ((bare?.minX ?? 0) + (bare?.maxX ?? 0)) / 2;
  const centreY = ((bare?.minY ?? 0) + (bare?.maxY ?? 0)) / 2;
  return { scale, centreX, centreY };
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-box border border-base-300 bg-base-100 p-3 sm:p-4">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
        <span aria-hidden="true" className="h-4 w-1 rounded-full bg-primary" />
        {title}
      </h2>
      <div className="grid gap-4">{children}</div>
    </section>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-base-content/70">{label}</span>
        {hint && <span className="text-xs tabular-nums text-base-content/60">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

/** One round sample per colour (the game's palettes averaged); numbered buttons when there is no sample. */
function ColourChips({
  count,
  value,
  onChange,
  label,
  samples,
}: {
  count: number;
  value: number;
  onChange: (n: number) => void;
  label: string;
  samples?: string[];
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {Array.from({ length: count }, (_, at) => {
        const sample = samples?.[at];
        const on = value === at;
        return (
          <button
            key={at}
            type="button"
            aria-pressed={on}
            aria-label={`${label} ${at + 1}`}
            title={`${label} ${at + 1}`}
            onClick={() => onChange(at)}
            style={sample ? { backgroundColor: sample } : undefined}
            className={`h-10 w-10 shrink-0 rounded-full border-2 text-sm font-semibold tabular-nums transition-shadow focus-visible:outline-2 focus-visible:outline-primary ${
              on ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-base-100" : "border-base-300 hover:border-primary/60"
            } ${sample ? "" : on ? "bg-primary text-primary-content" : "bg-base-100"}`}
          >
            {sample ? null : at + 1}
          </button>
        );
      })}
    </div>
  );
}

/** The item's inventory icon, cut out of the one icon picture; an empty frame when the game has none. */
function ItemIcon({ item, sheet, size = 32 }: { item?: CostumeItem; sheet: IconSheet; size?: number }) {
  const cell = item?.icon;
  return (
    <span
      aria-hidden="true"
      className="inline-block shrink-0 rounded-field border border-base-300 bg-base-200"
      style={{
        width: size + 2,
        height: size + 2,
        ...(cell === undefined
          ? {}
          : {
              backgroundImage: `url(${sheet.url})`,
              backgroundSize: `${sheet.columns * size}px auto`,
              backgroundPosition: `-${(cell % sheet.columns) * size}px -${Math.floor(cell / sheet.columns) * size}px`,
              backgroundRepeat: "no-repeat",
              imageRendering: "pixelated",
            }),
      }}
    />
  );
}

/** The picture the sockets show: the effect stone's (every stone of the game shares one) or the Footprint's, cut out of the icon picture. */
function SocketPicture({ sheet, cell, on }: { sheet: IconSheet; cell?: number; on: boolean }) {
  if (cell === undefined)
    return (
      <span aria-hidden="true" className="text-base font-bold">
        {on ? "✦" : "◇"}
      </span>
    );
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 ${on ? "" : "opacity-40 grayscale"}`}
      style={{
        width: sheet.size,
        height: sheet.size,
        backgroundImage: `url(${sheet.url})`,
        backgroundSize: `${sheet.columns * sheet.size}px auto`,
        backgroundPosition: `-${(cell % sheet.columns) * sheet.size}px -${Math.floor(cell / sheet.columns) * sheet.size}px`,
        backgroundRepeat: "no-repeat",
        imageRendering: "pixelated",
      }}
    />
  );
}

/**
 * One equipment place, like the slots of the game's own window. Its size never depends on what it holds: the name, the icon
 * and two lines under it are always there (empty or not), so wearing, removing or covering several places moves nothing.
 */
function SlotTab({
  slot,
  english,
  active,
  worn,
  sheet,
  pending,
  unavailable,
  covers,
  socketName,
  onSelect,
  onRemove,
}: {
  slot: Place;
  english: string;
  active: boolean;
  worn?: CostumeItem;
  sheet: IconSheet;
  pending: boolean;
  /** The worn item has nothing for the character's gender. */
  unavailable: boolean;
  /** How many places the worn item takes; more than one means it fills several at once. */
  covers: number;
  /** The name of the effect (or Footprint) set for this place, written on the second line under the icon. */
  socketName?: string;
  onSelect: () => void;
  onRemove: () => void;
}) {
  // First line under the icon: what is true of the item, or that the place is empty.
  const note = unavailable
    ? { text: "ไม่มีของเพศนี้", tone: "text-warning" }
    : !worn
      ? { text: "ว่าง", tone: "text-base-content/55" }
      : null;
  return (
    <div className={`relative flex w-full ${SLOT_HEIGHT}`}>
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onClick={onSelect}
        title={worn ? `${english}: ${worn.name}` : english}
        className={`flex h-full w-full flex-col items-center justify-start gap-0.5 rounded-box border-2 px-1 pb-1 pt-1 transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
          active ? "border-primary bg-primary/10" : worn ? PLACE_TONE[slot].tab : "border-base-300 bg-base-100 hover:border-primary/50"
        }`}
      >
        <PlaceChips slots={[slot]} size="md" />
        <span className="relative">
          <ItemIcon item={worn} sheet={sheet} size={32} />
          {pending && (
            <span className="absolute inset-0 flex items-center justify-center rounded-field bg-base-100/70">
              <span className="loading loading-spinner loading-xs text-primary" role="status" aria-label={`กำลังโหลด ${worn?.name ?? ""}`} />
            </span>
          )}
        </span>
        <span className={`flex h-[14px] w-full items-center justify-center overflow-hidden text-center text-[10px] leading-[14px] ${note?.tone ?? ""}`}>
          {covers > 1 && worn ? <PlaceChips slots={worn.slots as Place[]} /> : note?.text}
        </span>
        {/* Leaves the corner free for the socket button. */}
        <span className="h-[11px] w-full truncate pr-9 text-left text-[10px] leading-[11px] text-secondary">{socketName}</span>
      </button>
      {worn && (
        <button
          type="button"
          aria-label={`ถอด ${worn.name}${covers > 1 ? ` (ครอบ ${covers} ช่อง)` : ""}`}
          onClick={onRemove}
          className="btn btn-circle btn-xs absolute -right-1.5 -top-1.5 min-h-7 min-w-7 border-base-300 bg-base-100 shadow"
        >
          <X aria-hidden="true" className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

/** One setting of the GIF as a row of buttons (one is on). */
function GifChoice<T extends number>({
  label,
  options,
  value,
  disabled,
  onChange,
}: {
  label: string;
  options: { value: T; name: string; detail: string }[];
  value: T;
  disabled: boolean;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="grid gap-1">
      <span className="text-xs font-semibold text-base-content/70">{label}</span>
      <div className="join w-full">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={`btn join-item min-h-12 flex-1 flex-col gap-0 px-1 leading-tight ${value === option.value ? "btn-primary" : ""}`}
          >
            <span className="text-sm font-semibold">{option.name}</span>
            <span className="text-[11px] font-normal opacity-75">{option.detail}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/** The effect stones of one place, in a window opened from the stone socket under that place. */
function StoneDialog({
  label,
  english,
  itemName,
  stones,
  value,
  walking = false,
  onPick,
  onClose,
}: {
  label: string;
  english: string;
  /** The Costume the stone goes into. */
  itemName: string;
  stones: { id: number; name: string; unsupported?: boolean }[];
  value: number | null;
  /** The options are walking effects (Footprints), for the Garment. */
  walking?: boolean;
  onPick: (id: number | null) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  const choose = (id: number | null) => {
    onPick(id);
    ref.current?.close();
  };

  return (
    <dialog ref={ref} onClose={onClose} aria-label={`หินเอฟเฟกต์ ${english}`} className="modal">
      <div className="modal-box max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-md overflow-y-auto p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="leading-tight">
            <h2 className="text-lg font-bold">{walking ? "เอฟเฟกต์เดิน (รอยเท้า)" : `หินเอฟเฟกต์ ช่อง${label}`}</h2>
            <p className="text-xs text-base-content/60">
              ใส่ในช่อง Enchant ที่ 4 ของ {itemName}
              {walking ? " · แสดงเมื่อเลือกท่าเดินและเปิดเอฟเฟกต์" : ""}
            </p>
          </div>
          <form method="dialog">
            <button aria-label="ปิด" className="btn btn-circle btn-ghost btn-sm min-h-11 min-w-11">
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
          </form>
        </div>
        <ul className="grid gap-1.5">
          <li>
            <button
              type="button"
              aria-pressed={value === null}
              onClick={() => choose(null)}
              className={`flex min-h-11 w-full items-center gap-3 rounded-field border-2 px-3 text-left text-sm ${value === null ? "border-primary bg-primary/10 font-semibold" : "border-base-300 hover:border-primary/50"}`}
            >
              ไม่ใส่หิน
            </button>
          </li>
          {stones.map((stone) => (
            <li key={stone.id}>
              <button
                type="button"
                aria-pressed={value === stone.id}
                onClick={() => choose(stone.id)}
                className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-field border-2 px-3 text-left text-sm ${value === stone.id ? "border-secondary bg-secondary/10 font-semibold" : "border-base-300 hover:border-secondary/50"}`}
              >
                <span>{stone.name.replace(/\s*Effect\s*\(.*\)\s*$/i, "").replace(/\s*Footprints?$/i, "")}</span>
                {"unsupported" in stone && stone.unsupported && (
                  <span className="shrink-0 text-[11px] text-base-content/55">แสดงเอฟเฟกต์ไม่ได้</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button aria-label="ปิด">ปิด</button>
      </form>
    </dialog>
  );
}

/** Everything that fits the chosen place, as icons: one tap wears an item, a second tap takes it off. */
function ItemGrid({
  items,
  sheet,
  value,
  onPick,
}: {
  items: CostumeItem[];
  sheet: IconSheet;
  value: number | null;
  onPick: (id: number | null) => void;
}) {
  const [filter, setFilter] = useState("");
  const words = filter.trim().toLowerCase();
  const shown = items.filter((item) => !words || item.name.toLowerCase().includes(words));

  return (
    <div className="grid gap-2">
      <label className="input input-bordered sticky top-0 z-10 flex items-center gap-2">
        <Search aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
        <input
          className="grow"
          placeholder={`ค้นหาชื่อ (${items.length} ชิ้น)`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="ค้นหา Costume"
        />
        {filter && (
          <button type="button" aria-label="ล้างคำค้นหา" onClick={() => setFilter("")} className="btn btn-ghost btn-xs btn-circle">
            <X aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
        )}
      </label>
      {shown.length === 0 ? (
        <p className="py-6 text-center text-sm text-base-content/60">ไม่พบชิ้นที่ค้นหา</p>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-1.5">
          {shown.map((item) => {
            const on = item.id === value;
            return (
              <li key={item.id} className="h-[8.5rem]">
                <button
                  type="button"
                  aria-pressed={on}
                  title={item.name}
                  onClick={() => onPick(on ? null : item.id)}
                  className={`relative flex h-full w-full flex-col items-center gap-1.5 rounded-field border-2 px-1.5 py-2.5 text-center transition-colors focus-visible:outline-2 focus-visible:outline-primary ${
                    on ? "border-primary bg-primary/10" : "border-transparent hover:border-base-300 hover:bg-base-200"
                  }`}
                >
                  {(item.effects?.length || item.footprint || item.effectUnsupported) && (
                    <span
                      title={item.effects?.length || item.footprint ? "มีเอฟเฟกต์ (/effect)" : "มีเอฟเฟกต์ แต่หน้านี้ยังแสดงไม่ได้"}
                      className={`absolute right-1 top-1 rounded px-1 text-[10px] font-bold leading-4 ${item.effects?.length || item.footprint ? "bg-accent text-accent-content" : "bg-base-300 text-base-content/70"}`}
                    >
                      FX
                    </span>
                  )}
                  <ItemIcon item={item} sheet={sheet} size={48} />
                  <span className="line-clamp-2 h-8 text-xs leading-4">{item.name}</span>
                  {/* One line that is always there, so a tile is the same size whatever the item is. */}
                  <span className="flex h-[14px] w-full items-center justify-center gap-1 overflow-hidden text-[10px] leading-[14px] text-base-content/70">
                    {item.slots.length > 1 && <PlaceChips slots={item.slots as Place[]} />}
                    {item.effectUnsupported && (
                      <span className="truncate">{item.slots.length > 1 ? "⚠" : `⚠ ${item.noSprite ? "ไม่มีภาพให้ดู" : "แสดงเอฟเฟกต์ไม่ได้"}`}</span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function CostumeSimulator() {
  const [index, setIndex] = useState<CostumeIndex | null>(null);
  const [failed, setFailed] = useState(false);

  const [gender, setGender] = useState<CostumeGender>("m");
  const [jobId, setJobId] = useState("novice");
  const [mounted, setMounted] = useState(false);
  const [style, setStyle] = useState(1);
  const [hairColour, setHairColour] = useState(0);
  const [bodyColour, setBodyColour] = useState(0);
  const [outfit, setOutfit] = useState(0);
  const [picks, setPicks] = useState<Picks>(NONE);
  const [activeSlot, setActiveSlot] = useState<Place>("upper");
  const [pose, setPose] = useState(0);
  const [direction, setDirection] = useState(0);
  // Which group of options is open under the stage.
  const [tab, setTab] = useState<"character" | "costume" | "scene">("costume");

  const [character, setCharacter] = useState<Character | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  // A build that failed (the choices it was for, and why), and how many times "ลองใหม่" has been pressed since.
  const [buildError, setBuildError] = useState<{ wanted: string; message: string } | null>(null);
  const [attempt, setAttempt] = useState(0);
  // The "เริ่มใหม่" button asks once more before it clears everything; it goes back by itself after a few seconds.
  const [confirmReset, setConfirmReset] = useState(false);
  // The choices the shown character was built for; the stage dims while it differs from the current ones.
  const [builtFor, setBuiltFor] = useState<string | null>(null);
  // The items the shown character wears, so a slot can show a spinner while its item is still coming.
  const [builtIds, setBuiltIds] = useState<number[]>([]);
  // /effect: whether the effects of worn items play, and the ones loaded for the shown character.
  const [effectOn, setEffectOn] = useState(true);
  // A Footprint item chosen on its own (not a part of any Costume).
  const [footprintId, setFootprintId] = useState<number | null>(null);
  // The effect stone (Enchant) chosen for each place.
  const [stonePicks, setStonePicks] = useState<Picks>(NONE);
  // The place whose stone window is open.
  const [stoneSlot, setStoneSlot] = useState<Place | null>(null);
  const [effects, setEffects] = useState<{ effect: StrEffect; bounds: Bounds | null; behind: boolean; head: boolean }[]>([]);
  /** The size of the character against its normal size, when a stone makes it smaller (Shrink). */
  const [bodyScale, setBodyScale] = useState(1);
  /** A stone makes a copy of the character stand behind it (Shadow). */
  const [shadow, setShadow] = useState(false);
  /** A stone washes the character white (White Body). */
  const [whiten, setWhiten] = useState(false);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<StrRenderer | null>(null);
  // Footprints of worn items (left on the ground while walking, under the character) and where to draw.
  const [footprints, setFootprints] = useState<Footprint[]>([]);
  const [view, setView] = useState({ scale: 1, centreX: 0, centreY: 0 });
  // Zoom: a share of the usual size (the stage itself never moves).
  const [zoom, setZoom] = useState(1);
  // The name written under the character, and a picture the player imported to stand behind it.
  const [name, setName] = useState("");
  const [background, setBackground] = useState<Background | null>(null);
  // A file is being dragged over the stage.
  const [dragging, setDragging] = useState(false);
  const [backgroundError, setBackgroundError] = useState<string | null>(null);
  const [gifProgress, setGifProgress] = useState<number | null>(null);
  const [gifFailed, setGifFailed] = useState(false);
  // How the GIF is made, and what the last one saved came to.
  const [gifSettings, setGifSettings] = useState<GifSettings>(GIF_DEFAULTS);
  const [gifSaved, setGifSaved] = useState<string | null>(null);
  const nameRef = useRef("");
  const sceneRef = useRef<Scene | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current = name;
  }, [name]);
  // The imported picture's address is given back when it is replaced or the page closes.
  useEffect(() => {
    const url = background?.url;
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [background]);
  // A picture copied to the clipboard (Ctrl+V) becomes the background too, unless the player is typing text.
  useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const file = Array.from(event.clipboardData?.files ?? []).find((entry) => entry.type.startsWith("image/"));
      if (!file || (event.target instanceof HTMLElement && event.target.closest("input, textarea"))) return;
      event.preventDefault();
      openBackground(
        file,
        (picked) => {
          setBackground(picked);
          setBackgroundError(null);
        },
        setBackgroundError,
      );
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, []);
  const backRef = useRef<HTMLCanvasElement>(null);
  const backRendererRef = useRef<StrRenderer | null>(null);
  // A failed draw, with the character and view it happened for; it shows only while that view is still on screen.
  const [drawError, setDrawError] = useState<{ character: Character; action: number; message: string } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch("/assets/json/CostumeIndex.json")
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then(setIndex)
      .catch(() => setFailed(true));
  }, []);

  const job: CostumeJob | undefined = index?.jobs.find((entry) => entry.id === jobId);
  const mountKind = job?.mounts ? Object.keys(job.mounts)[0] : undefined;
  const mountBody = mountKind ? job?.mounts?.[mountKind] : undefined;
  const bodyName = (mounted && mountBody ? mountBody : job?.body)?.[gender];
  const hairColourCount = index?.hairstyles[gender]?.[style] ?? 1;
  // The outfits this body has (0 = the job's own, 1-4 alternate) and the Body colours of the chosen one.
  const outfitLists = bodyName ? index?.bodyOutfits?.[gender]?.[bodyName] : undefined;
  const outfitChoices = [0, 1, 2, 3, 4].filter((number) => number === 0 || (outfitLists?.[number]?.length ?? 0) > 0);
  const outfitNow = outfitChoices.includes(outfit) ? outfit : 0;
  const bodySamples = outfitLists?.[outfitNow];
  const bodyColours = Math.max(bodySamples?.length ?? 0, 1);
  const wanted = JSON.stringify([gender, bodyName, style, hairColour, bodyColour, outfitNow, picks, effectOn, footprintId, stonePicks]);
  const loading = builtFor !== wanted;
  // The shown character is not the one asked for because its files did not come.
  const stale = !loading && buildError?.wanted === wanted;

  useEffect(() => {
    if (!confirmReset) return;
    const timer = setTimeout(() => setConfirmReset(false), RESET_CONFIRM_MS);
    return () => clearTimeout(timer);
  }, [confirmReset]);

  // Builds the character whenever a choice changes.
  useEffect(() => {
    if (!index || !bodyName) return;
    let cancelled = false;

    (async () => {
      // Taps in quick succession (a hair colour, the next style) start one build, for the last choice.
      await new Promise<void>((resolve) => setTimeout(resolve, BUILD_DELAY_MS));
      if (cancelled) return;
      const found: string[] = [];
      const colour = Math.min(bodyColour, bodyColours - 1);
      const [body, head] = await Promise.all([
        loadBody(gender, bodyName, colour, outfitNow),
        loadHead(gender, style, Math.min(hairColour, hairColourCount - 1)),
      ]);
      if (!body || !head) throw new Error("ไม่พบไฟล์ตัวละคร");

      const chosen = (Object.keys(picks) as Place[])
        .map((place) => index.items.find((item) => item.id === picks[place]))
        .filter((item): item is CostumeItem => Boolean(item));
      // One item that sits in several places is drawn once.
      const unique = chosen.filter((item, at) => chosen.indexOf(item) === at);
      const headgear = unique.filter((item) => item.kind === "headgear" && !item.noSprite).sort((a, b) => (a.layer ?? 0) - (b.layer ?? 0));
      const robes = unique.filter((item) => item.kind === "robe");

      const worn = await Promise.all(
        [...headgear, ...robes].map(async (item) => {
          const gear = await loadWorn(item, gender, bodyName, body);
          if (!gear) found.push(`${item.name}: โหลดไฟล์ของชิ้นนี้ไม่สำเร็จ`);
          return gear;
        }),
      );

      const extras = worn.filter((gear) => gear !== undefined);

      // Effects that are a sprite with its own animation join the other worn parts, only while /effect is on.
      if (effectOn) {
        for (const item of unique) {
          for (const part of item.spriteEffects ?? []) {
            try {
              const asset = await loadSpriteFiles(costumeFileUrl(`fx/${part.key}/e.spr`), costumeFileUrl(`fx/${part.key}/e.act`));
              extras.push({ kind: "effect", asset, behind: part.behind });
            } catch {
              found.push(`${item.name}: โหลดเอฟเฟกต์ไม่สำเร็จ`);
            }
          }
        }
      }

      // Effects, only while /effect is on: hat effects, and the Footprint left while walking.
      const shown: { effect: StrEffect; bounds: Bounds | null; behind: boolean; head: boolean }[] = [];
      const steps: Footprint[] = [];
      let smallest = 1;
      let copy = false;
      let white = false;
      if (effectOn) {
        for (const item of unique) {
          if (item.effectUnsupported) found.push(`${item.name}: เอฟเฟกต์ของชิ้นนี้ยังแสดงไม่ได้`);
          try {
            for (const part of item.effects ?? []) {
              const effect = await loadCostumeEffect(part.key, part.file);
              shown.push({ effect, bounds: measureStr(effect), behind: Boolean(part.behind), head: Boolean(part.head) });
            }
            if (item.footprint) {
              const step = await loadCostumeFootprint(item.footprint.key, item.footprint.info);
              if (step) steps.push(step);
            }
          } catch {
            found.push(`${item.name}: โหลดเอฟเฟกต์ไม่สำเร็จ`);
          }
        }
        for (const place of Object.keys(stonePicks) as Place[]) {
          const stone = index.stones?.find((entry) => entry.id === stonePicks[place]);
          if (!stone) continue;
          if (stone.bodyScale) {
            smallest = Math.min(smallest, stone.bodyScale);
            continue;
          }
          if (stone.shadow) {
            copy = true;
            continue;
          }
          if (stone.whiten) {
            white = true;
            continue;
          }
          if (stone.unsupported || !stone.effects) {
            found.push(`${stone.name}: เอฟเฟกต์ของหินนี้ยังแสดงไม่ได้`);
            continue;
          }
          try {
            for (const part of stone.effects) {
              const effect = await loadCostumeEffect(part.key, part.file, part.tint);
              shown.push({ effect, bounds: measureStr(effect), behind: Boolean(part.behind), head: Boolean(part.head) });
            }
          } catch {
            found.push(`${stone.name}: โหลดเอฟเฟกต์ไม่สำเร็จ`);
          }
        }
        const chosenStep = index.footprints?.find((entry) => entry.id === footprintId);
        if (chosenStep) {
          try {
            const step = await loadCostumeFootprint(chosenStep.key, chosenStep.info);
            if (step) steps.push(step);
          } catch {
            found.push(`${chosenStep.name}: โหลดเอฟเฟกต์ไม่สำเร็จ`);
          }
        }
      } else {
        for (const item of unique) if (item.noSprite) found.push(`${item.name}: มีแต่เอฟเฟกต์ เปิด /effect เพื่อดู`);
      }

      const built: Character = { body, head, extras };
      const framed = frameOf(built);

      if (!cancelled) {
        setEffects(shown);
        setBodyScale(smallest);
        setShadow(copy);
        setWhiten(white);
        setFootprints(steps);
        setView(framed);
        setCharacter(built);
        setBuiltIds(unique.map((item) => item.id));
        setNotes(found);
        setBuildError(null);
        setBuiltFor(wanted);
      }
    })()
      .catch((error: unknown) => {
        // The character on the stage stays (dimmed) and says it is not the one asked for, with a way to ask again.
        if (!cancelled) setBuildError({ wanted, message: error instanceof Error ? error.message : "โหลดไม่สำเร็จ" });
      })
      .finally(() => {
        if (!cancelled) setBuiltFor(wanted);
      });

    return () => {
      cancelled = true;
    };
  }, [
    index,
    gender,
    bodyName,
    style,
    hairColour,
    hairColourCount,
    bodyColour,
    bodyColours,
    outfitNow,
    picks,
    effectOn,
    footprintId,
    stonePicks,
    wanted,
    attempt,
  ]);

  // The WebGL layers that effects play on (over the character) and Footprints (under it), made while one is on screen.
  const hasFront = effects.some((fx) => !fx.behind);
  // Under the character: Footprints and the effects the game draws before it.
  const hasBack = footprints.length > 0 || effects.some((fx) => fx.behind);
  const hasFoot = hasBack;
  useEffect(() => {
    const canvas = frontRef.current;
    if (!canvas || !hasFront) return;
    const renderer = createStrRenderer(canvas);
    rendererRef.current = renderer;
    return () => {
      renderer?.dispose();
      rendererRef.current = null;
    };
  }, [hasFront]);
  useEffect(() => {
    const canvas = backRef.current;
    if (!canvas || !hasFoot) return;
    const renderer = createStrRenderer(canvas);
    backRendererRef.current = renderer;
    return () => {
      renderer?.dispose();
      backRendererRef.current = null;
    };
  }, [hasFoot]);

  // Draws the character, moving.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !character) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const action = pose * 8 + direction;
    if (!character.body.act.actions[action]) return;

    // The character's own middle stays in the middle of the window, whatever the zoom.
    const scale = view.scale * zoom;
    const scene: Scene = {
      character,
      effects,
      footprints,
      action,
      scale,
      bodyScale,
      shadow,
      whiten,
      originX: CANVAS_WIDTH / 2 - scale * view.centreX,
      originY: CANVAS_HEIGHT * STAGE_CENTRE_Y - scale * view.centreY,
      name: "",
    };
    sceneRef.current = scene;

    let raf = 0;
    // The clock starts at the first frame: the browser's frame time can be slightly earlier than `performance.now()`
    // taken before it, which would make the time negative and pick a frame that does not exist.
    let start: number | undefined;
    const tick = (now: number) => {
      start ??= now;
      try {
        paintScene({ ...scene, name: nameRef.current }, ctx, rendererRef.current, backRendererRef.current, Math.max(0, now - start));
      } catch (error) {
        // Stop the loop rather than throw on every frame, and say what failed.
        console.error("Costume simulator: draw failed", error);
        setDrawError({ character, action, message: error instanceof Error ? error.message : String(error) });
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [character, effects, footprints, bodyScale, shadow, whiten, view, zoom, pose, direction]);

  if (failed) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-error">โหลดรายการไม่สำเร็จ (public/assets/json/CostumeIndex.json) รัน scripts/extract-costume.mjs ก่อน</p>
      </main>
    );
  }
  if (!index) return <div className="min-h-[50vh]" aria-busy="true" />;

  /**
   * What the socket under a place takes: effect stones, and for the Garment the effects that play while walking
   * (Footprints, which the game gives as an Enchant of a Costume garment).
   */
  const socketOptions = (place: Place): { id: number; name: string; unsupported?: boolean }[] =>
    place === "garment"
      ? (index.footprints ?? []).map(({ id, name }) => ({ id, name }))
      : (index.stones ?? []).filter((stone) => stone.slot === place);
  const socketValue = (place: Place) => (place === "garment" ? footprintId : stonePicks[place]);
  const socketName = (place: Place) =>
    socketOptions(place)
      .find((option) => option.id === socketValue(place))
      ?.name.replace(/\s*Effect\s*\(.*\)\s*$/i, "")
      .replace(/\s*Footprints?$/i, "");

  const itemsFor = (place: Place) =>
    index.items.filter((item) => item.slots.includes(place) && item.genders.includes(gender)).sort((a, b) => a.name.localeCompare(b.name));
  // The stage is a little lower while a Costume is being chosen, so the slot bar and the list under it have room.
  const stageDvh = tab === "costume" ? 30 : 38;
  const activeInfo = PLACES.find((entry) => entry.slot === activeSlot) ?? PLACES[0];
  const hairstyleNumbers = Object.keys(index.hairstyles[gender] ?? {})
    .map(Number)
    .sort((a, b) => a - b);
  const styleAt = hairstyleNumbers.indexOf(style);
  const stepStyle = (step: number) => {
    const next = hairstyleNumbers[(styleAt + step + hairstyleNumbers.length) % hairstyleNumbers.length];
    setStyle(next);
    setHairColour(0);
  };
  // A job only one gender can play gives way to Novice when the other gender is chosen.
  const changeGender = (next: CostumeGender) => {
    setGender(next);
    if (!job?.genders.includes(next)) {
      setJobId("novice");
      setMounted(false);
    }
  };
  const turn = (step: number) => setDirection((d) => (d + step + DIRECTIONS.length) % DIRECTIONS.length);
  const wornCount = new Set(Object.values(picks).filter((id) => id !== null)).size;
  const itemOf = (id: number | null) => (id === null ? undefined : index.items.find((item) => item.id === id));
  // An item that takes several places fills all of them; they cannot be given to other items.
  const covering = (() => {
    const held = itemOf(picks[activeSlot]);
    return held && held.slots.length > 1 ? held : undefined;
  })();

  /**
   * Puts an item on, or takes the one in `place` off (null). An item that takes several places fills all of
   * them, throwing off whatever was there; taking it off empties all of them.
   */
  const choose = (place: Place, id: number | null) =>
    setPicks((current) => {
      const next = { ...current };
      if (id === null) {
        const held = current[place];
        for (const other of PLACES) if (held !== null && current[other.slot] === held) next[other.slot] = null;
        return next;
      }
      const covers = (itemOf(id)?.slots ?? [place]).filter((slot): slot is Place => PLACES.some((p) => p.slot === slot));
      const displaced = new Set(covers.map((slot) => current[slot]).filter((held): held is number => held !== null));
      // An item thrown off from one place leaves the others it covered too.
      for (const other of PLACES) {
        const held = next[other.slot];
        if (held !== null && displaced.has(held)) next[other.slot] = null;
      }
      for (const slot of covers) next[slot] = id;
      return next;
    });

  const takeBackground = (file: File | undefined) =>
    openBackground(
      file,
      (picked) => {
        setBackground(picked);
        setBackgroundError(null);
      },
      setBackgroundError,
    );
  const chooseBackground = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    takeBackground(file);
  };
  /** Handlers that make a box take a picture dropped on it. */
  const dropTarget = {
    onDragOver: (event: React.DragEvent) => {
      if (!event.dataTransfer.types.includes("Files")) return;
      event.preventDefault();
      setDragging(true);
    },
    onDragLeave: (event: React.DragEvent) => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
    },
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      const files = Array.from(event.dataTransfer.files);
      takeBackground(files.find((entry) => entry.type.startsWith("image/")) ?? files[0]);
    },
  };

  const saveGif = async () => {
    const scene = sceneRef.current;
    if (!scene || gifProgress !== null) return;
    setGifFailed(false);
    setGifSaved(null);
    setGifProgress(0);
    try {
      const stageColor = stageRef.current ? getComputedStyle(stageRef.current).backgroundColor : "#0a1420";
      const blob = await exportCostumeGif(
        { ...scene, name },
        { ...gifSettings, stageColor, background: background?.image ?? null, logoUrl: LOGO_SRC, onProgress: setGifProgress },
      );
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const base = `${name.trim() || job?.label || "costume"}_${POSES.find((entry) => entry.type === pose)?.label ?? ""}`;
      link.download = `${base.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_")}.gif`;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      const size = blob.size >= 1e6 ? `${(blob.size / 1e6).toFixed(1)} MB` : `${Math.max(1, Math.round(blob.size / 1e3))} KB`;
      setGifSaved(`บันทึกแล้ว ${size} · ${gifSettings.width}×${gifHeight(gifSettings.width)}`);
    } catch (error) {
      console.error("Costume simulator: GIF failed", error);
      setGifFailed(true);
    } finally {
      setGifProgress(null);
    }
  };

  /** Takes the item in `place` off, with the effect stones of every place it filled. */
  const takeOff = (place: Place) => {
    const covered = (itemOf(picks[place])?.slots ?? [place]) as Place[];
    choose(place, null);
    setStonePicks((current) => {
      const next = { ...current };
      for (const slot of covered) next[slot] = null;
      return next;
    });
    if (covered.includes("garment")) setFootprintId(null);
  };

  // Asks again before clearing everything: the first press arms the button, the second one (within a few seconds) resets.
  const askReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    setConfirmReset(false);
    reset();
  };
  const retry = () => {
    setBuildError(null);
    setBuiltFor(null);
    setAttempt((n) => n + 1);
  };

  const reset = () => {
    setPicks(NONE);
    setMounted(false);
    setStyle(1);
    setHairColour(0);
    setBodyColour(0);
    setOutfit(0);
    setFootprintId(null);
    setStonePicks(NONE);
    setName("");
  };

  return (
    <main
      className="mx-auto flex h-[calc(100dvh-4rem)] max-w-[40rem] flex-col gap-2 px-2 pb-2 pt-2 sm:px-3"
      onKeyDown={(e) => {
        // A focused box or button uses the arrow keys itself.
        if (!(e.target instanceof HTMLElement) || e.target.closest("input, select, textarea, [role=listbox]")) return;
        if (e.key === "ArrowLeft") turn(1);
        if (e.key === "ArrowRight") turn(-1);
      }}
    >
      <h1 className="sr-only sm:hidden">Simulator Costume ROC</h1>
      <header className="hidden shrink-0 items-end justify-between gap-2 sm:flex">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Simulator Costume ROC</h1>
          <p className="text-sm text-base-content/70">เลือกอาชีพ ผม สี และ Costume แล้วดูตัวละครสวมใส่</p>
        </div>
        <button type="button" onClick={askReset} className={`btn btn-sm gap-2 ${confirmReset ? "btn-error" : "btn-ghost"}`}>
          <RotateCcw aria-hidden="true" className="h-4 w-4" />
          {confirmReset ? "ยืนยันรีเซ็ต?" : "เริ่มใหม่"}
        </button>
      </header>

      {/* The stage: the answer, so it is the widest thing on every screen and stays in view while the options scroll under it. */}
      <div className="shrink-0">
        <div
          ref={stageRef}
          {...dropTarget}
          style={{ height: `min(clamp(180px, ${stageDvh}dvh, 520px), calc((100vw - 1rem) * 1.0313))`, aspectRatio: "640 / 660" }}
          className={`mx-auto relative overflow-hidden rounded-box border border-base-300 bg-neutral text-neutral-content ${STAGE_GRID}`}
        >
          {/* Corner ticks echo the Sidebar's tiles. */}
          <span aria-hidden="true" className="absolute left-2 top-2 h-3 w-3 border-l-2 border-t-2 border-primary" />
          <span aria-hidden="true" className="absolute right-2 top-2 h-3 w-3 border-r-2 border-t-2 border-primary" />
          <span aria-hidden="true" className="absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-primary" />
          <span aria-hidden="true" className="absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-primary" />

          <div className="absolute left-4 top-4 z-10 leading-tight">
            <span className="block text-sm font-bold text-primary">{job?.label}</span>
            <span className="block text-xs text-neutral-content/80">
              {gender === "m" ? "ชาย" : "หญิง"}
              {mounted && mountKind ? ` · ${MOUNT_NAMES[mountKind] ?? mountKind}` : ""}
            </span>
          </div>
          {dragging && (
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-box border-2 border-dashed border-primary bg-base-100/80 text-sm font-bold text-primary">
              วางรูปที่นี่เพื่อใช้เป็นพื้นหลัง
            </div>
          )}
          {background && (
            <span className="absolute left-4 top-14 z-10 max-w-[60%] truncate rounded-full bg-base-100/85 px-2.5 py-0.5 text-[11px] font-medium text-base-content">
              พื้นหลัง: {background.name}
            </span>
          )}
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-base-100/40" role="status">
              <span className="loading loading-spinner loading-lg text-primary" aria-hidden="true" />
              <span className="rounded-full bg-base-100/80 px-3 py-1 text-xs font-medium">กำลังโหลด…</span>
            </div>
          )}

          <div className="absolute inset-0">
            {background && (
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${background.url})` }}
              />
            )}
            {/* Footprints are left on the ground, so they play under the character. */}
            {hasFoot && (
              <canvas
                ref={backRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
            )}
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              className={`relative block h-full w-full transition-opacity duration-150 ${loading || stale ? "opacity-60" : ""}`}
            />
            {/* Effects add light onto the scene, as in the game, so they play on a dark stage over the character. */}
            {hasFront && (
              <canvas
                ref={frontRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full"
              />
            )}
          </div>

          {/* Controls over the stage, so the picture can fill the width and the controls stay in reach. */}
          <div className="absolute right-2 top-2 z-20 flex items-center gap-1">
            <div className="rounded-full bg-base-100/85 shadow-sm backdrop-blur flex items-center">
              <button
                type="button"
                onClick={() => setZoom((now) => ZOOMS[Math.max(ZOOMS.indexOf(now) - 1, 0)])}
                disabled={zoom <= ZOOMS[0]}
                aria-label="ย่อ"
                className="btn btn-ghost btn-circle btn-sm min-h-10 min-w-10 text-lg"
              >
                −
              </button>
              <button type="button" onClick={() => setZoom(1)} aria-label="ขนาดปกติ" className="px-1 text-[11px] font-semibold tabular-nums">
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => setZoom((now) => ZOOMS[Math.min(ZOOMS.indexOf(now) + 1, ZOOMS.length - 1)])}
                disabled={zoom >= ZOOMS[ZOOMS.length - 1]}
                aria-label="ขยาย"
                className="btn btn-ghost btn-circle btn-sm min-h-10 min-w-10 text-lg"
              >
                +
              </button>
            </div>
            <button
              type="button"
              aria-pressed={effectOn}
              onClick={() => setEffectOn((on) => !on)}
              title="/effect"
              className={`btn btn-sm min-h-10 gap-1 rounded-full px-3 shadow-sm ${effectOn ? "btn-primary" : "bg-base-100/85 text-base-content/70"}`}
            >
              <Sparkles aria-hidden="true" className="h-4 w-4" />
              <span className="text-xs font-bold">{effectOn ? "เปิด" : "ปิด"}</span>
            </button>
          </div>

          {/* What the page has to say (a failed draw or load, an effect it cannot show) is written over the bottom of the stage, which has a fixed size, so no message ever pushes the bar and the list below it. */}
          <div className="pointer-events-none absolute inset-x-2 bottom-2 z-20 flex max-h-[45%] flex-col justify-end gap-1 overflow-y-auto">
            {drawError && drawError.character === character && drawError.action === pose * 8 + direction && (
              <p
                role="alert"
                className="pointer-events-auto rounded-field border border-error/60 bg-base-100/95 px-2 py-1 text-xs text-base-content"
              >
                วาดไม่สำเร็จ: {drawError.message}
              </p>
            )}
            {stale && buildError && (
              <div
                role="alert"
                className="pointer-events-auto flex items-center gap-2 rounded-field border border-error/60 bg-base-100/95 px-2 py-1 text-xs text-base-content"
              >
                <span className="min-w-0 grow">
                  โหลดตัวละครไม่สำเร็จ (ที่เห็นคือชุดก่อนหน้า) <span className="break-all opacity-70">{buildError.message}</span>
                </span>
                <button type="button" onClick={retry} className="btn btn-error btn-xs shrink-0">
                  ลองใหม่
                </button>
              </div>
            )}
            {notes.map((note) => (
              <p
                key={note}
                role="status"
                className="pointer-events-auto flex items-center gap-2 rounded-field border border-warning/60 bg-base-100/95 px-2 py-1 text-xs text-base-content"
              >
                <span className="min-w-0 grow">{note}</span>
                {note.includes("ไม่สำเร็จ") && (
                  <button type="button" onClick={retry} className="btn btn-warning btn-xs shrink-0">
                    ลองใหม่
                  </button>
                )}
              </p>
            ))}
          </div>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div role="group" aria-label="ท่าทาง" className="join">
            {POSES.map((entry) => (
              <button
                key={entry.type}
                type="button"
                aria-pressed={pose === entry.type}
                onClick={() => setPose(entry.type)}
                className={`btn join-item min-h-11 px-2.5 text-sm ${pose === entry.type ? "btn-primary" : ""}`}
              >
                {entry.label}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center rounded-field border border-base-300 bg-base-100">
            <button type="button" onClick={() => turn(1)} aria-label="หันไปทางซ้าย" className="btn btn-ghost btn-square min-h-11 min-w-11">
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <span role="status" className="min-w-[4.25rem] text-center text-xs font-semibold">
              {DIRECTIONS[direction]}
            </span>
            <button type="button" onClick={() => turn(-1)} aria-label="หันไปทางขวา" className="btn btn-ghost btn-square min-h-11 min-w-11">
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
          <button
            type="button"
            onClick={askReset}
            aria-label={confirmReset ? "ยืนยันรีเซ็ต" : "เริ่มใหม่"}
            title={confirmReset ? "ยืนยันรีเซ็ต" : "เริ่มใหม่"}
            className={`btn min-h-11 min-w-11 sm:hidden ${confirmReset ? "btn-error gap-1 px-2 text-xs" : "btn-ghost btn-square"}`}
          >
            <RotateCcw aria-hidden="true" className="h-5 w-5" />
            {confirmReset && "ยืนยัน?"}
          </button>
        </div>
        {tab === "costume" && (
          <div role="tablist" aria-label="ตำแหน่งที่สวมใส่" className="mx-auto mt-2 grid max-w-[40rem] grid-cols-4 gap-2 pb-4">
            {PLACES.map(({ slot, english }) => {
              const worn = itemOf(picks[slot]);
              return (
                <div key={slot} className="relative flex">
                  <SlotTab
                    slot={slot}
                    english={english}
                    active={activeSlot === slot}
                    worn={worn}
                    sheet={index.icons}
                    pending={loading && picks[slot] !== null && !builtIds.includes(picks[slot])}
                    unavailable={Boolean(worn && !worn.genders.includes(gender))}
                    covers={worn?.slots.length ?? 0}
                    socketName={worn && socketValue(slot) !== null ? socketName(slot) : undefined}
                    onSelect={() => setActiveSlot(slot)}
                    onRemove={() => takeOff(slot)}
                  />
                  <button
                    type="button"
                    disabled={!worn || socketOptions(slot).length === 0}
                    onClick={() => setStoneSlot(slot)}
                    aria-label={slot === "garment" ? "เอฟเฟกต์เดิน (รอยเท้า)" : `หินเอฟเฟกต์ ${english}`}
                    title={
                      socketValue(slot) !== null
                        ? socketName(slot)
                        : worn
                          ? slot === "garment"
                            ? "ใส่เอฟเฟกต์เดิน (รอยเท้า)"
                            : "ใส่หินเอฟเฟกต์"
                          : "ใส่ Costume ก่อนจึงใส่หินได้"
                    }
                    className={`absolute -bottom-3 -right-2 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-base-100 shadow transition-colors disabled:opacity-40 ${
                      socketValue(slot) !== null
                        ? "border-secondary bg-secondary/25 ring-2 ring-secondary/40"
                        : "border-dashed border-base-content/40 hover:border-secondary"
                    }`}
                  >
                    <SocketPicture
                      sheet={index.icons}
                      cell={slot === "garment" ? index.icons.footprint : index.icons.stone}
                      on={socketValue(slot) !== null}
                    />
                    {socketValue(slot) !== null && (
                      <span
                        aria-hidden="true"
                        className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-base-100 bg-secondary"
                      />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div role="tablist" aria-label="หมวดตัวเลือก" className="tabs tabs-box grid shrink-0 grid-cols-3 bg-base-200 p-1">
        {(
          [
            ["character", "ตัวละคร"],
            ["costume", "Costume"],
            ["scene", "ฉาก / บันทึก"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`tab min-h-11 px-1 text-xs font-semibold sm:text-sm ${tab === key ? "tab-active" : ""}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <div className="grid gap-3 pb-6">
          {tab === "character" && (
            <>
              <Group title="ตัวละคร">
                <Field label="ชื่อ (แสดงใต้ตัวละคร)" hint={`${name.length}/24`}>
                  <input
                    className="input input-bordered min-h-11 w-full"
                    maxLength={24}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ใส่ชื่อตัวละคร"
                    aria-label="ชื่อตัวละคร"
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-[minmax(0,12rem)_minmax(0,1fr)]">
                  <Field label="เพศ">
                    <div role="group" aria-label="เพศ" className="join w-full">
                      {(
                        [
                          ["m", "ชาย"],
                          ["f", "หญิง"],
                        ] as const
                      ).map(([value, text]) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={gender === value}
                          onClick={() => changeGender(value)}
                          className={`btn join-item min-h-11 flex-1 ${gender === value ? "btn-primary" : ""}`}
                        >
                          {text}
                        </button>
                      ))}
                    </div>
                  </Field>

                  <Field label="อาชีพ">
                    <JobPicker
                      jobs={index.jobs}
                      gender={gender}
                      value={jobId}
                      onChange={(id) => {
                        setJobId(id);
                        setMounted(false);
                      }}
                    />
                  </Field>
                </div>

                {mountKind && (
                  <Field label="พาหนะ">
                    <div role="group" aria-label="พาหนะ" className="join w-full">
                      <button
                        type="button"
                        aria-pressed={!mounted}
                        onClick={() => setMounted(false)}
                        className={`btn join-item min-h-11 flex-1 ${!mounted ? "btn-primary" : ""}`}
                      >
                        ไม่ขี่
                      </button>
                      <button
                        type="button"
                        aria-pressed={mounted}
                        onClick={() => setMounted(true)}
                        className={`btn join-item min-h-11 flex-1 ${mounted ? "btn-primary" : ""}`}
                      >
                        ขี่ {MOUNT_NAMES[mountKind] ?? mountKind}
                      </button>
                    </div>
                  </Field>
                )}

                {!bodyName && <p className="text-sm text-warning">อาชีพนี้ไม่มีตัวละครเพศนี้</p>}
              </Group>
              <Group title="ผมและชุด">
                <Field label="ทรงผม" hint={`${styleAt + 1}/${hairstyleNumbers.length}`}>
                  <div className="flex items-center justify-between gap-2 rounded-box border border-base-300 p-1">
                    <button
                      type="button"
                      onClick={() => stepStyle(-1)}
                      aria-label="ทรงผมก่อนหน้า"
                      className="btn btn-ghost btn-square min-h-11 min-w-11"
                    >
                      <ChevronLeft aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <span role="status" className="text-sm font-medium">
                      ทรง {style}
                    </span>
                    <button
                      type="button"
                      onClick={() => stepStyle(1)}
                      aria-label="ทรงผมถัดไป"
                      className="btn btn-ghost btn-square min-h-11 min-w-11"
                    >
                      <ChevronRight aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </Field>
                <Field label="สีผม" hint={`${Math.min(hairColour, hairColourCount - 1) + 1}/${hairColourCount}`}>
                  <ColourChips
                    count={hairColourCount}
                    value={Math.min(hairColour, hairColourCount - 1)}
                    onChange={setHairColour}
                    label="สีผม"
                    samples={index.hairSwatches?.[gender]?.[style]}
                  />
                </Field>
                {outfitChoices.length > 1 && (
                  <Field label="ชุด">
                    <div role="group" aria-label="ชุด" className="flex flex-wrap gap-1.5">
                      {outfitChoices.map((number) => (
                        <button
                          key={number}
                          type="button"
                          aria-pressed={outfitNow === number}
                          onClick={() => setOutfit(number)}
                          className={`btn btn-sm min-h-10 ${outfitNow === number ? "btn-primary" : "btn-outline border-base-300"}`}
                        >
                          {number === 0 ? "ปกติ" : `ชุด ${number + 1}`}
                        </button>
                      ))}
                    </div>
                  </Field>
                )}
                <Field label="สีชุด" hint={`${Math.min(bodyColour, bodyColours - 1) + 1}/${bodyColours}`}>
                  {bodyName && bodyColours > 1 ? (
                    <div role="group" aria-label="สีชุด" className="flex flex-wrap gap-2">
                      {Array.from({ length: bodyColours }, (_, at) => (
                        <button
                          key={at}
                          type="button"
                          aria-pressed={Math.min(bodyColour, bodyColours - 1) === at}
                          aria-label={`สีชุด ${at + 1}`}
                          onClick={() => setBodyColour(at)}
                          className={`rounded-field border-2 bg-base-200 transition-colors ${
                            Math.min(bodyColour, bodyColours - 1) === at
                              ? "border-primary bg-primary/10"
                              : "border-base-300 hover:border-primary/50"
                          }`}
                        >
                          <SpriteThumb gender={gender} bodyName={bodyName} colour={at} outfit={outfitNow} size={56} />
                        </button>
                      ))}
                    </div>
                  ) : null}
                </Field>
              </Group>
            </>
          )}
          {tab === "costume" && (
            <>
              <Group title={`ช่อง${activeInfo.label} (${activeInfo.english})${wornCount ? ` · ใส่อยู่ ${wornCount} ชิ้น` : ""}`}>
                {covering ? (
                  <div className="flex items-center justify-between gap-3 rounded-box border border-base-300 bg-base-200 px-3 py-3 text-sm">
                    <span>
                      ช่องนี้ถูก <b>{covering.name}</b> ครอบอยู่ <PlaceChips slots={covering.slots as Place[]} /> ถอดชิ้นนี้ก่อนจึงเลือกอย่างอื่นได้
                    </span>
                    <button type="button" className="btn btn-sm btn-outline shrink-0" onClick={() => takeOff(activeSlot)}>
                      ถอดออก
                    </button>
                  </div>
                ) : (
                  <ItemGrid
                    key={`${activeSlot}-${gender}`}
                    items={itemsFor(activeSlot)}
                    sheet={index.icons}
                    value={picks[activeSlot]}
                    onPick={(id) => (id === null ? takeOff(activeSlot) : choose(activeSlot, id))}
                  />
                )}
              </Group>
            </>
          )}
          {tab === "scene" && (
            <>
              <div
                {...dropTarget}
                className={`grid gap-2 rounded-box border p-3 transition-colors ${
                  dragging
                    ? "border-dashed border-primary bg-primary/10"
                    : background
                      ? "border-primary/60 bg-primary/5"
                      : "border-base-300 bg-base-100"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold">พื้นหลัง</span>
                  {background && <span className="rounded bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-content">ใช้อยู่</span>}
                </div>
                {background ? (
                  <div className="flex items-center gap-3">
                    <div
                      aria-hidden="true"
                      className="h-14 w-20 shrink-0 rounded-field border border-base-300 bg-cover bg-center"
                      style={{ backgroundImage: `url(${background.url})` }}
                    />
                    <div className="min-w-0 flex-1 leading-tight">
                      <span className="block truncate text-sm font-medium">{background.name}</span>
                      <span className="block text-xs tabular-nums text-base-content/60">
                        {background.image.naturalWidth}×{background.image.naturalHeight}
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-base-content/70">ยังไม่มีพื้นหลัง</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="btn btn-outline min-h-11 flex-1 gap-2 border-base-300"
                    onClick={() => fileRef.current?.click()}
                  >
                    <ImagePlus aria-hidden="true" className="h-5 w-5" />
                    {background ? "เปลี่ยนรูปพื้นหลัง" : "นำเข้ารูปพื้นหลัง"}
                  </button>
                  {background && (
                    <button
                      type="button"
                      className="btn btn-ghost min-h-11 min-w-11"
                      aria-label="เอารูปพื้นหลังออก"
                      onClick={() => setBackground(null)}
                    >
                      <X aria-hidden="true" className="h-5 w-5" />
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={chooseBackground} />
                {backgroundError && (
                  <p role="alert" className="text-xs text-error">
                    {backgroundError}
                  </p>
                )}
                <p className="text-xs text-base-content/60">
                  ลากรูปมาวางบนเวทีหรือกล่องนี้ หรือกด Ctrl+V วางรูปที่คัดลอกไว้ รูปอยู่หลังตัวละครและอยู่ใน GIF ด้วย (รูป GIF เคลื่อนไหวใช้เฟรมแรก)
                </p>
              </div>
              <div className="grid gap-3 rounded-box border border-base-300 bg-base-100 p-3">
                <h3 className="text-sm font-bold">ตั้งค่า GIF</h3>
                <GifChoice
                  label="ขนาดภาพ"
                  value={gifSettings.width}
                  disabled={gifProgress !== null}
                  onChange={(width) => setGifSettings((now) => ({ ...now, width }))}
                  options={GIF_WIDTHS.map((width) => ({
                    value: width,
                    name: width === 420 ? "เล็ก" : width === 560 ? "ปกติ" : "ชัด",
                    detail: `${width}×${gifHeight(width)}`,
                  }))}
                />
                <GifChoice
                  label="ความลื่นไหล"
                  value={gifSettings.fps}
                  disabled={gifProgress !== null}
                  onChange={(fps) => setGifSettings((now) => ({ ...now, fps }))}
                  options={GIF_FPS.map((fps) => ({
                    value: fps,
                    name: fps === 30 ? "ลื่น" : fps === 15 ? "ปกติ" : "ประหยัด",
                    detail: `${fps} เฟรม/วินาที`,
                  }))}
                />
                <GifChoice
                  label="ความยาวสูงสุด"
                  value={gifSettings.seconds}
                  disabled={gifProgress !== null}
                  onChange={(seconds) => setGifSettings((now) => ({ ...now, seconds }))}
                  options={GIF_SECONDS.map((seconds) => ({
                    value: seconds,
                    name: `${seconds} วินาที`,
                    detail: seconds === 6 ? "ครบรอบได้มากกว่า" : "ไฟล์เล็กกว่า",
                  }))}
                />
                <p className="text-xs text-base-content/60">
                  ภาพใหญ่ ลื่น และยาว ไฟล์จะใหญ่ขึ้นและสร้างนานขึ้น ภาพที่ไม่ขยับได้ภาพเดียว ความยาวคือเวลาที่เอฟเฟกต์ท่าทางและเดินวนครบรอบพอดี
                </p>
              </div>
              <div className="grid gap-1.5">
                <button
                  type="button"
                  onClick={saveGif}
                  disabled={gifProgress !== null || loading || stale || !character}
                  aria-busy={gifProgress !== null}
                  className="btn btn-primary min-h-12 w-full gap-2"
                >
                  {gifProgress !== null ? (
                    <Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download aria-hidden="true" className="h-5 w-5" />
                  )}
                  {gifProgress !== null ? `กำลังสร้าง GIF… ${Math.round(gifProgress * 100)}%` : "บันทึกเป็น GIF"}
                </button>
                {gifProgress !== null && (
                  <progress
                    className="progress progress-primary h-1 w-full"
                    value={Math.round(gifProgress * 100)}
                    max={100}
                    aria-hidden="true"
                  />
                )}
                {gifSaved && (
                  <p role="status" className="text-center text-xs text-base-content/70">
                    {gifSaved}
                  </p>
                )}
                {gifFailed && (
                  <p role="alert" className="text-center text-xs text-error">
                    สร้าง GIF ไม่สำเร็จ
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {stoneSlot && (
        <StoneDialog
          key={stoneSlot}
          label={PLACES.find((entry) => entry.slot === stoneSlot)?.label ?? ""}
          english={PLACES.find((entry) => entry.slot === stoneSlot)?.english ?? ""}
          itemName={itemOf(picks[stoneSlot])?.name ?? ""}
          walking={stoneSlot === "garment"}
          stones={socketOptions(stoneSlot)}
          value={socketValue(stoneSlot)}
          onPick={(id) => (stoneSlot === "garment" ? setFootprintId(id) : setStonePicks((current) => ({ ...current, [stoneSlot]: id })))}
          onClose={() => setStoneSlot(null)}
        />
      )}
    </main>
  );
}
