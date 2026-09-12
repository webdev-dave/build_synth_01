"use client";

import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  id: T;
  label: string;
  /** Spoken label when the visible one is a symbol or abbreviation. */
  ariaLabel?: string;
}

interface SegmentedProps<T extends string> {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (id: T) => void;
  /** Group label for screen readers ("Voicing", "Lock"). */
  label: string;
  className?: string;
}

/**
 * A small exclusive-choice control for lesson toolbars — one of a few
 * modes, always exactly one on. Quieter than tabs: the chosen segment is a
 * neutral fill, never the accent, because switching a mode is a setting,
 * not the thing that is sounding.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex overflow-hidden rounded-md border border-input", className)}
    >
      {options.map((opt) => {
        const on = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            aria-pressed={on}
            aria-label={opt.ariaLabel}
            onClick={() => onChange(opt.id)}
            className={cn(
              "border-l border-input px-3 py-1.5 text-xs font-medium transition-colors first:border-l-0",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              on
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
