/**
 * Builds the Costume simulator's sprite packs and item index from the game's files. Run by hand after a patch:
 *
 *   node scripts/extract-costume.mjs "D:/GAME/RO/GGT-Classic/data.grf" "D:/GAME/RO/GGT-Classic/System/iteminfo_new.lub"
 *
 * Costume items that play a hat effect (/effect) get its .str file and pictures copied, as loose files, to
 * public/assets/costume/fx/<key>/ (item.effect = { key, file }); an item whose effect the game builds with a script
 * (or whose file is not in the archive) is marked effectUnsupported.
 * Also draws the items' inventory icons into public/assets/images/costume/icons.png.
 * Writes the packs to public/assets/costume/ (gitignored; uploaded to the Asset host by hand, and served from
 * the site itself while developing) with
 * dev-data/costume/manifest.json (a hash per pack, so only changed packs need uploading), and the item and job
 * index to public/assets/json/CostumeIndex.json.
 *
 * Pack = "RCP1" + u32 length of the index + the index (JSON: file name -> [offset, size, size when unpacked])
 * + the files, each deflated on its own. Offsets count from the end of the index, so a browser reads the head,
 * then asks only for the byte range of the file it needs (HTTP Range) and inflates it ("deflate").
 *
 * Packs: body_{m,f} (every job and Mount body, with its colours), head_{m,f} (hairstyles and Hair colours),
 * hg/<key>_{m,f} (one headgear), rb/<key>_{m,f} (one Robe, every job and Mount in it).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { bmpToRgba } from "./lib/bmp.mjs";
import { openGrf } from "./lib/grf.mjs";
import { readLuaGlobals } from "./lib/lua51.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const PACK_DIR = path.join(ROOT, "public/assets/costume");
const MANIFEST = path.join(ROOT, "dev-data/costume/manifest.json");
const INDEX_OUT = path.join(ROOT, "public/assets/json/CostumeIndex.json");
const FX_DIR = path.join(ROOT, "public/assets/costume/fx");
const ICON_OUT = path.join(ROOT, "public/assets/images/costume/icons.png");
const ICON_URL = "/assets/images/costume/icons.png";
/** One picture holds every item's inventory icon, ICON_COLUMNS to a row, so the list loads them in one request. */
const ICON_SIZE = 24;
const ICON_COLUMNS = 24;

/**
 * Jobs of the Costume simulator, as src/data/aspdData.ts lists them (Awakened uses the High Class bodies).
 * Each: [id, label, tier, male body name(s), female body name(s), genders that can play it]; a name is tried in
 * order, without the _남/_여. Kagerou is male and Oboro female only; the robes of the game have no file for the others.
 */
const JOBS = [
  ["novice", "Novice", "class12", ["초보자"], ["초보자"]],
  ["swordman", "Swordman", "class12", ["검사"], ["검사"]],
  ["knight", "Knight", "class12", ["기사"], ["기사"]],
  ["crusader", "Crusader", "class12", ["크루세이더"], ["크루세이더"]],
  ["acolyte", "Acolyte", "class12", ["성직자"], ["성직자"]],
  ["priest", "Priest", "class12", ["프리스트"], ["프리스트"]],
  ["monk", "Monk", "class12", ["몽크"], ["몽크"]],
  ["magician", "Magician", "class12", ["마법사"], ["마법사"]],
  ["wizard", "Wizard", "class12", ["위저드"], ["위저드"]],
  ["sage", "Sage", "class12", ["세이지"], ["세이지"]],
  ["merchant", "Merchant", "class12", ["상인"], ["상인"]],
  ["blacksmith", "Blacksmith", "class12", ["제철공"], ["제철공"]],
  ["alchemist", "Alchemist", "class12", ["연금술사"], ["연금술사"]],
  ["archer", "Archer", "class12", ["궁수"], ["궁수"]],
  ["hunter", "Hunter", "class12", ["헌터"], ["헌터"]],
  ["bard-dancer", "Bard / Dancer", "class12", ["바드"], ["무희"]],
  ["thief", "Thief", "class12", ["도둑"], ["도둑"]],
  ["assassin", "Assassin", "class12", ["어세신", "어새신"], ["어세신", "어새신"]],
  ["rogue", "Rogue", "class12", ["로그"], ["로그"]],
  ["taekwon", "Taekwon", "class12", ["태권소년"], ["태권소년"]],
  ["star-gladiator", "Star Gladiator", "class12", ["권성"], ["권성"]],
  ["soul-linker", "Soul Linker", "class12", ["소울링커"], ["소울링커"]],
  ["ninja", "Ninja", "class12", ["닌자"], ["닌자"]],
  ["gunslinger", "Gunslinger", "class12", ["건너"], ["건너"]],
  ["lord-knight", "Lord Knight", "high", ["로드나이트"], ["로드나이트"]],
  ["paladin", "Paladin", "high", ["팔라딘"], ["팔라딘"]],
  ["high-priest", "High Priest", "high", ["하이프리"], ["하이프리"]],
  ["champion", "Champion", "high", ["챔피온"], ["챔피온"]],
  ["high-wizard", "High Wizard", "high", ["하이위저드"], ["하이위저드"]],
  ["professor", "Professor", "high", ["프로페서"], ["프로페서"]],
  ["whitesmith", "Whitesmith", "high", ["화이트스미스"], ["화이트스미스"]],
  ["creator", "Creator", "high", ["크리에이터"], ["크리에이터"]],
  ["sniper", "Sniper", "high", ["스나이퍼"], ["스나이퍼"]],
  ["clown-gypsy", "Clown / Gypsy", "high", ["클라운"], ["집시"]],
  ["assassin-cross", "Assassin Cross", "high", ["어쌔신크로스"], ["어쌔신크로스"]],
  ["stalker", "Stalker", "high", ["스토커"], ["스토커"]],
  ["super-novice", "Super Novice", "extended", ["슈퍼노비스"], ["슈퍼노비스"]],
  ["expanded-super-novice", "Expanded Super Novice", "extended", ["슈퍼노비스"], ["슈퍼노비스"]],
  ["kagerou", "Kagerou", "extended", ["kagerou"], ["kagerou"], ["m"]],
  ["oboro", "Oboro", "extended", ["oboro"], ["oboro"], ["f"]],
  ["rebellion", "Rebellion", "extended", ["rebellion"], ["rebellion"]],
];

/** Mount of a job: [job id, Mount, male body name, female body name]. */
const MOUNTS = [
  ["knight", "peco", "페코페코_기사", "페코페코_기사"],
  ["lord-knight", "peco", "로드페코", "로드페코"],
  ["crusader", "peco", "신페코크루세이더", "신페코크루세이더"],
  ["paladin", "peco", "페코팔라딘", "페코팔라딘"],
  ["rebellion", "peco", "peco_rebellion", "peco_rebellion"],
  ["novice", "poring", "노비스포링", "노비스포링"],
  ["super-novice", "poring", "슈퍼노비스포링", "슈퍼노비스포링"],
  ["expanded-super-novice", "poring", "슈퍼노비스포링", "슈퍼노비스포링"],
  ["taekwon", "poring", "태권소년포링", "태권소년포링"],
  ["kagerou", "toad", "frog_kagerou", "frog_kagerou"],
  ["oboro", "toad", "frog_oboro", "frog_oboro"],
];

/** The main job (the first job of a line) each job belongs to, as in src/data/aspdData.ts. */
const FAMILY_OF = {
  Novice: ["novice", "super-novice", "expanded-super-novice"],
  Swordman: ["swordman", "knight", "crusader", "lord-knight", "paladin"],
  Acolyte: ["acolyte", "priest", "monk", "high-priest", "champion"],
  Magician: ["magician", "wizard", "sage", "high-wizard", "professor"],
  Merchant: ["merchant", "blacksmith", "alchemist", "whitesmith", "creator"],
  Archer: ["archer", "hunter", "bard-dancer", "sniper", "clown-gypsy"],
  Thief: ["thief", "assassin", "rogue", "assassin-cross", "stalker"],
  Taekwon: ["taekwon", "star-gladiator", "soul-linker"],
  Ninja: ["ninja", "kagerou", "oboro"],
  Gunslinger: ["gunslinger", "rebellion"],
};
const familyOf = (jobId) => Object.keys(FAMILY_OF).find((family) => FAMILY_OF[family].includes(jobId));

const GENDERS = [
  { key: "m", ko: "남" },
  { key: "f", ko: "여" },
];

/**
 * A Position line of an item's description, written several ways: "ตำแหน่ง : Upper", "ใช้สำหรับ : Upper",
 * "ต่ำแหน่ง : Upper" (a typo in the file), "ตำแหน่ง Upper" (no colon) and "ประเภท : Lower" (the type line used
 * for it). A "ประเภท : Costume" line says no place, so the first line that names one counts.
 */
const POSITION_LINE = /(?:ตำแหน่ง|ต่ำแหน่ง|ใช้สำหรับ|ประเภท)[^:^]*:?\s*(?:\^[0-9a-fA-F]{6})?\s*([^^]*)/;

function readPositions(item) {
  for (const line of Object.values(item.identifiedDescriptionName ?? {})) {
    const m = line.match(POSITION_LINE);
    if (!m) continue;
    const text = m[1].toLowerCase();
    const found = [];
    if (/upper|top|บน/.test(text)) found.push("upper");
    if (/middle|medium|mid|กลาง/.test(text)) found.push("middle");
    if (/lower|low|bottom|ล่าง/.test(text)) found.push("lower");
    if (/garment|robe/.test(text)) found.push("garment");
    if (found.length) return found;
  }
  return [];
}

/**
 * A sprite's frames as how many pixels use each palette index (index 0 is see-through and left out), counted without
 * drawing it: the zero-run compression of SPR v2.1 stores a pixel as any byte but 0, and a 0 byte and its count are skipped.
 */
function indexCounts(spr) {
  const counts = new Array(256).fill(0);
  const version = spr.readUInt16LE(2);
  const indexed = spr.readUInt16LE(4);
  let at = version >= 0x200 ? 8 : 6;
  for (let frame = 0; frame < indexed; frame++) {
    const size = spr.readUInt16LE(at) * spr.readUInt16LE(at + 2);
    at += 4;
    if (version >= 0x201) {
      const length = spr.readUInt16LE(at);
      at += 2;
      for (let i = 0; i < length; i++) {
        if (spr[at + i] === 0) i++;
        else counts[spr[at + i]]++;
      }
      at += length;
    } else {
      for (let i = 0; i < size; i++) if (spr[at + i]) counts[spr[at + i]]++;
      at += size;
    }
  }
  return counts;
}

/**
 * One colour to show for each palette of a sprite: the average, weighted by how many pixels use it, of the entries that
 * change from palette to palette (hair, or the clothes); skin and the like stay out. Palettes are 256 RGBA entries.
 */
function swatches(spr, palettes) {
  const counts = indexCounts(spr);
  const varies = (i) => palettes.some((pal) => pal[i * 4] !== palettes[0][i * 4] || pal[i * 4 + 1] !== palettes[0][i * 4 + 1] || pal[i * 4 + 2] !== palettes[0][i * 4 + 2]);
  let used = [...counts.keys()].filter((i) => i > 0 && counts[i] > 0 && varies(i));
  if (!used.length) used = [...counts.keys()].filter((i) => i > 0 && counts[i] > 0);
  const total = used.reduce((sum, i) => sum + counts[i], 0) || 1;
  return palettes.map((pal) => {
    const rgb = [0, 1, 2].map((channel) => Math.round(used.reduce((sum, i) => sum + pal[i * 4 + channel] * counts[i], 0) / total));
    return "#" + rgb.map((value) => value.toString(16).padStart(2, "0")).join("");
  });
}

/**
 * A Costume is an item the game marks `costume` (or `Costume`, a few event items), or, unless it is marked
 * `costume = false`, one whose description says "ประเภท : Costume", or that is named "Costume …", or whose picture is
 * named the way Costumes are ("C_…", or C and a Korean name). About 150 headgear have no mark at all.
 */
const typedCostume = (item) => Object.values(item.identifiedDescriptionName ?? {}).some((line) => /ประเภท\s*:\s*(?:\^[0-9a-fA-F]{6})?\s*Costume/i.test(line));
const isCostume = (item) =>
  item.costume === true ||
  item.Costume === true ||
  (item.costume !== false &&
    (typedCostume(item) || /^(\[[^\]]*\]\s*)?Costume\b/i.test(item.identifiedDisplayName ?? "") || /^C(_|[\uAC00-\uD7A3])/.test(item.identifiedResourceName ?? "")));

const sha1 = (data) => crypto.createHash("sha1").update(data).digest("hex");
const shortKey = (text) => sha1(text).slice(0, 12);

function buildPack(files) {
  const index = {};
  const blobs = [];
  let offset = 0;
  for (const [name, data] of files) {
    const packed = zlib.deflateSync(data, { level: 6 });
    index[name] = [offset, packed.length, data.length];
    blobs.push(packed);
    offset += packed.length;
  }
  const head = Buffer.from(JSON.stringify(index), "utf8");
  const prefix = Buffer.alloc(8);
  prefix.write("RCP1", 0, "latin1");
  prefix.writeUInt32LE(head.length, 4);
  return Buffer.concat([prefix, head, ...blobs]);
}

async function main() {
  const [grfPath, infoPath] = process.argv.slice(2);
  if (!grfPath || !infoPath) {
    console.error('Usage: node scripts/extract-costume.mjs "<path to data.grf>" "<path to iteminfo_new.lub>"');
    process.exit(1);
  }
  const grf = openGrf(grfPath);
  const problems = [];

  // Unicode path -> stored path. The archive keeps A-Z as a-z, so a name from the item table is lower-cased to match.
  const stored = new Map();
  for (const raw of grf.find(/./)) stored.set(grf.nameOf(raw), raw);
  const lower = (text) => text.replace(/[A-Z]/g, (letter) => String.fromCharCode(letter.charCodeAt(0) + 32));
  const read = (unicodePath) => {
    const raw = stored.get(lower(unicodePath));
    return raw ? grf.read(raw) : undefined;
  };
  const has = (unicodePath) => stored.has(lower(unicodePath));

  const manifest = {};
  fs.mkdirSync(PACK_DIR, { recursive: true });
  const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, "utf8")) : {};
  let written = 0;
  let unchanged = 0;
  const writePack = (name, files) => {
    if (!files.length) return false;
    if (manifest[name]) return true; // an earlier item already wrote this pack
    const data = buildPack(files);
    const hash = sha1(data);
    manifest[name] = { sha1: hash, size: data.length };
    const target = path.join(PACK_DIR, name);
    if (previous[name]?.sha1 === hash && fs.existsSync(target)) {
      unchanged++;
    } else {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, data);
      written++;
    }
    return true;
  };

  // ---- Jobs and Mount bodies
  const bodyNames = { m: new Set(), f: new Set() }; // body names (with gender suffix) in the pack
  const jobs = [];
  const pickBody = (gender, candidates, job) => {
    for (const base of candidates) {
      const name = `${base}_${gender.ko}`;
      if (has(`data/sprite/인간족/몸통/${gender.ko}/${name}.spr`) && has(`data/sprite/인간족/몸통/${gender.ko}/${name}.act`)) return name;
    }
    problems.push(`No ${gender.key} body for ${job}: ${candidates.join(", ")}`);
    return undefined;
  };
  for (const [id, label, tier, male, female, genders = ["m", "f"]] of JOBS) {
    const body = { m: pickBody(GENDERS[0], male, id), f: pickBody(GENDERS[1], female, id) };
    jobs.push({ id, label, tier, family: familyOf(id), genders, body });
  }
  for (const [jobId, mount, male, female] of MOUNTS) {
    const job = jobs.find((entry) => entry.id === jobId);
    const body = { m: pickBody(GENDERS[0], [male], `${jobId}/${mount}`), f: pickBody(GENDERS[1], [female], `${jobId}/${mount}`) };
    (job.mounts ??= {})[mount] = body;
  }
  for (const job of jobs) {
    for (const g of ["m", "f"]) {
      if (job.body[g]) bodyNames[g].add(job.body[g]);
      for (const mount of Object.values(job.mounts ?? {})) if (mount[g]) bodyNames[g].add(mount[g]);
    }
  }

  // ---- Body pack (sprite, animation and Body colours)
  // Per body: one list of colours for the job's own outfit (index 0) and one for each alternate outfit 1-4.
  const bodyOutfits = {};
  for (const g of GENDERS) {
    const files = [];
    for (const name of [...bodyNames[g.key]].sort()) {
      for (const ext of ["spr", "act"]) {
        const data = read(`data/sprite/인간족/몸통/${g.ko}/${name}.${ext}`);
        if (data) files.push([`${name}.${ext}`, data]);
      }
      const body = read(`data/sprite/인간족/몸통/${g.ko}/${name}.spr`);
      // Outfit 0 is the job's own (<name>_<colour>.pal); outfit k is costume_<k>/<name>_<colour>_<k>.pal.
      // The colours of every outfit are worked out together, so the parts that differ between outfits count too.
      const groups = [];
      for (let outfit = 0; outfit <= 4; outfit++) {
        const palettes = [];
        for (let n = 0; ; n++) {
          const file = outfit === 0 ? `${name}_${n}.pal` : `${name}_${n}_${outfit}.pal`;
          const data = read(outfit === 0 ? `data/palette/몸/${file}` : `data/palette/몸/costume_${outfit}/${file}`);
          if (!data) break;
          palettes.push([file, data]);
        }
        // An alternate outfit whose palettes are the job's own, byte for byte, looks no different (the game's files
        // are like that for the outfits so far), so it is not offered.
        const same = outfit > 0 && palettes.every(([, data], n) => groups[0][n] && groups[0][n][1].equals(data));
        if (!same) for (const [file, data] of palettes) files.push([file, data]);
        groups.push(same ? [] : palettes);
      }
      const everyColour = body ? swatches(body, groups.flat().map(([, data]) => data)) : [];
      let taken = 0;
      const outfits = groups.map((palettes) => {
        const list = everyColour.slice(taken, taken + palettes.length);
        taken += palettes.length;
        return list;
      });
      if (outfits.some((list) => list.length)) (bodyOutfits[g.key] ??= {})[name] = outfits;
    }
    writePack(`body_${g.key}.rcp`, files);
  }

  // ---- Head pack (hairstyles and Hair colours)
  const hairstyles = {};
  const hairSwatches = {};
  for (const g of GENDERS) {
    const files = [];
    for (let style = 1; style <= 99; style++) {
      const spr = read(`data/sprite/인간족/머리통/${g.ko}/${style}_${g.ko}.spr`);
      const act = read(`data/sprite/인간족/머리통/${g.ko}/${style}_${g.ko}.act`);
      if (!spr || !act) continue;
      files.push([`${style}.spr`, spr], [`${style}.act`, act]);
      const palettes = [];
      for (let colour = 0; ; colour++) {
        const pal = read(`data/palette/머리/머리${style}_${g.ko}_${colour}.pal`);
        if (!pal) break;
        files.push([`${style}_${colour}.pal`, pal]);
        palettes.push(pal);
      }
      (hairstyles[g.key] ??= {})[style] = palettes.length;
      if (palettes.length) (hairSwatches[g.key] ??= {})[style] = swatches(spr, palettes);
    }
    writePack(`head_${g.key}.rcp`, files);
  }

  // ---- Items (costume headgear and Robes)
  const table = readLuaGlobals(fs.readFileSync(infoPath), "utf-8").tbl;
  const dataDir = "data/luafiles514/lua files/datainfo/";
  const luaGlobals = {};
  readLuaGlobals(grf.read(stored.get(`${dataDir}spriterobeid.lub`)), "euc-kr", undefined, luaGlobals);
  const robeNames = readLuaGlobals(grf.read(stored.get(`${dataDir}spriterobename.lub`)), "euc-kr", undefined, luaGlobals).RobeNameTable;

  // The game's draw order of headgear: a smaller number is drawn first (tb_layer_priority, by the item's view id).
  for (const file of ["accessoryid", "jobidentity", "enumvar"]) {
    readLuaGlobals(grf.read(stored.get(`${dataDir}${file}.lub`)), "euc-kr", undefined, luaGlobals);
  }
  // The picture of a headgear: its view number (ClassNum) names it in accname; where there is none, its resource name does.
  const accNames = readLuaGlobals(grf.read(stored.get(`${dataDir}accname.lub`)), "euc-kr", undefined, luaGlobals).AccNameTable;
  const priority = readLuaGlobals(grf.read(stored.get(`${dataDir}tb_layer_priority.lub`)), "euc-kr", undefined, luaGlobals).TB_Layer_Priority;
  const DEFAULT_LAYER = { upper: priority.Default_Top, middle: priority.Default_Mid, lower: priority.Default_Bottom };

  const items = [];
  const robeFolderOf = (classNum) => (robeNames[classNum] ? String(robeNames[classNum]).toLowerCase() : undefined);
  const robeFiles = new Map(); // folder -> gender -> [[file name, unicode path]]
  for (const [unicodePath] of stored) {
    const m = unicodePath.match(/^data\/sprite\/로브\/([^/]+)\/(남|여)\/([^/]+)\.(spr|act)$/);
    if (!m) continue;
    const gender = m[2] === "남" ? "m" : "f";
    const bodyName = m[3];
    if (!bodyNames[gender].has(bodyName)) continue;
    const perGender = robeFiles.get(m[1]) ?? { m: [], f: [] };
    perGender[gender].push([`${bodyName}.${m[4]}`, unicodePath]);
    robeFiles.set(m[1], perGender);
  }

  const headgearGenders = (resource) =>
    GENDERS.filter((g) => has(`data/sprite/악세사리/${g.ko}/${g.ko}_${resource}.spr`) && has(`data/sprite/악세사리/${g.ko}/${g.ko}_${resource}.act`)).map((g) => g.key);

  for (const [idText, item] of Object.entries(table)) {
    if (!isCostume(item)) continue;
    const id = Number(idText);
    const name = item.identifiedDisplayName;
    const slots = readPositions(item);
    const onBody = slots.includes("garment");
    // A Robe is what goes in the garment place; a headgear is not one even if its number is also a Robe's.
    // A Robe folder: by the item's view number, or (a garment the table does not know yet) by its resource name.
    const lowerResource = lower(item.identifiedResourceName ?? "");
    const folderByName = onBody ? [lowerResource, lowerResource.replace(/s$/, "")].find((candidate) => robeFiles.has(candidate)) : undefined;
    const folder = (item.ClassNum > 0 && (onBody || !slots.length) ? robeFolderOf(item.ClassNum) : undefined) ?? folderByName;
    const viaView = item.ClassNum > 0 && accNames[item.ClassNum] ? String(accNames[item.ClassNum]).replace(/^_/, "") : undefined;
    const viaViewOk = viaView && headgearGenders(viaView).length ? viaView : undefined;
    const viaResource = headgearGenders(item.identifiedResourceName).length ? item.identifiedResourceName : undefined;
    // A garment's view number is a Robe's, so its resource name comes first; a headgear's is an accessory's.
    const resource = onBody ? (viaResource ?? viaViewOk ?? item.identifiedResourceName) : (viaViewOk ?? item.identifiedResourceName);
    const isRobe = folder && robeFiles.has(folder) && (onBody || headgearGenders(resource).length === 0);
    if (isRobe) {
      const key = shortKey(folder);
      const per = robeFiles.get(folder);
      const genders = [];
      for (const g of GENDERS) {
        if (!per[g.key].length) continue;
        const files = per[g.key].sort((a, b) => a[0].localeCompare(b[0])).map(([file, p]) => [file, read(p)]);
        // Some Robes have one picture for every job ("<folder>/<folder>.spr") and an animation file for each.
        const shared = read(`data/sprite/로브/${folder}/${folder}.spr`);
        if (shared) files.push(["shared.spr", shared]);
        if (writePack(`rb/${key}_${g.key}.rcp`, files)) genders.push(g.key);
      }
      items.push({ id, name, kind: "robe", slots: ["garment"], key, genders });
      continue;
    }
    const genders = headgearGenders(resource);
    if (!genders.length) continue;
    if (!slots.length) {
      problems.push(`Headgear ${id} ${name}: no position read, left out`);
      continue;
    }
    const key = shortKey(resource);
    for (const g of GENDERS) {
      if (!genders.includes(g.key)) continue;
      const base = `data/sprite/악세사리/${g.ko}/${g.ko}_${resource}`;
      writePack(`hg/${key}_${g.key}.rcp`, [["a.spr", read(`${base}.spr`)], ["a.act", read(`${base}.act`)]]);
    }
    const layer = priority.Items_List?.[item.ClassNum]?.Default ?? DEFAULT_LAYER[slots[0]] ?? (onBody ? priority.Default_Robe : priority.Default_Top);
    items.push({ id, name, kind: "headgear", slots, key, genders, layer });
  }
  // ---- Hat effects (/effect) and Footprints: item -> effect number -> the game's table.
  const hatDir = "data/luafiles514/lua files/hateffectinfo/";
  readLuaGlobals(grf.read(stored.get(`${hatDir}hateffectids.lub`)), "euc-kr", undefined, luaGlobals);
  const hatTable = readLuaGlobals(grf.read(stored.get(`${hatDir}hateffectinfo.lub`)), "euc-kr", undefined, luaGlobals).hatEffectTable;
  const hatItems = readLuaGlobals(grf.read(stored.get(`${hatDir}effecthatitemtable.lub`)), "euc-kr", undefined, luaGlobals).effectHatItemTable;
  const footTable = readLuaGlobals(grf.read(stored.get(`${hatDir}footprinteffectinfo.lub`)), "euc-kr", undefined, luaGlobals).FootPrintEffectTable;
  const effectOfItem = new Map();
  for (const [effect, owner] of Object.entries(hatItems)) {
    for (const id of typeof owner === "object" ? Object.values(owner) : [owner]) {
      effectOfItem.set(Number(id), [...(effectOfItem.get(Number(id)) ?? []), Number(effect)]);
    }
  }

  // Costumes that are only an effect: no picture of their own (ClassNum 0), a place on the body, and either an
  // entry in the hat effect table or a "Costume …" name. Invisible ones, which hide a place, are left out.
  const listed = new Set(items.map((entry) => entry.id));
  for (const [idText, item] of Object.entries(table)) {
    const id = Number(idText);
    if (listed.has(id) || !isCostume(item) || item.ClassNum > 0 || /invisible/i.test(item.identifiedDisplayName ?? "")) continue;
    const slots = readPositions(item);
    const named = /^(\[[^\]]*\]\s*)?Costume\b/i.test(item.identifiedDisplayName ?? "");
    if (!slots.length || !(effectOfItem.has(id) || named)) continue;
    items.push({ id, name: item.identifiedDisplayName, kind: "headgear", slots, key: shortKey(`effect-only ${id}`), genders: ["m", "f"], noSprite: true });
  }
  items.sort((a, b) => a.id - b.id);

  /** The files beside a .str (its pictures), copied flat to fx/<key>/ so the page finds each by name. */
  const fxCopied = new Set();
  const copyEffectFolder = (strPath, key) => {
    const folder = strPath.slice(0, strPath.lastIndexOf("/") + 1);
    if (fxCopied.has(`${key}|${folder}`)) return;
    fxCopied.add(`${key}|${folder}`);
    for (const [unicodePath, raw] of stored) {
      if (!unicodePath.startsWith(folder) || unicodePath.slice(folder.length).includes("/") || !/\.(str|tga|bmp|png|jpg)$/.test(unicodePath)) continue;
      const target = path.join(FX_DIR, key, unicodePath.slice(folder.length));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, grf.read(raw));
    }
  };
  const effectFile = (name) => lower(`data/texture/effect/${String(name).replaceAll("\\", "/")}`);

  /**
   * What the game plays for an effect number: the .str file its entry names. An entry that only holds a "hatEffectID" is an
   * effect the client itself draws: that number is not a key of this table (HAT_EF_Electric holds 254, which is the table's
   * Kung Fu Panda, but the game shows the Roaring effect), so it is not followed.
   */
  const resolveEffect = (number) => {
    const entry = hatTable[number];
    if (entry?.resourceFileName && stored.has(effectFile(entry.resourceFileName))) {
      // isRenderBeforeCharacter: drawn behind the character; isAttachedHead: follows the head.
      return { str: effectFile(entry.resourceFileName), behind: Boolean(entry.isRenderBeforeCharacter), head: Boolean(entry.isAttachedHead) };
    }
    return undefined;
  };
  // Most hat effects keep their files in a folder named efst_<the item's resource name>; used where no table names one.
  const efstFolders = new Map();
  for (const unicodePath of stored.keys()) {
    const m = unicodePath.match(/^(data\/texture\/effect\/[^/]+\/)([^/]+\.str)$/);
    if (m) efstFolders.set(m[1], [...(efstFolders.get(m[1]) ?? []), m[2]]);
  }
  // The same folders by their name alone (without "efst_" or a leading "c_"), letters and digits only, for names that
  // differ a little from the item's resource name ("Costume Floral Waltz" -> efst_floral_waltz).
  const fold = (text) => String(text).toLowerCase().replace(/[^a-z0-9가-힣]/g, "");
  const efstByName = new Map();
  for (const folder of efstFolders.keys()) {
    const name = folder.split("/")[3].replace(/^efst_/, "");
    for (const key of new Set([fold(name), fold(name.replace(/^c_/, ""))])) if (key && !efstByName.has(key)) efstByName.set(key, folder);
  }

  /** A Footprint of the game's table: its .str files copied to fx/<key>/, and the table's own values. */
  const makeFootprint = (entry, id) => {
    const key = shortKey(`footprint ${id}`);
    const info = { Type: "STR" };
    for (const field of ["StrFile_Top_Left", "StrFile_Top_Right", "StrFile_Bottom_Left", "StrFile_Bottom_Right"]) {
      const name = entry[field];
      if (name && stored.has(effectFile(name))) {
        copyEffectFolder(effectFile(name), key);
        info[field] = effectFile(name).slice(effectFile(name).lastIndexOf("/") + 1);
      } else {
        info[field] = null;
      }
    }
    for (const field of ["Scale_Top", "Scale_Bottom", "Height_Top", "Stride", "Gap", "IsAdjustAngle"]) if (entry[field] !== undefined) info[field] = entry[field];
    return { key, info };
  };

  // The game names an item's hat effect after its resource name (HAT_EF_<resource>); that is what it plays, so it comes
  // first. The table of items per effect disagrees for some items (it lists Costume Astra Blessing under a feather).
  const squash = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "");
  const hatNumberByName = new Map(Object.entries(luaGlobals.HatEFID ?? {}).map(([key, number]) => [squash(key.replace(/^HAT_EF_/i, "")), number]));

  let hatCount = 0;
  let footprintCount = 0;
  for (const item of items) {
    const named = hatNumberByName.get(squash(table[item.id].identifiedResourceName ?? ""));
    const numbers = [...(named === undefined ? [] : [named]), ...(effectOfItem.get(item.id) ?? [])];
    const folderByName = [`efst_${table[item.id].identifiedResourceName}`, table[item.id].identifiedResourceName]
      .map((name) => lower(`data/texture/effect/${name}/`))
      .find((candidate) => efstFolders.has(candidate)) ??
      efstByName.get(fold(table[item.id].identifiedResourceName)) ??
      efstByName.get(fold(String(table[item.id].identifiedResourceName).replace(/^c_?/i, ""))) ??
      efstByName.get(fold(String(table[item.id].identifiedDisplayName).replace(/^(\[[^\]]*\]\s*)?costume:?\s*/i, "")));
    const byName = folderByName && efstFolders.get(folderByName);
    // In order of trust: the effect the game names after the item, the effect folder named after it, and last the
    // table of items per effect (which is wrong for some items).
    const foundNamed = named === undefined ? undefined : resolveEffect(named);
    const found = foundNamed ?? (byName ? undefined : (effectOfItem.get(item.id) ?? []).map(resolveEffect).find(Boolean));
    if (found?.str) {
      const key = shortKey(found.str.slice(0, found.str.lastIndexOf("/") + 1));
      copyEffectFolder(found.str, key);
      item.effects = [{ key, file: found.str.slice(found.str.lastIndexOf("/") + 1), behind: found.behind, head: found.head }];
      hatCount++;
    } else if (!found && byName) {
      // The folder holds the layers of the effect; they play together.
      const folder = folderByName;
      const key = shortKey(folder);
      copyEffectFolder(`${folder}${byName[0]}`, key);
      item.effects = byName.slice(0, 6).map((file) => ({ key, file, behind: true }));
      hatCount++;
    } else if (found?.footprint && found.footprint.Type === 4) {
      item.footprint = makeFootprint(found.footprint, found.id);
      footprintCount++;
    } else if (numbers.length || item.noSprite) {
      // Has an effect the game scripts, or is only an effect that this page cannot show.
      item.effectUnsupported = true;
    }
  }
  /** The average height (y, up is negative) of the first picture of an .act, to tell an effect over the head from one at the feet. */
  const actMeanY = (buf) => {
    try {
      const major = buf[3];
      const minor = buf[2];
      const atLeast = (a, b) => major > a || (major === a && minor >= b);
      let p = 4 + 2 + 10 + 4 + 32; // header, action count, reserved, frame count, frame header
      const layers = buf.readUInt32LE(p);
      p += 4;
      let sum = 0;
      let count = 0;
      for (let i = 0; i < layers; i++) {
        const y = buf.readInt32LE(p + 4);
        const sprite = buf.readInt32LE(p + 8);
        p += 16;
        if (atLeast(2, 0)) {
          p += 8; // colour, scale
          if (atLeast(2, 4)) p += 4;
          p += 8; // rotation, type
          if (atLeast(2, 5)) p += 8;
        }
        if (sprite >= 0) {
          sum += y;
          count++;
        }
      }
      return count ? sum / count : 0;
    } catch {
      return 0;
    }
  };

  // Sprite effects: some effects are a picture and its animation in data/sprite/이팩트/<name>/ (Valkyrie Wing, Perm Frost
  // Oblivion, Aura of Ghost Ship …), drawn at the character's feet. One that sits high (over the head) is drawn in front.
  let spriteEffectCount = 0;
  for (const item of items) {
    if (item.effects || item.footprint) continue;
    const resource = lower(table[item.id].identifiedResourceName ?? "");
    const name = [resource, resource.replace(/^c_/, "")].find((candidate) => has(`data/sprite/이팩트/${candidate}/${candidate}.spr`) && has(`data/sprite/이팩트/${candidate}/${candidate}.act`));
    if (!name) continue;
    const key = shortKey(`sprite effect ${name}`);
    fs.mkdirSync(path.join(FX_DIR, key), { recursive: true });
    for (const ext of ["spr", "act"]) fs.writeFileSync(path.join(FX_DIR, key, `e.${ext}`), read(`data/sprite/이팩트/${name}/${name}.${ext}`));
    item.spriteEffects = [{ key, behind: actMeanY(read(`data/sprite/이팩트/${name}/${name}.act`)) >= -45 }];
    delete item.effectUnsupported;
    spriteEffectCount++;
  }
  console.log(`${spriteEffectCount} items have a sprite effect`);

  // Effect stones: Enchant items (picture "블루크리스탈조각") named "<effect> Effect (Upper|Middle|Lower|Garment)". The effect's name
  // is matched to the game's own hat effect names (HAT_EF_*), then played like any hat effect.
  const stones = [];
  for (const [idText, item] of Object.entries(table)) {
    const m = (item.identifiedDisplayName ?? "").match(/^(.*?)\s*Effect\s*\((Upper|Middle|Lower|Garment)\)/i);
    if (item.identifiedResourceName !== "블루크리스탈조각" || !m) continue;
    // The exact name, else the shortest hat effect name that contains it ("Blue Spirit" -> HAT_EF_ROS_BlueSpirit).
    const base = squash(m[1]);
    const exact = hatNumberByName.get(base) ?? hatNumberByName.get(`${base}s`);
    const partial = base.length >= 6 ? [...hatNumberByName].filter(([name]) => name.includes(base)).sort((x, y) => x[0].length - y[0].length)[0]?.[1] : undefined;
    const number = exact ?? partial;
    const found = number === undefined ? undefined : resolveEffect(number);
    const stone = { id: Number(idText), name: item.identifiedDisplayName.trim(), slot: m[2].toLowerCase() };
    if (found?.str) {
      const key = shortKey(found.str.slice(0, found.str.lastIndexOf("/") + 1));
      copyEffectFolder(found.str, key);
      stone.effects = [{ key, file: found.str.slice(found.str.lastIndexOf("/") + 1), behind: found.behind, head: found.head }];
    } else {
      // No hat effect of that name: an effect folder named like the stone ("Water Field" -> efst_waterfield2).
      const guessed = [...efstByName].find(([key]) => key === base || (key.startsWith(base) && /^\d+$/.test(key.slice(base.length))))?.[1];
      if (guessed && base.length >= 6) {
        const files = efstFolders.get(guessed);
        const key = shortKey(guessed);
        copyEffectFolder(`${guessed}${files[0]}`, key);
        stone.effects = files.slice(0, 6).map((file) => ({ key, file, behind: true }));
      } else {
        stone.unsupported = true;
      }
    }
    stones.push(stone);
  }
  stones.sort((a, b) => a.name.localeCompare(b.name));

  // The Footprint items (enchant items, picture "발자국이펙트"): the game's table has no link from item to footprint, so the
  // name is matched to the footprint's own name (HatEFID FOOTPRINT_EF_*). A name with no footprint in the table is left out.
  const FOOTPRINT_NAMES = [
    [/purple star/i, 228],
    [/yellow star/i, 229],
    [/red star/i, 230],
    [/panda color/i, 246],
    [/panda/i, 245],
    [/blue butterfly/i, 259],
    [/bouncing toothless/i, 265],
    [/toothless/i, 264],
    [/phoenix/i, 287],
    [/dice/i, 328],
  ];
  const footprints = [];
  const footprintSeen = new Set();
  for (const [idText, item] of Object.entries(table)) {
    if (item.identifiedResourceName !== "발자국이펙트" || /box/i.test(item.identifiedDisplayName)) continue;
    const name = item.identifiedDisplayName.replace(/\s*\(Garment\)\s*$/i, "").trim();
    const number = FOOTPRINT_NAMES.find(([pattern]) => pattern.test(name))?.[1];
    if (!number || footprintSeen.has(name) || !footTable[number] || footTable[number].Type !== 4) continue;
    footprintSeen.add(name);
    footprints.push({ id: Number(idText), name, ...makeFootprint(footTable[number], number) });
  }
  footprints.sort((a, b) => a.name.localeCompare(b.name));

  const unsupported = items.filter((item) => item.effectUnsupported).length;
  console.log(`${hatCount} hat effects and ${footprintCount} Footprints copied; ${unsupported} items have an effect that cannot be shown; ${items.filter((item) => item.noSprite).length} items are only an effect`);

  // ---- Icons: item/<resource>.bmp of every item, in one picture.
  const rows = Math.ceil(items.length / ICON_COLUMNS);
  const tiles = [];
  let missingIcons = 0;
  for (const [at, item] of items.entries()) {
    const icon = read(`data/texture/유저인터페이스/item/${table[item.id].identifiedResourceName}.bmp`);
    if (!icon) {
      missingIcons++;
      continue;
    }
    const { rgba, width, height } = bmpToRgba(icon);
    const picture = await sharp(rgba, { raw: { width, height, channels: 4 } })
      .resize(ICON_SIZE, ICON_SIZE, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    tiles.push({ input: picture, left: (at % ICON_COLUMNS) * ICON_SIZE, top: Math.floor(at / ICON_COLUMNS) * ICON_SIZE });
    item.icon = at;
  }
  fs.mkdirSync(path.dirname(ICON_OUT), { recursive: true });
  await sharp({ create: { width: ICON_COLUMNS * ICON_SIZE, height: Math.max(rows, 1) * ICON_SIZE, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite(tiles)
    .png({ compressionLevel: 9 })
    .toFile(ICON_OUT);
  if (missingIcons) problems.push(`${missingIcons} items have no icon picture`);

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1));
  fs.writeFileSync(
    INDEX_OUT,
    JSON.stringify({ jobs, hairstyles, hairSwatches, bodyOutfits, items, footprints, stones, icons: { url: ICON_URL, size: ICON_SIZE, columns: ICON_COLUMNS }, packs: { body: ["body_m.rcp", "body_f.rcp"], head: ["head_m.rcp", "head_f.rcp"] } }),
  );

  const total = Object.values(manifest).reduce((sum, entry) => sum + entry.size, 0);
  const count = (kind) => items.filter((item) => item.kind === kind).length;
  console.log(`${items.length} items (${count("headgear")} headgear, ${count("robe")} Robes), ${jobs.length} jobs`);
  console.log(`${Object.keys(manifest).length} packs, ${(total / 1e6).toFixed(0)} MB; written ${written}, unchanged ${unchanged}`);
  if (problems.length) console.log(`\n${problems.length} problems:\n- ${problems.join("\n- ")}`);
}

await main();
