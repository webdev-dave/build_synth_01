"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import type { MelodyEvent } from "@/components/home/heroTune";
import {
  melodyToSequence,
  melodyTotalTicks,
  sequenceToMelody,
  TICKS_PER_BEAT,
  type MelodyExport,
  type SequenceEvent,
} from "./melodyConvert";
import { loadPianoRoll } from "./pianoRollLoader";

/** The slice of the <webaudio-pianoroll> element API this wrapper uses. */
interface PianoRollElement extends HTMLElement {
  sequence: SequenceEvent[];
  tempo: number;
  cursor: number;
  markstart: number;
  markend: number;
  redraw(): void;
  locate(tick: number): void;
  play(
    actx: AudioContext,
    onNote: (ev: { t: number; g: number; n: number }) => void,
    tick?: number
  ): void;
  stop(): void;
}

export type PianoRollNoteEvent = {
  /** Note-on time, AudioContext timeline (seconds) */
  t: number;
  /** Note-off time, AudioContext timeline (seconds) */
  g: number;
  /** MIDI note number */
  n: number;
};

export type PianoRollHandle = {
  /** Read the painted notes back as hero-tune melody events. */
  getMelody(): MelodyExport;
  /** Start looping playback; note events go to `onNote` with ctx-time stamps. */
  play(ctx: AudioContext, onNote: (ev: PianoRollNoteEvent) => void): void;
  stop(): void;
  rewind(): void;
  /** Discard edits and reseed from the initial melody. */
  reset(): void;
};

type Props = {
  initialMelody: MelodyEvent[];
  bpm: number;
  className?: string;
};

/*
 * Canvas colors can't resolve CSS variables, so these mirror the dark-theme
 * tokens in globals.css (pure neutral hues): background 3.9%, card 5.5%,
 * border/muted 14.9%, muted-foreground 63.9%, foreground 98%.
 */
const ROLL_COLORS = {
  collt: "#161616", // white-key rows — a step above card
  coldk: "#0e0e0e", // black-key rows — card
  colgrid: "#262626", // border
  colnote: "#d4d4d4",
  colnoteborder: "#0a0a0a",
  colnotesel: "#fb923c", // selection is the view's one accent
  colnoteselborder: "#0a0a0a",
  colrulerbg: "#161616",
  colrulerfg: "#a3a3a3", // muted-foreground
  colrulerborder: "#262626",
  colselarea: "rgba(250,250,250,0.08)",
};

const svgSrc = (body: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" preserveAspectRatio="none">${body}</svg>`
  )}`;

/* Playhead in the accent orange (the one thing asking for attention while
   sound plays); range markers in calm neutral instead of the stock green. */
const CURSOR_SRC = svgSrc(
  `<path fill="rgba(251,146,60,0.85)" d="M0,1 24,12 0,23 z"/>`
);
const MARKSTART_SRC = svgSrc(`<path fill="#737373" d="M0,1 24,1 0,23 z"/>`);
const MARKEND_SRC = svgSrc(`<path fill="#737373" d="M0,1 24,1 24,23 z"/>`);

/** Pitch range locked to C4–C5 (MIDI 60–72) — 13 rows, matching NOTES. */
const Y_OFFSET = 60;
const Y_RANGE = 13;
const ROW_PX = 26;
const RULER_PX = 24;

export const PianoRollEditor = forwardRef<PianoRollHandle, Props>(
  function PianoRollEditor({ initialMelody, bpm, className }, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const elRef = useRef<PianoRollElement | null>(null);
    const initialRef = useRef(initialMelody);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      let cancelled = false;
      let el: PianoRollElement | null = null;

      void loadPianoRoll().then(() => {
        if (cancelled) return;
        const melody = initialRef.current;
        const totalTicks = melodyTotalTicks(melody);
        // View: whole melody plus a spare bar, rounded up to a bar line.
        const xrange = Math.ceil((totalTicks + 8) / 8) * 8;

        el = document.createElement("webaudio-pianoroll") as PianoRollElement;
        const attrs: Record<string, string | number> = {
          width: Math.max(640, container.clientWidth),
          height: RULER_PX + Y_RANGE * ROW_PX,
          editmode: "dragmono",
          timebase: 4 * TICKS_PER_BEAT,
          tempo: bpm,
          xrange,
          yrange: Y_RANGE,
          xoffset: 0,
          yoffset: Y_OFFSET,
          grid: TICKS_PER_BEAT, // grid line every beat
          snap: 1,
          markstart: 0,
          markend: totalTicks,
          xruler: RULER_PX,
          yruler: 24,
          kbwidth: 32,
          octadj: -1,
          preload: 0.2, // short lookahead so Stop cuts off almost immediately
          cursorsrc: CURSOR_SRC,
          markstartsrc: MARKSTART_SRC,
          markendsrc: MARKEND_SRC,
          ...ROLL_COLORS,
        };
        // The element reads attributes once in connectedCallback, so they
        // must all be set before it's appended.
        for (const [k, v] of Object.entries(attrs)) {
          el.setAttribute(k, String(v));
        }
        container.appendChild(el);
        el.sequence = melodyToSequence(melody);
        el.redraw();
        elRef.current = el;
      });

      return () => {
        cancelled = true;
        el?.stop();
        el?.remove();
        elRef.current = null;
      };
      // Mount-once: bpm changes are applied via the property below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (elRef.current) elRef.current.tempo = bpm;
    }, [bpm]);

    useImperativeHandle(ref, () => ({
      getMelody() {
        const el = elRef.current;
        if (!el) return { events: [], dropped: 0, lyricMismatch: null };
        return sequenceToMelody(el.sequence, el.markend, initialRef.current);
      },
      play(ctx, onNote) {
        elRef.current?.play(ctx, onNote);
      },
      stop() {
        elRef.current?.stop();
      },
      rewind() {
        elRef.current?.locate(0);
      },
      reset() {
        const el = elRef.current;
        if (!el) return;
        el.stop();
        el.sequence = melodyToSequence(initialRef.current);
        el.markend = melodyTotalTicks(initialRef.current);
        el.locate(0);
        el.redraw();
      },
    }));

    return <div ref={containerRef} className={className} />;
  }
);
