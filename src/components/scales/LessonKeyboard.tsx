"use client";

import { KeyboardV2 } from "@/instruments/synth/v2/KeyboardV2";
import type { SynthKey } from "@/instruments/synth/templates/basic-synth/utils/synthUtils";
import { cn } from "@/lib/utils";

interface LessonKeyboardProps {
  keys: SynthKey[];
  activeKeys: Set<string>;
  isNoteInScale: (noteNumber: number) => boolean;
  /** Same lock as the synth: out-of-scale keys get a red dot and won't play. */
  lockToScale?: boolean;
  /**
   * Pitch class (0–11) → degree label. Same prop KeyboardV2 already uses
   * for the synth's "numbers" toggle.
   */
  scaleDegrees: (number | string | null)[] | null;
  onNoteStart: (noteNumber: number, note: string) => void;
  onNoteStop: (note: string) => void;
  className?: string;
}

/**
 * The synth's KeyboardV2, minus the synth page chrome. Lock, green
 * in-scale numbers, and red locked-out dots are the keyboard's own
 * behavior — this wrapper just passes the lesson's scale state through.
 */
export function LessonKeyboard({
  keys,
  activeKeys,
  isNoteInScale,
  lockToScale = true,
  scaleDegrees,
  onNoteStart,
  onNoteStop,
  className,
}: LessonKeyboardProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border", className)}>
      <KeyboardV2
        keys={keys}
        activeKeys={activeKeys}
        hasScale
        lockToScale={lockToScale}
        isNoteInScale={isNoteInScale}
        scaleDegrees={scaleDegrees}
        keyLabels={null}
        onNoteStart={onNoteStart}
        onNoteStop={onNoteStop}
      />
    </div>
  );
}
