"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CardOption {
  value: string;
  label: string;
  icon?: LucideIcon;
  /** Optional short cue under the label. */
  hint?: string;
}

interface OptionCardGroupProps {
  /** Radio group name (shared by every option). */
  name: string;
  /** Question label shown above the cards. */
  legend: string;
  /** Optional helper sentence under the legend. */
  helper?: string;
  options: CardOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  /** Tailwind grid columns class for the cards (defaults to auto responsive). */
  columnsClassName?: string;
}

/**
 * Accessible radio group rendered as tappable icon cards. Each card is a real
 * `<label>` wrapping a visually-hidden `<input type="radio">`, so keyboard and
 * screen-reader behaviour is preserved while the UI stays visual and friendly.
 */
export function OptionCardGroup({
  name,
  legend,
  helper,
  options,
  value,
  onChange,
  error,
  columnsClassName = "sm:grid-cols-3",
}: OptionCardGroupProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-forest-dark">{legend}</legend>
      {helper && <p className="mt-1 text-xs text-bark-muted">{helper}</p>}

      <div className={cn("mt-2.5 grid gap-2.5", columnsClassName)}>
        {options.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "group flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-3 transition-all focus-within:ring-2 focus-within:ring-terracotta/50",
                selected
                  ? "border-terracotta ring-1 ring-terracotta"
                  : "border-sand-300 hover:border-terracotta/40 hover:bg-terracotta/5",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {Icon && (
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full transition-colors",
                    selected
                      ? "bg-terracotta text-white"
                      : "bg-terracotta/10 text-terracotta group-hover:bg-terracotta/20",
                  )}
                >
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                </span>
              )}
              <span className="min-w-0">
                <span
                  className={cn(
                    "block text-sm font-medium",
                    selected ? "text-forest-dark" : "text-bark",
                  )}
                >
                  {option.label}
                </span>
                {option.hint && (
                  <span className="mt-0.5 block text-xs text-bark-muted">
                    {option.hint}
                  </span>
                )}
              </span>
            </label>
          );
        })}
      </div>

      {error && <p className="mt-1.5 text-xs text-terracotta-dark">{error}</p>}
    </fieldset>
  );
}
