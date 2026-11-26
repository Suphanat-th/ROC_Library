/**
 * A Footprint: the steps an item leaves on the ground while the character walks. Written for the Costume simulator
 * from the same rules as the Costume preview of Patch Convert (src/app/patch-convert/CostumePreview.tsx), which
 * still holds its own copy; keep the two in step until the preview uses this file.
 */
import type { FootprintInfo } from "@/data/costumePreview";
import { Character } from "@/utils/spriteComposer";
import {
  loadStrEffect,
  StrEffect,
  StrRenderer,
  strDuration,
  strFrameAt,
} from "@/utils/strEffect";

/** An ACT holds 8 directions for each pose: action = pose type × 8 + direction. The Walk pose. */
export const WALK = 1;

/**
 * The way each direction walks on screen (x right, y down). The ground is seen from above at a
 * slant, so a step towards or away from the viewer looks shorter.
 */
const HEADINGS = [
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
].map(([x, y]) => {
  const length = Math.hypot(x, y);
  return [x / length, y / length] as const;
});

export const GROUND_SLANT = 0.7;

/** The share of a step's life that the stage keeps in view; a mark fades towards its end. */
const FOOTPRINT_VISIBLE = 0.4;

/** How much bigger than the table's own size a mark is drawn here: at the table's size the steps look too small beside the character. */
const FOOTPRINT_SIZE = 1.8;

/** Values the game's table does not always give, in sprite pixels. */
const FOOTPRINT_DEFAULTS = { stride: 60, gap: 0, scale: 0.15, lift: 0 };

export interface Footprint {
  info: FootprintInfo;
  /** Left foot, right foot. */
  top: [StrEffect | null, StrEffect | null];
  bottom: [StrEffect | null, StrEffect | null];
}

/** A Footprint made of .str files; a footprint of pictures (PNG) is not shown. */
export async function loadFootprint(
  folder: string,
  info: FootprintInfo | undefined,
  lowercase = false,
): Promise<Footprint | undefined> {
  if (!info || info.Type !== "STR") return undefined;
  const load = (file: string | null) =>
    file ? loadStrEffect(folder, file, lowercase) : Promise.resolve(null);
  const [topLeft, topRight, bottomLeft, bottomRight] = await Promise.all([
    load(info.StrFile_Top_Left),
    load(info.StrFile_Top_Right),
    load(info.StrFile_Bottom_Left),
    load(info.StrFile_Bottom_Right),
  ]);
  return { info, top: [topLeft, topRight], bottom: [bottomLeft, bottomRight] };
}

/** How far from the character a step slides over the part of its life that the stage keeps in view, in sprite pixels. */
export function footprintReach(
  character: Character,
  footprint: Footprint,
): number {
  const walk = character.body.act.actions[WALK * 8];
  const cycle = walk ? walk.delay * walk.frames.length : 0;
  if (cycle <= 0) return 0;
  const { info, top, bottom } = footprint;
  const lifetime = Math.max(
    0,
    ...[...top, ...bottom].map((e) => (e ? strDuration(e) : 0)),
  );
  const stride = info.Stride ?? FOOTPRINT_DEFAULTS.stride;
  const gap = info.Gap ?? FOOTPRINT_DEFAULTS.gap;
  return (stride / (cycle / 2)) * lifetime * FOOTPRINT_VISIBLE + gap / 2;
}

/**
 * Paints the steps left so far while walking on the spot. A step is taken at the start and the middle of each walk
 * cycle, left foot first; each plays its effect once and slides back the way the character came.
 */
export function paintFootprint(
  renderer: StrRenderer,
  footprint: Footprint,
  {
    direction,
    cycle,
    elapsed,
  }: { direction: number; cycle: number; elapsed: number },
  originX: number,
  originY: number,
  scale: number,
) {
  const { info, top, bottom } = footprint;
  const stride = info.Stride ?? FOOTPRINT_DEFAULTS.stride;
  const gap = info.Gap ?? FOOTPRINT_DEFAULTS.gap;
  const lift = (info.Height_Top ?? 0) * FOOTPRINT_DEFAULTS.lift;
  const step = cycle / 2;
  const [hx, hy] = HEADINGS[direction];
  const angle = (Math.atan2(hx, -hy * GROUND_SLANT) * 180) / Math.PI;
  const lifetime = Math.max(
    0,
    ...[...top, ...bottom].map((e) => (e ? strDuration(e) : 0)),
  );

  const speed = stride / step;

  const first = Math.max(0, Math.ceil((elapsed - lifetime) / step));
  for (let k = first; k * step <= elapsed; k++) {
    const age = elapsed - k * step;
    const foot = k % 2;
    const side = (foot === 0 ? -1 : 1) * (gap / 2);
    // On the ground: back along the heading, and to one side of it for each foot.
    const groundX = -hx * speed * age - hy * side;
    const groundY = -hy * speed * age + hx * side;
    const x = originX + groundX * scale;
    const y = originY + groundY * GROUND_SLANT * scale;

    const mark = bottom[foot];
    if (mark && age < strDuration(mark)) {
      renderer.paint(
        mark,
        strFrameAt(mark, age),
        x,
        y,
        scale *
          FOOTPRINT_SIZE *
          (info.Scale_Bottom ?? FOOTPRINT_DEFAULTS.scale),
        info.IsAdjustAngle ? angle : 0,
      );
    }
    const rise = top[foot];
    if (rise && age < strDuration(rise)) {
      renderer.paint(
        rise,
        strFrameAt(rise, age),
        x,
        y - lift * scale,
        scale * FOOTPRINT_SIZE * (info.Scale_Top ?? FOOTPRINT_DEFAULTS.scale),
      );
    }
  }
}
