/**
 * Forms registry — the form layer's teaching tree.
 *
 * One page per named song shape ("what is the 12-bar blues *form*?"): how
 * long the loop is before it comes round, how its bars group into phrases
 * and its phrases into a chorus, where the words sit and where the answer
 * sits. Same contract as scales, progressions and grooves (`LessonEntry`):
 * a search-shaped question, a quotable answer, a crawlable formula, and
 * cross-links as data. The genre registry points back through
 * `Genre.forms`; a progression and a form that share a slug (the 12-bar)
 * are two owners of two questions, linked both ways through
 * `Progression.forms` ↔ `Form.progressions`.
 *
 * A form describes *one cycle* as sections. A section may split into a
 * sung **call** and an open **response** (`callBars`) — the AAB blues line
 * is three four-bar sections, each two bars of words and two of answer.
 * `song` stacks cycles into a whole tune for the song strip. Sung text is
 * never typed here: `lyric` points at a public-domain version in the
 * catalog (see src/lib/forms/lyric.ts and docs/plans/lesson-widgets-design.md
 * § 3.3).
 */

import { getGenre } from "@/lib/genres/registry";
import type { LessonEntry } from "@/lib/lessons/types";
import { getProgression } from "@/lib/progressions/registry";
import {
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";

export interface FormSection {
  id: string;
  /** Letter or name on the map ("A", "B", "Verse", "Chorus"). */
  label: string;
  bars: number;
  /**
   * Leading bars of the section that carry the sung line; the remaining
   * bars are the response. Omit when the section has no call / answer
   * split (a verse, an intro).
   */
  callBars?: number;
  /**
   * Which line of a chorus's lyric this section sings, 0-based (AAB →
   * 0, 1, 2). Omit for sections with no words.
   */
  line?: number;
}

/** Where the call cells' words come from — a public-domain catalog text. */
export interface FormLyricRef {
  /** Catalog song slug. */
  song: string;
  /** `SongLyrics.id` on that song ("english"). */
  version: string;
}

/** One pass through the cycle inside a whole song — a block on the song strip. */
export interface FormChorus {
  id: string;
  /** "Chorus 1", "Solo". */
  label: string;
  /**
   * Line indices into the referenced lyric, in section order (one per
   * section that has a `line`). Omit for an instrumental chorus.
   */
  lines?: number[];
  /** No words: the lead answers in every half of every phrase. */
  instrumental?: boolean;
}

export interface FormSource {
  label: string;
  url: string;
}

export interface Form extends LessonEntry {
  kind: "form";
  /** Other names — "blues form", "AAB". */
  aliases: string[];
  /** One cycle, in order. */
  sections: FormSection[];
  /** How a song stacks cycles. Omit → the song is one cycle. */
  song?: FormChorus[];
  lyric?: FormLyricRef;
  /** The progression that sounds under the map. Omit → the map is silent and says so. */
  progression?: string;
  /** Progressions sharing this territory (reverse of `Progression.forms`). */
  progressions: string[];
  /** Crawlable shape: "A · A · B — three 4-bar phrases, each 2 bars sung + 2 bars answer". */
  formula: string;
  /** Worked example — a song title when `lyric` is set, else a plain length ("8 bars"). */
  exampleKey: string;
  /**
   * What the example shows. Omit when `lyric` is set: the panel derives it
   * from the catalog text (never retyped here).
   */
  exampleNotes?: string;
  /** Foil form for the comparer (12-bar ↔ 8-bar). */
  compareWith?: string;
  /** Verified references, shown as the lesson's Sources. */
  sources: FormSource[];
}

// --- derived shape --------------------------------------------------------

/** Bars in one cycle. */
export function formBars(form: Pick<Form, "sections">): number {
  return form.sections.reduce((sum, s) => sum + s.bars, 0);
}

/** Cycles in the song strip (one when the form declares no `song`). */
export function formChoruses(form: Form): FormChorus[] {
  return form.song ?? [{ id: "cycle", label: form.name }];
}

export type BarRole = "call" | "response" | "plain";

export interface BarPlace {
  /** Index into `form.sections`. */
  sectionIndex: number;
  section: FormSection;
  /** 0-based bar within the section. */
  barInSection: number;
  role: BarRole;
}

/** Which section a bar of the cycle belongs to, and whether it is call or answer. */
export function placeOfBar(form: Pick<Form, "sections">, bar: number): BarPlace | undefined {
  let start = 0;
  for (let i = 0; i < form.sections.length; i++) {
    const section = form.sections[i];
    if (bar < start + section.bars) {
      const barInSection = bar - start;
      const role: BarRole =
        section.callBars === undefined
          ? "plain"
          : barInSection < section.callBars
            ? "call"
            : "response";
      return { sectionIndex: i, section, barInSection, role };
    }
    start += section.bars;
  }
  return undefined;
}

export interface FormSpan {
  sectionIndex: number;
  section: FormSection;
  role: BarRole;
  /** First bar of the span in the cycle (0-based) and its length in bars. */
  from: number;
  length: number;
}

/**
 * The cycle as spans: a split section yields a call span then a response
 * span; an unsplit one yields a single plain span. Widgets draw these; the
 * lick player sounds in the response ones.
 */
export function spansOf(form: Pick<Form, "sections">): FormSpan[] {
  const out: FormSpan[] = [];
  let start = 0;
  form.sections.forEach((section, sectionIndex) => {
    if (section.callBars === undefined || section.callBars >= section.bars) {
      out.push({ sectionIndex, section, role: "plain", from: start, length: section.bars });
    } else {
      out.push({ sectionIndex, section, role: "call", from: start, length: section.callBars });
      out.push({
        sectionIndex,
        section,
        role: "response",
        from: start + section.callBars,
        length: section.bars - section.callBars,
      });
    }
    start += section.bars;
  });
  return out;
}

// --- rows -----------------------------------------------------------------

const WIKI = (title: string, page: string): FormSource => ({
  label: `${title} — Wikipedia`,
  url: `https://en.wikipedia.org/wiki/${page}`,
});

/** The AAB chorus: three four-bar lines, each two bars sung and two bars answered. */
const AAB_SECTIONS: FormSection[] = [
  { id: "a1", label: "A", bars: 4, callBars: 2, line: 0 },
  { id: "a2", label: "A", bars: 4, callBars: 2, line: 1 },
  { id: "b", label: "B", bars: 4, callBars: 2, line: 2 },
];

export const FORMS: Form[] = [
  {
    slug: "twelve-bar-blues",
    name: "12-bar blues form",
    kind: "form",
    aliases: ["Blues form", "AAB", "Twelve-bar form", "Blues chorus", "Blues stanza"],
    question: "What is the 12-bar blues form?",
    summary:
      "Twelve bars that come round as one chorus: three four-bar lines — say it, say it again, answer it — each line two bars of words and two bars of reply.",
    answer:
      "The 12-bar blues form is a twelve-bar cycle, called a chorus, that a blues song repeats with new words each time. Its twelve bars fall into three four-bar phrases carrying a three-line lyric: a first line, the same line again (often slightly changed), then a different line that answers it — AAB. Within each phrase the singer takes roughly the first two bars and the band or guitar answers in the last two, so call-and-response is built into the shape. The chords under it are the 12-bar blues progression.",
    history:
      "The three-line stanza is older than the chord pattern: the earliest recorded blues singers lengthened, shortened and repeated lines by feel, and eight- and sixteen-bar songs sat alongside twelve. W. C. Handy's published blues of the 1910s fixed the twelve-bar, AAB shape on paper, and by the 1920s recordings of Bessie Smith and Ma Rainey it was the default — the form nearly every later blues, and much of rhythm and blues and early rock and roll, assumes.",
    sections: AAB_SECTIONS,
    song: [
      { id: "chorus-1", label: "Chorus 1", lines: [0, 1, 2] },
      { id: "chorus-2", label: "Chorus 2", lines: [3, 4, 5] },
      { id: "solo", label: "Solo chorus", instrumental: true },
      { id: "chorus-3", label: "Chorus 3", lines: [13, 14, 15] },
      { id: "chorus-4", label: "Chorus 4", lines: [16, 17, 18] },
    ],
    lyric: { song: "st-louis-blues", version: "english" },
    progression: "twelve-bar-blues",
    progressions: ["twelve-bar-blues"],
    formula: "A · A · B — three 4-bar lines, each 2 bars sung + 2 bars answered",
    exampleKey: "St. Louis Blues",
    usedIn: ["blues", "rock"],
    compareWith: "eight-bar-blues",
    status: "live",
    keywords: [
      "12 bar blues form",
      "AAB blues lyric",
      "blues chorus structure",
      "call and response blues",
      "twelve bar blues structure",
      "how many bars in a blues",
    ],
    sources: [
      WIKI("Twelve-bar blues (form, AA'B melodic line)", "Twelve-bar_blues"),
      WIKI("Call and response (music)", "Call_and_response_(music)"),
      WIKI("Song structure", "Song_structure"),
    ],
  },
  // ---------------------------------------------------------------------
  // Stubs: every cross-link on a live page resolves. Each flips to "live"
  // with its lesson. Copy is true standalone — it is the meta description.
  // ---------------------------------------------------------------------
  {
    slug: "eight-bar-blues",
    name: "8-bar blues",
    kind: "form",
    aliases: ["Eight-bar blues", "Eight-bar form"],
    question: "What is the 8-bar blues?",
    summary:
      "The blues in eight bars instead of twelve — the second most common blues shape, with two four-bar lines where the twelve-bar has three.",
    answer:
      "An 8-bar blues is a blues whose cycle lasts eight bars rather than twelve. Writers call it the second most common blues form, found in folk, rock and jazz blues alike, and it is usually written in 4/4 or 12/8 with eight bars to the verse. Because it drops one four-bar line, the lyric is two lines rather than the twelve-bar's three.",
    sections: [
      { id: "a", label: "A", bars: 4, callBars: 2, line: 0 },
      { id: "b", label: "B", bars: 4, callBars: 2, line: 1 },
    ],
    progressions: [],
    formula: "A · B — two 4-bar lines, 8 bars to the chorus",
    exampleKey: "8 bars",
    exampleNotes: "two lines, then round again",
    usedIn: ["blues"],
    compareWith: "twelve-bar-blues",
    status: "soon",
    keywords: ["8 bar blues", "eight bar blues form", "eight bar blues structure"],
    sources: [WIKI("Eight-bar blues", "Eight-bar_blues")],
  },
  {
    slug: "sixteen-bar-blues",
    name: "16-bar blues",
    kind: "form",
    aliases: ["Sixteen-bar blues", "Sixteen-bar form"],
    question: "What is the 16-bar blues?",
    summary:
      "A blues stretched to sixteen bars — a twelve-bar with a line repeated or an eight-bar doubled — common in ragtime as well as blues.",
    answer:
      "A 16-bar blues is a blues whose cycle lasts sixteen bars. It is usually a variation on the twelve-bar form (one four-bar section extended or repeated) or on the eight-bar form doubled, and the same sixteen-bar shape is common in ragtime. The lyric stretches with it: four lines, or three with a longer answer.",
    sections: [
      { id: "a1", label: "A", bars: 4, callBars: 2, line: 0 },
      { id: "a2", label: "A", bars: 4, callBars: 2, line: 1 },
      { id: "b", label: "B", bars: 4, callBars: 2, line: 2 },
      { id: "c", label: "C", bars: 4, callBars: 2, line: 3 },
    ],
    progressions: [],
    formula: "A · A · B · C — four 4-bar lines, 16 bars to the chorus",
    exampleKey: "16 bars",
    exampleNotes: "a twelve-bar with one more line",
    usedIn: ["blues"],
    compareWith: "twelve-bar-blues",
    status: "soon",
    keywords: ["16 bar blues", "sixteen bar blues form", "sixteen bar blues structure"],
    sources: [WIKI("Sixteen-bar blues", "Sixteen-bar_blues")],
  },
  {
    slug: "verse-chorus",
    name: "Verse–chorus form",
    kind: "form",
    aliases: ["Verse-chorus", "Verse / chorus song", "Pop song form"],
    question: "What is verse–chorus form?",
    summary:
      "The rock and pop shape: verses that change their words each time, and a chorus that comes back the same — the part everyone sings.",
    answer:
      "Verse–chorus form alternates two kinds of section: verses, which keep the same music but change their words, and a chorus, which returns with the same words and music each time and carries the song's title and hook. The shape goes back to 1840s songs such as “Oh! Susanna”, became common in blues and rock and roll in the 1950s, and has been the predominant form of rock music since the 1960s. Where 32-bar form is built around its refrain, verse–chorus form highlights the chorus.",
    sections: [
      { id: "verse", label: "Verse", bars: 8 },
      { id: "chorus", label: "Chorus", bars: 8 },
    ],
    progressions: ["i-v-vi-iv"],
    formula: "Verse · Chorus · Verse · Chorus · Bridge · Chorus — the chorus returns unchanged",
    exampleKey: "a rock song",
    exampleNotes: "new words each verse, the same chorus every time",
    usedIn: ["rock"],
    compareWith: "twelve-bar-blues",
    status: "soon",
    keywords: [
      "verse chorus form",
      "verse chorus structure",
      "song structure verse chorus bridge",
      "pop song form",
    ],
    sources: [WIKI("Verse–chorus form", "Verse%E2%80%93chorus_form"), WIKI("Song structure", "Song_structure")],
  },
];

export function getForm(slug: string): Form | undefined {
  return FORMS.find((f) => f.slug === slug);
}

/** Forms safe to index (real content), for the sitemap. */
export const LIVE_FORMS = FORMS.filter((f) => f.status === "live");

/** Forms a genre lists (in the genre's order), resolved. */
export function getFormsByGenre(genreSlug: string): Form[] {
  const genre = getGenre(genreSlug);
  const slugs = genre?.forms ?? [];
  return slugs.map((slug) => getForm(slug)).filter((f): f is Form => Boolean(f));
}

/** Forms that name a progression — the progression page's "The shape it fills". */
export function getFormsByProgression(progressionSlug: string): Form[] {
  return FORMS.filter((f) => f.progressions.includes(progressionSlug));
}

export interface FormFilters {
  genre?: string;
  status?: "live" | "soon";
}

function formHaystack(f: Form): string {
  return joinHaystack([
    f.name,
    f.slug,
    f.question,
    f.summary,
    f.answer,
    f.history,
    f.formula,
    f.exampleKey,
    f.exampleNotes,
    ...f.aliases,
    ...f.keywords,
    ...f.sections.map((s) => s.label),
    ...relatedNames(f.usedIn, getGenre),
    ...relatedNames(f.progressions, getProgression),
  ]);
}

const FORM_HAY = new Map(FORMS.map((f) => [f.slug, formHaystack(f)]));

export function searchForms(query: string, filters: FormFilters = {}): Form[] {
  let items: readonly Form[] = FORMS;
  if (filters.genre) {
    items = items.filter((f) => f.usedIn.includes(filters.genre!));
  }
  if (filters.status) {
    items = items.filter((f) => f.status === filters.status);
  }
  return sortByLabel(
    filterByHaystack(items, query, (f) => FORM_HAY.get(f.slug) ?? ""),
    (f) => f.name,
  );
}
