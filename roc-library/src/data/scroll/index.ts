import type { Prize, ScrollDef, Tier } from "@/types/scroll";
import main from "./main.json";

/**
 * Every Scroll the Random Scroll page offers. `main.json` lists their ids in the order they
 * are shown (the first is the default); each id has a file of the same name beside it.
 *
 * To add a Scroll: create `<id>.json` ({ title, cover?, source?, prizes }) in this folder,
 * then add "<id>" to `main.json`.
 *
 * Pictures live in public/assets/images/scroll. A Prize's `image` is null (or left out) to use
 * `<Prize id>.bmp`, or a file name in that folder (or a path starting with "/") to use another.
 */
const IMAGE_DIR = "/assets/images/scroll";
const TIERS: readonly Tier[] = ["SSR", "SR", "R", "A", "B", "C", "E"];

/** Turns an `image` value from a file into the address the page loads. */
const imageUrl = (value: string) =>
  value.startsWith("/") ? value : `${IMAGE_DIR}/${value}`;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

function parsePrize(file: string, raw: unknown, index: number): Prize {
  const where = `${file}.json, prizes[${index}]`;
  if (!isObject(raw)) throw new Error(`${where} is not an object`);

  const text = (key: string) => {
    const value = raw[key];
    if (typeof value !== "string" || value === "") {
      throw new Error(`${where}: "${key}" must be a non-empty text`);
    }
    return value;
  };
  const positive = (key: string) => {
    const value = raw[key];
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      throw new Error(`${where} (${raw.id}): "${key}" must be a number above 0`);
    }
    return value;
  };

  const image = raw.image;
  if (image != null && (typeof image !== "string" || image === "")) {
    throw new Error(`${where} (${raw.id}): "image" must be null or a file name`);
  }

  const tier = raw.tier;
  if (!TIERS.includes(tier as Tier)) {
    throw new Error(
      `${where} (${raw.id}): "tier" must be one of ${TIERS.join(", ")}, got ${JSON.stringify(tier)}`,
    );
  }
  if (raw.announce !== undefined && typeof raw.announce !== "boolean") {
    throw new Error(`${where} (${raw.id}): "announce" must be true or false`);
  }

  const id = text("id");

  return {
    id,
    name: text("name"),
    image: image ? imageUrl(image) : `${IMAGE_DIR}/${id}.bmp`,
    quantity: positive("quantity"),
    tier: tier as Tier,
    rate: positive("rate"),
    ...(raw.announce ? { announce: true } : {}),
  };
}

/** Checks one Scroll file and fills in what it leaves out, so a typo fails loudly. */
function parseScroll(id: string, raw: unknown): ScrollDef {
  if (!isObject(raw)) throw new Error(`${id}.json is not an object`);
  if (typeof raw.title !== "string" || raw.title === "") {
    throw new Error(`${id}.json: "title" must be a non-empty text`);
  }
  if (!Array.isArray(raw.prizes) || raw.prizes.length === 0) {
    throw new Error(`${id}.json: "prizes" must be a list with at least one Prize`);
  }

  const prizes = raw.prizes.map((p, i) => parsePrize(id, p, i));
  const seen = new Set<string>();
  for (const p of prizes) {
    if (seen.has(p.id)) throw new Error(`${id}.json: Prize id "${p.id}" appears twice`);
    seen.add(p.id);
  }

  return {
    id,
    title: raw.title,
    // No egg picture given: the first Prize stands in for it.
    cover:
      typeof raw.cover === "string" && raw.cover !== ""
        ? imageUrl(raw.cover)
        : prizes[0].image,
    ...(typeof raw.source === "string" ? { source: raw.source } : {}),
    prizes,
  };
}

export async function loadScrolls(): Promise<ScrollDef[]> {
  const ids: string[] = main;
  if (new Set(ids).size !== ids.length) {
    throw new Error("main.json lists the same Scroll id twice");
  }

  return Promise.all(
    ids.map(async (id) => {
      const file = await import(`./${id}.json`).catch(() => {
        throw new Error(`main.json lists "${id}" but ${id}.json was not found`);
      });
      return parseScroll(id, file.default);
    }),
  );
}
