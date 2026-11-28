"use client";
import { createContext, useContext } from "react";

export const LOGO_SRC = "/assets/images/GuildImage/dog.jpg";

/**
 * Item card banners, top to bottom. Edited by hand: a new banner goes above the
 * ad-space picture, which always stays last.
 */
export const BANNERS: readonly { src: string; alt: string }[] = [
  { src: "/assets/images/PatchTemplate/vip1039.webp", alt: "VIP 1039 — Sudrich การบิน" },
  { src: "/assets/images/PatchTemplate/vip30000.webp", alt: "VIP 30000 — ตีบินมังกร 50 ตัว World Quest" },
  { src: "/assets/images/PatchTemplate/wantad.png", alt: "พื้นที่สำหรับโฆษณา" },
];

/** Original image URL -> data URL. Empty on screen; filled for the export copy. */
type InlineMap = Record<string, string>;

const InlineImageContext = createContext<InlineMap>({});

export const InlineImageProvider = InlineImageContext.Provider;

/**
 * The URL an <img> should use. Inside an export copy the picture is already
 * embedded, so iOS Safari never has to fetch it while the PNG is being drawn.
 */
export const useInlineSrc = (src: string) => useContext(InlineImageContext)[src] ?? src;

const cache = new Map<string, Promise<string>>();

function fetchDataUrl(src: string): Promise<string> {
  let pending = cache.get(src);
  if (!pending) {
    pending = fetch(src)
      .then((res) => {
        if (!res.ok) throw new Error(`image ${src} failed`);
        return res.blob();
      })
      .then(
        (blob) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(blob);
          }),
      );
    // A failed fetch must not be remembered, so the next press tries again.
    pending.catch(() => cache.delete(src));
    cache.set(src, pending);
  }
  return pending;
}

/**
 * Embeds the logo, the banners and the item picture (the logo stands in if it is missing).
 * A banner that cannot be fetched is left out, so the download still goes ahead.
 * A card's picture is its Card illustration, passed as `illustration`.
 */
export async function loadInlineImages(
  patchKey: string,
  illustration?: string,
): Promise<InlineMap> {
  const itemSrc = illustration ?? `/assets/images/PatchImage/${patchKey}.bmp`;
  const [logo, item, ...banners] = await Promise.all([
    fetchDataUrl(LOGO_SRC),
    fetchDataUrl(itemSrc).catch(() => fetchDataUrl(LOGO_SRC)),
    ...BANNERS.map(({ src }) => fetchDataUrl(src).catch(() => undefined)),
  ]);
  const map: InlineMap = { [LOGO_SRC]: logo, [itemSrc]: item };
  BANNERS.forEach(({ src }, i) => {
    const dataUrl = banners[i];
    if (dataUrl) map[src] = dataUrl;
  });
  return map;
}
