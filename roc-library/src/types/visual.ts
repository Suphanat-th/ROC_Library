export interface SPRFrame {
  width: number
  height: number
  pixels: Uint8Array
}

export interface SPRData {
  palette: Uint8Array
  frames: SPRFrame[]
}

export interface ActLayer {
  spriteIndex: number
  x: number
  y: number
}

export interface ActFrame {
  layers: ActLayer[]
}

export interface ActAction {
  frames: ActFrame[]
  delay: number
}

export interface ActData {
  actions: ActAction[]
}