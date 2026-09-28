"use client";

/**
 * Karaoke for counting: the spoken count as syllables, each lit as it
 * passes, with an optional click on the metric accents so the ear has the
 * bar even when the drums argue with it. Syllables sit at their real time
 * like the grid's columns, so a swung "&" is spoken late too.
 */
import { useState } from "react";

import { useClockTrack, useLessonClock } from "@/components/lessons/LessonClock";
import { columnPositions, countLabels, metricWeights } from "@/lib/music/grooves";
import { cn } from "@/lib/utils";
import { useGroove } from "./GrooveProvider";

interface CountAlongProps {
  /** Offer the click-on-the-beat checkbox. */
  click?: boolean;
  /** Start with the click on (a meter page leads with the count itself). */
  defaultClick?: boolean;
  className?: string;
}

export function CountAlong({ click = true, defaultClick = false, className }: CountAlongProps) {
  const { pattern, currentStep, kit, beatsPerBar } = useGroove();
  const { swing, audioContext } = useLessonClock();
  const [clickOn, setClickOn] = useState(defaultClick);

  const labels = countLabels(pattern);
  const positions = columnPositions(pattern, swing);
  const weights = metricWeights(pattern.meter);

  useClockTrack(
    {
      id: "count-click",
      stepsPerBeat: 1,
      events: () =>
        !clickOn || !audioContext
          ? []
          : weights.map((w, b) => ({
              at: b,
              duration: 0,
              fire: (when: number) => kit.hitAt("click", when, w >= 1 ? 1 : 0.5),
            })),
    },
    [clickOn, audioContext, kit, beatsPerBar],
  );

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative h-7 w-full" aria-label="Spoken count" role="img">
        {labels.map((text, i) => {
          const onBeat = i % pattern.stepsPerBeat === 0;
          const now = currentStep === i;
          return (
            <span
              key={i}
              className={cn(
                "absolute top-0 -translate-x-1/2 font-mono leading-7 transition-colors duration-100",
                onBeat ? "text-base" : "text-xs",
                now ? "text-orange-600" : onBeat ? "text-foreground" : "text-muted-foreground",
              )}
              style={{ left: `calc(${positions[i]} * (100% - 2rem) + 1rem)` }}
            >
              {text}
            </span>
          );
        })}
      </div>
      {click && (
        <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={clickOn}
            onChange={(e) => setClickOn(e.target.checked)}
            className="h-3.5 w-3.5 accent-emerald-600"
          />
          Click on the beat
        </label>
      )}
    </div>
  );
}
