"""
Cuts the light of five Costume effects the game draws with its own code (Electric, Crimson Wave, Blue Aura, Pink Glow, Twinkle) out of the
game's own GIFs of them, as sprite sheets for the Costume simulator (src/utils/proceduralEffect.ts):
public/assets/images/costume/{electric,crimson,blueaura,pinkglow,twinkle}.png.

    py scripts/make-effect-sheets.py <folder holding the five GIFs>

    GIF-2-3-2021-4-46-16-PM.gif   Electric      https://img.gnjoy.in.th/2021/02/GIF-2-3-2021-4-46-16-PM.gif
    blueaura.gif                  Blue Aura     https://img.gnjoy.in.th/2021/03/E17ED22E-8CEB-4170-8034-2D2538A79433.gif
    pinkglow.gif                  Pink Glow     https://img.gnjoy.in.th/2021/03/DAE642AB-A856-455C-A345-800DA271D362.gif
    twinkle.gif                   Twinkle       https://ro.gnjoy.asia/assets/filemanager/source/Malangdo%20costumes/13%20Oct%202022/twinkle%20effect.gif
    crimson.gif                   Crimson Wave  https://ro.gnjoy.asia/assets/filemanager/source/In-Game%20Events/Celebration%20Of%20PH%20Independence/Crimson%20Wave.gif

Each GIF is a still scene where only the effect (and the sprites' idle movement) changes, so what a frame adds to the empty scene
is the effect's light: the empty scene is the median of all frames. An effect has its own colour (violet, red, magenta; Twinkle's glitter is white, and only it is lit on the whole picture) and the sprites do
not, which keeps only the effect. Each pixel is stored as its colour with the brightness in alpha, to be added onto the stage.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageSequence

OUT = os.path.join(os.path.dirname(__file__), "..", "public/assets/images/costume")
COLUMNS = 8


def load(path):
    return np.stack([np.asarray(f.convert("RGB")).astype(np.int16) for f in ImageSequence.Iterator(Image.open(path))])


def dominance(added, colour):
    r, g, b = added[..., 0], added[..., 1], added[..., 2]
    if colour == "violet":
        return np.clip(b - np.maximum(r, g), 0, 255), b > 25
    if colour == "magenta":
        return np.clip(np.minimum(r, b) - g, 0, 255), np.minimum(r, b) > 40
    if colour == "white":
        return added.max(axis=-1), added.max(axis=-1) > 40
    if colour == "red":
        return np.clip(r - np.maximum(g, b) * 0.6, 0, 255), r > 25
    return np.clip(g - np.maximum(r, b) * 0.8, 0, 255), g > 20  # green


def sheet(name, frames, scene, colour, feet, half, top, bottom, count, first=0, mirror=False, blanks=()):
    """`feet` is (x, y) of the character's feet in the GIF; the tiles reach `half` pixels to each side of them and from row `top`
    to `bottom`. `mirror`: only the left side is clean, so the right is the left one of another frame, mirrored.
    `blanks`: rectangles (x0, y0, x1, y1) to clear (HP bar)."""
    added = np.clip(frames - scene[None], 0, 255)
    strength, floor = dominance(added, colour)
    mask = np.clip((strength - 8) / 25.0, 0, 1) * floor
    if mirror:
        mask[:, :, feet[0] + 1 :] = 0
    for x0, y0, x1, y1 in blanks:
        mask[:, y0:y1, x0:x1] = 0
    mask[:, :top, :] = 0
    light = added * mask[..., None]

    width = half * 2 + 1  # the feet are in the middle column
    height = bottom - top
    x0 = feet[0] - half
    pad = max(0, -x0)
    padded = np.pad(light, ((0, 0), (0, 0), (pad, half), (0, 0)))
    cut = padded[first : first + count, top:bottom, x0 + pad : x0 + pad + width]
    n = len(cut)
    rows = (n + COLUMNS - 1) // COLUMNS
    out = np.zeros((height * rows, width * COLUMNS, 4), dtype=np.uint8)
    for i in range(n):
        tile = cut[i].astype(float)
        if mirror:
            # the right side is the left side of another frame, mirrored (the feet column is the middle one)
            tile[:, half:] = cut[(i + 17) % n][:, : half + 1][:, ::-1]
        alpha = np.clip(tile.max(axis=2), 0, 255)
        colour_rgb = np.where(alpha[..., None] > 0, tile / np.maximum(alpha[..., None], 1) * 255, 0)
        row, col = divmod(i, COLUMNS)
        out[row * height : (row + 1) * height, col * width : (col + 1) * width] = np.dstack([np.clip(colour_rgb, 0, 255), alpha]).astype(np.uint8)
    path = os.path.join(OUT, name + ".png")
    os.makedirs(OUT, exist_ok=True)
    Image.fromarray(out, "RGBA").save(path, optimize=True)
    print(f"{name}: {n} frames of {width}x{height}, feet at ({half}, {feet[1] - top}); {os.path.getsize(path) // 1024} KB")


folder = sys.argv[1]
electric = load(os.path.join(folder, "GIF-2-3-2021-4-46-16-PM.gif"))
electric_scene = np.median(electric, axis=0)

sheet("electric", electric, electric_scene, "violet", (427, 333), 100, 226, 378, 40, mirror=True, blanks=[(392, 343, 800, 357)])

crimson = load(os.path.join(folder, "crimson.gif"))
sheet("crimson", crimson, np.median(crimson, axis=0), "red", (94, 142), 70, 30, 186, 40, blanks=[(55, 152, 135, 165)])

for file, name, colour in [("blueaura.gif", "blueaura", "violet"), ("pinkglow.gif", "pinkglow", "magenta")]:
    still = load(os.path.join(folder, file))  # six or seven frames, five a second; the character stands at (341, 316)
    sheet(name, still, np.median(still, axis=0), colour, (341, 316), 140, 0, 340, len(still))

twinkle = load(os.path.join(folder, "twinkle.gif"))  # 36 frames, ten a second; the character stands at (81, 163), the glitter is above its head
sheet("twinkle", twinkle, np.median(twinkle, axis=0), "white", (81, 163), 50, 0, 110, len(twinkle))
