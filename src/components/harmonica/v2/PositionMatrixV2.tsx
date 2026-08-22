"use client";

import { useState, type CSSProperties } from "react";
import { Printer } from "lucide-react";

import { cn } from "@/lib/utils";
import { NOTES } from "@/lib/music";
import {
  POSITIONS,
  posLabel,
  calculateAllPositions,
  relativeKeyLabel,
} from "@/lib/harmonica";

/**
 * v2 cheat sheet: all 12 harps × 5 positions.
 *
 * Keeps the `.cheatsheet`, `--pos-color`, `.rel-key` and `.rel-key-wrap`
 * hooks that the print CSS in globals.css targets, so "Save as PDF"
 * produces the same paper-friendly sheet as the legacy page.
 */
export function PositionMatrixV2() {
  // Default on: the relative reading is part of the cheat sheet, not an extra.
  const [showRelative, setShowRelative] = useState(true);

  const toggleClass = (active: boolean) =>
    cn(
      "rounded-md border border-input px-2 py-1 font-mono text-[10px] uppercase tracking-wide transition-colors",
      active
        ? "bg-secondary text-secondary-foreground"
        : "text-muted-foreground hover:text-foreground"
    );

  return (
    <div className="cheatsheet overflow-x-auto rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h2 className="text-sm font-medium">
          Full matrix — all 12 harps × 5 positions
        </h2>
        <div className="flex shrink-0 items-center gap-2 print:hidden">
          <button
            type="button"
            onClick={() => setShowRelative((v) => !v)}
            aria-pressed={showRelative}
            className={toggleClass(showRelative)}
          >
            relative keys {showRelative ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className={cn(toggleClass(false), "inline-flex items-center gap-1.5")}
          >
            <Printer className="h-3 w-3" />
            save as PDF
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-[1] border-b bg-card px-1.5 py-1.5 text-left align-top text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Harp
              </th>
              {POSITIONS.map((p) => (
                <th
                  key={p.pos}
                  className="whitespace-nowrap border-b px-1 py-1.5 text-center align-top text-[10px] font-semibold uppercase"
                  style={
                    { color: p.color, "--pos-color": p.color } as CSSProperties
                  }
                >
                  {posLabel(p.pos)}
                  <br />
                  <span className="text-[8px] font-normal text-muted-foreground/70">
                    {p.pos === 2 ? (
                      <>
                        Mixolydian
                        <br />/ Blues
                      </>
                    ) : (
                      p.mode
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {NOTES.map((note, ni) => {
              const results = calculateAllPositions(note, "harpKey");
              const zebra = ni % 2 === 1;
              return (
                <tr key={note} className={zebra ? "bg-muted/30" : ""}>
                  {/* Sticky cells need an opaque background, so the harp
                      column stays bg-card and skips the zebra tint. */}
                  <td className="sticky left-0 z-[1] border-b border-border/60 bg-card px-1.5 py-[7px] font-semibold">
                    {note}
                  </td>
                  {results.map((r) => {
                    const relative = relativeKeyLabel(r.playingKey, r);
                    return (
                      <td
                        key={r.pos}
                        className={cn(
                          "border-b border-border/60 px-1 py-[7px] text-center text-muted-foreground",
                          r.pos === 2 && "font-semibold text-foreground"
                        )}
                      >
                        {r.playingKey}
                        {relative && (
                          <span
                            className={cn(
                              "rel-key-wrap",
                              !showRelative && "hidden print:contents"
                            )}
                          >
                            <br />
                            <span className="rel-key text-[8px] font-normal text-muted-foreground/60">
                              {relative}
                            </span>
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-2.5 text-[10px] text-muted-foreground/70">
        Read as: &quot;[harp] in [position] → play in [key]&quot;
        <span className={showRelative ? undefined : "hidden print:inline"}>
          {" "}
          · small line on 1st / 4th = relative pair (same notes: C and{" "}
          <span className="font-mono">Am</span>, etc.)
        </span>
      </p>
    </div>
  );
}
