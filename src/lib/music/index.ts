/**
 * Music Theory Library
 * Shared utilities for note manipulation, scales, intervals, and modes
 */

// Constants
export {
  NOTES,
  NOTES_SHARP,
  NOTE_LABELS,
  ENHARMONIC_MAP,
  DEGREE_NAMES,
  SEMITONES_PER_OCTAVE,
  type NoteName,
  type NoteNameSharp,
} from "./constants";

// Note utilities
export {
  noteToIndex,
  indexToNote,
  niceNote,
  enharmonic,
  isBlackKey,
  noteName,
} from "./notes";

// Interval utilities
export {
  transpose,
  interval,
  relativeMinor,
  relativeMajor,
  getPlayingKey,
  getHarpNeeded,
} from "./intervals";

// Scale and mode utilities
export {
  SCALE_PATTERNS,
  MODE_PATTERNS,
  MODE_STEP_PATTERNS,
  MODE_INFO,
  isInScale,
  getScaleNotes,
  type ModeInfo,
} from "./scales";
