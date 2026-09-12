"use client";

/**
 * Two forms, one clock. Each row is a cycle drawn as bars; both run at the
 * same tempo on a shared playhead, so "how long until home comes round"
 * is felt as a wait rather than read as a number. A soft click marks every
 * beat; each form gets its own drum on the bar its cycle starts — the kick
 * for A, the snare for B — so the two homes are heard arriving at
 * different times. No chords: most foils have no chart on the site, and a
 * count is the honest common ground.
 */
import { Play, Square } from "lucide-react";
import { useMemo } from "react";

import {
  LessonClockProvider,
  useClockDerived,
  useClockTrack,
  useLessonClock,
} from "@/components/lessons/LessonClock";
import { TempoControl } from "@/components/lessons/TempoControl";
import { Button } from "@/components/ui/button";
import { useDrumKit } from "@/instruments/drums/templates/basic-drums/hooks/useDrumKit";
import { formBars, placeOfBar, type Form } from "@/lib/forms/registry";
import type { ClockEvent } from "@/lib/music/clock";
import type { DrumVoice } from "@/lib/music/grooves";
import { cn } from "@/lib/utils";

const BEATS_PER_BAR = 4;

function lcm(a: number, b: number): number {
  const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
  return (a * b) / gcd(a, b);
}

interface FormComparerProps {
  a: Form;
  b: Form;
  bpm?: number;
  className?: string;
}

export function FormComparer({ a, b, bpm = 112, className }: FormComparerProps) {
  const cycleBars = lcm(formBars(a), formBars(b));
  return (
    <LessonClockProvider bpm={bpm} loop lengthBeats={cycleBars * BEATS_PER_BAR}>
      <Comparer a={a} b={b} cycleBars={cycleBars} className={className} />
    </LessonClockProvider>
  );
}

function Comparer({
  a,
  b,
  cycleBars,
  className,
}: FormComparerProps & { cycleBars: number }) {
  const { playing, play, stop, audioContext } = useLessonClock();
  const kit = useDrumKit();

  // The shared count, and each form's "home" drum where its cycle restarts.
  useClockTrack(
    {
      id: "compare-click",
      events: (): ClockEvent[] => {
        if (!audioContext) return [];
        const out: ClockEvent[] = [];
        for (let beat = 0; beat < cycleBars * BEATS_PER_BAR; beat++) {
          const barStart = beat % BEATS_PER_BAR === 0;
          out.push({
            at: beat,
            duration: 0.25,
            fire: (when) => kit.hitAt("click", when, barStart ? 0.6 : 0.3),
          });
        }
        return out;
      },
    },
    [audioContext, kit, cycleBars],
  );
  useHomeTrack("compare-a", a, "kick", cycleBars, kit.hitAt, audioContext);
  useHomeTrack("compare-b", b, "snare", cycleBars, kit.hitAt, audioContext);

  const currentBar = useClockDerived((beat) =>
    beat == null || beat < 0 ? null : Math.floor(beat / BEATS_PER_BAR) % cycleBars,
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => (playing ? stop() : void play())}
          aria-label={playing ? "Stop" : "Play both"}
        >
          {playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          {playing ? "Stop" : "Play both"}
        </Button>
        <TempoControl min={80} max={160} />
      </div>
      <CycleRow form={a} drum="kick" cycleBars={cycleBars} currentBar={currentBar} />
      <CycleRow form={b} drum="snare" cycleBars={cycleBars} currentBar={currentBar} />
      <p className="font-mono text-xs text-muted-foreground">
        {currentBar != null ? (
          <>
            bar {currentBar + 1} of {cycleBars} · {a.name}: bar {(currentBar % formBars(a)) + 1} of{" "}
            {formBars(a)} · {b.name}: bar {(currentBar % formBars(b)) + 1} of {formBars(b)}
          </>
        ) : (
          <>
            {formBars(a)} bars against {formBars(b)} — they meet again after {cycleBars}
          </>
        )}
      </p>
    </div>
  );
}

/** One drum on the first beat of every cycle of a form, over the shared count. */
function useHomeTrack(
  id: string,
  form: Form,
  drum: DrumVoice,
  cycleBars: number,
  hitAt: (voice: DrumVoice, when: number, velocity?: number) => void,
  audioContext: AudioContext | null,
): void {
  const bars = formBars(form);
  useClockTrack(
    {
      id,
      events: (): ClockEvent[] => {
        if (!audioContext) return [];
        const out: ClockEvent[] = [];
        for (let bar = 0; bar < cycleBars; bar += bars) {
          out.push({
            at: bar * BEATS_PER_BAR,
            duration: 0.5,
            fire: (when) => hitAt(drum, when, 0.8),
          });
        }
        return out;
      },
    },
    [audioContext, hitAt, cycleBars, bars, drum],
  );
}

/** A form's cycles laid end to end across the shared span; home bars marked. */
function CycleRow({
  form,
  drum,
  cycleBars,
  currentBar,
}: {
  form: Form;
  drum: DrumVoice;
  cycleBars: number;
  currentBar: number | null;
}) {
  const bars = formBars(form);
  const cells = useMemo(() => Array.from({ length: cycleBars }, (_, i) => i), [cycleBars]);
  return (
    <div className="space-y-1">
      <p className="text-[11px] text-muted-foreground">
        <span className="text-foreground">{form.name}</span> · {bars} bars · home on the{" "}
        {drum === "kick" ? "kick" : "snare"}
      </p>
      <ol
        className="grid gap-px"
        style={{ gridTemplateColumns: `repeat(${cycleBars}, minmax(0, 1fr))` }}
        role="group"
        aria-label={`${form.name}, ${bars}-bar cycles`}
      >
        {cells.map((i) => {
          const inCycle = i % bars;
          const home = inCycle === 0;
          const place = placeOfBar(form, inCycle);
          const isCurrent = currentBar === i;
          return (
            <li
              key={i}
              aria-current={isCurrent ? "true" : undefined}
              aria-label={`Bar ${i + 1}${home ? ", home" : ""}`}
              className={cn(
                "flex h-6 items-center justify-center rounded-sm border font-mono text-[10px] transition-colors",
                isCurrent
                  ? "border-orange-600 bg-orange-700/10 text-orange-600"
                  : home
                    ? "border-foreground/50 text-foreground"
                    : "text-muted-foreground/70",
                place?.role === "response" && !isCurrent && "border-dashed",
              )}
            >
              {home ? "1" : ""}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
