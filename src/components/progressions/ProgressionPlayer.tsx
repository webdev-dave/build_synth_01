"use client";

import { Play, Square } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLessonClock } from "@/components/lessons/LessonClock";
import { Segmented } from "@/components/lessons/Segmented";
import { TempoControl } from "@/components/lessons/TempoControl";
import { FeelControl } from "@/components/grooves/FeelControl";
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
  /** Show the "Comp" re-strike checkbox and, with it on, the straight / shuffle feel. */
  feel?: boolean;
  label?: string;
  className?: string;
}

/**
 * Transport for the chart: play one chorus then rest (a bounded run), loop
 * as an explicit choice, a live tempo slider. Every chord is scheduled on
 * the page's one clock, so the cell that lights is the chord that sounds.
 * "Comp" swaps the held chord for a chop on every eighth; with it on, the
 * straight / shuffle toggle drives the clock's swing — the rhythm module's
 * transform applied to the harmony, not an animation.
 */
export function ProgressionPlayer({
  loop: showLoop = true,
  tempo = true,
  voicing = false,
  feel = false,
  label = "Play the chart",
  className,
}: ProgressionPlayerProps) {
  const { playing, play, stop, loop, setLoop } = useLessonClock();
  const { smoothVoicing, setSmoothVoicing, comp, setComp } = useProgression();

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

      {tempo && <TempoControl min={MIN_BPM} max={MAX_BPM} />}

      {feel && (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={comp}
            onChange={(e) => setComp(e.target.checked)}
            className="h-3.5 w-3.5 accent-emerald-600"
          />
          Comp
        </label>
      )}
      {feel && comp && <FeelControl mode="toggle" />}

      {voicing && (
        <Segmented
          label="Voicing"
          options={[
            { id: "smooth", label: "Smooth" },
            { id: "root", label: "Root position" },
          ]}
          value={smoothVoicing ? "smooth" : "root"}
          onChange={(id) => setSmoothVoicing(id === "smooth")}
        />
      )}
    </div>
  );
}
