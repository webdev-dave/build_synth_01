"use client";

/**
 * The map of a form: three strips, one playhead.
 *
 * - **Song strip** — choruses as blocks whose width is bars. Click one to
 *   jump there.
 * - **Chorus strip** — the cycle's bars in rows of four, with the sections
 *   drawn above them as spans: the sung line over the call bars, an
 *   "answer" over the response bars. The sounding chord's cell is lit; the
 *   answer span lights only while the lead is actually playing in it.
 * - **Bar strip** — the beats of the current bar, so the fine clock is
 *   never lost.
 *
 * A read-out names the position in words. Forms with no progression draw
 * the map static and say so — nothing lights that isn't heard.
 */
import { useEffect, useState } from "react";

import { BarTimeline, type BarCell, type BarSpan } from "@/components/content/BarTimeline";
import { useOptionalLessonClock } from "@/components/lessons/LessonClock";
import { useOptionalProgression } from "@/components/progressions/ProgressionProvider";
import { placeOfBar } from "@/lib/forms/registry";
import { cn } from "@/lib/utils";
import { spanKey, useForm } from "./FormProvider";

interface FormMapProps {
  /** Show the song strip (choruses as blocks). */
  song?: boolean;
  /** Show the bar strip (beats of the current bar). */
  beats?: boolean;
  readout?: boolean;
  className?: string;
}

export function FormMap({ song = true, beats = true, readout = true, className }: FormMapProps) {
  const {
    form,
    bars,
    spans,
    choruses,
    lyric,
    currentBar,
    currentChorus,
    currentBeat,
    beatsPerBar,
    soundingSpan,
    jumpTo,
    chartBar,
  } = useForm();
  const chart = useOptionalProgression();
  const playing = useOptionalLessonClock()?.playing ?? false;

  // Which chorus's words to show: the sounding one while playing, else the
  // last one heard (or the first), so stopping never blanks the map.
  const [viewChorus, setViewChorus] = useState(0);
  useEffect(() => {
    if (currentChorus != null) setViewChorus(currentChorus);
  }, [currentChorus]);
  const [clicked, setClicked] = useState<number | null>(null);

  const lines = lyric[viewChorus]?.lines ?? [];
  const chorus = choruses[viewChorus];

  const cells: BarCell[] = Array.from({ length: bars }, (_, i) => {
    const place = placeOfBar(form, i);
    const bar = chart ? chartBar(i) : null;
    if (chart && bar) {
      const name = chart.nameOf(bar.chord);
      return {
        top: bar.chord.numeral,
        bottom: name,
        label: `Bar ${i + 1}, ${bar.chord.numeral}, ${name}${place ? `, ${place.role}` : ""}`,
      };
    }
    return {
      top: String(i + 1),
      bottom: place?.section.label,
      label: `Bar ${i + 1}${place ? `, ${place.section.label}` : ""}`,
    };
  });

  const barSpans: BarSpan[] = spans.map((s) => {
    const key = spanKey(viewChorus, s.from);
    if (s.role === "call") {
      const line = lines[s.sectionIndex];
      return {
        from: s.from,
        length: s.length,
        tone: "call",
        wrap: true,
        active: soundingSpan === key,
        label: (
          <>
            <span className="font-mono">{s.section.label}</span>
            {line ? (
              <>
                {" "}
                <span className="italic">“{line}”</span>
              </>
            ) : chorus?.instrumental ? (
              <span className="text-muted-foreground"> · lead</span>
            ) : null}
          </>
        ),
      };
    }
    if (s.role === "response") {
      return {
        from: s.from,
        length: s.length,
        tone: "response",
        active: soundingSpan === key,
        label: <span>↳ answer</span>,
      };
    }
    return {
      from: s.from,
      length: s.length,
      tone: "neutral",
      label: <span className="font-mono">{s.section.label}</span>,
    };
  });

  const current = currentBar ?? (chart?.clickSounding ? clicked : null);

  const onSelect = chart
    ? (i: number) => {
        setClicked(i);
        if (playing) jumpTo(viewChorus, i);
        else {
          const bar = chartBar(i);
          if (bar) chart.soundChord(bar.chord);
        }
      }
    : undefined;

  const place = currentBar != null ? placeOfBar(form, currentBar) : undefined;

  return (
    <div className={cn("space-y-3", className)}>
      {song && choruses.length > 1 && (
        <ol
          className="flex w-full gap-1"
          role="group"
          aria-label={`${form.name}: the song as choruses`}
        >
          {choruses.map((c, i) => {
            const isCurrent = currentChorus === i;
            return (
              <li key={c.id} className="min-w-0" style={{ flex: `${bars} 1 0` }}>
                <button
                  type="button"
                  aria-label={`${c.label}, ${bars} bars`}
                  aria-current={isCurrent ? "true" : undefined}
                  onClick={() => jumpTo(i)}
                  className={cn(
                    "w-full truncate rounded-md border px-2 py-1.5 text-left text-xs transition-colors",
                    c.instrumental && "border-dashed",
                    isCurrent
                      ? "border-orange-600 bg-orange-700/10 text-orange-600"
                      : "bg-background text-muted-foreground hover:border-foreground/25 hover:bg-accent/40 hover:text-foreground",
                    !isCurrent && !playing && viewChorus === i && "text-foreground",
                  )}
                >
                  {c.label}
                </button>
              </li>
            );
          })}
        </ol>
      )}

      <BarTimeline
        cells={cells}
        perRow={4}
        current={current}
        upcoming={chart?.upcomingBar ?? null}
        spans={barSpans}
        onSelect={onSelect}
        ariaLabel={`${form.name}: one chorus${chart ? ` in ${chart.keyName}` : ""}`}
      />

      {beats && chart && (
        <ol
          className="flex items-center gap-1.5"
          role="group"
          aria-label="Beats of the current bar"
        >
          {Array.from({ length: beatsPerBar }, (_, b) => (
            <li
              key={b}
              aria-current={currentBeat === b ? "true" : undefined}
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-sm border font-mono text-[11px] transition-colors",
                currentBeat === b
                  ? "border-orange-600 bg-orange-700/10 text-orange-600"
                  : "text-muted-foreground",
              )}
            >
              {b + 1}
            </li>
          ))}
          <li className="ms-1 text-[11px] text-muted-foreground" aria-hidden>
            beat
          </li>
        </ol>
      )}

      {readout && (
        <p className="font-mono text-xs text-muted-foreground">
          {currentBar != null && place ? (
            <>
              {choruses.length > 1 && <>{choruses[currentChorus ?? 0]?.label} · </>}
              {place.section.line != null ? "line " : ""}
              {place.section.label} · bar {currentBar + 1} of {bars}
              {place.role !== "plain" && <> · {place.role === "call" ? "call" : "answer"}</>}
              {chart && chartBar(currentBar) && (
                <> · {chart.nameOf(chartBar(currentBar)!.chord)}</>
              )}
            </>
          ) : chart ? (
            <>
              {choruses.length > 1 && <>{choruses.length} choruses · </>}
              {bars} bars · {chart.keyName}
            </>
          ) : (
            <>{bars} bars · drawn, not heard — this form has no chart on the site yet</>
          )}
        </p>
      )}
    </div>
  );
}
