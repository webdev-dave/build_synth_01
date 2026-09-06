"use client";

/**
 * Expandable jump list of songs named in an article. Styled as a quiet
 * contents line — no card chrome — so it reads as part of the essay. Clicking
 * a title scrolls that mention to the vertical center of the page. Takes song
 * slugs (or a slug + recording artist) and resolves titles/attribution from
 * the catalog.
 */
import { ChevronDown } from "lucide-react";

import { findSongInArticle, songAnchorId } from "@/components/history/songs";
import {
  getCatalogSong,
  songAttribution,
  songPageRecordings,
} from "@/lib/catalog/songs";

export type SongJumpId = string | { id: string; recording?: string };

function normalize(entry: SongJumpId): { id: string; recording?: string } {
  return typeof entry === "string" ? { id: entry } : entry;
}

function instanceId({ id, recording }: { id: string; recording?: string }) {
  return recording ? `${id}--${recording}` : id;
}

function jumpLabel(
  songTitle: string,
  attribution: string,
  recording?: { label: string },
) {
  return {
    title: songTitle,
    credit: recording?.label ?? attribution,
  };
}

function scrollSongIntoCenter(entry: { id: string; recording?: string }) {
  const preferred = instanceId(entry);
  const el =
    document.getElementById(songAnchorId(preferred)) ??
    document.getElementById(songAnchorId(entry.id));
  if (!el) return;
  const used = document.getElementById(songAnchorId(preferred))
    ? preferred
    : entry.id;
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  history.replaceState(null, "", `#${songAnchorId(used)}`);
  findSongInArticle(used);
}

export function SongJumpNav({ ids }: { ids: SongJumpId[] }) {
  const entries = ids
    .map((raw) => {
      const entry = normalize(raw);
      const song = getCatalogSong(entry.id);
      if (!song) return null;
      const recording = entry.recording
        ? songPageRecordings(song).find(
            (item) => item.artist === entry.recording,
          )
        : undefined;
      return {
        key: instanceId(entry),
        entry,
        ...jumpLabel(song.title, songAttribution(song), recording),
      };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));
  if (entries.length === 0) return null;

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
        {entries.map(({ key, entry, title, credit }) => (
          <li key={key}>
            <a
              href={`#${songAnchorId(instanceId(entry))}`}
              onClick={(e) => {
                e.preventDefault();
                scrollSongIntoCenter(entry);
              }}
              className="text-sm text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
            >
              &ldquo;{title}&rdquo;
              <span> — {credit}</span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
