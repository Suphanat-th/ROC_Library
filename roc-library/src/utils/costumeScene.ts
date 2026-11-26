/**
 * The Costume simulator's picture: one function paints the whole scene at a moment (the character, its effects,
 * the Footprints and the name), so the stage and the exported GIF are made by the same code.
 */
import { applyPalette, GIFEncoder, quantize } from "gifenc"
import { Bounds, Character, drawCharacter, gearLoopMs, isHeldPose } from "@/utils/spriteComposer"
import { createStrRenderer, StrEffect, strDuration, strFrameAt, StrRenderer } from "@/utils/strEffect"
import { Footprint, paintFootprint, WALK } from "@/utils/footprintEffect"

/** Size of the stage picture, in pixels. */
export const STAGE_WIDTH = 560
export const STAGE_HEIGHT = 580

export interface SceneEffect {
  effect: StrEffect
  bounds: Bounds | null
  behind: boolean
  head: boolean
}

export interface Scene {
  character: Character
  effects: SceneEffect[]
  footprints: Footprint[]
  /** Pose type × 8 + direction. */
  action: number
  /** Where the character's feet are, and the size of a sprite pixel. */
  originX: number
  originY: number
  scale: number
  name: string
}

/** The name under the character's feet, white with a dark edge as the game writes it. */
function drawNameTag(ctx: CanvasRenderingContext2D, name: string, x: number, y: number, scale: number) {
  const size = Math.max(14, Math.min(28, Math.round(7 * scale + 6)))
  ctx.save()
  ctx.font = `700 ${size}px ${getComputedStyle(document.body).fontFamily}`
  ctx.textAlign = "center"
  ctx.textBaseline = "middle"
  ctx.lineJoin = "round"
  ctx.lineWidth = Math.max(3, size / 4)
  ctx.strokeStyle = "rgba(0, 0, 0, 0.85)"
  const at = y + 10 * scale + size / 2
  ctx.strokeText(name, x, at)
  ctx.fillStyle = "#ffffff"
  ctx.fillText(name, x, at)
  ctx.restore()
}

/**
 * Paints the scene at `elapsed` milliseconds: the character and its name on `ctx`, the effects that play over it on
 * `front`, and what plays under it (Footprints, effects the game draws first) on `back`.
 */
export function paintScene(
  scene: Scene,
  ctx: CanvasRenderingContext2D,
  front: StrRenderer | null,
  back: StrRenderer | null,
  elapsed: number,
) {
  const { character, action, originX, originY, scale } = scene
  const bodyAction = character.body.act.actions[action]
  if (!bodyAction) return
  const held = isHeldPose(character.body, action)
  const bodyFrame = held ? 0 : Math.floor(elapsed / bodyAction.delay) % bodyAction.frames.length

  drawCharacter(ctx, character, { action, bodyFrame, elapsed }, originX, originY, scale)
  if (scene.name) drawNameTag(ctx, scene.name, originX, originY, scale)

  // An effect that follows the head moves with the body's anchor (where the head sits on the body).
  const paintEffect = (layer: StrRenderer, fx: SceneEffect) => {
    let x = originX
    let y = originY
    if (fx.head) {
      const frame = bodyAction.frames[held ? 0 : Math.floor(elapsed / bodyAction.delay) % bodyAction.frames.length]
      const anchor = frame?.anchors[0]
      x += (anchor?.x ?? 0) * scale
      y += (anchor?.y ?? 0) * scale
    }
    layer.paint(fx.effect, strFrameAt(fx.effect, elapsed), x, y, scale)
  }

  if (front) {
    front.clear()
    for (const fx of scene.effects) if (!fx.behind) paintEffect(front, fx)
  }
  if (back) {
    back.clear()
    for (const fx of scene.effects) if (fx.behind) paintEffect(back, fx)
    // Footprints are left only while walking.
    if (Math.floor(action / 8) === WALK) {
      const cycle = bodyAction.delay * bodyAction.frames.length
      for (const step of scene.footprints) paintFootprint(back, step, { direction: action % 8, cycle, elapsed }, originX, originY, scale)
    }
  }
}

/* ============ GIF ============ */

/** Widths a GIF can be made at (the stage's height follows). The stage itself is STAGE_WIDTH wide. */
export const GIF_WIDTHS = [420, 560, 840] as const
/** Frames per second a GIF can be made at. A GIF counts time in hundredths of a second, so 30 is made of frames 3, 3 and 4 hundredths long. */
export const GIF_FPS = [30, 15, 10] as const
/** Longest a GIF runs before it loops, in seconds. */
export const GIF_SECONDS = [6, 3] as const

export interface GifSettings {
  width: (typeof GIF_WIDTHS)[number]
  fps: (typeof GIF_FPS)[number]
  seconds: (typeof GIF_SECONDS)[number]
}

export const GIF_DEFAULTS: GifSettings = { width: 840, fps: 30, seconds: 6 }

/** The logo is this wide in a GIF of 420 pixels, and grows with the picture. */
const GIF_LOGO_SIZE = 36
const GIF_LOGO_MARGIN = 8
/** Frames looked at to choose the colours of a GIF. */
const PALETTE_FRAMES = 8

/** The size of a GIF at this width, in pixels. */
export const gifHeight = (width: number) => Math.round((width * STAGE_HEIGHT) / STAGE_WIDTH)

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)

/**
 * How long one loop of the scene is, and how long to run before it so the ground is already full of steps: the
 * shortest time the walk cycle, the effects and the headgear's own animation all repeat together; past `maxMs`, the
 * longest of them rounded to whole walk cycles. `still` when nothing moves.
 */
export function gifLoop(scene: Scene, maxMs: number) {
  const { character, action } = scene
  const bodyAction = character.body.act.actions[action]
  const cycle = !bodyAction || isHeldPose(character.body, action) ? 0 : bodyAction.delay * bodyAction.frames.length
  const walking = Math.floor(action / 8) === WALK
  const steps = walking && cycle > 0 ? scene.footprints : []

  const spriteEffects = (character.extras ?? [])
    .filter((gear) => gear.kind === "effect")
    .map((gear) => {
      const run = gear.asset.act.actions[0]
      return run ? Math.round(run.delay * run.frames.length) : 0
    })
  const periods = [
    cycle,
    ...scene.effects.map((fx) => Math.round(strDuration(fx.effect))),
    ...spriteEffects,
    Math.round(gearLoopMs(character, action)),
  ].filter((ms) => ms > 0)

  if (periods.length === 0 && steps.length === 0) return { loopMs: 0, warmupMs: 0, still: true }

  let loopMs = periods.reduce((a, b) => (a / gcd(a, b)) * b, 1)
  if (loopMs > maxMs || periods.length === 0) {
    loopMs = Math.max(...periods, cycle, 1)
    if (cycle > 0) {
      loopMs = Math.ceil(loopMs / cycle) * cycle
      if (loopMs > maxMs) loopMs = Math.max(cycle, Math.floor(maxMs / cycle) * cycle)
    } else {
      loopMs = Math.min(loopMs, maxMs)
    }
  }
  const lifetime = Math.max(0, ...steps.flatMap((step) => [...step.top, ...step.bottom]).map((e) => (e ? strDuration(e) : 0)))
  const warmupMs = steps.length ? Math.ceil(lifetime / cycle) * cycle : 0
  return { loopMs, warmupMs, still: false }
}

const nextTask = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

/** An image drawn to fill the box, cropped at the sides (like CSS object-fit: cover). */
function drawCover(ctx: CanvasRenderingContext2D, image: CanvasImageSource & { width: number; height: number }, width: number, height: number) {
  const ratio = Math.max(width / image.width, height / image.height)
  const w = image.width * ratio
  const h = image.height * ratio
  ctx.drawImage(image, (width - w) / 2, (height - h) / 2, w, h)
}

/**
 * Records one loop of the scene as the stage shows it (stage colour or the imported background, character, effects,
 * name) as a GIF with the site's logo in a corner. The scene is painted again at the size of the GIF, not shrunk from
 * the stage, so the sprites stay sharp. Frames are made twice, a few to choose the colours and then each one to write,
 * so a big GIF never holds every frame in memory. A scene where nothing moves gives a one-frame picture.
 */
export async function exportCostumeGif(
  scene: Scene,
  options: GifSettings & {
    stageColor: string
    background: HTMLImageElement | null
    logoUrl: string
    onProgress: (done: number) => void
  },
): Promise<Blob> {
  const loop = gifLoop(scene, options.seconds * 1000)
  const width = options.width
  const height = gifHeight(width)
  const k = width / STAGE_WIDTH
  const sized: Scene = { ...scene, originX: scene.originX * k, originY: scene.originY * k, scale: scene.scale * k }

  const make = () => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    return canvas
  }
  const characterCanvas = make()
  const backCanvas = make()
  const frontCanvas = make()
  const composite = make()
  const ctx = characterCanvas.getContext("2d")!
  const out = composite.getContext("2d", { willReadFrequently: true })!
  const back = createStrRenderer(backCanvas)
  const front = createStrRenderer(frontCanvas)
  const hasBack = scene.footprints.length > 0 || scene.effects.some((fx) => fx.behind)
  const hasFront = scene.effects.some((fx) => !fx.behind)

  const logo = new Image()
  logo.src = options.logoUrl
  const logoLoaded = await logo.decode().then(
    () => true,
    () => false,
  )

  // Frames are spread evenly over the loop, so the last one leads into the first without a jump.
  const count = loop.still ? 1 : Math.max(1, Math.round((loop.loopMs * options.fps) / 1000))
  const step = loop.still ? 0 : loop.loopMs / count

  const renderFrame = (i: number) => {
    paintScene(sized, ctx, hasFront ? front : null, hasBack ? back : null, loop.warmupMs + i * step)
    // The WebGL canvases are copied in the same task they were drawn in, before they are cleared.
    out.fillStyle = options.stageColor
    out.fillRect(0, 0, width, height)
    if (options.background) drawCover(out, options.background, width, height)
    if (hasBack) out.drawImage(backCanvas, 0, 0, width, height)
    out.drawImage(characterCanvas, 0, 0, width, height)
    if (hasFront) out.drawImage(frontCanvas, 0, 0, width, height)
    if (logoLoaded) {
      const size = Math.round((width * GIF_LOGO_SIZE) / 420)
      const margin = Math.round((width * GIF_LOGO_MARGIN) / 420)
      const x = margin
      const y = height - margin - size
      out.save()
      out.beginPath()
      out.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
      out.clip()
      out.drawImage(logo, x, y, size, size)
      out.restore()
      out.beginPath()
      out.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2)
      out.lineWidth = Math.max(2, (size / 36) * 2)
      out.strokeStyle = "#ffffff"
      out.stroke()
    }
    return out.getImageData(0, 0, width, height).data
  }

  try {
    // One palette for the whole loop, taken from a few frames (every other pixel of them), so colours do not flicker.
    const stride = Math.max(1, Math.floor(count / PALETTE_FRAMES))
    const picks = Array.from({ length: count }, (_, i) => i).filter((i) => i % stride === 0)
    const pixels = width * height
    const joined = new Uint8Array(picks.length * Math.ceil(pixels / 2) * 4)
    let at = 0
    const work = picks.length + count
    for (const [n, i] of picks.entries()) {
      const data = renderFrame(i)
      for (let p = 0; p < pixels; p += 2) {
        joined.set(data.subarray(p * 4, p * 4 + 4), at)
        at += 4
      }
      options.onProgress((n + 1) / work)
      await nextTask()
    }
    const palette = quantize(joined.subarray(0, at), 256)

    const gif = GIFEncoder()
    let written = 0
    for (let i = 0; i < count; i++) {
      // The delay is counted in hundredths of a second, each frame ending where it would at exactly the chosen speed.
      const hundredths = loop.still ? 100 : Math.round(((i + 1) * step) / 10) - Math.round((i * step) / 10)
      gif.writeFrame(applyPalette(renderFrame(i), palette), width, height, {
        palette: i === 0 ? palette : undefined,
        delay: Math.max(2, hundredths) * 10,
      })
      written++
      options.onProgress((picks.length + written) / work)
      await nextTask()
    }
    gif.finish()
    return new Blob([gif.bytes() as BlobPart], { type: "image/gif" })
  } finally {
    back?.dispose()
    front?.dispose()
  }
}
