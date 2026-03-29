/**
 * Harmonica Library
 * Constants, types, and utilities for diatonic harmonica position system
 */

// Types
export type {
  BluesScale,
  Position,
  Bend,
  NoteClassification,
  PositionResult,
  PositionCalculation,
} from "./types";

// Constants
export {
  POSITIONS,
  BLOW_OFFSETS,
  DRAW_OFFSETS,
  BENDS,
  HARMONICA_HOLES,
  MAX_BLOW_BENDS,
  MAX_DRAW_BENDS,
  POSITION_COLORS,
} from "./constants";

// Utilities
export {
  noteInterval,
  classifyNote,
  isNoteInScale,
  isNoteInActiveScale,
  isAvoidNote,
  getScaleDegreeOrdinal,
  posLabel,
  getPosition,
  getPositionDegreeOrdinal,
  getPlayingTip,
  getModeExplanation,
  calculateAllPositions,
} from "./utils";

export type { ScaleMode } from "./utils";
