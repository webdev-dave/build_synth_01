# Plan: Harmonica Key Finder — SEO & LLM Ranking

## Overview

Adopt an **instrument-first, hub-and-spoke** structure. Everything harmonica
lives under `/harmonica`, with a hub page and focused spokes:

0. **Harmonica hub** — `/harmonica` (new, landing): a short topical landing that
   ranks for the broad *"harmonica"* / *"harmonica theory"* terms and links out
   to every spoke. Hub-and-spoke is what gives Google + LLMs *topical authority*
   — a `/tools/...` grouping can't, because it mixes instruments.
1. **Harmonica Key Finder** — `/harmonica/key-finder` (new, SEO landing): a
   focused, fast, crawlable tool that answers the money question — *"I'm playing
   a song in key X, which harp and position do I use?"* (and the reverse: *"I
   have a C harp, what can I play?"*). Ranks for *"what key harmonica for …"*.
   Holds the interactive **key/harp picker** + **position results** + an embedded
   teaser of the cross harp chart.
2. **Cross Harp Chart** — `/harmonica/cross-harp-chart` (new, SEO landing): the
   **full-screen key map** — 12 harp keys × 5 positions (today's "Full Matrix").
   Standalone page targeting the high-intent query *"cross harp chart"*, a strong
   featured-snippet / LLM-lift candidate on its own.
3. **Harmonica Lab** — `/harmonica/lab` (the existing lab, migrated from
   `/harmonica-lab`): stays the rich playground — bend diagrams, blues-scale
   theory, piano theory, the algorithm explainer, all the charts and graphs. The
   hub and both tools **link into it** for people who want to go deeper.

Rationale: a ranking page should be *narrow, fast, and answer-shaped*; the lab
is broad and interactive (great for engagement, weak for a crawler / answer
engine). The hub gives the whole cluster a rankable front door and an
internal-link magnet; the spokes each own one high-intent query.

> **Migration note (static export):** moving the lab `/harmonica-lab →
> /harmonica/lab` can't use Next's `redirects()` (unsupported under
> `output: "export"`). Add a **`vercel.json` redirect** (308) from the old path
> so existing links / SEO don't die. Low cost while it's still beta.

> **Terminology honesty (per `AGENTS.md`):** "cross harp" strictly means **2nd
> position**, but the chart shows all 5 positions. Use the heading **"Cross Harp
> Chart"** (the phrase people search) with an accurate subtitle — e.g. *"every
> harp key × all 5 positions"* — so the term earns its SEO value without
> misleading a player who knows it.

**Sketch first — don't build yet.** This doc is the spec.

---

## Naming (industry-standard, extensible to other instruments)

We want a name that (a) matches what harp players actually search, and (b)
generalizes so the same pattern can cover other instruments later (guitar capo
charts, transposing instruments, etc.).

**Recommended pattern: "\<Instrument\> Key Finder"** as the product name, with
harmonica-native vocabulary (cross harp, positions, key chart) woven through the
copy and FAQ for SEO.

| Option | Matches search intent | Generalizes to other instruments | Notes |
|--------|----------------------|----------------------------------|-------|
| **Harmonica Key Finder** *(recommended)* | Strong — "what key harmonica" | Yes — "Guitar Key Finder", "Sax Key Finder" | Clear verb-y intent; pairs with an umbrella "Key Finder" |
| **Cross Harp Chart / Calculator** | Very strong for harp players | No — "cross harp" is harmonica-only (and only = 2nd position) | Great secondary keyword, poor umbrella |
| **Harmonica Position Finder / Position Chart** | Strong — "positions" is the industry term | Partial — "position" reads instrument-specific | Good `<h2>` / secondary term |
| **Harp Key & Position Finder** | Strong, descriptive | Awkward as an umbrella | Good page subtitle, clunky product name |
| **Transposer / Key Transposer** | Different intent (moving a chart between keys) | Yes | Not what this tool does; skip |

**Confirmed names + routes (instrument-first):**

- Hub → **Harmonica** at **`/harmonica`**
- Interactive picker → **Harmonica Key Finder** at **`/harmonica/key-finder`**
- Full key map → **Cross Harp Chart** at **`/harmonica/cross-harp-chart`**
- Full lab → **Harmonica Lab** at **`/harmonica/lab`** (migrated from `/harmonica-lab`)
- Umbrella concept **"Key Finder"** (extensible: future `/guitar/key-finder`, etc.)
- Top secondary keywords woven through copy + FAQ + JSON-LD: **"cross harp
  chart"**, **"harmonica position chart"**, **"what key harmonica"**.

Spokes sit **directly** under `/harmonica/` (no extra `/tools/` segment) — the
URLs stay short and keyword-clean, and the instrument path already scopes them.

---

## Information architecture

```
/harmonica                   ← NEW hub. Ranks broad "harmonica" terms; links every spoke.
   • Short topical intro + what each tool does
   • Cards → key-finder, cross-harp-chart, lab
   • Canonical front door of the cluster

/harmonica/key-finder        ← NEW. Ranks "what harp/position for key X". Self-canonical.
   • Key/harp picker (song-key ↔ harp-key toggle)   [reuse KeySelector, ModeToggle]
   • Position results ("use a __ harp in __ position") [reuse PositionCardList / SelectionSummary]
   • Embedded cross-harp-chart TEASER (trimmed)      [reuse PositionMatrix, canonical → chart page]
   • Always-rendered intro + "Common questions" Q&A  [new crawlable text]
   • Prominent links → /harmonica/cross-harp-chart and → /harmonica/lab

/harmonica/cross-harp-chart  ← NEW. Ranks "cross harp chart". Self-canonical for that query.
   • Full-screen key map: 12 harps × 5 positions     [reuse PositionMatrix]
   • Accurate subtitle ("all 5 positions"), print/PDF, real <table>
   • Intro + chart-specific FAQ ("how to read a cross harp chart")
   • Links → /harmonica/key-finder and → /harmonica/lab

/harmonica/lab               ← EXISTING lab, migrated from /harmonica-lab. Deep dive.
   • Everything it has today (diagrams, theory, algorithm, bends, matrix)
   • Links up to the hub + both tools
   • Keeps its own canonical for lab-specific content
   • /harmonica-lab → /harmonica/lab via vercel.json 308 redirect

/harmonica/lab/v2 (or keep /harmonica-lab/v2) ← beta redesign. noindex; canonical → key-finder.
```

**Canonical map (avoid self-cannibalization — the chart appears in 3 places):**
the standalone `/harmonica/cross-harp-chart` is canonical for "cross harp
chart"; the teaser embedded in the key-finder and the matrix inside the lab both
point their chart canonical at that page, so the three don't compete.

The existing engine (`src/lib/harmonica/`, `calculateAllPositions`, `POSITIONS`,
`PositionMatrix`) is shared across all spokes — **no theory logic gets
rewritten**, components get reused across the routes.

---

## Current state (audited)

| Area | Status |
|------|--------|
| Live URLs | `/harmonica-lab` (classic) + `/harmonica-lab/v2` (beta). No key-finder page yet. |
| Hosting | Static export (`output: "export"`) on Vercel — see `docs/sketches/hosting-and-auth-direction.md` |
| Reusable pieces | `KeySelector`, `ModeToggle`, `SelectionSummary`, `PositionCardList`, `PositionMatrix` (the key map) all exist in `src/components/harmonica/` |
| Title / description | Present via `src/app/harmonica-lab/layout.tsx` + v2 page. Decent. |
| `metadataBase` | **Missing** (root `layout.tsx`) — OG/canonical can't resolve absolutely |
| Open Graph / Twitter cards | **Missing everywhere** — no share/preview image |
| Canonical / `alternates` | **Missing** — classic + v2 compete for the same queries |
| `sitemap.xml` / `robots.txt` | **Missing** |
| Structured data (JSON-LD) | **Missing** |
| Crawlable body text | **Thin.** Classic page is a client component; theory is inside collapsibles. Sparse Q&A text. |

### Constraints to respect

- **Static export**: no SSR, no runtime headers, no API routes. Next's
  file-based `app/sitemap.ts` and `app/robots.ts` run at build and emit static
  files — use those, not middleware.
- Metadata must be set in a **server component**. Each new `/harmonica/*` page
  should keep its interactive parts in a child `"use client"` component so the
  route file itself can export `metadata` (mirror how `harmonica-lab/layout.tsx`
  holds metadata for the client tool).
- **Redirects aren't supported under `output: "export"`** — the
  `/harmonica-lab → /harmonica/lab` move needs a `vercel.json` `redirects` entry
  (308), not `next.config` `redirects()`.
- Design/voice per `AGENTS.md`: new copy stays calm, precise, musical. Use
  keywords because they're the true words for the concept, not stuffing.
- Deploy is deliberate/manual; `main` is locked (`.cursor/rules/deployment.mdc`).

---

## Decisions (propose — veto before build)

1. **Instrument-first hub-and-spoke.** `/harmonica` is the cluster hub; spokes
   sit directly under it (`/harmonica/key-finder`, `/harmonica/cross-harp-chart`,
   `/harmonica/lab`). Scales to `/guitar`, `/accordion`, … with the same shape.
2. **One canonical per query.** `/harmonica/key-finder` owns picker/intent
   queries; `/harmonica/cross-harp-chart` owns the chart query. The lab's
   embedded matrix and the finder's teaser point their chart canonical at the
   chart page; the lab keeps its own canonical for deep content.
3. **Reuse, don't fork.** All spokes are thin, SEO-tuned compositions of existing
   harmonica components + new crawlable text. No new theory logic.
4. **Names confirmed:** "Harmonica Key Finder" (picker) and "Cross Harp Chart"
   (map), umbrella "Key Finder"; "harmonica position chart" / "what key
   harmonica" as further secondary keywords.
5. **Structured data = `SoftwareApplication` + `FAQPage`** on the spokes, with
   page-specific FAQs. The FAQ is the biggest LLM-citation lever.
6. **v2 gets `robots: { index: false }`** while it's beta so it can't outrank
   the tools or the lab.
7. **Migrate the lab to `/harmonica/lab`** with a `vercel.json` 308 redirect from
   `/harmonica-lab`.

---

## Phase 0 — Keyword & question research (no code)

- [ ] Pull real phrasing (Google autocomplete, "People also ask", r/harmonica,
      harmonica forums, YouTube titles). Confirm "cross harp chart",
      "harmonica key chart", "harmonica position chart", "what key harmonica
      for a song in \<key\>".
- [ ] Write the actual questions + 1–2 sentence answers, split by page: intent
      Q&A for the Key Finder, chart-reading Q&A for the Cross Harp Chart. Feeds
      on-page Q&A (Phase 3) and `FAQPage` JSON-LD (Phase 4).
- [ ] Names + routes locked (instrument-first): hub `/harmonica`, Harmonica Key
      Finder `/harmonica/key-finder`, Cross Harp Chart `/harmonica/cross-harp-chart`,
      lab `/harmonica/lab`.

## Phase 1 — Technical SEO foundation (site-wide)

- [ ] `metadataBase: new URL("https://instrumaps.com")` in root `layout.tsx`.
- [ ] Site-wide default Open Graph + Twitter card (title, description,
      `og:image`, `summary_large_image`).
- [ ] `src/app/sitemap.ts` — real public routes incl. `/harmonica`,
      `/harmonica/key-finder`, `/harmonica/cross-harp-chart`, `/harmonica/lab`;
      exclude dev tools (`/melody-lab`, `/midi-lab`).
- [ ] `src/app/robots.ts` — allow crawling, link the sitemap, disallow dev tools.
- [ ] Verify these emit static files under `output: "export"`.

## Phase 2 — Hub + Key Finder page

- [ ] Hub `src/app/harmonica/page.tsx` (server component, full `metadata`): short
      topical intro + cards linking every spoke. Self-canonical front door.
- [ ] Key Finder `src/app/harmonica/key-finder/page.tsx` (server component with
      full `metadata`: title, description, `openGraph`, self-canonical) rendering
      a client child for the interactive parts.
- [ ] Compose from existing components: `ModeToggle` (song-key ↔ harp-key),
      `KeySelector`, `SelectionSummary`, `PositionCardList`. Include a **trimmed
      teaser** of the chart with a "See the full Cross Harp Chart" link (teaser's
      chart canonical → the chart page).
- [ ] Prominent links to `/harmonica/cross-harp-chart` and `/harmonica/lab`.
- [ ] Keep it fast: first impression for search traffic.

## Phase 2b — Cross Harp Chart page

- [ ] New route `src/app/harmonica/cross-harp-chart/page.tsx` (server component,
      full `metadata`, self-canonical for "cross harp chart").
- [ ] Reuse `PositionMatrix` full-screen; keep the real `<table>`, the
      relative-keys toggle, and print/PDF. Add an accurate caption/subtitle
      ("all 5 positions", not just cross/2nd).
- [ ] Short intro + a chart-specific FAQ ("how do I read a cross harp chart?",
      "what is 2nd position / cross harp?").
- [ ] Links to `/harmonica/key-finder` and `/harmonica/lab`.

## Phase 2c — Migrate the lab to `/harmonica/lab`

- [ ] Move `src/app/harmonica-lab/**` → `src/app/harmonica/lab/**` (page,
      layout, v2). Update internal links/imports.
- [ ] Add a `vercel.json` `redirects` entry: `/harmonica-lab` → `/harmonica/lab`
      (308), plus `/harmonica-lab/v2` → `/harmonica/lab/v2`.
- [ ] Update `NAV_ITEMS` / any `/harmonica-lab` references in the codebase.

## Phase 3 — Crawlable, answer-shaped content (both tools)

Biggest win for both Google and LLMs: make the answers exist as text.

- [ ] **Key Finder** intro (2–3 short paragraphs): what positions are, why harp
      key ≠ song key, what the finder does. Product voice, not keyword soup.
- [ ] **Key Finder** "Common questions" (intent Q&A): short `<h2>`/`<h3>`
      question headings + 1–2 sentence answers. This is what answer engines lift.
- [ ] **Cross Harp Chart** intro + "how to read it" copy; the chart renders as a
      real HTML `<table>` (already true in `PositionMatrix`) with a `<caption>`
      like *"Cross harp chart: every harp key × position → the key it plays in
      (all 5 positions)."* Strong featured-snippet + LLM-lift candidate.
- [ ] Semantic, descriptive headings across both (positions, cross harp, bends,
      blues scale).

## Phase 4 — Structured data (JSON-LD, both tools)

- [ ] `SoftwareApplication` / `WebApplication` on each tool: name, description,
      `applicationCategory`, `url`, `isAccessibleForFree`.
- [ ] `FAQPage` per page from its Phase 0/3 Q&A. On-page text and JSON-LD answers
      must match (Google parity requirement).
- [ ] `BreadcrumbList` (Home → Harmonica → \<spoke\>).
- [ ] Inject via `<script type="application/ld+json">` from the server component.

## Phase 5 — Wire the lab into the cluster

- [ ] Lab layout (now `src/app/harmonica/lab/layout.tsx`): add `openGraph`; point
      the embedded matrix's chart canonical at `/harmonica/cross-harp-chart` and
      add visible links up to the hub + both tools (keep the lab indexable for
      its own deep content).
- [ ] Lab v2 page: `robots: { index: false }` + `alternates.canonical` → the
      key-finder while beta.

## Phase 6 — Off-page & measurement

- [ ] Google Search Console + Bing Webmaster Tools; submit the sitemap.
- [ ] Internal links from Home / Lessons / Synth to both tools with
      descriptive anchor text.
- [ ] A few honest external mentions (existing LinkedIn post, genuinely helpful
      forum/Reddit answers that link back). No spam.
- [ ] Validate with Google Rich Results Test; re-check what AI Overviews /
      Perplexity say for the target questions and iterate the FAQ wording.

---

## What moves the needle most (if doing only three things)

1. **Phase 2 + 2b + Phase 3** — a focused finder + a standalone cross-harp-chart
   page with crawlable Q&A gives Google and LLMs clean things to rank and lift.
2. **Phase 4 `FAQPage` JSON-LD** — turns that Q&A into citable, snippet-eligible
   structured data.
3. **Phase 1 + Phase 5** — sitemap/robots/metadataBase + canonical so crawlers
   find the cluster and the lab/v2 stop cannibalizing the spokes.

## Future long-tail play (out of scope now)

- **Programmatic per-key pages** — `/harmonica/key-finder/song-in-g`,
  `/harmonica/key-finder/c-harp`, one static page per key/harp, each with its
  own title/FAQ/canonical. Very strong for long-tail ("harmonica for a song in
  G") once the main spokes rank. Static export makes these cheap to generate
  with `generateStaticParams`.
- **Other instruments** as sibling clusters (`/guitar`, `/accordion`, …) under
  the "Key Finder" umbrella — reuses the hub-and-spoke pattern, not this
  specific engine.

## Also out of scope

- Rebuilding the lab or leaving static export.
- Paid search / ads.
- Blog/lesson content marketing — overlaps `docs/plans/lessons-module.md`;
  cross-link rather than duplicate.

## Decisions (confirmed with user)

| Decision | Resolution |
|----------|-----------|
| App structure | **Instrument-first hub-and-spoke** — everything under `/harmonica` |
| Hub | **Harmonica** at **`/harmonica`** |
| Picker name + route | **Harmonica Key Finder** at **`/harmonica/key-finder`** |
| Chart name + route | **Cross Harp Chart** at **`/harmonica/cross-harp-chart`** (own page for extra SEO) |
| Lab | **Harmonica Lab** at **`/harmonica/lab`** (migrated; `vercel.json` 308 from `/harmonica-lab`) |
| Canonical — intent/picker queries | the Key Finder |
| Canonical — "cross harp chart" query | the Cross Harp Chart page (finder teaser + lab matrix point here) |
| Umbrella concept | "Key Finder", clusters per instrument (`/guitar`, …) |
| v2 while beta | **noindex**, canonical → key-finder |

Still open (fine to default): the accurate chart subtitle wording; whether the
finder embeds a trimmed chart teaser vs. only a link; and whether to migrate the
lab now or keep it at `/harmonica-lab` until the tools ship (migration is
cleaner but adds the redirect step).

## Relevant existing files

| Purpose | Path |
|---------|------|
| Root metadata (`metadataBase`, OG default) | `src/app/layout.tsx` |
| Reusable key picker / results / key map | `src/components/harmonica/KeySelector.tsx`, `ModeToggle.tsx`, `SelectionSummary.tsx`, `PositionCardList.tsx`, `PositionMatrix.tsx` |
| Harmonica engine (shared, don't rewrite) | `src/lib/harmonica/` (`calculateAllPositions`, `POSITIONS`, `posLabel`) |
| Existing lab metadata (server) | `src/app/harmonica-lab/layout.tsx` |
| Existing lab tool (client) | `src/app/harmonica-lab/page.tsx` |
| New routes (to create) | `src/app/harmonica/page.tsx` (hub), `src/app/harmonica/key-finder/`, `src/app/harmonica/cross-harp-chart/` |
| Lab (to migrate) | `src/app/harmonica-lab/**` → `src/app/harmonica/lab/**` (+ `vercel.json` redirect) |
| v2 (canonical/noindex) | `src/app/harmonica-lab/v2/page.tsx` → `src/app/harmonica/lab/v2/page.tsx` |
| Redirect config | `vercel.json` (`redirects`) — static export can't use `next.config` redirects |
| Dev-tool noindex precedent | `src/app/melody-lab/page.tsx`, `src/app/midi-lab/page.tsx` |
| Static-export / deploy constraints | `docs/sketches/hosting-and-auth-direction.md`, `.cursor/rules/deployment.mdc` |
