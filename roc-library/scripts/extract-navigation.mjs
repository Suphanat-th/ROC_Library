/**
 * Builds the MVP Hunter's Route data from the game's data.grf. Run by hand after a patch:
 *
 *   node scripts/extract-navigation.mjs "D:/GAME/RO/GGT-Classic/data.grf"
 *
 * Writes public/assets/json/MapLinks.json (every Warp of the game's navigation list, the main
 * towns, and each map's name and size) and public/assets/images/minimap/<map>.webp for every map
 * on a Route from a main town to a Spawn map listed in src/services/mosters/mostersDb.tsx.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import { bmpToRgba } from "./lib/bmp.mjs";
import { openGrf } from "./lib/grf.mjs";

/** The main towns a Route can start from. */
const TOWNS = [
  "prontera", "izlude", "geffen", "payon", "morocc", "alberta", "aldebaran", "comodo", "yuno",
  "umbala", "amatsu", "gonryun", "louyang", "ayothaya", "xmas", "niflheim", "einbroch",
  "lighthalzen", "hugel", "rachel", "veins", "moscovia", "brasilis", "dewata", "mid_camp",
  "splendide", "manuk", "dicastes01", "malangdo", "malaya",
];
/** Maps whose Warps are left out: shortcuts an ordinary player cannot take. Edit by hand. */
const BLOCKED_MAPS = ["s_atelier"];
/**
 * Warps in the game's Warp list that the server does not honour, as [map, x, y, to]. Edit by hand.
 * in_orcs01 reaches Orc Dungeon 2F only through Orc Dungeon 1F on this server.
 */
const BLOCKED_WARPS = [
  ["in_orcs01", 108, 114, "orcsdun02"],
  ["orcsdun02", 180, 15, "in_orcs01"],
];
/** Names of maps the game's own name table leaves out. Edit by hand. */
const MAP_NAMES = { mag_dun03: "Nogg Road 3F", gl_cas01_: "Glast Heim Abyss", gef_fild14: "West Orc Village" };
/**
 * Gate Warp: an NPC of the server that the game's Warp list does not know. Edit by hand.
 * Each choice: [menu text, map, x, y where the player lands].
 */
const GATE_WARP = {
  map: "moc_ruins",
  x: 74,
  y: 165,
  npc: "Gate Warp (Dungeon)",
  zeny: 5000,
  choices: [
    ["Juperos Ruins Dungeon", "juperos_01", 54, 246],
    ["Abbey Dungeon", "abbey01", 51, 15],
    ["Rachel Dungeon", "ra_san01", 139, 135],
    ["Ice Cave", "ice_dun01", 157, 15],
    ["Abyss Dungeon", "abyss_01", 260, 272],
    ["Ancient Odin Temple", "odin_tem01", 100, 146],
    ["Tower of Thanatos", "tha_t01", 149, 38],
    ["Bio Laboratory", "lhz_dun01", 149, 286],
    ["Morse Cave", "moro_vol", 149, 286],
  ],
};

/**
 * Warps the game's Warp list leaves out, walked onto like any other. Edit by hand.
 * Each: [map, x, y, to, x, y where the player lands].
 */
const EXTRA_WARPS = [
  ["gef_fild10", 27, 219, "gef_fild14", 367, 219],
  ["gef_fild14", 371, 219, "gef_fild10", 31, 219],
  ["moc_fild11", 379, 197, "moc_fild15", 41, 105],
  ["moc_fild15", 38, 105, "moc_fild11", 376, 197],
];

/** Kinds of Warp in Navi_Link that are an NPC to talk to; the rest are walked onto. */
const NPC_WARP_TYPES = [201, 204];
const MINIMAP_SIZE = 512;

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const MONSTER_DB = path.join(ROOT, "src/services/mosters/mostersDb.tsx");
const LINKS_OUT = path.join(ROOT, "public/assets/json/MapLinks.json");
const MINIMAP_OUT = path.join(ROOT, "public/assets/images/minimap");

/* ============ GRF archive: see scripts/lib/grf.mjs ============ */


/* ============ Compiled Lua (5.1) data file ============ */

const OP = { MOVE: 0, LOADK: 1, LOADBOOL: 2, LOADNIL: 3, SETGLOBAL: 7, NEWTABLE: 10, RETURN: 30, SETLIST: 34 };
const FIELDS_PER_FLUSH = 50;

/** Runs a .lub that only builds tables of constants, and returns the globals it sets. */
function readLuaTables(lub) {
  const sizeT = lub[8];
  let p = 12;
  const u32 = () => {
    p += 4;
    return lub.readUInt32LE(p - 4);
  };
  const string = () => {
    const length = sizeT === 8 ? Number(lub.readBigUInt64LE(p)) : lub.readUInt32LE(p);
    p += sizeT;
    if (!length) return null;
    p += length;
    return lub.toString("latin1", p - length, p - 1);
  };

  // main function header: source, line range, upvalues/params/vararg/stack
  string();
  p += 12;
  const code = Array.from({ length: u32() }, u32);
  const constants = Array.from({ length: u32() }, () => {
    const type = lub[p++];
    if (type === 0) return null;
    if (type === 1) return lub[p++] !== 0;
    if (type === 3) {
      p += 8;
      return lub.readDoubleLE(p - 8);
    }
    if (type === 4) return string();
    throw new Error(`Unknown Lua constant type ${type}`);
  });

  const globals = {};
  const reg = [];
  for (let pc = 0; pc < code.length; pc++) {
    const op = code[pc] & 63;
    const a = (code[pc] >>> 6) & 255;
    const c = (code[pc] >>> 14) & 511;
    const b = (code[pc] >>> 23) & 511;
    const bx = code[pc] >>> 14;
    if (op === OP.MOVE) reg[a] = reg[b];
    else if (op === OP.LOADK) reg[a] = constants[bx];
    else if (op === OP.LOADBOOL) reg[a] = b !== 0;
    else if (op === OP.LOADNIL) for (let i = a; i <= b; i++) reg[i] = null;
    else if (op === OP.SETGLOBAL) globals[constants[bx]] = reg[a];
    else if (op === OP.NEWTABLE) reg[a] = [];
    else if (op === OP.SETLIST) {
      const flush = c === 0 ? code[++pc] : c;
      const count = b === 0 ? reg.length - a - 1 : b;
      for (let i = 1; i <= count; i++) reg[a][(flush - 1) * FIELDS_PER_FLUSH + i - 1] = reg[a + i];
      reg.length = a + 1;
    } else if (op === OP.RETURN) break;
    else throw new Error(`Unsupported Lua opcode ${op}`);
  }
  return globals;
}

/* ============ Main ============ */

const thai = new TextDecoder("windows-874");
const fromGameText = (latin1) => thai.decode(Buffer.from(latin1, "latin1")).trim();

/**
 * Fewest-Warp search from one map, the cheaper way winning a tie (as findRoute of
 * src/utils/mapRoute.ts does); returns each reached map's previous map.
 */
function reachFrom(start, linksByMap) {
  const best = new Map([[start, { previous: null, zeny: 0 }]]);
  for (let level = [start]; level.length; ) {
    const next = [];
    for (const map of level) {
      for (const link of linksByMap.get(map) ?? []) {
        const zeny = best.get(map).zeny + (link[8] ?? 0);
        const known = best.get(link[3]);
        if (!known) next.push(link[3]);
        else if (!next.includes(link[3]) || known.zeny <= zeny) continue;
        best.set(link[3], { previous: map, zeny });
      }
    }
    level = next;
  }
  return new Map([...best].map(([map, { previous }]) => [map, previous]));
}

async function main() {
  const grfPath = process.argv[2];
  if (!grfPath) {
    console.error('Usage: node scripts/extract-navigation.mjs "<path to data.grf>"');
    process.exit(1);
  }
  const grf = openGrf(grfPath);

  // Warps: [from, x, y, to, toX, toY, npcName]; npcName is "" for a Warp that is walked onto.
  // A Gate Warp row carries two more: the menu choice and its price in Zeny.
  const linkFile = grf.find(/\\navigation\\navi_link_[a-z]+\.lub$/)[0];
  if (!linkFile) throw new Error("No navigation\\navi_link_*.lub in this GRF");
  const seen = new Set();
  const links = [];
  for (const row of readLuaTables(grf.read(linkFile)).Navi_Link) {
    const [from, , type, , name, , x, y, to, toX, toY] = row;
    if (!type || BLOCKED_MAPS.includes(from) || BLOCKED_MAPS.includes(to)) continue;
    if (BLOCKED_WARPS.some(([m, bx, by, bto]) => m === from && bx === x && by === y && bto === to)) continue;
    const key = [from, x, y, to, toX, toY].join(",");
    if (seen.has(key)) continue;
    seen.add(key);
    links.push([from, x, y, to, toX, toY, NPC_WARP_TYPES.includes(type) ? fromGameText(name) : ""]);
  }
  for (const [choice, to, toX, toY] of GATE_WARP.choices) {
    links.push([GATE_WARP.map, GATE_WARP.x, GATE_WARP.y, to, toX, toY, GATE_WARP.npc, choice, GATE_WARP.zeny]);
  }
  for (const [from, x, y, to, toX, toY] of EXTRA_WARPS) {
    if (!seen.has([from, x, y, to, toX, toY].join(","))) links.push([from, x, y, to, toX, toY, ""]);
  }
  const linksByMap = new Map();
  for (const link of links) linksByMap.set(link[0], [...(linksByMap.get(link[0]) ?? []), link]);

  const mapNames = new Map(Object.entries(MAP_NAMES));
  const nameTable = grf.read("data\\mapnametable.txt");
  for (const line of nameTable ? nameTable.toString("latin1").split(/\r?\n/) : []) {
    const match = line.match(/^([^/#]+)\.rsw#([^#]*)#/);
    if (match) mapNames.set(match[1].toLowerCase(), fromGameText(match[2]));
  }

  const monsterDb = fs.readFileSync(MONSTER_DB, "utf8");
  const spawnMaps = new Set([...monsterDb.matchAll(/\{\s*map:\s*"([^"]+)",\s*cooldown:/g)].map((m) => m[1]));
  // a Route to a Spawn map the Warp list does not reach ends at its routeVia map
  const routeEnds = new Set([...spawnMaps, ...[...monsterDb.matchAll(/routeVia:\s*"([^"]+)"/g)].map((m) => m[1])]);
  const pictured = new Set(spawnMaps);
  for (const town of TOWNS) {
    const previous = reachFrom(town, linksByMap);
    for (const end of routeEnds) {
      for (let map = end; map != null && previous.has(map); map = previous.get(map)) pictured.add(map);
    }
  }

  fs.mkdirSync(MINIMAP_OUT, { recursive: true });
  const minimapFolder = grf.find(/\\map\\prontera\.bmp$/)[0]?.replace(/prontera\.bmp$/, "");
  const maps = {};
  for (const map of new Set([...links.flatMap((link) => [link[0], link[3]]), ...spawnMaps])) {
    const gat = grf.read(`data\\${map}.gat`);
    const info = { name: mapNames.get(map) ?? map };
    if (gat) Object.assign(info, { w: gat.readUInt32LE(6), h: gat.readUInt32LE(10) });
    const bmp = pictured.has(map) && gat && minimapFolder ? grf.read(`${minimapFolder}${map}.bmp`) : undefined;
    if (bmp) {
      const { rgba, width, height } = bmpToRgba(bmp);
      await sharp(rgba, { raw: { width, height, channels: 4 } })
        .resize(MINIMAP_SIZE, MINIMAP_SIZE, { fit: "fill" })
        .webp({ quality: 80 })
        .toFile(path.join(MINIMAP_OUT, `${map}.webp`));
      info.img = 1;
    }
    maps[map] = info;
  }

  fs.writeFileSync(LINKS_OUT, JSON.stringify({ towns: TOWNS.filter((town) => maps[town]), maps, links }));

  const unreachable = [...spawnMaps].filter((map) => !reachFrom(TOWNS[0], linksByMap).has(map));
  console.log(`${links.length} Warps, ${Object.keys(maps).length} maps, ${pictured.size} minimaps`);
  console.log(`Spawn maps with no Route from ${TOWNS[0]}: ${unreachable.join(", ") || "none"}`);
}

main();
