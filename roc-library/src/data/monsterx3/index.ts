import type { MonsterX3Entry, MonsterX3Event } from "@/types/monsterx3";
import main from "./main.json";

/**
 * Every round of the Monster x3 event. `main.json` lists the file names (without .json),
 * newest first; the page shows the first one.
 *
 * To add a round: create `<name>.json` in this folder ({ title, multiplier, from, to,
 * monsters: [{ id, group, exp, job }] }), then put "<name>" at the top of `main.json`.
 * `from` and `to` are ISO times with the Thailand offset, such as "2026-10-07T12:00:00+07:00".
 * The page works out the multiplied EXP and JOB itself, so only the normal values go here.
 */
const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parseEntry(file: string, raw: unknown, index: number): MonsterX3Entry {
  const where = `${file}.json, monsters[${index}]`;
  if (!isObject(raw)) throw new Error(`${where} is not an object`);

  const whole = (key: string) => {
    const value = raw[key];
    if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) {
      throw new Error(`${where} (${raw.name ?? raw.id}): "${key}" must be a whole number above 0`);
    }
    return value;
  };

  if (raw.name !== undefined && typeof raw.name !== "string") {
    throw new Error(`${where}: "name" must be text`);
  }
  if (typeof raw.group !== "string" || raw.group === "") {
    throw new Error(`${where} (${raw.name ?? raw.id}): "group" must be a non-empty text`);
  }

  return {
    id: whole("id"),
    ...(typeof raw.name === "string" ? { name: raw.name } : {}),
    group: raw.group,
    exp: whole("exp"),
    job: whole("job"),
  };
}

function parseEvent(id: string, raw: unknown): MonsterX3Event {
  if (!isObject(raw)) throw new Error(`${id}.json is not an object`);
  if (typeof raw.title !== "string" || raw.title === "") {
    throw new Error(`${id}.json: "title" must be a non-empty text`);
  }
  if (typeof raw.multiplier !== "number" || !(raw.multiplier > 0)) {
    throw new Error(`${id}.json: "multiplier" must be a number above 0`);
  }

  const time = (key: "from" | "to") => {
    const value = raw[key];
    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
      throw new Error(`${id}.json: "${key}" must be an ISO time such as 2026-10-07T12:00:00+07:00`);
    }
    if (!/(Z|[+-]\d{2}:\d{2})$/.test(value)) {
      throw new Error(`${id}.json: "${key}" needs a time zone offset, such as +07:00`);
    }
    return value;
  };
  const from = time("from");
  const to = time("to");
  if (Date.parse(from) >= Date.parse(to)) {
    throw new Error(`${id}.json: "from" must be earlier than "to"`);
  }

  if (!Array.isArray(raw.monsters) || raw.monsters.length === 0) {
    throw new Error(`${id}.json: "monsters" must be a list with at least one monster`);
  }
  const monsters = raw.monsters.map((m, i) => parseEntry(id, m, i));
  const seen = new Set<number>();
  for (const m of monsters) {
    if (seen.has(m.id)) throw new Error(`${id}.json: monster id ${m.id} appears twice`);
    seen.add(m.id);
  }

  return { id, title: raw.title, multiplier: raw.multiplier, from, to, monsters };
}

/** The round the page shows: the first one listed in main.json. */
export async function loadLatestMonsterX3Event(): Promise<MonsterX3Event> {
  const id: string | undefined = main[0];
  if (!id) throw new Error("main.json lists no Monster x3 event");

  const file = await import(`./${id}.json`).catch(() => {
    throw new Error(`main.json lists "${id}" but ${id}.json was not found`);
  });
  return parseEvent(id, file.default);
}
