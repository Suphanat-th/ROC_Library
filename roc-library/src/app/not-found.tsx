import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "ไม่พบหน้านี้",
  robots: { index: false, follow: false },
};

/** The tools players open most, so a wrong link still leads somewhere useful. */
const POPULAR = [
  { href: "/mvp", name: "MVP Hunter", note: "เวลาเกิดบอสและเส้นทาง" },
  { href: "/aspd-calc", name: "The Flash Calc", note: "คำนวณ ASPD" },
  { href: "/monsterx3", name: "Monster x3", note: "มอนสเตอร์ EXP x3" },
  { href: "/endless-tower", name: "Endless Tower", note: "ข้อมูลแต่ละชั้น" },
  { href: "/random-scroll", name: "Random Scroll", note: "ลองสุ่ม Scroll" },
  { href: "/calc-bp", name: "Battle Pass", note: "คำนวณ Battle Pass" },
] as const;

/** Shown for any address that is not a page. In the static build this becomes 404.html. */
export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-4rem)] w-full items-center bg-base-200 px-4 py-10 md:px-6">
      <div className="mx-auto w-full max-w-3xl">
        <section className="rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm sm:p-10">
          <div className="flex items-center justify-center gap-2 sm:gap-4" aria-hidden>
            <span className="select-none text-7xl font-bold leading-none text-primary sm:text-8xl">4</span>
            {/* The clock-covered mascot stands where the 0 would be, bobbing above its shadow. */}
            <div className="relative pb-4">
              <img
                src="/assets/images/web/not-found-clock.webp"
                alt=""
                width={144}
                height={144}
                className="not-found-bob h-24 w-24 object-contain sm:h-36 sm:w-36"
              />
              <span className="not-found-shadow absolute bottom-0 left-1/2 h-2 w-16 -translate-x-1/2 rounded-full bg-base-content opacity-25 sm:w-24" />
            </div>
            <span className="select-none text-7xl font-bold leading-none text-primary sm:text-8xl">4</span>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-base-content sm:text-3xl">ไม่พบหน้านี้</h1>
          <p className="mx-auto mt-2 max-w-md text-base-content/70">
            ลิงก์อาจพิมพ์ผิด หรือหน้านี้ถูกย้ายไปแล้ว ลองกลับหน้าแรก หรือเลือกเครื่องมือด้านล่าง
          </p>

          <Link href="/" className="btn btn-primary mt-6 gap-2">
            <Home aria-hidden className="h-4 w-4" />
            กลับหน้าแรก
          </Link>
        </section>

        <section className="mt-8" aria-labelledby="popular-title">
          <h2 id="popular-title" className="mb-3 text-sm font-semibold text-base-content/70">
            เครื่องมือที่เปิดบ่อย
          </h2>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {POPULAR.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="group flex h-full items-center justify-between gap-3 rounded-box border border-base-300 bg-base-100 p-4 transition-colors hover:border-primary"
                >
                  <span className="min-w-0">
                    <span className="block font-semibold text-base-content">{tool.name}</span>
                    <span className="block text-sm text-base-content/70">{tool.note}</span>
                  </span>
                  <ArrowRight
                    aria-hidden
                    className="h-4 w-4 shrink-0 text-base-content/40 transition-transform group-hover:translate-x-1 group-hover:text-primary"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
