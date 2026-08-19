export default function ASPDGauge({ aspd, max = 193 }: { aspd: number; max?: number }) {
  const pct = Math.min(1, Math.max(0, aspd / max));
  const r = 82;
  const sw = 12;
  const circ = 2 * Math.PI * r;
  const dash = circ * pct;
  const gap = circ - dash;

  const hue = Math.round(pct * 120);
  const color = `hsl(${hue}, 95%, 60%)`;
  const attacksPerSec = aspd > 0 && aspd < 200 ? (50 / (200 - aspd)).toFixed(2) : "—";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-52 w-52">
        <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
          <defs>
            <filter id="glow-arc" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth={sw}
            strokeLinecap="butt"
          />
          <circle
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={sw}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${gap}`}
            filter="url(#glow-arc)"
            style={{ transition: "stroke-dasharray 0.4s ease, stroke 0.4s ease" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black tabular-nums" style={{ color, textShadow: `0 0 18px ${color}` }}>
            {aspd}
          </span>
          <span className="mt-1 text-xs font-semibold uppercase tracking-widest text-white/30">
            ASPD
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-white/50">
          ⚡ <span className="font-bold text-white">{attacksPerSec}</span> attacks/sec
        </p>
      </div>
    </div>
  );
}