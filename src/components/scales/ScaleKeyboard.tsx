"use client";

import { useCallback, useMemo } from "react";

import { LessonKeyboard } from "./LessonKeyboard";
import { useScaleLesson } from "./ScaleLessonProvider";
import type { ScaleDegree } from "./notes";

interface ScaleKeyboardProps {
  /** The pattern this keyboard teaches — lights these degrees, locks the rest. */
  degrees: ScaleDegree[];
  /** Ignore the page-wide lock (e.g. a keyboard that should always be open). */
  lockToScale?: boolean;
  className?: string;
}

/**
 * The lesson keyboard, wired to the shared lesson state. Several can sit on
 * one page (each showing a different pattern); they share root, octave, and
 * audio, so a note lit here is genuinely the note that is sounding.
 */
export function ScaleKeyboard({
  degrees,
  lockToScale,
  className,
}: ScaleKeyboardProps) {
  const {
    keys,
    rootMidi,
    rootPc,
    displayActiveKeys,
    lockToScale: pageLock,
    startNote,
    stopNote,
  } = useScaleLesson();

  const offsets = useMemo(() => new Set(degrees.map((d) => d.offset)), [degrees]);
  const isNoteInScale = useCallback(
    (noteNumber: number) => offsets.has((((noteNumber - rootMidi) % 12) + 12) % 12),
    [offsets, rootMidi],
  );
  const scaleDegrees = useMemo(() => {
    const map: (string | null)[] = Array(12).fill(null);
    for (const d of degrees) map[(rootPc + d.offset) % 12] = d.label;
    return map;
  }, [rootPc, degrees]);

  return (
    <LessonKeyboard
      keys={keys}
      activeKeys={displayActiveKeys}
      isNoteInScale={isNoteInScale}
      lockToScale={lockToScale ?? pageLock}
      scaleDegrees={scaleDegrees}
      onNoteStart={startNote}
      onNoteStop={stopNote}
      className={className}
    />
  );
}
