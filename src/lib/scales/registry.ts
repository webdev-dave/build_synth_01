/**
 * Scale registry — the single list of scale/mode deep-dive pages.
 *
 * This is the "Scales" teaching module: one page per named collection of
 * notes ("what is the blues scale?", later "what is Dorian?"). It is the home
 * for scale deep-dives — the generic primitives that used to live under
 * /lessons cede scale content here (see docs/plans/lessons-module.md).
 *
 * Modes are scales, so they live in the same tree under `kind: "mode"` — that
 * keeps the synth's `?scale=…` deep-link target unambiguous.
 *
 * Cross-links are data: a scale lists the genre slugs it shows up in
 * (`usedIn`), and the genre registry points back (`scales`).
 */

export type ScaleKind = "scale" | "mode";

export interface ScaleLesson {
  /** URL slug under /scales ("blues-scale", "dorian"). */
  slug: string;
  /** Display name ("Blues scale"). */
  name: string;
  kind: ScaleKind;
  /** Search-shaped question used as the page <h1> and title. */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /** Quotable 1–2 sentence answer, rendered as the lead + mirrored in meta. */
  answer: string;
  /** Short origin/history paragraph (crawlable body). Honest, not a bio. */
  history?: string;
  /** Scale-degree formula as crawlable text, e.g. "1 – ♭3 – 4 – ♭5 – 5 – ♭7". */
  formula: string;
  /** A worked example so the page carries real note data (indexable). */
  exampleKey: string;
  exampleNotes: string;
  /** Genre slugs where this scale is heard (cross-link targets). */
  usedIn: string[];
  /**
   * Key into SCALE_PATTERNS / MODE_PATTERNS in src/lib/music/scales.ts, for
   * when the interactive keyboard + synth deep-link get wired up.
   */
  patternKey?: string;
  status: "live" | "soon";
  keywords: string[];
}

export const SCALES: ScaleLesson[] = [
  {
    slug: "blues-scale",
    name: "Blues scale",
    kind: "scale",
    question: "What is the blues scale?",
    summary:
      "The minor pentatonic plus one extra note — the flattened fifth 'blue note' — six notes behind most blues, rock, and jazz solos.",
    answer:
      "The blues scale is the minor pentatonic scale with one note added: the flattened fifth, or 'blue note.' Those six notes — 1, ♭3, 4, ♭5, 5, ♭7 — are the vocabulary behind most blues, rock, and jazz solos.",
    history:
      "The blues scale grew out of the African-American spirituals, work songs, and field hollers of the 19th-century southern United States — music that carried older West African traditions of bent pitch and call-and-response. Its 'blue notes' — the lowered third, fifth, and seventh — freeze those vocal pitches into keys you can play, and they carried the sound onward into jazz, R&B, and rock.",
    formula: "1 – ♭3 – 4 – ♭5 – 5 – ♭7",
    exampleKey: "A",
    exampleNotes: "A – C – D – E♭ – E – G",
    usedIn: ["blues", "rock"],
    patternKey: "blues",
    status: "live",
    keywords: [
      "what is the blues scale",
      "blues scale notes",
      "minor pentatonic blue note",
      "blue note flat 5",
      "blues scale formula",
    ],
  },
  {
    slug: "major-scale",
    name: "Major scale",
    kind: "scale",
    question: "What is the major scale?",
    summary:
      "The seven-note baseline every other scale is measured against: W–W–H–W–W–W–H.",
    answer:
      "The major scale is a seven-note scale built from the step pattern whole–whole–half–whole–whole–whole–half. In C it's the white keys, C to C, and it's the reference point every other scale is described against.",
    formula: "1 – 2 – 3 – 4 – 5 – 6 – 7",
    exampleKey: "C",
    exampleNotes: "C – D – E – F – G – A – B",
    usedIn: [],
    patternKey: "major",
    status: "soon",
    keywords: ["what is the major scale", "major scale notes", "major scale steps"],
  },
  {
    slug: "minor-pentatonic",
    name: "Minor pentatonic",
    kind: "scale",
    question: "What is the minor pentatonic scale?",
    summary:
      "Five notes, no half-steps to clash — the safest scale to solo with, and the blues scale minus the blue note.",
    answer:
      "The minor pentatonic is a five-note scale (1, ♭3, 4, 5, ♭7) with none of the tense half-steps of a full minor scale. Add the ♭5 and you get the blues scale.",
    formula: "1 – ♭3 – 4 – 5 – ♭7",
    exampleKey: "A",
    exampleNotes: "A – C – D – E – G",
    usedIn: ["blues", "rock"],
    patternKey: "minorPentatonic",
    status: "soon",
    keywords: ["minor pentatonic scale", "pentatonic notes", "pentatonic solo scale"],
  },
  {
    slug: "dorian",
    name: "Dorian mode",
    kind: "mode",
    question: "What is the Dorian mode?",
    summary:
      "The major scale started from its second degree — minor, but with a bright raised sixth.",
    answer:
      "Dorian is a mode of the major scale, started from its second degree. It sounds minor but with a raised sixth, giving it a brighter, jazzier colour than natural minor.",
    formula: "1 – 2 – ♭3 – 4 – 5 – 6 – ♭7",
    exampleKey: "D",
    exampleNotes: "D – E – F – G – A – B – C",
    usedIn: [],
    patternKey: "dorian",
    status: "soon",
    keywords: ["what is dorian mode", "dorian scale notes", "dorian vs minor"],
  },
];

export function getScale(slug: string): ScaleLesson | undefined {
  return SCALES.find((s) => s.slug === slug);
}

/** Scales safe to index (real content), for the sitemap. */
export const LIVE_SCALES = SCALES.filter((s) => s.status === "live");
