"use client";

import { useCallback, useEffect, useRef } from "react";

/** Synthesized impulse response: stereo decaying noise ≈ a small hall. */
function makeImpulse(ctx: AudioContext, seconds = 2.4, decay = 3.2) {
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

/**
 * Minimal synth for the hero: a lead voice, a chord pad, and a shared
 * reverb that lets notes ring into the space between them.
 *
 * The AudioContext is created lazily inside `ensureContext`, which the
 * unmute button calls from its click handler — that user gesture is
 * exactly what browsers require before any sound can play.
 */
export function useHeroAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const busRef = useRef<GainNode | null>(null);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = new AudioContext();

      const bus = ctx.createGain();
      bus.gain.value = 0.5;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 2400;
      bus.connect(filter);

      // Parallel dry/wet split after the filter.
      const dry = ctx.createGain();
      dry.gain.value = 0.75;
      filter.connect(dry);
      dry.connect(ctx.destination);

      const reverb = ctx.createConvolver();
      reverb.buffer = makeImpulse(ctx);
      const wet = ctx.createGain();
      wet.gain.value = 0.35;
      filter.connect(reverb);
      reverb.connect(wet);
      wet.connect(ctx.destination);

      ctxRef.current = ctx;
      busRef.current = bus;
    }
    void ctxRef.current.resume();
  }, []);

  /**
   * Start a lead note; returns a release function. If `sustainSec` is given
   * the note releases itself (melody); otherwise it rings until released
   * (held key presses).
   */
  const noteOn = useCallback((hz: number, sustainSec?: number) => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return () => {};

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = hz;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
    osc.connect(gain);
    gain.connect(bus);
    osc.start(t);

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      const now = ctx.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.stop(now + 0.45);
    };
    if (sustainSec !== undefined) {
      window.setTimeout(release, Math.max(0, sustainSec * 1000 - 250));
    }
    return release;
  }, []);

  /**
   * Schedule a lead note at an absolute AudioContext time — same voice and
   * envelope as `noteOn`, but sample-accurately timed. Used by the MIDI Lab
   * piano roll, which pre-schedules notes slightly ahead of the playhead.
   */
  const noteAt = useCallback((hz: number, when: number, durSec: number) => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return;

    const t = Math.max(when, ctx.currentTime);
    const end = Math.max(t + 0.05, t + durSec - 0.25);
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = hz;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.02);
    gain.gain.setValueAtTime(0.14, end);
    gain.gain.exponentialRampToValueAtTime(0.0001, end + 0.4);
    osc.connect(gain);
    gain.connect(bus);
    osc.start(t);
    osc.stop(end + 0.45);
  }, []);

  /** Soft sine pad: slow swell in, long tail out. Auto-releases. */
  const chordOn = useCallback((hzList: number[], sustainSec: number) => {
    const ctx = ctxRef.current;
    const bus = busRef.current;
    if (!ctx || !bus) return;

    const t = ctx.currentTime;
    const end = t + sustainSec;
    for (const hz of hzList) {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = hz;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.055, t + 0.35);
      gain.gain.setValueAtTime(0.055, Math.max(t + 0.35, end - 0.2));
      gain.gain.exponentialRampToValueAtTime(0.0001, end + 0.9);
      osc.connect(gain);
      gain.connect(bus);
      osc.start(t);
      osc.stop(end + 1);
    }
  }, []);

  const suspend = useCallback(() => {
    void ctxRef.current?.suspend();
  }, []);

  /** The live context, for callers that schedule against its timeline. */
  const getContext = useCallback(() => ctxRef.current, []);

  useEffect(
    () => () => {
      void ctxRef.current?.close();
    },
    []
  );

  return { ensureContext, getContext, noteOn, noteAt, chordOn, suspend };
}
