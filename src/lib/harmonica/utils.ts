/**
 * Harmonica-specific utility functions
 */

import type { Position, NoteClassification, PositionCalculation } from "./types";
import { POSITIONS } from "./constants";
import { transpose, getPlayingKey, getHarpNeeded } from "@/lib/music";

/**
 * Calculate the interval from the position root to a note
 * @param noteOffset - Semitone offset from harp key
 * @param position - Position object
 * @returns Interval in semitones (0-11)
 */
export function noteInterval(noteOffset: number, position: Position): number {
  return (noteOffset - position.semitones + 12) % 12;
}

/**
 * Classify a note as scale tone, blue note, or neither
 * @param noteOffset - Semitone offset from harp key
 * @param position - Position object
 */
export function classifyNote(
  noteOffset: number,
  position: Position
): NoteClassification {
  const interval = noteInterval(noteOffset, position);
  if (position.blueIntervals.includes(interval)) return "blue";
  if (position.scaleIntervals.includes(interval)) return "scale";
  return null;
}

/**
 * Check if a note is in the position's scale
 * Works for ALL positions using their scaleIntervals
 */
export function isNoteInScale(noteOffset: number, position: Position): boolean {
  const interval = noteInterval(noteOffset, position);
  return position.scaleIntervals.includes(interval);
}

/** Scale mode for positions that support multiple scales */
export type ScaleMode = "blues" | "full";

/**
 * Check if a note is in the active scale (blues or full/modal)
 * For 2nd position: "blues" uses bluesScale.intervals, "full" uses scaleIntervals (Mixolydian)
 * For other positions: always uses scaleIntervals
 */
export function isNoteInActiveScale(
  noteOffset: number,
  position: Position,
  scaleMode: ScaleMode = "blues"
): boolean {
  const interval = noteInterval(noteOffset, position);
  
  // For 2nd position with blues mode, use blues scale intervals
  if (scaleMode === "blues" && position.bluesScale) {
    return position.bluesScale.intervals.includes(interval);
  }
  
  // Otherwise use the full modal scale
  return position.scaleIntervals.includes(interval);
}

/**
 * Check if a note should be marked as "avoid" (not in blues scale)
 * Only applies when position has a bluesScale defined
 * @deprecated Use isNoteInScale instead for general scale checking
 */
export function isAvoidNote(noteOffset: number, position: Position): boolean {
  if (!position.bluesScale) return false;
  const interval = noteInterval(noteOffset, position);
  return position.bluesScale.avoidFromScale.includes(interval);
}

/**
 * Get the scale degree ordinal for a note (1st, 2nd, 3rd, etc.)
 * Returns null if the note is not in the active scale
 */
export function getScaleDegreeOrdinal(
  noteOffset: number,
  position: Position,
  scaleMode: ScaleMode = "blues"
): string | null {
  const interval = noteInterval(noteOffset, position);
  
  // Get active scale intervals
  const activeIntervals = scaleMode === "blues" && position.bluesScale
    ? position.bluesScale.intervals
    : position.scaleIntervals;
  
  // Find the index of this interval in the scale
  const degreeIndex = activeIntervals.indexOf(interval);
  
  if (degreeIndex === -1) return null;
  
  // Convert to 1-based ordinal
  const degree = degreeIndex + 1;
  
  // Format as ordinal
  switch (degree) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    default: return `${degree}th`;
  }
}

/**
 * Format position number with ordinal suffix
 * @example posLabel(1) → "1st", posLabel(2) → "2nd"
 */
export function posLabel(positionNumber: number): string {
  switch (positionNumber) {
    case 1:
      return "1st";
    case 2:
      return "2nd";
    case 3:
      return "3rd";
    default:
      return `${positionNumber}th`;
  }
}

/**
 * Get position object by position number
 */
export function getPosition(positionNumber: number): Position | undefined {
  return POSITIONS.find((p) => p.pos === positionNumber);
}

/**
 * Get the scale degree ordinal for a position
 * Used in theory explanations (e.g., "5th degree of C major")
 */
export function getPositionDegreeOrdinal(positionNumber: number): string {
  const ordinals = ["1st", "5th", "2nd", "6th", "3rd"];
  return ordinals[positionNumber - 1] || `${positionNumber}th`;
}

/**
 * Get playing tip text for a position
 */
export function getPlayingTip(position: Position): string {
  switch (position.pos) {
    case 1:
      return "Resolve to the blow notes — they're your root. Bends are ornamental here.";
    case 2:
      return "Resolve to draw 2. Live in the draw notes — they carry the blues. The blue bends are your blue notes (draw 3 bend = ♭3, essential). Blow notes are available but use them as passing tones, not home base.";
    case 3:
      return "Resolve to draw 1 / draw 4. Dorian minor — the gold bends fill in scale gaps.";
    case 4:
      return "Resolve to draw 6 / draw 10. Natural minor with a melancholy feel.";
    case 5:
      return "Resolve to blow 2 / blow 5. Exotic Phrygian — Spanish and Middle Eastern flavors.";
    default:
      return "";
  }
}

/**
 * Get theory explanation for why a mode's step pattern creates its character
 */
export function getModeExplanation(position: Position): string {
  switch (position.pos) {
    case 1:
      return "This is the standard major scale — no rotation needed. Bright and resolved.";
    case 2:
      return "That flat 7th (W W H W W H W) creates dominant/bluesy tension — add draw bends for the ♭3 and ♭5 blue notes and you're in full blues territory.";
    case 3:
      return "The minor 3rd (W H at the start) makes it minor, but the natural 6th keeps it warm — perfect for minor blues and jazz.";
    case 4:
      return "The minor 3rd and flat 6th together create that deeply sad, melancholy quality of natural minor.";
    case 5:
      return "The flat 2nd right at the start creates that distinctive Spanish/Middle Eastern tension.";
    default:
      return "";
  }
}

/**
 * Generate algorithm steps for a position calculation
 * Shows the step-by-step counting to get the harp key
 */
function generateAlgorithmSteps(
  inputKey: string,
  position: Position,
  mode: "songKey" | "harpKey"
): string[] {
  if (mode === "harpKey") {
    // When we have a harp, we just play in the calculated key
    const playingKey = getPlayingKey(inputKey, position.semitones);
    return [`${inputKey} harp → play in ${playingKey}`];
  }

  // When we have a song key, show how to find the harp
  switch (position.pos) {
    case 1:
      // 1st position: same key
      return [inputKey, `grab ${inputKey} harp`];
    case 2: {
      // 2nd position: count up a 4th (5 semitones)
      const steps = [
        inputKey,
        transpose(inputKey, 2),
        transpose(inputKey, 4),
        transpose(inputKey, 5),
      ];
      return [...steps.slice(0, 3), `${steps[3]} (grab ${steps[3]} harp)`];
    }
    case 3: {
      // 3rd position: down a whole step (-2 semitones)
      const harp = transpose(inputKey, -2);
      return [inputKey, `down to ${harp}`, `grab ${harp} harp`];
    }
    case 4: {
      // 4th position: down a minor 3rd (-3 semitones)  
      const harp = transpose(inputKey, -3);
      return [inputKey, `down to ${harp}`, `grab ${harp} harp`];
    }
    case 5: {
      // 5th position: down a major 3rd (-4 semitones)
      const harp = transpose(inputKey, -4);
      return [inputKey, `down to ${harp}`, `grab ${harp} harp`];
    }
    default:
      return [];
  }
}

/**
 * SINGLE SOURCE OF TRUTH for all position calculations
 * 
 * @param inputKey - The key (song key or harp key)
 * @param mode - "songKey" (I know the song key) | "harpKey" (I have a harp)
 * @returns All 5 positions with calculated keys, algorithm steps, and full metadata
 * 
 * @example
 * // Song is in A, what harps do I need?
 * const positions = calculateAllPositions("A", "songKey");
 * // positions[1] = { pos: 2, harpKey: "D", playingKey: "A", ... }
 * 
 * @example
 * // I have a C harp, what keys can I play?
 * const positions = calculateAllPositions("C", "harpKey");
 * // positions[1] = { pos: 2, harpKey: "C", playingKey: "G", ... }
 */
export function calculateAllPositions(
  inputKey: string,
  mode: "songKey" | "harpKey"
): PositionCalculation[] {
  return POSITIONS.map((position) => {
    const harpKey = mode === "songKey"
      ? getHarpNeeded(inputKey, position.semitones)
      : inputKey;
    
    const playingKey = mode === "songKey"
      ? inputKey
      : getPlayingKey(inputKey, position.semitones);

    return {
      ...position,
      harpResult: harpKey,
      displayResult: mode === "songKey" ? harpKey : playingKey,
      harpKey,
      playingKey,
      algorithmSteps: generateAlgorithmSteps(inputKey, position, mode),
    };
  });
}
