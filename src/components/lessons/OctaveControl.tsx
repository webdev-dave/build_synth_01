"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

interface OctaveControlProps {
  /** Root name shown beside the octave number ("A"). */
  rootName: string;
  octave: number;
  minOctave: number;
  maxOctave: number;
  onShift: (delta: number) => void;
  className?: string;
}

/**
 * The octave stepper, presentational. Every lesson module has a keyboard
 * window to move; each module's provider owns the state and hands it here,
 * so the control looks identical on a scale page and a progression page.
 */
export function OctaveControl({
  rootName,
  octave,
  minOctave,
  maxOctave,
  onShift,
  className,
}: OctaveControlProps) {
  const btn =
    "px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="text-xs">Octave</span>
      <div
        role="group"
        aria-label="Octave"
        className="inline-flex items-center overflow-hidden rounded-md border border-input"
      >
        <button
          type="button"
          aria-label="Octave down"
          onClick={() => onShift(-1)}
          disabled={octave <= minOctave}
          className={btn}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span
          className="min-w-12 border-x border-input px-2 text-center font-mono text-xs text-foreground"
          aria-live="polite"
        >
          {rootName}
          {octave}
        </span>
        <button
          type="button"
          aria-label="Octave up"
          onClick={() => onShift(1)}
          disabled={octave >= maxOctave}
          className={btn}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
