'use client'
import { useEffect, useRef, useState } from "react"
import { ActFile, loadACT, loadSPR, SprFile } from "./sprParse"

export default function RagnarokViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [spr, setSpr] = useState<SprFile | null>(null)
  const [act, setAct] = useState<ActFile | null>(null)

  const frameRef = useRef<number>(0)

  useEffect(() => {
    async function load() {
      const sprData = await loadSPR("/sprite/body.spr")
      const actData = await loadACT("/sprite/body.act")

      setSpr(sprData)
      setAct(actData)
    }

    load()
  }, [])

  useEffect(() => {
    if (!spr || !act) return
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    const frames = act.actions[0].frames

    const interval = setInterval(() => {
      const frame = frames[frameRef.current]

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const sprite = spr.images[frame.spriteIndex]

      const imageData = ctx.createImageData(
        sprite.width,
        sprite.height
      )

      for (let i = 0; i < sprite.pixels.length; i++) {
        const colorIndex = sprite.pixels[i]

        const r = spr.palette[colorIndex * 4]
        const g = spr.palette[colorIndex * 4 + 1]
        const b = spr.palette[colorIndex * 4 + 2]

        imageData.data[i * 4] = r
        imageData.data[i * 4 + 1] = g
        imageData.data[i * 4 + 2] = b
        imageData.data[i * 4 + 3] = 255
      }

      ctx.putImageData(imageData, frame.x + 200, frame.y + 200)

      frameRef.current = (frameRef.current + 1) % frames.length
    }, 120)

    return () => clearInterval(interval)
  }, [spr, act])

  return <canvas ref={canvasRef} width={500} height={500} />
}



