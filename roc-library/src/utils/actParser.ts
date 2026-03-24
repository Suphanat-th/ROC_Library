import { ActData, ActAction } from "@/types/visual"

export function parseACT(buffer: ArrayBuffer): ActData {

  const view = new DataView(buffer)
  let offset = 0

  const sig =
    String.fromCharCode(view.getUint8(0)) +
    String.fromCharCode(view.getUint8(1))

  if (sig !== "AC") throw new Error("Invalid ACT")

  offset = 2

  const version = view.getUint16(offset, true)
  offset += 2

  const actionCount = view.getUint16(offset, true)
  offset += 2

  const actions: ActAction[] = []

  for (let a = 0; a < actionCount; a++) {

    const frameCount = view.getUint16(offset, true)
    offset += 2

    const delay = 0.1

    const frames = []

    for (let f = 0; f < frameCount; f++) {

      const layerCount = view.getUint16(offset, true)
      offset += 2

      const layers = []

      for (let l = 0; l < layerCount; l++) {

        const spriteIndex = view.getInt32(offset, true)
        offset += 4

        const x = view.getInt32(offset, true)
        offset += 4

        const y = view.getInt32(offset, true)
        offset += 4

        layers.push({
          spriteIndex,
          x,
          y
        })
      }

      frames.push({ layers })
    }

    actions.push({
      frames,
      delay
    })
  }

  return { actions }
}