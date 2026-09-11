"use client";

import { FLAT_NOTE_NAMES } from "./notes";
import { cn } from "@/lib/utils";

interface RootNotePickerProps {
  /** Pitch class 0–11, C = 0. */
  value: number;
  onChange: (pitchClass: number) => void;
  /**
   * Label per pitch class. Defaults to flat names; a lesson passes the
   * names its own scale would use so the picker agrees with the prose
   * (G♯ for freygish, A♭ for Ukrainian Dorian, same key).
   */
  names?: readonly string[];
  className?: string;
}

/**
 * Transposes every widget on a scale lesson page at once — the lesson holds
 * one root state and derives keyboard, degree strip, and playback from it.
 */
export function RootNotePicker({
  value,
  onChange,
  names = FLAT_NOTE_NAMES,
  className,
}: RootNotePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Root note"
      className={cn("flex flex-wrap gap-1", className)}
    >
      {names.map((name, pc) => {
        const selected = pc === value;
        return (
          <button
            key={name}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(pc)}
            className={cn(
              "min-w-9 rounded-md border px-2 py-1.5 font-mono text-xs transition-colors",
              selected
                ? "border-foreground/60 bg-foreground text-background"
                : "text-muted-foreground hover:border-foreground/25 hover:text-foreground",
            )}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
}
