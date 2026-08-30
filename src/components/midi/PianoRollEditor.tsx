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
import { ticksPerBar } from "@/lib/music/timeSignatures";
import { rollPlaybackTempo } from "@/lib/song/ticks";
import { cn } from "@/lib/utils";

/** The slice of the <webaudio-pianoroll> element API this wrapper uses. */
interface PianoRollElement extends HTMLElement {
  sequence: SequenceEvent[];
  tempo: number;
  cursor: number;
  markstart: number;
  markend: number;
  timer?: number;
  tick1: number;
  actx?: AudioContext;
  playcallback?: (ev: { t: number; g: number; n: number }) => void;
  redraw(): void;
  layout?(): void;
  locate(tick: number): void;
  play(
    actx: AudioContext,
    onNote: (ev: { t: number; g: number; n: number }) => void,
    tick?: number
  ): void;
  stop(): void;
  timebase: number;
  editmode: string;
  hasScale: boolean;
  lockToScale: boolean;
  isNoteInScale: ((noteNumber: number) => boolean) | null;
  onNoteSelect: ((note: SequenceEvent | null) => void) | null;
  pressedKey?: number | null;
  _cleanup?: () => void;
  delSelectedNote(): void;
  saveState(): void;
  clearHistory(): void;
  undo(): void;
  redo(): void;
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
  deleteSelected(): void;
  undo(): void;
  redo(): void;
  zoomX(factor: number): void;
  zoomY(factor: number): void;
};

type Props = {
  initialMelody: MelodyEvent[];
  /** When set, painted onto the roll instead of converting `initialMelody`. */
  initialSequence?: SequenceEvent[];
  bpm: number;
  bars?: number;
  beatsPerBar?: number;
  /** Bottom number of the time signature (4 = quarter gets the beat). */
  beatUnit?: number;
  pitchMin?: number;
  pitchRange?: number;
  isDeleteMode?: boolean;
  hasScale?: boolean;
  lockToScale?: boolean;
  isNoteInScale?: (note: number) => boolean;
  className?: string;
  onPreviewNote?: (note: number) => void;
  onNoteSelected?: (note: SequenceEvent | null) => void;
  onHistoryChange?: (canUndo: boolean, canRedo: boolean) => void;
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

/** Hero default: C4–C5 (MIDI 60–72). MIDI songs pass their own range. */
const DEFAULT_PITCH_MIN = 60;
const DEFAULT_PITCH_RANGE = 13;
const ROW_PX = 26;
const COMPACT_ROW_PX = 16;
const RULER_PX = 24;

export const PianoRollEditor = forwardRef<PianoRollHandle, Props>(
  function PianoRollEditor(props, ref) {
    const {
      initialMelody,
      initialSequence,
      bpm,
      bars = 8,
      beatsPerBar = 4,
      beatUnit = 4,
      pitchMin = DEFAULT_PITCH_MIN,
      pitchRange = DEFAULT_PITCH_RANGE,
      isDeleteMode = false,
      hasScale = false,
      lockToScale = false,
      isNoteInScale,
      className,
      onPreviewNote,
      onNoteSelected,
      onHistoryChange,
    } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const elRef = useRef<PianoRollElement | null>(null);
    const initialRef = useRef(initialMelody);
    const seedSequence = initialSequence ?? melodyToSequence(initialMelody);
    const seedSeqRef = useRef(seedSequence);
    // Keep track of user's custom zoom level so we can preserve it across song loads
    const customZoomRef = useRef<{ xrange: number; yrange: number } | null>(null);
    const seedTicks = initialSequence
      ? seedSequence.reduce((m, ev) => Math.max(m, ev.t + ev.g), 0)
      : melodyTotalTicks(initialMelody);
    const seedTicksRef = useRef(seedTicks);
    const DEFAULT_VISIBLE_ROWS = 16;
    const editorHeight = RULER_PX + DEFAULT_VISIBLE_ROWS * ROW_PX;
    const previewRef = useRef(onPreviewNote);
    const selectRef = useRef(onNoteSelected);
    const historyRef = useRef(onHistoryChange);

    useEffect(() => {
      previewRef.current = onPreviewNote;
    }, [onPreviewNote]);
    
    useEffect(() => {
      selectRef.current = onNoteSelected;
    }, [onNoteSelected]);
    
    useEffect(() => {
      historyRef.current = onHistoryChange;
    }, [onHistoryChange]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      let cancelled = false;
      let el: PianoRollElement | null = null;

      void loadPianoRoll().then(() => {
        if (cancelled) return;
        const totalTicks = seedTicksRef.current;
        const barTicks = ticksPerBar([beatsPerBar, beatUnit]);
        const xrange = bars * barTicks;

        el = document.createElement("webaudio-pianoroll") as PianoRollElement;
        const DEFAULT_VISIBLE_BARS = 8;
        
        // If the user has a custom zoom preference, use it.
        // Otherwise, use the comfortable default horizontal zoom (8 bars wide).
        const initialXRange = customZoomRef.current 
           ? customZoomRef.current.xrange 
           : Math.min(xrange, DEFAULT_VISIBLE_BARS * barTicks);
           
        const initialYRange = customZoomRef.current
           ? customZoomRef.current.yrange
           : 16; // Sensible fixed vertical zoom by default

        // Center the view on the song's actual pitch range
        const actualPitchMin = pitchMin ?? DEFAULT_PITCH_MIN;
        const actualPitchRange = pitchRange ?? DEFAULT_PITCH_RANGE;
        const initialYOffset = Math.max(0, Math.floor(actualPitchMin + (actualPitchRange / 2) - (initialYRange / 2)));

        const attrs: Record<string, string | number> = {
          width: container.clientWidth,
          height: editorHeight,
          editmode: "dragpoly", // polyphonic mode allows overlapping notes/chords
          timebase: barTicks,
          tempo: rollPlaybackTempo(bpm, barTicks),
          xrange: initialXRange,
          yrange: initialYRange,
          xoffset: 0,
          yoffset: initialYOffset,
          grid: beatUnit === 8 ? 1 : TICKS_PER_BEAT,
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
        
        // Pass note selection events out
        el.onNoteSelect = (ev: SequenceEvent | null) => {
           if (selectRef.current) selectRef.current(ev);
        };
        
        container.appendChild(el);
        el.sequence = seedSeqRef.current;
        if (el.clearHistory) el.clearHistory();
        if (el.saveState) el.saveState();
        el.redraw();
        elRef.current = el;

        // Make the canvas responsive
        const resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            if (el) {
              const newWidth = entry.contentRect.width;
              if (newWidth > 0) {
                el.setAttribute("width", String(newWidth));
                if (el.layout) el.layout();
                el.redraw();
              }
            }
          }
        });
        resizeObserver.observe(container);

        el.addEventListener("historychange", (e: Event) => {
          const detail = (e as CustomEvent).detail;
          if (historyRef.current && detail) {
            historyRef.current(detail.canUndo, detail.canRedo);
          }
        });

        // Custom click handler for the ruler area (to jump playhead or set markers)
        // and keyboard area (to preview notes)
        el.addEventListener("pointerdown", (e) => {
          const rect = el!.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const x = e.clientX - rect.left;
          const kbwidth = Number(el!.getAttribute("kbwidth")) || 32;
          const yruler = Number(el!.getAttribute("yruler")) || 24;

          if (y <= RULER_PX) {
            if (x > yruler + kbwidth) {
              const graphWidth = rect.width - yruler - kbwidth;
              let tick = ((x - yruler - kbwidth) / graphWidth) * Number(el!.getAttribute("xrange"));
              // Snap to the nearest 16th note (1 tick)
              tick = Math.round(tick);
              
              if (e.shiftKey) {
                // Shift-click sets the loop end
                if (tick > el!.markstart) el!.markend = tick;
              } else if (e.altKey || e.metaKey) {
                // Alt/Cmd-click sets the loop start
                if (tick < el!.markend) el!.markstart = tick;
              } else {
                // Normal click moves the playhead
                el!.locate(tick);
                // Also update the internal time variables so that if it's currently playing,
                // it immediately resumes from the new playhead location without waiting for the loop
                if (el!.timer) {
                  el!.tick1 = tick;
                  // time1 needs to be recalculated based on the new tick position
                  // The easiest way is to let the plugin's own play() logic reset it
                  const actx = el!.actx;
                  const cb = el!.playcallback;
                  if (actx && cb) {
                    el!.stop();
                    el!.play(actx, cb, tick);
                  }
                }
              }
            }
          } else if (x > yruler && x <= yruler + kbwidth) {
            // Clicked on the piano keyboard area
            const yrange = Number(el!.getAttribute("yrange"));
            const yoffset = Number(el!.getAttribute("yoffset"));
            const steph = (rect.height - RULER_PX) / yrange;
            const n = Math.floor(yoffset - (y - rect.height) / steph);
            
            // Set the pressed key for visual feedback
            el!.pressedKey = n;
            el!.redraw();
            
            if (previewRef.current) {
               previewRef.current(n);
            }
          }
        }, true);
        
        const clearPressedKey = () => {
           if (el!.pressedKey !== undefined && el!.pressedKey !== null) {
              el!.pressedKey = null;
              el!.redraw();
           }
        };
        // Use document to catch release even if mouse leaves the iframe/canvas
        document.addEventListener("pointerup", clearPressedKey);
        document.addEventListener("pointercancel", clearPressedKey);
        
        // Custom wheel handler for zooming and scrolling
        el.addEventListener("wheel", (e) => {
          const rect = el!.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const kbwidth = Number(el!.getAttribute("kbwidth")) || 32;
          const yruler = Number(el!.getAttribute("yruler")) || 24;

          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            
            if (x > yruler + kbwidth) {
               let xrange = Number(el!.getAttribute("xrange"));
               let xoffset = Number(el!.getAttribute("xoffset"));
               
               const graphWidth = rect.width - yruler - kbwidth;
               const mouseTick = xoffset + ((x - yruler - kbwidth) / graphWidth) * xrange;

               if (e.deltaY < 0) { // scroll up -> zoom in
                  xoffset = mouseTick - (mouseTick - xoffset) / 1.15;
                  xrange /= 1.15;
               } else if (e.deltaY > 0) { // scroll down -> zoom out
                  xoffset = mouseTick - (mouseTick - xoffset) * 1.15;
                  xrange *= 1.15;
               }
               
               // Prevent zooming out past the maximum song bounds plus an extra 8 bars
               const timebase = Number(el!.getAttribute("timebase")) || 8;
               const maxTicks = Number(el!.getAttribute("markend")) + (timebase * 8);
               if (xrange > maxTicks) {
                  xrange = maxTicks;
               }
               
               el!.setAttribute("xrange", String(Math.max(4, xrange)));
               el!.setAttribute("xoffset", String(xoffset)); // allow negative xoffset if scrolling left
               
               // Save custom zoom state
               if (customZoomRef.current) {
                   customZoomRef.current.xrange = Math.max(4, xrange);
               } else {
                   customZoomRef.current = { xrange: Math.max(4, xrange), yrange: Number(el!.getAttribute("yrange")) || 16 };
               }
               
               el!.redraw();
            }
          } else {
             // Scroll panning (Vertical & Horizontal)
             e.preventDefault();
             
             let xrange = Number(el!.getAttribute("xrange"));
             let xoffset = Number(el!.getAttribute("xoffset"));
             let yrange = Number(el!.getAttribute("yrange"));
             let yoffset = Number(el!.getAttribute("yoffset"));
             
             const graphWidth = rect.width - yruler - kbwidth;
             const graphHeight = rect.height - RULER_PX;
             
             // Convert pixel delta to tick/note delta
             // DeltaX pans horizontally
             if (e.deltaX !== 0) {
                 const dx = (e.deltaX / graphWidth) * xrange;
                 xoffset += dx;
             }
             
             // DeltaY pans vertically (scrolling down moves view down, so yoffset decreases)
             if (e.deltaY !== 0) {
                 const dy = (e.deltaY / graphHeight) * yrange;
                 yoffset -= dy;
                 // Clamp yoffset so we don't scroll infinitely into empty MIDI space
                 yoffset = Math.max(yrange, Math.min(127, yoffset));
             }
             
             el!.setAttribute("xoffset", String(xoffset));
             el!.setAttribute("yoffset", String(yoffset));
             
             // If user pans manually, we might want to track that so we don't snap them back if they load a new song,
             // but per instructions we only care about persisting the ZOOM preferences, not necessarily the pan position.
             
             el!.redraw();
          }
        }, { passive: false });
        
        // Clean up global listeners on unmount
        el._cleanup = () => {
           document.removeEventListener("pointerup", clearPressedKey);
           document.removeEventListener("pointercancel", clearPressedKey);
           resizeObserver.disconnect();
        };
      });

      return () => {
        cancelled = true;
        if (el?._cleanup) el._cleanup();
        el?.stop();
        el?.remove();
        elRef.current = null;
      };
      // Mount-once: bpm changes are applied via the property below.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (elRef.current) {
        elRef.current.tempo = rollPlaybackTempo(
          bpm,
          ticksPerBar([beatsPerBar, beatUnit]),
        );
      }
    }, [bpm, beatsPerBar, beatUnit]);

    useEffect(() => {
      if (elRef.current) {
        elRef.current.setAttribute("editmode", isDeleteMode ? "eraser" : "dragpoly");
      }
    }, [isDeleteMode]);

    useEffect(() => {
      if (elRef.current) {
        elRef.current.hasScale = hasScale;
        elRef.current.lockToScale = lockToScale;
        elRef.current.isNoteInScale = isNoteInScale ?? null;
        elRef.current.redraw();
      }
    }, [hasScale, lockToScale, isNoteInScale]);

    useEffect(() => {
      if (elRef.current) {
        const barTicks = ticksPerBar([beatsPerBar, beatUnit]);
        elRef.current.timebase = barTicks;
        elRef.current.tempo = rollPlaybackTempo(bpm, barTicks);
        elRef.current.setAttribute("timebase", String(barTicks));
        elRef.current.setAttribute("xrange", String(bars * barTicks));
        elRef.current.setAttribute(
          "grid",
          String(beatUnit === 8 ? 1 : TICKS_PER_BEAT),
        );
        elRef.current.redraw();
      }
    }, [bars, beatsPerBar, beatUnit, bpm]);

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
      deleteSelected() {
        if (elRef.current) {
          elRef.current.delSelectedNote();
          elRef.current.redraw();
          if (elRef.current.saveState) elRef.current.saveState();
        }
      },
      undo() {
        if (elRef.current && elRef.current.undo) {
          elRef.current.undo();
        }
      },
      redo() {
        if (elRef.current && elRef.current.redo) {
          elRef.current.redo();
        }
      },
      reset() {
        const el = elRef.current;
        if (!el) return;
        el.stop();
        el.sequence = seedSeqRef.current.map((ev) => ({ ...ev }));
        el.markend = seedTicksRef.current;
        el.locate(0);
        if (el.clearHistory) el.clearHistory();
        if (el.saveState) el.saveState();
        el.redraw();
      },
      zoomX(factor: number) {
        const el = elRef.current;
        if (!el) return;
        let xrange = Number(el.getAttribute("xrange"));
        let xoffset = Number(el.getAttribute("xoffset"));
        const viewCenter = xoffset + xrange / 2;
        xrange *= factor;
        
        // Prevent zooming out past the maximum song bounds plus an extra 8 bars
        const timebase = Number(el.getAttribute("timebase")) || 8;
        const maxTicks = Number(el.getAttribute("markend")) + (timebase * 8); 
        
        if (xrange > maxTicks) {
           xrange = maxTicks;
        }
        
        xoffset = viewCenter - xrange / 2;
        el.setAttribute("xrange", String(Math.max(4, xrange)));
        el.setAttribute("xoffset", String(xoffset));
        el.redraw();
        
        // Save to user preferences
        if (customZoomRef.current) {
            customZoomRef.current.xrange = Math.max(4, xrange);
        } else {
            customZoomRef.current = { xrange: Math.max(4, xrange), yrange: Number(el.getAttribute("yrange")) || 16 };
        }
      },
      zoomY(factor: number) {
        const el = elRef.current;
        if (!el) return;
        let yrange = Number(el.getAttribute("yrange"));
        let yoffset = Number(el.getAttribute("yoffset"));
        const viewCenter = yoffset - yrange / 2;
        yrange *= factor;
        yrange = Math.max(4, Math.min(127, yrange));
        yoffset = viewCenter + yrange / 2;
        yoffset = Math.max(yrange, Math.min(127, yoffset));
        el.setAttribute("yrange", String(yrange));
        el.setAttribute("yoffset", String(yoffset));
        el.redraw();
        
        // Save to user preferences
        if (customZoomRef.current) {
            customZoomRef.current.yrange = yrange;
        } else {
            customZoomRef.current = { xrange: Number(el.getAttribute("xrange")) || 64, yrange: yrange };
        }
      },
    }));

    return <div ref={containerRef} className={cn("touch-none", className)} />;
  }
);
