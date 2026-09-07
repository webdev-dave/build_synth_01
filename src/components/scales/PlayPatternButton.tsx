"use client";

import { useMemo } from "react";

import { PlayScaleButton } from "./PlayScaleButton";
import { useScaleLesson } from "./ScaleLessonProvider";

interface PlayPatternButtonProps {
  label: string;
  /** Semitone offsets above the root, ascending (e.g. a scale pattern). */
  offsets: readonly number[];
  /** Finish the run on the octave above the root. */
  withOctave?: boolean;
  /** Play back down after reaching the top. */
  descend?: boolean;
  className?: string;
}

/**
 * "Play this pattern" wired to the lesson state: the run always starts on
 * the root at the bottom of the current window, so shifting the octave moves
 * what you hear as well as what you see.
 */
export function PlayPatternButton({
  label,
  offsets,
  withOctave = true,
  descend = true,
  className,
}: PlayPatternButtonProps) {
  const { rootMidi, audioContext, initializeAudio, scheduleNote, setHighlight } =
    useScaleLesson();
  const noteNumbers = useMemo(
    () => [...offsets, ...(withOctave ? [12] : [])].map((o) => rootMidi + o),
    [offsets, withOctave, rootMidi],
  );

  return (
    <PlayScaleButton
      label={label}
      noteNumbers={noteNumbers}
      descend={descend}
      audioContext={audioContext}
      initializeAudio={initializeAudio}
      scheduleNote={scheduleNote}
      onHighlight={setHighlight}
      className={className}
    />
  );
}
