"use client";

/**
 * `StepGrid` bound to the page clock: the lit column and the sweep line
 * follow `beatNow()` on every frame, positioned at the swing this grid
 * plays at (which may differ from the clock's — a comparer runs a straight
 * and a shuffled pattern side by side on one playhead).
 */
import { useEffect, useRef } from "react";

import { useClockDerived, useLessonClock } from "@/components/lessons/LessonClock";
import {
  setPlayhead,
  StepGrid,
  type StepGridProps,
} from "@/instruments/drums/templates/basic-drums/components/StepGrid";
import { beatsPerBar, stepAtBeat } from "@/lib/music/grooves";

type ClockStepGridProps = Omit<StepGridProps, "currentStep" | "playheadRef" | "swing"> & {
  swing: number;
  /** Ignore the clock — a resting grid (the comparer's silent side). */
  silent?: boolean;
};

export function ClockStepGrid({ pattern, swing, silent = false, ...rest }: ClockStepGridProps) {
  const { subscribe, beatNow, playing } = useLessonClock();
  const bpb = beatsPerBar(pattern.meter);

  const currentStep = useClockDerived((beat) =>
    silent || beat == null || beat < 0 ? null : stepAtBeat(pattern, swing, beat),
  );

  const playheadRef = useRef<HTMLDivElement | null>(null);
  useEffect(
    () =>
      subscribe(() => {
        const beat = beatNow();
        setPlayhead(
          playheadRef.current,
          silent || beat == null || beat < 0 ? null : (((beat % bpb) + bpb) % bpb) / bpb,
        );
      }),
    [subscribe, beatNow, bpb, silent],
  );
  useEffect(() => {
    if (!playing || silent) setPlayhead(playheadRef.current, null);
  }, [playing, silent]);

  return (
    <StepGrid
      pattern={pattern}
      swing={swing}
      currentStep={currentStep}
      playheadRef={playheadRef}
      {...rest}
    />
  );
}
