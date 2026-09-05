"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { SCALE_PATTERNS, isInScale } from "@/lib/music/scales";
import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import { useAudioSynthesis } from "@/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis";
import {
  createSynthKeysFromRange,
  noteNumberToFrequency,
} from "@/instruments/synth/templates/basic-synth/utils/synthUtils";
import { LessonKeyboard } from "@/components/scales/LessonKeyboard";
import { RootNotePicker } from "@/components/scales/RootNotePicker";
import { ScaleDegreeStrip } from "@/components/scales/ScaleDegreeStrip";
import { PlayScaleButton } from "@/components/scales/PlayScaleButton";
import {
  BLUES_DEGREES,
  BLUE_NOTE_OFFSET,
  flatName,
  type ScaleDegree,
} from "@/components/scales/notes";

/*
 * Keyboard window: two octaves anchored at the scale root, so the shape reads
 * left-to-right from 1 up to the octave. C3 (MIDI 48) keeps every root's
 * window inside a comfortable synth register (max A3–A5).
 */
const ROOT_BASE_MIDI = 48;
const WINDOW_SEMITONES = 24;

/*
 * A piano row can't begin on a black key: KeyboardV2 places black keys by
 * counting the whites before them, so a black-key root would sit half off the
 * left edge. Mirror SynthV2 — a black root borrows the white key below as a
 * lead-in (and the white above as lead-out) so the row always ends on white.
 */
const BLACK_PITCH_CLASSES = new Set([1, 3, 6, 8, 10]);

/** Length of a clicked degree chip's tone. */
const DEGREE_NOTE_SEC = 0.45;

/** Pitch class → degree label, the same 12-slot map KeyboardV2 already reads. */
function degreeMapForRoot(
  rootPc: number,
  degrees: ScaleDegree[],
): (string | null)[] {
  const map: (string | null)[] = Array(12).fill(null);
  for (const d of degrees) {
    map[(rootPc + d.offset) % 12] = d.label;
  }
  return map;
}

/**
 * Compact, hands-on blues scale: pick a root, play it, see the degrees light
 * up. Deliberately light on prose — the deep dive links out to the scales
 * hub. This is the same KeyboardV2 the live synth uses, scale pre-locked.
 */
export function BluesScaleLesson() {
  // A is the guitar-blues home key — the classroom default for this scale.
  const [rootPc, setRootPc] = useState(9);
  const [lockToScale, setLockToScale] = useState(true);
  const [highlightNote, setHighlightNote] = useState<number | null>(null);
  const [activeOffset, setActiveOffset] = useState<number | null>(null);
  const degreeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const rootMidi = ROOT_BASE_MIDI + rootPc;
  const rootIsBlack = BLACK_PITCH_CLASSES.has(rootPc);
  const keys = useMemo(() => {
    const start = rootIsBlack ? rootMidi - 1 : rootMidi;
    const end = rootMidi + WINDOW_SEMITONES + (rootIsBlack ? 1 : 0);
    return createSynthKeysFromRange(start, end);
  }, [rootMidi, rootIsBlack]);

  const { audioContext, initializeAudio } = useSharedAudioContext();
  const { activeKeys, handleNoteStart, stopNote, scheduleNote } =
    useAudioSynthesis(audioContext, () => {}, keys);

  useEffect(
    () => () => {
      if (degreeTimer.current) clearTimeout(degreeTimer.current);
    },
    [],
  );

  const isNoteInScale = useCallback(
    (noteNumber: number) => isInScale(noteNumber - rootMidi, SCALE_PATTERNS.blues),
    [rootMidi],
  );
  const scaleDegrees = useMemo(
    () => degreeMapForRoot(rootPc, BLUES_DEGREES),
    [rootPc],
  );

  /** Key press: the gesture that unlocks audio (playing is consent). */
  const startNote = useCallback(
    async (noteNumber: number, note: string) => {
      await initializeAudio();
      await handleNoteStart(noteNumber, note);
    },
    [initializeAudio, handleNoteStart],
  );

  /** Degree chip click: one scheduled tone + a flash on chip and keyboard. */
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
      setHighlightNote(rootMidi + offset);
      if (degreeTimer.current) clearTimeout(degreeTimer.current);
      degreeTimer.current = setTimeout(() => {
        setActiveOffset(null);
        setHighlightNote(null);
      }, DEGREE_NOTE_SEC * 1000);
    },
    [audioContext, initializeAudio, scheduleNote, rootMidi],
  );

  /* Scheduled playback lights keys through the same activeKeys channel the
     fingers use — one visual truth for "this note is sounding". */
  const displayActiveKeys = useMemo(() => {
    if (highlightNote == null) return activeKeys;
    const key = keys.find((k) => k.noteNumber === highlightNote);
    if (!key) return activeKeys;
    const next = new Set(activeKeys);
    next.add(key.note);
    return next;
  }, [activeKeys, highlightNote, keys]);

  const scaleRun = useMemo(
    () => [...SCALE_PATTERNS.blues, 12].map((offset) => rootMidi + offset),
    [rootMidi],
  );

  const rootName = flatName(rootPc);
  const blueName = flatName(rootPc + BLUE_NOTE_OFFSET);

  return (
    <div className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <RootNotePicker value={rootPc} onChange={setRootPc} />
        <div className="flex items-center gap-3">
          <PlayScaleButton
            label={`Play ${rootName} blues`}
            noteNumbers={scaleRun}
            audioContext={audioContext}
            initializeAudio={initializeAudio}
            scheduleNote={scheduleNote}
            onHighlight={setHighlightNote}
          />
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={!lockToScale}
              onChange={(e) => setLockToScale(!e.target.checked)}
              className="h-3.5 w-3.5 accent-emerald-600"
            />
            Unlock other notes
          </label>
        </div>
      </div>

      <LessonKeyboard
        keys={keys}
        activeKeys={displayActiveKeys}
        isNoteInScale={isNoteInScale}
        lockToScale={lockToScale}
        scaleDegrees={scaleDegrees}
        onNoteStart={startNote}
        onNoteStop={stopNote}
      />

      <ScaleDegreeStrip
        degrees={BLUES_DEGREES}
        rootPitchClass={rootPc}
        spotlightOffset={BLUE_NOTE_OFFSET}
        activeOffset={activeOffset}
        onPlay={playDegree}
      />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Green numbers are the scale degrees; the highlighted{" "}
        <span className="font-mono">♭5</span> ({blueName}) is the blue note —
        the one note that turns the minor pentatonic into the blues scale.
      </p>
    </div>
  );
}
