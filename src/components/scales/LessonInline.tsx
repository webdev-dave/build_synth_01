"use client";

import { noteNameAt, type ScaleDegree } from "@/lib/music/scaleCatalog";
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

/**
 * The note `offset` semitones above the current root. Pass `degrees` when
 * the note belongs to the *other* scale in a comparison — "lower the 5 (F♯)
 * to ♭5 (F)" on the Locrian page names a Phrygian note, and Phrygian is the
 * scale that knows to call it F♯ rather than G♭.
 */
export function NoteAt({
  offset,
  degrees,
}: {
  offset: number;
  degrees?: readonly ScaleDegree[];
}) {
  const { noteName, rootPc } = useScaleLesson();
  const name = degrees ? noteNameAt(rootPc, offset, degrees) : noteName(offset);
  return <span className="font-mono">{name}</span>;
}
