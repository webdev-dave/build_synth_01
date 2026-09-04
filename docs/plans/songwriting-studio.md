# Plan: Songwriting Studio — from a poem to a studio-ready demo

A new **Songwriting Studio** at `/songwriting` that coaches a user from a
poem, journal entry, or unfinished lyric into a **small, honest demo**:
structure, feel, chords, a pulse, and a couple of MIDI tracks they can take
to a real studio (or their own).

The product is a **session**, not a generator. The user walks in with their
words and walks out still owning those words — plus a map of how they might
become a song.

> **Spec first — this doc is not a build order to start blindly.** Feel
> palettes, scansion rules, and progression catalogs below should be
> sanity-checked against trusted sources (and against `AGENTS.md` honesty)
> before they ship as "teaching truth." If the chart says Am and the pad
> plays C, that is the same lie as a lit tonic on a C-less chord.

---

## Why this fits Instrumaps

The tagline — **"Don't study theory. Play with it."** — already wants this.
A poem is a place with rhythm and stress; a song is that place plus a pulse,
a key, and a form. We already teach the primitives (scales, meters, a piano
roll, a synth). We do not yet have a place that sits with someone *while
they write* and lets them hear the next decision.

This is also the first module that is **about the user's own material**.
Synth, Harmonica Lab, Piano Roll, Lessons, and the planned Genre Lab are
playgrounds for *our* examples. Songwriting Studio is a playground for
*their* words. That is why people come back: not because we wrote something
for them, but because *they* did, and the tool made the next session feel
possible.

### What it is not

| Not this | Because |
|----------|---------|
| An AI that rewrites the poem into a radio lyric | Replaces the user's voice. They will not feel it is theirs, and they will not come back to *write* — they will come back to *prompt*. |
| A browser DAW / full production | Mixing, arrangement, vocal tracking, and "a finished song" are a different product, and a bad fit for Web Audio in a tab. |
| A one-click "make me a song" | No coaching, no learning, no map. A slot machine. |
| A vocal clone / sung performance of their lyric | Consent, likeness, and quality problems. The demo is instrumental + optional hummed contour, not a fake singer. |
| Suno / Udio inside Instrumaps | Those products *replace* the writing session. We *host* the writing session. |

The walk-away artifact is a **launching pad**: chart, feel, tempo, a few
MIDI tracks, maybe a short audio bounce of the bed. The studio (home or
pro) is where it becomes a record.

---

## What already exists to lean on

- **Canonical song document.** `src/lib/song/types.ts` already has
  `SongDocument` with `meta` (tempo, time signature, key) and tracks
  (`melody` / `chords` / `bass` / `other`). The Piano Roll loads JSON via
  `documentToRollView` — it does not re-parse MIDI on select. A studio
  session should **emit a `SongDocument`**, not invent a second song
  format.
- **Lyrics already attach to notes.** `MelodyEvent.lyric` in
  `src/components/home/heroTune.ts`, and `sequenceToMelody` re-attaches
  syllables by note order. The Yesterday drafts in `src/lib/songs/yesterday.ts`
  are the existence proof: words on a timeline.
- **Chord events already exist.** `ChordEvent` (`at`, `beats`, `name`,
  `hz`) is how the hero pads "Yesterday." A progression in the studio is
  the same type, generated from a catalog, not from a model improvising
  voicings.
- **Scale / mode vocabulary, with feel language.**
  `src/lib/music/scales.ts` already tags modes (`dorian` → "Minor but
  warm, jazzy"; `mixolydian` → "Bluesy"; `phrygian` → "Exotic, Spanish,
  dark"). The studio's feel picker should *use* this, not invent a
  parallel palette.
- **Meter vocabulary.** `src/lib/music/timeSignatures.ts` already teaches
  4/4, 3/4, 6/8, 12/8 (the blues/shuffle door). Song form sits on top of
  that clock.
- **Piano Roll as the edit surface.** `/piano-roll` already draws, plays,
  locks to a scale, and copies a melody export. The studio should
  **deep-link a session into the roll**, not grow a second piano roll.
- **Shared audio, on consent.** `AudioContextProvider` is in the root
  layout. Playing a feel *is* consent. Default muted. Lightweight
  synthesis — no sample packs.
- **Genre as a stack of layers.** The [Genre Lab plan](genre-lab-module.md)
  already models a feel as rhythm + meter + harmony + scale + form +
  texture. Songwriting Studio is the *applied* version of that stack: the
  user picks a neighborhood, then writes inside it.
- **Hosting inflection already named.**
  [hosting-and-auth-direction.md](../sketches/hosting-and-auth-direction.md)
  Phase 4 is "AI / DAW shell": audio stays in the browser; the host owns
  accounts, save, share, and server AI. Vercel AI SDK is the sketched
  path. Adding a real AI coach means dropping `output: "export"`.
- **README already reserved the slot.** "AI Feature Ideas" lists song
  interpretation and scale recognition. This plan is the first *user-facing*
  AI module that matches the philosophy (coach, don't generate).

### Sibling modules (don't duplicate, cross-link)

| Module | Teaches / does | Studio's relationship |
|--------|----------------|------------------------|
| [Genre Lab](genre-lab-module.md) | What *makes* blues / jazz / a maqam-adjacent feel itself | Studio *consumes* a `FeelPalette` (groove + scale + stock progressions). Genre Lab *teaches* those layers. Same data if possible; do not fork grooves. |
| [Lessons](lessons-module.md) | What a scale / chord / meter *is* | "Why this progression?" links out. Studio does not teach theory from scratch. |
| Piano Roll | Paint and hear notes | "Open this demo on the roll." Session → `SongDocument` → existing loader. |
| Synth | Play pitches / voicings | Chord preview and melody contour use the existing synth engine. |
| [Self-hosted MIDI library](self-hosted-midi-library.md) | Load *other people's* songs | Opposite direction. Studio *writes* a document; the library *reads* one. Share the format. |
| [Klezmer / Yiddish corpus](klezmer-yiddish-dataset.md) | A repertoire | A "klezmer / Ahava Rabbah" feel can hang on those modes later. Don't special-case it in v1. |
| Auth / save ([hosting sketch](../sketches/hosting-and-auth-direction.md)) | Accounts, DB | Local-first sessions first. Cloud save is what makes "come back tomorrow" reliable. |

---

## Product principle: coach, don't ghostwrite

Every AI or rule-based suggestion is a **proposal the user can hear and
reject**. The poem on the page is the source of truth until the user
explicitly applies a change.

Consequences:

1. **Never silently replace a line.** Suggestions render as a diff or a
   side card: "this couplet could be the chorus because it already
   repeats" — not a rewritten stanza in the main editor.
2. **Prefer marking and arranging over inventing.** The first coaching
   move is *section the text they already wrote* (verse / chorus / bridge
   / leftover lines), not "here is a better hook."
3. **Language help is structural.** Rhyme options, syllable counts,
   "this line is a beat long at this tempo," "these two images fight" —
   not a second author. Optional "try this alternate phrasing" is opt-in
   and always attributed as a suggestion.
4. **Music help is a closed catalog, not a model jam.** The model may
   *recommend* "try a 12-bar in A, shuffle, blues scale" from a typed
   palette. The notes themselves come from deterministic voicers and
   groove patterns we own and can hear-test. A hallucinated chord chart
   that does not match the audio is a philosophy violation.
5. **The user can ignore the coach entirely** and still leave with a
   demo: paste words → pick a feel by ear → export. Coaching is the
   default path, not a gate.

That last point is how we get them to do it again. A tool that
*requires* the AI to be useful trains prompt-dependency. A tool that
works as a feel-and-form workshop, with AI as a good listener, trains
a writing habit.

---

## The session (what it looks like)

One route, one session object, several **stages** on one page — not a
wizard that locks you out of earlier steps. A left rail (or top stepper
on mobile) shows where you are; every stage stays editable. Attract-mode
does not apply here: there is no demo song fighting the user. There *is*
a quiet "replay last feel" so a resting session is never a dead page.

```
/songwriting                         ← hub. What this is; start a session;
                                       recent local sessions; one worked example.
/songwriting/session                 ← the studio (client). New session.
/songwriting/session/[id]            ← later, a saved session (local id first)
```

No nested `/songwriting/chords` routes in v1. Stages are **sections**,
the same decision Genre Lab made about layers.

### Stage 0 — Bring the words

A large, calm editor. Paste a poem, a journal dump, a verse and a
half-chorus, or three lines. Optional title. Optional "this is private"
reminder (we do not publish user text; see Privacy).

Empty-state copy should sound like Instrumaps, not a chatbot:

> Don't study songwriting. Bring something you already wrote.

A secondary path: **start from a feel** (pick blues / jazz / etc. first,
then write into it). Same session, swapped default stage. Some people
hear a groove before they have words; don't force the poem-first funnel.

### Stage 1 — Hear the language (structure)

The coach (rules first; AI when it exists) proposes a **form map** over
the user's text — it does not rewrite it:

- Candidate sections: verse, chorus, pre-chorus, bridge, leftover.
- Why: repetition, refrain-shaped lines, a turn in the last stanza.
- A syllable / stress sketch per line ("this line wants 3 stresses;
  at 80 BPM in 4/4 that's about one bar").
- Honest unknowns: free verse with no meter is allowed; we say so
  instead of forcing 8-bar boxes.

The user **assigns** sections by dragging or tagging lines. That
assignment is the first piece of session data that is *theirs*.

Language suggestions stay on a card:

- "These two lines already function as a refrain — try them as the
  chorus and leave the wording."
- "Line 4 is much longer than the others; you could split it, or let
  the melody stretch (that's a 6/8 move)."
- Opt-in: rhyme / near-rhyme lists for a line they highlight.
- Opt-in: "tighten this line" — a *suggested* rewrite they must apply.

No chat thread as the primary UI. Chat trains "keep prompting." Cards
and a form map train "make a decision." A small "ask the coach"
overflow is fine for later; it is not v1.

### Stage 2 — Choose a feel

This is the Genre Lab layer stack, used as a **picker you can hear**.

A feel is not a Spotify genre tag. It is a playable bundle:

| Feel (v1 candidates) | Lead layers | Typical scale / mode | Stock progression family | Groove / meter |
|----------------------|-------------|----------------------|--------------------------|----------------|
| **Folk / diary** | form + harmony | major / aeolian | I–V–vi–IV, I–vi–IV–V | straight 4/4, mid tempo |
| **Blues** | form + scale + shuffle | blues / mixolydian | 12-bar I–IV–V | 12/8 or 4/4 shuffle |
| **Jazzy** | harmony + swing | dorian / mixolydian | ii–V–I, minor i–iv–ii–V | swung 8ths, walking bass |
| **Middle-Eastern color** | scale | phrygian / hijaz-shaped (see note) | drone + i–♭II–i, or i–VII–i | 4/4 or a simple 10/8 later; no fake "ethnic" percussion |
| **Waltz / 3** | meter | major / aeolian | I–IV–V in 3/4 | 3/4, bass on 1 |

**Honesty note on "Middle Eastern":** we do not ship a "maqam" label
until someone who knows the repertoire checks the intervals and the
groove. v1 can ship **Phrygian / Hijaz-shaped color** as a *scale
feel* with a drone and a small progression set, and say plainly that
this is a color, not a tradition. Linking [lessons](lessons-module.md)
(Phrygian, later Maqam-Rast) is the teaching move. Inventing a
"Middle Eastern beat" from cliché percussion is the lie.

Each card: one-line cue, playable 2-bar loop (muted default),
burnt-orange on the *signature* layer only (the shuffle, the ♭2, the
snare on 2 and 4). Comparison is available: A/B two feels under the
*same lyric section* so the words stay put and the neighborhood
changes. That is the ScaleComparer's cousin, applied to writing.

The user can also set **key**, **tempo**, and **meter** by hand. The
feel is a default, not a lock. Transpose is a first-class control
(singable range matters more than theoretical purity).

### Stage 3 — Harmony

Two or three **named progressions** from the chosen feel, each as a
`ProgressionStrip` of clickable bars (Genre Lab already named this
widget). Play the loop. Highlight which chord is sounding. Show
Roman numerals *and* chord names in the current key (mono).

The user picks one, or builds a short custom chain from the feel's
chord vocabulary (I, IV, V, vi, ii… — not a free jazz encyclopedia
in v1). Custom still goes through the voicer so the audio matches
the names.

Optional coach card: "your chorus lines land on long vowels — a
slower harmonic rhythm (two bars per chord) will leave them room."
That is language→music, still a suggestion.

### Stage 4 — The bed (rhythm + a few tracks)

Not a mix. Three (maybe four) tracks, generated from the session:

| Track | Role in `SongDocument` | What it is |
|-------|------------------------|------------|
| **Pulse** | `other` (kit) | Synthesized kick/snare/hat from the feel's `GroovePattern`. Quiet. |
| **Bass** | `bass` | Roots (and obvious fifths) of the progression, in the feel's rhythm. |
| **Chords** | `chords` | Pad or guitar-ish stab voicings of the same chart. |
| **Contour** (optional) | `melody` | A *suggested* pitch contour the user can accept, edit, or discard. Never required to export. |

No lead vocal. No fake strings section. If we add a fourth musical
color later (e.g. an offbeat skank for a reggae-adjacent feel), it
is still a teaching texture, not a production.

The user can mute tracks, change tempo, and swap the groove (straight
↔ shuffle) without losing the lyric map.

### Stage 5 — Line the words (optional, high value)

A **lyric ruler**: the current section's lines laid over bars. The
user taps syllables onto beats, or accepts a scansion suggestion.
This is where a poem becomes singable without anyone rewriting it.

If they want a hummed line, they can:

- paint it on an embedded mini-roll (or jump to `/piano-roll` with
  the session loaded), or
- ask for a **contour suggestion** (scale-locked, boring on purpose:
  stepwise, small range). They edit it. We do not generate a hook
  melody and call it theirs.

Lyrics stay attached by syllable order, same as `sequenceToMelody`.

### Stage 6 — Walk away with a demo

The payoff is a short loop they can play, then an **export bundle**:

- **`.mid`** — GM-ish tracks: chords, bass, drums, optional melody.
  This is what a home-studio DAW (Logic, Reaper, Ableton, BandLab)
  actually opens.
- **Session JSON** — `SongDocument` + lyric sections + feel id +
  key/tempo. Re-open in Instrumaps tomorrow.
- **Chord chart** — printable/plain text: key, meter, BPM, section
  order, bar-by-bar names. The thing you take to a band.
- **Audio bounce** (later) — a few bars of the bed as WAV/WebM from
  Web Audio. Nice to have; MIDI + chart is the v1 promise. Do not
  block the module on an offline renderer.

Copy on the export screen should say the quiet part:

> This is a sketch — tempo, feel, and changes. The record happens
> somewhere else, with your voice.

A "Start another session" affordance sits next to export. The habit
loop is: *finished enough to leave → obviously easy to begin again*.

---

## Information architecture & UI feel

Hub-and-spoke like `/harmonica-lab`, `/lessons`, planned `/genres`:

- **`/songwriting`** — server page + `metadata`. What the module is;
  "your words stay yours"; Start; a single worked example (a short
  public-domain poem we have rights to, not a user's diary).
- **`/songwriting/session`** — the client studio. One column on
  mobile (stepper + one stage); two panes on desktop (words/form
  map | feel + roll/player).

Visual language stays Instrumaps: theme tokens, one burnt-orange
spotlight (the current decision: "this is the chorus candidate,"
"this is the signature chord," "this is the heavy beat"), green
only for "this is sounding." Mono for chord names, BPM, syllable
counts. No chatbot bubbles as the brand.

Motion follows the session tempo (`BEAT` from the chosen BPM).
Feel-card loops breathe (a phrase, then rest).
`prefers-reduced-motion`: discrete next-bar / next-suggestion,
not a looping playhead.

Sound: muted default, invite the click, quiet gains, real releases.
A writing tool that startles people mid-journal is a failure.

---

## Data model (keep data out of the components)

Session content lives under `src/lib/songwriting/`, same typed-data
habit as `heroTune.ts` and the planned `src/lib/genres/`.

```ts
type SectionId = "verse" | "chorus" | "pre" | "bridge" | "tag" | "unassigned";

type LyricLine = {
  id: string;
  text: string;          // the user's words, unaltered
  section: SectionId;
  /** Stress / syllable sketch; null if we didn't analyze */
  syllables?: number;
  stresses?: number;
};

type FeelId = "folk" | "blues" | "jazzy" | "phrygian-color" | "waltz";

/** Closed catalog — notes come from here, not from the model. */
type FeelPalette = {
  id: FeelId;
  name: string;
  cue: string;                    // spoken: "shuffle, 12-bar, blues scale"
  signatureLayers: GenreLayer[];  // reuse Genre Lab's layer union
  scale: { root?: string; pattern: keyof typeof SCALE_PATTERNS | keyof typeof MODE_PATTERNS };
  timeSignature: TimeSignature;
  defaultBpm: number;
  grooveId: string;               // → GroovePattern in src/lib/genres/
  progressions: Progression[];    // named, transposable
};

type Progression = {
  id: string;
  name: string;                   // "12-bar blues", "ii–V–I"
  bars: { roman: string; beats: number }[];
};

type SongwritingSession = {
  id: string;
  title?: string;
  createdAt: string;
  lines: LyricLine[];
  feelId: FeelId;
  keyRoot: string;                // "A"
  bpm: number;
  timeSignature: TimeSignature;
  progressionId: string;
  /** Optional user-accepted contour; omitted until they say yes */
  melody?: MelodyEvent[];
  /** Derived — do not store a second copy of notes we can voice */
  document?: SongDocument;
};
```

Rules:

- **The lyric text is never overwritten by a suggestion.** Applying a
  rewrite is an explicit user action that replaces `LyricLine.text`
  and can be undone.
- **`SongDocument` is derived** from feel + key + progression +
  optional melody, via a voicer / groover we unit-test. If the
  document and the chart disagree, the voicer is wrong — fix the
  voicer, don't "tweak the MIDI."
- **Reuse Genre Lab's `GroovePattern`** when that module exists. If
  Songwriting Studio ships first, put grooves in `src/lib/groove/`
  and let both import them (same escape hatch Genre Lab already
  named for Dance).
- **AI output is structured** (section tags, feel id, progression
  id, optional suggested line) and validated against the catalogs.
  Free-form "here's a MIDI hex dump" from a model is rejected.

---

## What the AI does vs what the code does

This split is the whole architecture. Get it wrong and we either
ship a chatbot with a synth, or we block the module on an LLM.

| Job | Owner | Why |
|-----|--------|-----|
| Scan lines into syllables / stresses (good enough) | **Code first** (simple English hyphenation / vowel-group heuristic) | Fast, free, works offline, good enough to line words to bars. AI can *revise* a bad scan. |
| Propose section tags | **AI, optional** | Needs semantic judgment ("this refrain is a chorus"). Rules can guess from repetition without a model. |
| Rhyme / near-rhyme lists | **Code** (or a tiny dictionary) | Don't spend tokens on a rhyming dictionary. |
| "Tighten this line" / image notes | **AI, opt-in** | The only place a model should invent words, and only as a card. |
| Recommend a feel | **AI or a tiny classifier**, constrained to `FeelId` | The model returns an id + a one-sentence why. The palette plays. |
| Chord notes, bass, kit, voicings | **Code** | Honesty + testability. |
| Melody contour suggestion | **Code** (scale-locked random-walk / arpeggio) first; AI later if ever | A boring correct contour beats a pretty wrong one. |
| Export MIDI / chart | **Code** | Deterministic adapters out of `SongDocument`. |

v1 can ship **with no model at all**: paste words, tag sections by
hand, pick a feel by ear, hear three progressions, export MIDI.
That is already a studio session. The AI is a better listener on
top of a workshop that already works.

When a model lands:

- **Vercel AI SDK**, provider-agnostic (already the hosting-sketch
  recommendation). Streaming for suggestion cards only.
- **Structured output** (JSON schema) → validate → apply to
  session. Never pipe model text into the lyric editor.
- **No user text stored on our side** in the first AI slice unless
  they save a session. Prompts go to the provider; say so on the
  hub. See Privacy.
- Dropping `output: "export"` is required for a first-party API
  route. That is the same inflection already documented for auth.
  Do not invent a third-party "call OpenAI from the browser" path
  just to keep the static export — keys would leak, and the
  hosting sketch already told us not to.

---

## Privacy, ownership, consent

User poems and journal entries are **more sensitive than a MIDI
doodle**. Treat them that way from day one.

- **The user owns the words.** We do not claim copyright in their
  lyric. Export files are theirs. (Product-facing license copy
  belongs with [contact-and-licensing.md](contact-and-licensing.md)
  when this ships — add a "your writing" paragraph there, don't
  fork a third license doc.)
- **We do not put user sessions in the public song library.** The
  Piano Roll catalog is *our* corpus (PD / CC / handwritten). A
  studio session is private unless they later choose to share
  (out of scope; see community-MIDI sketch).
- **Local-first.** `localStorage` / IndexedDB for sessions before
  any account exists. Losing a poem because we required signup is
  worse than losing a chord chart.
- **AI disclosure.** If text leaves the browser, the hub and the
  first suggestion card say so. A "coach offline" mode (no AI
  calls) must remain available.
- **Sound still requires a gesture.** Journaling is not consent to
  make noise.

---

## Phased build

### Phase 0 — Content research (no product UI)

- [ ] Lock **three `FeelPalette`s** on paper, each as a groove +
      scale + two progressions, before any studio chrome:
      1. **Folk / diary** — I–V–vi–IV and I–vi–IV–V, straight 4/4.
      2. **Blues** — 12-bar I–IV–V, blues scale, shuffle (share the
         groove with Genre Lab's blues page when it exists).
      3. **Jazzy** — ii–V–I, swing, dorian or major; walking-bass
         *pattern*, not a simulated soloist.
- [ ] Decide the v1 stance on a fourth feel: **Phrygian color**
      (scale-led, drone, honest "this is a color") vs wait for a
      checked maqam lesson. Do not ship a cliché "desert beat."
- [ ] Pick **one public-domain poem** as the hub's worked example
      (so the empty studio isn't the only screenshot). Rights must
      be real — same bar as MIDI ingest.
- [ ] Write the one-line cues ("shuffle, 12-bar," "ii–V–I, swing")
      so the card, the audio, and the sentence match.

### Phase 1 — Workshop without AI (the real v1)

This is the milestone that proves the product. No model, no auth,
can stay on static export.

- [ ] `src/app/songwriting/page.tsx` — hub + metadata.
- [ ] `src/app/songwriting/session/page.tsx` — client studio.
- [ ] `src/lib/songwriting/` — session types, feel palettes,
      progression catalog, voicer (chart → `ChordEvent[]` /
      `SongDocument` tracks), simple syllable count.
- [ ] Add **Songwriting** to `NAV_ITEMS` (`inNav: false`, `beta:
      true`, like Piano Roll). Icon via `src/lib/appIcons.ts`.
- [ ] Stages 0–4 and 6: paste words, hand-tag sections, pick a
      feel by ear, pick a progression, hear the bed, export
      **MIDI + chord chart + session JSON**.
- [ ] Deep-link "Open on the piano roll" with the derived
      `SongDocument` (query or `sessionStorage` — decide once).
- [ ] Persist sessions locally.
- [ ] Reduced-motion + muted-default pass.

### Phase 2 — Lining words to bars

- [ ] Lyric ruler (Stage 5) without a generated melody.
- [ ] Optional scale-locked contour suggestion (code, not AI).
- [ ] Lyrics survive the piano-roll round trip (`MelodyEvent.lyric`).

### Phase 3 — Coach (AI), still not a ghostwriter

- [ ] Drop `output: "export"` *as part of the already-planned
      auth/AI inflection*, not as a one-off for this module.
      Coordinate with the hosting sketch.
- [ ] Structured suggestion endpoint (section tags, feel id,
      progression id, optional line notes). Validate against
      catalogs.
- [ ] Suggestion cards in the studio. Apply / dismiss / undo.
- [ ] Offline / "no coach" toggle remains.
- [ ] Privacy copy on the hub.

### Phase 4 — Return visits & a slightly nicer demo

- [ ] Saved sessions behind accounts (hosting Phase 2–3), so a
      poem started on the phone continues on the desk.
- [ ] Audio bounce of the bed.
- [ ] A/B two feels under the same lyric section.
- [ ] Fourth / fifth palettes only when Genre Lab (or a lesson)
      can stand behind them.
- [ ] "Start another" from export — the habit loop, not a growth
      hack overlay.

---

## Key decisions (open to veto)

1. **Coach, don't ghostwrite.** Main editor is the user's text.
   Suggestions are cards. This is the product, not a tone guideline.
2. **Workshop-first, AI-second.** Phase 1 is a complete tool with
   no model. If we cannot ship that, we do not have a module — we
   have a chat UI.
3. **Closed feel catalog + deterministic voicer.** The model
   chooses from our list; the notes come from code. Honesty and
   tests depend on this.
4. **`SongDocument` is the demo.** No second song format. Piano
   Roll and any future DAW shell consume the same document.
5. **Export is MIDI + chart, not a mixed single.** The user is
   going to a studio; stems they can replace are more honest than
   a pretty MP3 of oscillators.
6. **Reuse Genre Lab grooves and Lessons primitives.** Cross-link;
   don't rewrite "what is a blues scale" inside the studio.
7. **Local-first private sessions.** User writing is not library
   content. Accounts are for *their* continuity, not for our
   corpus.
8. **One route, staged sections, not a locking wizard.** Writers
   jump around. A forced funnel is a form, not a session.
9. **No vocal synthesis / voice clone in any phase on this page.**
   If we ever hum a contour, it is an instrument, clearly not them.
10. **Don't wait on auth, Genre Lab, or a drum-machine instrument.**
    Phase 1 can use a tiny kit and in-repo palettes. When Genre
    Lab's `GroovePattern` exists, switch the import.

## Suggested first milestone

**Phase 1 only:** `/songwriting` hub + a session where you paste a
poem, tag a chorus by hand, click **Blues**, hear a shuffled 12-bar
in a key you choose, mute the kit, and download a MIDI + a six-line
chord chart. Open the same document on the Piano Roll.

That is already "diary entry → launching pad." The coach and the
fancy ruler can wait until that loop feels like Instrumaps.

## Out of scope (for now)

- Full arrangement, mixing, mastering, or "finish the song."
- AI-generated replacement lyrics as the default path.
- Vocal takes, pitch-correction, or voice cloning.
- User-published songs in the public MIDI library.
- A chatbot as the home screen.
- Real-time collaboration / band-in-a-tab.
- Charging for generations (monetization stays with
  [buy-me-a-coffee.md](buy-me-a-coffee.md) / licensing until this
  module has a habit loop).
- Cataloging every genre. Three honest palettes beat twelve
  thin ones — same rule as Genre Lab.
- Depending on sampled kits or copyrighted backing tracks.

## Relevant existing files

| Purpose | Path |
|---------|------|
| Canonical song + track roles | `src/lib/song/types.ts` |
| Roll view from a document | `src/lib/song/toSequence.ts` |
| Lyric-bearing melody / chord events | `src/components/home/heroTune.ts` |
| Yesterday as lyrics-on-a-timeline proof | `src/lib/songs/yesterday.ts` |
| Scale / mode feel language | `src/lib/music/scales.ts` |
| Meter vocabulary | `src/lib/music/timeSignatures.ts` |
| Piano Roll (edit / play / export melody code) | `src/components/midi/MidiLab.tsx` |
| Shared audio | `src/contexts/AudioContext.tsx` |
| Nav + home widgets | `src/lib/navigation.ts` |
| Icon mapping | `src/lib/appIcons.ts` |
| Planned drums (do not block) | `src/instruments/README.md` |
| Genre Lab (feel stack to consume) | `docs/plans/genre-lab-module.md` |
| Lessons (link out) | `docs/plans/lessons-module.md` |
| Auth / AI hosting inflection | `docs/sketches/hosting-and-auth-direction.md` |
| Static-export / deploy constraints | `.cursor/rules/deployment.mdc` |
| User-facing license (add "your writing" later) | `docs/plans/contact-and-licensing.md` |
| README AI slot | `README.md` ("AI Feature Ideas") |

## New files (to create, when we build)

| Purpose | Path |
|---------|------|
| Module hub | `src/app/songwriting/page.tsx` |
| Session studio | `src/app/songwriting/session/page.tsx` |
| Session + feel types | `src/lib/songwriting/types.ts` |
| Feel palettes + progressions | `src/lib/songwriting/palettes.ts` |
| Chart → notes / `SongDocument` | `src/lib/songwriting/voicer.ts` |
| MIDI + chart export | `src/lib/songwriting/export.ts` |
| Local session store | `src/lib/songwriting/storage.ts` |
| Widgets | `src/components/songwriting/{FormMap,FeelPicker,ProgressionStrip,LyricRuler,DemoPlayer,ExportBundle}.tsx` |
