import React from "react";

export function InputField({
  label,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest text-sky-300">
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 pr-10 text-sm text-white transition-all focus:border-sky-400/60 focus:outline-none focus:ring-1 focus:ring-sky-400/30"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(event) => {
            const nextValue = parseFloat(event.target.value);
            if (!Number.isNaN(nextValue)) {
              onChange(Math.min(max, Math.max(min, nextValue)));
            }
          }}
        />
        {suffix ? (
          <span className="absolute right-3 text-xs text-white/40">{suffix}</span>
        ) : null}
      </div>
      {hint ? <p className="text-xs leading-tight text-white/30">{hint}</p> : null}
    </div>
  );
}

export function SelectField({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-bold uppercase tracking-widest text-sky-300">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs leading-tight text-white/30">{hint}</p> : null}
    </div>
  );
}