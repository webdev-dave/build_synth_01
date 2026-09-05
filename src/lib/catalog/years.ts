/**
 * Birth / release years for catalog hub sort and range filters.
 *
 * Artists store a freeform `era` ("1873–1958", "c. 1895–1989", "b. 1936").
 * The first four-digit year is the birth (or "born") year. Songs already
 * carry a `year` string for the referenced recording/publication.
 */

export type CatalogSort = "name" | "year-asc" | "year-desc";

/** First 4-digit year in an era or year string. */
export function parseYear(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const match = value.match(/(\d{4})/);
  if (!match) return undefined;
  const year = Number(match[1]);
  return Number.isFinite(year) ? year : undefined;
}

export function yearInRange(
  year: number | undefined,
  from?: number,
  to?: number,
): boolean {
  if (from == null && to == null) return true;
  if (year == null) return false;
  if (from != null && year < from) return false;
  if (to != null && year > to) return false;
  return true;
}

export function catalogYearBounds(
  years: Array<number | undefined>,
): { min: number; max: number } | undefined {
  const known = years.filter((year): year is number => year != null);
  if (known.length === 0) return undefined;
  return { min: Math.min(...known), max: Math.max(...known) };
}

export function compareByYear(
  a: number | undefined,
  b: number | undefined,
  dir: "asc" | "desc",
  nameA: string,
  nameB: string,
  compareName: (left: string, right: string) => number,
): number {
  const missingA = a == null;
  const missingB = b == null;
  if (missingA && missingB) return compareName(nameA, nameB);
  if (missingA) return 1;
  if (missingB) return -1;
  const delta = dir === "asc" ? a! - b! : b! - a!;
  return delta || compareName(nameA, nameB);
}

export function parseYearInput(value: string): number | undefined {
  const trimmed = value.trim();
  if (trimmed === "") return undefined;
  const year = Number(trimmed);
  return Number.isInteger(year) ? year : undefined;
}
