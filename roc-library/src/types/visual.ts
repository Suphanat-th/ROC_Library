
interface SprData {
  version: number;
  indexedCount: number;
  rgbaCount: number;
  totalCount: number;
  arrayBuffer: ArrayBuffer;
  isRle: boolean;
}

interface ActData {
  version: number;
  actionCount: number;
  arrayBuffer: ArrayBuffer;
}

interface FileState {
  spr: SprData | null;
  act: ActData | null;
}

interface SpriteCanvasProps {
  spr: SprData;
  frameIndex: number;
  scale?: number;
}