"use client";

/**
 * Movable bar lines over a fixed stream of notes. Twenty-four even eighths
 * on the hat never change; the reader re-fences them as 3/4, 4/4, 6/8, or
 * 12/8 and the click (heavy on every "one") and the beat numbers move
 * while the notes don't. That is `timeSignatures.ts`'s claim — moving the
 * bar lines changes the feel — made playable, and it is where 12/8 is
 * taught as "four big beats with a triplet inside": the same eighths,
 * grouped in threes instead of twos.
 */
import { Play, Square } from "lucide-react";
import { useState } from "react";

import {
  LessonClockProvider,
  useClockDerived,
  useClockTrack,
  useLessonClock,
} from "@/components/lessons/LessonClock";
import { Segmented } from "@/components/lessons/Segmented";
import { TempoControl } from "@/components/lessons/TempoControl";
import { Button } from "@/components/ui/button";
import { useDrumKit } from "@/instruments/drums/templates/basic-drums/hooks/useDrumKit";
import type { ClockEvent } from "@/lib/music/clock";
import type { TimeSignature } from "@/lib/music/timeSignatures";
import { cn } from "@/lib/utils";

/** The stream: 24 eighths = 12 quarter-beats — a whole number of bars in every fence below. */
const EIGHTHS = 24;
const QUARTERS = EIGHTHS / 2;

type FenceId = "3/4" | "4/4" | "6/8" | "12/8";

interface Fence {
  id: FenceId;
  meter: TimeSignature;
  /** Felt beat length in quarter-beats (1 = quarter, 1.5 = dotted quarter). */
  beat: number;
  /** Bar length in quarter-beats. */
  bar: number;
  caption: string;
}

const FENCES: readonly Fence[] = [
  { id: "3/4", meter: [3, 4], beat: 1, bar: 3, caption: "Three beats of two eighths — ONE two three. The waltz." },
  { id: "4/4", meter: [4, 4], beat: 1, bar: 4, caption: "Four beats of two eighths — ONE two THREE four. Common time." },
  { id: "6/8", meter: [6, 8], beat: 1.5, bar: 3, caption: "Same length as 3/4, grouped in two threes — ONE-and-a TWO-and-a. A jig, not a waltz." },
  { id: "12/8", meter: [12, 8], beat: 1.5, bar: 6, caption: "Four big beats with a triplet inside each — the slow blues." },
];

interface BarFenceProps {
  /** Fence to open on. */
  defaultFence?: FenceId;
  /** Fences to offer, in order. */
  fences?: readonly FenceId[];
  bpm?: number;
  className?: string;
}

export function BarFence({
  defaultFence = "4/4",
  fences = ["3/4", "4/4", "6/8", "12/8"],
  bpm = 100,
  className,
}: BarFenceProps) {
  return (
    <LessonClockProvider bpm={bpm} loop lengthBeats={QUARTERS}>
      <FenceBody defaultFence={defaultFence} fences={fences} className={className} />
    </LessonClockProvider>
  );
}

function FenceBody({
  defaultFence,
  fences,
  className,
}: {
  defaultFence: FenceId;
  fences: readonly FenceId[];
  className?: string;
}) {
  const { playing, play, stop, audioContext } = useLessonClock();
  const kit = useDrumKit();
  const [fenceId, setFenceId] = useState<FenceId>(defaultFence);
  const fence = FENCES.find((f) => f.id === fenceId) ?? FENCES[1];

  // The notes: never change.
  useClockTrack(
    {
      id: "fence-hats",
      stepsPerBeat: 2,
      events: (): ClockEvent[] =>
        !audioContext
          ? []
          : Array.from({ length: EIGHTHS }, (_, i) => ({
              at: i / 2,
              duration: 0,
              fire: (when: number) => kit.hitAt("hatClosed", when, 0.5),
            })),
    },
    [audioContext, kit],
  );
  // The fence: a click on every felt beat, heavy on each bar's one.
  useClockTrack(
    {
      id: "fence-clicks",
      stepsPerBeat: 2,
      events: (): ClockEvent[] => {
        if (!audioContext) return [];
        const out: ClockEvent[] = [];
        for (let q = 0; q < QUARTERS; q += fence.beat) {
          const isOne = Math.abs((q % fence.bar) - 0) < 1e-6;
          out.push({
            at: q,
            duration: 0,
            fire: (when: number) => kit.hitAt("click", when, isOne ? 1 : 0.5),
          });
        }
        return out;
      },
    },
    [audioContext, kit, fence],
  );

  const currentEighth = useClockDerived((beat) =>
    beat == null || beat < 0 ? null : Math.floor((((beat % QUARTERS) + QUARTERS) % QUARTERS) * 2),
  );

  const bars = QUARTERS / fence.bar;
  const beatsPerBar = fence.bar / fence.beat;
  const eighthsPerBeat = fence.beat * 2;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (playing ? stop() : void play())}
          aria-label={playing ? "Stop" : "Play the notes"}
        >
          {playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Stop" : "Play"}
        </Button>
        <Segmented
          label="Bar lines"
          options={fences.map((id) => ({ id, label: id }))}
          value={fenceId}
          onChange={setFenceId}
        />
        <TempoControl min={60} max={140} />
      </div>

      <div
        role="img"
        aria-label={`${EIGHTHS} eighth notes fenced as ${bars} bars of ${fence.id}`}
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${EIGHTHS}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: EIGHTHS }, (_, i) => {
          const q = i / 2;
          const barStart = Math.abs(q % fence.bar) < 1e-6;
          const beatStart = Math.abs(q % fence.beat) < 1e-6;
          const beatIndex = Math.floor((q % fence.bar) / fence.beat);
          const now = currentEighth === i;
          return (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center gap-1.5 border-l py-1",
                barStart ? "border-foreground/70" : beatStart ? "border-border" : "border-transparent",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "block h-3 w-3 rounded-full transition-colors",
                  now ? "bg-orange-600" : "bg-foreground/70",
                )}
              />
              <span
                className={cn(
                  "h-4 font-mono text-[11px] leading-none",
                  barStart ? "text-foreground" : "text-muted-foreground",
                  !beatStart && "invisible",
                )}
              >
                {beatStart ? beatIndex + 1 : "·"}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        {fence.caption}{" "}
        <span className="font-mono">
          {bars} bar{bars === 1 ? "" : "s"} · {beatsPerBar} beat{beatsPerBar === 1 ? "" : "s"} · {eighthsPerBeat}{" "}
          eighths a beat
        </span>
      </p>
    </div>
  );
}
