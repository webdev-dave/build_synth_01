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

export {
  COMMON_TIME_SIGNATURES,
  formatTimeSignature,
  parseTimeSignature,
  sameTimeSignature,
  ticksPerBar,
  timeSignatureLesson,
  type TimeSignature,
} from "./timeSignatures";

// Scale catalog — the single source of truth for scale/mode definitions
export {
  SCALE_CATALOG,
  SCALE_GROUP_LABELS,
  SCALE_TYPE_IDS,
  scaleInfo,
  degreesOf,
  patternOf,
  spellDegrees,
  spellScale,
  simpleName,
  rootNameFor,
  noteNameAt,
  type ScaleTypeId,
  type ScaleTypeInfo,
  type ScaleDegree,
  type ScaleGroup,
  type ScaleParent,
} from "./scaleCatalog";

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
