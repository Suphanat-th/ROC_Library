import { SPRData, SPRFrame } from "@/types/visual"

/** Decodes the zero-run compression of SPR v2.1+: a 0 byte is followed by how many 0s it stands for. */
function decodeRle(source: Uint8Array, size: number): Uint8Array {
  const pixels = new Uint8Array(size)
  let s = 0
  let d = 0

  while (s < source.length && d < size) {
    const b = source[s++]
    if (b === 0) {
      d += source[s++]
    } else {
      pixels[d++] = b
    }
  }

  return pixels
}

export function parseSPR(buffer: ArrayBuffer): SPRData {
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)

  if (String.fromCharCode(bytes[0], bytes[1]) !== "SP") {
    throw new Error("Invalid SPR")
  }

  // Stored minor first, so 0x0201 reads as version 2.1.
  const version = view.getUint16(2, true)
  const indexedCount = view.getUint16(4, true)
  let rgbaCount = 0
  let offset = 6

  if (version >= 0x0200) {
    rgbaCount = view.getUint16(6, true)
    offset = 8
  }

  const frames: SPRFrame[] = []

  for (let i = 0; i < indexedCount; i++) {
    const width = view.getUint16(offset, true)
    const height = view.getUint16(offset + 2, true)
    offset += 4

    const size = width * height

    if (version >= 0x0201) {
      const length = view.getUint16(offset, true)
      offset += 2
      frames.push({
        width,
        height,
        pixels: decodeRle(bytes.subarray(offset, offset + length), size),
      })
      offset += length
    } else {
      frames.push({ width, height, pixels: bytes.slice(offset, offset + size) })
      offset += size
    }
  }

  for (let i = 0; i < rgbaCount; i++) {
    const width = view.getUint16(offset, true)
    const height = view.getUint16(offset + 2, true)
    offset += 4

    // Stored as ABGR with the bottom row first.
    const rgba = new Uint8Array(width * height * 4)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const src = offset + ((height - 1 - y) * width + x) * 4
        const dst = (y * width + x) * 4
        rgba[dst] = bytes[src + 3]
        rgba[dst + 1] = bytes[src + 2]
        rgba[dst + 2] = bytes[src + 1]
        rgba[dst + 3] = bytes[src]
      }
    }

    frames.push({ width, height, pixels: new Uint8Array(0), rgba })
    offset += width * height * 4
  }

  const palette =
    version >= 0x0101
      ? bytes.slice(offset, offset + 1024)
      : new Uint8Array(1024)

  return { frames, palette, indexedCount }
}
