/**
 * The lesson clock — one scheduler for sound and picture.
 *
 * Every timeline widget (chord chart, drum grid, form map) plays through
 * this: audio events are scheduled a little ahead on the AudioContext's
 * clock (the "two clocks" pattern — a coarse JS timer looks ahead, the
 * audio thread fires sample-accurately), and visuals read the same
 * position on requestAnimationFrame. Harmony, rhythm, and form on one page
 * share one engine, so the form map, the chord chart, and the kit can never
 * disagree about "now".
 *
 * Feel is a transform on this clock, not a second engine: hits are stored
 * on a straight grid in beats, and `applySwing` moves the off-beats toward
 * the next beat at schedule time. A 12-bar plays straight or shuffled by
 * changing one number.
 *
 * Pure TypeScript with the time source injected, so the maths and the
 * scheduler can be checked from a Node script. React binding:
 * `src/components/lessons/LessonClock.tsx`.
 */

/** Off-beat position within a pair of subdivisions: 0.5 = straight. */
export const STRAIGHT = 0.5;
/** Triplet shuffle — the off-beat sits on the third triplet (2/3). */
export const TRIPLET_SWING = 2 / 3;
/** Hard shuffle / dotted feel. */
export const HARD_SWING = 0.75;

export const MIN_SWING = STRAIGHT;
export const MAX_SWING = HARD_SWING;

const EPS = 1e-6;

/**
 * Move a straight-grid position (in beats) to its swung time. With
 * `stepsPerBeat` even, every second subdivision (the "&" of "1 &") slides
 * from halfway through its pair to `swing` of the way. On-beats and triplet
 * grids (odd `stepsPerBeat`) are untouched — a triplet grid already is the
 * shuffle's ruler.
 */
export function applySwing(beat: number, swing: number, stepsPerBeat = 2): number {
  if (stepsPerBeat % 2 !== 0 || Math.abs(swing - STRAIGHT) < EPS) return beat;
  const pairLen = 2 / stepsPerBeat;
  const k = Math.floor(beat / pairLen + EPS);
  const r = beat - k * pairLen;
  if (Math.abs(r - pairLen / 2) < EPS) return k * pairLen + pairLen * swing;
  return beat;
}

export function beatsToSeconds(beats: number, bpm: number): number {
  return (beats * 60) / bpm;
}

export function secondsToBeats(seconds: number, bpm: number): number {
  return (seconds * bpm) / 60;
}

export interface ClockEvent {
  /** Position in beats from the start of the cycle, on the straight grid. */
  at: number;
  /** Length in beats; defaults to one step so voices know when to release. */
  duration?: number;
  /** Make the sound: absolute AudioContext time and length in seconds. */
  fire: (when: number, durationSec: number) => void;
}

export interface ClockTrack {
  id: string;
  /** Grid the events sit on — decides which positions swing. Default 2 (8ths). */
  stepsPerBeat?: number;
  /**
   * Events for one cycle. Read at every cycle start (and when the track is
   * added), so a toggle that changes the pattern takes effect next time
   * round without restarting the clock.
   */
  events: () => ClockEvent[];
}

export interface ClockTiming {
  /** AudioContext.currentTime, or a fake for tests. */
  readonly currentTime: number;
}

export interface ClockOptions {
  bpm: number;
  /** Beats in one cycle (12 bars of 4/4 = 48). */
  lengthBeats: number;
  swing?: number;
  loop?: boolean;
  /** Seconds of look-ahead per tick. */
  lookAhead?: number;
  /** Beats of count-in before position 0 — silent, but the position runs. */
  countInBeats?: number;
}

export type ClockState = "stopped" | "playing";

interface TrackRun {
  track: ClockTrack;
  events: ClockEvent[];
  next: number;
}

/**
 * The scheduler. `tick()` must be called every ~25 ms while playing (the
 * React binding uses setInterval); `beatNow()` is what visuals read.
 */
export class ClockEngine {
  bpm: number;
  swing: number;
  loop: boolean;
  lengthBeats: number;
  countInBeats: number;
  readonly lookAhead: number;

  private timing: ClockTiming;
  private tracks = new Map<string, ClockTrack>();
  private runs: TrackRun[] = [];
  private cycleStart = 0;
  private state: ClockState = "stopped";
  private stopListeners = new Set<() => void>();
  private cycleListeners = new Set<(cycle: number) => void>();
  private cycle = 0;

  constructor(timing: ClockTiming, opts: ClockOptions) {
    this.timing = timing;
    this.bpm = opts.bpm;
    this.swing = opts.swing ?? STRAIGHT;
    this.loop = opts.loop ?? false;
    this.lengthBeats = opts.lengthBeats;
    this.countInBeats = opts.countInBeats ?? 0;
    this.lookAhead = opts.lookAhead ?? 0.1;
  }

  get playing(): boolean {
    return this.state === "playing";
  }

  get secPerBeat(): number {
    return 60 / this.bpm;
  }

  addTrack(track: ClockTrack): () => void {
    this.tracks.set(track.id, track);
    if (this.playing) {
      const run = this.makeRun(track);
      // Joining mid-cycle: skip what has already passed.
      const beat = this.beatNow() ?? 0;
      while (run.next < run.events.length && run.events[run.next].at < beat) run.next++;
      this.runs.push(run);
    }
    return () => {
      this.tracks.delete(track.id);
      this.runs = this.runs.filter((r) => r.track.id !== track.id);
    };
  }

  onStop(listener: () => void): () => void {
    this.stopListeners.add(listener);
    return () => this.stopListeners.delete(listener);
  }

  /** Fires when a new cycle begins (loop wrap), with its index. */
  onCycle(listener: (cycle: number) => void): () => void {
    this.cycleListeners.add(listener);
    return () => this.cycleListeners.delete(listener);
  }

  /** Begin at `fromBeat` (after the count-in, if any). */
  start(fromBeat = 0): void {
    const now = this.timing.currentTime;
    this.cycle = 0;
    this.cycleStart =
      now + 0.05 + beatsToSeconds(this.countInBeats, this.bpm) - beatsToSeconds(fromBeat, this.bpm);
    this.runs = [...this.tracks.values()].map((t) => this.makeRun(t));
    for (const run of this.runs) {
      while (run.next < run.events.length && run.events[run.next].at < fromBeat - EPS) run.next++;
    }
    this.state = "playing";
  }

  stop(): void {
    if (this.state === "stopped") return;
    this.state = "stopped";
    this.runs = [];
    for (const l of this.stopListeners) l();
  }

  /**
   * Retime while playing so the current beat stays where it is: the
   * tempo slider is a live control, not a restart.
   */
  setBpm(bpm: number): void {
    if (this.playing) {
      const now = this.timing.currentTime;
      const beat = secondsToBeats(now - this.cycleStart, this.bpm);
      this.bpm = bpm;
      this.cycleStart = now - beatsToSeconds(beat, bpm);
    } else {
      this.bpm = bpm;
    }
  }

  /**
   * Linear (straight-grid) beat position in the current cycle, or null when
   * stopped. Negative during a count-in. Visuals derive everything from
   * this one number.
   */
  beatNow(): number | null {
    if (!this.playing) return null;
    return secondsToBeats(this.timing.currentTime - this.cycleStart, this.bpm);
  }

  /** Absolute time an event on the straight grid will sound, swing applied. */
  timeOf(at: number, stepsPerBeat = 2): number {
    return this.cycleStart + beatsToSeconds(applySwing(at, this.swing, stepsPerBeat), this.bpm);
  }

  /** Schedule everything due before `now + lookAhead`; wrap or stop at the cycle end. */
  tick(): void {
    if (!this.playing) return;
    const now = this.timing.currentTime;
    const horizon = now + this.lookAhead;
    const cycleEnd = this.cycleStart + beatsToSeconds(this.lengthBeats, this.bpm);

    for (const run of this.runs) {
      const steps = run.track.stepsPerBeat ?? 2;
      while (run.next < run.events.length) {
        const ev = run.events[run.next];
        const when = this.timeOf(ev.at, steps);
        if (when >= horizon) break;
        const durBeats = ev.duration ?? 1 / steps;
        const end = this.timeOf(ev.at + durBeats, steps);
        // Never fire into the past: a tick that arrived late still sounds now.
        ev.fire(Math.max(when, now), Math.max(0.02, end - Math.max(when, now)));
        run.next++;
      }
    }

    if (cycleEnd < horizon) {
      if (this.loop) {
        this.cycleStart = cycleEnd;
        this.cycle++;
        this.runs = [...this.tracks.values()].map((t) => this.makeRun(t));
        for (const l of this.cycleListeners) l(this.cycle);
        // The new cycle's first events may already be inside the horizon.
        this.tick();
      } else if (now >= cycleEnd) {
        this.stop();
      }
    }
  }

  private makeRun(track: ClockTrack): TrackRun {
    const events = [...track.events()].sort((a, b) => a.at - b.at);
    return { track, events, next: 0 };
  }
}

/**
 * Bar / beat / step for a beat position — what a position read-out prints
 * ("Bar 5 of 12 · beat 2"). `beatsPerBar` is quarter-note beats.
 */
export function positionOf(
  beat: number,
  beatsPerBar: number,
  stepsPerBeat = 2,
): { bar: number; beatInBar: number; step: number } {
  const bar = Math.floor(beat / beatsPerBar);
  const inBar = beat - bar * beatsPerBar;
  return {
    bar,
    beatInBar: Math.floor(inBar),
    step: Math.floor((inBar - Math.floor(inBar)) * stepsPerBeat),
  };
}
