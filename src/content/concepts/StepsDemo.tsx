"use client";

/**
 * Interactive demo for the "steps" concept (/concepts/steps): the same v2 piano
 * the live synth uses, one octave wide and fully playable, plus two buttons
 * that play a half step and a whole step off middle C so the ear and eye learn
 * the gap together.
 *
 * Client leaf (the concept page stays server-rendered). Sound follows consent:
 * nothing plays until the user presses a key or a button, which is what unlocks
 * the AudioContext. Motion is event-driven — no ambient loop.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Play } from "lucide-react";

import { useSharedAudioContext } from "@/hooks/useSharedAudioContext";
import { useAudioSynthesis } from "@/instruments/synth/templates/basic-synth/hooks/useAudioSynthesis";
import {
  createSynthKeysFromRange,
  noteNumberToFrequency,
} from "@/instruments/synth/templates/basic-synth/utils/synthUtils";
import { KeyboardV2 } from "@/instruments/synth/v2/KeyboardV2";
import { Button } from "@/components/ui/button";
import { niceNote } from "@/lib/music";
import { cn } from "@/lib/utils";

// One octave, C4→C5 inclusive (13 keys): the row starts and ends on a white C,
// and both "hidden" natural half-steps (E–F and B–C) sit inside the window.
const LOW_MIDI = 60; // C4 (middle C)
const HIGH_MIDI = 72; // C5
const DEMO_ROOT = 60; // both button demos start on middle C

// Motion follows music: each demo note is a relaxed half-second, so the two
// notes read as a deliberate step, not a chord.
const NOTE_SEC = 0.5;

const KEYS = createSynthKeysFromRange(LOW_MIDI, HIGH_MIDI);

/** Bare pitch-class name for a MIDI note in this window ("C", "C♯", "D"). */
function noteLabel(midi: number): string {
  const key = KEYS.find((k) => k.noteNumber === midi);
  return key ? niceNote(key.note.replace(/\d+$/, "")) : "";
}

const HALF: number = 1;
const WHOLE: number = 2;

export function StepsDemo() {
  const { audioContext, initializeAudio } = useSharedAudioContext();
  const { activeKeys, handleNoteStart, stopNote, scheduleNote } =
    useAudioSynthesis(audioContext, () => {}, KEYS);

  // Which demo is currently playing (its semitone size), and the notes lit
  // through the shared active-key channel — the same visual truth as fingers.
  const [activeDemo, setActiveDemo] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<ReadonlySet<number>>(new Set());
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  /** Key press: the gesture that unlocks audio (playing is consent). */
  const startNote = useCallback(
    async (noteNumber: number, note: string) => {
      await initializeAudio();
      await handleNoteStart(noteNumber, note);
    },
    [initializeAudio, handleNoteStart],
  );

  /** Play the root, then the note `semitones` above it, lighting each in turn
      and finally both together so the size of the gap is visible. */
  const playInterval = useCallback(
    async (semitones: number) => {
      if (!audioContext) return;
      await initializeAudio();
      clearTimers();

      const from = DEMO_ROOT;
      const to = DEMO_ROOT + semitones;
      const t0 = audioContext.currentTime + 0.06;
      scheduleNote(noteNumberToFrequency(from), t0, NOTE_SEC * 0.95);
      scheduleNote(noteNumberToFrequency(to), t0 + NOTE_SEC, NOTE_SEC * 0.95);

      setActiveDemo(semitones);
      setHighlight(new Set([from]));
      timers.current.push(
        setTimeout(() => setHighlight(new Set([from, to])), NOTE_SEC * 1000),
      );
      timers.current.push(
        setTimeout(() => {
          setHighlight(new Set());
          setActiveDemo(null);
        }, NOTE_SEC * 2 * 1000 + 500),
      );
    },
    [audioContext, initializeAudio, scheduleNote, clearTimers],
  );

  // Fold the scheduled highlight into the played-key set so both light the
  // same way, whether a finger or the demo sounded them.
  const displayActiveKeys = useMemo(() => {
    if (highlight.size === 0) return activeKeys;
    const next = new Set(activeKeys);
    for (const k of KEYS) if (highlight.has(k.noteNumber)) next.add(k.note);
    return next;
  }, [activeKeys, highlight]);

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <StepButton
          label={`Half step (${noteLabel(DEMO_ROOT)} → ${noteLabel(DEMO_ROOT + HALF)})`}
          active={activeDemo === HALF}
          onClick={() => playInterval(HALF)}
        />
        <StepButton
          label={`Whole step (${noteLabel(DEMO_ROOT)} → ${noteLabel(DEMO_ROOT + WHOLE)})`}
          active={activeDemo === WHOLE}
          onClick={() => playInterval(WHOLE)}
        />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <KeyboardV2
          keys={KEYS}
          activeKeys={displayActiveKeys}
          hasScale={false}
          lockToScale={false}
          isNoteInScale={() => false}
          scaleDegrees={null}
          keyLabels={null}
          onNoteStart={startNote}
          onNoteStop={stopNote}
        />
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        A <span className="font-mono">half step</span> is the jump to the very
        next key — <span className="font-mono">C → C♯</span>. A{" "}
        <span className="font-mono">whole step</span> skips one key —{" "}
        <span className="font-mono">C → D</span>. Press any two neighbouring
        keys to hear a half step, or skip one for a whole step. Notice{" "}
        <span className="font-mono">E–F</span> and{" "}
        <span className="font-mono">B–C</span> are half steps too, even with no
        black key between them.
      </p>
    </div>
  );
}

function StepButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className={cn(active && "border-orange-700 text-orange-600")}
    >
      <Play className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
