import type { ReverseCalcPanelProps } from "../types";

export default function ReverseCalcPanel({
  currentASPD,
  maxASPD,
  targetASPD,
  agi,
  dex,
  reverseCalc,
  onTargetChange,
}: ReverseCalcPanelProps) {
  return (
    <div className="space-y-3 rounded-2xl border border-purple-500/30 p-4" style={{ background: "rgba(20,10,50,0.9)" }}>
      <h3 className="text-xs font-bold uppercase tracking-widest text-purple-400">🎯 เพิ่มอีกเท่าไหร่ถึง ASPD ที่ต้องการ?</h3>
      <div className="flex items-center gap-3">
        <label className="whitespace-nowrap text-xs text-white/50">Target ASPD</label>
        <input
          type="number"
          min={1}
          max={maxASPD}
          value={targetASPD}
          onChange={(event) => {
            const nextValue = Number.parseInt(event.target.value, 10);
            if (!Number.isNaN(nextValue)) {
              onTargetChange(Math.min(maxASPD, Math.max(1, nextValue)));
            }
          }}
          className="w-24 rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white transition-all focus:border-purple-400/60 focus:outline-none"
        />
      </div>

      {currentASPD >= targetASPD ? (
        <p className="text-xs font-bold text-green-400">✅ ถึง {targetASPD} แล้ว! (current: {currentASPD})</p>
      ) : (
        <div className="space-y-2 text-xs">
          <p className="text-white/40">
            จาก <span className="font-mono text-white">{currentASPD}</span>
            {" → "}
            <span className="font-mono font-bold text-purple-300">{targetASPD}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-green-500/20 bg-white/5 p-3 text-center">
              <p className="mb-1 text-xs text-white/40">เพิ่ม AGI</p>
              {reverseCalc.agiNeeded !== null ? (
                <>
                  <p className="font-mono text-2xl font-black text-green-400">+{reverseCalc.agiNeeded}</p>
                  <p className="mt-1 text-xs text-white/30">{agi} → {agi + reverseCalc.agiNeeded}</p>
                </>
              ) : (
                <p className="mt-2 font-mono text-sm text-red-400">ไม่พอ ❌</p>
              )}
            </div>
            <div className="rounded-lg border border-blue-500/20 bg-white/5 p-3 text-center">
              <p className="mb-1 text-xs text-white/40">เพิ่ม DEX</p>
              {reverseCalc.dexNeeded !== null ? (
                <>
                  <p className="font-mono text-2xl font-black text-blue-400">+{reverseCalc.dexNeeded}</p>
                  <p className="mt-1 text-xs text-white/30">{dex} → {dex + reverseCalc.dexNeeded}</p>
                </>
              ) : (
                <p className="mt-2 font-mono text-sm text-red-400">ไม่พอ ❌</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}