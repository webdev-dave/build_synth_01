"use client";

/**
 * The shuffle made continuous. A swing slider from straight (the "&" at
 * 50% of its beat) through the triplet shuffle (67%) to a hard shuffle
 * (75%), with the named feels as detents. Dragging it moves the off-beat
 * dots along the time axis *and* the audio the same instant, because both
 * read the clock's one `swing` value. The two-position toggle is the same
 * control for teasers and comparers.
 */
import { useId } from "react";

import { useLessonClock } from "@/components/lessons/LessonClock";
import { Segmented } from "@/components/lessons/Segmented";
import { HARD_SWING, STRAIGHT, TRIPLET_SWING } from "@/lib/music/clock";
import { cn } from "@/lib/utils";

const DETENTS = [
  { value: STRAIGHT, label: "Straight", caption: "Even eighths — the “&” sits halfway through its beat." },
  { value: TRIPLET_SWING, label: "Shuffle", caption: "Long–short — the “&” lands two-thirds through, on the third note of a triplet." },
  { value: HARD_SWING, label: "Hard shuffle", caption: "Three-quarters through — a dotted eighth and a sixteenth." },
] as const;

const SNAP = 0.015;

/** Name the nearest detent, or describe the in-between. */
export function describeSwing(swing: number): { label: string; caption: string } {
  const hit = DETENTS.find((d) => Math.abs(d.value - swing) < SNAP);
  if (hit) return hit;
  const pct = Math.round(swing * 100);
  return {
    label: `${pct}%`,
    caption: `The “&” lands ${pct}% of the way through its beat — between the named feels.`,
  };
}

interface FeelControlProps {
  mode?: "slider" | "toggle";
  caption?: boolean;
  className?: string;
}

export function FeelControl({ mode = "slider", caption = mode === "slider", className }: FeelControlProps) {
  const { swing, setSwing } = useLessonClock();
  const listId = useId();
  const described = describeSwing(swing);

  if (mode === "toggle") {
    const value = Math.abs(swing - STRAIGHT) < SNAP ? "straight" : "shuffle";
    return (
      <Segmented
        label="Feel"
        options={[
          { id: "straight", label: "Straight" },
          { id: "shuffle", label: "Shuffle" },
        ]}
        value={value}
        onChange={(id) => setSwing(id === "straight" ? STRAIGHT : TRIPLET_SWING)}
        className={className}
      />
    );
  }

  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
        <span className="text-xs">Feel</span>
        <input
          type="range"
          min={STRAIGHT}
          max={HARD_SWING}
          step={0.005}
          list={listId}
          value={swing}
          onChange={(e) => {
            const v = Number(e.target.value);
            const near = DETENTS.find((d) => Math.abs(d.value - v) < SNAP);
            setSwing(near ? near.value : v);
          }}
          aria-label="Swing amount"
          aria-valuetext={described.label}
          className="h-1.5 w-40 cursor-pointer accent-foreground"
        />
        <datalist id={listId}>
          {DETENTS.map((d) => (
            <option key={d.label} value={d.value} label={d.label} />
          ))}
        </datalist>
        <span className="font-mono text-xs text-foreground">
          {described.label} · {Math.round(swing * 100)}%
        </span>
        <span className="flex gap-1">
          {DETENTS.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => setSwing(d.value)}
              aria-pressed={Math.abs(d.value - swing) < SNAP}
              className={cn(
                "rounded-sm px-1.5 py-0.5 text-[11px] transition-colors hover:text-foreground",
                Math.abs(d.value - swing) < SNAP ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
              )}
            >
              {d.label}
            </button>
          ))}
        </span>
      </label>
      {caption && <p className="text-xs text-muted-foreground">{described.caption}</p>}
    </div>
  );
}
