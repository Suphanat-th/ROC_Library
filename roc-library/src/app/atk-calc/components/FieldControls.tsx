import React from "react";

export function InputField({
  label,
  value,
  onChange,
  min = 0,
  max = 99999,
  suffix,
  hint,
  hideLabel,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  hint?: string;
  /** Keep the label for screen readers only (used when a row heading already names the field) */
  hideLabel?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label
        className={
          hideLabel
            ? "sr-only"
            : "text-xs font-bold uppercase tracking-widest text-primary"
        }
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          type="number"
          className="input input-bordered input-sm w-full pr-10"
          value={value}
          min={min}
          max={max}
          onChange={(event) => {
            // An empty or invalid entry counts as 0
            const parsed = parseFloat(event.target.value);
            const next = Number.isNaN(parsed) ? 0 : parsed;
            onChange(Math.min(max, Math.max(min, next)));
          }}
        />
        {suffix ? (
          <span className="absolute right-3 text-xs text-base-content/50">{suffix}</span>
        ) : null}
      </div>
      {hint ? <p className="text-xs leading-tight text-base-content/50">{hint}</p> : null}
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
      <label className="text-xs font-bold uppercase tracking-widest text-primary">
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs leading-tight text-base-content/50">{hint}</p> : null}
    </div>
  );
}
