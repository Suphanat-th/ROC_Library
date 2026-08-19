import type { FormulaBreakdownPanelProps } from "../types";

export default function FormulaBreakdownPanel({
  showFormula,
  onToggle,
  result,
  jobBaseASPD,
  weaponFactor,
  offHandFactor,
  agi,
  dex,
  potionMod,
  skillPct,
  specialPct,
  equipPct,
  flatASPD,
  maxASPD,
}: FormulaBreakdownPanelProps) {
  return (
    <div className="mt-6">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between rounded-xl border border-sky-500/20 px-5 py-3 text-sm font-bold uppercase tracking-widest text-sky-400 transition-colors hover:bg-sky-500/5"
        style={{ background: "rgba(10,20,50,0.8)" }}
      >
        <span>📐 ASPD Formula</span>
        <span className="text-white/40">{showFormula ? "▲" : "▼"}</span>
      </button>

      {showFormula ? (
        <div className="mt-1 space-y-5 rounded-b-xl border border-t-0 border-sky-500/20 px-5 py-5" style={{ background: "rgba(8,16,42,0.95)" }}>
          <div className="space-y-4 font-mono text-xs">
            <div>
              <p className="mb-2 text-sm font-bold text-green-400">สูตรหลักจาก iRO Wiki</p>
              <div className="space-y-1 border-l-2 border-green-500/30 pl-3 text-white/70">
                <p className="leading-relaxed text-yellow-300">
                  Base ASPD = 200 − <span className="text-pink-300">(</span>200 − <span className="text-cyan-300">(</span>Job Base + Shield − Correction + √<span className="text-emerald-300">(</span>AGI × 9.999 + DEX × 0.19212<span className="text-emerald-300">)</span> × Penalty<span className="text-cyan-300">)</span><span className="text-pink-300">)</span> × <span className="text-violet-300">(</span>1 − Potion − Skill − Special<span className="text-violet-300">)</span>
                </p>
                <p className="leading-relaxed text-yellow-300">
                  Final ASPD = Base ASPD + Equip ASPD % + Equip ASPD Fixed
                </p>
                <p className="font-bold text-green-300">
                  = {result.baseASPD.toFixed(2)} + {result.equipContrib.toFixed(1)} + {flatASPD}
                  {" "}= <span className="text-white">{result.finalRaw.toFixed(2)}</span>
                  {" "}→ <span className="text-lg text-green-200">{result.final}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">① Job Base ASPD</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Job Base ASPD = class base + weapon factor</p>
                <p className="font-bold text-orange-300">
                  = {jobBaseASPD} + ({weaponFactor}) = <span className="text-white">{result.jobWeaponBase.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">② ASPD Penalty</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Penalty = 1 − ((Job Base ASPD − 144) ÷ 50), capped at 0.96, round down 2 decimals</p>
                <p className="font-bold text-orange-300">
                  = 1 − <span className="text-pink-300">(</span><span className="text-cyan-300">(</span>{result.jobWeaponBase.toFixed(2)} − 144<span className="text-cyan-300">)</span> ÷ 50<span className="text-pink-300">)</span>
                  {" "}= <span className="text-white">{result.aspdPenalty.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">③ ASPD Correction</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Correction = (√205 − √AGI) ÷ 7.15, round up 3 decimals</p>
                <p className="font-bold text-orange-300">
                  = <span className="text-pink-300">(</span>√205 − √{agi}<span className="text-pink-300">)</span> ÷ 7.15 = <span className="text-white">{result.aspdCorrection.toFixed(3)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">④ Stat Root</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Stat Root = √(AGI × 9.999 + DEX × 0.19212)</p>
                <p className="font-bold text-orange-300">
                  = √<span className="text-pink-300">(</span>{agi} × 9.999 + {dex} × 0.19212<span className="text-pink-300">)</span>
                  {" "}= <span className="text-white">{result.statTerm.toFixed(4)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">⑤ Base Case</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Base Case = Job Base ASPD + Shield/Off-Hand − Correction + (Stat Root × Penalty)</p>
                <p className="font-bold text-sky-300">
                  = {result.jobWeaponBase.toFixed(2)} + <span className="text-pink-300">(</span>{offHandFactor}<span className="text-pink-300">)</span> − {result.aspdCorrection.toFixed(3)}
                  {" "+ " "}<span className="text-cyan-300">(</span>{result.statTerm.toFixed(4)} × {result.aspdPenalty.toFixed(2)}<span className="text-cyan-300">)</span>
                  {" "}= <span className="text-white">{result.baseCase.toFixed(4)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">⑥ Total Percent Mod</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Total Percent Mod = Potion + Skill + Special</p>
                <p className="font-bold text-sky-300">
                  = {potionMod.toFixed(2)} + {(skillPct / 100).toFixed(2)} + {(specialPct / 100).toFixed(2)}
                  {" "}= <span className="text-white">{result.bonusTotal.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">⑦ Base ASPD</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Base ASPD = 200 − (200 − Base Case) × (1 − Total Percent Mod), round down 2 decimals</p>
                <p className="font-bold text-sky-300">
                  = 200 − <span className="text-pink-300">(</span>200 − {result.baseCase.toFixed(4)}<span className="text-pink-300">)</span> × <span className="text-cyan-300">(</span>1 − {result.bonusTotal.toFixed(2)}<span className="text-cyan-300">)</span>
                  {" "}= <span className="text-white">{result.baseASPD.toFixed(2)}</span>
                </p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-bold text-sky-400">⑧ Equip ASPD %</p>
              <div className="space-y-1 border-l-2 border-sky-500/30 pl-3 text-white/70">
                <p className="text-yellow-300">Equip ASPD % = (195 − Base ASPD) × Equip Mod, round down 1 decimal</p>
                <p className="font-bold text-sky-300">
                  = <span className="text-pink-300">(</span>195 − {result.baseASPD.toFixed(2)}<span className="text-pink-300">)</span> × {(equipPct / 100).toFixed(2)}
                  {" "}= <span className="text-white">{result.equipContrib.toFixed(1)}</span>
                </p>
              </div>
            </div>

            <div className="border-t border-white/10 pt-3">
              <p className="mb-1 text-sm font-bold text-green-400">⚡ Final ASPD</p>
              <p className="text-white/70">Final ASPD = Base ASPD + Equip ASPD % + Flat ASPD, then round down and cap at {maxASPD}</p>
              <p className="mt-1 text-base font-bold text-green-300">
                = {result.baseASPD.toFixed(2)} + {result.equipContrib.toFixed(1)} + {flatASPD}
                {" "}= <span className="text-white">{result.finalRaw.toFixed(2)}</span>
                {" "}→ <span className="text-lg text-green-200">{result.final}</span>
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}