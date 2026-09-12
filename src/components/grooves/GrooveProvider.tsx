"use client";

/**
 * One shared state for every widget on a groove lesson page.
 *
 * The grid, the count-along, the accent strip, and the feel slider must
 * agree: the dot that lights is the hit that sounds, at the swing the
 * slider shows, at the tempo the slider says. This provider owns the
 * editable pattern (with a reset back to the registry preset), the muted
 * voices, and the kit, and registers the one drum track on the page's
 * clock. Swing and tempo live on the clock itself, so a comparer or the
 * progression player can read the same values.
 *
 * Grooves loop by default — one bar is too short to hear — but the loop is
 * a visible toggle and Stop is always one click away.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  LessonClockProvider,
  useClockDerived,
  useClockTrack,
  useLessonClock,
} from "@/components/lessons/LessonClock";
import { useDrumKit, type DrumKit } from "@/instruments/drums/templates/basic-drums/hooks/useDrumKit";
import type { Groove } from "@/lib/grooves/registry";
import type { ClockEvent } from "@/lib/music/clock";
import {
  beatsPerBar,
  sameHits,
  stepAtBeat,
  toggleHit,
  type DrumVoice,
  type GroovePattern,
} from "@/lib/music/grooves";

export interface GrooveState {
  groove: Groove;
  /** The pattern as it stands — the preset, or the reader's edits. */
  pattern: GroovePattern;
  edited: boolean;
  toggle: (voice: DrumVoice, step: number, velocity: number) => void;
  reset: () => void;
  muted: ReadonlySet<DrumVoice>;
  toggleMute: (voice: DrumVoice) => void;
  /** Mute everything but this voice (or clear a solo of it). */
  solo: (voice: DrumVoice) => void;
  beatsPerBar: number;
  /** Straight-grid step that is sounding, or null when stopped. */
  currentStep: number | null;
  /** Felt beat that is sounding (0-based), or null when stopped. */
  currentBeat: number | null;
  kit: DrumKit;
  /** Preview one voice now — the tap on a cell. */
  tap: (voice: DrumVoice, velocity?: number) => void;
}

const GrooveContext = createContext<GrooveState | null>(null);

export function useGroove(): GrooveState {
  const ctx = useContext(GrooveContext);
  if (!ctx) throw new Error("Groove widgets must render inside <GrooveProvider>.");
  return ctx;
}

interface GrooveProviderProps {
  groove: Groove;
  /** Open at a different tempo than the registry's comfortable one. */
  bpm?: number;
  /** Open at a different feel (a shuffle lesson may start straight and arrive). */
  swing?: number;
  loop?: boolean;
  children: ReactNode;
}

export function GrooveProvider({ groove, bpm, swing, loop = true, children }: GrooveProviderProps) {
  return (
    <LessonClockProvider
      bpm={bpm ?? groove.pattern.bpm}
      swing={swing ?? groove.pattern.swing}
      loop={loop}
      lengthBeats={beatsPerBar(groove.pattern.meter)}
    >
      <GrooveStateProvider groove={groove}>{children}</GrooveStateProvider>
    </LessonClockProvider>
  );
}

function GrooveStateProvider({ groove, children }: { groove: Groove; children: ReactNode }) {
  const { swing, audioContext } = useLessonClock();
  const kit = useDrumKit();
  const [pattern, setPattern] = useState<GroovePattern>(groove.pattern);
  const [muted, setMuted] = useState<ReadonlySet<DrumVoice>>(() => new Set());

  const bpb = beatsPerBar(pattern.meter);
  const edited = !sameHits(pattern.hits, groove.pattern.hits);

  const toggle = useCallback(
    (voice: DrumVoice, step: number, velocity: number) =>
      setPattern((p) => toggleHit(p, voice, step, velocity)),
    [],
  );
  const reset = useCallback(() => setPattern(groove.pattern), [groove.pattern]);

  const toggleMute = useCallback(
    (voice: DrumVoice) =>
      setMuted((m) => {
        const next = new Set(m);
        if (next.has(voice)) next.delete(voice);
        else next.add(voice);
        return next;
      }),
    [],
  );
  const solo = useCallback(
    (voice: DrumVoice) =>
      setMuted((m) => {
        const others = new Set(pattern.hits.map((h) => h.voice).filter((v) => v !== voice));
        const alreadySolo = !m.has(voice) && [...others].every((v) => m.has(v)) && others.size > 0;
        return alreadySolo ? new Set() : others;
      }),
    [pattern.hits],
  );

  // The drum track: every unmuted hit, read fresh each cycle so an edit or
  // a mute lands on the next bar without stopping the clock. Swing is the
  // clock's — the slider moves the sound and the dots together.
  const patternRef = useRef(pattern);
  patternRef.current = pattern;
  const mutedRef = useRef(muted);
  mutedRef.current = muted;
  useClockTrack(
    {
      id: `groove-${groove.slug}`,
      stepsPerBeat: pattern.stepsPerBeat,
      events: () => {
        if (!audioContext) return [];
        const events: ClockEvent[] = [];
        for (const h of patternRef.current.hits) {
          if (mutedRef.current.has(h.voice)) continue;
          events.push({
            at: h.at,
            duration: 0,
            fire: (when) => kit.hitAt(h.voice, when, h.velocity),
          });
        }
        return events;
      },
    },
    [audioContext, kit, pattern.stepsPerBeat, groove.slug],
  );

  const currentStep = useClockDerived((beat) =>
    beat == null || beat < 0 ? null : stepAtBeat(pattern, swing, beat),
  );
  const currentBeat = useClockDerived((beat) =>
    beat == null || beat < 0 ? null : Math.floor(((beat % bpb) + bpb) % bpb),
  );

  const tap = useCallback(
    (voice: DrumVoice, velocity = 0.85) => kit.hit(voice, velocity),
    [kit],
  );

  const value = useMemo<GrooveState>(
    () => ({
      groove,
      pattern,
      edited,
      toggle,
      reset,
      muted,
      toggleMute,
      solo,
      beatsPerBar: bpb,
      currentStep,
      currentBeat,
      kit,
      tap,
    }),
    [groove, pattern, edited, toggle, reset, muted, toggleMute, solo, bpb, currentStep, currentBeat, kit, tap],
  );

  return <GrooveContext.Provider value={value}>{children}</GrooveContext.Provider>;
}
