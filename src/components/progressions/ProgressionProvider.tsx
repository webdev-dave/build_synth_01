"use client";

/**
 * One shared state for every widget on a progression lesson page.
 *
 * The lesson interleaves server prose with a chord sounder, a bar chart, a
 * player, a keyboard overlay, and a lock. They must agree: pick a key once
 * and every chart cell, chord button, and keyboard label transposes; the
 * bar that is lit is the bar that is sounding. This provider owns the key,
 * the octave window, the active variants, the voicing mode, the lock, and
 * the organ — and it registers the chord track on the page's one clock,
 * so "which bar is now" has exactly one source.
 *
 * Audio-side state lives in refs; React state holds only what the reader
 * sees change. The current bar is *derived* from the clock on each frame
 * (`useClockDerived`), never pushed from the scheduler.
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

import {
  LessonClockProvider,
  useClockDerived,
  useClockTrack,
  useLessonClock,
} from "@/components/lessons/LessonClock";
import { maxOctaveFor, WINDOW_OCTAVES } from "@/components/scales/ScaleLessonProvider";
import { getLessonBus } from "@/lib/audio/bus";
import { organChordAt, type OrganVoice } from "@/lib/audio/voices/organ";
import {
  chordName,
  chordPitchClasses,
  chordRoles,
  keyDegreeLabel,
  noteRole,
  spellChordTones,
  voiceChord,
  voiceLead,
  type ChordRole,
  type ChordSpec,
  type NoteRole,
} from "@/lib/music/chords";
import type { ClockEvent } from "@/lib/music/clock";
import { noteNameAt, rootNameFor, type ScaleDegree } from "@/lib/music/scaleCatalog";
import { parseRootName } from "@/lib/music/scaleParam";
import {
  barsWith,
  beatsPerBar,
  progressionLengthBeats,
  type Progression,
  type ProgressionBar,
} from "@/lib/progressions/registry";
import {
  createSynthKeysFromRange,
  noteNumberToFrequency,
  type SynthKey,
} from "@/instruments/synth/templates/basic-synth/utils/synthUtils";

/*
 * Octave 3 (A3–A5 for A blues): chords comp in the lower octave of the
 * window, around 220–440 Hz, where an organ pad sits naturally; the upper
 * octave is left for the reader's own notes. The stepper is there for
 * anyone whose speaker wants it higher.
 */
const DEFAULT_OCTAVE = 3;
const MIN_OCTAVE = 1;
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** A clicked chord sounds for this long when nothing is playing. */
const CLICK_CHORD_SEC = 1.4;
/** Organ level for one held key — a chord shares its level across notes. */
const KEY_LEVEL = 0.1;
/** The quiet root pulse on every beat, so time is felt under the held chord. */
const PULSE_LEVEL = 0.05;
const PULSE_SEC = 0.09;

const mod12 = (n: number) => ((n % 12) + 12) % 12;
const midiFor = (pc: number, octave: number) => 12 * (octave + 1) + pc;

export type LockMode = "chord" | "scale" | "off";

export interface ChordTone {
  midi: number;
  pc: number;
  name: string;
  role: ChordRole;
  /** Key-relative degree label ("♭7"). */
  degree: string;
}

export interface ProgressionState {
  progression: Progression;
  /** The lesson's overlay scale — decides spelling and the scale lock. */
  degrees: readonly ScaleDegree[];
  keyRootPc: number;
  setKeyRootPc: (pc: number) => void;
  /** Key name spelled by the overlay scale ("A", "E♭"). */
  keyName: string;
  /** All twelve keys, spelled the same way — for the picker. */
  keyNames: string[];
  octave: number;
  minOctave: number;
  maxOctave: number;
  shiftOctave: (delta: number) => void;
  /** MIDI of the key root at the bottom of the window. */
  rootMidi: number;
  keys: SynthKey[];
  /** Active variant ids, in registry order. */
  variantIds: string[];
  toggleVariant: (id: string) => void;
  /** The chart with variants applied. */
  bars: ProgressionBar[];
  beatsPerBar: number;
  smoothVoicing: boolean;
  setSmoothVoicing: (smooth: boolean) => void;
  /** The chord under discussion: the sounding bar while playing, else the last one sounded. */
  currentChord: ChordSpec;
  /** 0-based bar while playing, else null. */
  currentBar: number | null;
  /** The bar arriving within the next beat, else null. */
  upcomingBar: number | null;
  /** Concrete chord name in this key ("D7"). */
  nameOf: (spec: ChordSpec) => string;
  /** Voiced chord tones for the keyboard and strips, ascending. */
  tonesOf: (spec: ChordSpec) => ChordTone[];
  /** Note name for a pitch class in this key's spelling. */
  nameOfPc: (pc: number) => string;
  /** What a pitch class is doing against a chord here — drives captions and locks. */
  roleOf: (pc: number, spec: ChordSpec) => NoteRole;
  lockMode: LockMode;
  setLockMode: (mode: LockMode) => void;
  /** Whether the keyboard should treat a key as "in" under the current lock. */
  isNoteIn: (noteNumber: number) => boolean;
  /** Keys lit right now: the reader's, a clicked chord's, or the sounding bar's. */
  activeKeys: Set<string>;
  /** Sound one chord now (a click on a button or a chart cell). */
  soundChord: (spec: ChordSpec) => void;
  /** Sound one note now (a chip on the tone strip). */
  soundNote: (midi: number) => void;
  /** True while a clicked chord is still sounding — the cell that was clicked stays lit. */
  clickSounding: boolean;
  /** Finger on a key — also the gesture that unlocks audio. */
  startNote: (noteNumber: number, note: string) => void;
  stopNote: (note: string) => void;
  /** Pitch classes the reader is holding down (for the chord read-out). */
  heldPcs: number[];
  /** The last key the reader pressed (MIDI), for the role caption. */
  lastPressed: number | null;
}

const ProgressionContext = createContext<ProgressionState | null>(null);

export function useProgression(): ProgressionState {
  const ctx = useContext(ProgressionContext);
  if (!ctx) throw new Error("Progression widgets must render inside <ProgressionProvider>.");
  return ctx;
}

interface ProgressionProviderProps {
  progression: Progression;
  /** Scale to spell with and overlay (the blues scale on the 12-bar page). */
  degrees: readonly ScaleDegree[];
  /** Key to open in; defaults to the registry's worked example. */
  defaultKeyRootPc?: number;
  bpm?: number;
  children: ReactNode;
}

export function ProgressionProvider({
  progression,
  degrees,
  defaultKeyRootPc,
  bpm = 90,
  children,
}: ProgressionProviderProps) {
  return (
    <LessonClockProvider bpm={bpm} lengthBeats={progressionLengthBeats(progression)}>
      <ProgressionStateProvider
        progression={progression}
        degrees={degrees}
        defaultKeyRootPc={defaultKeyRootPc ?? parseRootName(progression.exampleKey) ?? 0}
      >
        {children}
      </ProgressionStateProvider>
    </LessonClockProvider>
  );
}

function ProgressionStateProvider({
  progression,
  degrees,
  defaultKeyRootPc,
  children,
}: {
  progression: Progression;
  degrees: readonly ScaleDegree[];
  defaultKeyRootPc: number;
  children: ReactNode;
}) {
  const clock = useLessonClock();
  const { audioContext, ensureAudio, playing, bpm } = clock;

  const [keyRootPc, setKeyRootPc] = useState(defaultKeyRootPc);
  const [rawOctave, setRawOctave] = useState(DEFAULT_OCTAVE);
  const [variantIds, setVariantIds] = useState<string[]>([]);
  const [smoothVoicing, setSmoothVoicing] = useState(true);
  const [lockMode, setLockMode] = useState<LockMode>("chord");
  const [lastChord, setLastChord] = useState<ChordSpec | null>(null);
  const [clickedMidis, setClickedMidis] = useState<number[]>([]);
  const [heldMidis, setHeldMidis] = useState<number[]>([]);
  const [lastPressed, setLastPressed] = useState<number | null>(null);

  const maxOctave = maxOctaveFor(keyRootPc);
  const octave = Math.min(Math.max(rawOctave, MIN_OCTAVE), maxOctave);
  const shiftOctave = useCallback(
    (delta: number) =>
      setRawOctave((o) => Math.min(Math.max(o + delta, MIN_OCTAVE), maxOctaveFor(keyRootPc))),
    [keyRootPc],
  );

  const rootMidi = midiFor(keyRootPc, octave);
  const rootIsBlack = BLACK_PITCH_CLASSES.has(keyRootPc);
  const keys = useMemo(() => {
    const start = rootIsBlack ? rootMidi - 1 : rootMidi;
    const end = rootMidi + 12 * WINDOW_OCTAVES + (rootIsBlack ? 1 : 0);
    return createSynthKeysFromRange(start, end);
  }, [rootMidi, rootIsBlack]);

  const bars = useMemo(() => barsWith(progression, variantIds), [progression, variantIds]);
  const bpb = beatsPerBar(progression.meter);

  const toggleVariant = useCallback(
    (id: string) =>
      setVariantIds((ids) => {
        const order = (progression.variants ?? []).map((v) => v.id);
        const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
        return order.filter((x) => next.includes(x));
      }),
    [progression.variants],
  );

  // --- naming -------------------------------------------------------------
  const keyNames = useMemo(
    () => Array.from({ length: 12 }, (_, pc) => rootNameFor(pc, degrees)),
    [degrees],
  );
  const nameOfPc = useCallback(
    (pc: number) => noteNameAt(keyRootPc, mod12(pc - keyRootPc), degrees),
    [keyRootPc, degrees],
  );
  const nameOf = useCallback(
    (spec: ChordSpec) => chordName(keyRootPc, spec, nameOfPc),
    [keyRootPc, nameOfPc],
  );
  const voicingOf = useCallback(
    (spec: ChordSpec) =>
      smoothVoicing ? voiceLead(keyRootPc, spec, rootMidi) : voiceChord(keyRootPc, spec, rootMidi),
    [smoothVoicing, keyRootPc, rootMidi],
  );
  const tonesOf = useCallback(
    (spec: ChordSpec): ChordTone[] => {
      const pcs = chordPitchClasses(keyRootPc, spec);
      const roles = chordRoles(spec);
      const names = spellChordTones(nameOfPc(pcs[0]), spec);
      const voicing = voicingOf(spec);
      return pcs
        .map((pc, i) => ({
          pc,
          role: roles[i],
          name: names[i],
          degree: keyDegreeLabel(pc - keyRootPc),
          midi: voicing.find((m) => mod12(m) === pc) ?? rootMidi + mod12(pc - keyRootPc),
        }))
        .sort((a, b) => a.midi - b.midi);
    },
    [keyRootPc, nameOfPc, voicingOf, rootMidi],
  );
  const degreePairs = useMemo(
    () => degrees.map((d) => ({ offset: d.offset, label: d.label })),
    [degrees],
  );
  const roleOf = useCallback(
    (pc: number, spec: ChordSpec) => noteRole(pc, keyRootPc, spec, degreePairs),
    [keyRootPc, degreePairs],
  );

  // --- clock position -----------------------------------------------------
  const currentBar = useClockDerived((beat) =>
    beat == null || beat < 0 ? null : Math.min(bars.length - 1, Math.floor(beat / bpb)),
  );
  const upcomingBar = useClockDerived((beat) => {
    if (beat == null || beat < 0) return null;
    const inBar = beat - Math.floor(beat / bpb) * bpb;
    if (inBar < bpb - 1) return null;
    const next = Math.floor(beat / bpb) + 1;
    return next < bars.length ? next : clock.loop ? 0 : null;
  });
  const currentChord =
    currentBar != null ? bars[currentBar].chord : lastChord ?? bars[0].chord;

  // --- audio --------------------------------------------------------------
  const busOf = useCallback(
    () => (audioContext ? getLessonBus(audioContext) : null),
    [audioContext],
  );

  // The chord track: one held organ chord per bar plus a quiet root pulse
  // on each beat. Read fresh at every cycle, so a variant toggle or key
  // change lands on the next pass without stopping the clock.
  const barsRef = useRef(bars);
  barsRef.current = bars;
  useClockTrack(
    {
      id: "progression-chords",
      stepsPerBeat: 1,
      events: () => {
        const ctx = audioContext;
        const bus = busOf();
        if (!ctx || !bus) return [];
        const events: ClockEvent[] = [];
        barsRef.current.forEach((bar, i) => {
          const hz = voicingOf(bar.chord).map(noteNumberToFrequency);
          const rootHz = noteNumberToFrequency(
            rootMidi + mod12(keyRootPc + bar.chord.root - rootMidi),
          );
          events.push({
            at: i * bpb,
            duration: bpb,
            fire: (when, dur) => organChordAt(ctx, bus, hz, when, dur),
          });
          for (let b = 0; b < bpb; b++) {
            events.push({
              at: i * bpb + b,
              duration: 0.25,
              fire: (when) =>
                organChordAt(ctx, bus, [rootHz], when, PULSE_SEC, {
                  level: PULSE_LEVEL,
                  vibratoCents: 0,
                }),
            });
          }
        });
        return events;
      },
    },
    [audioContext, busOf, voicingOf, rootMidi, keyRootPc, bpb],
  );

  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (clickTimer.current) clearTimeout(clickTimer.current);
  }, []);

  const soundMidis = useCallback(
    (midis: number[], durationSec: number, level?: number) => {
      // Sound only when the player is idle: while it runs, the clock owns the organ.
      if (playing) return;
      void ensureAudio().then(() => {
        const ctx = audioContext;
        const bus = busOf();
        if (!ctx || !bus) return;
        organChordAt(
          ctx,
          bus,
          midis.map(noteNumberToFrequency),
          ctx.currentTime + 0.02,
          durationSec,
          level === undefined ? {} : { level },
        );
        setClickedMidis(midis);
        if (clickTimer.current) clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => setClickedMidis([]), durationSec * 1000);
      });
    },
    [playing, ensureAudio, audioContext, busOf],
  );
  const soundChord = useCallback(
    (spec: ChordSpec) => {
      setLastChord(spec);
      soundMidis(voicingOf(spec), Math.min(CLICK_CHORD_SEC, (60 / bpm) * bpb));
    },
    [soundMidis, voicingOf, bpm, bpb],
  );
  const soundNote = useCallback(
    (midi: number) => {
      setLastPressed(midi);
      soundMidis([midi], 0.5, KEY_LEVEL);
    },
    [soundMidis],
  );

  // Keys the reader holds sound on the same organ that is comping.
  const heldVoices = useRef(new Map<string, OrganVoice>());
  const startNote = useCallback(
    (noteNumber: number, note: string) => {
      if (heldVoices.current.has(note)) return;
      const ctx = audioContext;
      const bus = busOf();
      if (!ctx || !bus) return;
      // Not awaited (same as the synth): the voice must exist before a quick
      // tap's note-off arrives, or it would drone once the context unlocks.
      void ensureAudio();
      const voice = organChordAt(
        ctx,
        bus,
        [noteNumberToFrequency(noteNumber)],
        ctx.currentTime,
        Infinity,
        { level: KEY_LEVEL },
      );
      heldVoices.current.set(note, voice);
      setHeldMidis((prev) => (prev.includes(noteNumber) ? prev : [...prev, noteNumber]));
      setLastPressed(noteNumber);
    },
    [audioContext, busOf, ensureAudio],
  );
  const stopNote = useCallback((note: string) => {
    const voice = heldVoices.current.get(note);
    if (!voice) return;
    heldVoices.current.delete(note);
    voice.release();
    const key = keys.find((k) => k.note === note);
    setHeldMidis((prev) => prev.filter((m) => m !== key?.noteNumber));
  }, [keys]);
  useEffect(() => {
    const voices = heldVoices.current;
    return () => {
      for (const v of voices.values()) v.release();
      voices.clear();
    };
  }, []);

  // --- what the keyboard shows -------------------------------------------
  const activeKeys = useMemo(() => {
    const lit = new Set<number>(heldMidis);
    if (currentBar != null) for (const m of voicingOf(bars[currentBar].chord)) lit.add(m);
    else for (const m of clickedMidis) lit.add(m);
    const out = new Set<string>();
    for (const k of keys) if (lit.has(k.noteNumber)) out.add(k.note);
    return out;
  }, [heldMidis, currentBar, bars, voicingOf, clickedMidis, keys]);

  const scaleOffsets = useMemo(() => new Set(degrees.map((d) => mod12(d.offset))), [degrees]);
  const chordPcs = useMemo(
    () => new Set(chordPitchClasses(keyRootPc, currentChord)),
    [keyRootPc, currentChord],
  );
  const isNoteIn = useCallback(
    (noteNumber: number) => {
      if (lockMode === "off") return true;
      if (lockMode === "scale") return scaleOffsets.has(mod12(noteNumber - keyRootPc));
      return chordPcs.has(mod12(noteNumber));
    },
    [lockMode, scaleOffsets, keyRootPc, chordPcs],
  );

  const heldPcs = useMemo(() => [...new Set(heldMidis.map(mod12))], [heldMidis]);

  const value = useMemo<ProgressionState>(
    () => ({
      progression,
      degrees,
      keyRootPc,
      setKeyRootPc,
      keyName: keyNames[keyRootPc],
      keyNames,
      octave,
      minOctave: MIN_OCTAVE,
      maxOctave,
      shiftOctave,
      rootMidi,
      keys,
      variantIds,
      toggleVariant,
      bars,
      beatsPerBar: bpb,
      smoothVoicing,
      setSmoothVoicing,
      currentChord,
      currentBar,
      upcomingBar,
      nameOf,
      tonesOf,
      nameOfPc,
      roleOf,
      lockMode,
      setLockMode,
      isNoteIn,
      activeKeys,
      soundChord,
      soundNote,
      clickSounding: clickedMidis.length > 0,
      startNote,
      stopNote,
      heldPcs,
      lastPressed,
    }),
    [
      progression,
      degrees,
      keyRootPc,
      keyNames,
      octave,
      maxOctave,
      shiftOctave,
      rootMidi,
      keys,
      variantIds,
      toggleVariant,
      bars,
      bpb,
      smoothVoicing,
      currentChord,
      currentBar,
      upcomingBar,
      nameOf,
      tonesOf,
      nameOfPc,
      roleOf,
      lockMode,
      isNoteIn,
      activeKeys,
      soundChord,
      soundNote,
      clickedMidis,
      startNote,
      stopNote,
      heldPcs,
      lastPressed,
    ],
  );

  return <ProgressionContext.Provider value={value}>{children}</ProgressionContext.Provider>;
}
