"use client";

/**
 * A YouTube player that ships **collapsed**: a labeled row with a YouTube
 * mark; clicking it expands the reusable `YouTubeEmbed` in place. This is
 * the player on song pages and in articles: the clip stays collapsed until
 * the reader asks for it.
 *
 * Block-level <span> so it stays valid phrasing content between paragraphs,
 * and it shares the `youtubeConductor` (one song at a time) via `YouTubeEmbed`.
 */
import { useState } from "react";
import { ChevronRight, ExternalLink, Youtube } from "lucide-react";

import { cn } from "@/lib/utils";
import { YouTubeEmbed } from "./YouTubeEmbed";

export function CollapsibleVideo({
  videoId,
  label,
  className,
}: {
  videoId: string;
  /** The row text ("Yiddish — The Shvesters, live"). */
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <span
      className={cn(
        "my-4 block w-full rounded-lg border bg-muted/20 p-2 not-italic",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-base text-foreground transition-colors hover:bg-accent"
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
          <a
            href={`https://www.youtube.com/watch?v=${videoId}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1.5 inline-flex items-center gap-1 px-1 text-base text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
          >
            Watch on YouTube
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        </span>
      )}
    </span>
  );
}
