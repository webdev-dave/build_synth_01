/**
 * Opt-in auto-linker for descriptive prose (genre `about`, scale `history`,
 * history leads, and map place blurbs).
 *
 * The history article wraps theory terms by hand with `<Term id="…">`, because
 * an author is choosing exactly which mention to light up. But the genre,
 * scale, and place registries store their prose as plain strings — they can't
 * hold JSX — so those pages would never carry a definable term or a doorway
 * to a catalog artist.
 *
 * This turns such a string into React nodes, wrapping the *first* occurrence of
 * each registry concept in a `<Term>`, each loanword that isn't already a
 * concept in a `<Word>` (native spelling + pronounce), and *every* occurrence
 * of a catalog artist name in an `<ArtistLink>`. It matches on the concept's canonical term plus
 * its aliases, so "off-beat" links to *syncopation* and "12-bar" links to the
 * *12-bar blues*; artist names match the catalog `name` ("Abe Schwartz").
 *
 * House rules:
 *   • A concept or loanword is linked once per page — share ONE linker
 *     across a page's prose blocks (lead + body).
 *   • A concept with `linkEveryMention` (the Chasidic movement) is linked
 *     at every mention. `skip` still suppresses it on its own glossary page.
 *   • A catalog artist is linked at every mention. `name` always matches;
 *     `alsoNamed` adds the surname or other forms the prose uses alone.
 *   • A person with no artist entry is an inline Wikipedia link,
 *     `[Sarah](https://en.wikipedia.org/wiki/Sarah_Reisen)`. If that label
 *     is a catalog artist, the artist page wins and the URL is ignored.
 *   • The linker is a plain function returning nodes (no hooks), so callers
 *     stay server components; only the `<Term>` / `<Word>` / `<ArtistLink>`
 *     leaf is client. The prose text still ships in the static HTML.
 *
 * These are our *own* descriptions, not quotations, so — unlike hand-authored
 * article prose — there's no direct quotation to avoid wrapping inside.
 */
import type { ReactNode } from "react";

import { CONCEPTS } from "@/lib/concepts/registry";
import { WORDS, getWordByPhrase } from "@/lib/words/registry";
import { ARTISTS } from "@/lib/catalog/artists";
import { Term } from "@/components/concepts/Term";
import { Word } from "@/components/words/Word";
import { ArtistLink } from "@/components/catalog/ArtistLink";
import { PROSE_LINK } from "@/components/content/prose";
import { wikiLinksIn } from "@/lib/prose/wikiLinks";

type Kind = "concept" | "word" | "artist";

// Every matchable phrase mapped back to a concept, loanword, or artist.
// Concepts win when the same slug exists in both registries (Term looks up
// the word itself). Sorted longest-first so a longer phrase wins over a
// shorter overlap at the same spot (e.g. "12-bar blues" before "12-bar").
const CONCEPT_SLUGS = new Set(CONCEPTS.map((c) => c.slug));
const REPEAT_IDS = new Set(
  CONCEPTS.filter((c) => c.linkEveryMention).map((c) => c.slug),
);
const CONCEPT_PHRASES = new Set(
  CONCEPTS.flatMap((c) =>
    [c.term, ...(c.aliases ?? [])].map((p) => p.toLowerCase()),
  ),
);

const MATCHERS: { phrase: string; kind: Kind; id: string }[] = [
  ...CONCEPTS.flatMap((c) =>
    [c.term, ...(c.aliases ?? [])].map((phrase) => ({
      phrase,
      kind: "concept" as const,
      id: c.slug,
    })),
  ),
  ...WORDS.filter((w) => !CONCEPT_SLUGS.has(w.id)).flatMap((w) =>
    [w.latin, ...(w.alsoSpelled ?? []), ...(w.aliases ?? [])]
      // A concept alias like "Ahava Rabbah" stays a <Term> (definition);
      // Term then picks the matching native form from the words registry.
      .filter((phrase) => !CONCEPT_PHRASES.has(phrase.toLowerCase()))
      .map((phrase) => ({
        phrase,
        kind: "word" as const,
        id: w.id,
      })),
  ),
  ...ARTISTS.flatMap((a) =>
    [a.name, ...(a.alsoNamed ?? [])].map((phrase) => ({
      phrase,
      kind: "artist" as const,
      id: a.slug,
    })),
  ),
].sort((a, b) => b.phrase.length - a.phrase.length);

const PHRASE_TO_MATCH = new Map(
  MATCHERS.map((m) => [m.phrase.toLowerCase(), m] as const),
);

const ARTIST_BY_PHRASE = new Map(
  ARTISTS.flatMap((a) =>
    [a.name, ...(a.alsoNamed ?? [])].map(
      (phrase) => [phrase.toLowerCase(), a.slug] as const,
    ),
  ),
);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// One alternation of all phrases. Custom boundaries (no alphanumeric on either
// side) instead of \b, so hyphenated/numeric phrases like "12-bar" and
// "call-and-response" match cleanly where \b would trip on the punctuation.
const TERM_SOURCE = `(?<![A-Za-z0-9])(?:${MATCHERS.map((m) =>
  escapeRegExp(m.phrase),
).join("|")})(?![A-Za-z0-9])`;

export interface TermLinkerOptions {
  /** Don't wrap these concept / word / artist ids (e.g. a concept page skipping itself). */
  skip?: string[];
}

/**
 * Returns a `link(text)` that wraps each concept's first occurrence in a
 * `<Term>`, each other loanword in a `<Word>`, and every catalog artist
 * mention in an `<ArtistLink>`. Reuse the same returned function across
 * every prose block on one page so concepts and words stay once per page.
 */
export function makeTermLinker(
  options: TermLinkerOptions = {},
): (text: string) => ReactNode {
  const skip = new Set(options.skip ?? []);
  const used = new Set<string>();
  // Fresh regex per linker — a `g` regex carries `lastIndex` state, so sharing
  // one module-level instance across concurrent renders would be a race.
  const re = new RegExp(TERM_SOURCE, "gi");

  return function link(text: string): ReactNode {
    const nodes: ReactNode[] = [];
    let key = 0;

    const pushPlain = (slice: string) => {
      re.lastIndex = 0;
      let last = 0;
      let m: RegExpExecArray | null;

      while ((m = re.exec(slice)) !== null) {
        const match = PHRASE_TO_MATCH.get(m[0].toLowerCase());
        if (!match) continue;

        // A concept alias can be a different loanword ("Ahava Rabbah" is
        // Hebrew, not the Yiddish for *freygish*). If the concept was already
        // linked, still mark that other name.
        let kind = match.kind;
        let id = match.id;
        const repeat =
          kind === "concept" && REPEAT_IDS.has(id) && !skip.has(id);
        if ((used.has(id) || skip.has(id)) && match.kind !== "artist" && !repeat) {
          const other = getWordByPhrase(m[0]);
          if (!other || other.id === id || used.has(other.id)) continue;
          kind = "word";
          id = other.id;
        }
        if (match.kind === "artist" && (skip.has(id) || used.has(id))) continue;
        if (kind !== "artist" && !repeat) used.add(id);
        if (m.index > last) nodes.push(slice.slice(last, m.index));
        nodes.push(
          kind === "concept" ? (
            <Term key={key++} id={id}>
              {m[0]}
            </Term>
          ) : kind === "word" ? (
            <Word key={key++} id={id}>
              {m[0]}
            </Word>
          ) : (
            <ArtistLink key={key++} id={id}>
              {m[0]}
            </ArtistLink>
          ),
        );
        last = m.index + m[0].length;
      }

      if (last < slice.length) nodes.push(slice.slice(last));
    };

    const links = wikiLinksIn(text);
    if (links.length === 0) {
      pushPlain(text);
    } else {
      let last = 0;
      for (const hit of links) {
        if (hit.index > last) pushPlain(text.slice(last, hit.index));
        const artistId = ARTIST_BY_PHRASE.get(hit.label.toLowerCase());
        nodes.push(
          artistId && !skip.has(artistId) ? (
            <ArtistLink key={key++} id={artistId}>
              {hit.label}
            </ArtistLink>
          ) : (
            <a
              key={key++}
              href={hit.url}
              target="_blank"
              rel="noreferrer"
              className={PROSE_LINK}
            >
              {hit.label}
            </a>
          ),
        );
        last = hit.index + hit.length;
      }
      if (last < text.length) pushPlain(text.slice(last));
    }

    if (nodes.length === 0) return text;
    return nodes;
  };
}
