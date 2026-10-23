// Parser for Ragnarok RSM (model) files, version 1.4. Animation is not read, so a model is shown as it stands.

export interface RsmFace {
  vertices: [number, number, number];
  texCoords: [number, number, number];
  /** index into the node's own texture list */
  texture: number;
  twoSide: boolean;
}

export interface RsmNode {
  name: string;
  /** empty for a root node */
  parent: string;
  /** indices into the model's texture list, one per texture the node uses */
  textureIds: number[];
  /** 3x3 matrix as stored: the first three values are the first column */
  offsetMatrix: number[];
  offset: [number, number, number];
  position: [number, number, number];
  rotationAngle: number;
  rotationAxis: [number, number, number];
  scale: [number, number, number];
  /** x, y, z of every vertex */
  vertices: Float32Array;
  /** u, v of every texture coordinate */
  texCoords: Float32Array;
  faces: RsmFace[];
}

export interface RsmData {
  textures: string[];
  nodes: RsmNode[];
}

// File names in the game's files are Korean (CP949).
const nameDecoder = new TextDecoder("euc-kr");
const NAME_BYTES = 40;

export function parseRsm(buffer: ArrayBuffer): RsmData {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
  if (magic !== "GRSM") throw new Error("ไม่ใช่ไฟล์ RSM");
  const major = view.getUint8(4);
  const minor = view.getUint8(5);
  if (major !== 1 || minor !== 4) throw new Error(`ไม่รองรับ RSM เวอร์ชัน ${major}.${minor}`);

  let offset = 6;
  const i32 = () => {
    const value = view.getInt32(offset, true);
    offset += 4;
    return value;
  };
  const f32 = () => {
    const value = view.getFloat32(offset, true);
    offset += 4;
    return value;
  };
  const u16 = () => {
    const value = view.getUint16(offset, true);
    offset += 2;
    return value;
  };
  const name = () => {
    const bytes = new Uint8Array(buffer, offset, NAME_BYTES);
    offset += NAME_BYTES;
    let end = bytes.indexOf(0);
    if (end < 0) end = bytes.length;
    return nameDecoder.decode(bytes.subarray(0, end));
  };
  const vector = (): [number, number, number] => [f32(), f32(), f32()];

  // animation length, shade type, alpha (1 byte) and 16 reserved bytes
  offset += 4 + 4 + 1 + 16;
  const textureCount = i32();
  const textures: string[] = [];
  for (let i = 0; i < textureCount; i++) textures.push(name());
  offset += NAME_BYTES; // name of the main node
  const nodeCount = i32();

  const nodes: RsmNode[] = [];
  for (let n = 0; n < nodeCount; n++) {
    const nodeName = name();
    const parent = name();
    const ownTextures = i32();
    const textureIds: number[] = [];
    for (let i = 0; i < ownTextures; i++) textureIds.push(i32());
    const offsetMatrix: number[] = [];
    for (let i = 0; i < 9; i++) offsetMatrix.push(f32());
    const nodeOffset = vector();
    const position = vector();
    const rotationAngle = f32();
    const rotationAxis = vector();
    const scale = vector();

    const vertexCount = i32();
    const vertices = new Float32Array(vertexCount * 3);
    for (let i = 0; i < vertices.length; i++) vertices[i] = f32();

    const texCoordCount = i32();
    const texCoords = new Float32Array(texCoordCount * 2);
    for (let i = 0; i < texCoordCount; i++) {
      offset += 4; // colour
      texCoords[i * 2] = f32();
      texCoords[i * 2 + 1] = f32();
    }

    const faceCount = i32();
    const faces: RsmFace[] = [];
    for (let i = 0; i < faceCount; i++) {
      const v: [number, number, number] = [u16(), u16(), u16()];
      const t: [number, number, number] = [u16(), u16(), u16()];
      const texture = u16();
      offset += 2; // padding
      const twoSide = i32() !== 0;
      offset += 4; // smooth group
      faces.push({ vertices: v, texCoords: t, texture, twoSide });
    }

    const rotationKeyframes = i32();
    offset += rotationKeyframes * 20;

    nodes.push({
      name: nodeName,
      parent,
      textureIds,
      offsetMatrix,
      offset: nodeOffset,
      position,
      rotationAngle,
      rotationAxis,
      scale,
      vertices,
      texCoords,
      faces,
    });
  }
  return { textures, nodes };
}
