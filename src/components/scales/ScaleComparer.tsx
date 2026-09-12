"use client";

import { useEffect, useState, type ReactNode } from "react";

import { ScaleKeyboard } from "./ScaleKeyboard";
import { DegreeStrip } from "./DegreeStrip";
import { LessonToolbar } from "./LessonToolbar";
import { PlayPatternButton } from "./PlayPatternButton";
import { useScaleLesson } from "./ScaleLessonProvider";
import {
  detuneMapFor,
  hasQuarterTones,
  noteNameAt,
  rootNameFor,
  type ScaleDegree,
} from "@/lib/music/scaleCatalog";
import { NO_DETUNE, centsSuffix } from "@/lib/music/detune";
import { cn } from "@/lib/utils";

export interface ComparerSide {
  id: string;
  /** Short name for the toggle ("Minor pentatonic"). */
  name: string;
  degrees: ScaleDegree[];
  /** Offset to spotlight on this side (the note under discussion), if any. */
  spotlightOffset?: number;
  /**
   * This side's degree 1 sits `rootOffset` semitones above the page root.
   * Use it to show a parent scale on its child's page: E freygish → A
   * harmonic minor is `rootOffset: 5`. The keyboard lights the same keys;
   * only the numbering and the starting note of the run move.
   */
  rootOffset?: number;
}

interface ScaleComparerProps {
  a: ComparerSide;
  b: ComparerSide;
  /** Which side opens selected. */
  defaultSide?: "a" | "b";
  className?: string;
}

const mod12 = (n: number) => ((n % 12) + 12) % 12;

/** Semitone offsets of a side, measured from the *page* root. */
function pageOffsets(side: ComparerSide): Set<number> {
  const shift = side.rootOffset ?? 0;
  return new Set(side.degrees.map((d) => mod12(d.offset + shift)));
}

/** The diatonic number a label refers to ("♭3" → 3). */
function degreeNumber(label: string): number {
  return parseInt(label.replace(/[^0-9]/g, ""), 10);
}

/**
 * A/B two patterns on one keyboard: same root, same octave, same audio —
 * the only thing that changes when you flip the toggle is which keys are in
 * (or, for a re-homed parent scale, which key is called 1). The keyboard is
 * always locked here so an *added* note is audible as a key that was silent
 * a moment ago and now plays.
 *
 * The caption names exactly what the toggle did, in one of four shapes:
 * one side has extra notes (blues vs pentatonic), one note is swapped for
 * another on the same degree (Phrygian vs freygish: ♭3 → 3), the two
 * sides are the same keys with a different home (freygish vs harmonic minor),
 * or notes both come and go (Mixolydian vs blues) and both lists are read out.
 */
export function ScaleComparer({
  a,
  b,
  defaultSide = "a",
  className,
}: ScaleComparerProps) {
  const [side, setSide] = useState<"a" | "b">(defaultSide);
  const { rootPc, setDetuneCents } = useScaleLesson();
  const current = side === "a" ? a : b;
  const other = side === "a" ? b : a;

  const currentShift = current.rootOffset ?? 0;
  const otherShift = other.rootOffset ?? 0;

  /*
   * A quarter-tone side (Rast) is only honest if the keys actually bend
   * while it is selected and stop bending when the other side is. The strip
   * is page-wide, so flipping this toggle presses and releases the switches
   * on the main keyboard too — which is the lesson. Pages with no
   * quarter-tone side never touch the strip.
   */
  const quarterToneComparer =
    hasQuarterTones(a.degrees) || hasQuarterTones(b.degrees);
  useEffect(() => {
    if (!quarterToneComparer) return;
    setDetuneCents(
      hasQuarterTones(current.degrees)
        ? detuneMapFor(mod12(rootPc + currentShift), current.degrees)
        : NO_DETUNE,
    );
  }, [quarterToneComparer, current, currentShift, rootPc, setDetuneCents]);
  const currentRootPc = mod12(rootPc + currentShift);
  const otherRootPc = mod12(rootPc + otherShift);
  const currentRootName = rootNameFor(currentRootPc, current.degrees);
  const otherRootName = rootNameFor(otherRootPc, other.degrees);
  const nameOf = (s: ComparerSide, d: ScaleDegree) =>
    noteNameAt(mod12(rootPc + (s.rootOffset ?? 0)), d.offset, s.degrees);

  const curKeys = pageOffsets(current);
  const othKeys = pageOffsets(other);
  const added = current.degrees.filter(
    (d) => !othKeys.has(mod12(d.offset + currentShift)),
  );
  const removed = other.degrees.filter(
    (d) => !curKeys.has(mod12(d.offset + otherShift)),
  );
  const sameKeys = added.length === 0 && removed.length === 0;
  const reHomed = sameKeys && currentShift !== otherShift;
  // Same keys, same home, but some degree carries a different cents value:
  // the piano shape is shared and only the tuning of a few keys differs.
  const bent =
    sameKeys && !reHomed
      ? current.degrees.filter((d) => {
          const twin = other.degrees.find(
            (o) =>
              mod12(o.offset + otherShift) === mod12(d.offset + currentShift),
          );
          return (twin?.cents ?? 0) !== (d.cents ?? 0);
        })
      : [];

  // Pair each swapped-in note with the swapped-out note on the same degree
  // number, so the caption can say "♭3 (G) became 3 (G♯)".
  const swaps = added
    .map((inDeg) => ({
      inDeg,
      outDeg: removed.find(
        (o) => degreeNumber(o.label) === degreeNumber(inDeg.label),
      ),
    }))
    .filter((s): s is { inDeg: ScaleDegree; outDeg: ScaleDegree } =>
      Boolean(s.outDeg),
    );
  const isSwap =
    swaps.length > 0 &&
    swaps.length === added.length &&
    added.length === removed.length;

  const Note = ({ s, d }: { s: ComparerSide; d: ScaleDegree }) => (
    <>
      <span className="font-mono">{d.label}</span> (
      <span className="font-mono">{nameOf(s, d)}</span>)
    </>
  );

  let caption: ReactNode;
  if (bent.length > 0) {
    const bentNames = bent.map((d) => {
      const twin = other.degrees.find(
        (o) => mod12(o.offset + otherShift) === mod12(d.offset + currentShift),
      );
      return { d, twin };
    });
    const currentBent = bent.some((d) => (d.cents ?? 0) !== 0);
    caption = (
      <>
        <span className="font-medium text-foreground">
          {currentRootName} {current.name}
        </span>{" "}
        uses exactly the same keys as {otherRootName} {other.name.toLowerCase()}{" "}
        — none turn on or off. What changes is the <em>tuning</em> of{" "}
        {bentNames.map(({ d, twin }, i) => (
          <span key={d.offset}>
            {i > 0 && (i === bentNames.length - 1 ? ", and " : ", ")}
            <Note s={current} d={d} />
            {twin && d.cents ? (
              <>
                ,{" "}
                {Math.abs(d.cents) === 50
                  ? "a quarter tone"
                  : centsSuffix(d.cents)}{" "}
                {d.cents < 0 ? "below" : "above"} the piano&apos;s{" "}
                <span className="font-mono">{nameOf(other, twin)}</span>
              </>
            ) : null}
          </span>
        ))}
        {currentBent ? "" : ", back at the piano's own pitch"}. Flip the toggle
        and watch the switches on the tuning strip above press and release; play
        both runs and listen to those keys move.
      </>
    );
  } else if (reHomed) {
    const homeDegree = other.degrees.find(
      (d) => mod12(d.offset + otherShift) === mod12(currentShift),
    );
    caption = (
      <>
        <span className="font-medium text-foreground">
          {currentRootName} {current.name.toLowerCase()}
        </span>{" "}
        uses exactly the same keys as {otherRootName} {other.name.toLowerCase()}
        . Nothing turns on or off — only <span className="font-mono">1</span>{" "}
        moves. Home is now <span className="font-mono">{currentRootName}</span>
        {homeDegree && (
          <>
            , which was the{" "}
            <span className="font-mono">{homeDegree.label}</span> of{" "}
            {otherRootName} {other.name.toLowerCase()}
          </>
        )}
        . Play both runs and hear how the same notes settle in a different
        place.
      </>
    );
  } else if (isSwap) {
    caption = (
      <>
        <span className="font-medium text-foreground">{current.name}</span>{" "}
        keeps every other note but changes{" "}
        {swaps.map(({ inDeg, outDeg }, i) => (
          <span key={inDeg.offset}>
            {i > 0 && " and "}
            <Note s={other} d={outDeg} /> to <Note s={current} d={inDeg} />
          </span>
        ))}
        . Flip the toggle and watch{" "}
        {swaps.length === 1
          ? "one key go dark while its neighbour lights up"
          : `${swaps.length} keys go dark while their neighbours light up`}
        .
      </>
    );
  } else if (added.length > 0 && removed.length > 0) {
    // Neither a clean superset nor a one-for-one swap (Mixolydian vs blues):
    // say both halves so no key changes without being named.
    caption = (
      <>
        <span className="font-medium text-foreground">{current.name}</span> adds{" "}
        {added.map((d, i) => (
          <span key={d.offset}>
            {i > 0 && " and "}
            <Note s={current} d={d} />
          </span>
        ))}{" "}
        and drops{" "}
        {removed.map((d, i) => (
          <span key={d.offset}>
            {i > 0 && (i === removed.length - 1 ? ", and " : ", ")}
            <Note s={other} d={d} />
          </span>
        ))}
        . Flip the toggle and count the keys that change hands.
      </>
    );
  } else if (added.length > 0) {
    caption = (
      <>
        <span className="font-medium text-foreground">{current.name}</span> has{" "}
        {added.map((d, i) => (
          <span key={d.offset}>
            {i > 0 && " and "}
            <Note s={current} d={d} />
          </span>
        ))}{" "}
        that {other.name.toLowerCase()} doesn&apos;t. Flip the toggle and watch
        that key switch between a red dot (locked out) and a green number (in
        the scale).
      </>
    );
  } else {
    caption = (
      <>
        <span className="font-medium text-foreground">{current.name}</span> is{" "}
        {other.name.toLowerCase()} with{" "}
        {removed.map((d, i) => (
          <span key={d.offset}>
            {i > 0 && " and "}
            <Note s={other} d={d} />
          </span>
        ))}{" "}
        removed — flip the toggle to see {removed.length === 1 ? "it" : "them"}{" "}
        come back.
      </>
    );
  }

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
          label={`Play ${currentRootName} ${current.name.toLowerCase()}`}
          offsets={current.degrees.map((d) => d.offset)}
          rootOffset={currentShift}
        />
      </LessonToolbar>

      <ScaleKeyboard
        degrees={current.degrees}
        lockToScale
        rootOffset={currentShift}
        tuningStrip={false}
      />

      <DegreeStrip
        degrees={current.degrees}
        spotlightOffset={current.spotlightOffset}
        rootOffset={currentShift}
      />

      <p
        className="text-xs leading-relaxed text-muted-foreground"
        aria-live="polite"
      >
        {caption}
      </p>
    </div>
  );
}
