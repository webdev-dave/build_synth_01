"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { noteNumberToFrequency } from "@/instruments/synth/templates/basic-synth/utils/synthUtils";
import { ScaleDegreeStrip } from "./ScaleDegreeStrip";
import { useScaleLesson } from "./ScaleLessonProvider";
import type { ScaleDegree } from "./notes";

/** Length of a clicked degree chip's tone. */
const DEGREE_NOTE_SEC = 0.45;

interface DegreeStripProps {
  degrees: ScaleDegree[];
  /** The one offset that gets the burnt-orange spotlight, if any. */
  spotlightOffset?: number;
  className?: string;
}

/**
 * Clickable degree chips wired to the lesson state. Each chip sounds its
 * note in the current root + octave and lights the matching key on every
 * keyboard on the page.
 */
export function DegreeStrip({
  degrees,
  spotlightOffset,
  className,
}: DegreeStripProps) {
  const { rootPc, rootMidi, audioContext, initializeAudio, scheduleNote, setHighlight } =
    useScaleLesson();
  const [activeOffset, setActiveOffset] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const playDegree = useCallback(
    async (offset: number) => {
      if (!audioContext) return;
      await initializeAudio();
      scheduleNote(
        noteNumberToFrequency(rootMidi + offset),
        audioContext.currentTime + 0.02,
        DEGREE_NOTE_SEC,
      );
      setActiveOffset(offset);
      setHighlight(rootMidi + offset);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        setActiveOffset(null);
        setHighlight(null);
      }, DEGREE_NOTE_SEC * 1000);
    },
    [audioContext, initializeAudio, scheduleNote, rootMidi, setHighlight],
  );

  return (
    <ScaleDegreeStrip
      degrees={degrees}
      rootPitchClass={rootPc}
      spotlightOffset={spotlightOffset}
      activeOffset={activeOffset}
      onPlay={playDegree}
      className={className}
    />
  );
}
