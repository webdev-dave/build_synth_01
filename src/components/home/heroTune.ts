/**
 * Hero tune: the opening phrase of "Yesterday" (Lennon–McCartney),
 * transposed from F major to C major so the whole line fits one
 * C4–C5 octave on the mini keyboard.
 *
 * NOTE: this melody is copyrighted — fine as a local placeholder,
 * swap for an original or public-domain line before a public release.
 */

export type KeyPos = { kind: "white" | "black"; index: number };

export type NoteInfo = {
  /** Equal-temperament pitch, in Hz */
  hz: number;
  /** Where the note lives on the mini keyboard */
  key: KeyPos;
  /** Matching map node label, if the note is on the map */
  node?: string;
  /**
   * Chromatic notes borrow a neighboring scale node: while sounding, that
   * node temporarily relabels to the accidental (its sharp/flat spelling).
   */
  alt?: { node: string; label: string };
};

export type NoteName =
  | "C4"
  | "C#4"
  | "D4"
  | "D#4"
  | "E4"
  | "F4"
  | "F#4"
  | "G4"
  | "G#4"
  | "A4"
  | "A#4"
  | "B4"
  | "C5";

export const NOTES: Record<NoteName, NoteInfo> = {
  C4: { hz: 261.63, key: { kind: "white", index: 0 }, node: "C" },
  "C#4": {
    hz: 277.18,
    key: { kind: "black", index: 0 },
    alt: { node: "D", label: "D♭" },
  },
  D4: { hz: 293.66, key: { kind: "white", index: 1 }, node: "D" },
  "D#4": {
    hz: 311.13,
    key: { kind: "black", index: 1 },
    alt: { node: "E", label: "E♭" },
  },
  E4: { hz: 329.63, key: { kind: "white", index: 2 }, node: "E" },
  F4: { hz: 349.23, key: { kind: "white", index: 3 }, node: "F" },
  "F#4": {
    hz: 369.99,
    key: { kind: "black", index: 2 },
    alt: { node: "F", label: "F♯" },
  },
  G4: { hz: 392.0, key: { kind: "white", index: 4 }, node: "G" },
  "G#4": {
    hz: 415.3,
    key: { kind: "black", index: 3 },
    alt: { node: "G", label: "G♯" },
  },
  A4: { hz: 440.0, key: { kind: "white", index: 5 }, node: "A" },
  "A#4": {
    hz: 466.16,
    key: { kind: "black", index: 4 },
    alt: { node: "B", label: "B♭" },
  },
  B4: { hz: 493.88, key: { kind: "white", index: 6 }, node: "B" },
  C5: { hz: 523.25, key: { kind: "white", index: 7 }, node: "C" },
};

/** White keys left→right; index in this array = white-key index. */
export const WHITE_NOTES: NoteName[] = [
  "C4",
  "D4",
  "E4",
  "F4",
  "G4",
  "A4",
  "B4",
  "C5",
];

/** Black keys left→right; index in this array = black-key index. */
export const BLACK_NOTES: NoteName[] = ["C#4", "D#4", "F#4", "G#4", "A#4"];

export type MelodyEvent = {
  /** null = rest */
  note: NoteName | null;
  beats: number;
  /** Sung syllable — used by the Melody Lab to reference notes by word */
  lyric?: string;
};

/*
 * "Yesterday, all my troubles seemed so far away…
 *  oh I believe in yesterday."
 */
export const MELODY: MelodyEvent[] = [
  { note: null, beats: 1.0 },
  { note: "D4", beats: 0.5, lyric: "Yes-" },
  { note: "C4", beats: 0.5, lyric: "-ter-" },
  { note: "C4", beats: 2.0, lyric: "-day" },
  { note: null, beats: 1.0 },
  { note: "E4", beats: 0.5, lyric: "all" },
  { note: "F#4", beats: 0.5, lyric: "my" },
  { note: "G#4", beats: 0.5, lyric: "trou-" },
  { note: "A4", beats: 0.5, lyric: "-bles" },
  { note: "B4", beats: 0.5, lyric: "seemed" },
  { note: "C5", beats: 0.5, lyric: "so" },
  { note: "B4", beats: 2.0, lyric: "far" },
  { note: "A4", beats: 0.5, lyric: "a-" },
  { note: "A4", beats: 1.5, lyric: "-way" },
  { note: "A4", beats: 0.5, lyric: "Now" },
  { note: "A4", beats: 0.5, lyric: "it" },
  { note: "G4", beats: 0.5, lyric: "looks" },
  { note: "F4", beats: 0.5, lyric: "as" },
  { note: "E4", beats: 0.5, lyric: "though" },
  { note: "D4", beats: 0.5, lyric: "they're" },
  { note: "F4", beats: 1.0, lyric: "here" },
  { note: "E4", beats: 2.0, lyric: "to" },
  { note: "E4", beats: 1.5, lyric: "stay" },
  { note: null, beats: 0.5 },
];

/** Gentle ballad tempo — slower than the record, calmer for a hero. */
export const BPM = 80;
export const BEAT = 60 / BPM;

/** Length of one full loop, in beats (rests included). */
export const TOTAL_BEATS = MELODY.reduce((sum, ev) => sum + ev.beats, 0);

export type TimedNote = { at: number; note: NoteName; beats: number };

/** The melody with absolute start times, for scheduling against the chords. */
export const MELODY_TIMED: TimedNote[] = (() => {
  const out: TimedNote[] = [];
  let t = 0;
  for (const ev of MELODY) {
    if (ev.note) out.push({ at: t, note: ev.note, beats: ev.beats });
    t += ev.beats;
  }
  return out;
})();

/**
 * Diatonic triad for each map node (C major harmony), voiced to fit the
 * C4–C5 keyboard: clicking a node plays these notes on the piano.
 */
export const NODE_CHORDS: Record<string, { name: string; notes: NoteName[] }> =
  {
    C: { name: "C", notes: ["C4", "E4", "G4"] },
    D: { name: "Dm", notes: ["D4", "F4", "A4"] },
    E: { name: "Em", notes: ["E4", "G4", "B4"] },
    F: { name: "F", notes: ["F4", "A4", "C5"] },
    G: { name: "G", notes: ["D4", "G4", "B4"] }, // 2nd inversion to stay in range
    A: { name: "Am", notes: ["E4", "A4", "C5"] }, // 1st inversion
    B: { name: "B°", notes: ["D4", "F4", "B4"] }, // 1st inversion
  };

export type ChordEvent = {
  /** Start time in beats from the top of the loop */
  at: number;
  beats: number;
  name: string;
  /** Low pad voicing (octaves 2–3), below the melody */
  hz: number[];
};

/*
 * The song's harmony, transposed with the melody (original F major:
 * F · Em7 A7 · Dm · B♭ C7 · F  →  C major: C · Bm E7 · Am · F G7 · C).
 * Voiced low so the pad sits under the lead.
 */
export const CHORDS: ChordEvent[] = [
  { at: 0, beats: 4, name: "C", hz: [130.81, 164.81, 196] }, // C3 E3 G3
  { at: 4, beats: 2, name: "Bm7", hz: [123.47, 146.83, 185, 220] }, // B2 D3 F#3 A3
  { at: 6, beats: 2, name: "E7", hz: [164.81, 207.65, 246.94, 293.66] }, // E3 G#3 B3 D4
  { at: 8, beats: 3, name: "Am", hz: [110, 130.81, 164.81] }, // A2 C3 E3
  { at: 11, beats: 1, name: "G", hz: [98, 123.47, 146.83] }, // G2 B2 D3
  { at: 12, beats: 2, name: "F", hz: [87.31, 110, 130.81] }, // F2 A2 C3
  { at: 14, beats: 2, name: "G7", hz: [98, 123.47, 146.83, 174.61] }, // G2 B2 D3 F3
  { at: 16, beats: 4, name: "C", hz: [130.81, 164.81, 196] }, // C3 E3 G3
];
