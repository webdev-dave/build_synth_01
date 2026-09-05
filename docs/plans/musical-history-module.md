# Plan: Musical History module

> **Phases 0–2 shipped (2026-09-05).** The registry, `/history` hub, the nav
> entry, sitemap wiring, and the "history of the blues" link on `/genres/blues`
> are live — plus the citation components and the first full article. The blues
> article (`/history/blues`) is `status: "live"` with sourced, footnoted prose.
> Phase 3 (more articles, embedded audio/widgets) is still to build.

## Overview

A third teaching sibling to **Genres** (`/genres`) and **Scales** (`/scales`).
Those modules take a sound apart to show *how* it works; **Musical History**
tells the other half — *where* it came from — as long-form, **sourced**
articles that quote original writing and recordings and link back to them.

Route: **`/history`** (hub) + **`/history/[slug]`** (spoke), mirroring the
established hub-and-spoke + registry pattern exactly (see
[genres-and-scales-modules.md](genres-and-scales-modules.md)).

## Why this fits the existing architecture

- **Same shape as genres/scales.** Typed registry is the source of truth;
  hub renders cards; spoke renders one article with FAQ JSON-LD; sitemap
  lists the hub always and `status: "live"` spokes only.
- **Cross-links are data, not prose.** A history article lists the `genres`
  and `scales` it covers; the genre spoke calls `getArticleByGenre(slug)` to
  decide whether to show its "history of …" link. No hardcoded hrefs.
- **Prose as TSX, not MDX.** Consistent with the lessons decision — static
  export + few articles means typed TSX content files are simpler and let us
  embed the same v2 widgets later. MDX can come if writing volume grows.

## What is new here: citations

The point of the module is honest sourcing, so citation is a first-class
concept, not an afterthought.

- `Source` type already exists in `src/lib/history/registry.ts`: `id`,
  `title`, `author?`, `publication?`, `year?`, `url?`, `access?`,
  `publicDomain?`.
- **Guardrails (honesty + licensing):** quote *briefly* with attribution and
  link to the original — never reproduce a whole article. Prefer public-domain
  or openly-licensed sources (Library of Congress, National Jukebox, PD texts,
  archive.org). `publicDomain: true` flags what is safe to quote at length.
  This mirrors the public-domain preference already in the MIDI-ingest rule.

## Phase 0 — Skeleton, link, placeholder (DONE 2026-09-05)

- [x] `src/lib/history/registry.ts` — `HistoryArticle` + `Source` types,
      `getArticle`, `getArticleByGenre`, `LIVE_HISTORY`; seed `blues` entry
      (`status: "soon"`, empty `sources`).
- [x] `src/app/history/page.tsx` — hub card grid (genres-hub style).
- [x] `src/app/history/[slug]/page.tsx` — spoke with `generateStaticParams`,
      FAQ JSON-LD, noindex while `soon`, cross-links back to genre + scale,
      "being written" dashed box.
- [x] `/genres/blues` link under the `about` paragraph (data-driven).
- [x] Nav entry (`history`, `inNav: false`), `appIcons` (`BookOpen`), sitemap.

## Phase 1 — Citation components (DONE 2026-09-05)

Location: `src/components/history/citations.tsx` (server components — quotes
and footnotes ship in the static HTML).

- [x] **`<Cite id sources />`** — inline superscript ref (`[n]`) linking to the
      source anchor; number derives from the source's position in `sources`.
- [x] **`<Blockquote>`** — styled short-quote block with attribution + `Cite`.
- [x] **`<SourceList sources />`** — numbered "Sources & further reading"
      bibliography with outbound links, `Public domain` tag, and access dates.
- [ ] (Later) `ScholarlyArticle` / `Article` JSON-LD with `citation` on the
      spoke, alongside the existing FAQ JSON-LD.

## Phase 2 — First article: the blues (DONE 2026-09-05)

- [x] `src/content/history/BluesHistory.tsx` — sourced, footnoted prose:
      1. Roots — work songs, field hollers, spirituals; the blue notes.
      2. A contested birthplace — Handy's Tutwiler account vs. revisionist
         scholarship (don't launder legend as fact).
      3. Published & recorded — Handy 1912/1914; Mamie Smith 1920.
      4. Great Migration & electric blues — Muddy Waters, Chicago.
      5. Legacy — root system, and blues as protest.
- [x] `sources` populated with real references, public-domain-first (Library of
      Congress essays flagged `publicDomain`).
- [x] `blues` flipped to `status: "live"` (indexed + in sitemap).
- [x] `getHistoryContent(slug)` accessor (`src/content/history/index.ts`,
      mirrors `getScaleContent`) — spoke injects the body when present, keeps
      the placeholder when not.

## Phase 3 — Grow + interactive

- [ ] More articles reusing the module (jazz, rock, klezmer/Yiddish — pairs
      with [klezmer-yiddish-dataset.md](klezmer-yiddish-dataset.md)).
- [ ] Embed the same v2 widgets genres/scales use (e.g. a period 12-bar
      groove, an audio clip of an early recording) so history also *sounds*.

## Key decisions (open to veto)

1. **`/history`, not nested under genres.** History spans more than one genre
   (and scales), so it earns a top-level module rather than
   `/genres/blues/history`. Cross-links keep it connected.
2. **Article ↔ genre link is derived from the history registry**, not a
   `historyHref` field on `Genre` — one source of truth, matches
   `scale.usedIn` ↔ `genre.scales`.
3. **Sourcing is public-domain-first**, quoted briefly and linked.

## Relevant existing files

| Purpose | Path |
|---------|------|
| History registry | `src/lib/history/registry.ts` |
| Hub / spoke routes | `src/app/history/page.tsx`, `src/app/history/[slug]/page.tsx` |
| Genre spoke (link source) | `src/app/genres/[slug]/page.tsx` |
| Pattern to mirror | `src/lib/scales/registry.ts`, `src/app/scales/[slug]/page.tsx` |
| Nav / icons / sitemap | `src/lib/navigation.ts`, `src/lib/appIcons.ts`, `src/app/sitemap.ts` |
