import { ActAction, ActAnchor, ActData, ActFrame, ActLayer } from "@/types/visual"

/** One ACT delay unit is 24 ms. */
const DELAY_UNIT_MS = 24
const DEFAULT_DELAY_MS = 100

export function parseACT(buffer: ArrayBuffer): ActData {
  const view = new DataView(buffer)

  if (
    String.fromCharCode(view.getUint8(0), view.getUint8(1)) !== "AC"
  ) {
    throw new Error("Invalid ACT")
  }

  // Stored minor first, so 0x0204 reads as version 2.4.
  const version = view.getUint16(2, true)
  const actionCount = view.getUint16(4, true)
  let offset = 16 // 2 signature + 2 version + 2 count + 10 reserved

  const i32 = () => {
    const v = view.getInt32(offset, true)
    offset += 4
    return v
  }
  const f32 = () => {
    const v = view.getFloat32(offset, true)
    offset += 4
    return v
  }

  const actions: ActAction[] = []

  for (let a = 0; a < actionCount; a++) {
    const frameCount = i32()
    const frames: ActFrame[] = []

    for (let f = 0; f < frameCount; f++) {
      offset += 32 // two unused rectangles

      const layerCount = i32()
      const layers: ActLayer[] = []

      for (let l = 0; l < layerCount; l++) {
        const x = i32()
        const y = i32()
        const spriteIndex = i32()
        const mirror = i32() !== 0

        let color: ActLayer["color"] = [255, 255, 255, 255]
        let scaleX = 1
        let scaleY = 1
        let rotation = 0
        let spriteType = 0

        if (version >= 0x0200) {
          color = [
            view.getUint8(offset),
            view.getUint8(offset + 1),
            view.getUint8(offset + 2),
            view.getUint8(offset + 3),
          ]
          offset += 4

          scaleX = f32()
          scaleY = version >= 0x0204 ? f32() : scaleX
          rotation = i32()
          spriteType = i32()

          if (version >= 0x0205) offset += 8 // width, height
        }

        layers.push({
          spriteIndex,
          x,
          y,
          mirror,
          color,
          scaleX,
          scaleY,
          rotation,
          spriteType,
        })
      }

      if (version >= 0x0200) offset += 4 // sound id

      const anchors: ActAnchor[] = []
      if (version >= 0x0203) {
        const anchorCount = i32()
        for (let n = 0; n < anchorCount; n++) {
          offset += 4 // unused
          const x = i32()
          const y = i32()
          offset += 4 // attribute
          anchors.push({ x, y })
        }
      }

      frames.push({ layers, anchors })
    }

    actions.push({ frames, delay: DEFAULT_DELAY_MS })
  }

  if (version >= 0x0201) {
    const eventCount = i32()
    offset += eventCount * 40
  }

  if (version >= 0x0202) {
    for (let a = 0; a < actionCount; a++) {
      actions[a].delay = Math.max(f32(), 1) * DELAY_UNIT_MS
    }
  }

  return { actions }
}
