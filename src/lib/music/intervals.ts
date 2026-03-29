/**
 * Interval and transposition utilities
 */

import { NOTES, SEMITONES_PER_OCTAVE } from "./constants";
import { noteToIndex, indexToNote } from "./notes";

/**
 * Transpose a note by a number of semitones
 * @param note - Starting note name
 * @param semitones - Number of semitones to transpose (positive = up, negative = down)
 * @param preferSharp - If true, use sharp notation for result
 */
export function transpose(
  note: string,
  semitones: number,
  preferSharp = false
): string {
  const index = noteToIndex(note);
  return indexToNote(index + semitones, preferSharp);
}

/**
 * Calculate the interval (in semitones) between two notes
 * @returns Interval in semitones (0-11)
 */
export function interval(fromNote: string, toNote: string): number {
  const fromIndex = noteToIndex(fromNote);
  const toIndex = noteToIndex(toNote);
  return (
    ((toIndex - fromIndex) % SEMITONES_PER_OCTAVE) + SEMITONES_PER_OCTAVE
  ) % SEMITONES_PER_OCTAVE;
}

/**
 * Get the relative minor of a major key
 * (down 3 semitones / up 9 semitones)
 */
export function relativeMinor(majorNote: string): string {
  return NOTES[(noteToIndex(majorNote) + 9) % SEMITONES_PER_OCTAVE];
}

/**
 * Get the relative major of a minor key
 * (up 3 semitones)
 */
export function relativeMajor(minorNote: string): string {
  return NOTES[(noteToIndex(minorNote) + 3) % SEMITONES_PER_OCTAVE];
}

/**
 * Get the playing key given a harp key and position semitone offset
 */
export function getPlayingKey(harpKey: string, semitones: number): string {
  return NOTES[(NOTES.indexOf(harpKey as (typeof NOTES)[number]) + semitones) % SEMITONES_PER_OCTAVE];
}

/**
 * Get the harp needed for a song key and position semitone offset
 */
export function getHarpNeeded(songKey: string, semitones: number): string {
  return NOTES[
    (NOTES.indexOf(songKey as (typeof NOTES)[number]) - semitones + SEMITONES_PER_OCTAVE) %
      SEMITONES_PER_OCTAVE
  ];
}
