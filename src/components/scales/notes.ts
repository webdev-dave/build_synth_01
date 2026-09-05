/**
 * Note spelling helpers for the Scales module.
 *
 * Blues (and most flat-side teaching material) spells the altered degrees as
 * flats — A blues is A–C–D–E♭–E–G, never "D♯". The synth keyboard itself
 * labels keys with sharps (its key data comes from synthUtils NOTE_NAMES),
 * so lesson prose notes the equivalence once instead of forking the keys.
 */

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
  return FLAT_NOTE_NAMES[((pitchClass % 12) + 12) % 12];
}

/** One scale degree as taught on a lesson page. */
export interface ScaleDegree {
  /** Semitones above the root. */
  offset: number;
  /** Degree label ("1", "♭3", "♭5", …). */
  label: string;
}

export const BLUES_DEGREES: ScaleDegree[] = [
  { offset: 0, label: "1" },
  { offset: 3, label: "♭3" },
  { offset: 5, label: "4" },
  { offset: 6, label: "♭5" },
  { offset: 7, label: "5" },
  { offset: 10, label: "♭7" },
];

export const MINOR_PENTATONIC_DEGREES: ScaleDegree[] = BLUES_DEGREES.filter(
  (d) => d.offset !== 6,
);

/** The blue note — the one semitone offset this whole lesson exists to teach. */
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
