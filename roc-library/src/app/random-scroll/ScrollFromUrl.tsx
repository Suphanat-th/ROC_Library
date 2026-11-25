"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ScrollRoller from "@/components/ScrollRoller";
import ScrollPicker from "@/components/ScrollRoller/ScrollPicker";
import type { ScrollDef } from "@/types/scroll";

/** Shows the Scroll named in the address (?scroll=<id>); an unknown or missing id falls back to the first Scroll. */
export default function ScrollFromUrl({ scrolls, devLink }: { scrolls: ScrollDef[]; devLink: boolean }) {
  const requested = useSearchParams().get("scroll");
  const current = scrolls.find((s) => s.id === requested) ?? scrolls[0];

  return (
    <>
      {devLink && (
        <div className="mx-auto w-full max-w-5xl px-4 pt-4 text-right">
          <Link className="btn btn-warning btn-xs" href="/random-scroll/facebook">
            [DEV] สุ่มจากคอมเมนต์ Facebook
          </Link>
        </div>
      )}
      <ScrollPicker scrolls={scrolls} currentId={current.id} />
      {/* The key remounts the roller, so a new Scroll starts with a clean history. */}
      <ScrollRoller key={current.id} title={current.title} prizes={current.prizes} />
    </>
  );
}
