"use client";

import { useState } from "react";

import { BarTimeline, type BarCell } from "@/components/content/BarTimeline";
import { useLessonClock } from "@/components/lessons/LessonClock";
import { cn } from "@/lib/utils";
import { useProgression } from "./ProgressionProvider";

interface ProgressionChartProps {
  /** Show the "Bar 5 of 12 · IV7 · D7" read-out under the cells. */
  readout?: boolean;
  className?: string;
}

/**
 * The map: one cell per bar in rows of four, Roman numeral on top and the
 * concrete chord in the current key below. The sounding bar is the page's
 * one burnt-orange accent; the bar arriving next gets a thin outline a
 * beat early. Click a cell to hear that chord (or, while playing, to jump
 * there). Cells a variant changed carry a quiet dot.
 */
export function ProgressionChart({ readout = true, className }: ProgressionChartProps) {
  const {
    progression,
    bars,
    beatsPerBar,
    nameOf,
    currentBar,
    upcomingBar,
    soundChord,
    clickSounding,
    keyName,
    variantIds,
  } = useProgression();
  const { playing, play, cycle, loop } = useLessonClock();
  const [clicked, setClicked] = useState<number | null>(null);

  const cells: BarCell[] = bars.map((bar, i) => {
    const name = nameOf(bar.chord);
    const plain = progression.bars[i]?.chord;
    return {
      top: bar.chord.numeral,
      bottom: name,
      label: `Bar ${i + 1}, ${bar.chord.numeral}, ${name}`,
      changed: plain ? plain.numeral !== bar.chord.numeral : false,
    };
  });

  const current = currentBar ?? (clickSounding ? clicked : null);

  const onSelect = (i: number) => {
    setClicked(i);
    if (playing) void play(i * beatsPerBar);
    else soundChord(bars[i].chord);
  };

  const variantNames = (progression.variants ?? [])
    .filter((v) => variantIds.includes(v.id))
    .map((v) => v.label.toLowerCase());

  return (
    <div className={cn("space-y-2", className)}>
      <BarTimeline
        cells={cells}
        perRow={4}
        current={current}
        upcoming={upcomingBar}
        onSelect={onSelect}
        ariaLabel={`${progression.name} chart in ${keyName}`}
      />
      {readout && (
        <p className="font-mono text-xs text-muted-foreground">
          {currentBar != null ? (
            <>
              Bar {currentBar + 1} of {bars.length} · {bars[currentBar].chord.numeral} ·{" "}
              {nameOf(bars[currentBar].chord)}
              {loop && cycle > 0 && <> · chorus {cycle + 1}</>}
            </>
          ) : (
            <>
              {bars.length} bars · {keyName}
              {variantNames.length > 0 && <> · {variantNames.join(" + ")}</>}
            </>
          )}
        </p>
      )}
    </div>
  );
}
