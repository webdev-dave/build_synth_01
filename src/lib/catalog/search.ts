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
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";

export interface ArtistFilters {
  genre?: string;
  hasSong?: boolean;
}

export interface SongFilters {
  genre?: string;
  hasPianoRoll?: boolean;
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
  return sortByLabel(filterByHaystack(items, query, artistHay), (a) => a.name);
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
  return sortByLabel(filterByHaystack(items, query, songHay), (s) => s.title);
}
