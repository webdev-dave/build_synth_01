"use client";

import { Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLessonClock } from "@/components/lessons/LessonClock";
import { TempoControl } from "@/components/lessons/TempoControl";
import { cn } from "@/lib/utils";
import { FeelControl } from "./FeelControl";
import { useGroove } from "./GrooveProvider";

interface GroovePlayerProps {
  loop?: boolean;
  tempo?: boolean;
  /** Straight / shuffle toggle (hidden on triplet grids, where it has no meaning). */
  feel?: boolean;
  label?: string;
  className?: string;
}

/**
 * Transport for a groove: play / stop, loop, tempo, and the two-position
 * feel toggle. Every hit is scheduled on the page's one clock, so the dot
 * that lights is the hit that sounds.
 */
export function GroovePlayer({
  loop: showLoop = true,
  tempo = true,
  feel = false,
  label = "Play",
  className,
}: GroovePlayerProps) {
  const { playing, play, stop, loop, setLoop } = useLessonClock();
  const { pattern } = useGroove();

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

      {tempo && <TempoControl />}

      {feel && pattern.stepsPerBeat % 2 === 0 && <FeelControl mode="toggle" />}
    </div>
  );
}
