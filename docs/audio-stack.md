# Audio stack — decision record and guide

**Decision (2026-09-12): Instrumaps generates sound with the raw Web Audio
API. No audio framework. Dependencies are admitted only as swappable
ingredients behind our own interfaces, and only when native nodes cannot
make the sound.**

This document is for anyone — human or agent — who is about to write sound
code or is tempted to `npm install tone`. It records *why* so the question
does not get relitigated per feature. The short, enforceable version is
`.cursor/rules/audio-stack.mdc`; the style rules for how sound should *feel*
are `AGENTS.md` §5.

---

## 1. Two fears, and what a library does about each

The owner named two concerns when this was decided:

1. *Crashing the browser / not being smart about how sound is processed.*
2. *Being at the mercy of a package that gets abandoned or behaves oddly.*

A library addresses neither directly.

Web Audio is designed so that the expensive part — the DSP — runs natively,
in C++, on a real-time audio thread inside the browser. JavaScript only
**builds and schedules graphs**. Twenty sine oscillators for an organ chord
and a few noise bursts for a drum kit are nothing to it; you cannot crash a
browser with the sounds this app makes. Tone.js and every other Web Audio
library use exactly the same native nodes underneath. They do not have a
faster engine.

What *does* go wrong is a short, known list, and every item is lifecycle
or timing discipline, not DSP knowledge:

| Failure | Cause | Our guard |
|---|---|---|
| Stutter, drift, notes late | scheduling from `setTimeout` or React renders | look-ahead scheduler on `AudioContext.currentTime` (`useLessonClock`) |
| Memory climbs, eventual glitches | sources started and never stopped | every source gets `stop()` and `onended` cleanup (`scheduleNote` already does this) |
| Distortion, clipping | summed gains > 1 | one master bus with gain staging and a `DynamicsCompressorNode` as a safety limiter |
| CPU spikes | unbounded polyphony (key mashing over a loop) | voice cap (~32); steal the oldest voice |
| Silence on mobile | context suspended, or several contexts fighting | **one** shared `AudioContext`; `resume()` inside the gesture handler; suspend on `visibilitychange` |
| UI jank | React state updated per 16th note | audio-side state in refs + `requestAnimationFrame` |

That table is the entire "be smart about sound" checklist for this class
of app. It is a few hundred lines, written once in `src/lib/audio/`. Half
of it already exists in `useAudioSynthesis` (`voicesRef`, `scheduleNote`)
and `useHeroAudio` (`makeImpulse`). A library would have done this for us
quietly — and taken the architecture hostage in exchange.

Known wart: `useHeroAudio` creates its **own** `AudioContext` instead of
using the shared one from `AudioContextProvider`. That is the "several
contexts" row. Fold it into the shared bus when `src/lib/audio/bus.ts`
lands; do not copy the pattern.

## 2. Where libraries sit — four layers

**Layer 0 — Web Audio API.** W3C standard, shipping since ~2011, consistent
across browsers now. The one dependency you cannot be at the mercy of.
Native nodes cover oscillators, noise (via buffers), gain, biquad filters,
delay, convolution reverb, waveshaper, compressor, panner, analyser,
offline rendering, and `AudioWorklet` for custom code. That is a complete
analog-style synth, a drum machine, and a basic mixer.

**Layer 1 — transport, scheduling, voice management, presets.** Tone.js
territory (MIT, ~14.7k stars; maintained but slow — last stable release
April 2025, dev branch active in 2026). It offers `Transport`, `Synth`,
`MembraneSynth`, `NoiseSynth`, effects, swing: our exact shopping list,
which is the trap. Tone wants to own the `AudioContext`, the clock, and
the meaning of "now". Instrumaps rests on **one clock that also drives
the visuals** ("visual = sounding"). If Tone owns time, `BarTimeline`,
the `GrooveGrid` playhead, and chord-cell highlighting all have to ask
Tone what time it is — the library becomes load-bearing in the UI, not
just in the audio. The scheduler we write instead is ~150 lines.

**Layer 2 — custom DSP.** Needed only when native nodes cannot make the
sound: self-oscillating analog-modelled filters, tube/tape saturation,
granular, high-end algorithmic reverbs, DAW-grade metering. The
mechanism is native (`AudioWorklet` running WebAssembly you generate).
Tools:

- **Faust** (GRAME, academic). A DSP file compiles to a WASM worklet.
  Compiler is GPL; generated code is yours — check the license of each
  Faust *library* you pull in.
- **Elementary Audio** ("React for audio": declarative graphs, WASM
  engine, TypeScript-first). Seductive for a React team, but a
  2023-vintage company product whose model has flipped three times
  (free/pro tiers → marketplace → MIT core with paid packs). The code
  cannot be taken away; the roadmap can. That is the "phased out or
  behaves weirdly" risk in concrete form.
- **Hand-written worklet.** For one filter or one saturator, ~100 lines
  of DSP with no dependency at all is usually the right answer.

**Layer 3 — data, not sound.** MIDI parsing (`@tonejs/midi`, already used
by the ingest script), music theory, file formats. Fine as dependencies
or as our own code; they never touch the audio thread and are outside
this decision.

## 3. The adoption rule

Take a sound dependency only when **all three** hold:

1. It does something native nodes genuinely cannot (a Layer-2 need) —
   not something that saves typing.
2. It sits **behind our own interface.** The signatures in
   `src/lib/audio/voices/*.ts` (and later `Effect`) do not change whether
   the recipe inside is native nodes or a WASM worklet. Swappable per
   voice, per effect.
3. Permissive license (MIT / BSD / LGPL-compatible), and it is an
   **algorithm** dependency — not a framework that wants to own the
   `AudioContext`, the clock, or the React tree.

Frameworks fail rule 3 by definition. **Libraries as ingredients, never
as the kitchen.**

Never outsource, at any horizon: the clock, the voice manager, the master
bus, music theory, and anything the UI reads to decide what to light up.

## 4. Per horizon

**Lessons, instruments, drum machine (current work).** Raw Web Audio,
zero audio libraries. Everything needed is Layer 0. Bundle stays small
for the static export; the honesty rule (a lit key must be a sounding
key) is easier when we wrote the ten lines that make the snare; every
recipe is a pure function checkable from `/tmp`. Bake the §1 guardrails
into `src/lib/audio/bus.ts` and the clock now, while the codebase is
small.

**Synth as a serious instrument.** Still native. Filter envelopes, LFOs,
unison detune, PWM, FM — `OscillatorNode` + `BiquadFilterNode` +
`AudioParam` automation cover all of it. The first real Layer-2 itch will
likely be a *musical* resonant filter with drive (biquads sound sterile
when pushed). That is one worklet behind a `createFilter()` interface,
hand-written or Faust-generated.

**DAW (recording, mixing, effect racks).** Still mostly native:
`MediaRecorder` / `OfflineAudioContext` for export, `AnalyserNode` for
meters, compressor / EQ / delay / reverb built in. Layer 2 earns its
place for quality reverbs and saturation, a true limiter, maybe
pitch-shift / time-stretch. Evaluate Faust vs Elementary vs hand-written
**then, per effect**, behind our own `Effect` interface. Never wholesale.

## 5. Samples

`AGENTS.md` §5 prefers synthesis *where practical*. The escape hatch is
per voice, not per app: if a synthesized voice tops out after tuning, a
handful of one-shot samples (openly licensed, self-hosted under
`public/audio/`, credited) may drop in behind the **same** `kickAt()` /
`organChordAt()` signature. The architecture does not change; the
decision is recorded in the voice file's header comment.

## 6. What we gave up, what we kept

Given up: Tone's ready-made kick/snare/effects presets — a day or two on
the drum kit.

Kept: one clock, one context, full knowledge of every sounding node, no
bundle weight, no company roadmap risk, and recipes written against a web
standard that will outlive any package.

## 7. Revisit triggers

Reopen this decision only when one of these is true, and then only for
the single component in question:

- A sound cannot be made acceptably with native nodes after a real tuning
  pass with ears (Checkpoint-style, not a first render).
- A DAW feature needs DSP no native node provides (true limiter,
  time-stretch, convolution at scale).
- A browser regression makes a native node unusable and a worklet is the
  fix.

"It would be faster with Tone" is not a trigger.

## Related

- `.cursor/rules/audio-stack.mdc` — the enforceable short form.
- `AGENTS.md` §5 Sound — how sound should feel (consent, quiet, soft).
- `docs/plans/genre-layer-lessons.md` §3.9 — the `src/lib/audio/` layout
  and the organ / drum recipes that first apply this decision.
- `docs/plans/lesson-widgets-design.md` §4 — `useLessonClock` design.
