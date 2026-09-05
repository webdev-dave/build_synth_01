"use client";

/**
 * Expandable jump list of songs named in an article. Styled as a quiet
 * contents line — no card chrome — so it reads as part of the essay. Clicking
 * a title scrolls that mention to the vertical center of the page. Takes song
 * slugs and resolves titles/attribution from the catalog.
 */
import { ChevronDown } from "lucide-react";

import { findSongInArticle, songAnchorId } from "@/components/history/songs";
import { getCatalogSong, songAttribution } from "@/lib/catalog/songs";

function scrollSongIntoCenter(id: string) {
  const el = document.getElementById(songAnchorId(id));
  if (!el) return;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  history.replaceState(null, "", `#${songAnchorId(id)}`);
  findSongInArticle(id);
}

export function SongJumpNav({ ids }: { ids: string[] }) {
  const songs = ids
    .map((id) => getCatalogSong(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  if (songs.length === 0) return null;

  return (
    <details className="group mt-6">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
        Songs in this article
        <ChevronDown
          className="h-3.5 w-3.5 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ol className="mt-2 space-y-1">
        {songs.map((song) => (
          <li key={song.slug}>
            <a
              href={`#${songAnchorId(song.slug)}`}
              onClick={(e) => {
                e.preventDefault();
                scrollSongIntoCenter(song.slug);
              }}
              className="text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              &ldquo;{song.title}&rdquo;
              <span> — {songAttribution(song)}</span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
