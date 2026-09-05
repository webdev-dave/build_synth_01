"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ARTISTS } from "@/lib/catalog/artists";
import { songsByArtist } from "@/lib/catalog/songs";
import { searchArtists } from "@/lib/catalog/search";
import { genreOptionsFrom } from "@/lib/search/options";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HubSearch,
  genreChipGroup,
} from "@/components/content/HubSearch";

export function ArtistsExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [hasSong, setHasSong] = useState(false);

  const genreOptions = useMemo(
    () =>
      genreOptionsFrom(ARTISTS.flatMap((artist) => artist.genres ?? [])),
    [],
  );
  const showHasSong =
    ARTISTS.some((artist) => songsByArtist(artist.slug).length > 0) &&
    ARTISTS.some((artist) => songsByArtist(artist.slug).length === 0);

  const matches = useMemo(
    () => searchArtists(query, { genre, hasSong: hasSong || undefined }),
    [query, genre, hasSong],
  );
  const filtering = query.trim().length > 0 || Boolean(genre) || hasSong;

  const groups = [
    genreChipGroup(genreOptions, genre, setGenre),
    {
      label: "Also",
      chips: showHasSong
        ? [
            {
              id: "has-song",
              label: "Has a song on the site",
              pressed: hasSong,
              onToggle: () => setHasSong((on) => !on),
            },
          ]
        : [],
    },
  ];

  return (
    <HubSearch
      headingId="artists-heading"
      heading={
        filtering
          ? `${matches.length} of ${ARTISTS.length}`
          : `${ARTISTS.length} ${ARTISTS.length === 1 ? "artist" : "artists"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search an artist, song, or genre…"
      searchLabel="Search artists"
      controlsId="artists-grid"
      groups={groups}
      empty={
        matches.length === 0
          ? query.trim()
            ? `No artist matches “${query.trim()}”. Try a name, a song, or a genre.`
            : "No artist matches those filters."
          : undefined
      }
      onClearFilters={
        filtering
          ? () => {
              setQuery("");
              setGenre(undefined);
              setHasSong(false);
            }
          : undefined
      }
    >
      <div
        id="artists-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((artist) => {
          const soon = artist.status === "soon";
          return (
            <Link
              key={artist.slug}
              href={`/artists/${artist.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{artist.name}</CardTitle>
                    {artist.era && (
                      <span className="font-mono text-xs text-muted-foreground">
                        {artist.era}
                      </span>
                    )}
                    {soon && <Badge variant="secondary">Soon</Badge>}
                  </div>
                  <CardDescription>{artist.micro}</CardDescription>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Read
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </HubSearch>
  );
}
