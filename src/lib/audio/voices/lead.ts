/**
 * The answering lead — the voice that plays the response lick in the form
 * lesson. Synthesized: two slightly detuned oscillators (a sawtooth for
 * body, a triangle an octave up for edge) through a lowpass whose cutoff
 * opens on the attack and settles, plus a little slow vibrato so a held
 * note breathes. Reads as a horn or a single guitar string without
 * pretending to be either.
 *
 * Same contract as the organ and the kit: a pure function of
 * `(ctx, bus, hz, when, duration)` that builds its graph at the scheduled
 * time and tears it down after the release. Voices go to the lesson bus,
 * never to `destination` (see .cursor/rules/audio-stack.mdc).
 */

import { envelope, type LessonBus } from "@/lib/audio/bus";

export interface LeadOptions {
  /** Peak level at the bus input. */
  level?: number;
  attack?: number;
  release?: number;
  /** Detune between the two oscillators, in cents. */
  spreadCents?: number;
  vibratoHz?: number;
  vibratoCents?: number;
}

export const LEAD_DEFAULTS: Required<LeadOptions> = {
  level: 0.16,
  attack: 0.015,
  release: 0.14,
  spreadCents: 6,
  vibratoHz: 5.5,
  vibratoCents: 5,
};

/** Sound one lead note at `when` for `durationSec` (release follows). */
export function leadNoteAt(
  ctx: BaseAudioContext,
  bus: LessonBus,
  hz: number,
  when: number,
  durationSec: number,
  opts: LeadOptions = {},
): { end: number } {
  const o = { ...LEAD_DEFAULTS, ...opts };
  const hold = Math.max(0.02, durationSec - o.attack - o.release);
  const env = envelope(ctx, when, o.level, o.attack, hold, o.release);

  // The filter opens with the note and closes as it decays — the pluck.
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.value = 1.2;
  filter.frequency.setValueAtTime(Math.min(hz * 6, 5000), when);
  filter.frequency.exponentialRampToValueAtTime(Math.max(hz * 2.5, 300), when + 0.18);
  filter.connect(env.gain);
  env.gain.connect(bus.input);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = o.vibratoHz;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = o.vibratoCents;
  lfo.connect(lfoDepth);

  const saw = ctx.createOscillator();
  saw.type = "sawtooth";
  saw.frequency.value = hz;
  saw.detune.value = -o.spreadCents / 2;
  const sawGain = ctx.createGain();
  sawGain.gain.value = 0.55;
  saw.connect(sawGain);
  sawGain.connect(filter);
  lfoDepth.connect(saw.detune);

  const tri = ctx.createOscillator();
  tri.type = "triangle";
  tri.frequency.value = hz * 2;
  tri.detune.value = o.spreadCents / 2;
  const triGain = ctx.createGain();
  triGain.gain.value = 0.3;
  tri.connect(triGain);
  triGain.connect(filter);
  lfoDepth.connect(tri.detune);

  saw.start(when);
  tri.start(when);
  lfo.start(when);
  saw.stop(env.end);
  tri.stop(env.end);
  lfo.stop(env.end);

  return { end: env.end };
}
