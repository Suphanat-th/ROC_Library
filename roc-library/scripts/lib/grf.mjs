/**
 * Reads a game archive (GRF 0x200) such as data.grf. Shared by the scripts that extract game data by hand
 * (extract-navigation.mjs, extract-costume.mjs).
 *
 * File names in the archive are Korean bytes (CP949); they are kept as raw bytes read as latin1, so a
 * pattern written with ASCII works as before. Only A-Z is lower-cased: lower-casing the other bytes would
 * change Korean letters. `nameOf(raw)` turns a stored path into readable Unicode.
 */
import fs from "node:fs";
import zlib from "node:zlib";

const HEADER_SIZE = 46;
const FLAG_FILE = 1;
const FLAG_MIXED_CRYPT = 2;
const FLAG_HEADER_CRYPT = 4;

// prettier-ignore
const DES_IP = [58,50,42,34,26,18,10,2,60,52,44,36,28,20,12,4,62,54,46,38,30,22,14,6,64,56,48,40,32,24,16,8,57,49,41,33,25,17,9,1,59,51,43,35,27,19,11,3,61,53,45,37,29,21,13,5,63,55,47,39,31,23,15,7];
// prettier-ignore
const DES_FP = [40,8,48,16,56,24,64,32,39,7,47,15,55,23,63,31,38,6,46,14,54,22,62,30,37,5,45,13,53,21,61,29,36,4,44,12,52,20,60,28,35,3,43,11,51,19,59,27,34,2,42,10,50,18,58,26,33,1,41,9,49,17,57,25];
// prettier-ignore
const DES_E = [32,1,2,3,4,5,4,5,6,7,8,9,8,9,10,11,12,13,12,13,14,15,16,17,16,17,18,19,20,21,20,21,22,23,24,25,24,25,26,27,28,29,28,29,30,31,32,1];
// prettier-ignore
const DES_P = [16,7,20,21,29,12,28,17,1,15,23,26,5,18,31,10,2,8,24,14,32,27,3,9,19,13,30,6,22,11,4,25];
// prettier-ignore
const DES_S = [
  [14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7,0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8,4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0,15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13],
  [15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10,3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5,0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15,13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9],
  [10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8,13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1,13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7,1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12],
  [7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15,13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9,10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4,3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14],
  [2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9,14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6,4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14,11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3],
  [12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11,10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8,9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6,4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13],
  [4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1,13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6,1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2,6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12],
  [13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7,1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2,7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8,2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11],
];
// prettier-ignore
const SHUFFLE_SWAPS = [[0x00, 0x2b], [0x6c, 0x80], [0x01, 0x68], [0x48, 0x77], [0x60, 0xff], [0xb9, 0xc0], [0xfe, 0xeb]];
const SHUFFLE_SUBSTITUTE = new Map(SHUFFLE_SWAPS.flatMap(([a, b]) => [[a, b], [b, a]]));

const permute = (bits, table) => table.map((position) => bits[position - 1]);

/** GRF's DES: a single round with an all-zero key, on one 8-byte block in place. */
function desDecryptBlock(buf, offset) {
  const bits = [];
  for (let i = 0; i < 64; i++) bits.push((buf[offset + (i >> 3)] >> (7 - (i & 7))) & 1);
  const initial = permute(bits, DES_IP);
  const left = initial.slice(0, 32);
  const right = initial.slice(32);
  const expanded = permute(right, DES_E);
  const substituted = [];
  for (let box = 0; box < 8; box++) {
    const c = expanded.slice(box * 6, box * 6 + 6);
    const row = (c[0] << 1) | c[5];
    const column = (c[1] << 3) | (c[2] << 2) | (c[3] << 1) | c[4];
    const value = DES_S[box][row * 16 + column];
    substituted.push((value >> 3) & 1, (value >> 2) & 1, (value >> 1) & 1, value & 1);
  }
  const mixed = permute(substituted, DES_P);
  const out = permute(left.map((bit, i) => bit ^ mixed[i]).concat(right), DES_FP);
  for (let i = 0; i < 8; i++) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | out[i * 8 + j];
    buf[offset + i] = byte;
  }
}

function unshuffleBlock(buf, offset) {
  const src = Buffer.from(buf.subarray(offset, offset + 8));
  const order = [3, 4, 6, 0, 1, 2, 5];
  order.forEach((from, to) => (buf[offset + to] = src[from]));
  buf[offset + 7] = SHUFFLE_SUBSTITUTE.get(src[7]) ?? src[7];
}

function decryptEntry(buf, flags, compressedSize) {
  const blocks = buf.length >> 3;
  for (let i = 0; i < 20 && i < blocks; i++) desDecryptBlock(buf, i * 8);
  if (!(flags & FLAG_MIXED_CRYPT)) return;

  const digits = String(compressedSize).length;
  const cycle = digits < 3 ? 1 : digits < 5 ? digits + 1 : digits < 7 ? digits + 9 : digits + 15;
  let plain = -1;
  for (let i = 20; i < blocks; i++) {
    if (i % cycle === 0) {
      desDecryptBlock(buf, i * 8);
      continue;
    }
    plain++;
    if (plain % 7 === 0 && plain !== 0) unshuffleBlock(buf, i * 8);
  }
}

/** Opens a GRF (version 0x200) and returns a reader of its files by lower-case path. */
export function openGrf(grfPath) {
  const fd = fs.openSync(grfPath, "r");
  const header = Buffer.alloc(HEADER_SIZE);
  fs.readSync(fd, header, 0, HEADER_SIZE, 0);
  const version = header.readUInt32LE(42);
  if (header.toString("latin1", 0, 15) !== "Master of Magic" || version !== 0x200) {
    throw new Error(`Not a GRF 0x200 archive: ${grfPath}`);
  }
  const tableAt = header.readUInt32LE(30) + HEADER_SIZE;
  const sizes = Buffer.alloc(8);
  fs.readSync(fd, sizes, 0, 8, tableAt);
  const packed = Buffer.alloc(sizes.readUInt32LE(0));
  fs.readSync(fd, packed, 0, packed.length, tableAt + 8);
  const table = zlib.inflateSync(packed);

  const entries = new Map();
  for (let p = 0; p < table.length; ) {
    const end = table.indexOf(0, p);
    const name = table.toString("latin1", p, end).replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32));
    p = end + 1;
    entries.set(name, {
      compressedSize: table.readUInt32LE(p),
      alignedSize: table.readUInt32LE(p + 4),
      flags: table[p + 12],
      offset: table.readUInt32LE(p + 13) + HEADER_SIZE,
    });
    p += 17;
  }

  const korean = new TextDecoder("euc-kr");

  return {
    /** Readable Unicode form of a stored path (Korean names decoded, \ turned into /). */
    nameOf: (raw) => korean.decode(Buffer.from(raw, "latin1")).replaceAll("\\", "/"),
    /** Paths (lower-case, as stored) that match the pattern. */
    find: (pattern) => [...entries.keys()].filter((name) => pattern.test(name)),
    read(name) {
      const entry = entries.get(name.replace(/[A-Z]/g, (c) => String.fromCharCode(c.charCodeAt(0) + 32)));
      if (!entry || !(entry.flags & FLAG_FILE)) return undefined;
      const buf = Buffer.alloc(entry.alignedSize);
      fs.readSync(fd, buf, 0, buf.length, entry.offset);
      if (entry.flags & (FLAG_MIXED_CRYPT | FLAG_HEADER_CRYPT)) {
        decryptEntry(buf, entry.flags, entry.compressedSize);
      }
      return zlib.inflateSync(buf);
    },
  };
}
