"use client";

import React from "react";
import { ArrowUpRight, CalendarDays, Clock3, Sparkles } from "lucide-react";
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
    <main className="relative isolate min-h-screen w-full overflow-hidden bg-slate-950 px-4 py-5 sm:px-6 sm:py-8 lg:px-10">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.2),transparent_34%),radial-gradient(circle_at_15%_20%,rgba(30,64,175,0.16),transparent_28%),linear-gradient(145deg,#020617_0%,#0f172a_55%,#0f2d5c_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-blue-300/70 to-transparent" />

      <div className="mx-auto w-full max-w-7xl">
        <section className="mb-7 overflow-hidden rounded-3xl border border-white/10 bg-white/6 shadow-2xl shadow-black/30 backdrop-blur-xl">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-end lg:p-10">
            <div>
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="badge badge-sm border-0 bg-blue-300/15 px-3 py-3 text-blue-200">ROC LIBRARY</span>
                <span className="badge badge-sm gap-1 border-0 bg-blue-300/15 px-3 py-3 text-blue-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                  {isEventActive ? "LIVE SEASON" : "SEASON CLOSED"}
                </span>
              </div>
              <h1 className="max-w-3xl text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                Battle Pass
                <span className="block text-blue-300">Calculator{SEASON_CONFIG.seasonNumber ? ` SS${SEASON_CONFIG.seasonNumber}` : ""}</span>
              </h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                วางแผนแต้ม Daily และ Weekly, เช็ก Level เป้าหมาย และประเมินค่าใช้จ่าย Zeny ได้ในมุมมองเดียว
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:min-w-72">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <CalendarDays className="mb-3 h-5 w-5 text-blue-300" />
                <p className="text-xs uppercase tracking-wider text-slate-400">Start date</p>
                <p className="mt-1 text-sm font-bold text-white">{formatDate(SEASON_CONFIG.eventStartDate)}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                <Clock3 className="mb-3 h-5 w-5 text-blue-300" />
                <p className="text-xs uppercase tracking-wider text-slate-400">End date</p>
                <p className="mt-1 text-sm font-bold text-white">{formatDate(SEASON_CONFIG.eventEndDate)}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/10 bg-black/10 px-6 py-4 text-sm text-slate-300 sm:px-10">
            <span className="inline-flex items-center gap-2"><Sparkles className="h-4 w-4 text-blue-300" /> Daily + Weekly projection</span>
            <span className="inline-flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-blue-300" /> Goal-based level planning</span>
          </div>
        </section>

        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">Command center</p>
            <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">Your season plan</h2>
          </div>
          <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-400 sm:block">All calculations update live</div>
        </div>

        <div className="flex-1">
        {isEventActive ? (
          <div>
            <div className="alert mb-6 border border-blue-300/20 bg-blue-300/10 text-blue-50 shadow-lg backdrop-blur-md">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 h-5 w-5 shrink-0 text-blue-300" />
                <div>
                  <h3 className="text-base font-bold text-blue-100 sm:text-lg">
                    Battle Pass Season{" "}
                    {SEASON_CONFIG.seasonNumber
                      ? `${SEASON_CONFIG.seasonNumber}`
                      : ""}{" "}
                    Information
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-slate-300">
                    <p>
                      • Event starts:{" "}
                      <strong>
                        {formatDate(SEASON_CONFIG.eventStartDate)}
                      </strong>
                    </p>
                    <p>
                      • Event ends:{" "}
                      <strong>{formatDate(SEASON_CONFIG.eventEndDate)}</strong>
                    </p>
                    <p>
                      • Get Battle Pass Invitation through Rodex (1 per account)
                    </p>
                    <p>
                      • Talk to NPC Merde (Prontera 147, 301) to start Battle
                      Pass
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <CalcBPComponent />
          </div>
        ) : (
            <div className="card overflow-hidden border border-blue-300/20 bg-white/6 text-slate-200 shadow-2xl backdrop-blur-xl">
            <div className="card-body relative py-16 text-center">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-300/20 blur-3xl" />
              <Clock3 className="mx-auto mb-4 h-10 w-10 text-blue-300" />
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-blue-200 sm:text-4xl">
                Battle Pass is Coming Soon
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Battle Pass will be available between{" "}
                <strong className="text-blue-200">{formatDate(SEASON_CONFIG.eventStartDate)}</strong> and{" "}
                <strong className="text-blue-200">{formatDate(SEASON_CONFIG.eventEndDate)}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </main>
  );
}
