import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  /** item name, used in the button labels */
  name: string;
  quantity: number;
  onChange: (delta: 1 | -1) => void;
}

/** − 0 + control: how many times to exchange for one reward. */
export default function QuantityStepper({ name, quantity, onChange }: QuantityStepperProps) {
  const button =
    "flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-(--anv-orange) bg-base-100 hover:bg-(--anv-orange)/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--anv-orange) disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-base-100";
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label={`ลด ${name}`}
        disabled={quantity === 0}
        onClick={() => onChange(-1)}
        className={button}
      >
        <Minus aria-hidden className="h-4 w-4" />
      </button>
      <span
        aria-live="polite"
        className={`min-w-10 rounded-full px-2 py-1 text-center text-sm font-black ${
          quantity > 0
            ? "bg-(--anv-orange) text-(--anv-ink)"
            : "bg-base-200 text-base-content/70"
        }`}
      >
        ×{quantity}
      </span>
      <button
        type="button"
        aria-label={`เพิ่ม ${name}`}
        onClick={() => onChange(1)}
        className={button}
      >
        <Plus aria-hidden className="h-4 w-4" />
      </button>
    </div>
  );
}
