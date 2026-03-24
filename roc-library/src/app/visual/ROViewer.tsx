"use client"

import { ActData, SPRData } from "@/types/visual"
import { parseACT } from "@/utils/actParser"
import { parseSPR } from "@/utils/sprParser"
import { useRef } from "react"

export default function ROViewer() {

  const canvasRef = useRef<HTMLCanvasElement>(null)

  const sprRef = useRef<SPRData | null>(null)
  const actRef = useRef<ActData | null>(null)

  const frameIndexRef = useRef(0)

  const renderFrame = () => {

    const spr = sprRef.current
    const act = actRef.current

    if (!spr || !act) return

    const action = act.actions[0]

    const frame = action.frames[frameIndexRef.current]

    if (!frame) return

    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    for (const layer of frame.layers) {

      if (layer.spriteIndex < 0) continue

      const sprite = spr.frames[layer.spriteIndex]

      if (!sprite) continue

      canvas.width = sprite.width
      canvas.height = sprite.height

      const imageData = ctx.createImageData(sprite.width, sprite.height)

      for (let i = 0; i < sprite.pixels.length; i++) {

        const idx = sprite.pixels[i]

        const palette = spr.palette

        imageData.data[i * 4] = palette[idx * 4]
        imageData.data[i * 4 + 1] = palette[idx * 4 + 1]
        imageData.data[i * 4 + 2] = palette[idx * 4 + 2]
        imageData.data[i * 4 + 3] = 255
      }

      ctx.putImageData(imageData, layer.x, layer.y)
    }

    frameIndexRef.current++

    if (frameIndexRef.current >= action.frames.length) {
      frameIndexRef.current = 0
    }

    setTimeout(renderFrame, action.delay * 100)
  }

  const loadSPR = async (file: File) => {

    const buffer = await file.arrayBuffer()

    sprRef.current = parseSPR(buffer)

    frameIndexRef.current = 0

    if (sprRef.current && actRef.current) {
      renderFrame()
    }
  }

  const loadACT = async (file: File) => {

    const buffer = await file.arrayBuffer()

    actRef.current = parseACT(buffer)

    frameIndexRef.current = 0

    if (sprRef.current && actRef.current) {
      renderFrame()
    }
  }

  return (

    <div>

      <input
        type="file"
        accept=".spr"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) loadSPR(f)
        }}
      />

      <input
        type="file"
        accept=".act"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) loadACT(f)
        }}
      />

      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{ border: "1px solid black" }}
      />

    </div>

  )
}