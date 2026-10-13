"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Copy, Heart } from "lucide-react";
import payme from "../../../public/assets/images/web/Payme-crop.png";

const ACCOUNT_NUMBER = "019-1-78881-8";
const ACCOUNT_NAME = "นาย สุภณัฐ ธนวรพัฒน์";
const BANK_NAME = "ธนาคารกสิกรไทย (KBank)";

// Faint grid lines drawn from the theme text colour so they follow light/dark.
const gridLine = "color-mix(in oklab, var(--color-base-content) 7%, transparent)";
const gridBackground = {
  backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
  backgroundSize: "32px 32px",
};

type CopyState = "idle" | "done" | "failed";

export default function DonatePage() {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER.replaceAll("-", ""));
      setCopyState("done");
    } catch {
      setCopyState("failed");
    }
    setTimeout(() => setCopyState("idle"), 2500);
  };

  return (
    <main
      className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-base-200 px-4 py-8 md:px-6 md:py-12"
      style={gridBackground}
    >
      {/* Soft glow behind the card; decorative only */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl">
        <section
          aria-labelledby="donate-heading"
          className="overflow-hidden rounded-box border border-base-300 bg-base-100 shadow-lg"
        >
          <div className="grid md:grid-cols-2">
            <div className="flex flex-col gap-6 p-6 sm:p-8">
              <div>
                <p className="mb-3 inline-flex items-center gap-1.5 rounded-field bg-primary/10 px-2 py-1 font-mono text-xs font-bold tracking-widest text-primary">
                  <Heart aria-hidden="true" className="h-3.5 w-3.5" />
                  DONATE
                </p>
                <h1
                  id="donate-heading"
                  className="text-2xl font-bold text-base-content sm:text-3xl"
                >
                  สนับสนุนผู้พัฒนา
                </h1>
                <p className="mt-2 text-base-content/80">
                  ขอบคุณผู้ร่วมสนับสนุนทุกท่านที่ช่วยให้ ROC Library ไปต่อได้
                </p>
              </div>

              <dl className="divide-y divide-base-300 border-y border-base-300">
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-base-content/70">ธนาคาร</dt>
                  <dd className="text-right font-semibold">{BANK_NAME}</dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 py-3">
                  <dt className="text-sm text-base-content/70">ชื่อบัญชี</dt>
                  <dd className="text-right font-semibold">{ACCOUNT_NAME}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="text-sm text-base-content/70">เลขบัญชี</dt>
                  <dd className="font-mono text-xl font-bold tabular-nums">
                    {ACCOUNT_NUMBER}
                  </dd>
                </div>
              </dl>

              <div>
                <button
                  type="button"
                  onClick={copyAccount}
                  className="btn btn-primary w-full gap-2 sm:w-auto"
                >
                  {copyState === "done" ? (
                    <Check aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Copy aria-hidden="true" className="h-4 w-4" />
                  )}
                  คัดลอกเลขบัญชี
                </button>
                <p
                  role="status"
                  className="mt-2 min-h-5 text-sm text-base-content/70"
                >
                  {copyState === "done" && "คัดลอกเลขบัญชีแล้ว"}
                  {copyState === "failed" &&
                    "คัดลอกไม่สำเร็จ กรุณาจดเลขบัญชีด้านบนแทน"}
                </p>
              </div>
            </div>

            <div className="border-t border-base-300 bg-base-200 p-4 sm:p-6 md:border-l md:border-t-0">
              <Image
                src={payme}
                alt={`QR โอนเงิน ${BANK_NAME} เลขบัญชี ${ACCOUNT_NUMBER} ชื่อบัญชี ${ACCOUNT_NAME}`}
                className="h-auto w-full rounded-field shadow-md"
                priority
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
