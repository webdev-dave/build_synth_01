/**
 * Mini-lessons for the synth's learning panel. One entry per clickable
 * concept on the page; `lessonHref` is the "full lesson" link — scale
 * concepts point into the Scales module, the rest into the lessons
 * registry (src/lib/lessons/registry.ts).
 *
 * Copy lives here, out of the components, so wording can evolve without
 * touching rendering logic. The `scale-type` entry is the exception: its
 * body is assembled in SynthV2 from the scale catalog for whatever scale
 * is selected, so this file holds only its shell.
 */

export type SynthConceptId =
  | "waveform"
  | "octave"
  | "range"
  | "scale"
  | "scale-type"
  | "scale-lock"
  | "scale-numbers"
  | "relative-keys"
  | "frequency"
  | "chord"
  | "computer-keys";

export interface SynthConcept {
  id: SynthConceptId;
  title: string;
  /** Short paragraphs, plain language. Keep it to a glanceable size. */
  body: string[];
  /** Route of the full lesson; omit when there's no theory lesson. */
  lessonHref?: string;
}

export const SYNTH_CONCEPTS: Record<SynthConceptId, SynthConcept> = {
  scale: {
    id: "scale",
    title: "What is a scale?",
    body: [
      "A scale is a small family of notes — usually 7 of the 12 available — chosen so they sound good together. Melodies and chords in a song mostly stay inside one scale, which is why it's also called the song's key.",
      "What gives a scale its character is the spacing between its notes: a step of one key is a half step, two keys is a whole step. The major scale's pattern (whole-whole-half-whole-whole-whole-half) is why C major is exactly the white keys from C to C.",
      "Picking a scale re-frames the keyboard around its root, so the scale reads left to right from 1 up to 7 — and both ends land on home base. The second dropdown swaps the pattern: modes, pentatonics, the blues scale, and the harmonic-minor family are all just different spacings from the same root.",
    ],
    lessonHref: "/scales/major-scale",
  },
  // With a scale chosen, SynthV2 replaces title, body, facts, and link with
  // the catalog's data for that scale. This copy is what the label shows
  // when nothing is selected yet.
  "scale-type": {
    id: "scale-type",
    title: "Scale type",
    body: [
      "The type is the pattern of steps built on the root. Major and natural minor are the two most songs use; the same dropdown holds the seven modes, the pentatonics and blues scales, the harmonic-minor family (Phrygian dominant, Ukrainian Dorian, double harmonic), and maqam Rast with its quarter tones.",
      "Pick a root first, then a type. The keyboard marks the notes in that scale green and the rest red; lock silences the red ones, numbers label each green key with its degree. Change the type and watch which keys flip — that difference is the scale.",
      "Every type opens a short card here with its notes, degrees, other names, and a link to its full page in Scales.",
    ],
    lessonHref: "/scales",
  },
  "scale-lock": {
    id: "scale-lock",
    title: "Scale lock",
    body: [
      "Lock is a practice aid: with it on, keys outside the chosen scale (the red-dotted ones) simply won't sound, so anything you play stays in key.",
      "It's great for finding melodies by ear without wrong notes — but turn it off to hear why the outside notes clash. That contrast is the lesson.",
    ],
    lessonHref: "/scales/major-scale",
  },
  "scale-numbers": {
    id: "scale-numbers",
    title: "Numbers (scale degrees)",
    body: [
      "These numbers are the scale degrees: each note labeled by its position in the scale, counting up from the root. In C major, C is 1, D is 2, E is 3; switch to G major and that same 1-2-3 lands on G, A, B.",
      "A letter like E only names a pitch — on its own it says nothing about how it will feel. Its number tells you its job: 1 is home, where phrases come to rest; 4 and 5 are the strong pillars; 7 is the restless note that leans up into 1. Play 7 then 1 and you can hear the pull. That role holds in every key — the letter doesn't.",
      "A flat or sharp on a number (♭3, ♯4) says how that degree differs from the major scale: minor's ♭3 sits one key lower than major's 3. That is how one row of numbers can describe every scale in the dropdown — the blues scale's ♭5 and 5 are two different keys, so they get two different labels.",
      'Because the roles travel, melodies do too: "Happy Birthday" is 1-1-2-1-4-3 whether you sing it in C or in F. The numbers are the tune; the letters just follow whichever key you pick.',
    ],
    lessonHref: "/scales/major-scale#degrees",
  },
  "relative-keys": {
    id: "relative-keys",
    title: "Same notes, different home",
    body: [
      "Every major scale has a twin made of the exact same seven notes: its relative minor, whose root sits three half steps below the major root (the relative minor of C major is A minor). Neither scale adds or removes a note; they only disagree about which note is home.",
      "The modes work the same way: D Dorian, E Phrygian, and G Mixolydian are all the notes of C major with a different note treated as home. Phrygian dominant and Ukrainian Dorian do it to A harmonic minor. Click the link next to the Scale label and watch — the marked notes stay put while the keyboard re-frames and the numbers shuffle around the new 1.",
    ],
    lessonHref: "/scales/natural-minor",
  },
  waveform: {
    id: "waveform",
    title: "Waveforms",
    body: [
      "The waveform is the shape the speaker traces as it vibrates, and it decides the tone color: a sine is a pure whistle, a square is hollow like an old video game, a sawtooth is bright and buzzy, a triangle sits between sine and square.",
      'All four shapes at the same key play the same pitch — what changes is the mix of quieter overtones stacked on top of it. That mix is what your ear reads as "different instrument".',
    ],
    lessonHref: "/lessons/waveforms",
  },
  octave: {
    id: "octave",
    title: "Octaves",
    body: [
      "An octave up means the frequency doubles: A4 is 440 Hz, A5 is 880 Hz. Notes an octave apart blend so completely that we give them the same letter name — the number after the letter (C4, C5) just says which octave.",
      "This control shifts the whole keyboard by one octave at a time; the note pattern repeats identically in each one.",
    ],
    lessonHref: "/lessons/octaves",
  },
  range: {
    id: "range",
    title: "Keyboard range",
    body: [
      "Range sets how many octaves are on screen at once. A full piano spans a bit over 7 octaves; two octaves is plenty for melodies and chords, while more octaves make each key narrower.",
      "Widening the range doesn't change any pitches — it only shows more of the same repeating pattern.",
    ],
    lessonHref: "/lessons/octaves",
  },
  frequency: {
    id: "frequency",
    title: "Frequency & pitch",
    body: [
      "Pitch is vibration speed, measured in hertz (Hz) — how many times per second the air wiggles. The readout shows the exact frequency of the note you're holding.",
      "Concert tuning pins A4 at 440 Hz and every other note is derived from it: each half step up multiplies the frequency by about 1.0595, and twelve of those steps lands exactly on a doubling — the octave.",
    ],
    lessonHref: "/lessons/frequency",
  },
  chord: {
    id: "chord",
    title: "Chords",
    body: [
      "A chord is three or more notes sounding at once. The basic unit is the triad: a root plus the notes a third and a fifth above it — play C, E and G together and the readout names it C Major.",
      "The middle note decides the mood: lower it a half step (C, E♭, G) and the same chord turns minor. Hold any three keys and watch the readout try to name what you've built.",
    ],
    lessonHref: "/lessons/chords",
  },
  "computer-keys": {
    id: "computer-keys",
    title: "Playing with the computer keyboard",
    body: [
      "The home row (A S D F …) maps to the white keys and the row above (W E T Y …) to the black keys, mirroring the piano layout. Z and X shift the whole keyboard down or up an octave.",
      'Turn on "show letters" to print each key\'s letter on the keyboard while you learn the mapping.',
    ],
  },
};
