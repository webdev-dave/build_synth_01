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

/**
 * A name the same note set goes by somewhere else — Western theory, a
 * Hindustani thaat, an Arabic maqam, a Jewish prayer mode. Listed so a
 * reader who knows the scale as "Bhairavi" or "Kurd" finds the Phrygian
 * page: shown on the hub tile and page header, ranked like the title in
 * search, and mirrored into meta keywords / JSON-LD `alternateName`.
 *
 * Native scripts come from src/lib/words/registry.ts, looked up by phrase.
 * `approx` marks a match that is one of shape only — the tradition tunes or
 * ornaments it differently (maqam thirds, ragas with characteristic
 * phrases) — and renders as "≈".
 */
export interface ScaleAlias {
  name: string;
  /** Where the name is used ("Hindustani thaat", "Arabic maqam"). */
  tradition?: string;
  approx?: boolean;
}

const alias = (name: string, tradition?: string, approx = false): ScaleAlias =>
  approx ? { name, tradition, approx } : tradition ? { name, tradition } : { name };

export interface ScaleLesson {
  /** URL slug under /scales ("blues-scale", "dorian"). */
  slug: string;
  /** Display name ("Blues scale"). */
  name: string;
  kind: ScaleKind;
  /** Other names for the same notes, across traditions. Empty when there are none worth knowing. */
  aliases: ScaleAlias[];
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
   * Diatonic-harmonica positions (1–5) whose mode this is. The harmonica
   * engine points back via `Position.scaleSlug` (src/lib/harmonica); the
   * page renders a card into the v2 lab. Keep both sides in step.
   */
  positions?: number[];
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
    aliases: [
      alias("Minor blues scale"),
      alias("Hexatonic blues scale"),
      alias("Blue note scale"),
    ],
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
    aliases: [
      alias("Ionian mode", "Western mode"),
      alias("Do-re-mi scale"),
      alias("Bilaval", "Hindustani thaat"),
      alias("Shankarabharanam", "Carnatic melakarta"),
      alias("Ajam", "Arabic maqam", true),
    ],
    question: "What is the major scale?",
    summary:
      "The seven-note baseline every other scale is measured against: W–W–H–W–W–W–H.",
    answer:
      "The major scale is a seven-note scale built from the step pattern whole–whole–half–whole–whole–whole–half. In C it is the white keys, C to C, and it is the reference point every other scale is described against: its degrees are the plain numbers 1 to 7, and a ♭ or ♯ on any other scale means 'one key away from where the major scale puts it.'",
    history:
      "The major scale is the do-re-mi scale of European music, and the piano was laid out around it: the two half steps in C fall exactly where two white keys touch with no black key between them (E–F and B–C). Its relative minor shares every key from a different home, and its seven modes — Dorian, Mixolydian, and the rest — are the same seven notes with each degree in turn treated as home.",
    formula: "1 – 2 – 3 – 4 – 5 – 6 – 7",
    exampleKey: "C",
    exampleNotes: "C – D – E – F – G – A – B",
    usedIn: [],
    positions: [1],
    patternKey: "major",
    status: "live",
    keywords: [
      "what is the major scale",
      "major scale notes",
      "major scale steps",
      "whole whole half pattern",
      "relative minor",
      "do re mi scale",
    ],
  },
  {
    slug: "minor-pentatonic",
    name: "Minor pentatonic",
    kind: "scale",
    aliases: [
      alias("Yu mode", "Chinese pentatonic"),
      alias("Min'yō scale", "Japanese folk"),
      alias("Dhani", "Hindustani raga", true),
      alias("Shuddha Dhanyasi", "Carnatic raga", true),
    ],
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
    status: "live",
    keywords: [
      "minor pentatonic scale",
      "pentatonic notes",
      "pentatonic solo scale",
      "why pentatonic never sounds wrong",
      "minor pentatonic vs major pentatonic",
    ],
  },
  {
    slug: "harmonic-minor",
    name: "Harmonic minor",
    kind: "scale",
    aliases: [
      alias("Aeolian ♯7", "Western mode"),
      alias("Mohammedan scale", "older Western name"),
      alias("Kirwani", "Hindustani / Carnatic raga"),
      alias("Nahawand", "Arabic maqam", true),
    ],
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
    aliases: [
      alias("Phrygian dominant", "Western mode"),
      alias("Ahava Rabbah", "Jewish prayer mode"),
      alias("Spanish Phrygian"),
      alias("Spanish Gypsy scale", "older Western name"),
      alias("Hijaz", "Arabic maqam", true),
      alias("Hicaz", "Turkish makam", true),
      alias("Vakulabharanam", "Carnatic melakarta"),
    ],
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
    aliases: [
      alias("Mi Sheberakh", "Jewish prayer mode"),
      alias("Romanian minor"),
      alias("Dorian ♯4", "Western mode"),
      alias("Ukrainian minor"),
      alias("Nikriz", "Arabic maqam", true),
      alias("Nikrîz", "Turkish makam", true),
    ],
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
    aliases: [
      alias("Kafi", "Hindustani thaat"),
      alias("Kharaharapriya", "Carnatic melakarta"),
    ],
    question: "What is the Dorian mode?",
    summary:
      "The major scale started from its second degree — minor, but with a bright raised sixth.",
    answer:
      "Dorian is a mode of the major scale, started from its second degree. It sounds minor but with a raised sixth, giving it a brighter, jazzier colour than natural minor.",
    formula: "1 – 2 – ♭3 – 4 – 5 – 6 – ♭7",
    exampleKey: "D",
    exampleNotes: "D – E – F – G – A – B – C",
    usedIn: ["folk-revival"],
    positions: [3],
    patternKey: "dorian",
    status: "live",
    keywords: ["what is dorian mode", "dorian scale notes", "dorian vs minor"],
  },
  // ---------------------------------------------------------------------
  // Stubs for the rest of the catalog (docs/plans/scales-catalog-and-lessons.md).
  // They exist so every cross-link on a live page resolves; each flips to
  // "live" when its lesson lands. Copy is true standalone (it is the meta
  // description), so a stub is still a real answer.
  // ---------------------------------------------------------------------
  {
    slug: "natural-minor",
    name: "Natural minor",
    kind: "scale",
    aliases: [
      alias("Aeolian mode", "Western mode"),
      alias("Relative minor"),
      alias("Asavari", "Hindustani thaat"),
      alias("Natabhairavi", "Carnatic melakarta"),
      alias("Nahawand", "Arabic maqam", true),
      alias("Buselik", "Turkish makam", true),
      alias("Magen Avot", "Jewish prayer mode", true),
    ],
    question: "What is the natural minor scale?",
    summary:
      "The major scale's darker twin: same seven keys as its relative major, or the major scale with the third, sixth, and seventh each lowered a key.",
    answer:
      "The natural minor scale is a seven-note scale running 1, 2, ♭3, 4, 5, ♭6, ♭7 — the major scale with its third, sixth, and seventh each lowered one half step. It is also the sixth mode of the major scale: A minor uses exactly the white keys of C major, started from A. The lowered third is what makes it sound minor.",
    formula: "1 – 2 – ♭3 – 4 – 5 – ♭6 – ♭7",
    exampleKey: "A",
    exampleNotes: "A – B – C – D – E – F – G",
    usedIn: ["folk-revival"],
    positions: [4],
    patternKey: "minor",
    status: "live",
    keywords: [
      "what is the natural minor scale",
      "natural minor notes",
      "aeolian mode",
      "relative minor of c major",
    ],
  },
  {
    slug: "major-pentatonic",
    name: "Major pentatonic",
    kind: "scale",
    aliases: [
      alias("Gong mode", "Chinese pentatonic"),
      alias("Bhupali", "Hindustani raga", true),
      alias("Mohanam", "Carnatic raga", true),
    ],
    question: "What is the major pentatonic scale?",
    summary:
      "Five bright notes with no half steps: the major scale minus its fourth and seventh, and the same keys as the minor pentatonic three keys down.",
    answer:
      "The major pentatonic is a five-note scale — 1, 2, 3, 5, 6 — made by removing the fourth and seventh from the major scale. With no half steps left, no two notes clash, which is why it carries so much folk, country, and gospel melody. It shares its keys with the minor pentatonic whose root sits three half steps below: C major pentatonic and A minor pentatonic are the same five notes.",
    formula: "1 – 2 – 3 – 5 – 6",
    exampleKey: "C",
    exampleNotes: "C – D – E – G – A",
    usedIn: ["folk-revival"],
    patternKey: "pentatonicMajor",
    status: "live",
    keywords: [
      "what is the major pentatonic scale",
      "major pentatonic notes",
      "major pentatonic vs minor pentatonic",
    ],
  },
  {
    slug: "mixolydian",
    name: "Mixolydian mode",
    kind: "mode",
    aliases: [
      alias("Dominant scale"),
      alias("Khamaj", "Hindustani thaat"),
      alias("Harikambhoji", "Carnatic melakarta"),
      alias("Adonai Malakh", "Jewish prayer mode", true),
    ],
    question: "What is the Mixolydian mode?",
    summary:
      "The major scale with a lowered seventh — the bright, unresolved sound of harmonica second position, rock riffs, and dominant chords.",
    answer:
      "Mixolydian is the major scale with one change: the seventh is lowered a half step, giving 1, 2, 3, 4, 5, 6, ♭7. It is the fifth mode of the major scale — G Mixolydian uses the white keys of C major, started from G. The ♭7 keeps it from settling the way major does, which is why it fits blues-rock riffs and the harmonica's second position, where a C harp plays in G.",
    history:
      "Mixolydian is the mode blues harmonica lives in. 'Cross harp' — playing a harp a fourth below the song's key — puts the draw notes, the ones that bend, on the strong beats, and the scale those draw notes spell is Mixolydian. Bend the third and fifth down and you are in the blues scale; leave them alone and you have the bright, unresolved sound of a great many rock riffs, from country-rock to the dominant-chord vamps of funk and soul.",
    formula: "1 – 2 – 3 – 4 – 5 – 6 – ♭7",
    exampleKey: "G",
    exampleNotes: "G – A – B – C – D – E – F",
    usedIn: ["blues", "rock"],
    positions: [2],
    patternKey: "mixolydian",
    status: "live",
    keywords: [
      "what is mixolydian mode",
      "mixolydian scale notes",
      "major scale flat 7",
      "harmonica second position scale",
    ],
  },
  {
    slug: "phrygian",
    name: "Phrygian mode",
    kind: "mode",
    aliases: [
      alias("Bhairavi", "Hindustani thaat"),
      alias("Hanumatodi", "Carnatic melakarta"),
      alias("Kurd", "Arabic maqam"),
      alias("Kürdî", "Turkish makam"),
    ],
    question: "What is the Phrygian mode?",
    summary:
      "Natural minor with a lowered second — the note one key above home that leans back onto it. Dark, tense, and one raised third away from freygish.",
    answer:
      "Phrygian is a minor mode with a lowered second: 1, ♭2, ♭3, 4, 5, ♭6, ♭7. It is the third mode of the major scale — E Phrygian uses the white keys of C major, started from E. The ♭2 sits one half step above the root and pulls hard toward it, which gives the mode its dark, Spanish-tinged tension. Raise its third and it becomes freygish, the klezmer and flamenco scale.",
    history:
      "The name is borrowed, twice over: medieval theorists took Greek regional names for their church modes, and the mode they called Phrygian is the one that runs from E on the white keys. Its lowered second gives Spanish and flamenco music much of its colour — though the flamenco scale proper usually raises the third as well, which turns Phrygian into freygish. On a diatonic harmonica it is fifth position: a C harp played in E.",
    formula: "1 – ♭2 – ♭3 – 4 – 5 – ♭6 – ♭7",
    exampleKey: "E",
    exampleNotes: "E – F – G – A – B – C – D",
    usedIn: [],
    positions: [5],
    patternKey: "phrygian",
    status: "live",
    keywords: [
      "what is phrygian mode",
      "phrygian scale notes",
      "minor scale flat 2",
      "phrygian vs phrygian dominant",
    ],
  },
  {
    slug: "lydian",
    name: "Lydian mode",
    kind: "mode",
    aliases: [
      alias("Kalyan", "Hindustani thaat"),
      alias("Yaman", "Hindustani raga", true),
      alias("Mechakalyani", "Carnatic melakarta"),
    ],
    question: "What is the Lydian mode?",
    summary:
      "The major scale with a raised fourth — brighter than bright, floating rather than settled. The fourth mode of the major scale.",
    answer:
      "Lydian is the major scale with its fourth raised a half step: 1, 2, 3, ♯4, 5, 6, 7. It is the fourth mode of the major scale — F Lydian uses the white keys of C major, started from F. The ♯4 removes the major scale's pull from 4 down to 3 and leaves the mode hovering, which is why film scores reach for it when they want wonder without resolution.",
    formula: "1 – 2 – 3 – ♯4 – 5 – 6 – 7",
    exampleKey: "F",
    exampleNotes: "F – G – A – B – C – D – E",
    usedIn: [],
    patternKey: "lydian",
    status: "live",
    keywords: ["what is lydian mode", "lydian scale notes", "major scale sharp 4"],
  },
  {
    slug: "locrian",
    name: "Locrian mode",
    kind: "mode",
    aliases: [alias("Half-diminished scale")],
    question: "What is the Locrian mode?",
    summary:
      "The darkest mode of the major scale: Phrygian with the fifth lowered too, so even the home chord is unstable.",
    answer:
      "Locrian is the seventh mode of the major scale — B Locrian uses the white keys of C major, started from B — and runs 1, ♭2, ♭3, 4, ♭5, ♭6, ♭7. It is Phrygian with one more note lowered, the fifth. A lowered fifth means the chord built on the root is diminished rather than minor, so the mode never quite settles; it turns up in metal riffs and as a passing colour more than as a home.",
    formula: "1 – ♭2 – ♭3 – 4 – ♭5 – ♭6 – ♭7",
    exampleKey: "B",
    exampleNotes: "B – C – D – E – F – G – A",
    usedIn: [],
    patternKey: "locrian",
    status: "live",
    keywords: ["what is locrian mode", "locrian scale notes", "diminished mode"],
  },
  {
    slug: "melodic-minor",
    name: "Melodic minor",
    kind: "scale",
    aliases: [
      alias("Jazz minor scale"),
      alias("Ascending melodic minor"),
      alias("Gourimanohari", "Carnatic melakarta"),
      alias("Patdeep", "Hindustani raga", true),
    ],
    question: "What is the melodic minor scale?",
    summary:
      "Harmonic minor with the sixth raised as well — a minor scale below, a major scale above, and no augmented second. The jazz minor.",
    answer:
      "The melodic minor scale is natural minor with both the sixth and seventh raised: 1, 2, ♭3, 4, 5, 6, 7. Classical practice used that form going up and plain natural minor coming down; jazz uses the raised form in both directions and calls it the jazz minor. Only the ♭3 separates it from the major scale, so it sounds minor at the bottom and major at the top, with the smooth step-by-step climb that harmonic minor's augmented second interrupts.",
    formula: "1 – 2 – ♭3 – 4 – 5 – 6 – 7",
    exampleKey: "A",
    exampleNotes: "A – B – C – D – E – F♯ – G♯",
    usedIn: [],
    patternKey: "melodicMinor",
    status: "live",
    keywords: [
      "what is the melodic minor scale",
      "melodic minor notes",
      "jazz minor scale",
      "melodic minor vs harmonic minor",
    ],
  },
  {
    slug: "double-harmonic",
    name: "Double harmonic",
    kind: "scale",
    aliases: [
      alias("Double harmonic major"),
      alias("Byzantine scale"),
      alias("Arabic scale", "Western label"),
      alias("Gypsy major", "older Western name"),
      alias("Hijaz Kar", "Arabic maqam", true),
      alias("Hicazkâr", "Turkish makam", true),
      alias("Bhairav", "Hindustani thaat"),
      alias("Mayamalavagowla", "Carnatic melakarta"),
    ],
    question: "What is the double harmonic scale?",
    summary:
      "Freygish with its seventh raised too, so it carries two augmented seconds — the scale often sold as 'the Arabic scale,' also called Hijaz Kar or Byzantine.",
    answer:
      "The double harmonic scale runs 1, ♭2, 3, 4, 5, ♭6, 7: a lowered second and a raised seventh around a major third and fifth. That leaves two augmented seconds — between ♭2 and 3, and between ♭6 and 7 — where most scales have none. It is freygish (Phrygian dominant) with the seventh raised, and it is known as Hijaz Kar in Arabic music and as the Byzantine or 'Arabic' scale in Western labels.",
    formula: "1 – ♭2 – 3 – 4 – 5 – ♭6 – 7",
    exampleKey: "C",
    exampleNotes: "C – D♭ – E – F – G – A♭ – B",
    usedIn: [],
    patternKey: "doubleHarmonic",
    status: "soon",
    keywords: [
      "what is the double harmonic scale",
      "double harmonic major",
      "hijaz kar scale",
      "byzantine scale piano",
      "arabic scale piano",
    ],
  },
  {
    slug: "major-blues",
    name: "Major blues",
    kind: "scale",
    aliases: [alias("Major blues scale"), alias("Blues major")],
    question: "What is the major blues scale?",
    summary:
      "The major pentatonic plus one blue note, the ♭3 — the sunny twin of the usual blues scale, behind country, gospel, and swing licks.",
    answer:
      "The major blues scale is the major pentatonic — 1, 2, 3, 5, 6 — with one extra key squeezed in: the ♭3, giving 1, 2, ♭3, 3, 5, 6. That ♭3 rubbing against the 3 is its blue note, the way the ♭5 is the minor blues scale's. The two scales are twins: C major blues and A minor blues are the same six keys.",
    formula: "1 – 2 – ♭3 – 3 – 5 – 6",
    exampleKey: "C",
    exampleNotes: "C – D – E♭ – E – G – A",
    usedIn: [],
    patternKey: "majorBlues",
    status: "soon",
    keywords: [
      "what is the major blues scale",
      "major blues scale notes",
      "major blues vs minor blues",
      "country blues scale",
    ],
  },
  {
    slug: "rast",
    name: "Rast",
    kind: "scale",
    aliases: [
      alias("Maqam Rast", "Arabic maqam"),
      alias("Rast makamı", "Turkish makam", true),
    ],
    question: "What is maqam Rast?",
    summary:
      "The foundational Arabic maqam: a major-scale shape whose third and seventh sit a quarter tone flat — playable on a piano only if two of its keys are bent.",
    answer:
      "Rast is the foundational maqam of Arabic music. Its shape is the major scale's — 1, 2, 3, 4, 5, 6, 7 — but the third and seventh are 'half-flat,' roughly a quarter tone below the piano's E and B. On a twelve-key instrument that means either approximating it (C major or C Mixolydian) or doing what Middle Eastern keyboardists do: retuning every E and B down about fifty cents so the same white keys sound Rast.",
    formula: "1 – 2 – ½♭3 – 4 – 5 – 6 – ½♭7",
    exampleKey: "C",
    exampleNotes: "C – D – E½♭ – F – G – A – B½♭",
    usedIn: [],
    patternKey: "rast",
    status: "soon",
    keywords: [
      "what is maqam rast",
      "rast scale notes",
      "quarter tone scale piano",
      "arabic keyboard quarter tones",
      "half flat E",
    ],
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

/**
 * Every string a searcher might type for this scale's other names: the
 * alias itself, its tradition, and any native-script / alternate Latin
 * spellings the words registry knows ("Bhairavi" → भैरवी; "Hijaz Kar" →
 * "Hijazkar", حجاز كار).
 */
export function aliasSearchTerms(scale: ScaleLesson): string[] {
  return scale.aliases.flatMap((a) => [
    a.name,
    ...(a.tradition ? [a.tradition] : []),
    ...nativeSpellingsOf(a.name),
  ]);
}

/** Just the alias names, for title-ranked search and meta keywords. */
export function aliasNames(scale: ScaleLesson): string[] {
  return scale.aliases.map((a) => a.name);
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
    ...aliasSearchTerms(scale),
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
