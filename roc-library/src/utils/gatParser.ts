// Parser for Ragnarok GAT (walkability) files, version 1.2. Each GAT cell is half the size of a GND cell.
export interface GatData {
  width: number;
  height: number;
  /** 4 heights per cell, corner order: bottom-left, bottom-right, top-left, top-right. */
  cellHeights: Float32Array;
  cellTypes: Uint8Array;
}

const CELL_BYTES = 20;
const HEADER_BYTES = 14;

// Cell types that a character can stand on: ground, water (shallow) and the walkable variant.
export function isWalkableGatType(type: number): boolean {
  return type === 0 || type === 3 || type === 4;
}

export function parseGat(buffer: ArrayBuffer): GatData {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
  if (magic !== "GRAT") throw new Error("ไม่ใช่ไฟล์ GAT");

  const width = view.getInt32(6, true);
  const height = view.getInt32(10, true);
  const cellCount = width * height;
  if (HEADER_BYTES + cellCount * CELL_BYTES > buffer.byteLength) throw new Error("ไฟล์ GAT ไม่สมบูรณ์");

  const cellHeights = new Float32Array(cellCount * 4);
  const cellTypes = new Uint8Array(cellCount);
  for (let i = 0; i < cellCount; i++) {
    const base = HEADER_BYTES + i * CELL_BYTES;
    for (let k = 0; k < 4; k++) cellHeights[i * 4 + k] = view.getFloat32(base + k * 4, true);
    cellTypes[i] = view.getInt32(base + 16, true);
  }
  return { width, height, cellHeights, cellTypes };
}
