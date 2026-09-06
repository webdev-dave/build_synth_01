/**
 * In-page search + filters for the editorial catalog hubs.
 * Lives here (not on the artist/song modules) so haystacks can see both
 * sides without a circular import.
 */
import { ARTISTS, type Artist } from "./artists";
import {
  SONGS_CATALOG,
  songAttribution,
  songsByArtist,
  type CatalogSong,
} from "./songs";
import { getGenre } from "@/lib/genres/registry";
import { getArticle } from "@/lib/history/registry";
import { getConcept } from "@/lib/concepts/registry";
import { getPlace } from "@/lib/places/registry";
import {
  compareByLabel,
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";
import {
  compareByYear,
  parseYear,
  yearInRange,
  type CatalogSort,
} from "./years";

export interface ArtistFilters {
  genre?: string;
  hasSong?: boolean;
  yearFrom?: number;
  yearTo?: number;
  sort?: CatalogSort;
}

export interface SongFilters {
  genre?: string;
  hasPianoRoll?: boolean;
  yearFrom?: number;
  yearTo?: number;
  sort?: CatalogSort;
}

export function artistBirthYear(artist: Artist): number | undefined {
  return parseYear(artist.era);
}

export function songReleaseYear(song: CatalogSong): number | undefined {
  return parseYear(song.year);
}

function placeNames(ids: string[] | undefined): string[] {
  if (!ids) return [];
  return ids.flatMap((id) => {
    const place = getPlace(id);
    if (!place) return [id];
    return [id, place.name, ...(place.aliases?.map((a) => a.name) ?? [])];
  });
}

function artistHaystack(artist: Artist): string {
  return joinHaystack([
    artist.name,
    artist.slug,
    artist.era,
    artist.micro,
    artist.bio,
    ...(artist.keywords ?? []),
    ...relatedNames(artist.genres, getGenre),
    ...relatedNames(artist.history, getArticle),
    ...placeNames(artist.places),
    ...songsByArtist(artist.slug).map((song) => song.title),
  ]);
}

function songHaystack(song: CatalogSong): string {
  return joinHaystack([
    song.title,
    song.original?.english,
    song.original?.latin,
    song.original?.native,
    song.original?.lang,
    song.slug,
    song.artistLabel,
    song.year,
    song.micro,
    song.about,
    songAttribution(song),
    ...(song.keywords ?? []),
    ...relatedNames(song.artists, (slug) => {
      const artist = ARTISTS.find((a) => a.slug === slug);
      return artist ? { name: artist.name } : undefined;
    }),
    ...relatedNames(song.genres, getGenre),
    ...relatedNames(song.history, getArticle),
    ...relatedNames(song.concepts, (slug) => {
      const concept = getConcept(slug);
      return concept ? { name: concept.term } : undefined;
    }),
    ...(song.lyrics ?? []).flatMap((version) => [
      version.label,
      version.language,
      version.credit,
      ...version.lines.flatMap((line) => [line.text, line.latin, line.en]),
    ]),
    ...(song.recordings ?? []).map((recording) => recording.label),
  ]);
}

const ARTIST_HAY = new Map<string, string>();
const SONG_HAY = new Map<string, string>();

function artistHay(artist: Artist): string {
  let hay = ARTIST_HAY.get(artist.slug);
  if (hay === undefined) {
    hay = artistHaystack(artist);
    ARTIST_HAY.set(artist.slug, hay);
  }
  return hay;
}

function songHay(song: CatalogSong): string {
  let hay = SONG_HAY.get(song.slug);
  if (hay === undefined) {
    hay = songHaystack(song);
    SONG_HAY.set(song.slug, hay);
  }
  return hay;
}

export function searchArtists(
  query: string,
  filters: ArtistFilters = {},
): Artist[] {
  let items: readonly Artist[] = ARTISTS;
  if (filters.genre) {
    items = items.filter((artist) => artist.genres?.includes(filters.genre!));
  }
  if (filters.hasSong) {
    items = items.filter((artist) => songsByArtist(artist.slug).length > 0);
  }
  if (filters.yearFrom != null || filters.yearTo != null) {
    items = items.filter((artist) =>
      yearInRange(artistBirthYear(artist), filters.yearFrom, filters.yearTo),
    );
  }
  const matched = filterByHaystack(items, query, artistHay);
  const sort = filters.sort ?? "name";
  if (sort === "name") return sortByLabel(matched, (a) => a.name);
  const dir = sort === "year-asc" ? "asc" : "desc";
  return matched.slice().sort((a, b) =>
    compareByYear(
      artistBirthYear(a),
      artistBirthYear(b),
      dir,
      a.name,
      b.name,
      compareByLabel,
    ),
  );
}

export function searchSongs(
  query: string,
  filters: SongFilters = {},
): CatalogSong[] {
  let items: readonly CatalogSong[] = SONGS_CATALOG;
  if (filters.genre) {
    items = items.filter((song) => song.genres?.includes(filters.genre!));
  }
  if (filters.hasPianoRoll) {
    items = items.filter((song) => Boolean(song.pianoRollId));
  }
  if (filters.yearFrom != null || filters.yearTo != null) {
    items = items.filter((song) =>
      yearInRange(songReleaseYear(song), filters.yearFrom, filters.yearTo),
    );
  }
  const matched = filterByHaystack(items, query, songHay);
  const sort = filters.sort ?? "name";
  if (sort === "name") return sortByLabel(matched, (s) => s.title);
  const dir = sort === "year-asc" ? "asc" : "desc";
  return matched.slice().sort((a, b) =>
    compareByYear(
      songReleaseYear(a),
      songReleaseYear(b),
      dir,
      a.title,
      b.title,
      compareByLabel,
    ),
  );
}
