"use client";

import type { MemorialDungeonGuide } from "@/types/memorialDungeon";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-box bg-base-100 p-3 shadow">
      <dt className="text-xs text-base-content/70">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}

/** Guide beside a dungeon's Map viewer: how to enter, the route, the monsters and the rewards. */
export default function DungeonGuide({ guide }: { guide: MemorialDungeonGuide }) {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 pb-8">
      <section aria-labelledby="dg-entry" className="space-y-3">
        <h2 id="dg-entry" className="text-xl font-bold">
          เข้าดัน
        </h2>
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <Fact label="NPC ทางเข้า" value={`${guide.entry.npc} (${guide.entry.location})`} />
          <Fact label="เลเวลขั้นต่ำ" value={String(guide.minLevel)} />
          <Fact label="ผู้เล่นขั้นต่ำ" value={`${guide.minPartySize} คน`} />
          <Fact label="เวลาจำกัด" value={`${guide.timeLimitMinutes} นาที`} />
          <Fact label="รีเซ็ตทุกวัน" value={`${guide.resetTime} น.`} />
        </dl>
      </section>

      <section aria-labelledby="dg-route" className="space-y-3">
        <h2 id="dg-route" className="text-xl font-bold">
          เส้นทาง
        </h2>
        <ol className="space-y-2">
          {guide.route.map((step, i) => (
            <li key={step} className="flex gap-3 rounded-box bg-base-100 p-3 shadow">
              <span aria-hidden className="w-6 shrink-0 text-xl font-black text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="dg-monsters" className="space-y-3">
        <h2 id="dg-monsters" className="text-xl font-bold">
          มอนสเตอร์
        </h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {guide.monsters.map((m) => (
            <li
              key={m.id}
              className="flex flex-col items-center gap-2 rounded-box bg-base-100 p-3 text-center shadow"
            >
              <span className="flex h-20 w-20 items-center justify-center rounded-xl bg-base-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/assets/images/monsterDb/${m.id}.gif`}
                  alt=""
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              </span>
              <span className="text-sm font-bold leading-snug">{m.name}</span>
              {m.mvp && (
                <span className="rounded-full bg-warning px-2 py-0.5 text-xs font-bold text-warning-content">
                  MVP
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="dg-rewards" className="space-y-3">
        <h2 id="dg-rewards" className="text-xl font-bold">
          รางวัล
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          {guide.rewards.map((group) => (
            <div key={group.title} className="rounded-box bg-base-100 p-4 shadow">
              <h3 className="mb-2 font-bold">{group.title}</h3>
              <ul className="list-inside list-disc space-y-0.5 text-sm">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
