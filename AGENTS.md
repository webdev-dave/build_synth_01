# AGENTS.md — Instrumaps style & philosophy

Guidance for humans and AI agents working in this codebase. The goal is to
keep the *feel* of the app consistent as it grows.

**These are guidelines, not laws.** They describe our defaults and the
reasoning behind them. If a particular use case genuinely calls for
something different, deviate — deliberately, and ideally with a short
comment or commit message noting why. What's not okay is drifting away
from the feel by accident.

---

## 1. What Instrumaps is

Interactive music-theory tools. The tagline is the philosophy:
**"Don't study theory. Play with it."**

Every feature should let the user *hear and see* a concept rather than
read about it. The core metaphor is the **map**: notes, scales, and chords
are places with relationships, and the app shows you the connections.

## 2. Product principles

- **Everything teaches.** Interactions should reveal musical truth. If a
  visual implies something is sounding, it must actually be sounding
  (e.g. the hero's center C node un-circles while a C-less chord plays —
  a lit tonic would be a lie).
- **Bidirectional instruments.** Visualizations aren't posters; they're
  controllers. Press a piano key → see it on the map. Click a map node →
  hear its chord on the piano. Prefer two-way links over one-way displays.
- **Wow through meaning, not flash.** Impress by making a real concept
  tangible (frequencies, chord membership, in-scale vs. chromatic), not
  by decoration. If an effect doesn't encode information, it should be
  very quiet or gone.

## 3. Visual design

- **Sleek, calm, computer-sciency.** shadcn/ui aesthetic: neutral palette,
  thin borders, generous whitespace, dark-first (`html.dark`).
- **Use the theme tokens** (`bg-background`, `text-muted-foreground`,
  `stroke-border`, …) from `globals.css` / `tailwind.config.ts`. Avoid
  hard-coded colors; the palette stays neutral so the music can be the
  color.
- **Accent color is a spotlight, not a paint bucket.** We use orange only
  to demand attention (e.g. the muted-speaker pulse). One accent per view,
  and it should retire once it has done its job.
- **The chromatic palette is two colors, each with a fixed meaning.**
  When a view genuinely needs color beyond the neutrals, fall back to
  these — don't invent new hues:
  - **Burnt orange** — attention & warmth: the spotlight accent above.
    Skew earthy and dark (Tailwind `orange-600`/`orange-700` territory,
    ~`#ea580c`–`#c2410c`), not neon. Existing brighter oranges
    (`orange-400`-ish pulses, the MIDI Lab playhead) should migrate toward
    the burnt shade as they're next touched.
  - **Green** — affirmation & liveness: something is on, connected, or
    confirmed (e.g. a status dot). Keep it calm and small — a muted
    emerald (~`emerald-500`/`600`), never large fills.

  Meanings don't swap: orange asks for the user's eyes, green reassures
  them. Everything else stays neutral so the music can be the color.
- **Monospace for data.** Note names, Hz readouts, and anything
  machine-precise renders in the mono font — that's the
  "computer-sciency undertone."
- **Icons are Lucide**, mapped centrally in `src/lib/appIcons.ts`. If no
  Lucide icon fits, draw a custom one with `createLucideIcon` in the same
  style (2px stroke, 24px grid) rather than importing another icon set.
- **shadcn components** live in `src/components/ui/` (classic Tailwind v3
  + Radix + HSL-variable setup — *not* the Tailwind v4 CLI defaults).
  Compose with the `cn()` utility from `src/lib/utils.ts`.

## 4. Motion

- **Motion follows music.** Animations tied to musical content derive
  their timing from a tempo (`BEAT`, bars, note lengths), not arbitrary
  durations. Rhythm is the reason motion feels intentional here.
- **Activity, then rest.** Loops should breathe — a phrase of movement
  followed by calm reads as musical; constant motion reads as noise.
- **Prefer soft over sharp.** Blurred glows, gentle fades, and small
  scale changes over hard dashes, spins, or bounces.
- **Slow is confident.** When in doubt, slow the animation down.
- **Always respect `prefers-reduced-motion`** (via `useReducedMotion`
  from `motion/react`). Provide a meaningful static or discrete fallback,
  not a blank space.
- We use **Motion (`motion/react`)** for animation. One-shot, event-driven
  animations (see the hero's "flash" pattern in `HeroMap.tsx`) are easier
  to keep honest than long choreographed infinite loops.

## 5. Sound

- **Sound requires consent.** Browsers enforce this and so do we: create
  or resume the `AudioContext` inside a user-gesture handler. Playing an
  instrument *is* consent (a key press may unlock audio); merely visiting
  a page is not.
- **Default to muted, invite the click.** Ambient/demo audio starts muted
  with a clear, gently animated affordance to enable it.
- **Quiet and soft by default.** Low gains, gentle attacks, real releases,
  and some reverb space. A homepage should never startle.
- **Lightweight synthesis over samples** where practical (oscillators,
  generated impulse responses) — no audio files to load, and it keeps us
  honest about what's actually sounding.

## 6. Interaction

- **Attract mode.** Ambient demos yield the stage the moment the user
 interacts, and don't barge back in — a demo plays a bounded run (the
 hero plays its tune twice) and then rests behind a quiet replay
 affordance. Never fight the user for control; never leave the stage
 dead either — resting views keep a visible way to bring the demo back.
- **Everything interactive looks interactive** — hover states, cursor
  changes — and is keyboard-accessible (`tabIndex`, Enter/Space handlers,
  `aria-label`s), including SVG elements.
- **Feedback is immediate and layered.** A single action (one key press)
  can echo across layers (key glow, map pulse, Hz readout) — but all
  layers describe the same one truth.

## 7. Code conventions

- **TypeScript everywhere; keep the data out of the components.** Musical
  content (melodies, chords, note tables) lives in small typed data
  modules (see `src/components/home/heroTune.ts`), so tunes and mappings
  can change without touching rendering logic.
- **Derive, don't duplicate.** Geometry and timing come from a few named
  constants (`KB`, `BEAT`, node positions) so a layout tweak is a
  one-number change.
- **Shared music theory** belongs in `src/lib/music/`; app-specific logic
  stays with its app (`src/lib/harmonica/`, `src/instruments/synth/`).
- **Comments explain intent, not mechanics.** Write the *why* (musical
  reasoning, design trade-off) — never narrate what the code obviously
  does.
- **Small, focused hooks** for stateful concerns (`useHeroAudio`,
  `useSharedAudioContext`) rather than god components.

## 8. Verifying changes

- `npx tsc --noEmit` for types (the dev server won't catch everything).
- Check lints on files you touched.
- For UI work, look at it — and if it moves or sounds, check the
  reduced-motion and muted states too.

## 9. When to deviate

Deviate when the use case is genuinely better served by something else —
a marketing splash may earn a bolder accent; a dense reference table may
skip animation entirely; a game-like tool may justify louder sound.
Ask two questions first:

1. Does this still *feel* like Instrumaps (calm, precise, musical,
   honest)?
2. Would a user notice the inconsistency, or only a linter?

If the answers are "yes" and "no," go ahead — and leave a note about the
reasoning so the next person knows it was a choice, not drift.
