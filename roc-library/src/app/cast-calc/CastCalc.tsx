"use client";

import { Hourglass } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { calcCast, MAX_ASPD, VCT_STAT_CAP, type CastInput, type CastResult } from "@/utils/castCalc";

const fmt = (value: number, digits = 2) =>
  new Intl.NumberFormat("th-TH", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

type FieldDef = {
  key: keyof CastInput;
  label: string;
  hint: string;
  step: string;
  max?: number;
};

type GroupId = "fix" | "vct" | "wait" | "cd";

/* Each part of a skill has one colour, on the Cast bar and on its group of fields, so a player can see
   which numbers feed which part. */
const TONE: Record<GroupId, { bar: string; text: string }> = {
  fix: { bar: "bg-warning", text: "text-warning" },
  vct: { bar: "bg-primary", text: "text-primary" },
  wait: { bar: "bg-success", text: "text-success" },
  cd: { bar: "bg-error", text: "text-error" },
};

type GroupDef = {
  id: GroupId;
  title: string;
  note: string;
  /** The skill's own number, before anything reduces it. */
  base: FieldDef;
  /** What reduces it: the character's stats, gear and buffs. */
  fields: FieldDef[];
};

const GROUPS: GroupDef[] = [
  {
    id: "fix",
    title: "FCT",
    note: "Fixed cast: สถิติลดไม่ได้",
    base: { key: "fixedCast", label: "FCT", hint: "Fixed cast (วินาที)", step: "0.1" },
    fields: [
      { key: "fixedReductionSeconds", label: "ลด FCT (วินาที)", hint: "ลบก่อน รวมกันได้", step: "0.1" },
      { key: "fixedReduction", label: "ลด FCT (%)", hint: "ใส่ค่าสูงสุดตัวเดียว ไม่รวมกัน", step: "1", max: 100 },
    ],
  },
  {
    id: "vct",
    title: "VCT",
    note: "DEX/INT กรอกตามหน้าต่างสเตตัส: ตัวเลขหน้า + ตัวเลขหลัง",
    base: { key: "baseVct", label: "VCT", hint: "Base VCT (วินาที)", step: "0.1" },
    fields: [
      { key: "dex", label: "DEX หน้า", hint: "ตัวเลขหน้า +", step: "1" },
      { key: "dexBonus", label: "DEX หลัง", hint: "ตัวเลขหลัง +", step: "1" },
      { key: "int", label: "INT หน้า", hint: "ตัวเลขหน้า +", step: "1" },
      { key: "intBonus", label: "INT หลัง", hint: "ตัวเลขหลัง +", step: "1" },
      { key: "vctReductionSeconds", label: "ลด VCT (วินาที)", hint: "ลบก่อน รวมกันได้", step: "0.1" },
      { key: "gearVctReduction", label: "ลด VCT (เกียร์)", hint: "% (รวมของในกลุ่มนี้)", step: "1", max: 100 },
      { key: "skillVctReduction", label: "ลด VCT (สกิล)", hint: "% (รวมของในกลุ่มนี้)", step: "1", max: 100 },
    ],
  },
  {
    id: "wait",
    title: "Global CD",
    note: "รอหลังร่ายเสร็จ: Global CD หรือ ASPD ตัวที่นานกว่า ใช้สกิลไหนไม่ได้",
    base: { key: "globalCd", label: "Global CD", hint: "ของสกิล (วินาที)", step: "0.1" },
    fields: [
      { key: "globalCdReduction", label: "ลด Global CD (%)", hint: "รวมของที่ลด", step: "1", max: 100 },
      { key: "aspd", label: "ASPD", hint: `สูงสุด ${MAX_ASPD}`, step: "1", max: MAX_ASPD },
    ],
  },
  {
    id: "cd",
    title: "Skill CD",
    note: "เริ่มนับพร้อม Global CD ใช้สกิลอื่นได้ แต่สกิลเดิมต้องรอ",
    base: { key: "skillCd", label: "Skill CD", hint: "ของสกิล (วินาที)", step: "0.1" },
    fields: [
      { key: "skillCdReductionSeconds", label: "ลด Skill CD (วินาที)", hint: "ลบก่อน", step: "0.1" },
      { key: "skillCdReduction", label: "ลด Skill CD (%)", hint: "คูณทีหลัง", step: "1", max: 100 },
    ],
  },
];

const FIELDS = GROUPS.flatMap((g) => [g.base, ...g.fields]);

const INITIAL: CastInput = {
  // A starting example, not a real skill: FCT 0.5, VCT 0.8, Global CD 1.
  fixedCast: 0.5,
  fixedReductionSeconds: 0,
  fixedReduction: 0,
  baseVct: 0.8,
  vctReductionSeconds: 0,
  dex: 0,
  dexBonus: 0,
  int: 0,
  intBonus: 0,
  gearVctReduction: 0,
  skillVctReduction: 0,
  globalCd: 1,
  globalCdReduction: 0,
  aspd: 190,
  skillCd: 0,
  skillCdReductionSeconds: 0,
  skillCdReduction: 0,
};

/* What a field's text means for the calculation: empty or invalid is 0, never below 0, never above its max. */
const parse = (field: FieldDef, text: string) => {
  const n = Number(text);
  const value = Number.isFinite(n) ? Math.max(0, n) : 0;
  return field.max !== undefined ? Math.min(value, field.max) : value;
};

type Seg = { id: GroupId; name: string; value: number; start: number };

/* The Cast bar: two lanes on one time axis. The cast lane runs Fixed cast → VCT → the wait (Global CD or ASPD).
   The Skill CD lane starts when the cast finishes, at the same moment as the wait. The axis ends when the same
   skill can be used again; a dashed line marks when any other skill can be used. */
function Bar({
  segs,
  cd,
  r,
  elapsed,
  size,
}: {
  segs: Seg[];
  cd: Seg;
  r: CastResult;
  elapsed: number | null;
  size: "hero" | "slim";
}) {
  const hero = size === "hero";
  const axis = r.reuse;
  const at = (seconds: number) => `${(seconds / axis) * 100}%`;
  const fillOf = (from: number, length: number) =>
    elapsed === null || length <= 0 ? 1 : Math.min(Math.max((elapsed - from) / length, 0), 1);

  if (axis <= 0) {
    return (
      <div
        className={`flex w-full items-center justify-center bg-base-200 text-sm opacity-60 ${
          hero ? "h-24 rounded-box sm:h-32" : "h-6 rounded-lg"
        }`}
      >
        ไม่มีเวลาร่ายหรือ delay
      </div>
    );
  }

  return (
    <div className="relative w-full">
      {/* Cast lane */}
      <div className={`flex w-full overflow-hidden bg-base-200 ${hero ? "h-16 rounded-box sm:h-20 lg:h-28" : "h-4 rounded-md"}`}>
        {segs.map((s) =>
          s.value > 0 ? (
            <div key={s.id} style={{ width: at(s.value) }} className="relative min-w-0 overflow-hidden" title={`${s.name} ${fmt(s.value)} วิ`}>
              <div className={`absolute inset-0 opacity-25 ${TONE[s.id].bar}`} />
              <div className={`absolute inset-y-0 left-0 ${TONE[s.id].bar}`} style={{ width: `${fillOf(s.start, s.value) * 100}%` }} />
            </div>
          ) : null,
        )}
      </div>

      {/* Skill CD lane: begins where the cast ends */}
      {cd.value > 0 && (
        <div className={`relative w-full overflow-hidden bg-base-200 ${hero ? "mt-1.5 h-8 rounded-box sm:h-10 lg:h-12" : "mt-1 h-2 rounded-sm"}`}>
          <div
            style={{ left: at(cd.start), width: at(cd.value) }}
            className="absolute inset-y-0 overflow-hidden"
            title={`${cd.name} ${fmt(cd.value)} วิ`}
          >
            <div className={`absolute inset-0 opacity-25 ${TONE.cd.bar}`} />
            <div className={`absolute inset-y-0 left-0 ${TONE.cd.bar}`} style={{ width: `${fillOf(cd.start, cd.value) * 100}%` }} />
          </div>
        </div>
      )}

      {/* When any other skill can be used, if the same skill has to wait longer */}
      {r.reuse > r.total && (
        <div
          aria-hidden="true"
          className="absolute inset-y-0 border-l-2 border-dashed border-base-content/60"
          style={{ left: at(r.total) }}
        />
      )}

      {/* Playhead across both lanes */}
      {elapsed !== null && (
        <div
          className="absolute inset-y-0 w-1 -translate-x-1/2 rounded-full bg-base-content"
          style={{ left: at(elapsed) }}
        />
      )}
    </div>
  );
}

/* The name and seconds of each part, under the bar, placed where the part sits on the time axis. */
function BarLabels({ segs, cd, r }: { segs: Seg[]; cd: Seg; r: CastResult }) {
  if (r.reuse <= 0) return null;
  const at = (seconds: number) => `${(seconds / r.reuse) * 100}%`;
  const visible = segs.filter((s) => s.value > 0);
  const lastId = visible[visible.length - 1]?.id;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex">
        {visible.map((s) => (
          <div
            key={s.id}
            style={{ width: at(s.value) }}
            className={`flex min-w-0 flex-col ${s.id === lastId ? "items-end" : "items-start pr-1"}`}
            title={`${s.name} ${fmt(s.value)} วิ`}
          >
            {/* The last part is often the shortest: its label is right-aligned so it grows leftwards, not off the page. */}
            <p className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold sm:text-sm">
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE[s.id].bar}`} />
              {s.name}
            </p>
            <p className="whitespace-nowrap font-mono text-sm opacity-80 sm:text-base">{fmt(s.value)}</p>
          </div>
        ))}
      </div>
      {cd.value > 0 && (
        <div className="flex">
          <div style={{ width: at(cd.start) }} className="shrink-0" />
          {/* Under the start of the Skill CD; right-aligned only when it is too short to hold the label. */}
          <div
            style={{ width: at(cd.value) }}
            className={`flex min-w-0 flex-col ${cd.value / r.reuse < 0.15 ? "items-end" : "items-start"}`}
            title={`${cd.name} ${fmt(cd.value)} วิ`}
          >
            <p className="flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold sm:text-sm">
              <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE.cd.bar}`} />
              {cd.name}
            </p>
            <p className="whitespace-nowrap font-mono text-sm opacity-80 sm:text-base">{fmt(cd.value)}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CastCalc() {
  // The text of every field as typed, so a field can be emptied and retyped without jumping to 0.
  const [raw, setRaw] = useState<Record<keyof CastInput, string>>(
    () => Object.fromEntries(FIELDS.map((f) => [f.key, String(INITIAL[f.key])])) as Record<keyof CastInput, string>,
  );
  const input = Object.fromEntries(FIELDS.map((f) => [f.key, parse(f, raw[f.key])])) as CastInput;
  const r = calcCast(input);
  const rMax = calcCast({ ...input, aspd: MAX_ASPD });

  const onChange = (key: keyof CastInput, text: string) => setRaw((prev) => ({ ...prev, [key]: text }));
  const onNormalize = (field: FieldDef) =>
    setRaw((prev) => ({ ...prev, [field.key]: String(parse(field, prev[field.key])) }));

  const animate = r.reuse > 0;
  const [tick, setTick] = useState(0);

  // The bar loops over exactly the seconds until the same skill can be used again: it starts again the moment
  // it is full, with no rest.
  useEffect(() => {
    if (!animate) return;
    const startedAt = performance.now();
    let frame = 0;
    const step = (now: number) => {
      setTick(((now - startedAt) / 1000) % r.reuse);
      frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [animate, r.reuse, r.fixed, r.vct, r.wait, r.skillCd]);

  // The big bar is the page's centre; once it has scrolled out of view a slim copy stays pinned under the Navbar.
  const heroRef = useRef<HTMLElement>(null);
  const [heroOut, setHeroOut] = useState(false);
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const watcher = new IntersectionObserver(([entry]) => setHeroOut(!entry.isIntersecting), {
      rootMargin: "-64px 0px 0px 0px",
    });
    watcher.observe(el);
    return () => watcher.disconnect();
  }, []);

  // null = static preview (no motion)
  const elapsed = animate ? tick : null;

  let start = 0;
  const segs: Seg[] = [
    { id: "fix" as const, name: "FCT", value: r.fixed },
    { id: "vct" as const, name: "VCT", value: r.vct },
    { id: "wait" as const, name: r.waitSource === "global" ? "Global CD" : "ASPD", value: r.wait },
  ].map((s) => {
    const seg = { ...s, start };
    start += s.value;
    return seg;
  });
  const cd: Seg = { id: "cd", name: "Skill CD", value: r.skillCd, start: r.castEnd };

  const stage =
    elapsed === null
      ? "ไม่มีเวลาร่าย"
      : elapsed >= r.total
        ? "รอ Skill CD (ใช้สกิลอื่นได้แล้ว)"
        : (segs.find((s) => s.value > 0 && elapsed < s.start + s.value)?.name ?? segs[segs.length - 1].name);

  return (
    <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 text-base-content sm:px-6 lg:pt-8">
      <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 pb-4">
        <div className="flex items-center gap-3 text-primary">
          <Hourglass aria-hidden="true" className="size-6" />
          <h1 className="text-2xl font-bold sm:text-3xl">Cast Calculator</h1>
        </div>
        <p className="text-sm opacity-70">1 สกิล = FCT + VCT แล้ว Global CD กับ Skill CD นับพร้อมกัน กรอกข้างล่าง ดูผลที่หลอด</p>
      </header>

      {/* Once the big bar is out of view, a slim copy stays under the Navbar so the result is never lost. */}
      {heroOut && (
        <div aria-hidden="true" className="fixed inset-x-0 top-16 z-30 border-b border-base-300 bg-base-100/95 backdrop-blur">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6">
            <div className="mb-1 flex items-baseline justify-between gap-3">
              <p className="font-mono text-2xl font-bold text-primary">
                {fmt(r.total)} <span className="text-sm">วิ</span>
                {r.reuse > r.total && (
                  <span className="ml-3 text-base text-error">
                    {fmt(r.reuse)} <span className="text-xs">วิ (สกิลเดิม)</span>
                  </span>
                )}
              </p>
              <p className="truncate text-xs font-semibold opacity-80">{stage}</p>
            </div>
            <Bar segs={segs} cd={cd} r={r} elapsed={elapsed} size="slim" />
          </div>
        </div>
      )}

      {/* The Cast bar: the largest thing on the page */}
      <section ref={heroRef} aria-label="Cast bar" className="rounded-box border border-base-300 bg-base-100 p-4 shadow sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest opacity-70">Cast bar</p>
            <p className="mt-1 truncate text-xl font-bold text-primary sm:text-3xl">{stage}</p>
            {elapsed !== null && (
              <p className="font-mono text-sm opacity-70">
                {fmt(elapsed)} / {fmt(r.reuse)} วิ
              </p>
            )}
          </div>
          <div className="shrink-0 text-right">
            <p className="text-xs opacity-70">ใช้สกิลอื่นได้ที่</p>
            <p className="font-mono text-5xl font-bold leading-none text-primary sm:text-6xl lg:text-7xl">
              {fmt(r.total)}
              <span className="ml-1 text-xl sm:text-2xl">วิ</span>
            </p>
            <p className={`mt-1 font-mono text-sm sm:text-base ${r.reuse > r.total ? "font-bold text-error" : "opacity-70"}`}>
              ใช้สกิลเดิมซ้ำได้ที่ {fmt(r.reuse)} วิ
            </p>
          </div>
        </div>
        <div className="mt-4">
          <Bar segs={segs} cd={cd} r={r} elapsed={elapsed} size="hero" />
          <BarLabels segs={segs} cd={cd} r={r} />
        </div>

        {/* How many times a second the same skill can be used over and over, and what a maxed ASPD would change */}
        <div className="mt-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-base-300 pt-3">
          <p>
            <span className="text-sm opacity-70">ออกสกิลได้ </span>
            <span className="font-mono text-2xl font-bold text-primary sm:text-3xl">{fmt(r.castsPerSecond)}</span>
            <span className="text-sm opacity-70"> ครั้ง/วินาที (ASPD {fmt(input.aspd, 0)})</span>
          </p>
          <p className="text-sm opacity-80">
            {rMax.castsPerSecond - r.castsPerSecond > 0.005
              ? `ที่ ASPD ${MAX_ASPD} ได้ ${fmt(rMax.castsPerSecond)} ครั้ง/วินาที`
              : `ASPD ${MAX_ASPD} ก็ไม่ช่วยเพิ่ม (สกิลเป็นตัวจำกัด)`}
          </p>
        </div>
      </section>

      {/* The skill's own Base numbers, kept apart from what reduces them */}
      <BaseCard raw={raw} onChange={onChange} onNormalize={onNormalize} />

      {/* What reduces them: one group per part of the skill, each ending in its own result */}
      <h2 className="mt-6 text-lg font-bold">ข้อมูลของสวมใส่และสเตตัสที่ใช้สำหรับคำนวณ</h2>
      <div className="mt-2 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {GROUPS.map((g) => (
          <GroupCard key={g.id} group={g} raw={raw} onChange={onChange} onNormalize={onNormalize} r={r} input={input} />
        ))}
      </div>

      <details className="mt-4 rounded-box border border-base-300 bg-base-100 p-4 text-sm">
        <summary className="cursor-pointer font-semibold">สูตรที่ใช้</summary>
        <div className="mt-3 space-y-1 font-mono text-xs leading-6">
          <p>FCT = max(Fixed cast − วินาทีที่ลด, 0) × (1 − %ลด)</p>
          <p>
            VCT = max(BaseVCT − วินาทีที่ลด, 0) × (1 − √((DEX×2 + INT) / {VCT_STAT_CAP})) × (1 − %เกียร์) × (1 − %สกิล)
          </p>
          <p>รอหลังร่าย = max(Global CD × (1 − %ลด), (200 − ASPD) / 50) · ส่วนของ ASPD เป็นค่าประมาณ ยังไม่ยืนยันกับเกม</p>
          <p>Skill CD = max(Skill CD − วินาทีที่ลด, 0) × (1 − %ลด)</p>
          <p>ใช้สกิลอื่นได้ = FCT + VCT + รอหลังร่าย</p>
          <p>ใช้สกิลเดิมซ้ำได้ = FCT + VCT + max(รอหลังร่าย, Skill CD)</p>
        </div>
      </details>
    </main>
  );
}

/* One labelled number field; the dot, when given, is the colour of the part of the bar it feeds. */
function FieldInput({
  field,
  tone,
  raw,
  onChange,
  onNormalize,
}: {
  field: FieldDef;
  tone?: GroupId;
  raw: Record<keyof CastInput, string>;
  onChange: (key: keyof CastInput, text: string) => void;
  onNormalize: (field: FieldDef) => void;
}) {
  return (
    <label className="block">
      <span className="flex items-center gap-1.5 text-sm font-semibold">
        {tone && <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${TONE[tone].bar}`} />}
        {field.label}
      </span>
      <span className="block text-xs opacity-60">{field.hint}</span>
      <input
        type="number"
        inputMode="decimal"
        min="0"
        max={field.max}
        step={field.step}
        value={raw[field.key]}
        onChange={(e) => onChange(field.key, e.target.value)}
        onFocus={(e) => e.currentTarget.select()}
        onBlur={() => onNormalize(field)}
        className="input input-bordered mt-1 w-full scroll-mt-40 font-mono"
      />
    </label>
  );
}

/* The skill itself: its four Base numbers, before anything reduces them. */
function BaseCard({
  raw,
  onChange,
  onNormalize,
}: {
  raw: Record<keyof CastInput, string>;
  onChange: (key: keyof CastInput, text: string) => void;
  onNormalize: (field: FieldDef) => void;
}) {
  return (
    <section aria-label="สกิลที่ใช้งาน" className="mt-4 rounded-box border border-base-300 bg-base-100 p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="text-lg font-bold">สกิลที่ใช้งาน</h2>
        <p className="text-xs opacity-60">ค่าของสกิลเอง ก่อนลดทุกอย่าง (ดูจาก patch หรือในเกม)</p>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4 lg:grid-cols-4">
        {GROUPS.map((g) => (
          <FieldInput key={g.base.key} field={g.base} tone={g.id} raw={raw} onChange={onChange} onNormalize={onNormalize} />
        ))}
      </div>
    </section>
  );
}

/* One part of the skill: what reduces it (stats, gear, buffs), then its result, the steps that led to it, and how far it is from 0. */
function GroupCard({
  group,
  raw,
  onChange,
  onNormalize,
  r,
  input,
}: {
  group: GroupDef;
  raw: Record<keyof CastInput, string>;
  onChange: (key: keyof CastInput, text: string) => void;
  onNormalize: (field: FieldDef) => void;
  r: CastResult;
  input: CastInput;
}) {
  const tone = TONE[group.id];
  const { value, steps, shortfall } = summaryOf(group.id, r, input);

  return (
    <section className="rounded-box border border-base-300 bg-base-100 p-4 sm:p-5">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <h2 className={`flex items-center gap-2 text-lg font-bold ${tone.text}`}>
            <span aria-hidden="true" className={`h-2.5 w-2.5 shrink-0 rounded-full ${tone.bar}`} />
            {group.title}
          </h2>
          <p className="text-xs opacity-60">{group.note}</p>
        </div>
        <p className="shrink-0 whitespace-nowrap font-mono text-2xl font-bold" aria-label={`${group.title} ${fmt(value)} วินาที`}>
          {fmt(value)} <span className="text-sm font-semibold opacity-70">วิ</span>
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-3 sm:gap-x-4">
        {group.fields.map((f) => (
          <FieldInput key={f.key} field={f} raw={raw} onChange={onChange} onNormalize={onNormalize} />
        ))}
      </div>

      <div className="mt-4 space-y-1.5 border-t border-base-300 pt-3 text-sm">
        <p className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 font-mono text-xs opacity-80">
          {steps.map((s, i) => (
            <span key={s.label} className="inline-flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">→</span>}
              <span>
                {s.label} <span className="font-semibold">{s.value}</span>
              </span>
            </span>
          ))}
        </p>
        <p>
          <span className="font-semibold">ขาดอีก:</span> <span className="opacity-80">{shortfall}</span>
        </p>
      </div>
    </section>
  );
}

/* The result of one part, the steps from its base to that result, and what is still missing for it to reach 0. */
function summaryOf(id: GroupId, r: CastResult, input: CastInput) {
  if (id === "fix") {
    return {
      value: r.fixed,
      steps: [
        { label: "Base", value: fmt(input.fixedCast) },
        { label: "หลังลดวินาที", value: fmt(r.fixedAfterSeconds) },
        { label: "หลังลด %", value: fmt(r.fixed) },
      ],
      shortfall:
        r.fixed <= 0
          ? "เหลือ 0 แล้ว"
          : `ลดเป็นวินาทีอีก ${fmt(r.fixedAfterSeconds)} วิ หรือมี % ลดสูงสุด 100% (DEX/INT ช่วยไม่ได้)`,
    };
  }

  if (id === "vct") {
    return {
      value: r.vct,
      steps: [
        { label: "Base", value: fmt(input.baseVct) },
        { label: "หลังลดวินาที", value: fmt(r.vctAfterSeconds) },
        { label: `DEX/INT (ลด ${fmt((1 - r.statMultiplier) * 100, 1)}%)`, value: fmt(r.vctAfterStats) },
        { label: "เกียร์", value: fmt(r.vctAfterGear) },
        { label: "สกิล", value: fmt(r.vct) },
      ],
      shortfall:
        r.vct <= 0
          ? "เหลือ 0 แล้ว"
          : `DEX ${fmt(input.dex + input.dexBonus, 0)} · INT ${fmt(input.int + input.intBonus, 0)} → DEX×2 + INT = ${fmt(r.statPoints, 0)} / ${VCT_STAT_CAP} ขาดอีก ${fmt(r.statPointsMissing, 0)} แต้ม (เช่น DEX อีก ${fmt(r.statPointsMissing / 2, 1)}) หรือลดเป็นวินาที / % เพิ่ม`,
    };
  }

  if (id === "wait") {
    return {
      value: r.wait,
      steps: [
        { label: "Global CD หลังลด", value: fmt(r.globalCd) },
        { label: "ASPD (ประมาณ)", value: fmt(r.aspdDelay) },
        { label: r.waitSource === "global" ? "ใช้ค่า Global CD" : "ใช้ค่า ASPD", value: fmt(r.wait) },
      ],
      shortfall:
        r.wait <= 0
          ? "เหลือ 0 แล้ว"
          : r.waitSource === "aspd" && r.aspdMissing <= 0
            ? `ASPD สูงสุดแล้ว (${MAX_ASPD}) เวลารอจาก ASPD ต่ำสุดได้ ${fmt(r.aspdDelay)} วิ ลดต่อไม่ได้`
            : r.waitSource === "aspd"
              ? `ASPD ขาดอีก ${fmt(r.aspdMissing, 0)} (ต้องถึง ${fmt(r.aspdNeeded, 0)}) ถึงจะไม่เป็นคอขวด${
                  r.globalCd > 0 ? ` จากนั้น Global CD ${fmt(r.globalCd)} วิ เป็นตัวกำหนด` : ""
                }`
              : `Global CD ${fmt(r.globalCd)} วิ เป็นตัวกำหนด ASPD ไม่ใช่คอขวด`,
    };
  }

  return {
    value: r.skillCd,
    steps: [
      { label: "Base", value: fmt(input.skillCd) },
      { label: "หลังลดวินาที", value: fmt(r.skillCdAfterSeconds) },
      { label: "หลังลด %", value: fmt(r.skillCd) },
    ],
    shortfall:
      r.skillCd <= 0
        ? "เหลือ 0 แล้ว"
        : `ลดอีก ${fmt(r.skillCdAfterSeconds)} วิ ถึงจะเหลือ 0 (DEX/INT/ASPD ช่วยไม่ได้) · ${
            r.skillCd > r.wait
              ? `นานกว่าเวลารอหลังร่าย ${fmt(r.skillCd - r.wait)} วิ สกิลเดิมจึงต้องรอเพิ่ม`
              : "ไม่เกินเวลารอหลังร่าย จึงไม่ทำให้ใช้สกิลเดิมช้าลง"
          }`,
  };
}
