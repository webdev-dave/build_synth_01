/**
 * The kit — 808/909-style recipes, synthesized. No samples.
 *
 * Each hit builds its own little node graph at the scheduled time and
 * stops itself — stateless, like `scheduleNote` and the organ. Velocity is
 * a gain multiplier *and* a timbre nudge (a soft snare is darker, a hard
 * one brighter), so ghost notes read as ghosts and not as the same hit
 * turned down. Everything goes to the lesson bus, never to `destination`
 * (see .cursor/rules/audio-stack.mdc). Quiet by default: nothing on a
 * lesson page should startle.
 *
 * Pure functions of `(ctx, bus, when, velocity)` so the recipes can be
 * unit-checked from Node (levels, decay lengths) without a browser, and so
 * `useDrumKit`, a future `/drums` page, and the hero loop share one kit.
 */

import { envelope, type LessonBus } from "@/lib/audio/bus";
import { noiseSource } from "@/lib/audio/noise";
import type { DrumVoice } from "@/lib/music/grooves";

export type DrumHitFn = (
  ctx: BaseAudioContext,
  bus: LessonBus,
  when: number,
  velocity?: number,
) => void;

/** Peak level of each voice at full velocity, at the bus input. */
export const DRUM_LEVELS: Record<DrumVoice, number> = {
  kick: 0.5,
  snare: 0.34,
  rim: 0.22,
  hatClosed: 0.11,
  hatOpen: 0.1,
  click: 0.18,
};

/** Decay of each voice in seconds — hats are short, the kick rings. */
export const DRUM_DECAY: Record<DrumVoice, number> = {
  kick: 0.35,
  snare: 0.18,
  rim: 0.03,
  hatClosed: 0.05,
  hatOpen: 0.25,
  click: 0.02,
};

const clampVel = (v: number) => Math.min(1, Math.max(0.05, v));

/** Sine that drops 150 → 50 Hz in 50 ms, with a 5 ms click on the front. */
export const kickAt: DrumHitFn = (ctx, bus, when, velocity = 1) => {
  const v = clampVel(velocity);
  const env = envelope(ctx, when, DRUM_LEVELS.kick * v, 0.002, 0.01, DRUM_DECAY.kick);
  env.gain.connect(bus.input);

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(150, when);
  osc.frequency.exponentialRampToValueAtTime(50, when + 0.05);
  osc.connect(env.gain);
  osc.start(when);
  osc.stop(env.end);

  // The beater click: a few ms of noise so the hit has a front edge.
  const click = envelope(ctx, when, DRUM_LEVELS.kick * v * 0.3, 0.001, 0.002, 0.005);
  click.gain.connect(bus.input);
  const n = noiseSource(ctx, when, 0.01);
  n.connect(click.gain);
};

/** Triangle body ~190 Hz plus a noise burst through a bandpass; velocity brightens it. */
export const snareAt: DrumHitFn = (ctx, bus, when, velocity = 1) => {
  const v = clampVel(velocity);
  const body = envelope(ctx, when, DRUM_LEVELS.snare * v * 0.5, 0.002, 0.01, 0.1);
  body.gain.connect(bus.input);
  const osc = ctx.createOscillator();
  osc.type = "triangle";
  osc.frequency.setValueAtTime(190, when);
  osc.frequency.exponentialRampToValueAtTime(160, when + 0.08);
  osc.connect(body.gain);
  osc.start(when);
  osc.stop(body.end);

  const wires = envelope(ctx, when, DRUM_LEVELS.snare * v, 0.002, 0.02, DRUM_DECAY.snare);
  wires.gain.connect(bus.input);
  const bp = ctx.createBiquadFilter();
  bp.type = "bandpass";
  // 1.2 kHz for a ghost note, up toward 3 kHz for the backbeat crack.
  bp.frequency.value = 1200 + 1800 * v;
  bp.Q.value = 0.8;
  const n = noiseSource(ctx, when, DRUM_DECAY.snare + 0.03);
  n.connect(bp);
  bp.connect(wires.gain);
};

function hatAt(ctx: BaseAudioContext, bus: LessonBus, when: number, velocity: number, decay: number, level: number) {
  const v = clampVel(velocity);
  const env = envelope(ctx, when, level * v, 0.001, 0.005, decay);
  env.gain.connect(bus.input);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 7000;
  const n = noiseSource(ctx, when, decay + 0.02);
  n.connect(hp);
  hp.connect(env.gain);
}

/** High-passed noise, ~50 ms. */
export const hatClosedAt: DrumHitFn = (ctx, bus, when, velocity = 1) =>
  hatAt(ctx, bus, when, velocity, DRUM_DECAY.hatClosed, DRUM_LEVELS.hatClosed);

/** Same, ~250 ms. */
export const hatOpenAt: DrumHitFn = (ctx, bus, when, velocity = 1) =>
  hatAt(ctx, bus, when, velocity, DRUM_DECAY.hatOpen, DRUM_LEVELS.hatOpen);

/** Cross-stick / rim: a very short 800 Hz sine plus a high-passed tick. */
export const rimAt: DrumHitFn = (ctx, bus, when, velocity = 1) => {
  const v = clampVel(velocity);
  const env = envelope(ctx, when, DRUM_LEVELS.rim * v, 0.001, 0.005, DRUM_DECAY.rim);
  env.gain.connect(bus.input);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 800;
  osc.connect(env.gain);
  osc.start(when);
  osc.stop(env.end);

  const tick = envelope(ctx, when, DRUM_LEVELS.rim * v * 0.6, 0.001, 0.003, 0.02);
  tick.gain.connect(bus.input);
  const hp = ctx.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 2000;
  const n = noiseSource(ctx, when, 0.03);
  n.connect(hp);
  hp.connect(tick.gain);
};

/** Woodblock-ish count click: a short 1.6 kHz sine. Accents are louder and a touch lower. */
export const clickAt: DrumHitFn = (ctx, bus, when, velocity = 1) => {
  const v = clampVel(velocity);
  const env = envelope(ctx, when, DRUM_LEVELS.click * v, 0.001, 0.005, DRUM_DECAY.click);
  env.gain.connect(bus.input);
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = v > 0.75 ? 1300 : 1600;
  osc.connect(env.gain);
  osc.start(when);
  osc.stop(env.end);
};

/**
 * Voice → recipe. Swappable: a sampler variant can replace this map without
 * touching the grid or the clock (`src/instruments/drums/variants/` later).
 */
export const DRUM_KIT: Record<DrumVoice, DrumHitFn> = {
  kick: kickAt,
  snare: snareAt,
  rim: rimAt,
  hatClosed: hatClosedAt,
  hatOpen: hatOpenAt,
  click: clickAt,
};

export function drumHitAt(
  ctx: BaseAudioContext,
  bus: LessonBus,
  voice: DrumVoice,
  when: number,
  velocity = 1,
): void {
  DRUM_KIT[voice](ctx, bus, when, velocity);
}
