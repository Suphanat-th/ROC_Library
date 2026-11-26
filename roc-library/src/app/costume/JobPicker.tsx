"use client";

import { useRef, useState } from "react";
import { ChevronRight, X } from "lucide-react";
import { CostumeGender, CostumeJob, CostumeTier } from "@/types/costume";
import SpriteThumb from "./SpriteThumb";

/** The main jobs (the first job of each line), in the order the game lists them. Each job of the index names its own. */
export const MAIN_JOBS = ["Novice", "Swordman", "Acolyte", "Magician", "Merchant", "Archer", "Thief", "Taekwon", "Ninja", "Gunslinger"];

const TIER_LABEL: Record<CostumeTier, string> = {
  class12: "Class 1-2",
  high: "High / Awakened",
  extended: "Extended",
};

const bodyOf = (job: CostumeJob, gender: CostumeGender) => job.body[gender] ?? job.body[gender === "m" ? "f" : "m"];

/**
 * Chooses a job: a button showing the job now chosen opens a window with the main jobs on the left (each with a
 * picture) and, for the main job picked there, the jobs of its line on the right. Written apart from the Costume
 * simulator so a stat simulator can use the same chooser.
 */
export default function JobPicker({
  jobs,
  gender,
  value,
  onChange,
}: {
  jobs: CostumeJob[];
  gender: CostumeGender;
  value: string;
  onChange: (id: string) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const current = jobs.find((job) => job.id === value);
  const [family, setFamily] = useState(current?.family ?? MAIN_JOBS[0]);

  const linesOf = (name: string) => jobs.filter((job) => job.family === name);
  const picture = (job: CostumeJob, size: number) => {
    const body = bodyOf(job, gender);
    return body ? <SpriteThumb gender={job.body[gender] ? gender : gender === "m" ? "f" : "m"} bodyName={body} size={size} /> : null;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setFamily(current?.family ?? family);
          setOpen(true);
          dialogRef.current?.showModal();
        }}
        aria-haspopup="dialog"
        className="flex min-h-14 w-full items-center gap-3 rounded-field border border-base-300 bg-base-100 px-3 text-left hover:border-primary/60 focus-visible:outline-2 focus-visible:outline-primary"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-field bg-base-200">{current && picture(current, 48)}</span>
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block truncate text-sm font-bold">{current?.label ?? "เลือกอาชีพ"}</span>
          <span className="block text-xs text-base-content/60">{current ? `${current.family} · ${TIER_LABEL[current.tier]}` : ""}</span>
        </span>
        <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-base-content/60" />
      </button>

      <dialog ref={dialogRef} onClose={() => setOpen(false)} aria-label="เลือกอาชีพ" className="modal">
        <div className="modal-box max-h-[calc(100dvh-2rem)] w-[calc(100%-1.5rem)] max-w-3xl overflow-y-auto p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">เลือกอาชีพ</h2>
            <form method="dialog">
              <button aria-label="ปิด" className="btn btn-circle btn-ghost btn-sm min-h-11 min-w-11">
                <X aria-hidden="true" className="h-5 w-5" />
              </button>
            </form>
          </div>

          {open && (
            <div className="grid gap-4 sm:grid-cols-[11rem_1fr]">
              {/* The main jobs. */}
              <div role="tablist" aria-label="อาชีพหลัก" className="grid grid-cols-5 gap-2 sm:grid-cols-1">
                {MAIN_JOBS.map((name) => {
                  const lines = linesOf(name);
                  const first = lines[0];
                  if (!first) return null;
                  return (
                    <button
                      key={name}
                      type="button"
                      role="tab"
                      aria-selected={family === name}
                      onClick={() => setFamily(name)}
                      className={`flex flex-col items-center gap-1 rounded-box border-2 p-1.5 transition-colors sm:flex-row sm:gap-3 sm:px-2 ${
                        family === name ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary/50"
                      }`}
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center">{picture(first, 48)}</span>
                      <span className="text-center text-[11px] font-semibold leading-tight sm:text-left sm:text-sm">{name}</span>
                    </button>
                  );
                })}
              </div>

              {/* The jobs of the main job picked. */}
              <div role="tabpanel" className="grid content-start gap-2 sm:grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]">
                {linesOf(family).map((job) => {
                  const playable = job.genders.includes(gender);
                  return (
                    <button
                      key={job.id}
                      type="button"
                      disabled={!playable}
                      aria-pressed={job.id === value}
                      onClick={() => {
                        onChange(job.id);
                        dialogRef.current?.close();
                      }}
                      className={`flex items-center gap-3 rounded-box border-2 p-2 text-left transition-colors disabled:opacity-40 sm:flex-col sm:text-center ${
                        job.id === value ? "border-primary bg-primary/10" : "border-base-300 hover:border-primary/50"
                      }`}
                    >
                      <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-field bg-base-200">{picture(job, 72)}</span>
                      <span className="min-w-0 leading-tight">
                        <span className="block text-sm font-bold">{job.label}</span>
                        <span className="block text-[11px] text-base-content/60">
                          {playable ? TIER_LABEL[job.tier] : job.genders[0] === "m" ? "เฉพาะชาย" : "เฉพาะหญิง"}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button aria-label="ปิด">ปิด</button>
        </form>
      </dialog>
    </>
  );
}
