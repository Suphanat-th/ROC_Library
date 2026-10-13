"use client";

import React from "react";
import { CalendarDays, Clock3, Sparkles } from "lucide-react";
import CalcBPComponent from "./CalcBPComponent";
import { SEASON_CONFIG } from "@/data/battlePassQuestData";
import { isWithinThaiDateRange } from "@/utils/timezoneUtils";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

export default function CalcBPPage() {
  const now = new Date();
  const isEventActive = isWithinThaiDateRange(
    now,
    SEASON_CONFIG.eventStartDate,
    SEASON_CONFIG.eventEndDate,
  );

  return (
    <main className="min-h-screen w-full bg-base-200 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <header className="mb-6 rounded-box border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-base-content sm:text-3xl">
              Battle Pass Calculator
              {SEASON_CONFIG.seasonNumber ? ` SS${SEASON_CONFIG.seasonNumber}` : ""}
            </h1>
            <span
              className={`badge ${isEventActive ? "badge-success" : "badge-ghost"}`}
            >
              {isEventActive ? "LIVE SEASON" : "SEASON CLOSED"}
            </span>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-base-content/70">
            วางแผนแต้ม Daily และ Weekly, เช็ก Level เป้าหมาย และประเมินค่าใช้จ่าย Zeny ได้ในมุมมองเดียว
          </p>
          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-t border-base-300 pt-4 text-sm">
            <div className="flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="h-4 w-4 text-primary" />
              <dt className="text-base-content/60">เริ่ม</dt>
              <dd className="font-semibold">{formatDate(SEASON_CONFIG.eventStartDate)}</dd>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 aria-hidden="true" className="h-4 w-4 text-primary" />
              <dt className="text-base-content/60">สิ้นสุด</dt>
              <dd className="font-semibold">{formatDate(SEASON_CONFIG.eventEndDate)}</dd>
            </div>
          </dl>
        </header>

        {isEventActive ? (
          <div className="space-y-6">
            <div role="note" className="alert alert-info alert-soft items-start">
              <Sparkles aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" />
              <ul className="list-disc space-y-1 pl-4 text-sm">
                <li>รับ Battle Pass Invitation ผ่าน Rodex (1 ต่อบัญชี)</li>
                <li>คุยกับ NPC Merde (Prontera 147, 301) เพื่อเริ่ม Battle Pass</li>
              </ul>
            </div>
            <CalcBPComponent />
          </div>
        ) : (
          <div className="card border border-base-300 bg-base-100 shadow-sm">
            <div className="card-body items-center py-16 text-center">
              <Clock3 aria-hidden="true" className="mb-2 h-10 w-10 text-primary" />
              <h2 className="text-2xl font-bold text-base-content sm:text-3xl">
                Battle Pass is Coming Soon
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-base-content/70 sm:text-base">
                Battle Pass will be available between{" "}
                <strong className="text-primary">{formatDate(SEASON_CONFIG.eventStartDate)}</strong> and{" "}
                <strong className="text-primary">{formatDate(SEASON_CONFIG.eventEndDate)}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
