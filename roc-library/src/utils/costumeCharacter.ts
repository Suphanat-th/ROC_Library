import { Gear, SpriteAsset } from "@/utils/spriteComposer";
import { parseACT } from "@/utils/actParser";
import { parseSPR } from "@/utils/sprParser";
import { packFileNames, readPackFile } from "@/utils/costumePack";
import { CostumeGender, CostumeItem } from "@/types/costume";

const assets = new Map<string, Promise<SpriteAsset | undefined>>();

/** A sprite out of a pack, with `paletteFile` (when given) laid over the picture's own colours. */
function loadAsset(pack: string, sprName: string, actName: string, paletteFile?: string) {
  const id = `${pack}|${sprName}|${paletteFile ?? ""}`;
  let found = assets.get(id);
  if (!found) {
    found = (async () => {
      const [spr, act, palette] = await Promise.all([
        readPackFile(pack, sprName),
        readPackFile(pack, actName),
        paletteFile ? readPackFile(pack, paletteFile) : undefined,
      ]);
      if (!spr || !act) return undefined;
      return { spr: parseSPR(spr), act: parseACT(act), palette: palette ? new Uint8Array(palette) : undefined };
    })();
    found.catch(() => assets.delete(id));
    assets.set(id, found);
  }
  return found;
}

/** A body in the job's own outfit (0) or an alternate outfit (1-4), in one of its Body colours. */
export const loadBody = (gender: CostumeGender, name: string, colour: number, outfit = 0) =>
  loadAsset(
    `body_${gender}.rcp`,
    `${name}.spr`,
    `${name}.act`,
    // The first colour of the job's own outfit is the colours stored in the picture itself (its palette file differs a little).
    outfit === 0 && colour === 0 ? undefined : outfit === 0 ? `${name}_${colour}.pal` : `${name}_${colour}_${outfit}.pal`,
  );

export const loadHead = (gender: CostumeGender, style: number, colour: number) =>
  loadAsset(`head_${gender}.rcp`, `${style}.spr`, `${style}.act`, `${style}_${colour}.pal`);

/**
 * Where a Robe is drawn behind the body: every frame, in every direction but the three that face away from the
 * viewer (3, 4 and 5), where it hangs in front. The rule the Costume simulators of other players use as well.
 */
const behindWhenFacingViewer = (body: SpriteAsset) => {
  const behind: Record<string, number[]> = {};
  body.act.actions.forEach((action, index) => {
    if (![3, 4, 5].includes(index % 8)) behind[index] = action.frames.map((_, frame) => frame);
  });
  return behind;
};

/** The worn item as a Gear, or undefined when the item has no file for this job (a Robe may not). */
export async function loadWorn(
  item: CostumeItem,
  gender: CostumeGender,
  bodyName: string,
  body: SpriteAsset,
): Promise<Gear | undefined> {
  if (item.kind === "headgear") {
    const asset = await loadAsset(`hg/${item.key}_${gender}.rcp`, "a.spr", "a.act");
    return asset && { kind: "headgear", asset };
  }
  // A Robe has an animation file for each job; its picture is the job's own file, or one shared by every job.
  const pack = `rb/${item.key}_${gender}.rcp`;
  const names = await packFileNames(pack);
  const picture = names.includes(`${bodyName}.spr`) ? `${bodyName}.spr` : "shared.spr";
  const asset = await loadAsset(pack, picture, `${bodyName}.act`);
  return asset && { kind: "robe", asset, behind: behindWhenFacingViewer(body) };
}
