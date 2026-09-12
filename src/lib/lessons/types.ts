/**
 * The shape every lesson-module registry row shares.
 *
 * Scales, progressions, grooves, and forms are sibling trees with the same
 * job: one search-shaped question per page, a quotable answer, cross-links
 * as data. Hubs, search, the sitemap, JSON-LD, and the genre-page layer
 * panels can treat any of them alike through this base — a new module is a
 * registry that extends it, not new page plumbing.
 *
 * `aliases` is deliberately absent: scales carry structured aliases (name +
 * tradition), the other modules plain strings. Modules expose their alias
 * names through `aliasNamesOf` so the base helpers never care which.
 */

export type LessonStatus = "live" | "soon";

export interface LessonEntry {
  /** URL slug under the module hub. */
  slug: string;
  /** Display name ("Blues scale", "12-bar blues", "Shuffle"). */
  name: string;
  /** Search-shaped question — the page <h1> and <title>. */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /**
   * Quotable 1–2 sentence answer, rendered as the lead and mirrored into
   * the meta description + FAQ JSON-LD. Must be true standalone.
   */
  answer: string;
  /** Short origin paragraph, crawlable. Honest, not a bio. */
  history?: string;
  /** Genre slugs where this is heard. The genre registry points back. */
  usedIn: string[];
  /** "live" pages are indexed and in the sitemap; "soon" are placeholders. */
  status: LessonStatus;
  /** Secondary search phrases woven into metadata. */
  keywords: string[];
}

/** Rows safe to index — the sitemap and the hub's "Ready" filter. */
export function liveOf<T extends { status: LessonStatus }>(list: readonly T[]): T[] {
  return list.filter((item) => item.status === "live");
}

/**
 * Alias names regardless of how a module stores them — plain strings or
 * `{ name }` objects (the scale registry's tradition-tagged aliases).
 */
export function aliasNamesOf(
  aliases: readonly (string | { name: string })[] | undefined,
): string[] {
  if (!aliases) return [];
  return aliases.map((alias) => (typeof alias === "string" ? alias : alias.name));
}

/**
 * FAQ structured data for a lesson spoke: the page's question and answer,
 * plus an "also called" question when the entry has other names, so a
 * structured-data consumer can match "Bhairavi thaat" or "blues changes"
 * to this page. The on-page lead is the same text — honest by construction.
 */
export function faqJsonLd(entry: LessonEntry, alts: readonly string[] = []) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    about: {
      "@type": "Thing",
      name: entry.name,
      ...(alts.length ? { alternateName: alts } : {}),
    },
    mainEntity: [
      {
        "@type": "Question",
        name: entry.question,
        acceptedAnswer: { "@type": "Answer", text: entry.answer },
      },
      ...(alts.length
        ? [
            {
              "@type": "Question",
              name: `What else is the ${entry.name.toLowerCase()} called?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: `${entry.name} is also known as ${alts.join(", ")}.`,
              },
            },
          ]
        : []),
    ],
  };
}

/**
 * Meta description for a spoke: the answer, with the other names appended
 * — that is the text a search engine or an LLM quotes, so "also called
 * Bhairavi" has to be in it.
 */
export function lessonDescription(entry: LessonEntry, alts: readonly string[] = []): string {
  return alts.length ? `${entry.answer} Also called ${alts.join(", ")}.` : entry.answer;
}
