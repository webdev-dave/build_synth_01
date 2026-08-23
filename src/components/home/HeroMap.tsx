"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Pointer, RotateCcw, Volume2, VolumeX } from "lucide-react";

import {
  BEAT,
  CHORDS,
  MELODY_TIMED,
  NODE_CHORDS,
  NOTES,
  TOTAL_BEATS,
  WHITE_NOTES,
  BLACK_NOTES,
  type KeyPos,
  type NoteName,
} from "./heroTune";
import { useHeroAudio } from "./useHeroAudio";

type MapNode = { id: string; x: number; y: number; r: number };

const CENTER: MapNode & { hz: number } = {
  id: "C",
  x: 180,
  y: 150,
  r: 26,
  hz: 261.6,
};

/* Outer nodes complete the 7-note C major scale around the tonic.
   Chromatic melody notes (F♯, G♯) have no node — they only light the
   piano, showing they come from outside the scale. */
const OUTER: MapNode[] = [
  { id: "D", x: 296, y: 66, r: 18 },
  { id: "E", x: 326, y: 170, r: 18 },
  { id: "F", x: 240, y: 264, r: 18 },
  { id: "G", x: 104, y: 262, r: 18 },
  { id: "A", x: 36, y: 158, r: 18 },
  { id: "B", x: 64, y: 62, r: 18 },
];

const NODE_POS: Record<string, MapNode> = Object.fromEntries([
  [CENTER.id, CENTER],
  ...OUTER.map((n) => [n.id, n] as const),
]);
const NODE_INDEX: Record<string, number> = Object.fromEntries(
  OUTER.map((n, i) => [n.id, i]),
);

// Secondary edges between outer nodes, to read as a graph rather than a star.
const LINKS: [MapNode, MapNode][] = [
  [OUTER[0], OUTER[1]], // D–E
  [OUTER[3], OUTER[4]], // G–A
];

// Decorative notation glyphs drifting in the background.
const FLOATS = [
  { glyph: "♪", x: 128, y: 48, size: 14, delay: 0 },
  { glyph: "♭", x: 262, y: 226, size: 13, delay: 1.2 },
  // Kept clear of the top-right corner, where the sound toggle overlays.
  { glyph: "♫", x: 268, y: 30, size: 15, delay: 2.1 },
  { glyph: "♯", x: 34, y: 230, size: 13, delay: 0.7 },
  { glyph: "♬", x: 150, y: 288, size: 14, delay: 1.7 },
  { glyph: "♩", x: 296, y: 300, size: 12, delay: 2.6 },
];

const BAR = BEAT * 4;

/* How many times the demo tune plays per run before resting. */
const DEMO_PASSES = 2;

/* Discoverability ticker — a departure-board line under the instrument
   inviting the visitor to play. It keeps rolling at tempo (motion follows
   music) until the first interaction retires it for good. */
const TICKER_TEXT = "tap a node to hear its chord · tap the keys";
const TICKER_BARS_PER_PASS = 3;

/* Step sequencer: 8 eighth-note steps ticking like a metronome under the
   tune. Steps 1 and 5 (beats 1 & 3) are accented, drum-machine style. */
const STEP_COUNT = 8;
const STEP_Y = 422;
const STEP_X0 = 40;
const STEP_SPACING = 40;
const STEP_TIME = BAR / STEP_COUNT;
const ACCENTS = [0, 4];

/* --- Keyboard: a full C-to-C octave (8 white keys) drawn as one
   continuous instrument body. --- */
const KB = { x: 30, y: 356, w: 300, h: 52, rx: 5 };
const WKEY_W = KB.w / 8;
// Black keys sit on white-key boundaries (none at E–F / B–C).
const BLACK_BOUNDARIES = [1, 2, 4, 5, 6]; // C♯ D♯ F♯ G♯ A♯
const BKEY_W = 22;
const BKEY_H = 32;

type KeyRect = { x: number; y: number; w: number; h: number; rx: number };

const whiteKey = (i: number): KeyRect => ({
  x: KB.x + i * WKEY_W,
  y: KB.y,
  w: WKEY_W,
  h: KB.h,
  rx: 0,
});
const blackKey = (i: number): KeyRect => ({
  x: KB.x + BLACK_BOUNDARIES[i] * WKEY_W - BKEY_W / 2,
  y: KB.y - 2, // extends above the clipped body edge → flush top
  w: BKEY_W,
  h: BKEY_H,
  rx: 3,
});
const keyRect = (pos: KeyPos): KeyRect =>
  pos.kind === "white" ? whiteKey(pos.index) : blackKey(pos.index);

/* Tiny oscilloscope wave shown beside a sounding node's Hz readout.
   36px of sine (period 12px); scrolling +12px loops seamlessly inside a
   24px clip window. Scroll speed scales with the note's actual pitch. */
const wavePath = (cx: number, y: number) =>
  `M${cx - 24} ${y} q3 -3 6 0 t6 0 t6 0 t6 0 t6 0 t6 0`;
const waveScrollDuration = (hz: number) => 392 / hz;

/* A "flash" is one sounding note: the melody sequencer, user key presses,
   and node-chord clicks all emit them, and every animated layer (key glow,
   node ring, travelling pulse, Hz readout) renders from this one list. */
type Flash = {
  id: number;
  note: NoteName;
  beats: number;
  origin: "melody" | "key" | "node";
};

export function HeroMap() {
  const reduce = useReducedMotion();
  const { ensureContext, noteOn, chordOn, suspend } = useHeroAudio();

  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);

  const [flashes, setFlashes] = useState<Flash[]>([]);
  const flashSeq = useRef(0);

  /* The demo tune plays DEMO_PASSES times and then rests. It also rests the
     moment the visitor starts playing, and it stays quiet — no auto-return.
     Only the replay button starts another run of DEMO_PASSES. */
  const [demoPlaying, setDemoPlaying] = useState(true);

  /* First key press or node tap retires the invitation ticker forever. */
  const [hasInteracted, setHasInteracted] = useState(false);
  const tickerWindowRef = useRef<HTMLDivElement>(null);
  const tickerTextRef = useRef<HTMLSpanElement>(null);
  /* The marquee needs real pixel widths (enter from the window's right
     edge, exit fully left), so it starts invisible until measured. */
  const [tickerDims, setTickerDims] = useState<{
    win: number;
    text: number;
  } | null>(null);

  useEffect(() => {
    if (reduce) return;
    const win = tickerWindowRef.current?.offsetWidth ?? 0;
    const text = tickerTextRef.current?.scrollWidth ?? 0;
    if (win && text) setTickerDims({ win, text });
  }, [reduce]);

  const [pressed, setPressed] = useState<NoteName | null>(null);
  const pressedRef = useRef<NoteName | null>(null);
  const releaseAudioRef = useRef<(() => void) | null>(null);

  /* While a chord that doesn't contain C sounds, the center node loses its
     ring — its ever-present border would otherwise imply C is playing.
     Timed to the chord's sustain, so C circles back the moment it ends. */
  const [centerDimmed, setCenterDimmed] = useState(false);
  const centerDimTimer = useRef<number | null>(null);

  const fireNote = useCallback(
    (note: NoteName, beats: number, origin: Flash["origin"]) => {
      const id = ++flashSeq.current;
      setFlashes((fs) => [...fs, { id, note, beats, origin }]);
      if (origin !== "key" && !mutedRef.current) {
        noteOn(NOTES[note].hz, beats * BEAT);
      }
      window.setTimeout(
        () => {
          setFlashes((fs) => fs.filter((f) => f.id !== id));
        },
        (beats * BEAT + 0.8) * 1000,
      );
    },
    [noteOn],
  );

  /* Sequencer — melody and chord pad share one timeline. Each pass
     schedules every event of one loop, then re-arms itself until the run
     of DEMO_PASSES is spent. Only audible passes count toward the run:
     while muted the demo loops on, so unmuting late never lands on a
     stage that has already gone quiet. */
  useEffect(() => {
    if (!demoPlaying) return;
    const timers: number[] = [];
    const loopMs = TOTAL_BEATS * BEAT * 1000;

    const scheduleLoop = (offsetMs: number, pass: number) => {
      /* Captured at (near) pass start — a pass only counts if the user
         could hear it from the top. */
      const audible = !mutedRef.current;
      for (const ev of MELODY_TIMED) {
        timers.push(
          window.setTimeout(
            () => fireNote(ev.note, ev.beats, "melody"),
            offsetMs + ev.at * BEAT * 1000,
          ),
        );
      }
      for (const chord of CHORDS) {
        timers.push(
          window.setTimeout(
            () => {
              if (!mutedRef.current) chordOn(chord.hz, chord.beats * BEAT);
            },
            offsetMs + chord.at * BEAT * 1000,
          ),
        );
      }
      timers.push(
        window.setTimeout(() => {
          const counted = audible ? pass + 1 : pass;
          if (counted < DEMO_PASSES) scheduleLoop(0, counted);
          else setDemoPlaying(false);
        }, offsetMs + loopMs),
      );
    };

    scheduleLoop(800, 0);
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [demoPlaying, fireNote, chordOn]);

  /* Any playing by the visitor ends the demo run for good — it only comes
     back via the replay button. It also retires the invitation ticker. */
  const markInteraction = useCallback(() => {
    setDemoPlaying(false);
    setHasInteracted(true);
  }, []);

  /* Playing the piano or a node is itself a user gesture — that click may
     create the AudioContext, so sound turns on automatically. */
  const unlockAudio = useCallback(() => {
    if (!mutedRef.current) return;
    ensureContext();
    mutedRef.current = false;
    setMuted(false);
  }, [ensureContext]);

  const pressKey = useCallback(
    (note: NoteName) => {
      if (pressedRef.current === note) return;
      unlockAudio();
      markInteraction();
      pressedRef.current = note;
      setPressed(note);
      releaseAudioRef.current?.();
      releaseAudioRef.current = mutedRef.current
        ? null
        : noteOn(NOTES[note].hz);
      fireNote(note, 1, "key");
    },
    [unlockAudio, markInteraction, noteOn, fireNote],
  );

  const releaseKey = useCallback(() => {
    pressedRef.current = null;
    setPressed(null);
    releaseAudioRef.current?.();
    releaseAudioRef.current = null;
  }, []);

  const tapKey = useCallback(
    (note: NoteName) => {
      pressKey(note);
      window.setTimeout(releaseKey, 450);
    },
    [pressKey, releaseKey],
  );

  /* Clicking a map node plays its diatonic chord on the piano — a light
     strum, each tone flashing its own node and dropping a pulse to its key. */
  const playChord = useCallback(
    (nodeId: string) => {
      const chord = NODE_CHORDS[nodeId];
      if (!chord) return;
      unlockAudio();
      markInteraction();
      const chordBeats = 1.5;
      chord.notes.forEach((note, i) => {
        window.setTimeout(() => fireNote(note, chordBeats, "node"), i * 50);
      });

      if (centerDimTimer.current) window.clearTimeout(centerDimTimer.current);
      const containsC = chord.notes.some((n) => NOTES[n].node === CENTER.id);
      if (containsC) {
        setCenterDimmed(false);
      } else {
        setCenterDimmed(true);
        centerDimTimer.current = window.setTimeout(
          () => setCenterDimmed(false),
          chordBeats * BEAT * 1000 + 100,
        );
      }
    },
    [unlockAudio, markInteraction, fireNote],
  );

  const nodeInteractionProps = (nodeId: string) => ({
    role: "button" as const,
    tabIndex: 0,
    "aria-label": `Play ${NODE_CHORDS[nodeId]?.name ?? nodeId} chord`,
    className: "cursor-pointer outline-none",
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      playChord(nodeId);
    },
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        playChord(nodeId);
      }
    },
  });

  useEffect(() => {
    window.addEventListener("pointerup", releaseKey);
    window.addEventListener("pointercancel", releaseKey);
    return () => {
      window.removeEventListener("pointerup", releaseKey);
      window.removeEventListener("pointercancel", releaseKey);
    };
  }, [releaseKey]);

  /* Unmuting is the user gesture browsers require before audio may play —
     the AudioContext is created right here in the click handler. */
  const toggleMute = () => {
    if (muted) {
      ensureContext();
      mutedRef.current = false;
      setMuted(false);
    } else {
      suspend();
      mutedRef.current = true;
      setMuted(true);
    }
  };

  /* Key glows: melody flashes get a played-note envelope; the held key
     gets a steady glow. White glows layer under the black keys. */
  const renderKeyGlows = (kind: "white" | "black") => {
    const glows = flashes
      .filter((f) => f.origin !== "key" && NOTES[f.note].key.kind === kind)
      .map((f) => {
        const rect = keyRect(NOTES[f.note].key);
        const duration = f.beats * BEAT + 0.3;
        return reduce ? (
          <rect
            key={`glow-${f.id}`}
            x={rect.x}
            y={rect.y}
            width={rect.w}
            height={rect.h}
            rx={rect.rx}
            fill="url(#key-glow)"
            opacity={0.6}
          />
        ) : (
          <motion.rect
            key={`glow-${f.id}`}
            x={rect.x}
            y={rect.y}
            width={rect.w}
            height={rect.h}
            rx={rect.rx}
            fill="url(#key-glow)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.75, 0] }}
            transition={{
              duration,
              times: [0, 0.08, 0.7, 1],
              ease: "easeInOut",
            }}
          />
        );
      });

    if (pressed && NOTES[pressed].key.kind === kind) {
      const rect = keyRect(NOTES[pressed].key);
      glows.push(
        <rect
          key="pressed"
          x={rect.x}
          y={rect.y}
          width={rect.w}
          height={rect.h}
          rx={rect.rx}
          fill="url(#key-glow)"
          opacity={0.9}
        />,
      );
    }
    return glows;
  };

  /* Map-side visuals for a flash: travelling pulse, node ring, Hz readout.
     Chromatic notes resolve to the neighbor node they borrow (`alt`). */
  const flashNodeId = (f: Flash) =>
    NOTES[f.note].node ?? NOTES[f.note].alt?.node;
  const nodeFlashes = flashes.filter((f) => flashNodeId(f));

  /* While an accidental sounds, its borrowed node relabels (F → F♯ …). */
  const alterations: Record<string, string> = {};
  for (const f of flashes) {
    const alt = NOTES[f.note].alt;
    if (alt) alterations[alt.node] = alt.label;
  }

  const hitRect = (rect: KeyRect, note: NoteName) => (
    <rect
      key={`hit-${note}`}
      x={rect.x}
      y={rect.y}
      width={rect.w}
      height={rect.h}
      fill="transparent"
      className="cursor-pointer outline-none"
      role="button"
      tabIndex={0}
      aria-label={`Play ${note}`}
      onPointerDown={(e) => {
        e.preventDefault();
        e.currentTarget.releasePointerCapture?.(e.pointerId);
        pressKey(note);
      }}
      onPointerEnter={(e) => {
        if (e.buttons & 1) pressKey(note);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tapKey(note);
        }
      }}
    />
  );

  /* On desktop the map is also capped by viewport height so the full
     artwork — piano and sequencer included — always clears the fold with
     air below. 0.826 is the SVG aspect ratio (360/436); the 9rem budget
     covers the nav, page padding, and breathing room above and beneath. */
  return (
    <div className="flex w-full max-w-[440px] flex-col lg:max-w-[min(440px,calc((100svh_-_9rem)*0.826))]">
      {/* Artwork wrapper — the overlay buttons anchor to the map itself,
          since on mobile the outer column starts with the ticker. */}
      <div className="relative">
        <svg
          viewBox="0 0 360 436"
          className="h-auto w-full"
        >
          <title>
            A map connecting the root note C to its scale tones, in sync with a
            playable piano keyboard above a beat sequencer
          </title>

          {/* Radar-style guide rings */}
          {[70, 112, 150].map((r) => (
            <circle
              key={r}
              cx={CENTER.x}
              cy={CENTER.y}
              r={r}
              fill="none"
              className="stroke-border"
              strokeOpacity={0.35}
            />
          ))}

          {/* Floating notation glyphs */}
          {FLOATS.map((f) =>
            reduce ? (
              <text
                key={`float-${f.glyph}-${f.x}`}
                x={f.x}
                y={f.y}
                fontSize={f.size}
                textAnchor="middle"
                className="fill-muted-foreground"
                opacity={0.35}
              >
                {f.glyph}
              </text>
            ) : (
              <motion.text
                key={`float-${f.glyph}-${f.x}`}
                x={f.x}
                fontSize={f.size}
                textAnchor="middle"
                className="fill-muted-foreground"
                initial={{ y: f.y, opacity: 0.25 }}
                animate={{ y: [f.y, f.y - 7, f.y], opacity: [0.25, 0.5, 0.25] }}
                transition={{
                  duration: 4.5 + f.delay,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: f.delay,
                }}
              >
                {f.glyph}
              </motion.text>
            ),
          )}

          {/* Base edges: center -> outer */}
          {OUTER.map((n) => (
            <line
              key={`edge-${n.id}`}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={n.x}
              y2={n.y}
              className="stroke-border"
              strokeWidth={1.5}
            />
          ))}

          {/* Secondary edges */}
          {LINKS.map(([a, b]) => (
            <line
              key={`link-${a.id}-${b.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="stroke-border"
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          ))}

          {/* Center radar ping — a soft metronome tick on beat one. Demo
            only: while the user plays, a ring swelling from C would
            falsely suggest C is sounding. */}
          {!reduce && demoPlaying && (
            <motion.circle
              cx={CENTER.x}
              cy={CENTER.y}
              className="fill-foreground"
              initial={{ r: CENTER.r, opacity: 0.14 }}
              animate={{ r: [CENTER.r, 150], opacity: [0.14, 0] }}
              transition={{
                duration: BAR * 0.75,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: BAR * 0.25,
              }}
            />
          )}

          {/* Travelling pulses — melody notes flow center→node, played keys
            flow key→node (the note you press climbs up into the map) */}
          {!reduce &&
            nodeFlashes.map((f) => {
              const nodeId = flashNodeId(f)!;
              const target = NODE_POS[nodeId];
              const isCenter = nodeId === CENTER.id;

              if (f.origin === "melody" && isCenter) {
                // Tonic sounding: the center throbs instead of travelling.
                return (
                  <motion.circle
                    key={`pulse-${f.id}`}
                    cx={CENTER.x}
                    cy={CENTER.y}
                    fill="none"
                    className="stroke-foreground"
                    strokeWidth={1.5}
                    initial={{ r: CENTER.r, opacity: 0.4 }}
                    animate={{ r: CENTER.r + 18, opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                );
              }

              const rect = keyRect(NOTES[f.note].key);
              const keyPoint = { x: rect.x + rect.w / 2, y: KB.y };
              /* melody: center → node · key press: key → node ·
               node chord: node → key (the chord rains down onto the piano) */
              const [from, to] =
                f.origin === "key"
                  ? [keyPoint, target]
                  : f.origin === "node"
                    ? [target, keyPoint]
                    : [{ x: CENTER.x, y: CENTER.y }, target];
              return (
                <motion.circle
                  key={`pulse-${f.id}`}
                  r={5}
                  className="fill-foreground"
                  filter="url(#pulse-glow)"
                  initial={{ cx: from.x, cy: from.y, opacity: 0 }}
                  animate={{
                    cx: [from.x, to.x],
                    cy: [from.y, to.y],
                    opacity: [0, 0.55, 0.55, 0],
                  }}
                  transition={{
                    duration: 0.7,
                    times: [0, 0.25, 0.8, 1],
                    ease: "easeInOut",
                  }}
                />
              );
            })}

          {/* Outer nodes — click to hear the chord; labels morph to the
            accidental while it sounds */}
          {OUTER.map((n) => (
            <g
              key={`node-${n.id}`}
              {...nodeInteractionProps(n.id)}
            >
              <circle
                cx={n.x}
                cy={n.y}
                r={n.r}
                className="fill-card stroke-border transition-colors hover:stroke-foreground/50"
                strokeWidth={1.5}
              />
              <text
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                className={
                  alterations[n.id]
                    ? "fill-foreground font-mono text-[13px]"
                    : "fill-muted-foreground font-mono text-[13px]"
                }
              >
                {alterations[n.id] ?? n.id}
              </text>
            </g>
          ))}

          {/* Node rings — brighten while their note sounds */}
          {nodeFlashes
            .filter((f) => flashNodeId(f) !== CENTER.id)
            .map((f) => {
              const n = NODE_POS[flashNodeId(f)!];
              const duration = f.beats * BEAT + 0.3;
              return reduce ? (
                <circle
                  key={`ring-${f.id}`}
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 1}
                  fill="none"
                  className="stroke-foreground"
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              ) : (
                <g key={`ring-${f.id}`}>
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    r={n.r + 1}
                    fill="none"
                    className="stroke-foreground"
                    strokeWidth={1.5}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.85, 0.6, 0] }}
                    transition={{
                      duration,
                      times: [0, 0.1, 0.7, 1],
                      ease: "easeInOut",
                    }}
                  />
                  {/* Fainter cousin of the center's throb — the node exhales
                    once as its note sounds */}
                  <motion.circle
                    cx={n.x}
                    cy={n.y}
                    fill="none"
                    className="stroke-foreground"
                    strokeWidth={1}
                    initial={{ r: n.r, opacity: 0.22 }}
                    animate={{ r: n.r + 14, opacity: 0 }}
                    transition={{ duration: 0.9, ease: "easeOut" }}
                  />
                </g>
              );
            })}

          <defs>
            {OUTER.map((n, i) => (
              <clipPath
                key={`hzw-clip-${i}`}
                id={`hzw-${i}`}
              >
                <rect
                  x={n.x - 12}
                  y={n.y + n.r + 16}
                  width={24}
                  height={9}
                />
              </clipPath>
            ))}
            <clipPath id="hzw-center">
              <rect
                x={CENTER.x - 12}
                y={CENTER.y + CENTER.r + 17}
                width={24}
                height={9}
              />
            </clipPath>
            {/* Softens the travelling pulses from dots into glows */}
            <filter
              id="pulse-glow"
              x="-100%"
              y="-100%"
              width="300%"
              height="300%"
            >
              <feGaussianBlur stdDeviation="1.8" />
            </filter>
            {/* Keeps every key inside the rounded instrument body */}
            <clipPath id="kb-clip">
              <rect
                x={KB.x}
                y={KB.y}
                width={KB.w}
                height={KB.h}
                rx={KB.rx}
              />
            </clipPath>
            {/* Pressed keys glow from the bottom, like light under the key */}
            <linearGradient
              id="key-glow"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0"
                style={{ stopColor: "hsl(var(--foreground))" }}
                stopOpacity={0.04}
              />
              <stop
                offset="1"
                style={{ stopColor: "hsl(var(--foreground))" }}
                stopOpacity={0.55}
              />
            </linearGradient>
          </defs>

          {/* Frequency readouts — appear on a node while its note sounds,
            with a tiny scrolling wave (speed scales with pitch). The center
            obeys the same rule: no sound, no readout. */}
          {nodeFlashes.map((f) => {
            const info = NOTES[f.note];
            const nodeId = flashNodeId(f)!;
            const n = NODE_POS[nodeId];
            const clipId =
              nodeId === CENTER.id ? "hzw-center" : `hzw-${NODE_INDEX[nodeId]}`;
            const label = `${info.hz.toFixed(1)} Hz`;
            const y = n.y + n.r + 13;
            const waveY = y + 7.5;
            const duration = f.beats * BEAT + 0.3;
            const envelope = {
              duration,
              times: [0, 0.12, 0.7, 1],
              ease: "easeInOut" as const,
            };
            return reduce ? (
              <g key={`hz-${f.id}`}>
                <text
                  x={n.x}
                  y={y}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[9px]"
                  opacity={0.7}
                >
                  {label}
                </text>
                <path
                  d={wavePath(n.x, waveY)}
                  fill="none"
                  className="stroke-muted-foreground"
                  strokeWidth={1}
                  clipPath={`url(#${clipId})`}
                  opacity={0.4}
                />
              </g>
            ) : (
              <g key={`hz-${f.id}`}>
                <motion.text
                  x={n.x}
                  y={y}
                  textAnchor="middle"
                  className="fill-muted-foreground font-mono text-[9px]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.9, 0.9, 0] }}
                  transition={envelope}
                >
                  {label}
                </motion.text>
                <motion.g
                  clipPath={`url(#${clipId})`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.75, 0.75, 0] }}
                  transition={envelope}
                >
                  <motion.path
                    d={wavePath(n.x, waveY)}
                    fill="none"
                    className="stroke-muted-foreground"
                    strokeWidth={1}
                    initial={{ x: 0 }}
                    animate={{ x: 12 }}
                    transition={{
                      duration: waveScrollDuration(info.hz),
                      ease: "linear",
                      repeat: Infinity,
                    }}
                  />
                </motion.g>
              </g>
            );
          })}

          {/* Center node — click to hear the tonic chord. Its ring fades
            while a chord without C sounds. */}
          <g {...nodeInteractionProps(CENTER.id)}>
            <motion.circle
              cx={CENTER.x}
              cy={CENTER.y}
              r={CENTER.r}
              className="fill-background stroke-foreground"
              strokeWidth={2}
              initial={false}
              animate={{ strokeOpacity: centerDimmed ? 0.12 : 0.55 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            />
            <motion.text
              x={CENTER.x}
              y={CENTER.y}
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-foreground font-mono text-[17px] font-semibold"
              initial={false}
              animate={{ opacity: centerDimmed ? 0.35 : 1 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
            >
              {CENTER.id}
            </motion.text>
          </g>

          {/* --- Keyboard: one continuous instrument body. No outline —
            the surface floats in the starfield like everything else,
            defined only by its own brightness. --- */}
          <g clipPath="url(#kb-clip)">
            {/* White-key base — a single surface, not separate buttons */}
            <rect
              x={KB.x}
              y={KB.y}
              width={KB.w}
              height={KB.h}
              className="fill-muted"
            />
            {/* Lift over the muted base so the instrument reads clearly
              brighter than the sky behind it — the white keys skew
              toward actual white */}
            <rect
              x={KB.x}
              y={KB.y}
              width={KB.w}
              height={KB.h}
              className="fill-foreground"
              opacity={0.16}
            />

            {/* White-key glows (under seams and black keys) */}
            {renderKeyGlows("white")}

            {/* Seams between white keys */}
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line
                key={`seam-${i}`}
                x1={KB.x + i * WKEY_W}
                y1={KB.y}
                x2={KB.x + i * WKEY_W}
                y2={KB.y + KB.h}
                className="stroke-background"
                strokeWidth={2}
              />
            ))}

            {/* Black keys — solid, flush to the top, rounded at the bottom */}
            {BLACK_BOUNDARIES.map((_, i) => {
              const k = blackKey(i);
              return (
                <rect
                  key={`bk-${i}`}
                  x={k.x}
                  y={k.y}
                  width={k.w}
                  height={k.h}
                  rx={k.rx}
                  className="fill-background"
                />
              );
            })}

            {/* Black-key glows (over the black keys) */}
            {renderKeyGlows("black")}
          </g>

          {/* Invisible hit targets — whites first, blacks on top */}
          <g className="touch-none">
            {WHITE_NOTES.map((note, i) => hitRect(whiteKey(i), note))}
            {BLACK_NOTES.map((note, i) => hitRect(blackKey(i), note))}
          </g>

          {/* Step sequencer — 8 eighth-note steps ticking across the bar.
            It only ticks while the demo tune plays: a beating metronome
            over a silent, resting map would be a lie. */}
          {Array.from({ length: STEP_COUNT }, (_, i) => {
            const cx = STEP_X0 + i * STEP_SPACING;
            const accent = ACCENTS.includes(i);
            const baseR = accent ? 3.5 : 2.5;
            const baseOpacity = accent ? 0.55 : 0.3;
            return reduce || !demoPlaying ? (
              <circle
                key={`step-${i}`}
                cx={cx}
                cy={STEP_Y}
                r={baseR}
                className={accent ? "fill-foreground" : "fill-muted-foreground"}
                opacity={baseOpacity}
              />
            ) : (
              <motion.circle
                key={`step-${i}`}
                cx={cx}
                cy={STEP_Y}
                className={accent ? "fill-foreground" : "fill-muted-foreground"}
                initial={{ r: baseR, opacity: baseOpacity }}
                animate={{
                  r: [baseR, baseR + 1.5, baseR],
                  opacity: [baseOpacity, 1, baseOpacity],
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                  repeat: Infinity,
                  repeatDelay: BAR - 0.3,
                  delay: i * STEP_TIME,
                }}
              />
            );
          })}
        </svg>

        {/* Sound toggle — muted by default; the pulse invites the click that
          doubles as the browser's audio-consent gesture */}
        <button
          type="button"
          onClick={toggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
          className={
            muted
              ? "absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-orange-500/70 bg-orange-500/10 text-orange-400 transition-colors hover:bg-orange-500/20 hover:text-orange-300"
              : "absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          }
        >
          {muted && !reduce && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-orange-400/80"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.5], opacity: [0.55, 0] }}
              transition={{
                duration: 1.8,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 0.9,
              }}
            />
          )}
          {muted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </button>

        {/* Replay — appears once the demo run has rested (finished its passes
          or yielded to the visitor). Sound still follows the mute toggle. */}
        <AnimatePresence>
          {!demoPlaying && (
            <motion.button
              type="button"
              onClick={() => setDemoPlaying(true)}
              aria-label="Replay the demo tune"
              className="absolute right-0 top-11 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.35 }}
            >
              <RotateCcw className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Invitation ticker — departure-board style, rolling until the
          first interaction fades it out for good. Above the map on mobile
          (where the map sits below the fold-adjacent text), below the
          piano on desktop. Fixed height so retiring never shifts layout.
          In the stacked layout, when the hero buttons fit on one row
          (~480px+), the ticker escapes the centered map column and sits
          centered beneath the button group at the page's left edge; the
          margin calc cancels the column's centering offset. */}
      <div
        aria-hidden
        className="order-first mb-6 flex h-5 items-center gap-2 px-1 font-mono text-[11px] text-muted-foreground min-[480px]:max-lg:ml-[calc(1.5rem_-_(100vw_-_100%)/2)] min-[480px]:max-lg:w-[26rem] min-[480px]:max-lg:max-w-full lg:order-none lg:mb-0 lg:mt-1.5"
      >
        <AnimatePresence>
          {!hasInteracted && (
            <motion.div
              ref={tickerWindowRef}
              className="min-w-0 flex-1 overflow-hidden rounded-full"
              /* A soft background-colored halo fades the starfield
                 around and beneath the rolling message so it stays
                 readable; it retires together with the ticker. The mask
                 dissolves the scrolling text before it reaches the
                 window edges — a wider runway on the left, where it
                 exits, so it never dies right at the page edge. */
              style={{
                background:
                  "linear-gradient(to right, transparent, hsl(var(--background) / 0.85) 12%, hsl(var(--background) / 0.85) 88%, transparent)",
                boxShadow: "0 0 14px 10px hsl(var(--background) / 0.6)",
                maskImage:
                  "linear-gradient(to right, transparent 2%, black 20%, black 94%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to right, transparent 2%, black 20%, black 94%, transparent 100%)",
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.3 }}
            >
              {reduce ? (
                /* Reduced motion: the message rests centered instead of
                   scrolling. */
                <span className="flex items-center justify-center gap-2">
                  <Pointer className="h-3.5 w-3.5 shrink-0 rotate-180 opacity-70 lg:rotate-0" />
                  <span className="truncate">{TICKER_TEXT}</span>
                </span>
              ) : (
                /* The finger icon rides along as the leading "car" of the
                   scrolling message, which loops until interaction. */
                <motion.span
                  ref={tickerTextRef}
                  className="inline-flex items-center gap-2 whitespace-nowrap"
                  initial={{ x: 0, opacity: 0 }}
                  animate={
                    tickerDims
                      ? {
                          opacity: 1,
                          x: [tickerDims.win, -tickerDims.text],
                        }
                      : undefined
                  }
                  transition={{
                    duration: TICKER_BARS_PER_PASS * BAR,
                    ease: "linear",
                    repeat: Infinity,
                    delay: 0.8,
                  }}
                >
                  <Pointer className="h-3.5 w-3.5 shrink-0 rotate-180 opacity-70 lg:rotate-0" />
                  {TICKER_TEXT}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
