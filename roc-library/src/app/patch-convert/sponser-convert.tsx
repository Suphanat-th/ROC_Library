"use client"; // 🔹 บังคับให้เป็น Client Component

import { useState } from "react";
import { BANNERS, useInlineSrc } from "./inlineImages";

/** One Item card banner. One that fails to load is hidden, not swapped for the logo. */
function Banner({ src, alt }: { src: string; alt: string }) {
  const bannerSrc = useInlineSrc(src);
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      className="w-full"
      src={bannerSrc}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

export default function SponserConvert() {
  return (
    <div className="flex w-full flex-col gap-3">
      {BANNERS.map((banner) => (
        <Banner key={banner.src} {...banner} />
      ))}
    </div>
  );
}
