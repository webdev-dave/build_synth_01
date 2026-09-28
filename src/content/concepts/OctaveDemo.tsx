"use client";

/**
 * Play-it demo for /concepts/octave: two octaves of the v2 piano (C3–C5),
 * fully playable, with a Hz readout that always shows the note you touched
 * and the same letter one octave up — so the doubling is a number you can
 * read, not a claim. Two buttons walk the doubling for you: C4 → C5, and
 * the A ladder 220 → 440 → 880.
 *
 * Client leaf; sound follows consent (a key press unlocks audio). Keys the
 * demo sounds light through the same active-key channel as fingers.
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
import { formatHz, pitchLabel } from "@/lib/music/pitch";
import { cn } from "@/lib/utils";

const LOW_MIDI = 48; // C3
const HIGH_MIDI = 72; // C5 — two full repeats of the pattern
const KEYS = createSynthKeysFromRange(LOW_MIDI, HIGH_MIDI);

const NOTE_SEC = 0.55;

interface Walk {
  id: string;
  label: string;
  midis: number[];
}

const WALKS: Walk[] = [
  { id: "a", label: "A3 → A4 (220 → 440 Hz)", midis: [57, 69] },
  { id: "c", label: "C4 → C5", midis: [60, 72] },
];

/** Readout row: "A3  220.00 Hz". */
function Row({ midi, dim }: { midi: number; dim?: boolean }) {
  return (
    <span className={cn("font-mono text-xs", dim ? "text-muted-foreground" : "text-foreground")}>
      <span className="inline-block w-8">{pitchLabel(midi)}</span>
      <span className="tabular-nums">{formatHz(noteNumberToFrequency(midi))}</span>
    </span>
  );
}

export function OctaveDemo() {
  const { audioContext, initializeAudio } = useSharedAudioContext();
  const { activeKeys, handleNoteStart, stopNote, scheduleNote } =
    useAudioSynthesis(audioContext, () => {}, KEYS);

  const [activeWalk, setActiveWalk] = useState<string | null>(null);
  const [highlight, setHighlight] = useState<ReadonlySet<number>>(new Set());
  // The note the readout explains — last key touched, or the walk's current note.
  const [focusMidi, setFocusMidi] = useState<number>(60);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => () => clearTimers(), [clearTimers]);

  const startNote = useCallback(
    (noteNumber: number, note: string) => {
      // Not awaited, as in SynthV2: the voice must register synchronously so
      // a quick tap's note-off finds it even while resume() is pending.
      void initializeAudio();
      void handleNoteStart(noteNumber, note);
      setFocusMidi(noteNumber);
    },
    [initializeAudio, handleNoteStart],
  );

  const playWalk = useCallback(
    async (walk: Walk) => {
      if (!audioContext) return;
      await initializeAudio();
      clearTimers();
      const t0 = audioContext.currentTime + 0.06;
      walk.midis.forEach((midi, i) => {
        scheduleNote(noteNumberToFrequency(midi), t0 + i * NOTE_SEC, NOTE_SEC * 0.92);
      });
      // Then all of them together: octaves lock into one sound.
      const chordAt = t0 + walk.midis.length * NOTE_SEC;
      walk.midis.forEach((midi) => {
        scheduleNote(noteNumberToFrequency(midi), chordAt, NOTE_SEC * 1.6);
      });

      setActiveWalk(walk.id);
      walk.midis.forEach((midi, i) => {
        timers.current.push(
          setTimeout(() => {
            setHighlight(new Set([midi]));
            setFocusMidi(midi);
          }, i * NOTE_SEC * 1000),
        );
      });
      timers.current.push(
        setTimeout(() => {
          setHighlight(new Set(walk.midis));
          setFocusMidi(walk.midis[0]);
        }, walk.midis.length * NOTE_SEC * 1000),
      );
      timers.current.push(
        setTimeout(() => {
          setHighlight(new Set());
          setActiveWalk(null);
        }, (walk.midis.length + 1.6) * NOTE_SEC * 1000 + 200),
      );
    },
    [audioContext, initializeAudio, scheduleNote, clearTimers],
  );

  const displayActiveKeys = useMemo(() => {
    if (highlight.size === 0) return activeKeys;
    const next = new Set(activeKeys);
    for (const k of KEYS) if (highlight.has(k.noteNumber)) next.add(k.note);
    return next;
  }, [activeKeys, highlight]);

  const upMidi = focusMidi + 12;

  return (
    <div className="mt-4 space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {WALKS.map((walk) => (
          <Button
            key={walk.id}
            variant="outline"
            size="sm"
            onClick={() => playWalk(walk)}
            className={cn(activeWalk === walk.id && "border-orange-700 text-orange-600")}
          >
            <Play className="h-3.5 w-3.5" />
            {walk.label}
          </Button>
        ))}
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

      <div
        className="flex flex-wrap items-center gap-x-6 gap-y-1 rounded-md border px-3 py-2"
        aria-live="polite"
      >
        <Row midi={focusMidi} />
        <span className="font-mono text-xs text-muted-foreground">×2 →</span>
        <Row midi={upMidi} dim />
        <span className="ml-auto font-mono text-[11px] text-muted-foreground">
          one octave = 12 half steps = double the Hz
        </span>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        Press any key and the readout shows its frequency beside the same
        letter one octave up — always exactly twice the number. Play the two
        together and they lock into one sound, which is why they share a
        name. The keyboard repeats the same twelve keys every octave; the
        digit after the letter (<span className="font-mono">C4</span>,{" "}
        <span className="font-mono">C5</span>) only says which repeat.
      </p>
    </div>
  );
}
