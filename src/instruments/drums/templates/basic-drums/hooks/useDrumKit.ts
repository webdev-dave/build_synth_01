"use client";

/**
 * The drum kit, bound to the shared AudioContext and the lesson bus.
 *
 * `hit()` sounds one voice now (a tap on a grid cell — the gesture is the
 * audio consent), `hitAt()` schedules one at an absolute time for the
 * clock. The voices themselves are pure recipes in
 * `src/lib/audio/voices/drums.ts`; this hook only supplies the context.
 * The kit is a swappable map so a sampler variant can replace the
 * synthesized voices without touching `StepGrid` or the clock.
 */
import { useCallback, useMemo } from "react";

import { useSharedAudioContext } from "@/contexts/AudioContext";
import { getLessonBus } from "@/lib/audio/bus";
import { DRUM_KIT, type DrumHitFn } from "@/lib/audio/voices/drums";
import type { DrumVoice } from "@/lib/music/grooves";

export type DrumKitMap = Record<DrumVoice, DrumHitFn>;

export interface DrumKit {
  audioContext: AudioContext | null;
  /** Resume the shared context — call inside any gesture that will sound. */
  ensureAudio: () => Promise<void>;
  /** Schedule a hit at an absolute context time (the clock's `fire`). */
  hitAt: (voice: DrumVoice, when: number, velocity?: number) => void;
  /** Sound a hit now, unlocking audio first if needed. */
  hit: (voice: DrumVoice, velocity?: number) => void;
}

export function useDrumKit(kit: DrumKitMap = DRUM_KIT): DrumKit {
  const { audioContext, initializeAudio } = useSharedAudioContext();

  const hitAt = useCallback(
    (voice: DrumVoice, when: number, velocity = 1) => {
      if (!audioContext) return;
      kit[voice](audioContext, getLessonBus(audioContext), when, velocity);
    },
    [audioContext, kit],
  );

  const hit = useCallback(
    (voice: DrumVoice, velocity = 1) => {
      void initializeAudio().then(() => {
        if (!audioContext) return;
        hitAt(voice, audioContext.currentTime + 0.01, velocity);
      });
    },
    [initializeAudio, audioContext, hitAt],
  );

  return useMemo(
    () => ({ audioContext, ensureAudio: initializeAudio, hitAt, hit }),
    [audioContext, initializeAudio, hitAt, hit],
  );
}
