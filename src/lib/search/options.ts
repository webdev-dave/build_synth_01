import { getGenre } from "@/lib/genres/registry";

export interface GenreOption {
  slug: string;
  name: string;
}

/** Unique genre chips from the slugs a catalog actually uses. */
export function genreOptionsFrom(slugs: Iterable<string>): GenreOption[] {
  const seen = new Set<string>();
  const out: GenreOption[] = [];
  for (const slug of slugs) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    const genre = getGenre(slug);
    if (genre) out.push({ slug, name: genre.name });
  }
  out.sort((a, b) => a.name.localeCompare(b.name));
  return out;
}
