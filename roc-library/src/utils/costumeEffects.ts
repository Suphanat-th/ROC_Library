/**
 * Effects of the Costume simulator, kept once loaded. Every change of a choice builds the character again, and the
 * effects it wears would otherwise be fetched, unpacked and decoded again each time; here a loaded effect is kept for
 * the life of the page, and one that failed is forgotten so that "ลองใหม่" asks for it again.
 */
import type { FootprintInfo } from "@/data/costumePreview";
import { costumeFileUrl } from "@/utils/costumePack";
import { Footprint, loadFootprint } from "@/utils/footprintEffect";
import { loadProceduralEffect } from "@/utils/proceduralEffect";
import { loadStrEffect, StrEffect } from "@/utils/strEffect";

/**
 * Ways to paint an effect in another colour: every pixel keeps its brightness and takes the colour (0-1 for red, green and
 * blue), so a red effect becomes the same effect in that colour. Used where the game has one effect in several colours and
 * the stone shows another (Roaring is the C dragon, red in the game's files, in lilac).
 */
const TINTS: Record<string, [number, number, number]> = {
  lilac: [0.94, 0.84, 1],
}

function recolorer(tint: string | undefined): ((image: ImageData) => void) | undefined {
  const colour = tint ? TINTS[tint] : undefined
  if (!colour) return undefined
  return (image) => {
    const px = image.data
    for (let i = 0; i < px.length; i += 4) {
      const light = Math.max(px[i], px[i + 1], px[i + 2])
      px[i] = light * colour[0]
      px[i + 1] = light * colour[1]
      px[i + 2] = light * colour[2]
    }
  }
}

const effects = new Map<string, Promise<StrEffect>>();
const footprints = new Map<string, Promise<Footprint | undefined>>();

/** Key of the effects the page draws itself: the file is the name of the effect (see proceduralEffect.ts), not a .str. */
export const PROCEDURAL_KEY = "proc";

/** One .str effect of the Asset host's fx/<key>/ folder (file names there are all lower case), or an effect drawn by code. */
export function loadCostumeEffect(key: string, file: string, tint?: string): Promise<StrEffect> {
  const id = `${key}|${file}|${tint ?? ""}`;
  let found = effects.get(id);
  if (!found) {
    found =
      key === PROCEDURAL_KEY ? loadProceduralEffect(file) : loadStrEffect(costumeFileUrl(`fx/${key}`), file, true, recolorer(tint));
    found.catch(() => effects.delete(id));
    effects.set(id, found);
  }
  return found;
}

/** A Footprint of the Asset host's fx/<key>/ folder. */
export function loadCostumeFootprint(key: string, info: FootprintInfo | undefined): Promise<Footprint | undefined> {
  let found = footprints.get(key);
  if (!found) {
    found = loadFootprint(costumeFileUrl(`fx/${key}`), info, true);
    found.catch(() => footprints.delete(key));
    footprints.set(key, found);
  }
  return found;
}
