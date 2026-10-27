"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import type { HomeSlide, SlideTone } from "@/types/homeSlide";
import { usePrizeImageUrl } from "@/components/ScrollRoller/PrizeImage";
import { TIER_STYLE } from "@/components/ScrollRoller/tierStyles";

/**
 * Each slide is a poster: its colours belong to the event and stay the same in light and dark,
 * like the Item card. `fg` is the text colour, `accent` the small details, and the button
 * swaps them so it stands out from the background.
 */
const TONES: Record<
  SlideTone,
  { bg: string; fg: string; accent: string; cta: string; ctaFg: string; glyph: string }
> = {
  anniversary: {
    bg: "linear-gradient(135deg, #fd6c01 0%, #f6a04a 45%, #f0d29c 100%)",
    fg: "#3a1400",
    accent: "#3a1400",
    cta: "#3a1400",
    ctaFg: "#f0d29c",
    glyph: "#f0d29c",
  },
  desert: {
    bg: "linear-gradient(135deg, #2b1405 0%, #7c3a08 55%, #d97706 100%)",
    fg: "#fff1d6",
    accent: "#fbbf24",
    cta: "#fbbf24",
    ctaFg: "#2b1405",
    glyph: "rgb(251 191 36 / 0.2)",
  },
  festa: {
    bg: "linear-gradient(135deg, #7f1d1d 0%, #be123c 50%, #f59e0b 100%)",
    fg: "#fff7ed",
    accent: "#fde68a",
    cta: "#fff7ed",
    ctaFg: "#7f1d1d",
    glyph: "transparent",
  },
  libra: {
    bg: "linear-gradient(135deg, #0b2447 0%, #0e5a8a 55%, #38bdf8 100%)",
    fg: "#f0f9ff",
    accent: "#bae6fd",
    cta: "#f0f9ff",
    ctaFg: "#0b2447",
    glyph: "transparent",
  },
};

const PARTY = "/assets/images/anvs/landing";

/** The site's own drawings from the 5th Anniversary page, scattered like confetti. */
const PARTY_PIECES = [
  { src: "party-hat", className: "left-[18%] top-[6%] w-[20%]" },
  { src: "balloon", className: "left-[42%] top-[2%] w-[36%] roc-float" },
  { src: "coin", className: "left-[2%] top-[34%] w-[16%]" },
  { src: "gift", className: "left-[8%] bottom-[6%] w-[34%] roc-float" },
  { src: "star", className: "left-[54%] bottom-[4%] w-[12%]" },
  { src: "ticket", className: "right-[2%] bottom-[14%] w-[34%]" },
];

function PartyArt() {
  return (
    <div aria-hidden="true" className="relative h-full w-full">
      {PARTY_PIECES.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={p.src}
          src={`${PARTY}/${p.src}.svg`}
          alt=""
          className={`absolute h-auto drop-shadow-lg ${p.className}`}
        />
      ))}
    </div>
  );
}

function MonsterArt({ images }: { images: { src: string; alt: string }[] }) {
  // The strongest stands in the middle.
  const [first, second, third] = images;
  const row = [second, first, third].filter(Boolean);

  return (
    <div className="relative flex h-full w-full items-end justify-center gap-1 pb-8 sm:pb-12">
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 h-8 w-[88%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-md sm:bottom-10"
      />
      {row.map((m) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={m.src}
          src={m.src}
          alt={m.alt}
          className={`relative h-auto w-auto max-w-[34%] object-contain drop-shadow-xl ${
            m === first
              ? "max-h-[62%] sm:max-h-[72%]"
              : "max-h-[44%] sm:max-h-[54%] max-lg:hidden"
          }`}
        />
      ))}
    </div>
  );
}

function ReelCell({
  src,
  tier,
  name,
  rare,
  lgOnly,
}: {
  src: string;
  tier: keyof typeof TIER_STYLE;
  name: string;
  rare: boolean;
  lgOnly: boolean;
}) {
  const url = usePrizeImageUrl(src);
  // A Prize without a picture file is left out rather than shown as an empty box.
  if (url === "") return null;

  return (
    <div
      title={name}
      className={`flex shrink-0 items-center justify-center rounded-lg border-b-4 bg-white/95 shadow-lg ${
        TIER_STYLE[tier].border
      } ${rare ? "h-28 w-20 scale-110 ring-2 ring-white sm:h-36 sm:w-24 lg:h-44 lg:w-32" : "h-24 w-16 sm:h-28 sm:w-20 lg:h-36 lg:w-24"} ${
        lgOnly ? "max-lg:hidden" : ""
      }`}
    >
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={name}
          className="max-h-[80%] max-w-[80%] object-contain"
        />
      )}
    </div>
  );
}

function ReelArt({
  prizes,
}: {
  prizes: { src: string; tier: keyof typeof TIER_STYLE; name: string }[];
}) {
  // Rarest first in the list; the rarest goes in the middle and the ends only show on wide screens.
  const [r1, r2, r3, r4, r5] = prizes;
  const cells = [
    { p: r4, lgOnly: true },
    { p: r2, lgOnly: false },
    { p: r1, lgOnly: false },
    { p: r3, lgOnly: false },
    { p: r5, lgOnly: true },
  ].filter((c) => c.p);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex -rotate-[5deg] items-center gap-2 sm:gap-3">
        {cells.map(({ p, lgOnly }) => (
          <ReelCell
            key={p.src}
            src={p.src}
            tier={p.tier}
            name={p.name}
            rare={p === r1}
            lgOnly={lgOnly}
          />
        ))}
      </div>
    </div>
  );
}

function Slide({ slide }: { slide: HomeSlide }) {
  const tone = TONES[slide.tone];

  return (
    <Link
      href={slide.href}
      className="group relative isolate flex h-[300px] w-full overflow-hidden sm:h-[360px] lg:h-[400px]"
      style={{ background: tone.bg, color: tone.fg }}
    >
      {/* Soft dots, the same confetti texture as the anniversary poster */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgb(255 255 255 / 0.35) 2px, transparent 2.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="relative z-10 flex h-full w-[70%] flex-col justify-center gap-2 px-5 sm:w-[56%] sm:gap-3 sm:pl-16 sm:pr-4 lg:pl-20">
        <p className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] sm:text-xs">
          <span
            aria-hidden="true"
            className="h-0.5 w-6 rounded-full"
            style={{ background: tone.accent }}
          />
          {slide.kicker}
        </p>
        <h2 className="text-balance text-2xl font-extrabold leading-[1.1] sm:text-4xl lg:text-5xl">
          {slide.title}
        </h2>
        <p className="line-clamp-3 max-w-prose text-sm opacity-90 sm:text-base">
          {slide.description}
        </p>
        {slide.meta && (
          <p className="text-xs opacity-80 sm:text-sm">{slide.meta}</p>
        )}
        <span
          className="mt-1 inline-flex min-h-11 items-center gap-2 self-start rounded-full px-5 text-sm font-bold shadow-md transition-transform group-hover:-translate-y-0.5"
          style={{ background: tone.cta, color: tone.ctaFg }}
        >
          {slide.cta}
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>

      <div className="absolute inset-y-0 right-0 w-[46%] sm:w-[44%]">
        {slide.glyph && (
          <span
            aria-hidden="true"
            className="absolute right-[4%] top-1/2 -translate-y-1/2 select-none text-[12rem] font-black leading-none sm:text-[18rem] lg:text-[22rem]"
            style={{
              color: tone.glyph,
              ...(slide.tone === "anniversary"
                ? {
                    WebkitTextStroke: "3px #3a1400",
                    paintOrder: "stroke fill",
                    textShadow: "6px 6px 0 #3a1400",
                  }
                : {}),
            }}
          >
            {slide.glyph}
          </span>
        )}
        <div className="absolute inset-0">
          {slide.art.kind === "party" && <PartyArt />}
          {slide.art.kind === "monsters" && (
            <MonsterArt images={slide.art.images} />
          )}
          {slide.art.kind === "reel" && <ReelArt prizes={slide.art.prizes} />}
        </div>
      </div>
    </Link>
  );
}

/** The banners at the top of the home page. They loop on their own, and pause under the pointer. */
export default function HomeSlider({ slides }: { slides: HomeSlide[] }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Autoplay]}
      navigation
      pagination={{ clickable: true }}
      autoplay={{ delay: 6000, pauseOnMouseEnter: true, disableOnInteraction: false }}
      loop={slides.length > 1}
      style={
        {
          "--swiper-navigation-color": "#ffffff",
          "--swiper-navigation-size": "26px",
          "--swiper-pagination-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-opacity": "0.5",
        } as CSSProperties
      }
      className="w-full overflow-hidden rounded-box border border-base-300 [&_.swiper-button-next]:max-sm:hidden [&_.swiper-button-prev]:max-sm:hidden"
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <Slide slide={slide} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
