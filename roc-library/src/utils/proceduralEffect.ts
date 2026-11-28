/**
 * Effects the game's client draws with its own code (its tables hold only a number for them, and the code is not in the
 * game's data). They are made here the same way: a StrEffect built in code, so the stage, the GIF and the caches treat
 * it like any .str effect. Each is a likeness: cut out of the game's own pictures of the effect (the GIFs of the game's
 * site, see scripts/make-effect-sheets.py), or drawn by code to look like those pictures, with the sizes and brightness
 * measured from them and the game's own pictures of the parts.
 */
import type { StrKey, StrLayer } from "@/types/visual"
import { pictureFromImage, StrEffect, StrPicture } from "@/utils/strEffect"

/** Direct3D blend factors: the picture's alpha, added onto the scene. */
const SRC_ALPHA = 5
const ONE = 2

/** The effect screen is 640×480 and the character's feet are at its centre (see strEffect.ts). */
const CENTRE_X = 320
const CENTRE_Y = 240

/** Where the sprite sheets are kept (written by scripts/make-effect-sheets.py). */
const SHEET_URL = "/assets/images/costume"

/** A key that sets every value: the picture `aniframe` of the layer, `halfWidth` and `halfHeight` big around (x, y) from the feet. */
function key(frame: number, x: number, y: number, halfWidth: number, halfHeight: number, aniframe: number, alpha: number): StrKey {
  return {
    frame,
    type: 0,
    offset: [CENTRE_X + x, CENTRE_Y + y],
    uv: [0, 0, 1, 1],
    xy: [-halfWidth, halfWidth, halfWidth, -halfWidth, -halfHeight, -halfHeight, halfHeight, halfHeight],
    aniframe,
    anitype: 0,
    delay: 0,
    angle: 0,
    color: [255, 255, 255, alpha],
    srcBlend: SRC_ALPHA,
    destBlend: ONE,
  }
}

function effectOf(fps: number, pictures: StrPicture[], keys: StrKey[]): StrEffect {
  const layer: StrLayer = { textures: ["drawn"], keys }
  return { str: { fps, frameCount: keys.length, layers: [layer] }, pictures: [pictures] }
}

/**
 * A picture made pixel by pixel from the light `shade` gives for each (x, y): the pixel keeps its colour and its brightness
 * becomes its alpha, so that the picture is added onto the stage as that light.
 */
async function shaded(width: number, height: number, shade: (x: number, y: number) => [number, number, number]): Promise<StrPicture> {
  const image = new ImageData(width, height)
  const px = image.data
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = shade(x, y)
      const top = Math.max(r, g, b)
      if (top < 1) continue
      const i = (y * width + x) * 4
      px[i] = (r / top) * 255
      px[i + 1] = (g / top) * 255
      px[i + 2] = (b / top) * 255
      px[i + 3] = Math.min(255, top)
    }
  }
  return pictureFromImage(image)
}

/** A repeatable stream of numbers from 0 to 1 for a seed, so an effect looks the same each time it is built. */
function random(seed: number) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ============ Effects cut out of the game's GIFs ============ */

/**
 * A sprite sheet made by scripts/make-effect-sheets.py: tiles of `width` × `height` in rows of 8, the light the effect adds
 * in each frame, with the feet in the middle column and `feetY` rows down. The tiles play in turn, `fps` a second. `scale` is how
 * much of the picture's size a tile is drawn at: the game's GIFs show the character bigger than its sprite, and the effect with it,
 * so a tile is made as small as the character is in its GIF is big (the sprite is 83 pixels high; Blue Aura and Pink Glow GIFs
 * show it 225 high, so 0.37).
 */
interface Sheet {
  file: string
  width: number
  height: number
  count: number
  feetY: number
  fps: number
  scale: number
}

const SHEETS: Record<string, Sheet> = {
  // Violet lightning zigzagging on both sides of the body.
  electric: { file: "electric.png", width: 201, height: 152, count: 40, feetY: 107, fps: 10, scale: 1 },
  // The same in crimson.
  crimson: { file: "crimson.png", width: 141, height: 156, count: 40, feetY: 112, fps: 10, scale: 1 },
  // Thin pale violet streaks bursting from the body, new ones every frame (five a second).
  blueaura: { file: "blueaura.png", width: 281, height: 340, count: 6, feetY: 316, fps: 5, scale: 0.37 },
  // Little pink orbs of light drifting round the body.
  pinkglow: { file: "pinkglow.png", width: 281, height: 340, count: 7, feetY: 316, fps: 5, scale: 0.37 },
  // Cross-shaped sparkles and glitter over the head, up and to the left.
  twinkle: { file: "twinkle.png", width: 101, height: 110, count: 36, feetY: 163, fps: 10, scale: 1 },
}
const SHEET_COLUMNS = 8

async function fromSheet(sheet: Sheet): Promise<StrEffect> {
  const url = `${SHEET_URL}/${sheet.file}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status} ${url}`)
  const bitmap = await createImageBitmap(await res.blob())
  const canvas = document.createElement("canvas")
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()
  const { width, height, count, feetY, scale } = sheet
  const pictures = await Promise.all(
    Array.from({ length: count }, (_, i) =>
      pictureFromImage(ctx.getImageData((i % SHEET_COLUMNS) * width, Math.floor(i / SHEET_COLUMNS) * height, width, height)),
    ),
  )
  // The middle of a tile sits (height / 2 - feetY) pixels from the feet, downwards, before it is made smaller.
  const keys = pictures.map((_, frame) =>
    key(frame, 0, (height / 2 - feetY) * scale, (width / 2) * scale, (height / 2) * scale, frame, 255),
  )
  return effectOf(sheet.fps, pictures, keys)
}

/* ============ Green Floor ============ */

/**
 * Green Floor: a bright green star of rays on the ground, under the feet. Drawn from what the game's GIF measures: the light
 * is strongest in a ring about 35 pixels from the feet (the ground is seen at a slant, so everything is 0.75 as tall) and
 * dies away by 100, in a lime green (a little more blue than red), and it breaks into some 26 rays of uneven width and length.
 * Every frame the rays flicker a little.
 */
async function greenFloor(): Promise<StrEffect> {
  const WIDTH = 221
  const HEIGHT = 180
  const FLAT = 0.75
  const FRAMES = 8
  // Green light (0-255) at a distance from the feet, averaged over the rays.
  const PROFILE: [number, number][] = [
    [0, 105],
    [15, 112],
    [30, 122],
    [38, 122],
    [48, 105],
    [58, 82],
    [68, 58],
    [78, 36],
    [88, 16],
    [100, 4],
    [112, 0],
  ]
  const along = (r: number) => {
    if (r >= PROFILE[PROFILE.length - 1][0]) return 0
    let i = 1
    while (PROFILE[i][0] < r) i++
    const [r0, v0] = PROFILE[i - 1]
    const [r1, v1] = PROFILE[i]
    return v0 + ((v1 - v0) * (r - r0)) / (r1 - r0)
  }

  const fixed = random(680)
  const rays = Array.from({ length: 26 }, (_, i) => ({
    angle: ((i + (fixed() - 0.5) * 0.6) / 26) * Math.PI * 2,
    width: 0.06 + fixed() * 0.08,
    bright: 0.55 + fixed() * 0.45,
    length: 0.82 + fixed() * 0.38,
  }))
  const pictures = await Promise.all(
    Array.from({ length: FRAMES }, (_, frame) => {
      const flicker = random(frame * 131 + 7)
      const now = rays.map((ray) => ({
        ...ray,
        bright: ray.bright * (0.8 + flicker() * 0.4),
        length: ray.length * (0.95 + flicker() * 0.1),
      }))
      return shaded(WIDTH, HEIGHT, (x, y) => {
        const dx = x - WIDTH / 2
        const dy = (y - HEIGHT / 2) / FLAT
        const r = Math.hypot(dx, dy)
        const angle = Math.atan2(dy, dx)
        let strength = 0
        let length = 0
        for (const ray of now) {
          let turn = Math.abs(angle - ray.angle)
          if (turn > Math.PI) turn = Math.PI * 2 - turn
          const near = Math.exp(-((turn / ray.width) ** 2)) * ray.bright
          strength += near
          length += near * ray.length
        }
        const reach = strength > 0.001 ? length / strength : 1
        // The rays all meet at the feet: there they are blended into an even glow.
        strength = 0.45 + (strength - 0.45) * Math.min(1, r / 25)
        // The average light is spread over the rays: a ray is about twice as bright as the average, the gaps between are dim.
        const light = along(r / reach) * (0.3 + 1.8 * Math.min(1, strength))
        return [light * 0.2, light, light * 0.38]
      })
    }),
  )
  const keys = pictures.map((_, frame) => key(frame, 0, 0, WIDTH / 2, HEIGHT / 2, frame, 255))
  return effectOf(8, pictures, keys)
}

const BUILDERS: Record<string, () => Promise<StrEffect>> = {
  electric: () => fromSheet(SHEETS.electric),
  crimson: () => fromSheet(SHEETS.crimson),
  greenfloor: greenFloor,
  blueaura: () => fromSheet(SHEETS.blueaura),
  pinkglow: () => fromSheet(SHEETS.pinkglow),
  twinkle: () => fromSheet(SHEETS.twinkle),
}

/** One effect of this file by name (an entry of CostumeIndex whose key is "proc"). */
export async function loadProceduralEffect(name: string): Promise<StrEffect> {
  const build = BUILDERS[name]
  if (!build) throw new Error(`No drawn effect named ${name}`)
  return build()
}
