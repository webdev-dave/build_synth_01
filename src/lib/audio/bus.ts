/**
 * The lesson bus — where every synthesized voice goes before the speakers.
 *
 * One per AudioContext: input gain → gentle lowpass → dry + synthesized
 * reverb → compressor as a safety limiter → destination. Voices never
 * connect to `destination` themselves (see .cursor/rules/audio-stack.mdc),
 * so gain staging lives in one place and a chord plus a drum kit plus a
 * lick can't sum past the ceiling.
 *
 * Pure Web Audio. No samples: the reverb's impulse is generated noise.
 */

export interface LessonBus {
  /** Connect voices here. */
  input: GainNode;
  ctx: BaseAudioContext;
}

const BUSES = new WeakMap<BaseAudioContext, LessonBus>();

/** Synthesized impulse response: stereo decaying noise ≈ a small room. */
export function makeImpulse(ctx: BaseAudioContext, seconds = 1.8, decay = 3.4): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * seconds);
  const buffer = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buffer.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return buffer;
}

export function getLessonBus(ctx: BaseAudioContext): LessonBus {
  const existing = BUSES.get(ctx);
  if (existing) return existing;

  const input = ctx.createGain();
  input.gain.value = 0.9;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3500;
  filter.Q.value = 0.5;
  input.connect(filter);

  // Limiter, not a musical compressor: it only acts when the sum gets loud.
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 6;
  limiter.ratio.value = 12;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  limiter.connect(ctx.destination);

  const dry = ctx.createGain();
  dry.gain.value = 0.8;
  filter.connect(dry);
  dry.connect(limiter);

  const reverb = ctx.createConvolver();
  reverb.buffer = makeImpulse(ctx);
  const wet = ctx.createGain();
  wet.gain.value = 0.22;
  filter.connect(reverb);
  reverb.connect(wet);
  wet.connect(limiter);

  const bus: LessonBus = { input, ctx };
  BUSES.set(ctx, bus);
  return bus;
}

/**
 * A gain that reaches zero before the source stops. Every voice uses this
 * so releases are real and nothing clicks or is left running.
 */
export function envelope(
  ctx: BaseAudioContext,
  when: number,
  peak: number,
  attack: number,
  hold: number,
  release: number,
): { gain: GainNode; end: number } {
  const gain = ctx.createGain();
  const g = gain.gain;
  g.setValueAtTime(0.0001, when);
  g.exponentialRampToValueAtTime(Math.max(peak, 0.0001), when + attack);
  const releaseStart = when + attack + hold;
  g.setValueAtTime(Math.max(peak, 0.0001), releaseStart);
  g.exponentialRampToValueAtTime(0.0001, releaseStart + release);
  return { gain, end: releaseStart + release + 0.01 };
}
