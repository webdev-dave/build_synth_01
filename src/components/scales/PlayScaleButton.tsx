"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Play, Square } from "lucide-react";

import { noteNumberToFrequency } from "@/instruments/synth/templates/basic-synth/utils/synthUtils";
import { Button } from "@/components/ui/button";

/*
 * Motion follows music: the run is timed as straight eighth notes at a
 * relaxed 100 BPM, not an arbitrary animation duration.
 */
const BPM = 100;
const STEP_SEC = 60 / BPM / 2;

interface PlayScaleButtonProps {
  label: string;
  /** MIDI note numbers, ascending. Played up and (optionally) back down. */
  noteNumbers: number[];
  descend?: boolean;
  audioContext: AudioContext | null;
  initializeAudio: () => Promise<void>;
  scheduleNote: (frequency: number, startTime: number, duration: number) => void;
  /** Fires as each note sounds (and with null when the run ends) so the page can light the key. */
  onHighlight?: (noteNumber: number | null) => void;
  className?: string;
}

/**
 * Plays a scale so non-players can hear its character. Audio is scheduled
 * sample-accurately on the AudioContext clock; the visual highlight follows
 * on timers — the same one-scheduler-owns-truth pattern as the piano roll.
 */
export function PlayScaleButton({
  label,
  noteNumbers,
  descend = true,
  audioContext,
  initializeAudio,
  scheduleNote,
  onHighlight,
  className,
}: PlayScaleButtonProps) {
  const [playing, setPlaying] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const onHighlightRef = useRef(onHighlight);
  onHighlightRef.current = onHighlight;

  const clearTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const stop = useCallback(() => {
    clearTimers();
    onHighlightRef.current?.(null);
    setPlaying(false);
  }, [clearTimers]);

  // Never leave timers (or a lit key) behind after unmount.
  useEffect(() => () => clearTimers(), [clearTimers]);

  const play = useCallback(async () => {
    if (!audioContext) return;
    await initializeAudio();

    const run = descend
      ? [...noteNumbers, ...noteNumbers.slice(0, -1).reverse()]
      : [...noteNumbers];

    const t0 = audioContext.currentTime + 0.06;
    run.forEach((n, i) => {
      scheduleNote(noteNumberToFrequency(n), t0 + i * STEP_SEC, STEP_SEC * 0.95);
      timersRef.current.push(
        setTimeout(() => onHighlightRef.current?.(n), (0.06 + i * STEP_SEC) * 1000),
      );
    });
    timersRef.current.push(
      setTimeout(() => {
        onHighlightRef.current?.(null);
        setPlaying(false);
      }, (0.06 + run.length * STEP_SEC) * 1000),
    );
    setPlaying(true);
  }, [audioContext, initializeAudio, scheduleNote, noteNumbers, descend]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={playing ? stop : play}
      className={className}
    >
      {playing ? (
        <Square className="h-3.5 w-3.5" />
      ) : (
        <Play className="h-3.5 w-3.5" />
      )}
      {label}
    </Button>
  );
}
