/**
 * Reads a compiled Lua 5.1 data file (.lub) that only builds tables of constants, such as iteminfo,
 * and returns the globals it sets as plain JS values. Strings are decoded as UTF-8 unless told otherwise.
 * It runs just the few instructions such a file uses and throws on any other, so a client that changes
 * the file's shape fails loudly instead of giving wrong data.
 */

const OPS = [
  "MOVE", "LOADK", "LOADBOOL", "LOADNIL", "GETUPVAL", "GETGLOBAL", "GETTABLE", "SETGLOBAL", "SETUPVAL",
  "SETTABLE", "NEWTABLE", "SELF", "ADD", "SUB", "MUL", "DIV", "MOD", "POW", "UNM", "NOT", "LEN", "CONCAT",
  "JMP", "EQ", "LT", "LE", "TEST", "TESTSET", "CALL", "TAILCALL", "RETURN", "FORLOOP", "FORPREP",
  "TFORLOOP", "SETLIST", "CLOSE", "CLOSURE", "VARARG",
];

export function undump(buf, encoding = "utf-8") {
  const text = new TextDecoder(encoding);
  if (buf.toString("latin1", 0, 4) !== "\x1bLua" || buf[4] !== 0x51) throw new Error("Not a Lua 5.1 chunk");
  const sizeT = buf[8];
  let p = 12;
  const int = () => { const v = buf.readInt32LE(p); p += 4; return v; };
  const str = () => {
    const n = sizeT === 8 ? Number(buf.readBigUInt64LE(p)) : buf.readUInt32LE(p);
    p += sizeT;
    if (!n) return null;
    const s = text.decode(buf.subarray(p, p + n - 1));
    p += n;
    return s;
  };
  function fn() {
    str(); int(); int(); p += 4;
    const code = [];
    for (let i = int(); i > 0; i--) { code.push(buf.readUInt32LE(p)); p += 4; }
    const k = [];
    for (let i = int(); i > 0; i--) {
      const t = buf[p++];
      if (t === 0) k.push(null);
      else if (t === 1) k.push(buf[p++] !== 0);
      else if (t === 3) { k.push(buf.readDoubleLE(p)); p += 8; }
      else if (t === 4) k.push(str());
      else throw new Error("Unknown constant type " + t);
    }
    const protos = [];
    for (let i = int(); i > 0; i--) protos.push(fn());
    for (let i = int(); i > 0; i--) p += 4; // line info
    for (let i = int(); i > 0; i--) { str(); p += 8; } // locals
    for (let i = int(); i > 0; i--) str(); // upvalue names
    return { code, k, protos };
  }
  return fn();
}

export function run(proto, globals = {}, stats = {}) {
  const reg = [];
  const code = proto.code;
  const K = (x) => (x & 256 ? proto.k[x & 255] : reg[x]);
  for (let pc = 0; pc < code.length; pc++) {
    const i = code[pc];
    const op = OPS[i & 63], A = (i >>> 6) & 255, C = (i >>> 14) & 511, B = (i >>> 23) & 511;
    const Bx = i >>> 14;
    stats[op] = (stats[op] || 0) + 1;
    switch (op) {
      case "MOVE": reg[A] = reg[B]; break;
      case "LOADK": reg[A] = proto.k[Bx]; break;
      case "LOADBOOL": reg[A] = B !== 0; if (C) pc++; break;
      case "LOADNIL": for (let r = A; r <= B; r++) reg[r] = null; break;
      case "GETGLOBAL": reg[A] = globals[proto.k[Bx]]; break;
      case "SETGLOBAL": globals[proto.k[Bx]] = reg[A]; break;
      case "NEWTABLE": reg[A] = {}; break;
      case "SETTABLE": reg[A][K(B)] = K(C); break;
      case "GETTABLE": reg[A] = reg[B][K(C)]; break;
      case "SETLIST": {
        let n = B, block = C;
        if (block === 0) { block = code[++pc]; }
        if (n === 0) throw new Error("SETLIST with open count is not supported");
        for (let j = 1; j <= n; j++) reg[A][(block - 1) * 50 + j] = reg[A + j];
        break;
      }
      case "CLOSURE": reg[A] = { proto: proto.protos[Bx] }; break;
      case "CALL": {
        const f = reg[A];
        if (!f || !f.proto) throw new Error("CALL of something that is not a Lua function");
        run(f.proto, globals, stats);
        break;
      }
      case "RETURN": return;
      default: throw new Error("Unsupported Lua instruction " + op);
    }
  }
}

/** Reads the file and returns the globals it sets. `globals` (optional) holds ones another file set that this one reads; `stats` counts the instructions run. */
export function readLuaGlobals(buf, encoding, stats, globals = {}) {
  run(undump(buf, encoding), globals, stats);
  return globals;
}
