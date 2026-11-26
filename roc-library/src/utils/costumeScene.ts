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

/** Longest a GIF runs before it loops. */
const GIF_MAX_MS = 6000
const GIF_FRAME_MS = 40
/** The picture of a GIF is this wide (the stage's height follows), so the file stays a sensible size. */
const GIF_WIDTH = 420
const GIF_LOGO_SIZE = 36
const GIF_LOGO_MARGIN = 8

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a)

/**
 * How long one loop of the scene is, and how long to run before it so the ground is already full of steps: the
 * shortest time the walk cycle, the effects and the headgear's own animation all repeat together; past the limit, the
 * longest of them rounded to whole walk cycles. `still` when nothing moves.
 */
export function gifLoop(scene: Scene) {
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
  if (loopMs > GIF_MAX_MS || periods.length === 0) {
    loopMs = Math.max(...periods, cycle, 1)
    if (cycle > 0) {
      loopMs = Math.ceil(loopMs / cycle) * cycle
      if (loopMs > GIF_MAX_MS) loopMs = Math.max(cycle, Math.floor(GIF_MAX_MS / cycle) * cycle)
    } else {
      loopMs = Math.min(loopMs, GIF_MAX_MS)
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
 * name) as a GIF with the site's logo in a corner. A scene where nothing moves gives a one-frame picture.
 */
export async function exportCostumeGif(
  scene: Scene,
  options: {
    stageColor: string
    background: HTMLImageElement | null
    logoUrl: string
    onProgress: (done: number) => void
  },
): Promise<Blob> {
  const loop = gifLoop(scene)
  const width = GIF_WIDTH
  const height = Math.round((GIF_WIDTH * STAGE_HEIGHT) / STAGE_WIDTH)

  const make = () => {
    const canvas = document.createElement("canvas")
    canvas.width = STAGE_WIDTH
    canvas.height = STAGE_HEIGHT
    return canvas
  }
  const characterCanvas = make()
  const backCanvas = make()
  const frontCanvas = make()
  const composite = document.createElement("canvas")
  composite.width = width
  composite.height = height
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

  try {
    const count = loop.still ? 1 : Math.max(1, Math.round(loop.loopMs / GIF_FRAME_MS))
    const frames: Uint8ClampedArray[] = []
    for (let i = 0; i < count; i++) {
      paintScene(scene, ctx, hasFront ? front : null, hasBack ? back : null, loop.warmupMs + i * GIF_FRAME_MS)
      // The WebGL canvases are copied in the same task they were drawn in, before they are cleared.
      out.fillStyle = options.stageColor
      out.fillRect(0, 0, width, height)
      if (options.background) drawCover(out, options.background, width, height)
      if (hasBack) out.drawImage(backCanvas, 0, 0, width, height)
      out.drawImage(characterCanvas, 0, 0, width, height)
      if (hasFront) out.drawImage(frontCanvas, 0, 0, width, height)
      if (logoLoaded) {
        const size = GIF_LOGO_SIZE
        const x = GIF_LOGO_MARGIN
        const y = height - GIF_LOGO_MARGIN - size
        out.save()
        out.beginPath()
        out.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
        out.clip()
        out.drawImage(logo, x, y, size, size)
        out.restore()
        out.beginPath()
        out.arc(x + size / 2, y + size / 2, size / 2 - 1, 0, Math.PI * 2)
        out.lineWidth = 2
        out.strokeStyle = "#ffffff"
        out.stroke()
      }
      frames.push(out.getImageData(0, 0, width, height).data)
      options.onProgress((i + 1) / count)
      await nextTask()
    }

    // One palette for the whole loop, taken from every few frames, so colours do not flicker.
    const stride = Math.max(1, Math.floor(frames.length / 8))
    const sample = frames.filter((_, i) => i % stride === 0)
    const joined = new Uint8Array(sample.reduce((n, f) => n + f.length, 0))
    sample.reduce((at, f) => (joined.set(f, at), at + f.length), 0)
    const palette = quantize(joined, 256)

    const gif = GIFEncoder()
    frames.forEach((data, i) => {
      gif.writeFrame(applyPalette(data, palette), width, height, {
        palette: i === 0 ? palette : undefined,
        delay: loop.still ? 1000 : GIF_FRAME_MS,
      })
    })
    gif.finish()
    return new Blob([gif.bytes() as BlobPart], { type: "image/gif" })
  } finally {
    back?.dispose()
    front?.dispose()
  }
}
