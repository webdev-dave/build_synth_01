/**
 * The drum machine's URL contract: `/drums?pattern=<groove-slug>`. Lessons
 * build the link with `drumsHrefFor`; the page reads it after mount with
 * `readPatternParam` (static export — no server search params).
 */

export const DRUMS_PATH = "/drums";
export const PATTERN_PARAM = "pattern";

export function drumsHrefFor(slug: string): string {
  return `${DRUMS_PATH}?${PATTERN_PARAM}=${encodeURIComponent(slug)}`;
}

export function readPatternParam(search: string): string | null {
  const value = new URLSearchParams(search).get(PATTERN_PARAM);
  return value && /^[a-z0-9-]+$/.test(value) ? value : null;
}
