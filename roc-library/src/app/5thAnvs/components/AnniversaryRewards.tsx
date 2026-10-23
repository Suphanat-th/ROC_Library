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
import ItemCard from "../../patch-convert/ItemCard";
import ExchangeNotes from "./ExchangeNotes";
import RewardSection from "./RewardSection";
import SectionHeading from "./SectionHeading";
import SelectionSummary from "./SelectionSummary";
import SummaryModal from "./SummaryModal";

/**
 * Everything about the Anniversary rewards in one block: server choice, exchange
 * notes, the reward cards by Reward type, the picks and their summary.
 */
export default function AnniversaryRewards({ index }: { index: string }) {
  const [server, setServer] = useState<AnniversaryServer>("baphomet");
  const [openId, setOpenId] = useState<string | null>(null);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [picked, setPicked] = useState<ReadonlyMap<string, number>>(new Map());
  const { items, loading, error } = useAnniversaryRewards(server);
  const imageDir = ANNIVERSARY_SERVERS.find((s) => s.id === server)!.imageDir;
  const imageSrc = (id: string) => `/assets/images/anvs/${imageDir}/${id}.bmp`;
  const entries = Object.entries(items);
  const openItem = openId ? items[openId] : undefined;

  const switchServer = (next: AnniversaryServer) => {
    setServer(next);
    setPicked(new Map());
    setSummaryOpen(false);
  };
  const pick = (id: string, delta: 1 | -1) =>
    setPicked((prev) => {
      const next = new Map(prev);
      const count = (prev.get(id) ?? 0) + delta;
      if (count > 0) next.set(id, count);
      else next.delete(id);
      return next;
    });
  const pickedTotal = [...picked.values()].reduce((sum, n) => sum + n, 0);

  const groups = REWARD_TYPES.map((type) => ({
    type,
    rewards: entries.filter(([, item]) => rewardTypeOf(item) === type.id),
  })).filter((g) => g.rewards.length > 0);

  return (
    <section
      id="rewards"
      aria-labelledby="rewards-title"
      className="scroll-mt-20 space-y-6"
    >
      <SectionHeading index={index} title="Rewards" id="rewards-title" />

      <div className="space-y-6 rounded-3xl bg-(--anv-orange)/10 p-4 sm:p-6">
      <ExchangeNotes />

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
                onClick={() => switchServer(s.id)}
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
              picked={picked}
              onPick={pick}
              onOpen={setOpenId}
            />
          ))}
        </div>
      )}

      <SelectionSummary
        kinds={picked.size}
        count={pickedTotal}
        onOpen={() => setSummaryOpen(true)}
        onClear={() => setPicked(new Map())}
      />

      {summaryOpen && (
        <SummaryModal
          items={items}
          picked={picked}
          imageSrc={imageSrc}
          onClear={() => setPicked(new Map())}
          onClose={() => setSummaryOpen(false)}
        />
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
      </div>
    </section>
  );
}
