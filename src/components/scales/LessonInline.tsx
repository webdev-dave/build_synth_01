"use client";

import { useScaleLesson } from "./ScaleLessonProvider";

/**
 * Tiny client leaves so server-rendered lesson prose can name the *current*
 * root and notes. "In A blues the ♭5 is E♭" stays true when the reader
 * switches to E — the sentence re-renders instead of lying. Spelling follows
 * the page's scale, so a freygish page says G♯ where a blues page says A♭.
 */

/** The current root, in the lesson scale's spelling ("A", "E♭", "G♯"). */
export function RootName() {
  const { rootName } = useScaleLesson();
  return <span className="font-mono">{rootName}</span>;
}

/** The note `offset` semitones above the current root. */
export function NoteAt({ offset }: { offset: number }) {
  const { noteName } = useScaleLesson();
  return <span className="font-mono">{noteName(offset)}</span>;
}
