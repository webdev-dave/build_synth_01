"use client";

/**
 * A song named in an article, resolved from the editorial catalog by slug:
 *
 *   <SongLink id="st-louis-blues" />
 *   <SongLink id="dona-dona" recording="the-shvesters">The Shvesters</SongLink>
 *
 * Title, attribution, YouTube id, and Piano Roll link all live in
 * `src/lib/catalog/songs.ts` — the article just names the song. The title sits
 * inline with a YouTube icon; clicking it inserts a full-width panel into the
 * article flow (same width as the prose column) that pushes the rest of the
 * body down — not an overlay. Pass `recording` (a catalog artist slug on a
 * labeled upload) to name that performance in the sentence instead of the
 * song title:
 *
 *   • Open in Piano Roll — /piano-roll/<pianoRollId>, or greyed out when the
 *     song isn't in the MIDI library yet.
 *   • Play on YouTube — expands a reusable inline player (one plays at a
 *     time). Songs with labeled `recordings` get one row per upload.
 *   • About this song / More about <artist> — cross-links into the catalog.
 *
 * Client leaf so the article body can stay server-rendered. Uses phrasing-
 * level elements so it remains valid inside the article's <p>s.
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ExternalLink, Info, Piano, User, Youtube } from "lucide-react";

import { cn } from "@/lib/utils";
import { YouTubeEmbed } from "@/components/media/YouTubeEmbed";
import { FIND_SONG_EVENT, songAnchorId } from "@/components/history/songs";
import {
  getCatalogSong,
  songAttribution,
  songLinkArtists,
  songPageRecordings,
  songTitleParts,
} from "@/lib/catalog/songs";
import { getArtist } from "@/lib/catalog/artists";
import { GenrePills } from "@/components/content/GenrePills";
import { NativeScript } from "@/components/words/NativeScript";

/** How long the "find me" highlight stays on after a jump-nav scroll. */
const FIND_MS = 2800;

export function SongLink({
  id,
  recording,
  children,
}: {
  id: string;
  /** Catalog artist slug on a labeled recording — names that upload. */
  recording?: string;
  children?: React.ReactNode;
}) {
  const song = getCatalogSong(id);
  const instanceId = recording ? `${id}--${recording}` : id;
  const [open, setOpen] = useState(false);
  const [playingIds, setPlayingIds] = useState<string[]>([]);
  const [found, setFound] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function onFind(e: Event) {
      const foundId = (e as CustomEvent<string>).detail;
      setFound(foundId === instanceId);
    }
    window.addEventListener(FIND_SONG_EVENT, onFind);
    return () => window.removeEventListener(FIND_SONG_EVENT, onFind);
  }, [instanceId]);

  useEffect(() => {
    if (!found) return;
    const t = window.setTimeout(() => setFound(false), FIND_MS);
    return () => window.clearTimeout(t);
  }, [found]);

  // No outside-click / blur collapse: once a song panel is open it stays open
  // (and its YouTube player keeps playing) until the user deliberately closes
  // it — by toggling the title again or pressing Escape — or navigates away.
  // A stray click anywhere on the page used to unmount the iframe and kill
  // playback; that surprise is worse than an open panel. Switching songs is
  // handled by the conductor (it pauses the previous one), so it never needs to
  // collapse a panel to keep "one song at a time."
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  function close() {
    setOpen(false);
    setPlayingIds([]);
  }

  function togglePlaying(youtubeId: string) {
    setPlayingIds((ids) =>
      ids.includes(youtubeId)
        ? ids.filter((id) => id !== youtubeId)
        : [...ids, youtubeId],
    );
  }

  // Unknown slug: render plainly (loud in dev) rather than a broken affordance.
  if (!song) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`<SongLink> unknown song id: "${id}"`);
    }
    return <>&ldquo;{id}&rdquo;</>;
  }

  const attribution = songAttribution(song);
  const titleParts = songTitleParts(song);
  const recordings = songPageRecordings(song);
  const focusRecording = recording
    ? recordings.find((item) => item.artist === recording)
    : undefined;
  if (recording && !focusRecording && process.env.NODE_ENV !== "production") {
    console.warn(`<SongLink> no recording artist "${recording}" on "${id}"`);
  }
  const canPlay = focusRecording
    ? Boolean(focusRecording.youtubeId)
    : recordings.length > 0;
  const labeledRecordings = recordings.length > 1;
  const artists = songLinkArtists(song)
    .map((slug) => getArtist(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  const recordingArtist = recording ? getArtist(recording) : undefined;

  return (
    // `contents` so the trigger stays inline in the sentence while the
    // panel becomes a block sibling of the surrounding prose.
    <span data-song-link={instanceId} className="contents">
      <motion.button
        type="button"
        onClick={() => {
          if (open) {
            close();
            return;
          }
          setOpen(true);
          if (focusRecording) setPlayingIds([focusRecording.youtubeId]);
        }}
        aria-haspopup="true"
        aria-expanded={open}
        id={songAnchorId(instanceId)}
        data-song-link={instanceId}
        animate={
          found && !reduceMotion
            ? {
                boxShadow: [
                  "0 0 0 0px hsl(var(--foreground) / 0)",
                  "0 0 0 8px hsl(var(--foreground) / 0.14)",
                  "0 0 0 8px hsl(var(--foreground) / 0.14)",
                  "0 0 0 0px hsl(var(--foreground) / 0)",
                ],
              }
            : { boxShadow: "0 0 0 0px hsl(var(--foreground) / 0)" }
        }
        transition={{ duration: 2.8, times: [0, 0.12, 0.7, 1], ease: "easeInOut" }}
        className={cn(
          "group/song scroll-mt-[50vh] inline-flex items-baseline gap-1 rounded-sm border-b border-dotted border-muted-foreground/50 px-0.5 font-medium text-foreground transition-colors hover:border-foreground",
          found && "border-foreground bg-accent",
        )}
      >
        {children ??
          (recordingArtist ? (
            recordingArtist.name
          ) : (
            <>&ldquo;{song.title}&rdquo;</>
          ))}
        {/* YouTube red on purpose: the mark is how the icon reads as "play
            a video," not a second brand accent for the page. */}
        {canPlay && (
          <Youtube
            className="h-3.5 w-3.5 translate-y-px text-red-600"
            strokeWidth={1.75}
            aria-hidden
          />
        )}
      </motion.button>

      {open && (
        <span
          role="region"
          aria-label={`${song.title} — listen and explore`}
          data-song-link={id}
          className="my-4 block w-full rounded-lg border bg-muted/20 p-2 text-left not-italic"
        >
          {/* Non-English songs: name the tune in both languages up top. */}
          {(titleParts.native || titleParts.english) && (
            <span className="mb-1 flex flex-wrap items-baseline gap-x-2 px-2.5 pt-1 text-xs text-muted-foreground">
              {titleParts.native && (
                <NativeScript
                  spelling={titleParts.native}
                  lang={titleParts.lang ?? "und"}
                  className="text-sm text-foreground"
                />
              )}
              {titleParts.english && <span>“{titleParts.english}”</span>}
            </span>
          )}
          {song.pianoRollId ? (
            <Link
              href={`/piano-roll/${song.pianoRollId}`}
              target="_blank"
              rel="noreferrer"
              className="group/roll flex items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <span className="inline-flex items-center gap-2.5">
                <Piano
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden
                />
                Open in Piano Roll
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover/roll:translate-x-0.5"
                aria-hidden
              />
            </Link>
          ) : (
            <span
              aria-disabled="true"
              title="Not in the song library yet"
              className="flex cursor-not-allowed items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-muted-foreground/50"
            >
              <Piano className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden />
              Open in Piano Roll
            </span>
          )}

          {canPlay ? (
            recordings.map((recording) => {
              const playing = playingIds.includes(recording.youtubeId);
              return (
                <span key={recording.youtubeId} className="block">
                  <button
                    type="button"
                    onClick={() => togglePlaying(recording.youtubeId)}
                    aria-expanded={playing}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    <Youtube
                      className="h-4 w-4 shrink-0 text-red-600"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    {labeledRecordings
                      ? `Play ${recording.label}`
                      : "Play on YouTube"}
                  </button>

                  {playing && (
                    <span className="mt-1.5 block px-1 pb-1">
                      <YouTubeEmbed
                        videoId={recording.youtubeId}
                        title={
                          labeledRecordings
                            ? `${song.title} — ${recording.label}`
                            : attribution
                        }
                        autoplay
                      />
                      <a
                        href={`https://www.youtube.com/watch?v=${recording.youtubeId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                      >
                        Watch on YouTube
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    </span>
                  )}
                </span>
              );
            })
          ) : song.listen ? (
            <a
              href={song.listen.url}
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <ExternalLink
                className="h-4 w-4 shrink-0 text-muted-foreground"
                aria-hidden
              />
              {song.listen.label}
            </a>
          ) : null}

          <GenrePills slugs={song.genres} compact className="mt-1 px-2.5" />

          {/* Cross-links into the catalog — the song's own page and its
              artists' pages, so every mention is a doorway into the graph. */}
          <span className="mt-1 block border-t border-border/60 pt-1">
            <Link
              href={`/songs/${song.slug}`}
              className="group/song-page flex items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
            >
              <span className="inline-flex items-center gap-2.5">
                <Info
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden
                />
                About &ldquo;{song.title}&rdquo;
              </span>
              <ArrowRight
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover/song-page:translate-x-0.5"
                aria-hidden
              />
            </Link>
            {artists.map((artist) => (
              <Link
                key={artist.slug}
                href={`/artists/${artist.slug}`}
                className="group/artist flex items-center justify-between gap-2.5 rounded-md px-2.5 py-2 text-sm text-foreground transition-colors hover:bg-accent"
              >
                <span className="inline-flex items-center gap-2.5">
                  <User
                    className="h-4 w-4 shrink-0 text-muted-foreground"
                    strokeWidth={1.75}
                    aria-hidden
                  />
                  More about {artist.name}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover/artist:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </span>
        </span>
      )}
    </span>
  );
}
