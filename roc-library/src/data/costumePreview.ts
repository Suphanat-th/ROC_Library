export type PreviewGender = "male" | "female";

const SPRITE_ROOT = "/assets/sprite_data";

/**
 * Headgear sprites are named `<item id>_male` / `<item id>_female` (.spr and .act) in
 * public/assets/sprite_data/PatchSprite. An item gets a Costume preview just by having them.
 */
export const costumePreviewUrls = (patchKey: string, gender: PreviewGender) => ({
  body: `${SPRITE_ROOT}/body/novice_${gender}`,
  head: `${SPRITE_ROOT}/hair/head1_${gender}`,
  hair: `${SPRITE_ROOT}/hair/color/head1_${gender}_0.pal`,
  gear: `${SPRITE_ROOT}/PatchSprite/${patchKey}_${gender}`,
});

const spriteChecks = new Map<string, Promise<boolean>>();

/** True when this item has a headgear sprite file (checked once per item). */
export function hasCostumeSprite(patchKey: string): Promise<boolean> {
  let check = spriteChecks.get(patchKey);
  if (!check) {
    check = fetch(`${costumePreviewUrls(patchKey, "male").gear}.spr`, {
      method: "HEAD",
    })
      .then((res) => res.ok)
      .catch(() => false);
    spriteChecks.set(patchKey, check);
  }
  return check;
}
