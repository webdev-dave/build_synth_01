# ToDo — Embedded Map (per-page map instances)

Plan for dropping a small, region-filtered instance of the music-history map at
the bottom of content pages (genres, artists, history, languages, concepts,
songs). Each embed shows **only the places relevant to that page**, auto-frames
them, and links out to the full `/map`. Site-wide ranking stays in
[ToDo.md](ToDo.md).

**Decisions locked (2026-09-05):**

- **Resolution:** derive relevant places from an entity's `genres` / `history`
  (+ `songLabels` for songs). An optional `places?: string[]` on a registry
  entry **replaces** derivation for that entity — pins are for precision
  (a Delta-bluesman page pinned to `mississippi-delta` + `chicago` must not
  also inherit all of blues geography, West Africa included).
- **Interactivity:** *light teaser* — auto-fit camera, zoom buttons,
  click/tap a place shows its name + an "Open on full map" link. **No**
  embedded reading panel; deep reading stays on `/map`. **No touch panning**
  in embeds (see risk #1).
- **Rollout:** ship **genres** end-to-end first, then reuse the pieces for the
  other page types.

---

## Why this is small

The map is already decoupled: `MusicMap` (`src/components/map/MusicMap.tsx`) is
a self-contained d3-geo SVG that fetches geometry on mount and already accepts
`selectedId` + `genreFilter`. Its `isFocused()` is the single chokepoint for
"which places are tinted." `PLACES` (`src/lib/places/registry.ts`) binds
geometry to content via `music.genres` / `music.history` / `music.songLabels`,
so the reverse lookups the embeds need are one-line filters — consistent with
the house rule that cross-links are data walked in both directions.

The real gaps: **(a)** resolve "relevant places" for an arbitrary entity,
**(b)** filter `MusicMap` by a place *set* (not just a genre), auto-fit the
camera, and shed the full-page chrome, **(c)** make the embed safe inside a
scrolling page on touch devices.

---

## Phase 0 — Place resolver (data layer)

`src/lib/places/registry.ts`

- [ ] `placesByHistory(slug)` — mirror of the existing `placesByGenre`.
- [ ] `placesForEntity({ genres?, history?, songLabels?, places? }): Place[]`
      — if `places` is present, resolve exactly those ids (registry order);
      otherwise union the derivations, de-dupe, stable order (registry order —
      it's already curated: overlays → countries → states → cities).
- [ ] Optional `places?: string[]` field on entity registries as needed
      (Artist first). Semantics: **replaces** derivation for that entity.

Per-entity resolution (derivation defaults):

| Entity | Resolves via |
|---|---|
| Genre | `placesByGenre(slug)` |
| History | `placesByHistory(slug)` |
| Artist | `genres` + `history` — expect most artists to want a `places` pin |
| Language | `languageGenres()` → genres |
| Concept | `genres` + `history` |
| Song (catalog / piano-roll) | `genres` + `history` + `songLabels` |

## Phase 1 — Generalize `MusicMap`

`src/components/map/MusicMap.tsx` (additive; `/map` behavior unchanged)

- [ ] `placeFilter?: string[] | null` — fold `genreFilter` **or** `placeFilter`
      into one internal `focusSet: Set<string>` consulted by `isFocused()`.
      Keep the existing courtesy: a `selectedId` outside the lens stays lit.
- [ ] `fitToFocus?: boolean` — after geometry loads, union the bounds of all
      focused places (countries / states / overlays via `path.bounds`, a padded
      box around city `point`s) → existing `zoomToBounds`.
      **Sequencing trap:** the current `useEffect` on `[genreFilter]` resets to
      `WORLD_VIEW`; the fit must run *after* geometry load and not be clobbered
      by that reset (gate the reset when `fitToFocus`, or fit inside the load
      path). Re-fit if `placeFilter` changes.
- [ ] `compact?: boolean` — embed chrome: hide the reset button (auto-fit *is*
      home), keep +/−.
- [ ] **Touch-scroll safety (embed only):** the SVG currently sets `touch-none`
      and drag-pans on any pointer. Inside a scrolling page that traps
      single-finger scrolling. In compact mode: no drag-pan for `pointerType
      === "touch"` (tap still selects), drop `touch-none` so the page scrolls,
      keep mouse drag-pan. Zoom buttons remain the touch zoom path.
- [ ] Make `onSelect` optional.

## Phase 2 — `EmbeddedMap` component

`src/components/map/EmbeddedMap.tsx` (new, client)

- [ ] Props `{ placeIds: string[]; heading?: string; fullMapHref: string }`.
- [ ] Renders `MusicMap` with `placeFilter` + `fitToFocus` + `compact`.
- [ ] Mono caption of the relevant places; chips select/zoom within the embed.
- [ ] Selecting a place shows name + blurb-free "Read on the full map →" link
      (`/map?place=<id>`); the section header carries the entity-level
      "Open in full map →" (`fullMapHref`).
- [ ] **Perf:**
      - Module-level promise cache for `/geo/*.json` (world + states +
        overlays fetched once per session, shared across mounts). Do this in
        a small `src/components/map/geoData.ts` used by `MusicMap` so `/map`
        benefits too.
      - Lazy mount via `IntersectionObserver` **inside** `EmbeddedMap`
        (render a fixed-height placeholder until near-viewport). Note:
        `next/dynamic({ ssr: false })` can't be used from server components
        in Next 15 — the gate must live in the client component itself.

## Phase 3 — Deep-linkable `/map` (v1: two params only)

`src/components/map/MapExplorer.tsx` + `src/app/map/page.tsx`

- [ ] `?genre=<slug>` → pre-set the genre lens. `?place=<id>` → pre-select +
      zoom one place. Read once on mount via `useSearchParams`.
- [ ] **No `?places=` in v1** — the full map has no UI to represent (or clear)
      an arbitrary place-set lens; don't ship invisible state. Genre pages link
      `?genre=`; other embeds link the plain `/map` at section level and
      `?place=` per clicked place. Revisit `?places=` only if a real need
      appears.
- [ ] Static-export note (`output: "export"`): `useSearchParams` requires a
      `<Suspense>` boundary around the client component — wrap `MapExplorer`
      in the page. Query strings work fine on static hosting client-side.

## Phase 4 — Page wiring (genres first)

- [ ] Server `PageMapSection` (`src/components/map/PageMapSection.tsx`):
      takes resolved `Place[]` (or the entity fields), renders heading +
      `EmbeddedMap` **only when ≥1 place resolves** — render nothing otherwise
      (honesty rule: no empty globe implying coverage we don't have).
- [ ] `src/app/genres/[slug]/page.tsx`: resolver runs server-side, section goes
      after `<RelatedPages>`. Heading e.g. "Where the blues lives" / "Where
      klezmer lives"; link "Open in full map →" → `/map?genre=<slug>`.
      Skip rendering for `status: "soon"` genres with no mapped places
      (today only blues + klezmer resolve places at all).
- [ ] Then reuse in: `history/[slug]`, `artists/[slug]`, `languages/[slug]`,
      `concepts/[slug]`, `piano-roll/[slug]` — each is a resolver call + the
      section drop-in (plus `places?` pins where derivation is too broad,
      especially artists).

## Phase 5 — Backfill & polish

- [ ] Add `places?` pins to artists whose prose names specific cities
      (Muddy Waters → delta/Mississippi/Chicago; Dave Tarras → Ukraine/New
      York; W. C. Handy → Memphis/St. Louis; etc.).
- [ ] Consider swapping `HomeMapTeaser` internals for `EmbeddedMap` later
      (optional; teaser is static-by-design, don't force it).
- [ ] Reduced-motion: fit jumps instead of animating (the 900ms transform
      transition already respects `useReducedMotion` — verify the initial fit
      path does too).
- [ ] `npx tsc --noEmit`; lint touched files; eyeball a genre page desktop +
      mobile (scroll past the embed on touch!), compact + reduced-motion.

---

## Risks / traps (found reading the code — don't skip)

1. **Touch-scroll trap.** `MusicMap`'s SVG sets `touch-none` and drag-pans all
   pointers. Embedded mid-page, that hijacks single-finger scrolling on mobile.
   Compact mode must not capture touch pans (Phase 1). This is the one change
   most likely to be forgotten and the worst to ship broken.
2. **Camera-reset effect.** The `[genreFilter]` effect resets to `WORLD_VIEW`
   on mount; naive `fitToFocus` gets overwritten. Sequence the fit after
   geometry load and gate the reset in embed mode.
3. **Per-embed geo re-fetch.** Three JSON fetches per mount (world topology is
   the big one) — the shared promise cache + lazy mount in Phase 2 are not
   optional if embeds land on every content page.
4. **`ssr: false` from server components** is not allowed in Next 15 App
   Router; the lazy gate lives inside the client `EmbeddedMap`.
5. **Invisible lens state.** Don't add `?places=` deep links until the full map
   can display and clear that lens; v1 is `?genre=` + `?place=` only.
6. **Honesty.** Auto-fit + "render nothing when empty" keep an embed from
   showing a random globe. Only blues + klezmer have mapped places today —
   most concept/language/artist pages will correctly render no map until the
   registry grows.
