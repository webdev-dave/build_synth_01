"use client";

import { useScaleLesson } from "./ScaleLessonProvider";
import { flatName } from "./notes";

/**
 * Tiny client leaves so server-rendered lesson prose can name the *current*
 * root and notes. "In A blues the ♭5 is E♭" stays true when the reader
 * switches to E — the sentence re-renders instead of lying.
 */

/** The current root, flat-spelled ("A", "E♭"). */
export function RootName() {
  const { rootName } = useScaleLesson();
  return <span className="font-mono">{rootName}</span>;
}

/** The note `offset` semitones above the current root. */
export function NoteAt({ offset }: { offset: number }) {
  const { rootPc } = useScaleLesson();
  return <span className="font-mono">{flatName(rootPc + offset)}</span>;
}
