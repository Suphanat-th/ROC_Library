// Parser for Ragnarok GND (ground) files, version 1.5 - 1.9 (light map + surface layout of 1.7).
export interface GndData {
  width: number;
  height: number;
  zoom: number;
  textures: string[];
  lightmapCount: number;
  /** 256 bytes per light map: 64 brightness bytes followed by 64 RGB triples. */
  lightmaps: Uint8Array;
  surfaceCount: number;
  /** 4 values per surface, in corner order: bottom-left, bottom-right, top-left, top-right. */
  surfaceU: Float32Array;
  surfaceV: Float32Array;
  surfaceTexture: Int16Array;
  surfaceLightmap: Int16Array;
  /** 4 heights per cell, same corner order as the surfaces. */
  cellHeights: Float32Array;
  /** Surface index of each cell's top, front (towards +y) and right (towards +x) face, -1 for none. */
  cellTop: Int32Array;
  cellFront: Int32Array;
  cellRight: Int32Array;
}

const LIGHTMAP_BYTES = 256;
const SURFACE_BYTES = 40;
const CELL_BYTES = 28;

function readName(bytes: Uint8Array): string {
  let end = bytes.indexOf(0);
  if (end < 0) end = bytes.length;
  return new TextDecoder("latin1").decode(bytes.subarray(0, end));
}

export function parseGnd(buffer: ArrayBuffer): GndData {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
  if (magic !== "GRGN") throw new Error("ไม่ใช่ไฟล์ GND");
  const major = view.getUint8(4);
  const minor = view.getUint8(5);
  if (major !== 1 || minor < 5 || minor > 9) {
    throw new Error(`ไม่รองรับ GND เวอร์ชัน ${major}.${minor}`);
  }

  const width = view.getInt32(6, true);
  const height = view.getInt32(10, true);
  const zoom = view.getFloat32(14, true);
  const textureCount = view.getInt32(18, true);
  const textureNameLength = view.getInt32(22, true);
  let offset = 26;

  const textures: string[] = [];
  for (let i = 0; i < textureCount; i++) {
    textures.push(readName(new Uint8Array(buffer, offset, textureNameLength)));
    offset += textureNameLength;
  }

  const lightmapCount = view.getInt32(offset, true);
  offset += 16; // count, width, height, grid size
  const lightmaps = new Uint8Array(buffer, offset, lightmapCount * LIGHTMAP_BYTES);
  offset += lightmapCount * LIGHTMAP_BYTES;

  const surfaceCount = view.getInt32(offset, true);
  offset += 4;
  const surfaceU = new Float32Array(surfaceCount * 4);
  const surfaceV = new Float32Array(surfaceCount * 4);
  const surfaceTexture = new Int16Array(surfaceCount);
  const surfaceLightmap = new Int16Array(surfaceCount);
  for (let i = 0; i < surfaceCount; i++) {
    const base = offset + i * SURFACE_BYTES;
    for (let k = 0; k < 4; k++) {
      surfaceU[i * 4 + k] = view.getFloat32(base + k * 4, true);
      surfaceV[i * 4 + k] = view.getFloat32(base + 16 + k * 4, true);
    }
    surfaceTexture[i] = view.getInt16(base + 32, true);
    surfaceLightmap[i] = view.getInt16(base + 34, true);
  }
  offset += surfaceCount * SURFACE_BYTES;

  const cellCount = width * height;
  if (offset + cellCount * CELL_BYTES > buffer.byteLength) throw new Error("ไฟล์ GND ไม่สมบูรณ์");
  const cellHeights = new Float32Array(cellCount * 4);
  const cellTop = new Int32Array(cellCount);
  const cellFront = new Int32Array(cellCount);
  const cellRight = new Int32Array(cellCount);
  for (let i = 0; i < cellCount; i++) {
    const base = offset + i * CELL_BYTES;
    for (let k = 0; k < 4; k++) cellHeights[i * 4 + k] = view.getFloat32(base + k * 4, true);
    cellTop[i] = view.getInt32(base + 16, true);
    cellFront[i] = view.getInt32(base + 20, true);
    cellRight[i] = view.getInt32(base + 24, true);
  }

  return {
    width, height, zoom, textures, lightmapCount, lightmaps, surfaceCount,
    surfaceU, surfaceV, surfaceTexture, surfaceLightmap,
    cellHeights, cellTop, cellFront, cellRight,
  };
}
