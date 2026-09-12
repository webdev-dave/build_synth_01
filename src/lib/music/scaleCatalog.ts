/**
 * The scale catalog — one source of truth for every scale and mode the app
 * teaches or plays.
 *
 * Each entry lists its degrees as *quality-aware labels* ("♭3", "♯4") with
 * their semitone offsets. Everything else derives: the interval pattern, the
 * note spelling for a given root, the parent-scale relationship. Lesson
 * widgets, the scale registry, and (later) the synth's type selector all
 * read this table, so they cannot disagree about what a scale is.
 *
 * Theory reference and audit: docs/plans/synth-scale-type-selector.md
 * ("Music theory foundation"). Entries beyond that audited table are marked
 * in comments and were hand-verified when added.
 *
 * Deliberately import-free so a plain Node script can load it for checks.
 */

export type ScaleTypeId =
  | "major"
  | "minor"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "locrian"
  | "harmonicMinor"
  | "melodicMinor"
  | "pentatonicMajor"
  | "pentatonicMinor"
  | "blues"
  | "majorBlues"
  | "phrygianDominant"
  | "ukrainianDorian"
  | "doubleHarmonic"
  | "rast";

/** One scale degree: semitones above the root and its label ("1", "♭3", "♯4"). */
export interface ScaleDegree {
  offset: number;
  label: string;
  /**
   * Cents the degree sits away from its 12-TET `offset` — the quarter tones
   * of maqam (Rast's 3rd is E lowered 50¢, so `offset: 4, cents: -50`).
   * Omitted means exactly on the key. The keyboard's tuning panel reads
   * this to bend the right keys; spelling appends "½♭" / "½♯".
   */
  cents?: number;
}

export type ScaleGroup =
  | "common"
  | "modes"
  | "pentatonic"
  | "harmonicMinorFamily"
  | "maqam";

export const SCALE_GROUP_LABELS: Record<ScaleGroup, string> = {
  common: "Common",
  modes: "Modes of the major scale",
  pentatonic: "Pentatonic & blues",
  harmonicMinorFamily: "Harmonic-minor family",
  maqam: "Maqam (quarter tones)",
};

/**
 * A scale that shares its exact note set with another scale, started from a
 * different degree. `offsetSemitones` is how far the parent's root sits
 * *above* this scale's root (E Phrygian dominant → A harmonic minor: +5).
 */
export interface ScaleParent {
  scaleId: ScaleTypeId;
  offsetSemitones: number;
  /** How the relationship reads ("5th mode of harmonic minor"). */
  label: string;
}

export interface ScaleTypeInfo {
  id: ScaleTypeId;
  name: string;
  /** Other names the reader may know it by. */
  aliases?: readonly string[];
  degrees: readonly ScaleDegree[];
  group: ScaleGroup;
  /** Short character line for pickers and learn panels. */
  feel: string;
  parent?: ScaleParent;
}

const d = (offset: number, label: string): ScaleDegree => ({ offset, label });

export const SCALE_CATALOG: Record<ScaleTypeId, ScaleTypeInfo> = {
  major: {
    id: "major",
    name: "Major",
    aliases: ["Ionian"],
    degrees: [d(0, "1"), d(2, "2"), d(4, "3"), d(5, "4"), d(7, "5"), d(9, "6"), d(11, "7")],
    group: "common",
    feel: "Bright, settled — the reference every other scale is measured against",
  },
  minor: {
    id: "minor",
    name: "Natural minor",
    aliases: ["Aeolian"],
    degrees: [d(0, "1"), d(2, "2"), d(3, "♭3"), d(5, "4"), d(7, "5"), d(8, "♭6"), d(10, "♭7")],
    group: "common",
    feel: "Dark, melancholy",
    parent: { scaleId: "major", offsetSemitones: 3, label: "6th mode of the major scale (relative major)" },
  },
  dorian: {
    id: "dorian",
    name: "Dorian",
    degrees: [d(0, "1"), d(2, "2"), d(3, "♭3"), d(5, "4"), d(7, "5"), d(9, "6"), d(10, "♭7")],
    group: "modes",
    feel: "Minor but warm — the raised 6th lifts it",
    parent: { scaleId: "major", offsetSemitones: 10, label: "2nd mode of the major scale" },
  },
  phrygian: {
    id: "phrygian",
    name: "Phrygian",
    degrees: [d(0, "1"), d(1, "♭2"), d(3, "♭3"), d(5, "4"), d(7, "5"), d(8, "♭6"), d(10, "♭7")],
    group: "modes",
    feel: "Dark and tense — the ♭2 leans hard on the root",
    parent: { scaleId: "major", offsetSemitones: 8, label: "3rd mode of the major scale" },
  },
  lydian: {
    id: "lydian",
    name: "Lydian",
    degrees: [d(0, "1"), d(2, "2"), d(4, "3"), d(6, "♯4"), d(7, "5"), d(9, "6"), d(11, "7")],
    group: "modes",
    feel: "Dreamy, floating — major with a raised 4th",
    parent: { scaleId: "major", offsetSemitones: 7, label: "4th mode of the major scale" },
  },
  mixolydian: {
    id: "mixolydian",
    name: "Mixolydian",
    degrees: [d(0, "1"), d(2, "2"), d(4, "3"), d(5, "4"), d(7, "5"), d(9, "6"), d(10, "♭7")],
    group: "modes",
    feel: "Major with a bluesy ♭7 — dominant, unresolved",
    parent: { scaleId: "major", offsetSemitones: 5, label: "5th mode of the major scale" },
  },
  locrian: {
    id: "locrian",
    name: "Locrian",
    degrees: [d(0, "1"), d(1, "♭2"), d(3, "♭3"), d(5, "4"), d(6, "♭5"), d(8, "♭6"), d(10, "♭7")],
    group: "modes",
    feel: "Unstable — the ♭5 means the home chord is diminished",
    parent: { scaleId: "major", offsetSemitones: 1, label: "7th mode of the major scale" },
  },
  harmonicMinor: {
    id: "harmonicMinor",
    name: "Harmonic minor",
    degrees: [d(0, "1"), d(2, "2"), d(3, "♭3"), d(5, "4"), d(7, "5"), d(8, "♭6"), d(11, "7")],
    group: "harmonicMinorFamily",
    feel: "Minor with a raised 7th — the augmented-second leap between ♭6 and 7",
  },
  melodicMinor: {
    id: "melodicMinor",
    name: "Melodic minor",
    aliases: ["Jazz minor"],
    // Ascending (jazz) form. Classical practice descends as natural minor;
    // a static membership map can't be direction-dependent, so the lesson
    // copy carries that note rather than the pattern pretending to.
    degrees: [d(0, "1"), d(2, "2"), d(3, "♭3"), d(5, "4"), d(7, "5"), d(9, "6"), d(11, "7")],
    group: "harmonicMinorFamily",
    feel: "Minor below, major above — smooth and jazz-flavoured",
  },
  pentatonicMajor: {
    id: "pentatonicMajor",
    name: "Major pentatonic",
    degrees: [d(0, "1"), d(2, "2"), d(4, "3"), d(7, "5"), d(9, "6")],
    group: "pentatonic",
    feel: "Open and sunny — no half steps anywhere",
  },
  pentatonicMinor: {
    id: "pentatonicMinor",
    name: "Minor pentatonic",
    degrees: [d(0, "1"), d(3, "♭3"), d(5, "4"), d(7, "5"), d(10, "♭7")],
    group: "pentatonic",
    feel: "The first solo scale — nothing clashes",
    parent: { scaleId: "pentatonicMajor", offsetSemitones: 3, label: "same notes as the major pentatonic a minor 3rd up" },
  },
  blues: {
    id: "blues",
    name: "Blues",
    aliases: ["Minor blues"],
    degrees: [d(0, "1"), d(3, "♭3"), d(5, "4"), d(6, "♭5"), d(7, "5"), d(10, "♭7")],
    group: "pentatonic",
    feel: "Minor pentatonic plus the ♭5 blue note",
  },
  // Beyond the audited 14-type table; hand-verified 2026-09-11:
  // major pentatonic (1 2 3 5 6) plus the ♭3 blue note. Symmetric twin of
  // the minor blues scale (minor pentatonic plus ♭5).
  majorBlues: {
    id: "majorBlues",
    name: "Major blues",
    degrees: [d(0, "1"), d(2, "2"), d(3, "♭3"), d(4, "3"), d(7, "5"), d(9, "6")],
    group: "pentatonic",
    feel: "Major pentatonic plus the ♭3 blue note",
  },
  phrygianDominant: {
    id: "phrygianDominant",
    name: "Phrygian dominant",
    aliases: ["Freygish", "Ahava Rabbah", "Hijaz", "Spanish Phrygian"],
    degrees: [d(0, "1"), d(1, "♭2"), d(4, "3"), d(5, "4"), d(7, "5"), d(8, "♭6"), d(10, "♭7")],
    group: "harmonicMinorFamily",
    feel: "♭2 against a major 3rd — the augmented-second leap of klezmer, flamenco, and maqam Hijaz",
    parent: { scaleId: "harmonicMinor", offsetSemitones: 5, label: "5th mode of harmonic minor" },
  },
  ukrainianDorian: {
    id: "ukrainianDorian",
    name: "Ukrainian Dorian",
    aliases: ["Misheberakh", "Romanian minor", "Dorian ♯4"],
    degrees: [d(0, "1"), d(2, "2"), d(3, "♭3"), d(6, "♯4"), d(7, "5"), d(9, "6"), d(10, "♭7")],
    group: "harmonicMinorFamily",
    feel: "Dorian with a raised 4th — the augmented second sits between ♭3 and ♯4",
    parent: { scaleId: "harmonicMinor", offsetSemitones: 7, label: "4th mode of harmonic minor" },
  },
  // Beyond the audited table; hand-verified 2026-09-11: Phrygian dominant
  // with the 7th raised, giving two augmented seconds (♭2–3 and ♭6–7).
  doubleHarmonic: {
    id: "doubleHarmonic",
    name: "Double harmonic",
    aliases: ["Hijaz Kar", "Byzantine", "Arabic scale"],
    degrees: [d(0, "1"), d(1, "♭2"), d(4, "3"), d(5, "4"), d(7, "5"), d(8, "♭6"), d(11, "7")],
    group: "harmonicMinorFamily",
    feel: "Two augmented seconds — Phrygian dominant with a raised 7th",
  },
  // Beyond the audited table; hand-verified 2026-09-11 against the
  // Korg/Yamaha "Oriental scale" convention (quarter tone = −50¢) and
  // Marcus (1993) / Abu Shumays on Rast intonation: the 3rd and 7th are
  // half-flat, so on C the white keys with E and B bent. Real Rast thirds
  // range roughly 340–360¢ by region; −50 is the keyboard setting, not a
  // measurement, and the lesson copy says so.
  rast: {
    id: "rast",
    name: "Rast",
    aliases: ["Maqam Rast"],
    degrees: [
      d(0, "1"),
      d(2, "2"),
      { offset: 4, label: "½♭3", cents: -50 },
      d(5, "4"),
      d(7, "5"),
      d(9, "6"),
      { offset: 11, label: "½♭7", cents: -50 },
    ],
    group: "maqam",
    feel: "A major-scale shape with the 3rd and 7th a quarter tone flat — the foundational Arabic maqam",
  },
};

export const SCALE_TYPE_IDS = Object.keys(SCALE_CATALOG) as ScaleTypeId[];

export function scaleInfo(id: ScaleTypeId): ScaleTypeInfo {
  return SCALE_CATALOG[id];
}

/** Degrees of a scale as the lesson widgets consume them. */
export function degreesOf(id: ScaleTypeId): ScaleDegree[] {
  return [...SCALE_CATALOG[id].degrees];
}

/** Semitone offsets above the root, ascending. */
export function patternOf(id: ScaleTypeId): number[] {
  return SCALE_CATALOG[id].degrees.map((deg) => deg.offset);
}

/** True when any degree sits off its 12-TET key (Rast). */
export function hasQuarterTones(degrees: readonly ScaleDegree[]): boolean {
  return degrees.some((deg) => (deg.cents ?? 0) !== 0);
}

/**
 * Cents per pitch class (C = 0) that make a 12-TET keyboard sound this
 * scale from `rootPc` — the switches a Middle Eastern keyboard player would
 * press. All zeros for an ordinary scale.
 */
export function detuneMapFor(rootPc: number, degrees: readonly ScaleDegree[]): number[] {
  const map = Array<number>(12).fill(0);
  for (const deg of degrees) {
    if (deg.cents) map[mod12(rootPc + deg.offset)] = deg.cents;
  }
  return map;
}

/* ------------------------------------------------------------------------ */
/* Spelling                                                                  */
/* ------------------------------------------------------------------------ */

const LETTERS = ["C", "D", "E", "F", "G", "A", "B"] as const;
type Letter = (typeof LETTERS)[number];
const LETTER_PC: Record<Letter, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

const ACCIDENTAL_GLYPH: Record<number, string> = {
  [-2]: "𝄫",
  [-1]: "♭",
  0: "",
  1: "♯",
  2: "𝄪",
};

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/** Signed accidental (−2…2) that turns `letter` into `pc`, or null if it can't. */
function accidentalFor(letter: Letter, pc: number): number | null {
  const diff = mod12(pc - LETTER_PC[letter]);
  if (diff === 0) return 0;
  if (diff === 1) return 1;
  if (diff === 2) return 2;
  if (diff === 11) return -1;
  if (diff === 10) return -2;
  return null;
}

/** The diatonic number a degree label refers to ("♭3" → 3, "♯4" → 4). */
function degreeNumber(label: string): number {
  const n = parseInt(label.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(n) && n >= 1 && n <= 7 ? n : 1;
}

interface SpelledNote {
  letter: Letter;
  accidental: number;
}

function glyph(n: SpelledNote): string {
  return `${n.letter}${ACCIDENTAL_GLYPH[n.accidental]}`;
}

/** Root letter candidates for a pitch class: natural and single-accidental only. */
function rootCandidates(rootPc: number): SpelledNote[] {
  const out: SpelledNote[] = [];
  for (const letter of LETTERS) {
    const acc = accidentalFor(letter, rootPc);
    if (acc !== null && Math.abs(acc) <= 1) out.push({ letter, accidental: acc });
  }
  // Naturals first, then flats before sharps (matches the app's flat default).
  return out.sort((a, b) => Math.abs(a.accidental) - Math.abs(b.accidental) || a.accidental - b.accidental);
}

/**
 * Spell a set of degrees from a root, one letter per diatonic degree.
 *
 * Heptatonic scales get the letter-once rule: degree n uses the n-th letter
 * above the root, and the accidental is whatever makes that letter land on
 * the right key. Among the root's enharmonic spellings we pick the one with
 * no double accidentals (then the fewest accidentals) — evaluated per scale,
 * because the "clean" root depends on the pattern (B♭ major, but G♯ Phrygian
 * dominant and A♭ Ukrainian Dorian).
 *
 * Five- and six-note scales can't be letter-once, so each note takes the
 * simplest name for its key (natural, else a flat), which is how blues and
 * pentatonic material is conventionally written and matches the flat names
 * the lesson pages already use.
 */
export function spellDegrees(rootPc: number, degrees: readonly ScaleDegree[]): string[] {
  return spellOnKeys(rootPc, degrees).map((name, i) => name + centsSuffix(degrees[i].cents ?? 0));
}

/**
 * "½♭" / "½♯" for the quarter tones, raw signed cents otherwise. Kept here
 * (duplicating lib/music/detune) so this file stays import-free for scripts.
 */
function centsSuffix(cents: number): string {
  if (cents === 0) return "";
  if (cents === -50) return "½♭";
  if (cents === 50) return "½♯";
  return `${cents > 0 ? "+" : "−"}${Math.abs(cents)}¢`;
}

/** Spelling of the 12-TET keys under each degree, before any cents suffix. */
function spellOnKeys(rootPc: number, degrees: readonly ScaleDegree[]): string[] {
  const root = mod12(rootPc);
  if (degrees.length !== 7) {
    return degrees.map((deg) => simpleName(root + deg.offset));
  }

  let best: { notes: SpelledNote[]; score: number } | null = null;
  for (const rootNote of rootCandidates(root)) {
    const rootIdx = LETTERS.indexOf(rootNote.letter);
    const notes: SpelledNote[] = [];
    let score = 0;
    let doubles = 0;
    for (const deg of degrees) {
      const letter = LETTERS[(rootIdx + degreeNumber(deg.label) - 1) % 7];
      const acc = accidentalFor(letter, root + deg.offset);
      if (acc === null) {
        doubles += 10;
        notes.push({ letter, accidental: 0 });
        continue;
      }
      if (Math.abs(acc) === 2) doubles += 1;
      score += Math.abs(acc);
      notes.push({ letter, accidental: acc });
    }
    const total = doubles * 100 + score;
    if (!best || total < best.score) best = { notes, score: total };
  }
  return (best?.notes ?? []).map(glyph);
}

/** Simplest name for a pitch class: natural if it is one, else the flat. */
export function simpleName(pc: number): string {
  const p = mod12(pc);
  for (const letter of LETTERS) {
    if (LETTER_PC[letter] === p) return letter;
  }
  const above = LETTERS.find((l) => LETTER_PC[l] === mod12(p + 1))!;
  return `${above}♭`;
}

/** Spelled note names of a catalog scale from a root pitch class. */
export function spellScale(rootPc: number, id: ScaleTypeId): string[] {
  return spellDegrees(rootPc, SCALE_CATALOG[id].degrees);
}

/**
 * The root's own name as this scale spells it — "G♯" for Phrygian dominant,
 * "A♭" for Ukrainian Dorian, on the same key.
 */
export function rootNameFor(rootPc: number, degrees: readonly ScaleDegree[]): string {
  return spellDegrees(rootPc, degrees)[0] ?? simpleName(rootPc);
}

/**
 * Name for the note `offset` semitones above the root, in the spelling of
 * the given scale when the note is in it, else the simplest name.
 */
export function noteNameAt(
  rootPc: number,
  offset: number,
  degrees: readonly ScaleDegree[],
): string {
  const idx = degrees.findIndex((deg) => mod12(deg.offset) === mod12(offset));
  if (idx === -1) return simpleName(rootPc + offset);
  return spellDegrees(rootPc, degrees)[idx];
}
