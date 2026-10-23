/** Size of the Chapter map's drawing; the regions below are placed inside it. */
export const MAP_WIDTH = 1000;
export const MAP_HEIGHT = 690;

/** Colour of each region, in Chapter order: I II III over IV V VI. */
export const REGION_COLORS = ["#3b82f6", "#16a34a", "#eab308", "#ef4444", "#f97316", "#a855f7"];

const COLUMNS = 3;
const ROWS = 2;
/** grid lines the regions' corners sit on (before the hand-drawn wobble) */
const XS = [70, 357, 643, 930];
const YS = [70, 320, 570];

export interface Region {
  /** index in Chapter order: 0 is Chapter I */
  index: number;
  d: string;
  /** centre of the region, where its emblem sits */
  cx: number;
  cy: number;
}

type Point = [number, number];

/** Small deterministic random numbers, so the map looks the same on every load. */
function random(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A wobbling line from a to b; both neighbours of a shared border get the very same points. */
function wobble(a: Point, b: Point, seed: number, amplitude: number): Point[] {
  const next = random(seed);
  const steps = 7;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  const points: Point[] = [a];
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const offset = (next() * 2 - 1) * amplitude;
    points.push([a[0] + dx * t + nx * offset, a[1] + dy * t + ny * offset]);
  }
  points.push(b);
  return points;
}

/** Six regions that share their borders, in two rows of three: I II III over IV V VI. */
export function buildRegions(): Region[] {
  const corner = (i: number, j: number): Point => {
    const next = random(1000 + i * 10 + j);
    const outer = i === 0 || j === 0 || i === COLUMNS || j === ROWS;
    const spread = outer ? 30 : 20;
    return [XS[i] + (next() * 2 - 1) * spread, YS[j] + (next() * 2 - 1) * spread];
  };
  const corners = Array.from({ length: COLUMNS + 1 }, (_, i) =>
    Array.from({ length: ROWS + 1 }, (_, j) => corner(i, j)),
  );
  // horizontal border between corner (i, j) and (i + 1, j); vertical between (i, j) and (i, j + 1)
  const across = (i: number, j: number) =>
    wobble(corners[i][j], corners[i + 1][j], 2000 + i * 10 + j, j === 0 || j === ROWS ? 26 : 14);
  const down = (i: number, j: number) =>
    wobble(corners[i][j], corners[i][j + 1], 3000 + i * 10 + j, i === 0 || i === COLUMNS ? 26 : 14);

  const regions: Region[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLUMNS; c++) {
      const top = across(c, r);
      const right = down(c + 1, r);
      const bottom = across(c, r + 1).slice().reverse();
      const left = down(c, r).slice().reverse();
      const outline = [...top, ...right.slice(1), ...bottom.slice(1), ...left.slice(1, -1)];
      const d = `M${outline.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L")}Z`;
      const quad = [corners[c][r], corners[c + 1][r], corners[c + 1][r + 1], corners[c][r + 1]];
      regions.push({
        index: r * COLUMNS + c,
        d,
        cx: quad.reduce((s, p) => s + p[0], 0) / 4,
        cy: quad.reduce((s, p) => s + p[1], 0) / 4,
      });
    }
  }
  return regions;
}
