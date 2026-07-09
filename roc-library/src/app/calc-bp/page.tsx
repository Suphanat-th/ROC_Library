"use client";

import React from "react";
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
    <div className="relative isolate w-full min-h-screen overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="pointer-events-none absolute inset-0 -z-20 bg-linear-to-br from-slate-50 via-cyan-50 to-blue-100" />
      <div className="pointer-events-none absolute -top-32 -left-20 -z-10 h-72 w-72 rounded-full bg-cyan-300/30 blur-3xl" />
      <div className="pointer-events-none absolute top-28 -right-16 -z-10 h-80 w-80 rounded-full bg-indigo-300/30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 -z-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

      <div className="mx-auto w-full max-w-7xl">
      {/* Header Card */}
      <div className="card mb-6 overflow-hidden border border-white/60 bg-linear-to-r from-sky-600 via-cyan-600 to-blue-700 text-white shadow-2xl shadow-blue-300/40">
        <div className="card-body relative p-6 sm:p-8">
          <div className="absolute -top-12 right-8 h-36 w-36 rounded-full border border-white/30 bg-white/15 blur-xl" />
          <div className="absolute -bottom-16 -left-8 h-40 w-40 rounded-full bg-cyan-300/30 blur-2xl" />

          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-cyan-100/90">ROC Library Utility</p>
          <h1 className="card-title text-3xl font-extrabold tracking-tight sm:text-5xl">
            ⚔️ Battle Pass Calculator SS
            {SEASON_CONFIG.seasonNumber ? `${SEASON_CONFIG.seasonNumber}` : ""}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cyan-50/95 sm:text-base">
            Plan your run with smarter projections for Daily and Weekly rewards, level goals, and total Zeny usage.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {isEventActive ? (
          <div>
            {/* Info Banner */}
            <div className="alert mb-6 border border-cyan-200/80 bg-white/80 shadow-lg backdrop-blur-md">
              <div className="flex items-start gap-3">
                <div className="mt-1 text-xl">ℹ️</div>
                <div>
                  <h3 className="text-base font-bold text-cyan-900 sm:text-lg">
                    Battle Pass Season{" "}
                    {SEASON_CONFIG.seasonNumber
                      ? `${SEASON_CONFIG.seasonNumber}`
                      : ""}{" "}
                    Information
                  </h3>
                  <div className="mt-2 space-y-1 text-sm text-cyan-900/90">
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
          <div className="card overflow-hidden border border-orange-200/80 bg-white/85 shadow-2xl shadow-orange-200/50 backdrop-blur-md">
            <div className="card-body relative py-12 text-center">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-200/40 blur-2xl" />
              <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-orange-700 sm:text-4xl">
                Battle Pass is Coming Soon
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                Battle Pass will be available between{" "}
                <strong>{formatDate(SEASON_CONFIG.eventStartDate)}</strong> and{" "}
                <strong>{formatDate(SEASON_CONFIG.eventEndDate)}</strong>
              </p>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
