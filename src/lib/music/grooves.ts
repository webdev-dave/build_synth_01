/**
 * Drum patterns as data — no UI, no audio.
 *
 * A `GroovePattern` is the same object whether it is a lesson preset, a
 * `/drums` pattern, or a comparer's B side. Hits live on a **straight
 * grid** (`at` in beats); feel is a playback transform on the clock
 * (`applySwing`), never baked into hit times. So a backbeat can be played
 * straight or swung — which is itself a lesson — and two feels can share
 * one playhead.
 *
 * **The beat is the felt pulse.** In 4/4 that is the quarter note; in 12/8
 * it is the dotted quarter, so a 12/8 bar has *four* beats of three steps
 * (`stepsPerBeat: 3`), not six quarters. That is the teaching point — a
 * shuffle (4/4, swing 2/3) and a slow 12/8 blues share the same four-beat
 * bar — and it is why this file has its own `beatsPerBar`, unlike the
 * piano roll's quarter-note `songBars()`.
 */
import { applySwing, STRAIGHT, TRIPLET_SWING } from "./clock";
import type { TimeSignature } from "./timeSignatures";

export type DrumVoice = "kick" | "snare" | "rim" | "hatClosed" | "hatOpen" | "click";

/** Score order, top to bottom: cymbals, snare-line, kick. */
export const VOICE_ORDER: readonly DrumVoice[] = [
  "hatOpen",
  "hatClosed",
  "rim",
  "snare",
  "kick",
  "click",
];

export const VOICE_LABEL: Record<DrumVoice, string> = {
  kick: "Kick",
  snare: "Snare",
  rim: "Rim",
  hatClosed: "Hi-hat",
  hatOpen: "Open hat",
  click: "Click",
};

export interface DrumHit {
  voice: DrumVoice;
  /** Position in felt beats from the bar start, on the straight grid. */
  at: number;
  /** 0–1. Ghost notes are the same voice, quiet. */
  velocity: number;
}

export type Feel = "straight" | "shuffle" | "swing";

export interface GroovePattern {
  meter: TimeSignature;
  /** Subdivisions per felt beat: 2 (8ths), 3 (triplets / compound), 4 (16ths). */
  stepsPerBeat: 2 | 3 | 4;
  feel: Feel;
  /** Off-beat position within a pair, 0.5 straight … 0.75 hard; see clock.ts. */
  swing: number;
  /** Comfortable tempo to open on, in felt beats per minute. */
  bpm: number;
  hits: DrumHit[];
  /** Spoken count that matches the hits ("ONE and-a TWO and-a …"). */
  cue: string;
}

/** Felt beats in a bar: quarters in simple meters, dotted quarters in compound. */
export function beatsPerBar(meter: TimeSignature): number {
  const [num, den] = meter;
  if (den === 8 && num % 3 === 0 && num >= 6) return num / 3;
  return num * (4 / den);
}

export function stepsPerBar(pattern: Pick<GroovePattern, "meter" | "stepsPerBeat">): number {
  return beatsPerBar(pattern.meter) * pattern.stepsPerBeat;
}

export function swingFor(feel: Feel): number {
  return feel === "straight" ? STRAIGHT : TRIPLET_SWING;
}

const EPS = 1e-6;

/** Straight-grid beat position of a step index. */
export function beatOfStep(step: number, stepsPerBeat: number): number {
  return step / stepsPerBeat;
}

/** Step index of a beat position, or -1 when it isn't on the grid. */
export function stepOfBeat(at: number, stepsPerBeat: number): number {
  const step = at * stepsPerBeat;
  return Math.abs(step - Math.round(step)) < EPS ? Math.round(step) : -1;
}

export function hitAt(
  pattern: GroovePattern,
  voice: DrumVoice,
  step: number,
): DrumHit | undefined {
  const at = beatOfStep(step, pattern.stepsPerBeat);
  return pattern.hits.find((h) => h.voice === voice && Math.abs(h.at - at) < EPS);
}

/** A copy of the pattern with one cell toggled (added at `velocity`, or removed). */
export function toggleHit(
  pattern: GroovePattern,
  voice: DrumVoice,
  step: number,
  velocity = 0.8,
): GroovePattern {
  const at = beatOfStep(step, pattern.stepsPerBeat);
  const existing = hitAt(pattern, voice, step);
  const hits = existing
    ? pattern.hits.filter((h) => h !== existing)
    : [...pattern.hits, { voice, at, velocity }];
  return { ...pattern, hits };
}

/** Voices this pattern uses, in score order — the grid's rows. */
export function voicesOf(pattern: GroovePattern, always: readonly DrumVoice[] = []): DrumVoice[] {
  const used = new Set<DrumVoice>([...always, ...pattern.hits.map((h) => h.voice)]);
  return VOICE_ORDER.filter((v) => used.has(v));
}

/**
 * Where each step column sits across the bar, 0–1, at its *real* time
 * under the pattern's swing. Straight: the "&" at 50% of the beat; triplet
 * shuffle: at 67%. Columns drawn here look late because they are.
 */
export function columnPositions(
  pattern: Pick<GroovePattern, "meter" | "stepsPerBeat">,
  swing: number,
): number[] {
  const total = stepsPerBar(pattern);
  const bpb = beatsPerBar(pattern.meter);
  return Array.from({ length: total }, (_, i) => {
    const at = beatOfStep(i, pattern.stepsPerBeat);
    return applySwing(at, swing, pattern.stepsPerBeat) / bpb;
  });
}

/**
 * The step that is sounding at a linear beat position under `swing`: the
 * last column whose real time has passed. A swung "&" therefore lights
 * late, in step with when it is heard. `beat` may run past the bar (loops).
 */
export function stepAtBeat(
  pattern: Pick<GroovePattern, "meter" | "stepsPerBeat">,
  swing: number,
  beat: number,
): number {
  const bpb = beatsPerBar(pattern.meter);
  const inBar = ((beat % bpb) + bpb) % bpb;
  const cols = columnPositions(pattern, swing).map((f) => f * bpb);
  let step = 0;
  for (let i = 0; i < cols.length; i++) if (cols[i] <= inBar + EPS) step = i;
  return step;
}

/**
 * The spoken count for a grid: "1 & 2 &", "1 trip let", or "1 e & a".
 * Beat numbers are what the reader says on the pulse; the rest are the
 * syllables between them.
 */
export function countLabels(pattern: Pick<GroovePattern, "meter" | "stepsPerBeat">): string[] {
  const bpb = beatsPerBar(pattern.meter);
  const sub: Record<number, string[]> = {
    2: ["&"],
    3: ["trip", "let"],
    4: ["e", "&", "a"],
  };
  const between = sub[pattern.stepsPerBeat] ?? [];
  const out: string[] = [];
  for (let b = 0; b < bpb; b++) out.push(String(b + 1), ...between);
  return out;
}

/**
 * Metric weight per felt beat — what the *bar* says (ONE two THREE four).
 * Beat 1 is heaviest; in a four-beat bar beat 3 is the secondary push;
 * in a three-beat bar only the one is heavy.
 */
export function metricWeights(meter: TimeSignature): number[] {
  const bpb = beatsPerBar(meter);
  return Array.from({ length: bpb }, (_, b) => {
    if (b === 0) return 1;
    if (bpb % 2 === 0 && b === bpb / 2) return 0.6;
    return 0.3;
  });
}

/**
 * Where the *drums* put their weight: the loudest kick/snare/rim hit that
 * lands on each felt beat. The backbeat is the picture where this row and
 * `metricWeights` disagree.
 */
export function drumWeights(pattern: GroovePattern): number[] {
  const bpb = beatsPerBar(pattern.meter);
  const heavy = new Set<DrumVoice>(["kick", "snare", "rim"]);
  return Array.from({ length: bpb }, (_, b) =>
    pattern.hits
      .filter((h) => heavy.has(h.voice) && Math.abs(h.at - b) < EPS)
      .reduce((m, h) => Math.max(m, h.velocity), 0),
  );
}

/** Hits that differ between two patterns — a morph step's diff. */
export function diffHits(a: GroovePattern, b: GroovePattern): { removed: DrumHit[]; added: DrumHit[] } {
  const key = (h: DrumHit) => `${h.voice}@${h.at.toFixed(4)}`;
  const inA = new Map(a.hits.map((h) => [key(h), h]));
  const inB = new Map(b.hits.map((h) => [key(h), h]));
  return {
    removed: a.hits.filter((h) => !inB.has(key(h))),
    added: b.hits.filter((h) => !inA.has(key(h))),
  };
}

/** "beat 3" / "the & of 2" — how a hit position is spoken. */
export function speakBeat(at: number, stepsPerBeat: number): string {
  const beat = Math.floor(at + EPS);
  const frac = at - beat;
  if (frac < EPS) return `beat ${beat + 1}`;
  const labels = countLabels({ meter: [1, 4], stepsPerBeat: stepsPerBeat as 2 | 3 | 4 });
  const step = Math.round(frac * stepsPerBeat);
  const syllable = labels[step] ?? "&";
  return `the ${syllable} of ${beat + 1}`;
}

/** Same hits (voice, position, velocity) regardless of order. */
export function sameHits(a: readonly DrumHit[], b: readonly DrumHit[]): boolean {
  if (a.length !== b.length) return false;
  const key = (h: DrumHit) => `${h.voice}@${h.at.toFixed(4)}@${h.velocity.toFixed(2)}`;
  const sa = [...a].map(key).sort();
  const sb = [...b].map(key).sort();
  return sa.every((k, i) => k === sb[i]);
}

/** Every hit's step index lies on the pattern's grid — the registry's sanity check. */
export function hitsOnGrid(pattern: GroovePattern): boolean {
  const total = stepsPerBar(pattern);
  return pattern.hits.every((h) => {
    const step = stepOfBeat(h.at, pattern.stepsPerBeat);
    return step >= 0 && step < total && h.velocity > 0 && h.velocity <= 1;
  });
}
