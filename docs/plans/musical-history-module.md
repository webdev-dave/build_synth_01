# Plan: Musical History module

> **Phase 0 shipped (2026-09-05).** The registry, `/history` hub, a
> placeholder `/history/blues` spoke, the nav entry, sitemap wiring, and the
> "history of the blues" link on `/genres/blues` are live in the codebase.
> Everything below Phase 0 is still to build.

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

## Phase 1 — Citation components

Location: `src/components/history/`.

- [ ] **`<Citation source={id} />`** — inline superscript ref (`[1]`) linking
      to the source anchor; numbers derive from the article's `sources` order.
- [ ] **`<Blockquote>`** — styled short-quote block with attribution line and
      a `Citation`.
- [ ] **`<SourceList sources={…} />`** — the numbered "Sources & further
      reading" bibliography with outbound links and `Retrieved` dates.
- [ ] Consider `ScholarlyArticle` / `Article` JSON-LD with `citation` on the
      spoke, in addition to the existing FAQ JSON-LD.

## Phase 2 — First article: the blues (content)

- [ ] `src/content/history/blues.tsx` — prose + quotes + widgets, structured:
      1. Origins — work songs, field hollers, spirituals in the Deep South.
      2. Early forms — Delta blues, W.C. Handy, first published/recorded blues.
      3. The Great Migration — Chicago electric blues.
      4. Legacy — root of jazz, R&B, rock (ties to the genre page's line).
- [ ] Populate `sources` with real, linked, public-domain-first references.
- [ ] Flip `blues` to `status: "live"` (enters index + sitemap).
- [ ] `getArticleContent(slug)` accessor (mirror `getScaleContent`) so the
      spoke injects the body when present, keeps the placeholder when not.

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
