"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { SONGS_CATALOG, songAttribution } from "@/lib/catalog/songs";
import { searchSongs, songReleaseYear } from "@/lib/catalog/search";
import {
  catalogYearBounds,
  parseYearInput,
  type CatalogSort,
} from "@/lib/catalog/years";
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
  YearRangeFields,
  catalogSortGroup,
  genreChipGroup,
} from "@/components/content/HubSearch";

export function SongsExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [hasPianoRoll, setHasPianoRoll] = useState(false);
  const [sort, setSort] = useState<CatalogSort>("name");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const genreOptions = useMemo(
    () => genreOptionsFrom(SONGS_CATALOG.flatMap((song) => song.genres ?? [])),
    [],
  );
  const showPianoRoll =
    SONGS_CATALOG.some((song) => song.pianoRollId) &&
    SONGS_CATALOG.some((song) => !song.pianoRollId);
  const bounds = useMemo(
    () => catalogYearBounds(SONGS_CATALOG.map(songReleaseYear)),
    [],
  );

  const fromYear = parseYearInput(yearFrom);
  const toYear = parseYearInput(yearTo);

  const matches = useMemo(
    () =>
      searchSongs(query, {
        genre,
        hasPianoRoll: hasPianoRoll || undefined,
        yearFrom: fromYear,
        yearTo: toYear,
        sort,
      }),
    [query, genre, hasPianoRoll, fromYear, toYear, sort],
  );
  const filtering =
    query.trim().length > 0 ||
    Boolean(genre) ||
    hasPianoRoll ||
    fromYear != null ||
    toYear != null;

  const clear = () => {
    setQuery("");
    setGenre(undefined);
    setHasPianoRoll(false);
    setSort("name");
    setYearFrom("");
    setYearTo("");
  };

  return (
    <HubSearch
      headingId="songs-heading"
      heading={
        filtering
          ? `${matches.length} of ${SONGS_CATALOG.length}`
          : `${SONGS_CATALOG.length} ${
              SONGS_CATALOG.length === 1 ? "recording" : "recordings"
            }`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a song, artist, or year…"
      searchLabel="Search songs"
      controlsId="songs-grid"
      groups={[
        genreChipGroup(genreOptions, genre, setGenre),
        {
          label: "Also",
          chips: showPianoRoll
            ? [
                {
                  id: "piano-roll",
                  label: "In the Piano Roll",
                  pressed: hasPianoRoll,
                  onToggle: () => setHasPianoRoll((on) => !on),
                },
              ]
            : [],
        },
        catalogSortGroup(sort, setSort, {
          oldest: "Oldest first",
          newest: "Newest first",
        }),
      ]}
      extras={
        <YearRangeFields
          label="Released"
          fromLabel="Released from year"
          toLabel="Released to year"
          from={yearFrom}
          to={yearTo}
          onFromChange={setYearFrom}
          onToChange={setYearTo}
          min={bounds?.min}
          max={bounds?.max}
        />
      }
      empty={
        matches.length === 0
          ? query.trim()
            ? `No song matches “${query.trim()}”. Try a title, an artist, or a year.`
            : "No song matches those filters."
          : undefined
      }
      onClearFilters={filtering || sort !== "name" ? clear : undefined}
    >
      <div
        id="songs-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((song) => {
          const soon = song.status === "soon";
          return (
            <Link
              key={song.slug}
              href={`/songs/${song.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{song.title}</CardTitle>
                    {soon && <Badge variant="secondary">Soon</Badge>}
                  </div>
                  <p className="font-mono text-xs text-muted-foreground">
                    {songAttribution(song)}
                  </p>
                  {song.micro && (
                    <CardDescription>{song.micro}</CardDescription>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Listen
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
