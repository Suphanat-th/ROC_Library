import { SPRData, SPRFrame } from "@/types/visual"

export function parseSPR(buffer: ArrayBuffer): SPRData {

  const view = new DataView(buffer)
  let offset = 0

  const sig =
    String.fromCharCode(view.getUint8(0)) +
    String.fromCharCode(view.getUint8(1))

  if (sig !== "SP") throw new Error("Invalid SPR")

  offset = 2

  const versionMajor = view.getUint8(offset)
  offset++

  const versionMinor = view.getUint8(offset)
  offset++

  const frameCount = view.getUint16(offset, true)
  offset += 2

  const frames: SPRFrame[] = []

  for (let i = 0; i < frameCount; i++) {

    const width = view.getUint16(offset, true)
    offset += 2

    const height = view.getUint16(offset, true)
    offset += 2

    const size = width * height

    const pixels = new Uint8Array(buffer.slice(offset, offset + size))
    offset += size

    frames.push({
      width,
      height,
      pixels
    })
  }

  const palette = new Uint8Array(buffer.slice(offset, offset + 1024))

  return {
    frames,
    palette
  }
}