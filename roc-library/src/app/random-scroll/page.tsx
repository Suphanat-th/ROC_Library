import { Suspense } from "react";
import { devToolsEnabled } from "@/data/commentDraw";
import { loadScrolls } from "@/data/scroll";
import ScrollFromUrl from "./ScrollFromUrl";

/** The Scroll list is read when the site is built; the chosen Scroll comes from the address in the browser. */
export default async function RandomScrollPage() {
  const scrolls = await loadScrolls();
  return (
    <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}>
      <ScrollFromUrl scrolls={scrolls} devLink={devToolsEnabled} />
    </Suspense>
  );
}
