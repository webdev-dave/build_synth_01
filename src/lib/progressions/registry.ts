/**
 * Progressions registry — the harmony layer's teaching tree.
 *
 * One page per named chord progression ("what are the 12-bar blues
 * chords?") or, under `kind: "chord"`, per named chord ("what is a
 * dominant seventh chord?"). Same shape as the scale registry: a
 * search-shaped question, a quotable answer, a crawlable formula, and
 * cross-links as data. The genre registry points back through
 * `Genre.progressions`; scale pages find "play it over" rows through
 * `getProgressionsByScale` (one-directional on purpose — see
 * docs/plans/progressions-module.md).
 *
 * Chords are key-relative `ChordSpec`s from src/lib/music/chords.ts, so a
 * progression transposes by changing one number and the chart, the
 * organ, and the keyboard can never disagree about which notes a bar holds.
 */

import { getGenre } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import type { LessonEntry } from "@/lib/lessons/types";
import { chord, type ChordSpec } from "@/lib/music/chords";
import {
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";

export type ProgressionKind = "progression" | "chord";

/** Meter ids match `formatTimeSignature` in src/lib/music/timeSignatures.ts. */
export type ProgressionMeter = "4/4" | "3/4" | "12/8" | "6/8";

export interface ProgressionBar {
  chord: ChordSpec;
  /** Beats this chord holds; default = the whole bar. Split bars later. */
  beats?: number;
}

/** One bar swapped for another chord — how a variant edits the plain chart. */
export interface BarEdit {
  /** 0-based bar index. */
  bar: number;
  chord: ChordSpec;
}

/**
 * A named alternative reading of the same progression, toggled on the
 * widget. Stored as edits rather than a second full chart so two variants
 * (quick change + turnaround) compose, and so the diff caption is derived
 * from the same data that changes the sound.
 */
export interface ProgressionVariant {
  id: string;
  label: string;
  /**
   * Why players do it — the clause after the dash. The *what* ("swaps bar 2
   * from I7 to IV7") is computed from `edits`, so it transposes.
   */
  blurb: string;
  edits: BarEdit[];
}

export interface Progression extends LessonEntry {
  kind: ProgressionKind;
  /** Other names — "blues changes", "three-chord blues". */
  aliases: string[];
  meter: ProgressionMeter;
  /** The plain chart, one entry per bar. `kind: "chord"` has one bar. */
  bars: ProgressionBar[];
  variants?: ProgressionVariant[];
  /** Crawlable chart: "I7 · I7 · I7 · I7 | IV7 · IV7 · I7 · I7 | …". */
  formula: string;
  /** Classroom key the page opens in, and the chords spelled in it. */
  exampleKey: string;
  exampleChords: string;
  /** Scale slugs a soloist plays over it. */
  scales: string[];
  /** Foil progression slug for a comparison. */
  compareWith?: string;
  /** Form slugs sharing this territory (twelve-bar-blues ↔ /forms/twelve-bar-blues). */
  forms?: string[];
}

/** Quarter-note beats per bar for a meter (6/8 counts as three quarters). */
export function beatsPerBar(meter: ProgressionMeter): number {
  const [num, den] = meter.split("/").map(Number);
  return (num * 4) / den;
}

/** Beats in one pass through the chart — the clock's cycle length. */
export function progressionLengthBeats(progression: Progression): number {
  return progression.bars.length * beatsPerBar(progression.meter);
}

/** The chart with the named variants applied, in registry order. */
export function barsWith(
  progression: Progression,
  variantIds: readonly string[],
): ProgressionBar[] {
  const bars = progression.bars.map((b) => ({ ...b }));
  for (const variant of progression.variants ?? []) {
    if (!variantIds.includes(variant.id)) continue;
    for (const edit of variant.edits) {
      if (bars[edit.bar]) bars[edit.bar] = { ...bars[edit.bar], chord: edit.chord };
    }
  }
  return bars;
}

/** "I7 · I7 · I7 · I7 | IV7 · IV7 · I7 · I7 | …" — derived, never hand-typed. */
export function formulaOf(bars: readonly ProgressionBar[], perLine = 4): string {
  const lines: string[] = [];
  for (let i = 0; i < bars.length; i += perLine) {
    lines.push(
      bars
        .slice(i, i + perLine)
        .map((b) => b.chord.numeral)
        .join(" · "),
    );
  }
  return lines.join(" | ");
}

const I7 = chord(0, "dom7");
const IV7 = chord(5, "dom7");
const V7 = chord(7, "dom7");

/** Plain 12-bar: four of I, two of IV, two of I, then V – IV – I – I. */
const TWELVE_BAR: ProgressionBar[] = [
  I7, I7, I7, I7,
  IV7, IV7, I7, I7,
  V7, IV7, I7, I7,
].map((c) => ({ chord: c }));

export const PROGRESSIONS: Progression[] = [
  {
    slug: "twelve-bar-blues",
    name: "12-bar blues",
    kind: "progression",
    aliases: ["Blues changes", "Twelve-bar blues", "Three-chord blues", "I–IV–V blues"],
    question: "What are the 12-bar blues chords?",
    summary:
      "Three chords, twelve bars, one loop: four bars of I, two of IV, two of I, then V – IV – I – I — every chord a dominant seventh.",
    answer:
      "The 12-bar blues is a repeating twelve-bar chord pattern built from the three primary chords of a key — I, IV and V. In its plain form it spends four bars on I, two on IV, two back on I, then one bar each of V and IV before two bars of I. Blues players usually make every one of those chords a dominant seventh: in A, that is A7, D7 and E7.",
    history:
      "The pattern settled into its twelve-bar shape in the early recorded blues of the 1910s and 1920s, out of older eight- and sixteen-bar songs and the three-line AAB lyric it carries so well. It became the harmonic skeleton of rhythm and blues, early rock and roll, and a great deal of jazz — which is why so many songs feel familiar on first hearing.",
    meter: "4/4",
    bars: TWELVE_BAR,
    variants: [
      {
        id: "quick-change",
        label: "Quick change",
        blurb:
          "the IV arrives early and comes straight back, so the first line moves sooner.",
        edits: [{ bar: 1, chord: IV7 }],
      },
      {
        id: "turnaround",
        label: "Turnaround",
        blurb:
          "the last bar leans forward into the next chorus instead of settling.",
        edits: [{ bar: 11, chord: V7 }],
      },
    ],
    formula: formulaOf(TWELVE_BAR),
    exampleKey: "A",
    exampleChords: "A7 – D7 – E7",
    usedIn: ["blues", "rock"],
    scales: ["blues-scale", "minor-pentatonic", "major-blues", "mixolydian"],
    compareWith: "i-iv-v",
    forms: ["twelve-bar-blues"],
    status: "soon",
    keywords: [
      "12 bar blues chords",
      "twelve bar blues progression",
      "12 bar blues in A",
      "blues chord progression",
      "quick change blues",
      "blues turnaround",
      "I7 IV7 V7",
    ],
  },
  // ---------------------------------------------------------------------
  // Stubs (docs/plans/progressions-module.md). They exist so every
  // cross-link on a live page resolves; each flips to "live" when its
  // lesson lands. Copy is true standalone — it is the meta description.
  // ---------------------------------------------------------------------
  {
    slug: "i-iv-v",
    name: "I–IV–V",
    kind: "progression",
    aliases: ["Three-chord progression", "Primary chords", "Three-chord trick", "1-4-5"],
    question: "What is the I–IV–V progression?",
    summary:
      "The three chords built on the first, fourth and fifth notes of a key. Between them they hold every note of the major scale — which is why three chords are enough for so many songs.",
    answer:
      "I, IV and V are the chords built on the first, fourth and fifth notes of a key — in A, the chords A, D and E. Between them they contain every note of the major scale, so those three chords can harmonise most folk, country, blues and early rock melodies. The 12-bar blues is made of nothing else.",
    meter: "4/4",
    bars: [chord(0, "major"), chord(5, "major"), chord(7, "major"), chord(0, "major")].map(
      (c) => ({ chord: c }),
    ),
    formula: "I · IV · V · I",
    exampleKey: "A",
    exampleChords: "A – D – E",
    usedIn: ["blues", "rock"],
    scales: ["major-scale", "major-pentatonic", "blues-scale"],
    compareWith: "twelve-bar-blues",
    status: "soon",
    keywords: [
      "I IV V progression",
      "1 4 5 chords",
      "three chord songs",
      "primary chords of a key",
    ],
  },
  {
    slug: "ii-v-i",
    name: "ii–V–I",
    kind: "progression",
    aliases: ["Two-five-one", "2-5-1", "Jazz cadence"],
    question: "What is the ii–V–I progression?",
    summary:
      "Jazz's basic sentence: the minor seventh on the second degree, the dominant seventh on the fifth, then home — each root falling a fifth.",
    answer:
      "ii–V–I is the most common chord movement in jazz: the minor seventh chord on the second degree of the key, the dominant seventh on the fifth, then the home chord. In C that is Dm7 – G7 – Cmaj7. Each root falls a fifth to the next, so the pull toward the tonic is doubled — a V–I cadence with a run-up.",
    meter: "4/4",
    bars: [chord(2, "min7"), chord(7, "dom7"), chord(0, "maj7"), chord(0, "maj7")].map(
      (c) => ({ chord: c }),
    ),
    formula: "ii7 · V7 · Imaj7 · Imaj7",
    exampleKey: "C",
    exampleChords: "Dm7 – G7 – Cmaj7",
    usedIn: [],
    scales: ["major-scale", "dorian", "mixolydian"],
    status: "soon",
    keywords: ["ii V I progression", "2 5 1 jazz", "two five one chords"],
  },
  {
    slug: "i-v-vi-iv",
    name: "I–V–vi–IV",
    kind: "progression",
    aliases: ["Four-chord song", "Pop progression", "1-5-6-4", "Axis progression"],
    question: "What is the I–V–vi–IV progression?",
    summary:
      "The four-chord loop under a huge share of pop, rock and reggae: home, the dominant, the relative minor, the subdominant — round and round.",
    answer:
      "I–V–vi–IV is a four-chord loop: the home chord, the chord on the fifth degree, the minor chord on the sixth, and the chord on the fourth. In C that is C – G – Am – F. Because it never lands on a strong cadence, it can repeat for a whole song, which is why so much pop, rock and reggae sits on it.",
    meter: "4/4",
    bars: [chord(0, "major"), chord(7, "major"), chord(9, "minor"), chord(5, "major")].map(
      (c) => ({ chord: c }),
    ),
    formula: "I · V · vi · IV",
    exampleKey: "C",
    exampleChords: "C – G – Am – F",
    usedIn: ["rock", "reggae"],
    scales: ["major-scale", "major-pentatonic"],
    status: "soon",
    keywords: [
      "I V vi IV progression",
      "four chord song",
      "1 5 6 4 chords",
      "pop chord progression",
    ],
  },
  {
    slug: "andalusian-cadence",
    name: "Andalusian cadence",
    kind: "progression",
    aliases: ["i–♭VII–♭VI–V", "Flamenco cadence", "Spanish progression"],
    question: "What is the Andalusian cadence?",
    summary:
      "Four chords stepping down a minor scale to the dominant — i, ♭VII, ♭VI, V — the flamenco sound, and a cousin of the freygish scale's colour.",
    answer:
      "The Andalusian cadence is a four-chord progression that walks down from the minor home chord in steps: i, ♭VII, ♭VI, V. In A minor that is Am – G – F – E. The last chord is major even though the key is minor, and the half step between ♭VI and V is what gives it the flamenco, Spanish colour; the same pitches spell the freygish scale from the V chord's root.",
    meter: "4/4",
    bars: [
      chord(0, "minor", "i"),
      chord(10, "major", "♭VII"),
      chord(8, "major", "♭VI"),
      chord(7, "major", "V"),
    ].map((c) => ({ chord: c })),
    formula: "i · ♭VII · ♭VI · V",
    exampleKey: "A",
    exampleChords: "Am – G – F – E",
    usedIn: [],
    scales: ["natural-minor", "phrygian", "freygish"],
    status: "soon",
    keywords: [
      "andalusian cadence chords",
      "flamenco chord progression",
      "i VII VI V progression",
      "spanish chord progression",
    ],
  },
  {
    slug: "dominant-seventh",
    name: "Dominant seventh chord",
    kind: "chord",
    aliases: ["Dom7", "Seventh chord", "V7 chord"],
    question: "What is a dominant seventh chord?",
    summary:
      "A major triad with a flattened seventh on top — the restless chord that pulls toward home, and the chord the blues plays on every bar.",
    answer:
      "A dominant seventh chord is a major triad with a fourth note added a minor seventh above the root: root, major third, fifth, ♭7. G7 is G – B – D – F. The third and the seventh sit a tritone apart, and that tension is what makes the chord lean toward the chord a fifth below it. The blues uses dominant sevenths on I, IV and V alike.",
    meter: "4/4",
    bars: [{ chord: chord(0, "dom7", "7") }],
    formula: "1 – 3 – 5 – ♭7",
    exampleKey: "G",
    exampleChords: "G7 = G – B – D – F",
    usedIn: ["blues"],
    scales: ["mixolydian", "blues-scale"],
    status: "soon",
    keywords: [
      "dominant seventh chord",
      "what is a 7 chord",
      "G7 chord notes",
      "dominant 7th explained",
    ],
  },
  {
    slug: "power-chord",
    name: "Power chord",
    kind: "chord",
    aliases: ["Fifth chord", "5 chord", "Root and fifth"],
    question: "What is a power chord?",
    summary:
      "Two notes, a root and its fifth, with no third — neither major nor minor, which is exactly why it works under a distorted guitar.",
    answer:
      "A power chord is a root and the note a perfect fifth above it, often with the root doubled an octave up — E5 is E – B – E. It has no third, so it is neither major nor minor, and its two notes stay clean through heavy distortion where a full triad would blur. It is the basic chord of rock guitar.",
    meter: "4/4",
    bars: [{ chord: chord(0, "power", "5") }],
    formula: "1 – 5",
    exampleKey: "E",
    exampleChords: "E5 = E – B",
    usedIn: ["rock"],
    scales: ["minor-pentatonic", "blues-scale"],
    status: "soon",
    keywords: ["power chord", "what is a power chord", "E5 chord", "root fifth chord"],
  },
];

export function getProgression(slug: string): Progression | undefined {
  return PROGRESSIONS.find((p) => p.slug === slug);
}

/** Progressions safe to index (real content), for the sitemap. */
export const LIVE_PROGRESSIONS = PROGRESSIONS.filter((p) => p.status === "live");

/** Progressions a genre lists (in the genre's order), resolved. */
export function getProgressionsByGenre(genreSlug: string): Progression[] {
  const genre = getGenre(genreSlug);
  const slugs = genre?.progressions ?? [];
  return slugs
    .map((slug) => getProgression(slug))
    .filter((p): p is Progression => Boolean(p));
}

/** Progressions a scale is played over — the scale page's "Play it over". */
export function getProgressionsByScale(scaleSlug: string): Progression[] {
  return PROGRESSIONS.filter((p) => p.scales.includes(scaleSlug));
}

export interface ProgressionFilters {
  genre?: string;
  kind?: ProgressionKind;
  status?: "live" | "soon";
}

function progressionHaystack(p: Progression): string {
  return joinHaystack([
    p.name,
    p.slug,
    p.kind,
    p.question,
    p.summary,
    p.answer,
    p.history,
    p.formula,
    p.exampleChords,
    ...p.aliases,
    ...p.keywords,
    ...(p.variants ?? []).map((v) => v.label),
    ...relatedNames(p.usedIn, getGenre),
    ...relatedNames(p.scales, getScale),
  ]);
}

const PROGRESSION_HAY = new Map(PROGRESSIONS.map((p) => [p.slug, progressionHaystack(p)]));

export function searchProgressions(
  query: string,
  filters: ProgressionFilters = {},
): Progression[] {
  let items: readonly Progression[] = PROGRESSIONS;
  if (filters.genre) {
    items = items.filter((p) => p.usedIn.includes(filters.genre!));
  }
  if (filters.kind) {
    items = items.filter((p) => p.kind === filters.kind);
  }
  if (filters.status) {
    items = items.filter((p) => p.status === filters.status);
  }
  return sortByLabel(
    filterByHaystack(items, query, (p) => PROGRESSION_HAY.get(p.slug) ?? ""),
    (p) => p.name,
  );
}
