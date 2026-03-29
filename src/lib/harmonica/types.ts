/**
 * Harmonica-specific type definitions
 */

/** Blues scale definition for a position */
export interface BluesScale {
  /** Semitone intervals from position root */
  intervals: number[];
  /** Display names for each scale degree */
  names: string[];
  /** Intervals to mark as "avoid" (not in blues scale) */
  avoidFromScale: number[];
}

/** Harmonica position definition */
export interface Position {
  /** Position number (1-5) */
  pos: number;
  /** Common name (e.g., "Cross Harp") */
  name: string;
  /** Semitone offset from harp key to playing key */
  semitones: number;
  /** Mode name */
  mode: string;
  /** Full mode name for display */
  modeFull: string;
  /** Musical quality (major, minor, dominant, etc.) */
  quality: string;
  /** Position theme color (hex) */
  color: string;
  /** Scale intervals from position root */
  scaleIntervals: number[];
  /** Blue note intervals (additional color tones) */
  blueIntervals: number[];
  /** Blues scale data (only for 2nd position) */
  bluesScale: BluesScale | null;
  /** Whether to emphasize draw notes (2nd position only) */
  drawFocus: boolean;
  /** Common use cases */
  useCase: string;
  /** Step pattern (W/H) */
  pattern: string[];
  /** Emotional character */
  feel: string;
}

/** Bend note definition */
export interface Bend {
  /** Semitone offset from harp root */
  offset: number;
  /** Bend type */
  type: "draw" | "blow";
  /** Bend depth (1 = half step, 2 = whole step, etc.) */
  depth: number;
}

/** Note classification result */
export type NoteClassification = "scale" | "blue" | null;

/** Position result with computed values */
export interface PositionResult extends Position {
  /** Harp key needed (when mode is "songKey") or selected harp */
  harpResult: string;
  /** Display result (harp needed or playing key) */
  displayResult: string;
}

/** Extended position calculation with algorithm steps */
export interface PositionCalculation extends PositionResult {
  /** Steps to calculate harp (for Algorithm section display) */
  algorithmSteps: string[];
  /** The calculated harp key */
  harpKey: string;
  /** The playing key */
  playingKey: string;
}
