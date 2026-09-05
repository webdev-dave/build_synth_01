/**
 * Musical History registry — the single list of long-form history articles.
 *
 * The Musical History module is the third teaching sibling of Genres and
 * Scales: where those pages dissect *how* a sound works, these tell the story
 * of *where it came from* — sourced, quoted, and linked back to originals.
 * This registry is the source of truth for the `/history` hub, the
 * `/history/[slug]` pages, and the sitemap. Full article prose lives in
 * `src/content/history/<slug>.tsx` (TSX, not MDX — see
 * docs/plans/musical-history-module.md).
 *
 * Cross-links are data, not hardcoded prose: an article lists the genre and
 * scale slugs it covers (`genres`, `scales`), and the genre page looks the
 * article up by genre slug to render its "history" link.
 */

/** A cited source — quoted briefly and linked, never reproduced wholesale. */
export interface Source {
  /** Stable anchor id, referenced by inline footnote links ("lomax-1993"). */
  id: string;
  title: string;
  author?: string;
  /** Journal, book, archive, or site the source appears in. */
  publication?: string;
  year?: string;
  /** Link to the original. Prefer stable, public archives. */
  url?: string;
  /** e.g. "Retrieved 2026-09-05" for web sources. */
  access?: string;
  /** True when the work is public domain or openly licensed (safe to quote at length). */
  publicDomain?: boolean;
}

export interface HistoryArticle {
  /** URL slug under /history. Kebab-case, no article ("blues"). */
  slug: string;
  /** Display name for cards and headers ("The blues"). */
  name: string;
  /** Search-shaped question used as the page <h1> and title. */
  question: string;
  /** One-liner for the hub card. */
  summary: string;
  /**
   * The quotable 1–2 sentence answer, rendered as the page lead, mirrored into
   * the meta description, and lifted into FAQ JSON-LD. True on its own.
   */
  answer: string;
  /** Genre registry slugs this article covers (reverse cross-link targets). */
  genres: string[];
  /** Scale registry slugs this article touches. */
  scales: string[];
  /** Bibliography for the article body's inline citations + "Sources" list. */
  sources: Source[];
  /** "live" pages are indexed + in the sitemap; "soon" pages are placeholders. */
  status: "live" | "soon";
  /** Secondary search phrases woven into metadata. */
  keywords: string[];
}

export const HISTORY_ARTICLES: HistoryArticle[] = [
  {
    slug: "blues",
    name: "The blues",
    question: "Where did the blues come from?",
    summary:
      "From work songs, field hollers, and spirituals in the Deep South to the root system of jazz, R&B, and rock — the story of the blues, sourced and linked.",
    answer:
      "The blues emerged in African-American communities of the Deep South around the turn of the 20th century, growing out of work songs, field hollers, and spirituals before it was first published and recorded in the 1910s and 1920s.",
    genres: ["blues"],
    scales: ["blues-scale"],
    // Seed bibliography — public-domain / open-archive first. Expanded when
    // the full article body is written (Phase 3).
    sources: [],
    status: "soon",
    keywords: [
      "history of the blues",
      "where did the blues come from",
      "origins of blues music",
      "delta blues history",
      "great migration blues",
    ],
  },
];

export function getArticle(slug: string): HistoryArticle | undefined {
  return HISTORY_ARTICLES.find((a) => a.slug === slug);
}

/** The history article covering a given genre slug, if one exists. */
export function getArticleByGenre(
  genreSlug: string,
): HistoryArticle | undefined {
  return HISTORY_ARTICLES.find((a) => a.genres.includes(genreSlug));
}

/** Articles safe to index (real content), for the sitemap. */
export const LIVE_HISTORY = HISTORY_ARTICLES.filter((a) => a.status === "live");
