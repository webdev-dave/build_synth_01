/**
 * Shared chord vocabulary — the one place the app says what a chord is.
 *
 * A chord is named relative to a *key* ("the dominant seventh on the fourth
 * degree", IV7), so the same progression transposes by changing one number.
 * Everything else derives: the pitch classes, a printable name in the key's
 * spelling, a close voicing for a keyboard, the nearest voicing to a
 * previous chord, and what role a pressed key plays against the chord.
 *
 * Deliberately import-free (like scaleCatalog.ts) so a plain Node script
 * can audit it. Callers that want key-aware spelling ("E♭", not "D♯") pass
 * a `spell` function from the scale catalog.
 */

export type ChordQuality =
  | "major"
  | "minor"
  | "dim"
  | "aug"
  | "dom7"
  | "maj7"
  | "min7"
  | "halfDim7"
  | "power";

export interface ChordQualityInfo {
  /** "dominant seventh" */
  name: string;
  /** Suffix after the root letter: "7", "m", "m7", "°", "5". */
  symbol: string;
  /** Semitones above the chord root, ascending, root first. */
  intervals: readonly number[];
}

export const CHORD_QUALITIES: Record<ChordQuality, ChordQualityInfo> = {
  major: { name: "major", symbol: "", intervals: [0, 4, 7] },
  minor: { name: "minor", symbol: "m", intervals: [0, 3, 7] },
  dim: { name: "diminished", symbol: "°", intervals: [0, 3, 6] },
  aug: { name: "augmented", symbol: "+", intervals: [0, 4, 8] },
  dom7: { name: "dominant seventh", symbol: "7", intervals: [0, 4, 7, 10] },
  maj7: { name: "major seventh", symbol: "maj7", intervals: [0, 4, 7, 11] },
  min7: { name: "minor seventh", symbol: "m7", intervals: [0, 3, 7, 10] },
  halfDim7: { name: "half-diminished seventh", symbol: "ø7", intervals: [0, 3, 6, 10] },
  power: { name: "power chord", symbol: "5", intervals: [0, 7] },
};

export const CHORD_QUALITY_IDS = Object.keys(CHORD_QUALITIES) as ChordQuality[];

/** A chord relative to a key: "the dominant seventh on the fourth degree". */
export interface ChordSpec {
  /** Chord root as semitones above the key root (IV = 5, V = 7, ♭VII = 10). */
  root: number;
  quality: ChordQuality;
  /** Roman numeral as it prints ("I7", "IV7", "ii", "♭VII"). */
  numeral: string;
}

/** Which voice sounds a chord. Theory names it; `src/lib/audio` makes it. */
export type ChordVoice = "organ" | "pad";

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/** Roman numeral for a scale degree offset in semitones (major-scale numbering). */
const NUMERAL_BY_OFFSET: Record<number, string> = {
  0: "I",
  1: "♭II",
  2: "II",
  3: "♭III",
  4: "III",
  5: "IV",
  6: "♯IV",
  7: "V",
  8: "♭VI",
  9: "VI",
  10: "♭VII",
  11: "VII",
};

/**
 * Build a spec from an offset and quality, printing the numeral the
 * conventional way: lower-case for minor/diminished, "7" for sevenths.
 */
export function chord(root: number, quality: ChordQuality, numeral?: string): ChordSpec {
  const base = NUMERAL_BY_OFFSET[mod12(root)] ?? "I";
  const info = CHORD_QUALITIES[quality];
  const lower = quality === "minor" || quality === "min7" || quality === "dim" || quality === "halfDim7";
  // Lower-case already says "minor": ii, not iim; ii7, not iim7.
  const symbol = lower ? info.symbol.replace(/^m/, "") : info.symbol;
  const printed = numeral ?? `${lower ? base.toLowerCase() : base}${symbol}`;
  return { root: mod12(root), quality, numeral: printed };
}

/** Pitch classes (0–11) of the chord in a key, chord root first. */
export function chordPitchClasses(keyRootPc: number, spec: ChordSpec): number[] {
  const root = mod12(keyRootPc + spec.root);
  return CHORD_QUALITIES[spec.quality].intervals.map((i) => mod12(root + i));
}

/** The chord's root pitch class in a key. */
export function chordRootPc(keyRootPc: number, spec: ChordSpec): number {
  return mod12(keyRootPc + spec.root);
}

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
const LETTER_PC: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

/** Simplest name for a pitch class: natural if it is one, else the flat. */
function simpleName(pc: number): string {
  const p = mod12(pc);
  for (const letter of LETTERS) if (LETTER_PC[letter] === p) return letter;
  const above = LETTERS.find((l) => LETTER_PC[l] === mod12(p + 1))!;
  return `${above}♭`;
}

/**
 * "A7", "D7", "E7" — root name plus the quality symbol. Pass `spell` (a
 * pitch class → name function built from the key's scale) so A blues says
 * E♭ where the default would too, but E freygish says G♯, not A♭.
 */
export function chordName(
  keyRootPc: number,
  spec: ChordSpec,
  spell: (pc: number) => string = simpleName,
): string {
  return `${spell(chordRootPc(keyRootPc, spec))}${CHORD_QUALITIES[spec.quality].symbol}`;
}

/**
 * Close voicing with the chord root at or above `lowMidi` and the rest
 * stacked ascending inside one octave — a keyboard never jumps registers.
 */
export function voiceChord(keyRootPc: number, spec: ChordSpec, lowMidi: number): number[] {
  const rootPc = chordRootPc(keyRootPc, spec);
  const rootMidi = lowMidi + mod12(rootPc - lowMidi);
  return CHORD_QUALITIES[spec.quality].intervals.map((i) => rootMidi + i);
}

/**
 * Smooth voicing: every chord tone placed inside one fixed octave window
 * `[windowLowMidi, windowLowMidi + 12)`. A pitch class always lands on the
 * same key, so common tones between consecutive chords stay put and the
 * others move by step — the keyboard shows chords sliding, not jumping,
 * and a chorus of changes can't drift down the piano. Ascending order.
 */
export function voiceLead(keyRootPc: number, spec: ChordSpec, windowLowMidi: number): number[] {
  return chordPitchClasses(keyRootPc, spec)
    .map((pc) => windowLowMidi + mod12(pc - windowLowMidi))
    .sort((a, b) => a - b);
}

export interface IdentifiedChord {
  rootPc: number;
  quality: ChordQuality;
}

/**
 * Name the chord a set of pitch classes spells, or null. Tries every note as
 * root against every quality and prefers the reading with the most notes
 * (a four-note set is a seventh, not a triad plus a stray). Ties break to
 * the quality list order — major before minor, sevenths after triads.
 */
export function identifyChord(pcs: readonly number[]): IdentifiedChord | null {
  const set = new Set(pcs.map(mod12));
  if (set.size < 2) return null;
  const sorted = [...set].sort((a, b) => a - b);
  for (const rootPc of sorted) {
    for (const quality of CHORD_QUALITY_IDS) {
      const ivs = CHORD_QUALITIES[quality].intervals;
      if (ivs.length !== set.size) continue;
      if (ivs.every((i) => set.has(mod12(rootPc + i)))) return { rootPc, quality };
    }
  }
  return null;
}

export type ChordRole = "root" | "3rd" | "5th" | "7th";

/** Chord-relative role of an interval above the chord root, or null. */
export function roleOfInterval(semitones: number): ChordRole | null {
  switch (mod12(semitones)) {
    case 0:
      return "root";
    case 3:
    case 4:
      return "3rd";
    case 6:
    case 7:
    case 8:
      return "5th";
    case 10:
    case 11:
      return "7th";
    default:
      return null;
  }
}

/** Role of each chord tone, in interval order ("root", "3rd", "5th", "7th"). */
export function chordRoles(spec: ChordSpec): ChordRole[] {
  return CHORD_QUALITIES[spec.quality].intervals.map(
    (i) => roleOfInterval(i) ?? "root",
  );
}

export interface NoteRole {
  /** The note is one of the chord's tones. */
  inChord: boolean;
  /** Which tone, when it is one. */
  chordRole: ChordRole | null;
  /** Scale-degree label of the note in the key ("♭3"), when the scale has it. */
  scaleDegree: string | null;
}

/**
 * What a pitch class is doing against a chord in a key — drives both the
 * lit keys of a chord lock and the one-line caption under the keyboard, so
 * the two can never disagree. `degrees` is the key's scale as
 * `[offset, label]` pairs (offset in semitones above the key root).
 */
export function noteRole(
  pc: number,
  keyRootPc: number,
  spec: ChordSpec,
  degrees: readonly { offset: number; label: string }[] = [],
): NoteRole {
  const rootPc = chordRootPc(keyRootPc, spec);
  const interval = mod12(pc - rootPc);
  const inChord = CHORD_QUALITIES[spec.quality].intervals.some(
    (i) => mod12(i) === interval,
  );
  const offset = mod12(pc - keyRootPc);
  const degree = degrees.find((d) => mod12(d.offset) === offset);
  return {
    inChord,
    chordRole: inChord ? roleOfInterval(interval) : null,
    scaleDegree: degree ? degree.label : null,
  };
}

/**
 * Pitch classes covered by a set of chords in a key — "the three chords
 * cover every note of the major scale" is this, seen.
 */
export function unionPitchClasses(keyRootPc: number, specs: readonly ChordSpec[]): number[] {
  const set = new Set<number>();
  for (const spec of specs) for (const pc of chordPitchClasses(keyRootPc, spec)) set.add(pc);
  return [...set].sort((a, b) => a - b);
}
