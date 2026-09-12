"use client";

import { useCallback, useMemo } from "react";

import { LessonKeyboard } from "@/components/scales/LessonKeyboard";
import { chordPitchClasses, keyDegreeLabel, type ChordSpec } from "@/lib/music/chords";
import { useProgression } from "./ProgressionProvider";

const mod12 = (n: number) => ((n % 12) + 12) % 12;

interface ProgressionKeyboardProps {
  /** The chord to show; defaults to the page's current chord (the sounding bar). */
  chord?: ChordSpec;
  /**
   * "chord": the chord's tones are the only keys in — labelled with their
   * key-relative degrees (1 3 5 ♭7 for I7), everything else locked. The
   * chord sounder's view.
   * "overlay": the lesson scale is in (green degrees), the chord's tones are
   * ringed on top of it, and the page-wide lock decides what plays. The
   * "why the scale fits the chords" view.
   */
  mode?: "chord" | "overlay";
  className?: string;
}

/**
 * The lesson keyboard wired to the progression state. Lit keys are keys
 * that are sounding — the reader's, a clicked chord's, or the bar the
 * player is on — so the picture never claims a sound that isn't there.
 */
export function ProgressionKeyboard({
  chord,
  mode = "chord",
  className,
}: ProgressionKeyboardProps) {
  const {
    keys,
    keyRootPc,
    degrees,
    currentChord,
    activeKeys,
    lockMode,
    isNoteIn,
    startNote,
    stopNote,
  } = useProgression();
  const spec = chord ?? currentChord;
  const chordPcs = useMemo(() => new Set(chordPitchClasses(keyRootPc, spec)), [keyRootPc, spec]);

  const scaleLabels = useMemo(() => {
    const map: (string | null)[] = Array(12).fill(null);
    for (const d of degrees) map[mod12(keyRootPc + d.offset)] = d.label;
    return map;
  }, [keyRootPc, degrees]);

  // Chord view: only chord tones carry a label. Overlay: the scale's labels
  // plus a key-relative degree for any chord tone the scale leaves out (the
  // 3 of I7 on a blues page), so a ringed key is never unnamed.
  const labels = useMemo(() => {
    const map: (string | null)[] = Array(12).fill(null);
    for (let pc = 0; pc < 12; pc++) {
      if (mode === "chord") {
        if (chordPcs.has(pc)) map[pc] = keyDegreeLabel(pc - keyRootPc);
      } else {
        map[pc] = scaleLabels[pc] ?? (chordPcs.has(pc) ? keyDegreeLabel(pc - keyRootPc) : null);
      }
    }
    return map;
  }, [mode, chordPcs, keyRootPc, scaleLabels]);

  const chordOnly = useCallback(
    (noteNumber: number) => chordPcs.has(mod12(noteNumber)),
    [chordPcs],
  );
  const scaleOnly = useCallback(
    (noteNumber: number) => scaleLabels[mod12(noteNumber)] !== null,
    [scaleLabels],
  );
  // With the lock off every key plays, but the green degrees still draw the
  // scale — "in" is what the picture shows, the lock is whether it enforces.
  const inScale =
    mode === "chord" ? chordOnly : lockMode === "off" ? scaleOnly : isNoteIn;

  const markedKeys = useMemo(() => {
    if (mode !== "overlay") return undefined;
    const out = new Set<string>();
    for (const k of keys) if (chordPcs.has(mod12(k.noteNumber))) out.add(k.note);
    return out;
  }, [mode, keys, chordPcs]);

  return (
    <LessonKeyboard
      keys={keys}
      activeKeys={activeKeys}
      isNoteInScale={inScale}
      lockToScale={mode === "chord" ? true : lockMode !== "off"}
      scaleDegrees={labels}
      onNoteStart={startNote}
      onNoteStop={stopNote}
      markedKeys={markedKeys}
      className={className}
    />
  );
}
