"use client"

import { parseSPR } from "@/utils/sprParser"
import { useRef } from "react"

export default function SpriteViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const loadFile = async (file: File) => {
    const buffer = await file.arrayBuffer()
    const spr = parseSPR(buffer)

    const frame = spr.frames[0]
    const palette = spr.palette

    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    canvas.width = frame.width
    canvas.height = frame.height

    const imageData = ctx.createImageData(frame.width, frame.height)

    for (let i = 0; i < frame.pixels.length; i++) {
      const index = frame.pixels[i]

      const r = palette[index * 4]
      const g = palette[index * 4 + 1]
      const b = palette[index * 4 + 2]
      const a = palette[index * 4 + 3]

      imageData.data[i * 4] = r
      imageData.data[i * 4 + 1] = g
      imageData.data[i * 4 + 2] = b
      imageData.data[i * 4 + 3] = a
    }

    ctx.putImageData(imageData, 0, 0)
  }

  return (
    <div>
      <input
        type="file"
        accept=".spr"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) loadFile(file)
        }}
      />

      <canvas ref={canvasRef} style={{ border: "1px solid #444" }} />
    </div>
  )
}