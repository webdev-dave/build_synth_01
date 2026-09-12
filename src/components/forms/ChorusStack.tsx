"use client";

/**
 * The repetition view: every chorus of the song as a row of the same
 * twelve cells. The chord row never changes from chorus to chorus; the
 * words under it do — which is the whole lesson: form is what repeats.
 * Hover or focus a bar to read the same bar down every chorus; while
 * playing, the sounding bar lights in the sounding chorus only.
 */
import { useState } from "react";

import { useOptionalProgression } from "@/components/progressions/ProgressionProvider";
import { cn } from "@/lib/utils";
import { useForm } from "./FormProvider";

interface ChorusStackProps {
  className?: string;
}

export function ChorusStack({ className }: ChorusStackProps) {
  const { form, bars, spans, choruses, lyric, currentBar, currentChorus, jumpTo, progression } =
    useForm();
  const chart = useOptionalProgression();
  const [hoverBar, setHoverBar] = useState<number | null>(null);

  const columns = { gridTemplateColumns: `repeat(${bars}, minmax(0, 1fr))` };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="space-y-2" role="group" aria-label={`${form.name}: every chorus stacked`}>
        {choruses.map((chorus, c) => {
          const lines = lyric[c]?.lines ?? [];
          return (
            <div key={chorus.id} className="space-y-1">
              <p className="text-[11px] text-muted-foreground">{chorus.label}</p>
              <ol className="grid gap-px" style={columns}>
                {Array.from({ length: bars }, (_, i) => {
                  const isCurrent = currentChorus === c && currentBar === i;
                  const isColumn = hoverBar === i;
                  const numeral = chart ? chart.bars[i].chord.numeral : String(i + 1);
                  return (
                    <li key={i} className="min-w-0">
                      <button
                        type="button"
                        aria-label={`${chorus.label}, bar ${i + 1}, ${numeral}`}
                        aria-current={isCurrent ? "true" : undefined}
                        onMouseEnter={() => setHoverBar(i)}
                        onMouseLeave={() => setHoverBar(null)}
                        onFocus={() => setHoverBar(i)}
                        onBlur={() => setHoverBar(null)}
                        onClick={progression ? () => jumpTo(c, i) : undefined}
                        disabled={!progression}
                        className={cn(
                          "flex h-7 w-full items-center justify-center rounded-sm border font-mono text-[11px] transition-colors",
                          isCurrent
                            ? "border-orange-600 bg-orange-700/10 text-orange-600"
                            : "bg-background text-foreground",
                          isColumn && !isCurrent && "border-foreground/50",
                          progression && "hover:bg-accent/40",
                        )}
                      >
                        {numeral}
                      </button>
                    </li>
                  );
                })}
              </ol>
              <div className="grid gap-px" style={columns}>
                {spans
                  .filter((s) => s.role !== "response")
                  .map((s) => {
                    const line = lines[s.sectionIndex];
                    return (
                      <p
                        key={s.from}
                        className={cn(
                          "truncate px-0.5 text-[11px] leading-tight",
                          line ? "text-muted-foreground" : "text-muted-foreground/60",
                        )}
                        style={{ gridColumn: `${s.from + 1} / span ${s.section.bars}` }}
                        title={line}
                      >
                        {line ? `“${line}”` : chorus.instrumental ? "— lead —" : "—"}
                      </p>
                    );
                  })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="font-mono text-xs text-muted-foreground">
        {hoverBar != null && chart ? (
          <>
            bar {hoverBar + 1} · {chart.bars[hoverBar].chord.numeral} in every chorus
          </>
        ) : (
          <>Form is what repeats: the chords in every row are the same; only the words change.</>
        )}
      </p>
    </div>
  );
}
