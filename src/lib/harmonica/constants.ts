/**
 * Harmonica-specific constants
 * Standard Richter tuning data for 10-hole diatonic harmonica
 */

import type { Position, Bend } from "./types";

/** All 5 harmonica positions with full metadata */
export const POSITIONS: Position[] = [
  {
    pos: 1,
    name: "Straight Harp",
    semitones: 0,
    mode: "Ionian",
    modeFull: "Ionian (Major)",
    quality: "major",
    color: "#10b981",
    scaleIntervals: [0, 2, 4, 5, 7, 9, 11],
    blueIntervals: [],
    bluesScale: null,
    drawFocus: false,
    useCase: "Folk, country, pop melodies",
    pattern: ["W", "W", "H", "W", "W", "W", "H"],
    feel: "Bright, happy, resolved",
  },
  {
    pos: 2,
    name: "Cross Harp",
    semitones: 7,
    mode: "Mixolydian",
    modeFull: "Mixolydian → Blues",
    quality: "dominant/blues",
    color: "#3b82f6",
    scaleIntervals: [0, 2, 4, 5, 7, 9, 10],
    blueIntervals: [3, 6],
    bluesScale: {
      intervals: [0, 3, 5, 6, 7, 10],
      names: ["Root", "♭3", "4", "♭5", "5", "♭7"],
      avoidFromScale: [2, 4, 9],
    },
    drawFocus: true,
    useCase: "Blues, rock, R&B — ~90% of blues harp",
    pattern: ["W", "W", "H", "W", "W", "H", "W"],
    feel: "Bluesy, dominant, tension",
  },
  {
    pos: 3,
    name: "3rd Position",
    semitones: 2,
    mode: "Dorian",
    modeFull: "Dorian (Minor)",
    quality: "minor",
    color: "#7c3aed",
    scaleIntervals: [0, 2, 3, 5, 7, 9, 10],
    blueIntervals: [6],
    bluesScale: null,
    drawFocus: false,
    useCase: "Minor blues, jazz, darker moods",
    pattern: ["W", "H", "W", "W", "W", "H", "W"],
    feel: "Minor but warm, jazzy",
  },
  {
    pos: 4,
    name: "4th Position",
    semitones: 9,
    mode: "Aeolian",
    modeFull: "Aeolian (Nat. Minor)",
    quality: "minor",
    color: "#0891b2",
    scaleIntervals: [0, 2, 3, 5, 7, 8, 10],
    blueIntervals: [6],
    bluesScale: null,
    drawFocus: false,
    useCase: "Natural minor, ballads",
    pattern: ["W", "H", "W", "W", "H", "W", "W"],
    feel: "Dark, sad, melancholy",
  },
  {
    pos: 5,
    name: "5th Position",
    semitones: 4,
    mode: "Phrygian",
    modeFull: "Phrygian",
    quality: "minor/exotic",
    color: "#ca8a04",
    scaleIntervals: [0, 1, 3, 5, 7, 8, 10],
    blueIntervals: [],
    bluesScale: null,
    drawFocus: false,
    useCase: "Spanish/Middle Eastern feel",
    pattern: ["H", "W", "W", "W", "H", "W", "W"],
    feel: "Exotic, Spanish, dark",
  },
];

/**
 * Standard Richter tuning blow note offsets (semitones from harp key)
 * Index 0 = hole 1, Index 9 = hole 10
 */
export const BLOW_OFFSETS = [0, 4, 7, 0, 4, 7, 0, 4, 7, 0] as const;

/**
 * Standard Richter tuning draw note offsets (semitones from harp key)
 * Index 0 = hole 1, Index 9 = hole 10
 */
export const DRAW_OFFSETS = [2, 7, 11, 2, 5, 9, 11, 2, 5, 9] as const;

/**
 * Available bends for each hole (0-indexed: hole 1 = index 0)
 * Holes 5 and 7 have no bends (empty arrays)
 */
export const BENDS: Bend[][] = [
  // Hole 1: one draw bend
  [{ offset: 1, type: "draw", depth: 1 }],
  // Hole 2: two draw bends
  [
    { offset: 6, type: "draw", depth: 1 },
    { offset: 5, type: "draw", depth: 2 },
  ],
  // Hole 3: three draw bends (most versatile hole)
  [
    { offset: 10, type: "draw", depth: 1 },
    { offset: 9, type: "draw", depth: 2 },
    { offset: 8, type: "draw", depth: 3 },
  ],
  // Hole 4: one draw bend
  [{ offset: 1, type: "draw", depth: 1 }],
  // Hole 5: no bends
  [],
  // Hole 6: one draw bend
  [{ offset: 8, type: "draw", depth: 1 }],
  // Hole 7: no bends
  [],
  // Hole 8: one blow bend
  [{ offset: 3, type: "blow", depth: 1 }],
  // Hole 9: one blow bend
  [{ offset: 6, type: "blow", depth: 1 }],
  // Hole 10: two blow bends
  [
    { offset: 11, type: "blow", depth: 1 },
    { offset: 10, type: "blow", depth: 2 },
  ],
];

/** Number of holes on a standard diatonic harmonica */
export const HARMONICA_HOLES = 10;

/** Maximum blow bends on any hole (for layout calculations) */
export const MAX_BLOW_BENDS = 2;

/** Maximum draw bends on any hole (for layout calculations) */
export const MAX_DRAW_BENDS = 3;

/** Position colors for quick lookup */
export const POSITION_COLORS: Record<number, string> = {
  1: "#10b981",
  2: "#3b82f6",
  3: "#7c3aed",
  4: "#0891b2",
  5: "#ca8a04",
};
