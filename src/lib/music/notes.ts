/**
 * Note manipulation utilities
 */

import {
  NOTES,
  NOTES_SHARP,
  NOTE_LABELS,
  ENHARMONIC_MAP,
  SEMITONES_PER_OCTAVE,
} from "./constants";

/**
 * Convert note name to chromatic index (0-11)
 * Handles both flat and sharp notation
 */
export function noteToIndex(note: string): number {
  const flatIndex = NOTES.indexOf(note as (typeof NOTES)[number]);
  if (flatIndex !== -1) return flatIndex;

  const sharpIndex = NOTES_SHARP.indexOf(note as (typeof NOTES_SHARP)[number]);
  if (sharpIndex !== -1) return sharpIndex;

  return 0;
}

/**
 * Convert chromatic index to note name
 * @param index - Chromatic index (0-11, or any integer - will be normalized)
 * @param preferSharp - If true, use sharp notation; otherwise use flat
 */
export function indexToNote(index: number, preferSharp = false): string {
  const normalizedIndex =
    ((index % SEMITONES_PER_OCTAVE) + SEMITONES_PER_OCTAVE) %
    SEMITONES_PER_OCTAVE;
  return preferSharp ? NOTES_SHARP[normalizedIndex] : NOTES[normalizedIndex];
}

/**
 * Get display-friendly note name with proper musical symbols
 * e.g., "Db" → "D♭", "F#" → "F♯"
 */
export function niceNote(note: string): string {
  return NOTE_LABELS[note] || note;
}

/**
 * Get enharmonic representation showing both names
 * e.g., "Db" → "Db/C#", "C" → "C"
 */
export function enharmonic(note: string): string {
  const equivalent = ENHARMONIC_MAP[note];
  return equivalent ? `${note}/${equivalent}` : note;
}

/**
 * Check if a chromatic index represents a black key on piano
 */
export function isBlackKey(index: number): boolean {
  const normalized =
    ((index % SEMITONES_PER_OCTAVE) + SEMITONES_PER_OCTAVE) %
    SEMITONES_PER_OCTAVE;
  return [1, 3, 6, 8, 10].includes(normalized);
}

/**
 * Get note name from harp index and semitone offset
 */
export function noteName(harpIndex: number, semitoneOffset: number): string {
  return NOTES[(harpIndex + semitoneOffset) % SEMITONES_PER_OCTAVE];
}
