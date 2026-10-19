import type { AtkResult } from "../types";

function Row({ label, value, strong }: { label: string; value: string | number; strong?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-base-content/60">{label}</span>
      <span className={`font-mono ${strong ? "font-bold text-primary" : ""}`}>{value}</span>
    </div>
  );
}

const range = (min: number, max: number) =>
  min === max ? `${min.toLocaleString()}` : `${min.toLocaleString()} – ${max.toLocaleString()}`;

export default function ResultPanel({ result }: { result: AtkResult }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-primary/30 bg-base-200 p-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-primary">⚔️ Result</h2>

      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-base-100 p-3">
          <p className="text-xs text-base-content/60">Min</p>
          <p className="font-mono text-xl font-black">{result.min.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-base-100 p-3">
          <p className="text-xs text-base-content/60">Average</p>
          <p className="font-mono text-xl font-black text-primary">{result.avg.toLocaleString()}</p>
        </div>
        <div className="rounded-lg bg-base-100 p-3">
          <p className="text-xs text-base-content/60">Max</p>
          <p className="font-mono text-xl font-black">{result.max.toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-1.5 border-t border-base-content/10 pt-3 text-xs">
        <p className="text-base-content/50">ส่วนประกอบ</p>
        <Row label="Status ATK (หน้าจอ)" value={result.statusAtk} />
        <Row label="Status ATK × 2 (ใช้คำนวณจริง)" value={result.statusAtk * 2} />
        <Row label="Bonus STR / DEX" value={`+${result.bonusStat}`} />
        <Row label="Refine" value={`+${result.refineBonus}`} />
        <Row
          label="Overrefine"
          value={`+${range(result.overrefineMin, result.overrefineMax)}`}
        />
        <Row label="Weapon ATK (Min – Max)" value={range(result.weaponMin, result.weaponMax)} />
      </div>

      <div className="space-y-1.5 border-t border-base-content/10 pt-3 text-xs">
        <p className="text-base-content/50">ลำดับคำนวณ</p>
        <Row label="ตัวคูณ L2 (รวมคูณกัน)" value={`× ${result.level2.toFixed(3)}`} />
        <Row label="A = (Weapon + Equip) × L2 + L1" value={range(result.aMin, result.aMax)} />
        <Row label="B = A + Status×2 + Mastery" value={range(result.bMin, result.bMax)} />
        <Row label="ตัวคูณ L3" value={`× ${result.level3.toFixed(3)}`} />
        <Row
          label="Final ATK = B × L3"
          value={range(result.finalMin, result.finalMax)}
          strong
        />
      </div>
    </div>
  );
}
