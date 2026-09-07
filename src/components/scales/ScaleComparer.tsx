"use client";

import { useState } from "react";

import { ScaleKeyboard } from "./ScaleKeyboard";
import { DegreeStrip } from "./DegreeStrip";
import { LessonToolbar } from "./LessonToolbar";
import { PlayPatternButton } from "./PlayPatternButton";
import { useScaleLesson } from "./ScaleLessonProvider";
import { flatName, type ScaleDegree } from "./notes";
import { cn } from "@/lib/utils";

export interface ComparerSide {
  id: string;
  /** Short name for the toggle ("Minor pentatonic"). */
  name: string;
  degrees: ScaleDegree[];
  /** Offset to spotlight on this side (the note under discussion), if any. */
  spotlightOffset?: number;
}

interface ScaleComparerProps {
  a: ComparerSide;
  b: ComparerSide;
  /** Which side opens selected. */
  defaultSide?: "a" | "b";
  className?: string;
}

/**
 * A/B two patterns on one keyboard: same root, same octave, same audio —
 * the only thing that changes when you flip the toggle is which keys are in.
 * The keyboard is always locked here so the *added* note is audible as a key
 * that was silent a moment ago and now plays.
 */
export function ScaleComparer({
  a,
  b,
  defaultSide = "a",
  className,
}: ScaleComparerProps) {
  const [side, setSide] = useState<"a" | "b">(defaultSide);
  const { rootName, rootPc } = useScaleLesson();
  const current = side === "a" ? a : b;
  const other = side === "a" ? b : a;

  // The note(s) one side has and the other lacks — named so the caption can
  // say exactly what the toggle just did.
  const added = current.degrees.filter(
    (d) => !other.degrees.some((o) => o.offset === d.offset),
  );

  return (
    <div className={cn("space-y-3", className)}>
      <div
        role="group"
        aria-label="Compare scales"
        className="inline-flex overflow-hidden rounded-md border border-input"
      >
        {(["a", "b"] as const).map((key) => {
          const s = key === "a" ? a : b;
          const selected = side === key;
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setSide(key)}
              className={cn(
                "border-l border-input px-3 py-1.5 text-xs font-medium transition-colors first:border-l-0",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                selected
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              {s.name}
              <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">
                {s.degrees.length} notes
              </span>
            </button>
          );
        })}
      </div>

      <LessonToolbar>
        <PlayPatternButton
          label={`Play ${rootName} ${current.name.toLowerCase()}`}
          offsets={current.degrees.map((d) => d.offset)}
        />
      </LessonToolbar>

      <ScaleKeyboard degrees={current.degrees} lockToScale />

      <DegreeStrip
        degrees={current.degrees}
        spotlightOffset={current.spotlightOffset}
      />

      <p className="text-xs leading-relaxed text-muted-foreground" aria-live="polite">
        {added.length > 0 ? (
          <>
            <span className="font-medium text-foreground">{current.name}</span>{" "}
            has{" "}
            {added.map((d, i) => (
              <span key={d.offset}>
                {i > 0 && " and "}
                <span className="font-mono">{d.label}</span> (
                <span className="font-mono">{flatName(rootPc + d.offset)}</span>)
              </span>
            ))}{" "}
            that {other.name.toLowerCase()} doesn&apos;t. Flip the toggle and watch
            that key switch between a red dot (locked out) and a green number
            (in the scale).
          </>
        ) : (
          <>
            <span className="font-medium text-foreground">{current.name}</span>{" "}
            is {other.name.toLowerCase()} with a note removed — flip the toggle
            to see which key comes back.
          </>
        )}
      </p>
    </div>
  );
}
