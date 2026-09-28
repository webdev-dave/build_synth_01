/**
 * The plain tone — one oscillator of a chosen shape at a chosen frequency,
 * with a real envelope. It exists for the concept demos (waveform, octave,
 * frequency) where the *lesson* is the bare shape or the bare number, so
 * nothing is layered on top: no detune, no filter sweep, no vibrato.
 *
 * Same contract as the other voices: pure function of
 * `(ctx, bus, hz, when, duration)`, graph built at the scheduled time and
 * torn down after the release, output to the lesson bus only.
 */

import { envelope, type LessonBus } from "@/lib/audio/bus";

export type ToneShape = OscillatorType;

export interface ToneOptions {
  shape?: ToneShape;
  /** Peak level at the bus input. Shapes with more overtones read louder. */
  level?: number;
  attack?: number;
  release?: number;
}

/**
 * Perceived-loudness trims so the four shapes sit at a similar level: a
 * sawtooth's stacked overtones carry far more energy than a sine's single
 * partial.
 */
export const TONE_LEVELS: Record<ToneShape, number> = {
  sine: 0.22,
  triangle: 0.2,
  square: 0.11,
  sawtooth: 0.12,
  custom: 0.15,
};

export const TONE_DEFAULTS: Required<Omit<ToneOptions, "level">> = {
  shape: "sine",
  attack: 0.02,
  release: 0.25,
};

/** Sound one tone at `when` for `durationSec` (release follows). */
export function toneAt(
  ctx: BaseAudioContext,
  bus: LessonBus,
  hz: number,
  when: number,
  durationSec: number,
  opts: ToneOptions = {},
): { end: number } {
  const shape = opts.shape ?? TONE_DEFAULTS.shape;
  const attack = opts.attack ?? TONE_DEFAULTS.attack;
  const release = opts.release ?? TONE_DEFAULTS.release;
  const level = opts.level ?? TONE_LEVELS[shape];
  const hold = Math.max(0.02, durationSec - attack - release);
  const env = envelope(ctx, when, level, attack, hold, release);
  env.gain.connect(bus.input);

  const osc = ctx.createOscillator();
  osc.type = shape;
  osc.frequency.value = hz;
  osc.connect(env.gain);
  osc.start(when);
  osc.stop(env.end);
  osc.onended = () => {
    osc.disconnect();
    env.gain.disconnect();
  };

  return { end: env.end };
}
