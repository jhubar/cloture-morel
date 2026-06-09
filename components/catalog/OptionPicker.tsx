"use client";

import { cn } from "@/lib/utils";

interface OptionPickerProps {
  label: string;
  name: string;
  value: string | null;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}

/** Pill-style option selector (section, hauteur, modèle…). */
export function OptionPicker({
  label,
  name,
  value,
  options,
  onChange,
  className,
}: OptionPickerProps) {
  if (options.length === 0) return null;

  return (
    <fieldset className={cn("min-w-0 space-y-2.5", className)}>
      <legend className="text-sm font-medium text-forest-dark">{label}</legend>
      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label={label}
      >
        {options.map((option) => {
          const selected = value === option;
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={selected}
              name={name}
              onClick={() => onChange(option)}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border px-3.5 py-2 text-sm font-medium whitespace-nowrap transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 sm:px-4",
                selected
                  ? "border-forest bg-forest text-white shadow-sm"
                  : "border-sand-300 bg-white text-bark hover:border-forest/50 hover:bg-sand/40",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
