"use client";

/**
 * One shared state for every widget on a scale lesson page.
 *
 * A lesson interleaves server-rendered prose with several small client
 * widgets (a keyboard, degree chips, an A/B comparer, "play" buttons). They
 * must agree: pick a root once and every widget transposes; shift the octave
 * once and every keyboard *and* every scheduled run moves with it. This
 * provider owns that state and the single audio engine, so the widgets stay
 * thin and the prose between them stays a server component.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import { useAudioSynthesis } from "@/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis";
import {
  createSynthKeysFromRange,
  type SynthKey,
} from "@/instruments/synth/templates/basic-synth/utils/synthUtils";
import { flatName } from "./notes";

/** Two octaves: the shape reads 1 → octave → 1 again, and the run always
    plays in the lower one so it ends where the eye expects. */
export const WINDOW_OCTAVES = 2;

/*
 * Octave 3 (A3–A5 for A blues) is a comfortable synth register on laptop
 * speakers. Phones often can't reproduce the bottom of it — hence the
 * stepper: the user moves the whole lesson up, not just the keyboard.
 */
const DEFAULT_OCTAVE = 3;
const MIN_OCTAVE = 1;
/** Highest note on a grand piano; the window's top key never passes it. */
const PIANO_TOP_MIDI = 108;

/*
 * A piano row can't begin on a black key: KeyboardV2 places black keys by
 * counting the whites before them, so a black-key root would sit half off the
 * left edge. Mirror SynthV2 — a black root borrows the white key below as a
 * lead-in (and the white above as lead-out) so the row always ends on white.
 */
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** Scientific octave number → MIDI for a pitch class (C4 = 60). */
function midiFor(pitchClass: number, octave: number): number {
  return 12 * (octave + 1) + pitchClass;
}

/** Top octave a root can start on and still keep the window on the piano. */
export function maxOctaveFor(pitchClass: number): number {
  const leadOut = BLACK_PITCH_CLASSES.has(pitchClass) ? 1 : 0;
  return Math.max(
    MIN_OCTAVE,
    Math.floor((PIANO_TOP_MIDI - pitchClass - leadOut) / 12) - 1 - WINDOW_OCTAVES,
  );
}

export interface ScaleLessonState {
  /** Root pitch class, 0–11 (C = 0). */
  rootPc: number;
  setRootPc: (pc: number) => void;
  /** Flat-spelled root name ("E♭"). */
  rootName: string;
  /** Scientific octave of the root ("A3" → 3). */
  octave: number;
  minOctave: number;
  maxOctave: number;
  shiftOctave: (delta: number) => void;
  /** MIDI number of the root at the bottom of the window. */
  rootMidi: number;
  /** Keys in the current window (root → root + 2 octaves, white-padded). */
  keys: SynthKey[];
  lockToScale: boolean;
  setLockToScale: (locked: boolean) => void;
  /** Sounding keys plus whatever a scheduled run is lighting — one truth. */
  displayActiveKeys: Set<string>;
  /** Light a key a scheduler is sounding (null clears). */
  setHighlight: (noteNumber: number | null) => void;
  audioContext: AudioContext | null;
  initializeAudio: () => Promise<void>;
  scheduleNote: (frequency: number, startTime: number, duration: number) => void;
  /** Finger on a key — also the gesture that unlocks audio. */
  startNote: (noteNumber: number, note: string) => void;
  stopNote: (note: string) => void;
}

const ScaleLessonContext = createContext<ScaleLessonState | null>(null);

export function useScaleLesson(): ScaleLessonState {
  const ctx = useContext(ScaleLessonContext);
  if (!ctx) {
    throw new Error("Scale lesson widgets must render inside <ScaleLessonProvider>.");
  }
  return ctx;
}

interface ScaleLessonProviderProps {
  /** Root pitch class to open on (A = 9 is the guitar-blues classroom key). */
  defaultRootPc: number;
  children: ReactNode;
}

export function ScaleLessonProvider({
  defaultRootPc,
  children,
}: ScaleLessonProviderProps) {
  const [rootPc, setRootPc] = useState(defaultRootPc);
  const [rawOctave, setRawOctave] = useState(DEFAULT_OCTAVE);
  const [lockToScale, setLockToScale] = useState(true);
  const [highlight, setHighlight] = useState<number | null>(null);

  // Clamp rather than reset: changing root near the top of the piano keeps
  // the user's octave choice as close as the range allows.
  const maxOctave = maxOctaveFor(rootPc);
  const octave = Math.min(Math.max(rawOctave, MIN_OCTAVE), maxOctave);
  const shiftOctave = useCallback(
    (delta: number) =>
      setRawOctave((o) =>
        Math.min(Math.max(o + delta, MIN_OCTAVE), maxOctaveFor(rootPc)),
      ),
    [rootPc],
  );

  const rootMidi = midiFor(rootPc, octave);
  const rootIsBlack = BLACK_PITCH_CLASSES.has(rootPc);
  const keys = useMemo(() => {
    const start = rootIsBlack ? rootMidi - 1 : rootMidi;
    const end = rootMidi + 12 * WINDOW_OCTAVES + (rootIsBlack ? 1 : 0);
    return createSynthKeysFromRange(start, end);
  }, [rootMidi, rootIsBlack]);

  const { audioContext, initializeAudio } = useSharedAudioContext();
  const { activeKeys, handleNoteStart, stopNote, scheduleNote } =
    useAudioSynthesis(audioContext, () => {}, keys);

  const startNote = useCallback(
    (noteNumber: number, note: string) => {
      /*
       * Deliberately not awaited (same as SynthV2): on touch, a quick tap's
       * pointerup can arrive while resume() is still pending. The voice must
       * be registered synchronously here, or note-off finds nothing to stop
       * and the oscillator drones forever once the context unlocks.
       */
      void initializeAudio();
      void handleNoteStart(noteNumber, note);
    },
    [initializeAudio, handleNoteStart],
  );

  const displayActiveKeys = useMemo(() => {
    if (highlight == null) return activeKeys;
    const key = keys.find((k) => k.noteNumber === highlight);
    if (!key) return activeKeys;
    const next = new Set(activeKeys);
    next.add(key.note);
    return next;
  }, [activeKeys, highlight, keys]);

  const value = useMemo<ScaleLessonState>(
    () => ({
      rootPc,
      setRootPc,
      rootName: flatName(rootPc),
      octave,
      minOctave: MIN_OCTAVE,
      maxOctave,
      shiftOctave,
      rootMidi,
      keys,
      lockToScale,
      setLockToScale,
      displayActiveKeys,
      setHighlight,
      audioContext,
      initializeAudio,
      scheduleNote,
      startNote,
      stopNote,
    }),
    [
      rootPc,
      octave,
      maxOctave,
      shiftOctave,
      rootMidi,
      keys,
      lockToScale,
      displayActiveKeys,
      audioContext,
      initializeAudio,
      scheduleNote,
      startNote,
      stopNote,
    ],
  );

  return (
    <ScaleLessonContext.Provider value={value}>
      {children}
    </ScaleLessonContext.Provider>
  );
}
