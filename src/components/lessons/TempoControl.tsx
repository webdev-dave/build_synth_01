"use client";

import { useLessonClock } from "@/components/lessons/LessonClock";
import { cn } from "@/lib/utils";

interface TempoControlProps {
  min?: number;
  max?: number;
  className?: string;
}

/**
 * The tempo slider every lesson player carries, bound to the page's clock.
 * Slow is confident: the range reaches down to where an empty beat 1 or a
 * swung "&" stops being a blur.
 */
export function TempoControl({ min = 40, max = 160, className }: TempoControlProps) {
  const { bpm, setBpm } = useLessonClock();
  return (
    <label className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
      <span className="text-xs">Tempo</span>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={bpm}
        onChange={(e) => setBpm(Number(e.target.value))}
        aria-label="Tempo in beats per minute"
        className="h-1.5 w-28 cursor-pointer accent-foreground"
      />
      <span className="min-w-14 font-mono text-xs text-foreground">{bpm} BPM</span>
    </label>
  );
}
