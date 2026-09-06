"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ARTISTS } from "@/lib/catalog/artists";
import { songsByArtist } from "@/lib/catalog/songs";
import { artistBirthYear, searchArtists } from "@/lib/catalog/search";
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
import { GenrePills } from "@/components/content/GenrePills";
import {
  HubSearch,
  YearRangeFields,
  catalogSortGroup,
  genreChipGroup,
} from "@/components/content/HubSearch";

export function ArtistsExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [hasSong, setHasSong] = useState(false);
  const [sort, setSort] = useState<CatalogSort>("name");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");

  const genreOptions = useMemo(
    () =>
      genreOptionsFrom(ARTISTS.flatMap((artist) => artist.genres ?? [])),
    [],
  );
  const showHasSong =
    ARTISTS.some((artist) => songsByArtist(artist.slug).length > 0) &&
    ARTISTS.some((artist) => songsByArtist(artist.slug).length === 0);
  const bounds = useMemo(
    () => catalogYearBounds(ARTISTS.map(artistBirthYear)),
    [],
  );

  const fromYear = parseYearInput(yearFrom);
  const toYear = parseYearInput(yearTo);

  const matches = useMemo(
    () =>
      searchArtists(query, {
        genre,
        hasSong: hasSong || undefined,
        yearFrom: fromYear,
        yearTo: toYear,
        sort,
      }),
    [query, genre, hasSong, fromYear, toYear, sort],
  );
  const filtering =
    query.trim().length > 0 ||
    Boolean(genre) ||
    hasSong ||
    fromYear != null ||
    toYear != null;

  const clear = () => {
    setQuery("");
    setGenre(undefined);
    setHasSong(false);
    setSort("name");
    setYearFrom("");
    setYearTo("");
  };

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
      groups={[
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
        catalogSortGroup(sort, setSort, {
          oldest: "Oldest born",
          newest: "Newest born",
        }),
      ]}
      extras={
        <YearRangeFields
          label="Born"
          fromLabel="Born from year"
          toLabel="Born to year"
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
            ? `No artist matches “${query.trim()}”. Try a name, a song, or a genre.`
            : "No artist matches those filters."
          : undefined
      }
      onClearFilters={filtering || sort !== "name" ? clear : undefined}
    >
      <div
        id="artists-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((artist) => {
          const soon = artist.status === "soon";
          return (
            <Card
              key={artist.slug}
              className="group relative h-full transition-colors hover:border-foreground/25 hover:bg-accent/40 has-[a.card-hit:focus-visible]:ring-2 has-[a.card-hit:focus-visible]:ring-ring has-[a.card-hit:focus-visible]:ring-offset-2 has-[a.card-hit:focus-visible]:ring-offset-background"
            >
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">
                    <Link
                      href={`/artists/${artist.slug}`}
                      className="card-hit after:absolute after:inset-0 focus-visible:outline-none"
                    >
                      {artist.name}
                    </Link>
                  </CardTitle>
                  {artist.era && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {artist.era}
                    </span>
                  )}
                  {soon && (
                    <Badge variant="secondary" className="relative z-10">
                      Soon
                    </Badge>
                  )}
                </div>
                <CardDescription>{artist.micro}</CardDescription>
                <GenrePills slugs={artist.genres} className="relative z-10" />
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  Read
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </HubSearch>
  );
}
