# Plan: Music History Map + Feedback/Contribution system

> **Status:** approved 2026-09-05. **Steps 1–3 shipped same day**: the klezmer
> article (`/history/klezmer` + genre/scale/concept/catalog entries), the
> `/map` page (place registry, SVG renderer, genre filter with grey-out,
> unified genre+place search with historical aliases, zoom buttons +
> drag-to-pan, coverage states), all six historical overlays, and the feedback
> footer on articles + map panels. **Step 4 (Supabase) code is fully built and
> dormant** — client, AuthProvider (Google + magic link), suggestion modal,
> `submissions` migration with RLS, keep-alive workflow. It activates when the
> two `NEXT_PUBLIC_SUPABASE_*` env vars exist; until then every CTA falls back
> to /contact. **Next: owner provisioning** — follow `supabase-setup.md`
> (Supabase project, migration, Google OAuth, env vars, GitHub secrets).
> After that: Phase 5 (admin moderation view), only when volume justifies it.

## Overview

Two connected initiatives:

- **A geographic map of music history** (`/map`): an interactive world map
  where clicking a country / state / region / city shows what we know about
  its musical history, cross-linked into `/history`, `/genres`, and the
  Piano Roll catalog. Ships first for **blues** and **klezmer**.
- **A feedback / contribution system**: every history article (and map
  region) invites corrections and additions — "written to the best of our
  knowledge, help us make it better" — gated behind a sign-in so
  contributions are attributable. Long-term this grows toward a
  wiki-style, community-sourced knowledge base with editorial control.

Also in scope for this build: the **klezmer history article**
(`/history/klezmer`), which seeds the map's Eastern-Europe place data the
same way the blues article seeds the American South.

## Part 1 — The map page (`/map`)

### Rendering: custom SVG, not tile maps

No Leaflet/MapLibre — tile maps read as "Google Maps embed," not
Instrumaps. We render our own SVG with **`d3-geo` + `topojson-client`**
and Natural Earth data (world countries + US states TopoJSON checked into
`public/geo/`). Same visual language as `HeroMap`: calm neutral strokes
(`stroke-border`), theme tokens, quiet glows for active regions, mono font
for data readouts. Static-export friendly (all client-side; geodata is
fetched from `public/`).

Zoom levels: world → country → US states (blues needs state/city
granularity; klezmer needs Eastern-Europe country granularity).

### The place registry (`src/lib/places/registry.ts`)

Typed data module, same pattern as the genre/history/scale registries.
The registry is the source of truth for what's clickable, searchable, and
covered.

```ts
interface Place {
  id: string;                    // "mississippi-delta", "bessarabia"
  kind: "country" | "state" | "region" | "city" | "historical-region";
  names: {
    canonical: string;
    aliases: { name: string; era?: string }[];  // "Kishinev (Russian-era name)"
  };
  geo: {
    iso?: string;                // country match (ISO 3166-1 a3)
    fips?: string;               // US state match
    point?: [number, number];    // [lng, lat] for cities
    overlay?: string;            // filename in public/geo/overlays/
  };
  music: {
    genres: string[];            // genre registry slugs
    historySlugs: string[];      // history registry slugs
    songLabels: string[];        // Piano Roll manifest labels ("klezmer")
    blurb: string;               // 2–4 sentence music-history summary
  };
  status: "rich" | "stub" | "planned";
}
```

### Historical names are first-class

- **Aliases** carry era context and are searchable: Kishinev → Chișinău,
  Constantinople → Istanbul, Vilna → Vilnius.
- **Historical regions with no modern equivalent** get custom GeoJSON
  overlays drawn above modern borders (`public/geo/overlays/`): the
  **Pale of Settlement**, **Bessarabia**, **Galicia** (klezmer); the
  **Mississippi Delta** and **Great Migration corridor** (blues). These
  are the shapes music history is actually about.

### Search

Client-side fuzzy search over canonical names + all aliases (hundreds of
entries; no geocoding service). Hit → fly to place, open panel. Miss →
the "not mapped yet" state below.

### Coverage honesty

Three visual states: `rich` places get a quiet warm tint + dot; `stub`
gets an outline; everything else stays neutral. Clicking or searching an
unmapped area opens the panel with a friendly "we haven't written this
region's story yet — Instrumaps is growing map by map" message and a
**Contribute** CTA (Part 3).

### Info panel

Place name + historical names (era-annotated, mono font), the music
blurb, links to `/history/[slug]` and `/genres/[slug]`, and the Piano
Roll songs carrying the place's `songLabels` (e.g. Bessarabia → the
klezmer catalog).

### Initial coverage

- **Blues:** Mississippi Delta, Memphis, New Orleans, Texas, Piedmont,
  St. Louis, Chicago, Detroit — the Great Migration told spatially.
- **Klezmer:** Pale of Settlement (overlay), Bessarabia/Moldova, Galicia,
  Ukraine (Odessa), Romania, Poland, Lithuania (Vilna), plus New York's
  Lower East Side — the immigration chapter.

## Part 2 — Klezmer history article

Follows the blues reference implementation exactly (see
`.cursor/rules/history-articles.mdc` and `musical-history-module.md`):
registry entry in `src/lib/history/registry.ts`, server-component body in
`src/content/history/KlezmerHistory.tsx`, real verified sources, `Cite`/
`Blockquote`/`SourceList`, `SongLink`s into the ~130 ingested klezmer
tunes, `Term`s for theory concepts, predecessors section, catalog entries
for named artists/songs.

Rough arc: Ashkenazi Eastern Europe origins (kley-zemer, wedding
repertoire, the badkhn) → the Pale of Settlement and regional styles →
modes (freygish / Ahava Rabbah — future scale cross-link) → immigration to
America, Naftule Brandwein & Dave Tarras, the 78rpm era → mid-century
decline → the 1970s revival.

Every geographic name in the article becomes a place in the map registry;
article and map cross-link both ways.

Related plan: `klezmer-yiddish-dataset.md` (the corpus). This article is
the prose front door to that repertoire.

## Part 3 — Feedback & contributions (Supabase)

### Why Supabase

- **Keeps the static export.** Auth + DB calls happen client-side via
  `@supabase/supabase-js`; row-level security is the enforcement layer.
  No server, no change to `output: "export"` or the Vercel deploy model.
  (This supersedes the older assumption in
  `docs/sketches/hosting-and-auth-direction.md` that auth forces dropping
  static export — Auth.js would; Supabase doesn't.)
- **One backend vendor for the long term.** Postgres + auth + file
  storage + realtime under one roof; the stack stays Vercel + Supabase.
  Because it's plain Postgres, leaving is `pg_dump` — choosing Supabase
  is really choosing Postgres.
- **Cost: $0** on the free tier (verified 2026-09-05: 50k MAU auth,
  500 MB DB, unlimited API requests, 5 GB egress). Pro is $25/mo if ever
  needed (8 GB DB base, 100 GB storage, 250 GB egress). Long-term cost
  lever is egress — synthesis-over-samples is also the cheap-bandwidth
  strategy.
- **Free-tier catch:** projects pause after 7 days without DB activity
  (~30 s wake). Fix: a GitHub Actions cron pings a trivial query weekly.

### Auth

- **Google SSO + email magic link.** No passwords. Enabled in the
  Supabase dashboard; Google needs a one-time OAuth client in Google
  Cloud console (client ID/secret pasted into Supabase).
- Auth exists **only to gate contributions** — browsing, playing, and
  reading never require an account.
- Nicety, later: custom auth domain (`auth.instrumaps.com`) so Google's
  consent screen shows our name instead of `*.supabase.co` (paid tier).

### The universal submissions table

One table, anchored to any content type, so it serves history articles,
map places, songs, artists, and future pages without redesign:

```
submissions:
  id, user_id,
  target_type   history | place | song | artist | genre
  target_id     slug
  kind          correction | addition | source | general
  body, sources[],
  status        new | in-review | accepted | declined | merged
  editor_note, created_at
```

RLS: signed-in users may insert rows with their own `user_id`; users read
only their own rows; only the service role (you) reads/updates everything.

### UX

- Consistent humble footer on every history article + map panel:
  *"Written to the best of our knowledge — corrections and additions
  welcome."* → **Suggest an improvement** → sign-in modal (Google / magic
  link) → short form pre-filled with the current target.
- Unmapped map regions reuse the same flow with `kind: "addition"`.
- **Stopgap until Supabase lands:** the CTA links to the contact page /
  a hosted form, so the map ships without waiting on auth.

### Moderation

Supabase dashboard at first; later a tiny private `/admin` page (list new
submissions, accept/decline). Accepted feedback is folded into the
git-based content by hand — **git stays the source of truth**, which *is*
the editorial control.

## Part 4 — Long-term: the road to wiki-style

Three stages; each is a working product, and stage N's data survives into
stage N+1:

1. **Curated + suggestion box** (this build). Content in git, feedback in
   Supabase, merged by hand.
2. **Structured contributions.** Forms match the data schema ("add a
   place", "correct a date: old → new + source", "tag a song's origin"),
   so accepted items merge into the registries semi-mechanically.
   Contributors get credited on the page. Prerequisite worth doing
   anyway: migrate article prose from TSX toward structured data + MDX so
   content is data, not code.
3. **True wiki mode** (only if the community materializes). Content moves
   into the DB with revision history, trusted-editor roles, public edit
   proposals — with us as steward. The stage-1 schema anticipates this
   (target-anchored submissions ≈ proto-revisions).

## Build order

1. **Klezmer history article** — pure content, immediate value, seeds the
   map's place data.
2. **`/map` page** — deps (`d3-geo`, `topojson-client`), geodata in
   `public/geo/`, place registry, SVG renderer + panel + coverage states,
   search, nav entry, blues + klezmer coverage. Contribute CTA as
   stopgap link.
3. **Historical overlays** — Pale of Settlement, Mississippi Delta,
   Great Migration corridor.
4. **Supabase** — project setup (**needs user**: Supabase account, Google
   Cloud OAuth client), `submissions` table + RLS, sign-in modal,
   "suggest an improvement" flow on history articles + map panels,
   keep-alive cron.
5. **Admin moderation view.**

## What the user (owner) must do, when we get to Phase 4

- Create the Supabase account + project; share the project URL + anon key
  (public by design — RLS is the security layer).
- Create the Google Cloud OAuth client (free); paste ID/secret into the
  Supabase dashboard; register Supabase's redirect URL back in Google.

## Relevant existing files

| Purpose | Path |
|---------|------|
| History article pattern (reference impl) | `src/content/history/BluesHistory.tsx`, `src/lib/history/registry.ts` |
| Article authoring rules | `.cursor/rules/history-articles.mdc` |
| Citations / SongLink / Term | `src/components/history/`, `src/components/concepts/` |
| Editorial catalog (artists/songs) | `src/lib/catalog/` |
| Piano Roll manifest + labels | `src/lib/songs/manifest.json`, `public/catalog/` |
| Map visual language precedent | `src/components/home/HeroMap.tsx` |
| Nav registration | `src/lib/navigation.ts` |
| Klezmer corpus plan (sibling) | `docs/plans/klezmer-yiddish-dataset.md` |
| Superseded auth assumption | `docs/sketches/hosting-and-auth-direction.md` |
| To create | `src/app/map/`, `src/components/map/`, `src/lib/places/`, `public/geo/`, `src/content/history/KlezmerHistory.tsx` |
