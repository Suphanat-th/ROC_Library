export interface SPRFrame {
  width: number
  height: number
  /** Palette indices (indexed frames only). */
  pixels: Uint8Array
  /** Straight RGBA, top row first (true-colour frames only). */
  rgba?: Uint8Array
}

export interface SPRData {
  palette: Uint8Array
  frames: SPRFrame[]
  /** Frames before this index are indexed; the rest are true-colour. */
  indexedCount: number
}

export interface ActLayer {
  /** Index into the indexed frames, or into the true-colour frames when spriteType is 1. */
  spriteIndex: number
  x: number
  y: number
  mirror: boolean
  /** r, g, b, a (0-255). */
  color: [number, number, number, number]
  scaleX: number
  scaleY: number
  /** Degrees. */
  rotation: number
  /** 0 = indexed, 1 = true-colour. */
  spriteType: number
}

export interface ActAnchor {
  x: number
  y: number
}

export interface ActFrame {
  layers: ActLayer[]
  anchors: ActAnchor[]
}

export interface ActAction {
  frames: ActFrame[]
  /** Milliseconds each frame stays on screen. */
  delay: number
}

export interface ActData {
  actions: ActAction[]
}
