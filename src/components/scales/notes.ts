/**
 * Note helpers for the Scales module.
 *
 * Degree data comes from the shared catalog (`src/lib/music/scaleCatalog`),
 * so a lesson and the synth can never disagree about what a scale is. The
 * helpers here are the thin layer lesson widgets need on top of it.
 *
 * Spelling: 5- and 6-note scales use the simplest flat names (A blues is
 * A–C–D–E♭–E–G, never "D♯"); 7-note scales get one letter per degree, so
 * E freygish reads E–F–G♯–A–B–C–D and the augmented second is visible.
 * The synth keyboard itself labels keys with sharps (its key data comes
 * from synthUtils NOTE_NAMES); lesson prose notes the equivalence once.
 */

import {
  degreesOf,
  simpleName,
  type ScaleDegree,
} from "@/lib/music/scaleCatalog";

export type { ScaleDegree } from "@/lib/music/scaleCatalog";

export const FLAT_NOTE_NAMES = [
  "C",
  "D♭",
  "D",
  "E♭",
  "E",
  "F",
  "G♭",
  "G",
  "A♭",
  "A",
  "B♭",
  "B",
] as const;

/** Pitch-class (0–11, C = 0) → flat-spelled name. */
export function flatName(pitchClass: number): string {
  return simpleName(pitchClass);
}

export const BLUES_DEGREES: ScaleDegree[] = degreesOf("blues");

export const MINOR_PENTATONIC_DEGREES: ScaleDegree[] = degreesOf("pentatonicMinor");

/** The blue note — the one semitone offset the blues lesson exists to teach. */
export const BLUE_NOTE_OFFSET = 6;

/** Scale-degree label for a MIDI note, or null if it's outside the pattern. */
export function degreeLabelForNote(
  noteNumber: number,
  rootMidi: number,
  degrees: ScaleDegree[],
): string | null {
  const offset = ((noteNumber - rootMidi) % 12 + 12) % 12;
  return degrees.find((d) => d.offset === offset)?.label ?? null;
}
