"use client";

import { Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLessonClock } from "@/components/lessons/LessonClock";
import { cn } from "@/lib/utils";
import { useProgression } from "./ProgressionProvider";

const MIN_BPM = 60;
const MAX_BPM = 120;

interface ProgressionPlayerProps {
  /** Show the loop toggle. */
  loop?: boolean;
  /** Show the tempo slider. */
  tempo?: boolean;
  /** Show the smooth / root-position voicing toggle. */
  voicing?: boolean;
  label?: string;
  className?: string;
}

/**
 * Transport for the chart: play one chorus then rest (a bounded run), loop
 * as an explicit choice, a live tempo slider. Every chord is scheduled on
 * the page's one clock, so the cell that lights is the chord that sounds.
 * Straight quarters in v1 — the shuffle arrives with the rhythm module's
 * clock transform, not as an animation.
 */
export function ProgressionPlayer({
  loop: showLoop = true,
  tempo = true,
  voicing = false,
  label = "Play the chart",
  className,
}: ProgressionPlayerProps) {
  const { playing, play, stop, bpm, setBpm, loop, setLoop } = useLessonClock();
  const { smoothVoicing, setSmoothVoicing } = useProgression();

  return (
    <div className={cn("flex flex-wrap items-center gap-x-4 gap-y-2", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => (playing ? stop() : void play())}
        aria-label={playing ? "Stop" : label}
      >
        {playing ? <Square className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        {playing ? "Stop" : label}
      </Button>

      {showLoop && (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={loop}
            onChange={(e) => setLoop(e.target.checked)}
            className="h-3.5 w-3.5 accent-emerald-600"
          />
          Loop
        </label>
      )}

      {tempo && (
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="text-xs">Tempo</span>
          <input
            type="range"
            min={MIN_BPM}
            max={MAX_BPM}
            step={1}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            aria-label="Tempo in beats per minute"
            className="h-1.5 w-28 cursor-pointer accent-foreground"
          />
          <span className="min-w-14 font-mono text-xs text-foreground">{bpm} BPM</span>
        </label>
      )}

      {voicing && (
        <div
          role="group"
          aria-label="Voicing"
          className="inline-flex overflow-hidden rounded-md border border-input"
        >
          {(
            [
              { id: true, label: "Smooth" },
              { id: false, label: "Root position" },
            ] as const
          ).map((opt) => {
            const on = smoothVoicing === opt.id;
            return (
              <button
                key={opt.label}
                type="button"
                aria-pressed={on}
                onClick={() => setSmoothVoicing(opt.id)}
                className={cn(
                  "border-l border-input px-3 py-1.5 text-xs font-medium transition-colors first:border-l-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  on
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
