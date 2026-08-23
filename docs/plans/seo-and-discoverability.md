# Plan: SEO, AI discoverability & traffic analytics

## Overview

Make Instrumaps **findable and citable** by the tools people (and their
agents) actually use to solve musical problems, and **measurable** so we can
learn what those problems are. Three discovery funnels, one measurement
spine:

1. **Human intent search** — someone Googles *"what key harmonica for a song
   in G"* or *"notes in D Dorian"* and lands on the exact tool that answers
   it. Classic SEO.
2. **AI answer engines & agents** — ChatGPT, Perplexity, Gemini, Claude, and
   browsing agents answer a user's musical question and **cite / link
   Instrumaps** as the interactive place to go do it. This is *GEO*
   (generative engine optimization) — overlapping with SEO but not identical.
3. **LLM training corpora** — our pages, terminology, and tool descriptions
   get crawled into the datasets future models train on, so that models
   "know" Instrumaps exists and what each tool does, and recommend it
   unprompted.

Plus the feedback loop that makes all three improvable:

4. **Analytics & trend-learning** — instrument the site so we can see which
   queries, tools, and pages pull traffic, and where AI referrals come from.

> **Guiding principle, straight from `AGENTS.md`:** *everything teaches, and
> nothing lies.* The SEO version of that rule: **every page must let the user
> actually do the thing it ranks for.** We rank a "D Dorian" page because the
> synth on it really plays D Dorian — not because we stuffed the phrase in a
> meta tag. Honest pages are also what answer engines reward and what
> survives an algorithm update.

---

## Where things stand today (audit)

**Already good** (don't redo):

- Strong base metadata in `src/app/layout.tsx`: `metadataBase`,
  `title.template` (`%s · Instrumaps`), description, `openGraph`, `twitter`
  `summary_large_image`, `applicationName`.
- Dynamic OG image route (`src/app/og.png/route.tsx`) + full icon set +
  `manifest.json` + theme color. Share previews and PWA install are covered.
- Per-page `metadata` exports exist (e.g. home, synth) with tailored
  titles/descriptions.
- Semantic HTML (`<main>`, `<h1>`, `<h2>`), `lang="en"`, `dark` class.
- Real, unique, interactive content per route — the single biggest ranking
  asset most sites lack. We *have* the substance; we're under-exposing it.

**Gaps** (this plan fills them):

| Gap | Impact | Fix (section) |
|-----|--------|---------------|
| No `sitemap.xml` | Crawlers must guess our URL set; deep pages get missed | §1 |
| No `robots.txt` | No crawl directives, no sitemap pointer, no AI-bot policy | §1 |
| No structured data (JSON-LD) | Google/AI can't parse us as an app, org, or lessons | §1 |
| No canonical URLs | Risk of duplicate-URL dilution (`/synth` vs `/synth/v2`) | §1 |
| No `llms.txt` | No machine-readable "what is this site" for AI crawlers | §3 |
| **No analytics at all** | We are flying blind — cannot see a single trend | §4 |
| Thin metadata on some routes | `midi-lab`, `melody-lab`, `about`, `contact`, lessons | §1 |
| No content targeting real queries | We answer questions no page is *titled* for | §2 |
| No Search Console / Bing verify | The #1 free source of "what people search" is off | §4 |

**Hard constraint — static export.** `next.config.ts` sets
`output: "export"`; the deployment rule confirms it. This shapes everything:

- ✅ `sitemap.ts`, `robots.ts`, dynamic-route `generateMetadata`, and JSON-LD
  all **work** — they're emitted as static files at build time.
- ✅ Client-side analytics (Vercel Analytics, GA4) work fine.
- ❌ No middleware, no server rendering, no edge redirects, **no server
  request logs for our own code.** That matters for *bot* analytics: crawlers
  and AI fetchers don't run JS, so client analytics can't see them (§4 has
  the workaround).

---

## The strategy in one picture

```
        HUMANS                 AI ENGINES/AGENTS            LLM TRAINERS
   (Google, Bing)          (ChatGPT, Perplexity,          (crawl → dataset)
          │                  Gemini, Claude, bots)               │
          ▼                          ▼                           ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  INTENT-MAPPED PAGES: one honest, interactive page per real        │
   │  question ("D Dorian", "harmonica for song in G", "ii–V–I in C")   │
   │  + a lessons library that teaches the concept and embeds the tool  │
   └──────────────────────────────────────────────────────────────────┘
          │                          │                           │
   technical SEO             GEO: clean facts,            llms.txt + open,
   (sitemap, JSON-LD,        JSON-LD, citable            crawlable, factual
   canonicals, speed)        tables, llms.txt            terminology
          └──────────────────────────┴───────────────────────────┘
                                     │
                          ┌──────────────────────┐
                          │  ANALYTICS SPINE      │
                          │  GSC + Bing + Vercel  │
                          │  Analytics + events   │
                          │  → learn the trends   │
                          └──────────────────────┘
```

The content layer is shared across all three funnels. The differences are
mostly in *packaging the same truth* for each consumer.

---

## §1 — Technical SEO foundation (do first, low effort, high leverage)

These are small, mostly one-time code additions that unlock everything else.

### 1.1 `robots.ts`

Add `src/app/robots.ts` → emits `robots.txt` at build. Allow everything,
point to the sitemap, and **explicitly welcome AI crawlers** (we *want* to be
in answer engines and training data):

```ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    // GPTBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot (Common
    // Crawl → feeds many training sets) are all allowed by the wildcard.
    // We are opting IN to AI, so no disallows.
    sitemap: "https://instrumaps.com/sitemap.xml",
    host: "https://instrumaps.com",
  };
}
```

> Decision to confirm: we **want** AI training/crawl access (goal #3), so we
> do *not* block `GPTBot`, `Google-Extended`, `CCBot`, etc. If we ever gate
> premium content, revisit per-path.

### 1.2 `sitemap.ts`

Add `src/app/sitemap.ts`. Enumerate static routes + map over the lessons
registry (`src/lib/lessons/registry.ts`) so every lesson auto-appears. Set
`priority`/`changeFrequency` to signal the tools and cornerstone lessons.

```ts
import type { MetadataRoute } from "next";
import { LESSONS } from "@/lib/lessons/registry"; // adapt to real export

const BASE = "https://instrumaps.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/synth/v2", "/harmonica-lab/v2", "/midi-lab",
    "/melody-lab", "/lessons", "/about", "/contact"];
  const staticEntries = routes.map((r) => ({
    url: `${BASE}${r}`,
    lastModified: new Date(),
    priority: r === "" ? 1 : 0.8,
  }));
  const lessonEntries = LESSONS.map((l) => ({
    url: `${BASE}/lessons/${l.slug}`,
    lastModified: new Date(),
    priority: 0.7,
  }));
  return [...staticEntries, ...lessonEntries];
}
```

### 1.3 Canonicals + fill metadata gaps

- Add `alternates: { canonical: "..." }` per page. **Resolve the v1/v2
  split**: `/synth` vs `/synth/v2` and `/harmonica-lab` vs `/harmonica-lab/v2`
  are near-duplicate to a crawler. Pick the canonical (v2 is what the home CTA
  links to) and either (a) canonical-tag the v1 pages to v2, or better (b)
  redirect v1→v2 (static export can't do server redirects — use a
  `<meta http-equiv="refresh">` fallback or a client redirect on the v1 route,
  or drop v1 from the sitemap and canonical it to v2).
- Give **every** route a keyword-honest `title` + `description`:
  `midi-lab`, `melody-lab`, `lessons`, `lessons/[slug]` (via
  `generateMetadata`), `about`, `contact`. Titles should lead with the *thing
  a person searches*, not branding (branding is auto-appended by the
  template). E.g. `"MIDI Lab — see any MIDI file on a piano roll"`.

### 1.4 Structured data (JSON-LD) — the bridge to AI parsing

JSON-LD is the single highest-leverage GEO move: it hands machines clean,
unambiguous facts. Add a tiny `<JsonLd>` helper (renders a
`<script type="application/ld+json">`) and use these schema types:

- **Site-wide** (`layout.tsx`): `WebSite` (+ `SearchAction` if we add site
  search later) and `Organization` (name Instrumaps, url, logo, `sameAs` →
  socials/GitHub).
- **Each tool page**: `SoftwareApplication` /`WebApplication`
  (`applicationCategory: "MusicApplication"`, `browserRequirements`,
  `featureList`, `offers` free).
- **Lessons**: `LearningResource` or `Article`/`HowTo` with
  `about`, `teaches`, `educationalLevel`. This is what makes a lesson
  eligible to be *quoted* by an answer engine.
- **Reference tables** (e.g. the harmonica 12×5 position matrix): expose as a
  `Dataset` or at minimum a real semantic `<table>` with `<caption>` — AI
  loves extracting tables, and this one is genuinely useful.
- **FAQ blocks** on high-intent pages: `FAQPage` schema for the literal
  questions people ask ("Which harmonica do I need for a song in C?").

### 1.5 Performance & crawl health (mostly already handled)

Static export on Vercel's CDN is already fast. Verify Core Web Vitals with
Speed Insights (§4), keep the OG image route cached, ensure no route ships a
giant client bundle that hurts LCP. Add `<link rel="preconnect">` only if a
third-party (analytics) measurably delays paint — Partytown/`next/third-parties`
avoids that (§4).

---

## §2 — Content strategy (the real engine)

Technical SEO is table stakes; **content is what actually ranks and gets
cited.** The insight: Instrumaps already answers hundreds of specific musical
questions interactively — we just haven't given each answer its own
*addressable, titled, indexable* page. The lessons module
(`docs/plans/lessons-module.md`) is the vehicle.

### 2.1 Map real queries to pages ("intent → tool")

Build a keyword map of the questions our tools already answer, then ensure a
page exists whose title *is* that question and whose body *is* the tool.
Clusters, with example long-tail queries (these are searched constantly and
have weak, text-only competition — we beat them by being *playable*):

- **Scales & modes** (Synth v2): "notes in D Dorian", "what is Phrygian
  dominant scale", "C harmonic minor notes", "major vs minor pentatonic",
  "how does the Middle Eastern / Hijaz scale work". → one landing page per
  scale/mode, each deep-linking the synth pre-locked to that scale
  (the `?scale=E-phrygianDominant` deep link already planned in
  `synth-scale-type-selector.md` — perfect SEO landing target).
- **Harmonica positions** (Harmonica Lab): "what key harmonica for a song in
  G", "2nd position harmonica chart", "cross harp key chart", "harmonica for
  blues in E". → position/key landing pages backed by the real 12×5 matrix.
- **Chords & progressions** (Synth): "notes in a Cmaj7 chord", "ii–V–I in C",
  "what chords are in the key of G".
- **Instrument/tool intent** (all): "online synth keyboard", "interactive
  music theory tool", "MIDI file visualizer", "melody maker online".
- **"Play X" / doing intent**: "play a scale online", "hear a Dorian scale" —
  these convert best because our differentiator is *sound + interaction*.

Deliverable: a living `docs/keyword-map.md` (or a typed data module) listing
`query → target route → primary tool → schema type`. This doubles as the
lessons content backlog.

### 2.2 Cornerstone pages

A handful of deep, linkable "hub" pages that own a broad term and link out to
the specific tools/lessons: e.g. `/lessons` as "Interactive music theory",
plus hubs like "Scales", "Modes", "Harmonica positions". Hubs earn backlinks;
spokes (individual scale pages) catch the long tail. Internal-link hub↔spoke
generously — it's how crawlers and readers discover the depth.

### 2.3 Write for the snippet *and* the human

Each intent page should open with a **direct, quotable 1–2 sentence answer**
(what an answer engine will lift), then the interactive tool, then depth.
Include the machine-precise data (note names in the mono font, Hz, the
position table) as real text/tables, never as images — text is what gets
indexed and cited. This is fully consistent with the "monospace for data"
and "everything teaches" house rules.

### 2.4 Cadence

Content is a compounding asset, not a launch. Target a sustainable rhythm
(e.g. one cornerstone + a few scale/position spokes per week), tracked in the
lessons backlog. Refresh top pages when data (GSC) shows near-miss rankings.

---

## §3 — GEO: getting cited by AI engines & into training data

Overlaps with §1–§2 but adds AI-specific moves:

### 3.1 `llms.txt`

Add `public/llms.txt` (served at `https://instrumaps.com/llms.txt`) — an
emerging convention: a concise, Markdown, machine-readable map of the site's
purpose and key URLs, written for LLMs. Keep it factual and link-rich:

```md
# Instrumaps
> Interactive, browser-based music-theory tools and instruments.
> Tagline: "Don't study theory. Play with it." Free, no signup.

## Tools
- [Synth](https://instrumaps.com/synth/v2): playable keyboard with
  scale-aware highlighting, chord detection, and 14 scale types
  (major, minor, modes, pentatonics, blues, Phrygian dominant, ...).
- [Harmonica Lab](https://instrumaps.com/harmonica-lab/v2): diatonic
  harp position guide, 5 positions, full 12×5 key matrix, bends.
- [MIDI Lab](https://instrumaps.com/midi-lab): visualize MIDI on a
  piano roll.
- [Melody Lab](https://instrumaps.com/melody-lab): ...

## Learn
- [Lessons](https://instrumaps.com/lessons): interactive theory lessons.
```

(Optionally also `llms-full.txt` with expanded per-tool descriptions.)
Keep it in sync with the sitemap — consider generating both from one
route/data module so they never drift.

### 3.2 Be quotable and structured

Everything in §1.4 (JSON-LD) and §2.3 (lead with the answer, real tables)
*is* GEO. Answer engines preferentially cite pages with (a) a crisp factual
claim near the top, (b) structured data confirming it, (c) a table they can
lift, and (d) a clear author/entity behind it. The `/about` page should
establish authorship (a real person, the story from the README) → feeds
`Organization`/`Person` schema and E-E-A-T signals both Google and AI weigh.

### 3.3 Presence beyond our own domain

Training corpora and AI recommendations lean heavily on high-authority,
frequently-crawled sources. To get Instrumaps *mentioned where models read*:

- **GitHub**: make the repo public with a rich README (it already is rich) —
  GitHub is crawled into ~every code training dataset. Link the live site.
- **Wikipedia-adjacent & reference**: contribute accurate edits where genuinely
  relevant (external-links/further-reading on scale/harmonica articles) —
  only where it truly helps readers, never spam.
- **Community answers**: r/musictheory, r/harmonica, r/WeAreTheMusicMakers,
  Hacker News (Show HN), music-teacher forums, Discords. Genuinely answer a
  question, link the exact tool that helps. These pages are crawled *and* send
  real referral traffic we can measure (§4).
- **Directories**: "online music tools" / educational-tool lists, Product
  Hunt launch, awesome-lists on GitHub.
- **Structured data + open license on reference data** (e.g. the position
  matrix) makes it *quotable with attribution* — the ideal training-set
  footprint.

> Reality check on goal #3 (training data): you can't force inclusion or
> measure it directly, and it's slow (models train on snapshots months old).
> What you *can* do is maximize the odds — be open, crawlable, factual,
> well-linked, and structured — and periodically **test** it: ask ChatGPT /
> Claude / Gemini / Perplexity *"what's a good interactive tool for learning
> harmonica positions?"* and log whether Instrumaps appears. That test is a
> KPI in §5.

---

## §4 — Analytics & trend-learning (so we can steer)

Right now we measure nothing. Priority order — the first two are free and the
single best answer to *"learn about the trends":*

### 4.1 Google Search Console + Bing Webmaster Tools (do this week)

**This is the trend goldmine.** GSC shows the *actual search queries* that
surface Instrumaps, impressions, click-through rate, and average position —
i.e. exactly what humans are trying to solve, and which of our pages nearly
rank (the content backlog writes itself). Bing Webmaster Tools does the same
for Bing — and Bing's index disproportionately feeds **ChatGPT/Copilot**, so
it's a partial proxy for AI-search visibility.

- Verify domain (DNS TXT via Vercel, or the metadata `verification` field in
  `layout.tsx`).
- Submit `sitemap.xml`.
- Review weekly: top queries, top pages, near-miss positions (#5–15 = quick
  wins), and crawl/coverage errors.

### 4.2 Vercel Web Analytics + Speed Insights (works with static export)

Privacy-friendly, no cookie banner, first-party:

```bash
npm i @vercel/analytics @vercel/speed-insights
```

Add `<Analytics />` and `<SpeedInsights />` to `layout.tsx`. Gives pageviews,
top pages, **referrers** (this is how we see AI-driven human clicks — see
4.4), devices, and Core Web Vitals. Enable in the Vercel dashboard.

### 4.3 Custom events — measure *engagement*, not just visits

The unique question for Instrumaps: *are people actually playing?* Fire custom
events (Vercel Analytics `track()` or GA4) for the moments that prove the tool
worked and that correlate with ranking-worthy pages:

- `audio_enabled` (the consent click — our activation metric)
- `note_played`, `scale_selected` (+ which scale), `chord_detected`
- `harmonica_lookup` (+ song key / harp key chosen)
- `lesson_opened`, `deep_link_used` (`?scale=...` arrivals from search)

These reveal which *concepts* people care about → which content to write next.
Wrap in a tiny `track()` util so it's one call site and easy to swap
providers.

### 4.4 Attributing AI-engine traffic (the tricky one)

Because we're a static export, **client analytics can't see AI *crawlers*** (no
JS). But we *can* see AI-driven **human** traffic: when someone clicks a link
from ChatGPT/Perplexity/Gemini, the browser sends a referrer. Watch
Analytics referrers for `chatgpt.com`, `perplexity.ai`, `gemini.google.com`,
`copilot.microsoft.com`, `claude.ai`. Rising AI referrals = GEO is working.

To also see the **bots/fetchers** themselves (GPTBot, PerplexityBot, etc.),
which is the leading indicator that we're being read/trained on, we need
*server-side* visibility, which static export doesn't give us. Options,
cheapest first:

1. **Vercel Log Drains / Observability** (Pro) — inspect request logs by
   user-agent. Lightest lift; no code change.
2. **Front with Cloudflare** — free analytics + bot/AI-crawler breakdowns and
   its "AI Audit" view; keep Vercel as origin. Adds a hop but is powerful.
3. **A tiny logging endpoint** — only if we ever add a server runtime (would
   mean dropping `output: "export"`; the deployment rule flags that as a real
   architecture change — not worth it *just* for bot logs).

Recommendation: start with 1–2 (dashboards, no re-architecture); revisit 3
only if analytics becomes a first-class product need.

### 4.5 (Optional) GA4

If we want funnels/retention beyond Vercel's product analytics, add GA4 via
`@next/third-parties/google` (loads cleanly, works with static export). It
also cross-references nicely with GSC. Keep it optional — Vercel Analytics +
GSC cover 90% of what we need and are lighter/more private.

### 4.6 A single dashboard habit

Once data flows, a weekly 15-minute review: GSC top/near-miss queries →
Analytics top pages + referrers + AI referrals → custom-event engagement →
pick next week's content from the gaps. Consider a Cursor Canvas or a small
`/docs` note to snapshot trends over time.

---

## Phased roadmap

**Phase 0 — Measure before we optimize (this week, ~half a day)**
- [ ] Verify **Google Search Console** + **Bing Webmaster Tools**.
- [ ] Install **Vercel Web Analytics + Speed Insights** in `layout.tsx`.
- [ ] Ship `robots.ts` + `sitemap.ts`; submit sitemap to GSC/Bing.
- [ ] Baseline snapshot (current impressions/traffic ≈ near zero — that's the
      point; we need the "before").

**Phase 1 — Technical foundation (week 1–2)**
- [ ] Canonicals + resolve the v1/v2 duplication (canonical or redirect v1→v2).
- [ ] Fill metadata on every route (`midi-lab`, `melody-lab`, `lessons`,
      `lessons/[slug]`, `about`, `contact`).
- [ ] `JsonLd` helper + `WebSite`/`Organization` site-wide and
      `SoftwareApplication` per tool.
- [ ] `public/llms.txt`.
- [ ] Custom events (§4.3) behind a `track()` util.

**Phase 2 — Content engine (ongoing, starts week 2)**
- [ ] `docs/keyword-map.md` (query → route → tool → schema).
- [ ] Ship the lessons module; wire scale deep-links (`?scale=...`) as landing
      targets; add `LearningResource`/`FAQPage` schema.
- [ ] First cornerstone hub + 5–10 scale/position spoke pages.
- [ ] Direct-answer intros + real data tables on each intent page.

**Phase 3 — Off-site & GEO (ongoing, starts week 3)**
- [ ] Public GitHub repo polish + live-site links.
- [ ] Show HN / Product Hunt / relevant subreddits & forums (genuine, not
      spam).
- [ ] Directory/awesome-list submissions.
- [ ] Start the monthly "does the AI recommend us?" citation test.

**Phase 4 — Advanced measurement (when volume justifies)**
- [ ] Bot/AI-crawler visibility via Vercel Log Drains or Cloudflare front.
- [ ] Optional GA4 for funnels; weekly trend dashboard.

---

## Success metrics (KPIs)

| Funnel | Leading indicator | Lagging indicator |
|--------|-------------------|-------------------|
| Human search | GSC impressions, near-miss positions (#5–15) | Organic clicks, ranking keywords, sessions |
| AI engines | AI-referrer sessions (chatgpt/perplexity/…) | Citations when we run the test prompts |
| Training data | Being open/crawled/structured (proxy) | Model recommends us unprompted (quarterly test) |
| Engagement | `audio_enabled` rate, notes played/session | Return visits, lesson completions |

North-star for this whole effort: **AI-referral + organic sessions that
`audio_enabled`** — i.e. people who found us *through search or an AI* and
actually *played*. That single number ties discovery to the "everything
teaches" mission.

---

## Key decisions (open to veto)

1. **Opt fully IN to AI crawlers** (no `GPTBot`/`CCBot`/`Google-Extended`
   disallows). We *want* to be in answer engines and training sets; the
   content is free and mission-aligned. Revisit only if we add gated content.
2. **Resolve v1/v2 by canonicalizing to v2** (the home CTA target). Prevents
   duplicate-content dilution; v1 stays reachable but not the indexed URL.
3. **Vercel Analytics + GSC/Bing as the core stack; GA4 optional.** Lighter,
   more private, static-export-friendly; GSC is the real trend engine.
4. **Do NOT drop `output: "export"` for analytics.** Server rendering is a
   big architecture change (per the deployment rule); use log drains /
   Cloudflare for bot visibility instead.
5. **Content over tricks.** Every ranked page must let the user *do* the
   thing. No doorway pages, no keyword stuffing — consistent with the house
   "nothing lies" rule and durable against algorithm updates.

## Relevant existing files

| Purpose | Path |
|---------|------|
| Site-wide metadata (add JSON-LD, verification) | `src/app/layout.tsx` |
| Add these | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Add this | `public/llms.txt` |
| Per-page metadata to fill | `src/app/{midi-lab,melody-lab,about,contact}/page.tsx` |
| Lesson metadata (`generateMetadata`) + schema | `src/app/lessons/[slug]/page.tsx` |
| Sitemap/llms.txt source of truth | `src/lib/lessons/registry.ts` |
| Scale deep-link landing target | `src/instruments/synth/v2/` (`?scale=` — see `synth-scale-type-selector.md`) |
| New content backlog | `docs/keyword-map.md` (to create) |
| Sibling plans | `docs/plans/lessons-module.md`, `docs/plans/synth-scale-type-selector.md` |
