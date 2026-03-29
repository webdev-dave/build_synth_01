/**
 * Core music theory constants
 * Single source of truth for note names, labels, and degree names
 */

/** Chromatic scale using flats (matches harmonica convention) */
export const NOTES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "F#",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
] as const;

export type NoteName = (typeof NOTES)[number];

/** Chromatic scale using sharps (matches keyboard/synth convention) */
export const NOTES_SHARP = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export type NoteNameSharp = (typeof NOTES_SHARP)[number];

/** Display labels with proper musical symbols */
export const NOTE_LABELS: Record<string, string> = {
  Db: "D♭",
  Eb: "E♭",
  "F#": "F♯",
  Ab: "A♭",
  Bb: "B♭",
  "C#": "C♯",
  "D#": "D♯",
  "G#": "G♯",
  "A#": "A♯",
};

/** Enharmonic equivalents (flat to sharp) */
export const ENHARMONIC_MAP: Record<string, string> = {
  Db: "C#",
  Eb: "D#",
  "F#": "Gb",
  Ab: "G#",
  Bb: "A#",
};

/** Scale degree names (interval from root) */
export const DEGREE_NAMES = [
  "1",
  "♭2",
  "2",
  "♭3",
  "3",
  "4",
  "♭5/♯4",
  "5",
  "♭6",
  "6",
  "♭7",
  "7",
] as const;

/** Number of semitones in an octave */
export const SEMITONES_PER_OCTAVE = 12;
