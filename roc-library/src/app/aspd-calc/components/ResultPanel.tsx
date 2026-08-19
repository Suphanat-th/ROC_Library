import ASPDGauge from "./ASPDGauge";
import type { ResultPanelProps } from "../types";

export default function ResultPanel({
  classTier,
  maxASPD,
  result,
  jobBaseASPD,
  weaponFactor,
  offHandFactor,
  flatASPD,
}: ResultPanelProps) {
  const aspdColor = result.final >= 170 ? "text-green-400" : result.final >= 140 ? "text-yellow-400" : "text-red-400";

  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-sky-500/30 p-5" style={{ background: "rgba(10,20,50,0.9)", boxShadow: "0 0 40px rgba(56,189,248,0.08)" }}>
      <h2 className="self-start text-sm font-bold uppercase tracking-widest text-sky-400">⚡ Result</h2>

      {classTier === "awakened" ? (
        <div className="flex h-52 w-52 flex-col items-center justify-center rounded-full border border-yellow-500/30 bg-yellow-500/5">
          <span className="text-4xl">🚧</span>
          <p className="mt-2 text-sm font-bold text-yellow-400">Coming Soon</p>
        </div>
      ) : (
        <ASPDGauge aspd={result.final} max={maxASPD} />
      )}

      <div className="w-full space-y-2 border-t border-white/10 pt-3 text-xs">
        <div className="flex justify-between">
          <span className="text-white/40">Job Base ASPD</span>
          <span className="font-mono text-white">{jobBaseASPD}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Weapon Factor</span>
          <span className="font-mono text-white">{weaponFactor >= 0 ? "+" : ""}{weaponFactor}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Combined Base</span>
          <span className="font-mono font-bold text-yellow-300">{result.jobWeaponBase.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/40">Off-Hand</span>
          <span className="font-mono text-white">{offHandFactor !== 0 ? offHandFactor : "—"}</span>
        </div>

        <div className="space-y-1.5 border-t border-white/10 pt-2">
          <p className="mb-1 text-xs uppercase tracking-widest text-white/30">Formula Steps</p>
          <div className="flex justify-between">
            <span className="text-white/50">ASPD Penalty</span>
            <span className="font-mono font-bold text-orange-300">{result.aspdPenalty.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">ASPD Correction</span>
            <span className="font-mono font-bold text-orange-300">{result.aspdCorrection.toFixed(3)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Stat Root</span>
            <span className="font-mono font-bold text-sky-300">{result.statTerm.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Base Case</span>
            <span className="font-mono font-bold text-sky-300">{result.baseCase.toFixed(4)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Base ASPD</span>
            <span className="font-mono font-bold text-sky-300">{result.baseASPD.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Equip ASPD %</span>
            <span className="font-mono text-sky-300">+{result.equipContrib.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">After Equip ASPD</span>
            <span className="font-mono font-bold text-sky-300">{result.afterEquipASPD.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Flat ASPD</span>
            <span className="font-mono text-white/60">+{flatASPD}</span>
          </div>
        </div>

        <div className="flex justify-between border-t border-white/10 pt-2">
          <span className="text-sm font-bold text-white/70">Final ASPD</span>
          <span className={`font-mono text-base font-black ${aspdColor}`}>{result.final}</span>
        </div>
      </div>

      <div
        className={`w-full rounded-lg border py-2 text-center text-sm font-bold uppercase tracking-widest ${result.final >= 185 ? "border-green-500/50 bg-green-500/10 text-green-400" : result.final >= 170 ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400" : result.final >= 150 ? "border-orange-500/50 bg-orange-500/10 text-orange-400" : "border-red-500/50 bg-red-500/10 text-red-400"}`}
      >
        {result.final >= 185 ? "⚡ Lightning Fast" : result.final >= 170 ? "🔥 Very Fast" : result.final >= 150 ? "✅ Normal" : "🐢 Slow"}
      </div>
    </div>
  );
}