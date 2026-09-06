/**
 * Scannable family list for a cousin article — every catalog member with
 * year, place, language, and kind. Not a second essay.
 *
 * The song title is a stretched link (same card-hit pattern as the song hub).
 * Genre pills and recording-artist links sit above it so they are never
 * nested `<a>`s.
 */
import Link from "next/link";

import {
  COUSIN_KIND_LABEL,
  type CousinArticle,
} from "@/lib/cousins/registry";
import {
  getCatalogSong,
  songAttribution,
  songPageRecordings,
} from "@/lib/catalog/songs";
import { getArtist } from "@/lib/catalog/artists";
import { getPlace } from "@/lib/places/registry";
import { GenrePills } from "@/components/content/GenrePills";

export function CousinFamilyList({ article }: { article: CousinArticle }) {
  const rows = article.members
    .map((member) => {
      const song = getCatalogSong(member.song);
      if (!song) return null;
      const place = member.place ? getPlace(member.place) : undefined;
      return { member, song, place };
    })
    .filter((row): row is NonNullable<typeof row> => Boolean(row));

  if (rows.length === 0) return null;

  return (
    <ol className="mt-4 divide-y rounded-lg border">
      {rows.map(({ member, song, place }) => {
        const labeledRecordings = songPageRecordings(song).flatMap(
          (recording) => {
            if (!recording.artist) return [];
            return [{ ...recording, artist: recording.artist }];
          },
        );

        return (
          <li
            key={`${member.song}-${member.kind}-${member.year ?? ""}`}
            className="relative transition-colors hover:bg-accent/40 has-[a.card-hit:focus-visible]:ring-2 has-[a.card-hit:focus-visible]:ring-ring has-[a.card-hit:focus-visible]:ring-offset-2 has-[a.card-hit:focus-visible]:ring-offset-background"
          >
            <div className="px-3 py-3">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="text-sm font-medium text-foreground">
                  <Link
                    href={`/songs/${song.slug}`}
                    className="card-hit after:absolute after:inset-0 focus-visible:outline-none"
                  >
                    {song.title}
                  </Link>
                  <span className="relative z-10 ms-2 font-normal text-muted-foreground">
                    {songAttribution(song)}
                  </span>
                </span>
                <span className="relative z-10 font-mono text-xs text-muted-foreground">
                  {COUSIN_KIND_LABEL[member.kind]}
                </span>
              </div>
              <p className="relative z-10 mt-1 text-xs text-muted-foreground">
                {[
                  member.year ?? song.year,
                  place?.name,
                  member.language,
                ]
                  .filter(Boolean)
                  .join(" · ")}
                {member.note ? ` — ${member.note}` : ""}
              </p>
              {labeledRecordings.length > 1 && (
                <ul className="relative z-10 mt-2 space-y-1">
                  {labeledRecordings.map((recording) => {
                    const artist = getArtist(recording.artist);
                    if (!artist) {
                      return (
                        <li
                          key={recording.youtubeId}
                          className="text-xs text-muted-foreground"
                        >
                          {recording.label}
                        </li>
                      );
                    }
                    return (
                      <li key={recording.youtubeId}>
                        <Link
                          href={`/artists/${artist.slug}`}
                          className="text-xs text-foreground underline-offset-2 hover:underline"
                        >
                          {recording.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
              <GenrePills
                slugs={song.genres}
                compact
                className="relative z-10 mt-2"
              />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
