"use client";

/**
 * A YouTube player that ships **collapsed**: a labeled row with a YouTube
 * mark; clicking it expands the reusable `YouTubeEmbed` in place. Use it in
 * long-form articles when a video should be *offered*, not auto-loaded — the
 * page stays quiet until the reader asks for the clip.
 *
 * Block-level <span> so it stays valid phrasing content between paragraphs,
 * and it shares the `youtubeConductor` (one song at a time) via `YouTubeEmbed`.
 */
import { useState } from "react";
import { ChevronRight, Youtube } from "lucide-react";

import { cn } from "@/lib/utils";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function CollapsibleVideo({
  videoId,
  label,
}: {
  videoId: string;
  /** The row text ("Yiddish — The Shvesters, live"). */
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span className="my-4 block w-full rounded-lg border bg-muted/20 p-2 not-italic">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
      >
        <Youtube
          className="h-4 w-4 shrink-0 text-red-600"
          strokeWidth={1.75}
          aria-hidden
        />
        <span className="flex-1 text-left font-medium">{label}</span>
        <ChevronRight
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-90",
          )}
          aria-hidden
        />
      </button>
      {open && (
        <span className="mt-1.5 block px-1 pb-1">
          {/* User click is the consent to load + play. */}
          <YouTubeEmbed videoId={videoId} title={label} autoplay />
        </span>
      )}
    </span>
  );
}
