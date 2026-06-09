"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}

/** Accessible +/- quantity control with a numeric input. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 9999,
  size = "md",
  label = "Quantité",
}: QuantityStepperProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const btn =
    "grid place-items-center text-forest-dark transition-colors hover:bg-sand-200 disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer";
  const dim = size === "sm" ? "h-11 w-11" : "h-11 w-11";
  const inputDim = size === "sm" ? "h-11 w-12 text-sm" : "h-11 w-14";

  return (
    <div className="inline-flex items-center rounded-full border border-sand-300 bg-white">
      <button
        type="button"
        className={cn(btn, dim, "rounded-l-full")}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label="Diminuer la quantité"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        className={cn(
          inputDim,
          "[appearance:textfield] border-x border-sand-300 text-center font-medium text-forest-dark outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const next = Number.parseInt(e.target.value, 10);
          onChange(Number.isNaN(next) ? min : clamp(next));
        }}
      />
      <button
        type="button"
        className={cn(btn, dim, "rounded-r-full")}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label="Augmenter la quantité"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
