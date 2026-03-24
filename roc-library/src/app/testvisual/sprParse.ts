export interface SprImage {
  width: number
  height: number
  pixels: Uint8Array
}

export interface SprFile {
  images: SprImage[]
  palette: Uint8Array
}

export interface ActFrame {
  spriteIndex: number
  x: number
  y: number
}

export interface ActAction {
  frames: ActFrame[]
}

export interface ActFile {
  actions: ActAction[]
}


export async function loadSPR(url: string) {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()

  const view = new DataView(buffer)

  let offset = 0

  const readU8 = () => view.getUint8(offset++)
  const readU16 = () => {
    const v = view.getUint16(offset, true)
    offset += 2
    return v
  }

  const sig =
    String.fromCharCode(readU8()) +
    String.fromCharCode(readU8())

  if (sig !== "SP") throw new Error("Invalid SPR")

  const minor = readU8()
  const major = readU8()

  const indexedCount = readU16()
  const rgbaCount = readU16()

  const images = []

  for (let i = 0; i < indexedCount; i++) {
    const width = readU16()
    const height = readU16()

    const pixelCount = width * height

    const pixels = decodeRLE(view, () => readU8(), pixelCount)

    images.push({
      width,
      height,
      pixels
    })
  }

  const palette = new Uint8Array(buffer, offset, 1024)

  return {
    images,
    palette
  }
}

function decodeRLE(
  view: DataView,
  readByte: () => number,
  expected: number
) {
  const output = new Uint8Array(expected)

  let dst = 0

  while (dst < expected) {
    const value = readByte()

    if (value === 0) {
      const count = readByte()

      for (let i = 0; i < count; i++) {
        output[dst++] = 0
      }
    } else {
      output[dst++] = value
    }
  }

  return output
}


export async function loadACT(url: string): Promise<ActFile> {
  const res = await fetch(url)
  const buffer = await res.arrayBuffer()

  const view = new DataView(buffer)

  let offset = 0

  offset += 2 // signature

  const version = view.getUint16(offset, true)
  offset += 2

  const actionCount = view.getUint16(offset, true)
  offset += 2

  const actions: ActAction[] = []

  for (let i = 0; i < actionCount; i++) {
    const frameCount = view.getUint16(offset, true)
    offset += 2

    const frames: ActFrame[] = []

    for (let j = 0; j < frameCount; j++) {
      const spriteIndex = view.getUint16(offset, true)
      offset += 2

      const x = view.getInt16(offset, true)
      offset += 2

      const y = view.getInt16(offset, true)
      offset += 2

      frames.push({
        spriteIndex,
        x,
        y
      })
    }

    actions.push({ frames })
  }

  return { actions }
}