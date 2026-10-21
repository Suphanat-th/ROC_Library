"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import { PageSkeleton } from "@/components/Loader";
import {
  ANNIVERSARY_SERVERS,
  REWARD_TYPES,
  rewardTypeOf,
  useAnniversaryRewards,
} from "@/services/anniversary/anniversaryService";
import type { AnniversaryServer } from "@/types/anniversary";
import ItemCard from "../patch-convert/ItemCard";
import RewardSection from "./components/RewardSection";

export default function FifthAnniversaryPage() {
  const [server, setServer] = useState<AnniversaryServer>("baphomet");
  const [openId, setOpenId] = useState<string | null>(null);
  const { items, loading, error } = useAnniversaryRewards(server);
  const imageDir = ANNIVERSARY_SERVERS.find((s) => s.id === server)!.imageDir;
  const imageSrc = (id: string) => `/assets/images/anvs/${imageDir}/${id}.bmp`;
  const entries = Object.entries(items);
  const openItem = openId ? items[openId] : undefined;

  const groups = REWARD_TYPES.map((type) => ({
    type,
    rewards: entries.filter(([, item]) => rewardTypeOf(item) === type.id),
  })).filter((g) => g.rewards.length > 0);

  return (
    <main className="anvs mx-auto max-w-5xl space-y-8 px-4 py-6 sm:px-6">
      <header className="anvs-hero anvs-dots relative overflow-hidden rounded-3xl px-6 py-8 shadow-lg sm:px-10 sm:py-12">
        <span
          aria-hidden
          className="anvs-five pointer-events-none absolute -right-2 -top-6 select-none text-[11rem] font-black leading-none sm:-right-4 sm:-top-10 sm:text-[18rem]"
        >
          5
        </span>
        <div className="relative space-y-4">
          <p className="text-sm font-bold uppercase tracking-widest">
            Ragnarok Online Classic
          </p>
          <h1 className="text-4xl font-black leading-tight sm:text-6xl">
            5th Anniversary
          </h1>
          <p className="text-lg font-semibold">ของรางวัลฉลองครบรอบ 5 ปี</p>
        </div>
      </header>

      <div className="space-y-2">
        <p className="text-center text-sm font-bold text-base-content/70">
          เลือกเซิร์ฟเวอร์ที่เล่น
        </p>
        <div
          role="tablist"
          aria-label="เซิร์ฟเวอร์"
          className="mx-auto grid max-w-md grid-cols-2 gap-1 rounded-full border-2 border-(--anv-orange) bg-base-100 p-1 shadow-md"
        >
          {ANNIVERSARY_SERVERS.map((s) => {
            const selected = server === s.id;
            return (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setServer(s.id)}
                className={`flex cursor-pointer items-center justify-center gap-2 rounded-full px-4 py-2.5 text-lg font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--anv-orange) ${
                  selected
                    ? "bg-(--anv-orange) text-(--anv-ink)"
                    : "text-base-content hover:bg-(--anv-orange)/20"
                }`}
              >
                <span
                  aria-hidden
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-current"
                >
                  {selected && <Check className="h-4 w-4" strokeWidth={3} />}
                </span>
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading && <PageSkeleton cards={3} />}
      {error && (
        <p role="alert" className="rounded-box bg-base-100 p-4 text-error">
          โหลดข้อมูลของรางวัลไม่สำเร็จ: {error}
        </p>
      )}

      {!loading && (
        <div key={server} className="anvs-fade space-y-8">
          {groups.map(({ type, rewards }, i) => (
            <RewardSection
              key={`${server}-${type.id}`}
              index={String(i + 1).padStart(2, "0")}
              title={type.name}
              rewards={rewards}
              imageSrc={imageSrc}
              onSelect={setOpenId}
            />
          ))}
        </div>
      )}

      {openId && openItem && (
        <dialog open className="modal modal-open" onClick={() => setOpenId(null)}>
          <div
            className="modal-box max-w-5xl bg-transparent p-0 shadow-none"
            onClick={(e) => e.stopPropagation()}
          >
            <ItemCard
              id={`reward-${openId}`}
              item={openItem}
              image={
                <div className="image-item flex items-center justify-center p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className="rounded-xl"
                    src={imageSrc(openId)}
                    alt={`ภาพไอเทมรหัส ${openId}`}
                    width={150}
                    height={300}
                  />
                </div>
              }
            />
            <div className="mt-3 text-center">
              <button type="button" className="btn" onClick={() => setOpenId(null)}>
                ปิด
              </button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  );
}
