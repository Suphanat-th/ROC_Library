"use client";

import { useEffect, useState } from "react";

/**
 * Anything at least this light in every colour counts as background. Lower values start
 * to eat pale items such as the sealed envelope.
 */
const PALE = 238;

/**
 * Makes the plain background of a picture see-through. Game .bmp files and many .png files
 * have no transparency: they sit on white or near-white (older icons use magenta instead). Only light pixels that connect to the
 * picture's edge are cleared, so white inside an item (glass, stripes) stays. The lightest
 * pixels vanish and slightly darker ones fade, which keeps the soft edges of shadows.
 */
function clearBackground(px: Uint8ClampedArray, w: number, h: number) {
  const lightest = (i: number) => Math.min(px[i * 4], px[i * 4 + 1], px[i * 4 + 2]);
  const seen = new Uint8Array(w * h);
  const stack: number[] = [];
  const visit = (i: number) => {
    if (seen[i]) return;
    const magenta = px[i * 4] >= 250 && px[i * 4 + 1] <= 5 && px[i * 4 + 2] >= 250;
    if (!magenta && lightest(i) < PALE) return;
    seen[i] = 1;
    stack.push(i);
  };

  for (let x = 0; x < w; x++) {
    visit(x);
    visit((h - 1) * w + x);
  }
  for (let y = 0; y < h; y++) {
    visit(y * w);
    visit(y * w + w - 1);
  }

  while (stack.length > 0) {
    const i = stack.pop()!;
    const x = i % w;
    const y = (i - x) / w;
    const magenta = px[i * 4] >= 250 && px[i * 4 + 1] <= 5 && px[i * 4 + 2] >= 250;
    px[i * 4 + 3] = magenta
      ? 0
      : Math.round(Math.min(1, Math.max(0, (255 - lightest(i)) / (255 - PALE))) * 255);
    if (x > 0) visit(i - 1);
    if (x < w - 1) visit(i + 1);
    if (y > 0) visit(i - w);
    if (y < h - 1) visit(i + w);
  }
}

/**
 * Pictures that are already loaded, by address: the address to show ("" when it failed).
 * Every picture is redrawn once on a canvas with its background cleared, then reused everywhere.
 */
const resolved = new Map<string, string>();
const pending = new Map<string, Promise<string>>();

/** A picture that already has see-through corners has a real background removal; leave it alone. */
function cornersOpaque(px: Uint8ClampedArray, w: number, h: number) {
  return [0, w - 1, (h - 1) * w, h * w - 1].every((i) => px[i * 4 + 3] === 255);
}

const decode = (src: string) =>
  new Promise<string>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth) return resolve(src);

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(src);

      ctx.drawImage(img, 0, 0);
      const picture = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (!cornersOpaque(picture.data, canvas.width, canvas.height)) {
        return resolve(src);
      }
      clearBackground(picture.data, canvas.width, canvas.height);
      ctx.putImageData(picture, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = () => reject(new Error(src));
    img.src = src;
  });

function load(src: string): Promise<string> {
  const known = resolved.get(src);
  if (known !== undefined) return Promise.resolve(known);

  let request = pending.get(src);
  if (!request) {
    request = decode(src)
      .catch(() => "")
      .then((url) => {
        resolved.set(src, url);
        return url;
      });
    pending.set(src, request);
  }
  return request;
}

/** Starts loading every picture of a Scroll so the first Roll does not show empty cells. */
export function preloadPrizeImages(prizes: { image: string }[]) {
  prizes.forEach((p) => void load(p.image));
}

/**
 * The address to draw for a picture: undefined while it loads, "" when the file is missing,
 * otherwise the picture with its background cleared.
 */
export function usePrizeImageUrl(src: string): string | undefined {
  const [state, setState] = useState<{ src: string; url?: string }>(() => ({
    src,
    url: resolved.get(src),
  }));

  useEffect(() => {
    let cancelled = false;
    load(src).then((url) => {
      if (!cancelled) setState({ src, url });
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  return state.src === src ? state.url : undefined;
}

interface Props {
  src: string;
  /** Width and height in px. */
  size: number;
  className?: string;
}

/** An item picture with its plain background removed, or a "?" box when the file is missing. */
export default function PrizeImage({ src, size, className = "" }: Props) {
  const url = usePrizeImageUrl(src);
  const box = { width: size, height: size };

  if (url === "") {
    return (
      <span
        role="img"
        aria-label="ไม่มีรูป"
        style={box}
        className={`grid shrink-0 place-items-center rounded-md border border-dashed border-base-300 bg-base-200 text-base-content/40 ${className}`}
      >
        ?
      </span>
    );
  }

  if (url === undefined) {
    return <span aria-hidden="true" style={box} className={`shrink-0 ${className}`} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      width={size}
      height={size}
      style={box}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
