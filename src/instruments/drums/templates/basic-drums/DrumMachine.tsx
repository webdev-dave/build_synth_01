"use client";

/**
 * The drum machine page: chrome around the same pieces the lessons use.
 * A pattern bank seeded from the grooves registry, tempo, a swing slider,
 * loop, and the editable grid with every kit voice as a row. Nothing here
 * that the lesson grid can't do — this is where you do it without prose.
 *
 * `?pattern=<slug>` opens on that groove; read after mount because the
 * site is a static export. Switching patterns remounts the provider (a
 * new clock at the pattern's tempo and feel), which also stops playback.
 */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

import { FeelControl } from "@/components/grooves/FeelControl";
import { GrooveGrid } from "@/components/grooves/GrooveGrid";
import { GroovePlayer } from "@/components/grooves/GroovePlayer";
import { GrooveProvider } from "@/components/grooves/GrooveProvider";
import { GROOVES, getGroove, type Groove } from "@/lib/grooves/registry";
import { readPatternParam } from "@/lib/grooves/param";
import { VOICE_ORDER, type DrumVoice } from "@/lib/music/grooves";
import { cn } from "@/lib/utils";

const BANK: Groove[] = GROOVES.filter((g) => g.kind === "groove");
/** Every playable voice, so an empty row is there to fill; the count click stays a lesson thing. */
const ROWS: readonly DrumVoice[] = VOICE_ORDER.filter((v) => v !== "click");

interface DrumMachineProps {
  /** Read `?pattern=` after mount. */
  readPatternFromUrl?: boolean;
  className?: string;
}

export function DrumMachine({ readPatternFromUrl = false, className }: DrumMachineProps) {
  const [slug, setSlug] = useState(BANK[0].slug);

  useEffect(() => {
    if (!readPatternFromUrl) return;
    const wanted = readPatternParam(window.location.search);
    if (wanted && BANK.some((g) => g.slug === wanted)) setSlug(wanted);
  }, [readPatternFromUrl]);

  const groove = getGroove(slug) ?? BANK[0];

  return (
    <div className={cn("space-y-5", className)}>
      <div role="group" aria-label="Pattern bank" className="flex flex-wrap gap-1.5">
        {BANK.map((g) => {
          const on = g.slug === groove.slug;
          return (
            <button
              key={g.slug}
              type="button"
              aria-pressed={on}
              onClick={() => setSlug(g.slug)}
              className={cn(
                "rounded-md border px-2.5 py-1 text-xs transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                on
                  ? "border-foreground/40 bg-secondary text-secondary-foreground"
                  : "border-input text-muted-foreground hover:bg-accent/50 hover:text-foreground",
              )}
            >
              {g.name}
            </button>
          );
        })}
      </div>

      <GrooveProvider key={groove.slug} groove={groove}>
        <div className="space-y-4 rounded-lg border bg-muted/20 p-4 sm:p-5">
          <GroovePlayer label="Play" />
          {groove.pattern.stepsPerBeat % 2 === 0 && <FeelControl />}
          <GrooveGrid voices={ROWS} underlay={groove.pattern.stepsPerBeat === 2 ? 3 : undefined} />
          <p className="text-xs text-muted-foreground">
            Tap a cell to add or remove a hit; <span className="font-mono">Shift</span>-tap for a
            ghost note; click a row name to mute it. <span className="font-mono">{groove.formula}</span>
          </p>
        </div>
      </GrooveProvider>

      <Link
        href={`/rhythm/${groove.slug}`}
        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {groove.question}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
