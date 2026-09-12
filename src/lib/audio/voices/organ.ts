/**
 * The comping organ — a 70s electric-organ voice, synthesized.
 *
 * Drawbar-style additive synthesis: each note is four sine partials at 1×,
 * 2×, 3×, 4× the fundamental with descending gains, all sharing one slow
 * vibrato (a few cents at ~6 Hz — the Leslie-ish wobble, in the sound only,
 * so reduced-motion settings have nothing to do here). Attack is nearly
 * instant and the release is real, so a chord change never clicks.
 *
 * Pure Web Audio, no samples. Every call builds its own node graph at the
 * scheduled time and tears it down after the release — stateless, like the
 * synth's `scheduleNote`. Voices connect to the lesson bus, never to
 * `destination` (see .cursor/rules/audio-stack.mdc).
 */

import type { LessonBus } from "@/lib/audio/bus";

export interface OrganPartial {
  /** Multiple of the fundamental. */
  ratio: number;
  /** Relative gain before the chord's overall level is applied. */
  gain: number;
}

/** Drawbars: fundamental, octave, twelfth, fifteenth. */
export const ORGAN_PARTIALS: readonly OrganPartial[] = [
  { ratio: 1, gain: 1 },
  { ratio: 2, gain: 0.5 },
  { ratio: 3, gain: 0.3 },
  { ratio: 4, gain: 0.15 },
];

export interface OrganOptions {
  /**
   * Peak level of the whole chord at the bus input, however many notes it
   * has — a four-note chord and a single root pulse both stay under it.
   */
  level?: number;
  attack?: number;
  release?: number;
  vibratoHz?: number;
  vibratoCents?: number;
}

export const ORGAN_DEFAULTS: Required<OrganOptions> = {
  level: 0.22,
  attack: 0.008,
  release: 0.15,
  vibratoHz: 6,
  vibratoCents: 7,
};

/** Sum of the partial gains — what one note's oscillators add up to. */
export const ORGAN_PARTIAL_SUM = ORGAN_PARTIALS.reduce((s, p) => s + p.gain, 0);

export interface OrganVoice {
  /** When the last node stops (release included) for a fixed-length chord. */
  end: number;
  /** Let go early or, for an open-ended chord, at all. Idempotent. */
  release: (at?: number) => void;
}

/**
 * Sound a chord at `when` for `durationSec` seconds (release follows), or
 * hold it until `release()` when `durationSec` is `Infinity`. `hzList` is
 * the voicing — one entry per note — so what sounds is exactly what the
 * caller lit on the keyboard.
 */
export function organChordAt(
  ctx: BaseAudioContext,
  bus: LessonBus,
  hzList: readonly number[],
  when: number,
  durationSec: number,
  opts: OrganOptions = {},
): OrganVoice {
  const o = { ...ORGAN_DEFAULTS, ...opts };
  const notes = Math.max(1, hzList.length);
  const perPartial = o.level / (notes * ORGAN_PARTIAL_SUM);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, when);
  env.gain.exponentialRampToValueAtTime(o.level, when + o.attack);
  env.connect(bus.input);

  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = o.vibratoHz;
  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = o.vibratoCents;
  lfo.connect(lfoDepth);

  const oscillators: OscillatorNode[] = [];
  for (const hz of hzList) {
    for (const partial of ORGAN_PARTIALS) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = hz * partial.ratio;
      lfoDepth.connect(osc.detune);
      const g = ctx.createGain();
      // Partial gains are relative to the chord level, which `env` carries.
      g.gain.value = (partial.gain * perPartial) / o.level;
      osc.connect(g);
      g.connect(env);
      osc.start(when);
      oscillators.push(osc);
    }
  }
  lfo.start(when);

  let released = false;
  const release = (at = ctx.currentTime) => {
    if (released) return;
    released = true;
    const t = Math.max(at, when + o.attack);
    env.gain.cancelScheduledValues(t);
    env.gain.setValueAtTime(o.level, t);
    env.gain.exponentialRampToValueAtTime(0.0001, t + o.release);
    const stopAt = t + o.release + 0.01;
    for (const osc of oscillators) osc.stop(stopAt);
    lfo.stop(stopAt);
  };

  if (Number.isFinite(durationSec)) {
    const releaseAt = when + Math.max(durationSec - o.release, o.attack);
    release(releaseAt);
    return { end: releaseAt + o.release + 0.01, release };
  }
  return { end: Infinity, release };
}
