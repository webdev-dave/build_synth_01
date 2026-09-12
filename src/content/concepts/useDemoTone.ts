"use client";

/**
 * The concept demos' one-line way to sound plain tones: shared context,
 * consent inside the gesture (`initializeAudio` runs in the click handler),
 * absolute times on the context clock, output through the lesson bus.
 *
 * Returns the context time the run starts at so the caller can line up
 * highlights with the same offsets it scheduled.
 */
import { useCallback, useEffect, useRef } from "react";

import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import { getLessonBus } from "@/lib/audio/bus";
import { toneAt, type ToneShape } from "@/lib/audio/voices/tone";

export interface DemoNote {
  hz: number;
  /** Seconds after the run starts. */
  at: number;
  duration: number;
  shape?: ToneShape;
}

const LEAD_IN = 0.05;

export function useDemoTone() {
  const { audioContext, initializeAudio } = useSharedAudioContext();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  /** Schedule visual callbacks at the same offsets as the notes. */
  const after = useCallback((seconds: number, fn: () => void) => {
    timers.current.push(setTimeout(fn, (LEAD_IN + seconds) * 1000));
  }, []);

  const play = useCallback(
    async (notes: readonly DemoNote[]): Promise<boolean> => {
      if (!audioContext) return false;
      await initializeAudio();
      const bus = getLessonBus(audioContext);
      const t0 = audioContext.currentTime + LEAD_IN;
      for (const n of notes) {
        toneAt(audioContext, bus, n.hz, t0 + n.at, n.duration, { shape: n.shape });
      }
      return true;
    },
    [audioContext, initializeAudio],
  );

  return { play, after, clearTimers, ready: Boolean(audioContext) };
}
