/**
 * Shared string folding for in-page hub filters (and global search).
 * Lowercase + strip diacritics so "doină" matches "doina".
 */

export function normalizeSearch(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function searchTokens(query: string): string[] {
  return normalizeSearch(query).split(/\s+/).filter(Boolean);
}

/** Folded sort key: ignore a leading English article so "The blues" files under B. */
export function sortKey(label: string): string {
  return normalizeSearch(label).replace(/^(the|a|an)\s+/, "");
}

export function compareByLabel(a: string, b: string): number {
  return sortKey(a).localeCompare(sortKey(b)) ||
    normalizeSearch(a).localeCompare(normalizeSearch(b));
}

export function sortByLabel<T>(
  items: readonly T[],
  labelOf: (item: T) => string,
): T[] {
  return items
    .slice()
    .sort((a, b) => compareByLabel(labelOf(a), labelOf(b)));
}

/** Join parts into one folded haystack string. */
export function joinHaystack(parts: Array<string | undefined | null>): string {
  return normalizeSearch(parts.filter(Boolean).join(" "));
}

/**
 * Keep items whose haystack contains every query token. Empty query
 * returns a shallow copy of `items`.
 */
export function filterByHaystack<T>(
  items: readonly T[],
  query: string,
  haystackOf: (item: T) => string,
): T[] {
  const tokens = searchTokens(query);
  if (tokens.length === 0) return items.slice();
  return items.filter((item) => {
    const hay = haystackOf(item);
    return tokens.every((t) => hay.includes(t));
  });
}

/** Slug plus resolved display name, so "blues" and "The blues" both hit. */
export function relatedNames(
  slugs: string[] | undefined,
  resolve: (slug: string) => { name: string } | undefined,
): string[] {
  if (!slugs) return [];
  return slugs.flatMap((slug) => {
    const hit = resolve(slug);
    return hit ? [slug, hit.name] : [slug];
  });
}
