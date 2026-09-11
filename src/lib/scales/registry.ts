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
 * (`usedIn`), and the genre registry points back (`scales`). History
 * articles list scale slugs; pages look them up with `getArticlesByScale`.
 * When you add either side of a pair, update the other.
 */

import { getGenre } from "@/lib/genres/registry";
import type { ScaleTypeId } from "@/lib/music/scaleCatalog";
import { nativeSpellingsOf } from "@/lib/words/registry";
import {
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";

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
   * Catalog id in src/lib/music/scaleCatalog.ts. Lessons read their degrees
   * from it and the synth's `?scale=` deep-link will target it, so a page and
   * the instrument can never disagree about the notes.
   */
  patternKey?: ScaleTypeId;
  /**
   * Loanword id in src/lib/words/registry.ts when it differs from the slug
   * (the page is /scales/ukrainian-dorian; the word is `misheberakh`).
   * Defaults to the slug.
   */
  word?: string;
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
      "Six notes behind most blues, rock, and jazz solos: the five-note minor pentatonic plus one extra key, the flattened fifth 'blue note.'",
    answer:
      "The blues scale is a set of six notes that gives blues, rock, and jazz solos their sound. Five of them are the minor pentatonic scale; the sixth — the flattened fifth, or 'blue note' — is the one note that turns the pentatonic into the blues scale. Counted from the root, the six are 1, ♭3, 4, ♭5, 5, ♭7.",
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
      "Five notes, none of them neighbours — the safest scale to solo with, and the blues scale minus its blue note.",
    answer:
      "The minor pentatonic is a five-note scale — counted from the root, 1, ♭3, 4, 5, ♭7. Every note sits at least two keys from the next, so nothing clashes, which makes it the first solo scale most players learn. Add one more key, the flattened fifth, and it becomes the blues scale.",
    history:
      "The five-note column is older than the blues — a West African pentatonic sense of pitch that traveled into work songs, field hollers, and spirituals. In the southern United States it became the skeleton of blues and rock solos; pin a flattened fifth onto it and you have the blues scale.",
    formula: "1 – ♭3 – 4 – 5 – ♭7",
    exampleKey: "A",
    exampleNotes: "A – C – D – E – G",
    usedIn: ["blues", "rock"],
    patternKey: "pentatonicMinor",
    status: "soon",
    keywords: ["minor pentatonic scale", "pentatonic notes", "pentatonic solo scale"],
  },
  {
    slug: "harmonic-minor",
    name: "Harmonic minor",
    kind: "scale",
    question: "What is the harmonic minor scale?",
    summary:
      "Natural minor with its seventh raised — one changed note that gives the scale a pull toward home and the wide augmented-second step that klezmer, flamenco, and Middle Eastern music share.",
    answer:
      "The harmonic minor scale is the natural minor scale with one note changed: the seventh is raised a half step, so the scale runs 1, 2, ♭3, 4, 5, ♭6, 7. The raised seventh sits one key below the root and leans into it, and the gap it leaves between ♭6 and 7 — three half steps written as a single step — is the augmented second. Two of klezmer's modes, freygish and Ukrainian Dorian, use exactly these notes from a different home.",
    history:
      "Western classical harmony raised the minor scale's seventh so that the chord on the fifth would be major and pull toward the root — the 'harmonic' in the name is that chord. Melodies avoided the resulting augmented second, and the melodic minor smoothed it away. Music further east kept the leap: Eastern Ashkenazi prayer, klezmer, Romanian and Greek dance music, and flamenco all treat the augmented second as a colour rather than a problem.",
    formula: "1 – 2 – ♭3 – 4 – 5 – ♭6 – 7",
    exampleKey: "A",
    exampleNotes: "A – B – C – D – E – F – G♯",
    usedIn: ["klezmer"],
    patternKey: "harmonicMinor",
    status: "live",
    keywords: [
      "what is the harmonic minor scale",
      "harmonic minor notes",
      "harmonic minor vs natural minor",
      "raised seventh minor scale",
      "augmented second scale",
    ],
  },
  {
    slug: "freygish",
    name: "Freygish",
    kind: "mode",
    question: "What is the freygish scale?",
    summary:
      "Flattened second, major third, and the augmented-second leap between them — the signature mode of klezmer, also known as Ahava Rabbah or Phrygian dominant.",
    answer:
      "Freygish — also called Ahava Rabbah or, in Western terms, Phrygian dominant — is a seven-note scale with a flattened second and a major third, leaving an augmented second between them: 1, ♭2, 3, 4, 5, ♭6, ♭7. It is the signature sound of klezmer and Ashkenazi prayer, and the same scale colours flamenco, Balkan, and Middle Eastern music.",
    history:
      "The Yiddish name freygish is a borrowing of 'Phrygian'; the Hebrew name Ahava Rabbah comes from the prayer whose chant uses the mode. Klezmer inherited it from the synagogue and shared it with its Ottoman, Romanian, and Greek neighbours — the augmented second between its second and third degrees is the interval most ears hear as 'the Jewish scale,' though the same pitches serve flamenco and the Arabic maqam Hijaz.",
    formula: "1 – ♭2 – 3 – 4 – 5 – ♭6 – ♭7",
    exampleKey: "E",
    exampleNotes: "E – F – G♯ – A – B – C – D",
    usedIn: ["klezmer"],
    patternKey: "phrygianDominant",
    status: "live",
    keywords: [
      "what is the freygish scale",
      "ahava rabbah mode",
      "phrygian dominant scale",
      "jewish scale klezmer",
      "hijaz scale piano",
      "middle eastern scale",
      "freygish notes",
    ],
  },
  {
    slug: "ukrainian-dorian",
    name: "Ukrainian Dorian",
    kind: "mode",
    question: "What is the Ukrainian Dorian scale?",
    summary:
      "Dorian with a raised fourth — Mi Sheberakh to klezmer musicians: the mode of the doina, with the augmented second tucked between ♭3 and ♯4.",
    answer:
      "Ukrainian Dorian — known in klezmer as Mi Sheberakh, after the prayer — is a seven-note minor scale with a raised fourth: 1, 2, ♭3, ♯4, 5, 6, ♭7. It is the Dorian mode with one key moved up, and that move opens an augmented second between ♭3 and ♯4. Klezmer treats it as a mode in its own right, the home of the doina; it uses the same notes as freygish and harmonic minor, each started from a different degree.",
    history:
      "Cantorial tradition names the mode after the prayers sung in it — Mi Sheberakh ('He who blessed') and Av HaRachamim — and since the 1980s klezmer musicians have borrowed the first name for the dance and doina repertoire. The same scale runs through Ukrainian (as the Hutsul mode), Romanian, and Greek music, and lines up with the Turkish makam Nikriz. In the synagogue it tends to be a passing colour; in klezmer it is a stable home, as common as freygish in some dance collections.",
    formula: "1 – 2 – ♭3 – ♯4 – 5 – 6 – ♭7",
    exampleKey: "D",
    exampleNotes: "D – E – F – G♯ – A – B – C",
    usedIn: ["klezmer"],
    patternKey: "ukrainianDorian",
    word: "misheberakh",
    status: "live",
    keywords: [
      "what is the ukrainian dorian scale",
      "mi sheberakh mode",
      "misheberakh scale klezmer",
      "dorian sharp 4",
      "romanian minor scale",
      "doina mode",
    ],
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

export interface ScaleFilters {
  genre?: string;
  kind?: ScaleKind;
  status?: "live" | "soon";
}

function scaleHaystack(scale: ScaleLesson): string {
  return joinHaystack([
    scale.name,
    scale.slug,
    scale.kind,
    scale.question,
    scale.summary,
    scale.answer,
    scale.history,
    scale.formula,
    scale.exampleNotes,
    ...scale.keywords,
    ...relatedNames(scale.usedIn, getGenre),
    ...nativeSpellingsOf(scale.word ?? scale.slug),
  ]);
}

const SCALE_HAY = new Map(SCALES.map((s) => [s.slug, scaleHaystack(s)]));

export function searchScales(
  query: string,
  filters: ScaleFilters = {},
): ScaleLesson[] {
  let items: readonly ScaleLesson[] = SCALES;
  if (filters.genre) {
    items = items.filter((scale) => scale.usedIn.includes(filters.genre!));
  }
  if (filters.kind) {
    items = items.filter((scale) => scale.kind === filters.kind);
  }
  if (filters.status) {
    items = items.filter((scale) => scale.status === filters.status);
  }
  return sortByLabel(
    filterByHaystack(items, query, (scale) => SCALE_HAY.get(scale.slug) ?? ""),
    (scale) => scale.name,
  );
}
