"use client";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "framer-motion";
import { ANNIVERSARY_INFO_SECTIONS } from "@/data/anniversary5thInfo";
import FloatingArt from "./FloatingArt";

const LINKS = [
  ...ANNIVERSARY_INFO_SECTIONS.map((s) => ({ href: `#${s.id}`, label: s.title })),
  { href: "#rewards", label: "Rewards" },
];

/** Poster header of the page: the title, links to each section and the Floating art. */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const rise = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: 0.1 + i * 0.12, duration: 0.5, ease: "easeOut" as const },
        };

  return (
    <header
      ref={ref}
      className="anvs-hero anvs-dots relative overflow-hidden rounded-3xl px-6 py-10 shadow-lg sm:px-10 sm:py-14"
    >
      <div aria-hidden className="anvs-rays" />
      <div className="relative grid items-center gap-8 lg:grid-cols-[1.05fr_1fr]">
        <div className="space-y-5">
          <motion.p {...rise(0)} className="text-sm font-bold uppercase tracking-widest">
            Ragnarok Online Classic
          </motion.p>
          <motion.h1 {...rise(1)} aria-label="Anniversary 5TH" className="leading-none">
            <span aria-hidden className="block text-3xl font-black uppercase tracking-wide sm:text-4xl">
              Anniversary
            </span>
            <span aria-hidden className="flex items-end gap-2">
              <span className="anvs-glyph text-[8rem] font-black leading-[0.9] sm:text-[11rem]">5</span>
              <span className="mb-3 text-4xl font-black sm:mb-5 sm:text-6xl">TH</span>
            </span>
          </motion.h1>
          <motion.p {...rise(2)} className="text-lg font-semibold">
            ข้อมูลกิจกรรมฉลองครบรอบ 5 ปี
          </motion.p>
          <motion.nav {...rise(3)} aria-label="ไปยังหัวข้อ" className="flex flex-wrap gap-2 pt-1">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full border-2 border-(--anv-hero-fg) px-4 py-1.5 text-sm font-bold transition-colors hover:bg-(--anv-hero-fg) hover:text-(--anv-hero-solid) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--anv-hero-fg)"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        </div>
        <FloatingArt progress={scrollYProgress} />
      </div>
    </header>
  );
}
