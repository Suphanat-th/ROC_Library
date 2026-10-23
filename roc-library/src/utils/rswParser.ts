// Parser for Ragnarok RSW (map resource) files, version 2.1: it reads the placed models only.
// Lights, sounds and effects are skipped over, since their sizes are fixed.

export interface RswModel {
  /** model file under the model folder, e.g. "prontera\\pillar_02.rsm" */
  file: string;
  /** world position of the model, in the game's units */
  position: [number, number, number];
  /** rotation in degrees */
  rotation: [number, number, number];
  scale: [number, number, number];
}

/** The light of the map as the game sets it. */
export interface RswLight {
  /** degrees; the compass direction the light comes from */
  longitude: number;
  /** degrees from straight overhead (0 is the sun right above) */
  latitude: number;
  /** colour of the direct light, each channel 0 to 1 */
  diffuse: [number, number, number];
  /** colour of the light that reaches everything, each channel 0 to 1 */
  ambient: [number, number, number];
}

export interface RswData {
  light: RswLight;
  models: RswModel[];
}

// File names in the game's files are Korean (CP949).
const nameDecoder = new TextDecoder("euc-kr");

const NAME_BYTES = 40;
const LONG_NAME_BYTES = 80;
const HEADER_BYTES = 6;
const FILE_NAME_FIELDS = 4 * NAME_BYTES;
// water (6 values), light (9 values and the shadow opacity), and the 4 ground bounds
const WATER_BYTES = 24;
const LIGHT_BYTES = 36;
const BOUNDS_BYTES = 16;
// bytes that follow the object type, for the types that are not models
const SKIPPED_OBJECT_BYTES: Record<number, number> = { 2: 108, 3: 192, 4: 116 };

function readName(view: DataView, offset: number, length: number): string {
  const bytes = new Uint8Array(view.buffer, view.byteOffset + offset, length);
  let end = bytes.indexOf(0);
  if (end < 0) end = bytes.length;
  return nameDecoder.decode(bytes.subarray(0, end));
}

function readVector(view: DataView, offset: number): [number, number, number] {
  return [view.getFloat32(offset, true), view.getFloat32(offset + 4, true), view.getFloat32(offset + 8, true)];
}

export function parseRsw(buffer: ArrayBuffer): RswData {
  const view = new DataView(buffer);
  const magic = String.fromCharCode(...new Uint8Array(buffer, 0, 4));
  if (magic !== "GRSW") throw new Error("ไม่ใช่ไฟล์ RSW");
  const major = view.getUint8(4);
  const minor = view.getUint8(5);
  if (major !== 2 || minor < 1 || minor > 5) throw new Error(`ไม่รองรับ RSW เวอร์ชัน ${major}.${minor}`);

  const lightAt = HEADER_BYTES + FILE_NAME_FIELDS + WATER_BYTES;
  const light: RswLight = {
    longitude: view.getInt32(lightAt, true),
    latitude: view.getInt32(lightAt + 4, true),
    diffuse: readVector(view, lightAt + 8),
    ambient: readVector(view, lightAt + 20),
  };

  let offset = lightAt + LIGHT_BYTES + BOUNDS_BYTES;
  const count = view.getInt32(offset, true);
  offset += 4;

  const models: RswModel[] = [];
  for (let i = 0; i < count; i++) {
    if (offset + 4 > buffer.byteLength) break;
    const type = view.getInt32(offset, true);
    offset += 4;
    if (type === 1) {
      // name, animation type, animation speed and block type come first
      const file = readName(view, offset + NAME_BYTES + 12, LONG_NAME_BYTES);
      const vectors = offset + NAME_BYTES + 12 + 2 * LONG_NAME_BYTES;
      models.push({
        file,
        position: readVector(view, vectors),
        rotation: readVector(view, vectors + 12),
        scale: readVector(view, vectors + 24),
      });
      offset = vectors + 36;
    } else if (type in SKIPPED_OBJECT_BYTES) {
      offset += SKIPPED_OBJECT_BYTES[type];
    } else {
      break;
    }
  }
  return { light, models };
}
