import { getGenre, type Genre } from "@/lib/genres/registry";
import { sortByLabel } from "@/lib/search/normalize";

export interface GenreOption {
  slug: string;
  name: string;
}

/** Registry genres for a list of slugs (or MIDI labels), name-sorted. */
export function resolveGenres(
  slugs?: readonly string[] | null,
): Genre[] {
  if (!slugs || slugs.length === 0) return [];
  const seen = new Set<string>();
  const out: Genre[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const genre = getGenre(slug);
    if (genre) out.push(genre);
  }
  return sortByLabel(out, (genre) => genre.name);
}

/** Unique genre chips from the slugs a catalog actually uses. */
export function genreOptionsFrom(slugs: Iterable<string>): GenreOption[] {
  return resolveGenres([...slugs]).map((genre) => ({
    slug: genre.slug,
    name: genre.name,
  }));
}
