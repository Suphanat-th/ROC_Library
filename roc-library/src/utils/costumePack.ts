/**
 * Reads the Costume simulator's packs (see scripts/extract-costume.mjs for the format). A pack is opened by
 * reading its head once, then only the bytes of the file wanted are asked for (HTTP Range). When the server
 * ignores Range and sends the whole pack, that is kept and the file is cut out of it.
 */

/** The Asset host when one is set (NEXT_PUBLIC_ASSET_HOST), else the site itself. */
const BASE = `${(process.env.NEXT_PUBLIC_ASSET_HOST ?? "").replace(/\/$/, "")}/assets/costume/`;

/** The address of a file under the Asset host's costume folder (loose files such as effects). */
export const costumeFileUrl = (path: string) => BASE + path;

const HEAD_GUESS = 65536;

interface Pack {
  url: string;
  /** Where the files start. */
  dataStart: number;
  /** File name -> [offset, packed size, size once unpacked]. */
  index: Record<string, [number, number, number]>;
  /** Set when the server sent the whole pack in one go. */
  whole?: Uint8Array;
}

const packs = new Map<string, Promise<Pack>>();
const files = new Map<string, Promise<ArrayBuffer | undefined>>();

async function fetchRange(url: string, start: number, end: number): Promise<{ bytes: Uint8Array; whole: boolean }> {
  const res = await fetch(url, { headers: { Range: `bytes=${start}-${end}` } });
  if (res.status === 206) return { bytes: new Uint8Array(await res.arrayBuffer()), whole: false };
  if (res.status === 200) return { bytes: new Uint8Array(await res.arrayBuffer()), whole: true };
  throw new Error(`${res.status} ${url}`);
}

async function openPack(path: string): Promise<Pack> {
  const url = BASE + path;
  const first = await fetchRange(url, 0, HEAD_GUESS - 1);
  if (String.fromCharCode(...first.bytes.subarray(0, 4)) !== "RCP1") throw new Error(`Not a pack: ${url}`);
  const view = new DataView(first.bytes.buffer, first.bytes.byteOffset, first.bytes.byteLength);
  const dataStart = 8 + view.getUint32(4, true);

  let head = first.bytes;
  let whole = first.whole ? first.bytes : undefined;
  if (dataStart > head.length) {
    const more = await fetchRange(url, 0, dataStart - 1);
    head = more.bytes;
    if (more.whole) whole = more.bytes;
  }

  const index = JSON.parse(new TextDecoder().decode(head.subarray(8, dataStart)));
  return { url, dataStart, index, whole };
}

const pack = (path: string) => {
  let opened = packs.get(path);
  if (!opened) {
    opened = openPack(path);
    // A failed open is tried again next time rather than remembered.
    opened.catch(() => packs.delete(path));
    packs.set(path, opened);
  }
  return opened;
};

const inflate = (bytes: Uint8Array) =>
  new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("deflate"))).arrayBuffer();

/** The names of the files a pack holds. */
export async function packFileNames(path: string): Promise<string[]> {
  return Object.keys((await pack(path)).index);
}

/** One file of a pack, unpacked; undefined when the pack does not hold it. */
export function readPackFile(path: string, name: string): Promise<ArrayBuffer | undefined> {
  const id = `${path}|${name}`;
  let found = files.get(id);
  if (!found) {
    found = (async () => {
      const opened = await pack(path);
      const entry = opened.index[name];
      if (!entry) return undefined;
      const [offset, size] = entry;
      const start = opened.dataStart + offset;
      const bytes = opened.whole
        ? opened.whole.subarray(start, start + size)
        : (await fetchRange(opened.url, start, start + size - 1)).bytes;
      return inflate(bytes);
    })();
    found.catch(() => files.delete(id));
    files.set(id, found);
  }
  return found;
}
