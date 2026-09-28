"use client";

/**
 * Voices × steps, drawn at their real time.
 *
 * Presentational: it knows nothing about the clock or the kit. A lesson
 * renders it read-only with spotlights; `/drums` renders it editable; both
 * pass the same `GroovePattern`. Columns sit where they *sound* under the
 * given swing (the "&" at 50% straight, ~67% shuffled), so a swung hit
 * looks late because it is — and the optional straight-grid underlay shows
 * how far it has moved.
 *
 * The continuous playhead is a ref the owner drives on rAF (constant
 * pixels per second across the bar); `currentStep` is the discrete column
 * to tint, which is also the reduced-motion fallback.
 */
import { useReducedMotion } from "motion/react";
import { useMemo, type MouseEvent, type ReactNode, type RefObject } from "react";

import { STRAIGHT } from "@/lib/music/clock";
import {
  beatOfStep,
  beatsPerBar,
  columnPositions,
  countLabels,
  hitAt,
  speakBeat,
  stepsPerBar,
  VOICE_LABEL,
  voicesOf,
  type DrumHit,
  type DrumVoice,
  type GroovePattern,
} from "@/lib/music/grooves";
import { cn } from "@/lib/utils";

/** A normal tap adds a full hit; shift-tap adds a ghost note. */
export const HIT_VELOCITY = 0.85;
export const GHOST_VELOCITY = 0.4;

export interface StepGridProps {
  pattern: GroovePattern;
  /** Playback swing that positions the columns; defaults to the pattern's. */
  swing?: number;
  /** Rows, top to bottom; defaults to the voices the pattern uses. */
  voices?: readonly DrumVoice[];
  /** Column to tint as "now" (0-based), null when stopped. */
  currentStep?: number | null;
  /**
   * The sweep line. The owner drives it on rAF with
   * `setPlayhead(el, fraction)` — no React state per frame.
   */
  playheadRef?: RefObject<HTMLDivElement | null>;
  editable?: boolean;
  /** Toggle a cell; `velocity` is what an added hit should get. */
  onToggle?: (voice: DrumVoice, step: number, velocity: number) => void;
  /** Preview a voice (a tap on a cell or a row label). */
  onTap?: (voice: DrumVoice, velocity: number) => void;
  /** Hits that carry the burnt-orange spotlight — the groove's signature. */
  spotlight?: readonly Pick<DrumHit, "voice" | "at">[];
  muted?: ReadonlySet<DrumVoice>;
  onMuteToggle?: (voice: DrumVoice) => void;
  /** Draw faint straight-grid lines at this many steps per beat (2, 3, 4). */
  underlay?: 2 | 3 | 4;
  /** Mono spoken count above the grid. */
  countHeader?: boolean;
  ariaLabel: string;
  className?: string;
}

/** Move the sweep line to a bar fraction (0–1), or hide it. */
export function setPlayhead(el: HTMLDivElement | null, fraction: number | null): void {
  if (!el) return;
  if (fraction == null) {
    el.style.visibility = "hidden";
    return;
  }
  el.style.visibility = "visible";
  el.style.setProperty("--t", String(Math.min(1, Math.max(0, fraction))));
}

const EPS = 1e-6;
const LABEL_W = "4.5rem";

/**
 * Time runs from the first cell's centre to the bar end, leaving half a
 * cell of margin either side so nothing overhangs the track.
 */
const leftFor = (fraction: number | string) =>
  `calc(${fraction} * (100% - var(--cell)) + var(--cell) / 2)`;

export function StepGrid({
  pattern,
  swing = pattern.swing,
  voices,
  currentStep = null,
  playheadRef,
  editable = false,
  onToggle,
  onTap,
  spotlight = [],
  muted,
  onMuteToggle,
  underlay,
  countHeader = true,
  ariaLabel,
  className,
}: StepGridProps) {
  const reduceMotion = useReducedMotion();
  const rows = voices ?? voicesOf(pattern);
  const total = stepsPerBar(pattern);
  const bpb = beatsPerBar(pattern.meter);
  const positions = useMemo(() => columnPositions(pattern, swing), [pattern, swing]);
  const straight = useMemo(() => columnPositions(pattern, STRAIGHT), [pattern]);
  const labels = useMemo(() => countLabels(pattern), [pattern]);
  const underlayLines = useMemo(
    () =>
      underlay
        ? columnPositions({ meter: pattern.meter, stepsPerBeat: underlay }, STRAIGHT)
        : [],
    [underlay, pattern.meter],
  );

  // One straight step is a cell's footprint; at the hardest swing (0.75) an
  // "&" sits half a step before the next beat, so half a step is the widest
  // a cell can be without two buttons overlapping.
  const cellPct = 50 / total;
  const isSpot = (voice: DrumVoice, at: number) =>
    spotlight.some((s) => s.voice === voice && Math.abs(s.at - at) < EPS);

  const handleCell = (e: MouseEvent, voice: DrumVoice, step: number, hit?: DrumHit) => {
    const velocity = e.shiftKey ? GHOST_VELOCITY : HIT_VELOCITY;
    if (editable && onToggle) {
      onToggle(voice, step, velocity);
      if (!hit) onTap?.(voice, velocity);
      return;
    }
    if (hit) onTap?.(voice, hit.velocity);
  };

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={cn("w-full select-none text-xs", className)}
      style={{ ["--cell" as string]: `${cellPct}%` }}
    >
      {countHeader && (
        <Row label={null} className="h-5">
          {labels.map((text, i) => {
            const onBeat = i % pattern.stepsPerBeat === 0;
            return (
              <span
                key={i}
                aria-hidden
                className={cn(
                  "absolute top-0.5 -translate-x-1/2 font-mono leading-none",
                  onBeat ? "text-foreground" : "text-[10px] text-muted-foreground",
                )}
                style={{ left: leftFor(positions[i]) }}
              >
                {text}
              </span>
            );
          })}
        </Row>
      )}

      <div className="relative">
        {rows.map((voice) => {
          const isMuted = muted?.has(voice) ?? false;
          return (
            <Row
              key={voice}
              label={
                <button
                  type="button"
                  onClick={() =>
                    onMuteToggle ? onMuteToggle(voice) : onTap?.(voice, HIT_VELOCITY)
                  }
                  aria-pressed={onMuteToggle ? isMuted : undefined}
                  aria-label={
                    onMuteToggle
                      ? `${isMuted ? "Unmute" : "Mute"} ${VOICE_LABEL[voice].toLowerCase()}`
                      : `Play ${VOICE_LABEL[voice].toLowerCase()}`
                  }
                  title={onMuteToggle ? (isMuted ? "Unmute" : "Mute") : "Play"}
                  className={cn(
                    "w-full truncate rounded-sm px-1 text-left font-mono text-[11px] leading-none transition-colors",
                    "hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isMuted ? "text-muted-foreground/40 line-through" : "text-muted-foreground",
                  )}
                >
                  {VOICE_LABEL[voice]}
                </button>
              }
            >
              {/* straight grid: beat lines always, subdivisions on request */}
              {straight.map((pos, i) =>
                i % pattern.stepsPerBeat === 0 ? (
                  <span
                    key={`b${i}`}
                    aria-hidden
                    className="absolute inset-y-0 w-px bg-border"
                    style={{ left: leftFor(pos) }}
                  />
                ) : null,
              )}
              {underlayLines.map((pos, i) =>
                i % (underlay ?? 1) === 0 ? null : (
                  <span
                    key={`u${i}`}
                    aria-hidden
                    className="absolute inset-y-1.5 w-px bg-border/60"
                    style={{ left: leftFor(pos) }}
                  />
                ),
              )}
              {currentStep != null && currentStep < total && (
                <span
                  aria-hidden
                  className="absolute inset-y-0 -translate-x-1/2 rounded-sm bg-accent/70"
                  style={{ left: leftFor(positions[currentStep]), width: "var(--cell)" }}
                />
              )}
              {Array.from({ length: total }, (_, step) => {
                const at = beatOfStep(step, pattern.stepsPerBeat);
                const hit = hitAt(pattern, voice, step);
                const spot = hit ? isSpot(voice, at) : false;
                const interactive = Boolean((editable && onToggle) || (hit && onTap));
                const spoken = `${VOICE_LABEL[voice]} on ${speakBeat(at, pattern.stepsPerBeat)}`;
                const isNow = currentStep === step;
                const weight = hit ? (0.45 + 0.55 * hit.velocity) * (isNow && !reduceMotion ? 1.2 : 1) : 0;
                return (
                  <button
                    key={step}
                    type="button"
                    disabled={!interactive}
                    aria-label={`${spoken}${hit ? (hit.velocity < 0.6 ? ", ghost" : ", on") : ", off"}`}
                    aria-pressed={editable ? Boolean(hit) : undefined}
                    onClick={(e) => handleCell(e, voice, step, hit)}
                    className={cn(
                      "absolute inset-y-0 flex -translate-x-1/2 items-center justify-center rounded-sm",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      interactive ? "cursor-pointer hover:bg-accent/60" : "cursor-default",
                      !interactive && !hit && "pointer-events-none",
                    )}
                    style={{ left: leftFor(positions[step]), width: "var(--cell)" }}
                  >
                    {hit ? (
                      <span
                        aria-hidden
                        className={cn(
                          "block h-4 w-4 max-w-full rounded-full transition-[transform,opacity] duration-100",
                          spot ? "bg-orange-600" : "bg-foreground",
                        )}
                        style={{
                          transform: `scale(${weight})`,
                          opacity: isMuted ? 0.2 : 0.35 + 0.65 * hit.velocity,
                        }}
                      />
                    ) : editable ? (
                      <span aria-hidden className="block h-1 w-1 rounded-full bg-muted-foreground/30" />
                    ) : null}
                  </button>
                );
              })}
            </Row>
          );
        })}

        {/* the sweep line, over the track only; owner-positioned via --t */}
        {playheadRef && !reduceMotion && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0"
            style={{ left: LABEL_W }}
          >
            <div
              ref={playheadRef}
              className="absolute inset-y-0 w-px -translate-x-1/2 bg-foreground/60"
              style={{ left: leftFor("var(--t)"), ["--t" as string]: 0, visibility: "hidden" }}
            />
          </div>
        )}
      </div>

      <div className="sr-only">
        {bpb} beats, {total} steps per bar.
      </div>
    </div>
  );
}

/** Label column + a time track; cells position themselves in the track. */
function Row({
  label,
  className,
  children,
}: {
  label: ReactNode;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex h-8 items-stretch", className)}>
      <div className="flex shrink-0 items-center" style={{ width: LABEL_W }}>
        {label}
      </div>
      <div className="relative min-w-0 flex-1">{children}</div>
    </div>
  );
}
