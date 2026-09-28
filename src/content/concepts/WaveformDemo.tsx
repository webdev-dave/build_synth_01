"use client";

/**
 * Play-it demo for /concepts/waveform: the same note (A3, 220 Hz) in the
 * four oscillator shapes the synth offers. Each button draws one cycle of
 * its shape; the one that is sounding is the one lit — the picture and the
 * sound are the same object. Nothing plays until a button is pressed.
 */
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ToneShape } from "@/lib/audio/voices/tone";
import { cn } from "@/lib/utils";
import { useDemoTone } from "./useDemoTone";

const DEMO_HZ = 220; // A3 — low enough that the overtones sit where ears are keenest
const NOTE_SEC = 1.0;
const GAP_SEC = 0.15;

interface Shape {
  id: ToneShape;
  label: string;
  /** What is stacked on the fundamental — the reason it sounds as it does. */
  partials: string;
  ear: string;
}

const SHAPES: Shape[] = [
  { id: "sine", label: "Sine", partials: "1 partial", ear: "pure, a whistle" },
  { id: "triangle", label: "Triangle", partials: "odd, fading fast", ear: "soft, rounded" },
  { id: "square", label: "Square", partials: "odd", ear: "hollow, reedy" },
  { id: "sawtooth", label: "Sawtooth", partials: "all", ear: "bright, buzzy" },
];

/** One cycle of each shape in a 48×24 box, the way an oscilloscope draws it. */
function cyclePath(shape: ToneShape): string {
  const w = 48;
  const mid = 12;
  const amp = 9;
  switch (shape) {
    case "sine": {
      const pts: string[] = [];
      for (let i = 0; i <= 24; i++) {
        const x = (i / 24) * w;
        const y = mid - Math.sin((i / 24) * Math.PI * 2) * amp;
        pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`);
      }
      return pts.join(" ");
    }
    case "triangle":
      return `M0 ${mid} L${w / 4} ${mid - amp} L${(3 * w) / 4} ${mid + amp} L${w} ${mid}`;
    case "square":
      return `M0 ${mid} V${mid - amp} H${w / 2} V${mid + amp} H${w} V${mid}`;
    case "sawtooth":
      return `M0 ${mid} L${w / 2} ${mid - amp} V${mid + amp} L${w} ${mid}`;
    default:
      return `M0 ${mid} H${w}`;
  }
}

export function WaveformDemo() {
  const { play, after, clearTimers } = useDemoTone();
  const [sounding, setSounding] = useState<ToneShape | null>(null);

  const playOne = async (shape: ToneShape) => {
    clearTimers();
    const ok = await play([{ hz: DEMO_HZ, at: 0, duration: NOTE_SEC, shape }]);
    if (!ok) return;
    setSounding(shape);
    after(NOTE_SEC + 0.2, () => setSounding(null));
  };

  const playAll = async () => {
    clearTimers();
    const step = NOTE_SEC + GAP_SEC;
    const ok = await play(
      SHAPES.map((s, i) => ({ hz: DEMO_HZ, at: i * step, duration: NOTE_SEC, shape: s.id })),
    );
    if (!ok) return;
    SHAPES.forEach((s, i) => after(i * step, () => setSounding(s.id)));
    after(SHAPES.length * step + 0.1, () => setSounding(null));
  };

  return (
    <div className="mt-4 space-y-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="Waveform shapes">
        {SHAPES.map((shape) => {
          const active = sounding === shape.id;
          return (
            <button
              key={shape.id}
              type="button"
              onClick={() => playOne(shape.id)}
              aria-pressed={active}
              aria-label={`Play a ${shape.label.toLowerCase()} wave at ${DEMO_HZ} Hz`}
              className={cn(
                "group flex flex-col items-start gap-2 rounded-md border p-3 text-left transition-colors hover:border-foreground/25 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                active && "border-orange-700 bg-accent/30",
              )}
            >
              <svg
                viewBox="0 0 48 24"
                className={cn(
                  "h-6 w-12 stroke-foreground transition-colors",
                  active && "stroke-orange-600",
                )}
                fill="none"
                strokeWidth={1.75}
                strokeLinejoin="round"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d={cyclePath(shape.id)} />
              </svg>
              <span className={cn("text-sm font-medium", active && "text-orange-600")}>
                {shape.label}
              </span>
              <span className="font-mono text-[11px] leading-tight text-muted-foreground">
                {shape.partials}
                <br />
                {shape.ear}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={playAll}
          className={cn(sounding && "border-orange-700 text-orange-600")}
        >
          <Play className="h-3.5 w-3.5" />
          Play all four
        </Button>
        <span className="font-mono text-xs text-muted-foreground">
          same key · A3 · {DEMO_HZ} Hz
        </span>
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        The pitch never changes — every button is the same{" "}
        <span className="font-mono">220 Hz</span>. What changes is the stack
        of quieter overtones riding on it: none for the sine, the odd
        multiples for triangle and square, all of them for the sawtooth. That
        stack is what the ear reads as tone colour.{" "}
        <Link
          href="/synth/v2"
          className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 hover:underline"
        >
          Try the shape selector on the synth
          <ArrowRight className="h-3 w-3" />
        </Link>
      </p>
    </div>
  );
}
