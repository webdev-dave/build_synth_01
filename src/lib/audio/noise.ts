/**
 * One white-noise buffer per AudioContext. Every noise-based hit (snare,
 * hats, rim) plays a slice of it through its own AudioBufferSourceNode, so
 * a bar of hi-hats costs eight tiny source nodes, not eight buffers.
 */

const BUFFERS = new WeakMap<BaseAudioContext, AudioBuffer>();
const SECONDS = 1.5;

export function getNoiseBuffer(ctx: BaseAudioContext): AudioBuffer {
  const existing = BUFFERS.get(ctx);
  if (existing) return existing;
  const length = Math.floor(ctx.sampleRate * SECONDS);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  BUFFERS.set(ctx, buffer);
  return buffer;
}

/** A noise source that starts at `when` from a random offset and stops itself. */
export function noiseSource(
  ctx: BaseAudioContext,
  when: number,
  durationSec: number,
): AudioBufferSourceNode {
  const src = ctx.createBufferSource();
  src.buffer = getNoiseBuffer(ctx);
  // A random offset so two hats in a row are not the same waveform twice.
  const offset = Math.random() * (SECONDS - durationSec - 0.05);
  src.start(when, Math.max(0, offset), durationSec + 0.05);
  return src;
}
