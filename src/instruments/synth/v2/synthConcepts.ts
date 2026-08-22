/**
 * Mini-lessons for the synth's learning panel. One entry per clickable
 * concept on the page; `lessonSlug` points into the lessons registry
 * (src/lib/lessons/registry.ts) for the "full lesson" link.
 *
 * Copy lives here, out of the components, so wording can evolve without
 * touching rendering logic.
 */

export type SynthConceptId =
  | "waveform"
  | "octave"
  | "range"
  | "scale"
  | "scale-lock"
  | "scale-degrees"
  | "frequency"
  | "chord"
  | "computer-keys";

export interface SynthConcept {
  id: SynthConceptId;
  title: string;
  /** Short paragraphs, plain language. Keep it to a glanceable size. */
  body: string[];
  /** Slug in the lessons registry; omit when there's no theory lesson. */
  lessonSlug?: string;
}

export const SYNTH_CONCEPTS: Record<SynthConceptId, SynthConcept> = {
  scale: {
    id: "scale",
    title: "What is a scale?",
    body: [
      "A scale is a small family of notes — usually 7 of the 12 available — chosen so they sound good together. Melodies and chords in a song mostly stay inside one scale, which is why it's also called the song's key.",
      "What gives a scale its character is the spacing between its notes: a step of one key is a half step, two keys is a whole step. The major scale's pattern (whole-whole-half-whole-whole-whole-half) is why C major is exactly the white keys from C to C.",
    ],
    lessonSlug: "scales",
  },
  "scale-lock": {
    id: "scale-lock",
    title: "Scale lock",
    body: [
      "Lock is a practice aid: with it on, keys outside the chosen scale (the red-dotted ones) simply won't sound, so anything you play stays in key.",
      "It's great for finding melodies by ear without wrong notes — but turn it off to hear why the outside notes clash. That contrast is the lesson.",
    ],
    lessonSlug: "scales",
  },
  "scale-degrees": {
    id: "scale-degrees",
    title: "Scale degrees",
    body: [
      "Degrees number a scale's notes 1–7 starting from its root: in C major, C is 1, D is 2, and so on. The numbers matter because they transfer — a melody written as degrees (1-1-5-5-6-6-5) can be played in any key.",
      "Degree 1 is home base; phrases that end there feel finished. Chords are named the same way — the \"five chord\" is built on degree 5.",
    ],
    lessonSlug: "scale-degrees",
  },
  waveform: {
    id: "waveform",
    title: "Waveforms",
    body: [
      "The waveform is the shape the speaker traces as it vibrates, and it decides the tone color: a sine is a pure whistle, a square is hollow like an old video game, a sawtooth is bright and buzzy, a triangle sits between sine and square.",
      "All four shapes at the same key play the same pitch — what changes is the mix of quieter overtones stacked on top of it. That mix is what your ear reads as \"different instrument\".",
    ],
    lessonSlug: "waveforms",
  },
  octave: {
    id: "octave",
    title: "Octaves",
    body: [
      "An octave up means the frequency doubles: A4 is 440 Hz, A5 is 880 Hz. Notes an octave apart blend so completely that we give them the same letter name — the number after the letter (C4, C5) just says which octave.",
      "This control shifts the whole keyboard by one octave at a time; the note pattern repeats identically in each one.",
    ],
    lessonSlug: "octaves",
  },
  range: {
    id: "range",
    title: "Keyboard range",
    body: [
      "Range sets how many octaves are on screen at once. A full piano spans a bit over 7 octaves; two octaves is plenty for melodies and chords, while more octaves make each key narrower.",
      "Widening the range doesn't change any pitches — it only shows more of the same repeating pattern.",
    ],
    lessonSlug: "octaves",
  },
  frequency: {
    id: "frequency",
    title: "Frequency & pitch",
    body: [
      "Pitch is vibration speed, measured in hertz (Hz) — how many times per second the air wiggles. The readout shows the exact frequency of the note you're holding.",
      "Concert tuning pins A4 at 440 Hz and every other note is derived from it: each half step up multiplies the frequency by about 1.0595, and twelve of those steps lands exactly on a doubling — the octave.",
    ],
    lessonSlug: "frequency",
  },
  chord: {
    id: "chord",
    title: "Chords",
    body: [
      "A chord is three or more notes sounding at once. The basic unit is the triad: a root plus the notes a third and a fifth above it — play C, E and G together and the readout names it C Major.",
      "The middle note decides the mood: lower it a half step (C, E♭, G) and the same chord turns minor. Hold any three keys and watch the readout try to name what you've built.",
    ],
    lessonSlug: "chords",
  },
  "computer-keys": {
    id: "computer-keys",
    title: "Playing with the computer keyboard",
    body: [
      "The home row (A S D F …) maps to the white keys and the row above (W E T Y …) to the black keys, mirroring the piano layout. Z and X shift the whole keyboard down or up an octave.",
      "Turn on \"show letters\" to print each key's letter on the keyboard while you learn the mapping.",
    ],
  },
};
