/**
 * Global search index — one flat list over everything the app can open.
 *
 * Sources are the same registries that drive the hubs and the sitemap:
 * tools/pages (`navigation.ts`), the MIDI library (`src/lib/songs`), the
 * editorial catalog (`src/lib/catalog`), and the teaching registries
 * (genres, scales, history, concepts, lessons). Nothing is duplicated here —
 * a registry append shows up in search automatically.
 *
 * This module pulls in the full MIDI manifest (~800 rows), so it is meant to
 * be `import()`ed lazily by the search UI, not bundled into the global nav.
 */
import { NAV_ITEMS } from "@/lib/navigation";
import { SONGS } from "@/lib/songs/library";
import { SONGS_CATALOG, songAttribution } from "@/lib/catalog/songs";
import { ARTISTS } from "@/lib/catalog/artists";
import { GENRES } from "@/lib/genres/registry";
import { SCALES } from "@/lib/scales/registry";
import { HISTORY_ARTICLES } from "@/lib/history/registry";
import { CONCEPTS } from "@/lib/concepts/registry";
import { LANGUAGES } from "@/lib/languages/registry";
import { LESSONS } from "@/lib/lessons/registry";
import { nativeSpellingsOf } from "@/lib/words/registry";
import { normalizeSearch } from "@/lib/search/normalize";

export type SearchGroup =
  | "pages"
  | "midi"
  | "songs"
  | "artists"
  | "genres"
  | "scales"
  | "history"
  | "concepts"
  | "languages"
  | "lessons";

export const GROUP_LABELS: Record<SearchGroup, string> = {
  pages: "Tools & pages",
  midi: "Piano Roll library",
  songs: "Song articles",
  artists: "Artists",
  genres: "Genres",
  scales: "Scales & modes",
  history: "Musical history",
  concepts: "Concepts",
  languages: "Languages",
  lessons: "Lessons",
};

/** How many rows a group may contribute to one result set. */
const GROUP_CAPS: Record<SearchGroup, number> = {
  pages: 6,
  midi: 8,
  songs: 6,
  artists: 6,
  genres: 4,
  scales: 5,
  history: 4,
  concepts: 6,
  languages: 4,
  lessons: 4,
};

/** Canonical group order (ties in relevance keep this order). */
const GROUP_ORDER: SearchGroup[] = [
  "pages",
  "midi",
  "songs",
  "artists",
  "genres",
  "scales",
  "history",
  "concepts",
  "languages",
  "lessons",
];

export interface SearchEntry {
  href: string;
  title: string;
  /** One quiet context line under the title (attribution, question, blurb). */
  subtitle?: string;
  group: SearchGroup;
  /** Key into `getAppIcon` (nav id); the UI may override per-group. */
  iconId: string;
  /** Placeholder page — rendered with a "Soon" badge, still a door. */
  soon?: boolean;
  /** Precomputed lowercase searchable text. */
  haystack: string;
  titleNorm: string;
  titleWords: string[];
}

export interface SearchResultGroup {
  group: SearchGroup;
  label: string;
  items: SearchEntry[];
}

/** Lowercase + strip diacritics so "bulgár" matches "bulgar". */
const normalize = normalizeSearch;

function entry(
  group: SearchGroup,
  iconId: string,
  href: string,
  title: string,
  subtitle: string | undefined,
  extraHaystack: Array<string | undefined>,
  soon = false,
): SearchEntry {
  const titleNorm = normalize(title);
  const haystack = normalize(
    [title, subtitle, ...extraHaystack].filter(Boolean).join(" "),
  );
  return {
    href,
    title,
    subtitle,
    group,
    iconId,
    soon,
    haystack,
    titleNorm,
    titleWords: titleNorm.split(/[^a-z0-9]+/).filter(Boolean),
  };
}

function buildIndex(): SearchEntry[] {
  const out: SearchEntry[] = [];

  // Tools & top-level pages — nav registry plus the two footer-ish pages.
  for (const item of NAV_ITEMS.filter((i) => !i.hidden)) {
    out.push(
      entry("pages", item.id, item.href, item.label, item.description, []),
    );
  }
  out.push(
    entry("pages", "about", "/about", "About", "About the developer", []),
    entry("pages", "contact", "/contact", "Contact", "Get in touch", []),
  );

  // Editorial song articles — before the MIDI library so a title that exists
  // in both (e.g. "St. Louis Blues") surfaces the article and the arrangement.
  for (const song of SONGS_CATALOG) {
    out.push(
      entry(
        "songs",
        "songs",
        `/songs/${song.slug}`,
        song.title,
        songAttribution(song),
        [
          song.micro,
          song.about,
          ...(song.keywords ?? []),
          ...(song.genres ?? []),
        ],
        song.status !== "live",
      ),
    );
  }

  for (const artist of ARTISTS) {
    out.push(
      entry(
        "artists",
        "artists",
        `/artists/${artist.slug}`,
        artist.name,
        artist.era ? `${artist.era} — ${artist.micro}` : artist.micro,
        [...(artist.keywords ?? []), ...(artist.genres ?? [])],
        artist.status !== "live",
      ),
    );
  }

  for (const genre of GENRES) {
    out.push(
      entry(
        "genres",
        "genres",
        `/genres/${genre.slug}`,
        genre.name,
        genre.question,
        [genre.summary, ...genre.keywords, ...nativeSpellingsOf(genre.slug)],
        genre.status !== "live",
      ),
    );
  }

  for (const scale of SCALES) {
    out.push(
      entry(
        "scales",
        "scales",
        `/scales/${scale.slug}`,
        scale.name,
        scale.question,
        [
          scale.summary,
          scale.formula,
          scale.exampleNotes,
          ...scale.keywords,
          ...nativeSpellingsOf(scale.slug),
        ],
        scale.status !== "live",
      ),
    );
  }

  for (const article of HISTORY_ARTICLES) {
    out.push(
      entry(
        "history",
        "history",
        `/history/${article.slug}`,
        article.question,
        article.summary,
        [article.name, ...article.keywords, ...nativeSpellingsOf(article.slug)],
        article.status !== "live",
      ),
    );
  }

  // Concepts keep their own `href` — delegated terms (pentatonic, freygish)
  // land on the richer scale page, exactly like the inline <Term> popover.
  for (const concept of CONCEPTS) {
    out.push(
      entry(
        "concepts",
        "concepts",
        concept.href,
        concept.term,
        concept.micro,
        [
          ...(concept.aliases ?? []),
          ...(concept.keywords ?? []),
          ...nativeSpellingsOf(concept.slug),
        ],
        concept.status !== "live",
      ),
    );
  }

  for (const language of LANGUAGES) {
    out.push(
      entry(
        "languages",
        "languages",
        `/languages/${language.slug}`,
        language.name,
        language.summary,
        [
          language.question,
          language.nativeName,
          ...language.keywords,
        ],
        language.status !== "live",
      ),
    );
  }

  for (const lesson of LESSONS) {
    out.push(
      entry(
        "lessons",
        "lessons",
        `/lessons/${lesson.slug}`,
        lesson.title,
        lesson.summary,
        [],
        true, // every lesson is a placeholder today
      ),
    );
  }

  // The playable MIDI library — the big one (~800 rows), last so equal-score
  // ties defer to the editorial content above.
  for (const song of SONGS) {
    out.push(
      entry(
        "midi",
        "piano-roll",
        `/piano-roll/${song.id}`,
        song.title,
        song.subtitle ?? song.artist ?? song.labels.join(" · "),
        [
          song.artist,
          song.key,
          ...song.labels,
          song.source?.collection,
          song.id,
        ],
      ),
    );
  }

  return out;
}

let INDEX: SearchEntry[] | null = null;

function getIndex(): SearchEntry[] {
  if (!INDEX) INDEX = buildIndex();
  return INDEX;
}

/**
 * Every query token must appear somewhere in the haystack; the score only
 * ranks *where* it hit (whole title > title prefix > word prefix > body).
 */
function scoreEntry(e: SearchEntry, tokens: string[]): number {
  let score = 0;
  for (const t of tokens) {
    if (!e.haystack.includes(t)) return 0;
    if (e.titleNorm === t) score += 100;
    else if (e.titleNorm.startsWith(t)) score += 60;
    else if (e.titleWords.some((w) => w.startsWith(t))) score += 40;
    else if (e.titleNorm.includes(t)) score += 25;
    else score += 5;
  }
  return score;
}

/**
 * Grouped, ranked results. Empty query returns the tools/pages group as a
 * quick-nav list (the palette prepends the user's recent destinations).
 * Groups are ordered by their best hit, capped per group so 800 MIDI
 * titles can't drown the editorial content.
 */
export function searchAll(query: string): SearchResultGroup[] {
  const index = getIndex();
  const tokens = normalize(query).split(/\s+/).filter(Boolean);

  if (tokens.length === 0) {
    return [
      {
        group: "pages",
        label: GROUP_LABELS.pages,
        items: index.filter((e) => e.group === "pages"),
      },
    ];
  }

  const scored = index
    .map((e) => ({ e, score: scoreEntry(e, tokens) }))
    .filter((r) => r.score > 0);

  const buckets = new Map<SearchGroup, { best: number; items: SearchEntry[] }>();
  // Stable relevance order inside each group.
  scored.sort((a, b) => b.score - a.score || a.e.title.length - b.e.title.length);
  for (const { e, score } of scored) {
    const bucket = buckets.get(e.group) ?? { best: 0, items: [] };
    bucket.best = Math.max(bucket.best, score);
    if (bucket.items.length < GROUP_CAPS[e.group]) bucket.items.push(e);
    buckets.set(e.group, bucket);
  }

  return [...buckets.entries()]
    .sort(
      (a, b) =>
        b[1].best - a[1].best ||
        GROUP_ORDER.indexOf(a[0]) - GROUP_ORDER.indexOf(b[0]),
    )
    .map(([group, { items }]) => ({
      group,
      label: GROUP_LABELS[group],
      items,
    }));
}
