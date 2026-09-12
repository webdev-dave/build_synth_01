"use client";

/**
 * React binding for the lesson clock (src/lib/music/clock.ts).
 *
 * One provider per lesson page. Widgets register tracks (what to sound) and
 * read the position (what to light) through hooks; the provider owns the
 * engine, the scheduler interval, and the animation-frame loop. Audio-side
 * state lives in refs — React state holds only what the user sees change
 * (playing, bpm, swing, loop), never the per-step position.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import {
  ClockEngine,
  STRAIGHT,
  type ClockTrack,
} from "@/lib/music/clock";

/** Scheduler tick — coarse on purpose; the audio thread does the precision. */
const TICK_MS = 25;

export interface LessonClockState {
  bpm: number;
  setBpm: (bpm: number) => void;
  swing: number;
  setSwing: (swing: number) => void;
  loop: boolean;
  setLoop: (loop: boolean) => void;
  playing: boolean;
  lengthBeats: number;
  /** Start (this is the audio-consent gesture). Optionally from a beat. */
  play: (fromBeat?: number) => Promise<void>;
  stop: () => void;
  /** Register a track; returns the remover. */
  addTrack: (track: ClockTrack) => () => void;
  /** Linear beat position now, or null when stopped. Read on rAF. */
  beatNow: () => number | null;
  /** Add a listener for rAF-driven position updates while playing. */
  subscribe: (listener: () => void) => () => void;
  /** Cycles completed since play — a "chorus 2 of 3" read-out. */
  cycle: number;
  audioContext: AudioContext | null;
  /** Resume the shared context — call inside any gesture that will sound. */
  ensureAudio: () => Promise<void>;
}

const LessonClockContext = createContext<LessonClockState | null>(null);

export function useLessonClock(): LessonClockState {
  const ctx = useContext(LessonClockContext);
  if (!ctx) throw new Error("Lesson widgets must render inside <LessonClockProvider>.");
  return ctx;
}

/** Optional variant for widgets that also work without a clock. */
export function useOptionalLessonClock(): LessonClockState | null {
  return useContext(LessonClockContext);
}

interface LessonClockProviderProps {
  bpm?: number;
  swing?: number;
  loop?: boolean;
  /** Beats per cycle (48 for 12 bars of 4/4). */
  lengthBeats: number;
  countInBeats?: number;
  children: ReactNode;
}

export function LessonClockProvider({
  bpm: initialBpm = 90,
  swing: initialSwing = STRAIGHT,
  loop: initialLoop = false,
  lengthBeats,
  countInBeats = 0,
  children,
}: LessonClockProviderProps) {
  const { audioContext, initializeAudio } = useSharedAudioContext();
  const [bpm, setBpmState] = useState(initialBpm);
  const [swing, setSwingState] = useState(initialSwing);
  const [loop, setLoopState] = useState(initialLoop);
  const [playing, setPlaying] = useState(false);
  const [cycle, setCycle] = useState(0);

  const engineRef = useRef<ClockEngine | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const rafRef = useRef<number | null>(null);
  const listeners = useRef(new Set<() => void>());
  const pendingTracks = useRef(new Map<string, ClockTrack>());

  const getEngine = useCallback(() => {
    if (engineRef.current) return engineRef.current;
    if (!audioContext) return null;
    const engine = new ClockEngine(audioContext, {
      bpm,
      swing,
      loop,
      lengthBeats,
      countInBeats,
    });
    for (const track of pendingTracks.current.values()) engine.addTrack(track);
    engine.onStop(() => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
      setPlaying(false);
    });
    engine.onCycle((c) => setCycle(c));
    engineRef.current = engine;
    return engine;
  }, [audioContext, bpm, swing, loop, lengthBeats, countInBeats]);

  // Keep the engine's live parameters in step with the user's controls.
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.swing = swing;
    engine.loop = loop;
    engine.lengthBeats = lengthBeats;
  }, [swing, loop, lengthBeats]);

  const setBpm = useCallback((next: number) => {
    setBpmState(next);
    engineRef.current?.setBpm(next);
  }, []);

  const addTrack = useCallback((track: ClockTrack) => {
    pendingTracks.current.set(track.id, track);
    const remove = engineRef.current?.addTrack(track);
    return () => {
      pendingTracks.current.delete(track.id);
      remove?.();
    };
  }, []);

  const subscribe = useCallback((listener: () => void) => {
    listeners.current.add(listener);
    return () => {
      listeners.current.delete(listener);
    };
  }, []);

  // rAF loop: notify position readers while playing, one frame after stop
  // so lit cells clear.
  useEffect(() => {
    if (!playing) {
      for (const l of listeners.current) l();
      return;
    }
    const frame = () => {
      for (const l of listeners.current) l();
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [playing]);

  const stop = useCallback(() => {
    engineRef.current?.stop();
  }, []);

  const ensureAudio = useCallback(async () => {
    await initializeAudio();
  }, [initializeAudio]);

  const play = useCallback(
    async (fromBeat = 0) => {
      await initializeAudio();
      const engine = getEngine();
      if (!engine) return;
      engine.stop();
      engine.start(fromBeat);
      setCycle(0);
      setPlaying(true);
      if (timerRef.current) clearInterval(timerRef.current);
      engine.tick();
      timerRef.current = setInterval(() => engine.tick(), TICK_MS);
    },
    [initializeAudio, getEngine],
  );

  // Never leave the scheduler running after the page unmounts.
  useEffect(
    () => () => {
      engineRef.current?.stop();
      if (timerRef.current) clearInterval(timerRef.current);
    },
    [],
  );

  const beatNow = useCallback(() => engineRef.current?.beatNow() ?? null, []);

  const value = useMemo<LessonClockState>(
    () => ({
      bpm,
      setBpm,
      swing,
      setSwing: setSwingState,
      loop,
      setLoop: setLoopState,
      playing,
      lengthBeats,
      play,
      stop,
      addTrack,
      beatNow,
      subscribe,
      cycle,
      audioContext,
      ensureAudio,
    }),
    [bpm, setBpm, swing, loop, playing, lengthBeats, play, stop, addTrack, beatNow, subscribe, cycle, audioContext, ensureAudio],
  );

  return <LessonClockContext.Provider value={value}>{children}</LessonClockContext.Provider>;
}

/**
 * A value derived from the clock position, re-rendering only when it
 * changes. Widgets ask for the *cell* they should light ("which bar",
 * "which step"), not the raw beat, so a 60 fps loop costs a handful of
 * renders per bar.
 */
export function useClockDerived<T>(derive: (beat: number | null) => T): T {
  const { beatNow, subscribe } = useLessonClock();
  const deriveRef = useRef(derive);
  deriveRef.current = derive;
  const [value, setValue] = useState<T>(() => derive(beatNow()));
  useEffect(
    () =>
      subscribe(() => {
        const next = deriveRef.current(beatNow());
        setValue((prev) => (Object.is(prev, next) ? prev : next));
      }),
    [subscribe, beatNow],
  );
  return value;
}

/** Register a track for the provider's lifetime; `deps` re-register it. */
export function useClockTrack(track: ClockTrack, deps: readonly unknown[]): void {
  const { addTrack } = useLessonClock();
  const trackRef = useRef(track);
  trackRef.current = track;
  useEffect(() => {
    const remove = addTrack({
      id: trackRef.current.id,
      stepsPerBeat: trackRef.current.stepsPerBeat,
      events: () => trackRef.current.events(),
    });
    return remove;
    // The caller names what should re-register the track.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addTrack, ...deps]);
}
