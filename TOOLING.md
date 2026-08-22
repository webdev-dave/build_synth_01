# Tooling Inventory — "Someday" Build Candidates

A local, curated inventory of AI models, agentic tooling, and traditional
audio/MIDI libraries we might build into this project. This is a decision
scratchpad, not a dependency list — most of these are **not** installed.

> The synth engine (Web Audio + `src/lib/music`) is the core. Treat note-level
> tools as things that live *inside* the app, and full-song audio generators as
> optional sources of *material* (loops, beds, samples), not replacements for
> the instrument.

## How to read this

Each entry is flagged on four axes:

| Flag | Legend |
| --- | --- |
| **Open** | 🟢 open/free · 🟡 freemium/limited · 🔴 closed/paid |
| **Embed** | ✅ permissive (MIT/Apache) · ⚠️ copyleft / dual-license / needs commercial license · ❌ closed / ToS-only, cannot bundle |
| **Effort** | ⭐ browser drop-in · ⭐⭐ bundling/config · ⭐⭐⭐ needs backend/API · ⭐⭐⭐⭐ needs GPU/native |
| **Status** | `candidate` (default) · `adopted` · `rejected` |

> ⚠️ **Legal note:** the **Embed** column is a starting point, not legal advice.
> Licenses and API terms change — re-verify the license/ToS before shipping
> anything, especially ⚠️ (copyleft/dual) and ❌ (closed) entries.

---

## 1. Music theory & MIDI (browser-native, ship-ready)

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [tonal](https://github.com/tonaljs/tonal) | Notes, scales, chords, keys, chord-detect, progressions (TS) | 🟢 | ✅ MIT | ⭐ | Replace hand-rolled theory gaps in `src/lib/music` |
| [WEBMIDI.js](https://webmidijs.org/) | High-level Web MIDI API for hardware in/out | 🟢 | ✅ Apache-2.0 | ⭐ | ToDo: "accept MIDI input" |
| [@tonejs/midi](https://github.com/Tonejs/Midi) | Parse/write `.mid` files to JSON | 🟢 | ✅ MIT | ⭐ | Load songs as note data |
| [JZZ](https://github.com/jazz-soft/JZZ) | MIDI for browser + Node | 🟢 | ✅ | ⭐⭐ | Server-side MIDI file work |

**Example — light up keys from a hardware MIDI keyboard:**

```ts
import { WebMidi } from "webmidi";

await WebMidi.enable();
const input = WebMidi.inputs[0];
input.addListener("noteon", (e) => {
  playNote(e.note.number); // hook into existing synth engine
});
```

**Example — detect chord / scale with tonal:**

```ts
import { Chord, Key } from "tonal";

Chord.detect(["D", "F#", "A"]);   // ["D", "Dmaj"]
Key.majorKey("C").scale;          // ["C","D","E","F","G","A","B"]
```

---

## 2. Synthesis / DSP / playback

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| Web Audio + **AudioWorklet** | Native low-level audio (current stack) | 🟢 | ✅ | ⭐⭐ | ToDo: latency + click/pop fixes |
| [Tone.js](https://tonejs.github.io/) | DAW-style framework: Transport, synths, FX, scheduling | 🟢 | ✅ MIT | ⭐⭐ | Drum machine, recording, clips |
| [Elementary Audio](https://www.elementary.audio/) | Declarative JS DSP, browser + native | 🟢 | ✅ MIT (core) | ⭐⭐ | When ad-hoc oscillators aren't enough |
| [smplr](https://github.com/danigb/smplr) | Soundfont / sample instruments | 🟢 | ✅ MIT | ⭐⭐ | Real piano/organ (ToDo: 70s organ) |
| [spessasynth](https://github.com/spessasus/SpessaSynth) | SF2/DLS MIDI synth (AudioWorklet) | 🟢 | ✅ | ⭐⭐ | SF2-based playback |
| [RNBO](https://rnbo.cycling74.com/) (`@rnbo/js`) | Design synth in Max → export WASM | 🔴 | ⚠️ Cycling '74 license | ⭐⭐ | Serious preset sound design |
| [Faust](https://faust.grame.fr/) → FaustWasm | DSP language → WASM AudioWorklet | 🟢 | ⚠️ dual; generated code usually permissive | ⭐⭐⭐ | Pro DSP / custom effects |
| [standardized-audio-context](https://github.com/chrisguttandin/standardized-audio-context) | Cross-browser AudioContext shim | 🟢 | ✅ MIT | ⭐ | ToDo: mobile Safari bugs |

**Example — Tone.js polyphonic synth (drop-in playable):**

```ts
import * as Tone from "tone";

const synth = new Tone.PolySynth(Tone.Synth).toDestination();
synth.triggerAttackRelease(["C4", "E4", "G4"], "8n");
```

---

## 3. Notation / teaching UI

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [VexFlow](https://www.vexflow.com/) | Render staff + guitar tab (SVG/Canvas) | 🟢 | ✅ MIT | ⭐⭐ | Show detected chord/scale in Harmonica Lab |
| [abcjs](https://www.abcjs.net/) | Render + play ABC notation | 🟢 | ✅ MIT | ⭐⭐ | Folk/harmonica tunes |
| [OpenSheetMusicDisplay](https://opensheetmusicdisplay.org/) | Render MusicXML | 🟢 | ✅ BSD | ⭐⭐⭐ | Full score display (heavier) |

---

## 4. Analysis / transcription (audio → info; closest to current work)

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [@spotify/basic-pitch](https://github.com/spotify/basic-pitch-ts) | Audio → MIDI, polyphonic, pitch bends (**already installed**) | 🟢 | ✅ Apache-2.0 | ⭐⭐ | Song interpretation, harp-from-recording |
| [essentia.js](https://github.com/MTG/essentia.js) | ~200 MIR algos (key, BPM, chroma) via WASM | 🟢 | ⚠️ **AGPL-3.0** (commercial license for closed products) | ⭐⭐⭐ | Fix the hidden key detector properly |
| [CREPE](https://github.com/marl/crepe) / [pitchy](https://github.com/ianprime0509/pitchy) | Monophonic pitch tracking | 🟢 | ✅ MIT | ⭐⭐ | Tuner, key detector, harp/vocal pitch |
| [Meyda](https://meyda.js.org/) | Real-time Web Audio feature extraction | 🟢 | ✅ MIT | ⭐ | Lightweight live analysis |
| [Demucs (web/ONNX)](https://github.com/bakkot/demucs-js) | Stem separation (vocals/drums/bass/other) | 🟢 | ✅ MIT (model) | ⭐⭐⭐ | ~170MB ONNX, WebGPU; isolate-a-line |
| [Whisper via transformers.js](https://github.com/huggingface/transformers.js) | Audio → lyrics/text in browser | 🟢 | ✅ Apache-2.0 (models vary) | ⭐⭐⭐ | Lyrics alongside transcription |
| [Moises](https://moises.ai/) / [LANDR](https://www.landr.com/) | Hosted stems / mastering | 🟡 | ❌ API/ToS | ⭐⭐⭐ | Shortcut if you don't want to ship ONNX |

**Example — audio → MIDI (pattern we already have via `basicPitchLoader.ts`):**

```ts
const { BasicPitch } = await import("@spotify/basic-pitch");
const bp = new BasicPitch(MODEL_URL);
await bp.evaluateModel(audioFrames, onFrames, onProgress);
// → note events → transpose via src/lib/music → play on synth
```

---

## 5. Generative *note* models (emit MIDI/sequences — play through our synth)

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [Magenta.js](https://magenta.github.io/magenta-js/music/) | MusicVAE, MusicRNN, Piano Genie, Onsets & Frames | 🟢 | ✅ Apache-2.0 | ⭐⭐⭐ | First generative feature that still plays *our* synth |
| [MidiTok](https://github.com/Natooz/MidiTok) | Tokenize MIDI for transformers (Python) | 🟢 | ✅ MIT | ⭐⭐⭐⭐ | If we ever train a phrase model |
| Anticipatory / Music Transformer | Symbolic generation research | 🟢 | ✅ (varies) | ⭐⭐⭐⭐ | Research lineage for a custom model |

**Example — continue a melody with Magenta MusicRNN (browser):**

```ts
import * as mm from "@magenta/music";

const rnn = new mm.MusicRNN(CHECKPOINT_URL);
await rnn.initialize();
const cont = await rnn.continueSequence(seedSeq, 32, 1.1);
// cont.notes → feed to synth engine
```

---

## 6. Generative *audio* models & APIs (produce finished audio / material)

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [Lyria RealTime](https://ai.google.dev/gemini-api/docs/realtime-music-generation) | Live streaming music, steer by scale/BPM/density | 🟡 | ❌ Gemini API/ToS | ⭐⭐⭐ | Live accompaniment that respects our scale dropdown |
| [Lyria 3 / 3.5](https://ai.google.dev/gemini-api/docs/music-generation) | Text/image → full song (MP3/WAV) | 🟡 | ❌ Gemini API/ToS | ⭐⭐⭐ | Backing tracks, loops |
| [Stable Audio 3](https://www.stableaudio.com) | Instrumentals, loops, SFX; open small/med weights | 🟡 | ⚠️ Stability community license (<$1M rev) / API for large | ⭐⭐⭐⭐ | Generate one-shots → new oscillator/sample sources |
| [ACE-Step 1.5](https://github.com/ace-step/ACE-Step-1.5) | Open lyric→song, cover/repaint/stem/extract | 🟢 | ✅ MIT (weights) | ⭐⭐⭐⭐ | Self-hosted song/cover/stem studio (needs GPU) |
| [Magenta RealTime 2](https://magenta.withgoogle.com/magenta-realtime-2) | Live model steered by MIDI/text/audio; text-to-synth | 🟢 | ✅ open weights | ⭐⭐⭐⭐ | North star: AI as a *playable instrument* (Apple Silicon/MLX) |
| [ElevenLabs Music](https://elevenlabs.io/) | Music API from a voice-AI company | 🟡 | ❌ API/ToS | ⭐⭐⭐ | Only if we want ElevenLabs vocals too |
| [Suno](https://suno.com) | Best prompt→song w/ vocals | 🔴 | ❌ closed, messy rights | ⭐⭐⭐ | Reference/inspiration; not embeddable |
| [Udio](https://www.udio.com) | High-fidelity competitor | 🔴 | ❌ closed, export locked | ⭐⭐⭐ | Cautionary tale on export lock-in |
| MusicGen / AudioCraft | Meta's open text→music (prev. generation) | 🟢 | ✅ MIT (code); weights CC-BY-NC | ⚠️ | Superseded by ACE-Step for most uses |

**Example — Lyria RealTime steering (maps onto existing scale/BPM UI):**

```ts
// Gemini Live Music WebSocket — conceptual
session.setMusicGenerationConfig({
  bpm: 120,
  scale: "C_MAJOR_A_MINOR",
  density: 0.6,
  brightness: 0.7,
  muteDrums: false,
});
session.setWeightedPrompts([{ text: "warm rhodes jazz trio", weight: 1.0 }]);
```

---

## 7. Agentic / LLM tooling (intent layer over our engine)

No dominant "music agent framework" — the pattern is **an LLM with tool-calls
that drive our real engine.** The engine (scale lock, chord select, transpose,
detect, presets) is already the tool surface.

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [Vercel AI SDK](https://sdk.vercel.ai/) | Tool-calling / structured output over any LLM | 🟢 | ✅ Apache-2.0 | ⭐⭐⭐ | "Play a ii–V–I in G, lock white keys" |
| Claude / GPT / Gemini | Theory copilot + intent → structured params | 🔴 | ❌ API/ToS | ⭐⭐⭐ | NL sound design, harp position explainer |
| [DDSP](https://github.com/magenta/ddsp) / [RAVE](https://github.com/acids-ircam/RAVE) / [Neutone](https://neutone.ai/) | Neural synths / timbre transfer you *play* | 🟢 | ✅ (varies) | ⭐⭐⭐⭐ | Experimental "AI instrument" |

**Example — LLM tools that drive existing hooks:**

```ts
const tools = {
  setScale: (root: string, mode: string) => useScaleLogic().set(root, mode),
  playNotes: (notes: NoteEvent[]) => synth.playSequence(notes),
  transpose: (semitones: number) => transpose(semitones),
};
// LLM picks scale/form/constraints; a note-model or our engine performs it.
```

---

## 8. Native / research (only if we leave the browser)

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [JUCE 8](https://juce.com) | C++ framework, VST3/AU/AAX/LV2 plugins | 🟢 | ⚠️ dual GPL/commercial | ⭐⭐⭐⭐ | Ship this as a desktop instrument someday |
| [Rubber Band](https://breakfastquay.com/rubberband/) | Best-quality time-stretch / pitch-shift | 🟢 | ⚠️ **GPL / commercial** | ⭐⭐⭐ | ToDo: "play song in any key" (audio path) |
| [SoundTouch](https://www.surina.net/soundtouch/) | Time-stretch / pitch-shift | 🟢 | ⚠️ LGPL | ⭐⭐⭐ | Easier stretch, more artifacts |
| [pedalboard](https://github.com/spotify/pedalboard) | Python audio effects (batch) | 🟢 | ✅ GPL/commercial? verify | ⭐⭐⭐ | Server-side FX processing |
| [librosa](https://librosa.org/) | Python MIR (research-grade) | 🟢 | ✅ ISC | ⭐⭐⭐ | Offline analysis service |
| [SuperCollider](https://supercollider.github.io/) / [Csound](https://csound.com/) | Live-coding / serious synthesis | 🟢 | ✅/⚠️ | ⭐⭐⭐⭐ | Advanced synthesis experiments |

---

## 9. UI / motion / frontend components (look & feel)

These shape the app's **interface**, not its sound. `shadcn/ui` + `lucide-react`
are now **adopted** (neutral dark theme, Tailwind v3, components owned in
`src/components/ui`). The rest are copy-in component registries or animation
engines that layer cleanly on top of that foundation. Guiding principle: the
in-app surfaces stay **calm and minimal**; save maximal "wow" for a marketing
landing page.

| Tool | What it does | Open | Embed | Effort | Fit |
| --- | --- | :--: | :--: | :--: | --- |
| [shadcn/ui](https://ui.shadcn.com) | Copy-in Radix + Tailwind components (you own the source) | 🟢 | ✅ MIT | ⭐⭐ | **adopted** — Card/Button/Badge; base design system |
| [Lucide](https://lucide.dev) | Consistent SVG icon set (`lucide-react`) | 🟢 | ✅ ISC | ⭐ | **adopted** — nav/home/app icons (Piano, TrainFront…) |
| [Motion](https://motion.dev) (Framer Motion) | React animation engine: variants, gestures, layout | 🟢 | ✅ MIT | ⭐⭐ | **Foundation** — note lighting, scale cascades, mode morphing |
| [Cult UI](https://www.cult-ui.com) | Refined, shadcn-native components | 🟢 | ✅ MIT | ⭐ | Sleek in-app components without going flashy |
| [Magic UI](https://magicui.design) | shadcn/Tailwind + Motion micro-interactions; animated **beam** | 🟢 | ✅ MIT | ⭐⭐ | Beam to visualize root→3rd→5th, mode→parent scale (theory pages) |
| [React Bits](https://reactbits.dev) | Animated text / backgrounds / cards | 🟢 | ✅ MIT | ⭐ | Hero "wow"; use sparingly (noise risk) |
| [Aceternity UI](https://ui.aceternity.com) | High-wow marketing components (spotlight, 3D card, particles) | 🟢 | ✅ MIT | ⭐⭐ | Landing hero (e.g. instrumap.com), **not** in-app |
| [React Three Fiber](https://r3f.docs.pmnd.rs) | React renderer for Three.js (3D) | 🟢 | ✅ MIT | ⭐⭐⭐⭐ | 3D instrument models / audio-reactive visualizer (defer) |
| [Tone.js](https://tonejs.github.io/) | DAW-style audio framework (also see §2) | 🟢 | ✅ MIT | ⭐⭐ | Audio-engine upgrade, not UI — tracked in §2 |

> Dependency note: Magic UI, most of Cult UI, React Bits, and Aceternity are
> built on **Motion**, so adopt Motion first. All four are shadcn-style
> *copy-in* registries (Tailwind + owned source), so they inherit our neutral
> theme rather than fighting it.

**Example — Motion staggered entrance (pattern used on the homepage grid):**

```tsx
"use client";
import { motion } from "motion/react";

const container = { show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

<motion.section variants={container} initial="hidden" animate="show">
  {items.map((it) => (
    <motion.div key={it.id} variants={item} whileHover={{ y: -4 }}>
      {/* card */}
    </motion.div>
  ))}
</motion.section>;
```

**Recommendation:** adopt **Motion** now (subtle homepage entrance/hover) →
**Magic UI + Cult UI** on the theory/instrument pages where motion maps to real
musical concepts → **Aceternity** only on a future marketing landing → **R3F**
and **Tone.js** later, each on its own merits.

---

## Shortlist — best fit for *this* project, ranked

**Near-term (client-side, no GPU, permissively licensed):**
1. WEBMIDI.js — hardware MIDI in (ToDo)
2. tonal — stop hand-rolling theory
3. AudioWorklet — latency / click-pop (ToDo)
4. smplr / SF2 — instruments that sound real (70s organ)
5. CREPE/pitchy (or essentia.js ⚠️AGPL) — revive the key detector
6. VexFlow — show the chord/scale we already compute
7. Magenta.js — first generative feature that still plays our synth

**Medium-term (matches roadmap):**
8. basic-pitch pipeline (already started) — song/mic → light keys → retarget scale → play
9. In-browser Demucs — karaoke / isolate a line
10. LLM tool-calling over existing hooks
11. Lyria RealTime — backing band that respects the scale dropdown
12. Stable Audio API — generate loops/one-shots as new sources

**Someday / research north stars:**
13. Magenta RealTime 2 — AI as a playable, MIDI-steerable instrument
14. ACE-Step 1.5 — self-hosted song/cover/stem studio
15. Elementary / RNBO / Faust — when the hand-rolled graph is the bottleneck
16. JUCE — if we want a VST of this

## Watch-outs
- **essentia.js is AGPL-3.0** — copyleft; needs a commercial license for a closed product. CREPE/pitchy (MIT) are safer for pitch.
- **Rubber Band / JUCE** are dual GPL/commercial — a paid license is required to ship closed.
- **Suno / Udio / Lyria / ElevenLabs** are closed APIs — you can *call* them per ToS, never bundle them.
- **Stable Audio** open weights are free only under the community license (<$1M revenue).
- For "song in any key," prefer **transcribe (basic-pitch) → re-perform on our synth** over audio-domain pitch-shifting; it sounds better and avoids GPL stretch libs.
