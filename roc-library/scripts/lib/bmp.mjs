/** The game's BMP pictures (minimaps, item icons). */

/** Decodes an uncompressed 8- or 24-bit BMP to RGBA, with the game's magenta made transparent. */
export function bmpToRgba(bmp) {
  const dataAt = bmp.readUInt32LE(10);
  const paletteAt = 14 + bmp.readUInt32LE(14);
  const width = bmp.readInt32LE(18);
  const rawHeight = bmp.readInt32LE(22);
  const height = Math.abs(rawHeight);
  const bpp = bmp.readUInt16LE(28);
  if (bpp !== 8 && bpp !== 24) throw new Error(`Unsupported BMP depth ${bpp}`);
  const stride = Math.ceil((width * bpp) / 32) * 4;
  const rgba = Buffer.alloc(width * height * 4);
  for (let y = 0; y < height; y++) {
    const row = dataAt + (rawHeight > 0 ? height - 1 - y : y) * stride;
    for (let x = 0; x < width; x++) {
      const at = bpp === 8 ? paletteAt + bmp[row + x] * 4 : row + x * 3;
      const [blue, green, red] = [bmp[at], bmp[at + 1], bmp[at + 2]];
      const magenta = red > 240 && blue > 240 && green < 16;
      rgba.set(magenta ? [0, 0, 0, 0] : [red, green, blue, 255], (y * width + x) * 4);
    }
  }
  return { rgba, width, height };
}
