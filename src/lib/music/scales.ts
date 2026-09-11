/**
 * Scale and mode definitions
 *
 * The patterns below are views onto SCALE_CATALOG (scaleCatalog.ts), which
 * is the single source of truth. Keep adding scales there, not here.
 */

import { patternOf } from "./scaleCatalog";

/** Common scale patterns as semitone intervals from root */
export const SCALE_PATTERNS = {
  major: patternOf("major"),
  minor: patternOf("minor"),
  harmonicMinor: patternOf("harmonicMinor"),
  melodicMinor: patternOf("melodicMinor"),
  pentatonicMajor: patternOf("pentatonicMajor"),
  pentatonicMinor: patternOf("pentatonicMinor"),
  blues: patternOf("blues"),
  majorBlues: patternOf("majorBlues"),
  phrygianDominant: patternOf("phrygianDominant"),
  ukrainianDorian: patternOf("ukrainianDorian"),
  doubleHarmonic: patternOf("doubleHarmonic"),
} as const;

/** Mode patterns (all derived from major scale rotation) */
export const MODE_PATTERNS = {
  ionian: patternOf("major"),
  dorian: patternOf("dorian"),
  phrygian: patternOf("phrygian"),
  lydian: patternOf("lydian"),
  mixolydian: patternOf("mixolydian"),
  aeolian: patternOf("minor"),
  locrian: patternOf("locrian"),
} as const;

/** Step patterns for modes (W = whole step, H = half step) */
export const MODE_STEP_PATTERNS: Record<string, string[]> = {
  ionian: ["W", "W", "H", "W", "W", "W", "H"],
  dorian: ["W", "H", "W", "W", "W", "H", "W"],
  phrygian: ["H", "W", "W", "W", "H", "W", "W"],
  lydian: ["W", "W", "W", "H", "W", "W", "H"],
  mixolydian: ["W", "W", "H", "W", "W", "H", "W"],
  aeolian: ["W", "H", "W", "W", "H", "W", "W"],
  locrian: ["H", "W", "W", "H", "W", "W", "W"],
};

/** Mode metadata for display */
export interface ModeInfo {
  name: string;
  fullName: string;
  quality: string;
  feel: string;
}

export const MODE_INFO: Record<string, ModeInfo> = {
  ionian: {
    name: "Ionian",
    fullName: "Ionian (Major)",
    quality: "major",
    feel: "Bright, happy, resolved",
  },
  dorian: {
    name: "Dorian",
    fullName: "Dorian (Minor)",
    quality: "minor",
    feel: "Minor but warm, jazzy",
  },
  phrygian: {
    name: "Phrygian",
    fullName: "Phrygian",
    quality: "minor/exotic",
    feel: "Exotic, Spanish, dark",
  },
  lydian: {
    name: "Lydian",
    fullName: "Lydian",
    quality: "major/bright",
    feel: "Dreamy, floating, bright",
  },
  mixolydian: {
    name: "Mixolydian",
    fullName: "Mixolydian → Blues",
    quality: "dominant/blues",
    feel: "Bluesy, dominant, tension",
  },
  aeolian: {
    name: "Aeolian",
    fullName: "Aeolian (Nat. Minor)",
    quality: "minor",
    feel: "Dark, sad, melancholy",
  },
  locrian: {
    name: "Locrian",
    fullName: "Locrian",
    quality: "diminished",
    feel: "Unstable, dark, rare",
  },
};

/**
 * Check if a note (by semitone offset from root) is in a scale
 */
export function isInScale(
  noteOffset: number,
  scalePattern: readonly number[]
): boolean {
  const normalizedOffset = ((noteOffset % 12) + 12) % 12;
  return scalePattern.includes(normalizedOffset);
}

/**
 * Get scale notes for a given root and pattern
 */
export function getScaleNotes(
  rootIndex: number,
  pattern: readonly number[]
): number[] {
  return pattern.map((interval) => (rootIndex + interval) % 12);
}
