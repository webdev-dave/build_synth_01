"use client";

import { Minus, Plus } from "lucide-react";

import { useScaleLesson } from "./ScaleLessonProvider";
import { cn } from "@/lib/utils";

/**
 * Moves the whole lesson up or down an octave — keyboard window, degree
 * chips, and every scheduled run follow, because they all derive from the
 * provider's `rootMidi`. Exists because small speakers can't reproduce the
 * bottom of the default register; a user who can't hear the low keys must
 * be able to lift them, not just be told they're there.
 */
export function OctaveStepper({ className }: { className?: string }) {
  const { rootName, octave, minOctave, maxOctave, shiftOctave } =
    useScaleLesson();
  const btn =
    "px-2 py-1.5 text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div
      className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}
    >
      <span className="text-xs">Octave</span>
      <div
        role="group"
        aria-label="Octave"
        className="inline-flex items-center overflow-hidden rounded-md border border-input"
      >
        <button
          type="button"
          aria-label="Octave down"
          onClick={() => shiftOctave(-1)}
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
          onClick={() => shiftOctave(1)}
          disabled={octave >= maxOctave}
          className={btn}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
