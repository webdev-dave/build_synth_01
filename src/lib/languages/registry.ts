/**
 * Languages registry — browse the app's content by the language a tradition
 * speaks in (Yiddish, Hebrew, Romanian…).
 *
 * A language is not a genre: klezmer is *played* in Yiddish-speaking
 * communities, its ornaments carry Yiddish names, and the Yiddish theater
 * sang over the same bands. So a language page is a *lens* onto content that
 * already lives in the other registries — genres, scales, concepts, history,
 * the editorial catalog, the MIDI library, and the loanword list — not a new
 * copy of any of it.
 *
 * Cross-links stay data, not prose. Rather than stamp a `language` field onto
 * every song, concept, and artist (and keep it in sync forever), a language
 * declares how to *find* its content: the genre slugs whose tagged material
 * belongs to it, any extra slugs to fold in, the MIDI manifest labels to pull
 * the Piano Roll library by, and the `native.language` value that gathers its
 * loanwords. The helpers below resolve those rules against the live
 * registries, so a new klezmer artist or a new freygish concept shows up on
 * `/languages/yiddish` automatically.
 *
 * This is the source of truth for the `/languages` hub, the
 * `/languages/[slug]` pages, the sitemap, and search.
 */
import { GENRES, getGenre, type Genre } from "@/lib/genres/registry";
import { SCALES, type ScaleLesson } from "@/lib/scales/registry";
import { CONCEPTS, getConcept, type Concept } from "@/lib/concepts/registry";
import {
  HISTORY_ARTICLES,
  type HistoryArticle,
} from "@/lib/history/registry";
import { ARTISTS, type Artist } from "@/lib/catalog/artists";
import { SONGS_CATALOG, type CatalogSong } from "@/lib/catalog/songs";
import { WORDS, type SpokenWord } from "@/lib/words/registry";
import {
  filterByHaystack,
  joinHaystack,
  sortByLabel,
} from "@/lib/search/normalize";

export interface Language {
  /** URL slug under /languages. Kebab-case ("yiddish"). */
  slug: string;
  /** Display name ("Yiddish"). */
  name: string;
  /** BCP-47 tag for the native heading's `lang` / `dir` ("yi", "he-IL"). */
  lang: string;
  /** The language's own name in its own script ("ייִדיש"), shown as a subtitle. */
  nativeName?: string;
  /** Search-shaped question used as the page <h1> and title. */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /**
   * The quotable 1–2 sentence answer, rendered as the page lead and mirrored
   * into the meta description. True on its own, not a teaser.
   */
  answer: string;
  /** Optional second crawlable paragraph (why this language, how it connects). */
  about?: string;
  /**
   * Genre slugs whose tagged content (scales, concepts, history, artists,
   * songs) belongs to this language. The engine of the derivation below.
   */
  genres?: string[];
  /** Extra scale slugs to include beyond genre-derivation. */
  scales?: string[];
  /** Extra concept slugs to include. */
  concepts?: string[];
  /** Extra history article slugs to include. */
  history?: string[];
  /** Extra artist slugs to include. */
  artists?: string[];
  /** Extra catalog song slugs to include. */
  catalogSongs?: string[];
  /** MIDI manifest labels that pull this language's Piano Roll arrangements. */
  midiLabels?: string[];
  /** Value matched against `WORDS[].native.language` to gather loanwords. */
  wordLanguage?: string;
  /** "live" pages are indexed + in the sitemap; "soon" are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases woven into metadata. */
  keywords: string[];
}

export const LANGUAGES: Language[] = [
  {
    slug: "yiddish",
    name: "Yiddish",
    lang: "yi",
    nativeName: "ייִדיש",
    question: "What does music sound like in Yiddish?",
    summary:
      "Klezmer, the Yiddish theater, and the sobbing krechtz — the freygish mode, the dance tunes, the artists, and the words, all in one place.",
    answer:
      "Yiddish is the everyday language of Ashkenazi Eastern European Jewry, and it carries a whole musical world: klezmer, the instrumental celebration music of the Jewish wedding; the songs of the Second Avenue Yiddish theater; and a vocabulary of ornaments and dance forms — the krechtz, the freylekhs, the bulgar — whose names are Yiddish words.",
    about:
      "This page is a lens, not a new catalog: it gathers everything the app already teaches that lives in Yiddish — the klezmer genre and its freygish mode, the concepts behind its sound, its history and artists, the recordings you can hear and open, and the loanwords with their home spellings — so you can walk into the tradition from the language itself.",
    genres: ["klezmer", "yiddish-theater", "yiddish-folk"],
    midiLabels: ["yiddish", "klezmer", "jewish"],
    wordLanguage: "Yiddish",
    status: "live",
    keywords: [
      "yiddish music",
      "klezmer yiddish",
      "yiddish songs",
      "yiddish theater music",
      "jewish music language",
    ],
  },
  {
    slug: "hebrew",
    name: "Hebrew",
    lang: "he-IL",
    nativeName: "עברית",
    question: "What does music sound like in Hebrew?",
    summary:
      "The language of prayer behind the music — Ahava Rabbah, the mode klezmer took from the synagogue, and the wordless nigun.",
    answer:
      "Hebrew is the liturgical language of Jewish prayer, and its chant is one of the taproots of Ashkenazi music. The klezmer mode freygish is known in Hebrew as Ahava Rabbah, after the prayer whose melody uses it, and the wordless devotional nigun carries a tune where words leave off.",
    scales: ["freygish"],
    wordLanguage: "Hebrew",
    status: "soon",
    keywords: [
      "hebrew music",
      "ahava rabbah mode",
      "jewish prayer music",
      "nigun",
    ],
  },
  {
    slug: "romanian",
    name: "Romanian",
    lang: "ro-RO",
    nativeName: "română",
    question: "What does music sound like in Romanian?",
    summary:
      "The neighbor klezmer borrowed from — the free-time doina lament and the hora and sirba dance rhythms.",
    answer:
      "Romanian and Moldavian folk music was klezmer's close neighbor and a deep source of borrowing: the free-time doina lament, played by professional lăutari, became klezmer's great solo showpiece, and dance forms like the hora and the sirba crossed over into the repertoire.",
    concepts: ["doina"],
    wordLanguage: "Romanian",
    status: "soon",
    keywords: [
      "romanian music",
      "doina lament",
      "lautari",
      "hora sirba dance",
    ],
  },
];

export function getLanguage(slug: string): Language | undefined {
  return LANGUAGES.find((l) => l.slug === slug);
}

/** The genre slugs a language is built on, as a lookup set. */
function genreSet(language: Language): Set<string> {
  return new Set(language.genres ?? []);
}

/** True when any slug in `slugs` is one of the language's genres. */
function touchesGenres(slugs: string[] | undefined, set: Set<string>): boolean {
  return (slugs ?? []).some((s) => set.has(s));
}

/** De-dupe by slug while preserving first-seen order (caller sorts). */
function uniqueBy<T>(items: T[], key: (item: T) => string): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const k = key(item);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(item);
  }
  return out;
}

export function languageGenres(language: Language): Genre[] {
  const set = genreSet(language);
  return sortByLabel(
    GENRES.filter((g) => set.has(g.slug)),
    (g) => g.name,
  );
}

export function languageScales(language: Language): ScaleLesson[] {
  const set = genreSet(language);
  const extra = new Set(language.scales ?? []);
  return sortByLabel(
    SCALES.filter((s) => touchesGenres(s.usedIn, set) || extra.has(s.slug)),
    (s) => s.name,
  );
}

export function languageConcepts(language: Language): Concept[] {
  const set = genreSet(language);
  const derived = CONCEPTS.filter(
    (c) => touchesGenres(c.genres, set) || touchesGenres(c.history, set),
  );
  const extra = (language.concepts ?? [])
    .map((slug) => getConcept(slug))
    .filter((c): c is Concept => Boolean(c));
  return sortByLabel(uniqueBy([...derived, ...extra], (c) => c.slug), (c) => c.term);
}

export function languageHistory(language: Language): HistoryArticle[] {
  const set = genreSet(language);
  const extra = new Set(language.history ?? []);
  return sortByLabel(
    HISTORY_ARTICLES.filter(
      (a) => touchesGenres(a.genres, set) || extra.has(a.slug),
    ),
    (a) => a.name,
  );
}

export function languageArtists(language: Language): Artist[] {
  const set = genreSet(language);
  const extra = new Set(language.artists ?? []);
  return sortByLabel(
    ARTISTS.filter((a) => touchesGenres(a.genres, set) || extra.has(a.slug)),
    (a) => a.name,
  );
}

export function languageCatalogSongs(language: Language): CatalogSong[] {
  const set = genreSet(language);
  const extra = new Set(language.catalogSongs ?? []);
  return sortByLabel(
    SONGS_CATALOG.filter(
      (s) => touchesGenres(s.genres, set) || extra.has(s.slug),
    ),
    (s) => s.title,
  );
}

/** Loanwords whose native form is in this language, A–Z by Latin spelling. */
export function languageWords(language: Language): SpokenWord[] {
  if (!language.wordLanguage) return [];
  return sortByLabel(
    WORDS.filter((w) => w.native.language === language.wordLanguage),
    (w) => w.latin,
  );
}

/** The best in-app destination for a loanword, when one exists. */
export function wordHref(word: SpokenWord): string | undefined {
  const concept = getConcept(word.id);
  if (concept) return concept.href;
  if (getGenre(word.id)) return `/genres/${word.id}`;
  if (SCALES.some((s) => s.slug === word.id)) return `/scales/${word.id}`;
  return undefined;
}

/** Languages safe to index (real editorial content), for the sitemap. */
export const LIVE_LANGUAGES = LANGUAGES.filter((l) => l.status === "live");

function languageHaystack(language: Language): string {
  return joinHaystack([
    language.name,
    language.nativeName,
    language.slug,
    language.lang,
    language.wordLanguage,
    language.question,
    language.summary,
    language.answer,
    language.about,
    ...language.keywords,
    ...(language.genres ?? []),
    ...(language.midiLabels ?? []),
    ...languageGenres(language).map((g) => g.name),
    ...languageScales(language).map((s) => s.name),
    ...languageConcepts(language).flatMap((c) => [
      c.term,
      ...(c.aliases ?? []),
    ]),
    ...languageHistory(language).map((a) => a.name),
    ...languageArtists(language).map((a) => a.name),
    ...languageCatalogSongs(language).map((s) => s.title),
    ...languageWords(language).flatMap((w) => [
      w.latin,
      w.native.spelling,
      ...(w.alsoSpelled ?? []),
      ...(w.aliases ?? []),
    ]),
  ]);
}

const HAYSTACKS = new Map(LANGUAGES.map((l) => [l.slug, languageHaystack(l)]));

/**
 * Filter the hub list. Empty query returns every language. Tokens must all
 * appear somewhere in the language *or* the content it gathers (genre,
 * scale, concept, artist, song, loanword) so "krechtz" or "krekhts" finds Yiddish.
 */
export function searchLanguages(query: string): Language[] {
  return sortByLabel(
    filterByHaystack(
      LANGUAGES,
      query,
      (language) => HAYSTACKS.get(language.slug) ?? "",
    ),
    (language) => language.name,
  );
}
