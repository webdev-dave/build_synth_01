# Plan: Genres + Scales modules — structure & SEO

Two sibling teaching modules, hub-and-spoke like `/harmonica`:

```
/genres                  ← hub. "What makes a genre itself" + layer legend + cards.
/genres/blues            ← first genre page. "What is the blues?"  (LIVE)
/genres/rock             ← foil for blues (soon)
/genres/reggae           ← rhythm-defined genre (soon)
/genres/[slug]           ← generateStaticParams from src/lib/genres/registry.ts

/scales                  ← hub. "How scales and modes are built" + cards.
/scales/blues-scale      ← first scale deep dive. "What is the blues scale?" (LIVE)
/scales/major-scale      ← (soon)
/scales/minor-pentatonic ← (soon)
/scales/dorian           ← modes live here too, kind:"mode" (soon)
/scales/[slug]           ← generateStaticParams from src/lib/scales/registry.ts
```

A genre is a **stack of layers** (rhythm, meter, harmony, scale, form,
texture) — see [genre-lab-module.md](genre-lab-module.md) for the full layer
model and the interactive groove widgets that come later. The Scales module
is the home for scale/mode deep-dives — see [lessons-module.md](lessons-module.md)
for what stays in `/lessons`.

## Decisions (locked, this build)

1. **Two trees, not three.** `/genres` and `/scales` are the teaching
   modules. `/lessons` shrinks to the non-scale primitives (chords,
   waveforms, octaves, frequency, time signatures) and does **not** grow a
   competing scale page. The scale slugs still listed in
   `src/lib/lessons/registry.ts` (`scales`, `scale-degrees`) are superseded
   by `/scales` — migrate/redirect them when we touch that registry, don't
   build `/lessons/blues-scale`.
2. **Topic slugs, question titles.** Path is `/genres/blues`,
   `/scales/blues-scale` (kebab, no article). The search-shaped question
   ("What is the blues?") is the `<h1>`, `<title>`, and meta description —
   not the URL. No standalone `/what-is-the-blues`, no duplicate URL.
3. **Cross-links are data, not prose.** `Genre.scales` → scale slugs;
   `ScaleLesson.usedIn` → genre slugs. The blues page links to the blues
   scale and vice-versa from the registries. Never nest
   `/genres/blues/blues-scale` — a scale belongs to many genres.
4. **Modes are scales.** Dorian et al. live under `/scales/[slug]` with
   `kind: "mode"`, so the synth's planned `?scale=…` deep-link
   ([synth-scale-type-selector.md](synth-scale-type-selector.md)) has one
   unambiguous landing target.
5. **Blues first for both modules.** This overrides Genre Lab's old
   "reggae-first" milestone (that was a rhythm-widget proof, not a URL
   order). Blues ships as the first *page*; its interactive layers are still
   honest "coming soon" until built.
6. **Honesty rule holds.** The lead paragraph is the real answer in HTML;
   the "coming soon" blocks promise interaction we haven't shipped rather
   than faking a lit widget.

## What this build shipped (structure + SEO, no interactive widgets yet)

- `src/lib/genres/registry.ts` — `Genre[]` + `LAYER_INFO`, blues live.
- `src/lib/scales/registry.ts` — `ScaleLesson[]`, blues-scale live.
- `src/app/genres/{page,[slug]/page}.tsx`, `src/app/scales/{page,[slug]/page}.tsx`
  — hubs + spokes. `generateStaticParams`, `dynamicParams = false`,
  per-page `generateMetadata` (title = question, description = answer,
  self-canonical, keywords).
- Crawlable body: `<h1>` question, lead answer paragraph, layer/formula
  sections, cross-links — all server-rendered HTML, not client-only.
- **FAQPage JSON-LD** on each spoke (the page's question + answer) — the
  answer-engine citation lever.
- "Soon" spokes get `robots: { index: false, follow: true }` so thin
  placeholders can't dilute the index; hubs and live spokes are indexable.
- `src/app/sitemap.ts` + `src/app/robots.ts` — first sitemap/robots on the
  site, sourced from the registries (hubs always; spokes only when "live").
- Nav: `genres` + `scales` added to `NAV_ITEMS` (`inNav: false`) and
  `appIcons.ts` (`Disc3`, `Waypoints`); they appear as home widgets + in the
  hamburger, giving internal links for crawl.

## Shipped 2026-09-05 (second pass): blues-scale interactive lesson

`/scales/blues-scale` now has its real lesson (Phase A of the blues content
plan). New pieces, all composing existing audio/keyboard code — no forks:

- `src/components/scales/` — `LessonKeyboard` (SynthKeys minus synth chrome),
  `RootNotePicker` (12 roots, one shared state), `ScaleDegreeStrip`
  (clickable degree chips; ♭5 gets the burnt-orange spotlight),
  `PlayScaleButton` (scheduled up/down run with key highlight), `notes.ts`
  (flat spellings + degree data).
- `src/content/scales/BluesScaleLesson.tsx` — the lesson: **Hear it**
  (root-anchored 2-octave keyboard, scale run, lock-to-scale), **Build it**
  (minor pentatonic vs blues strips, keyboard-highlight toggle), **The truth
  about blue notes** (bends honesty note).
- `src/content/scales/index.ts` — slug → lesson map; `[slug]/page.tsx`
  renders the lesson when one exists, placeholder otherwise. Registry stays
  free of client imports (sitemap safety).

## Next slices (when we build content)

1. **Song embed on the blues pages** (Phase B, blocked on sourcing a
   public-domain blues `.mid` — e.g. St. Louis Blues): `readOnly` prop on
   `PianoRollEditor`, thin `SongRollEmbed` wrapper (play/stop only), blues
   rows lit via `isNoteInScale`, loop flags preset to one 12-bar chorus.
   Ingest via `npm run ingest-midi` with a new `blues` label set.
2. **Genre Lab widgets** on `/genres/blues`: shuffle `GroovePlayer` +
   `GrooveGrid`, 12-bar `FormMap`, I–IV–V strip — per
   [genre-lab-module.md](genre-lab-module.md) Phases 2–3.
3. Flip `rock`, then a scale or two, from "soon" to "live" (registry status +
   a lesson in `src/content/scales/`); sitemap follows automatically.
4. Wire these hubs into the broader SEO pass
   ([seo-and-discoverability.md](seo-and-discoverability.md)): `llms.txt`
   entries, Search Console submit after a production deploy.
5. Home page grouping: consider a "Learn" section separate from "All tools"
   (needs a `group` field on `NAV_ITEMS`; small, deferred).

## Relevant files

| Purpose | Path |
|---------|------|
| Genre data + layer legend | `src/lib/genres/registry.ts` |
| Scale/mode data | `src/lib/scales/registry.ts` |
| Hubs + spokes | `src/app/genres/`, `src/app/scales/` |
| Sitemap / robots | `src/app/sitemap.ts`, `src/app/robots.ts` |
| Nav + icons | `src/lib/navigation.ts`, `src/lib/appIcons.ts` |
| Layer model + groove widgets (later) | `docs/plans/genre-lab-module.md` |
| Scale widgets + `/lessons` scope | `docs/plans/lessons-module.md` |
| Scale theory source of truth | `src/lib/music/scales.ts` |
| Broader SEO/GEO pass | `docs/plans/seo-and-discoverability.md` |
