/**
 * Last destinations opened from the global search palette.
 *
 * Kept out of `@/lib/search` (the index) so the nav bundle doesn't pull
 * in the MIDI manifest. localStorage so the empty-state list can open
 * on what the user actually uses, not a cold tools list.
 */

export const RECENT_SEARCH_LIMIT = 10;

const STORAGE_KEY = "instrumaps.search.recents";

export interface RecentSearchItem {
  href: string;
  title: string;
  subtitle?: string;
  /** Original search group — string so this module never imports the index. */
  group: SearchEntryGroup;
  iconId: string;
  soon?: boolean;
}

/** Mirrors `SearchGroup` without importing the index (MIDI manifest). */
type SearchEntryGroup =
  | "pages"
  | "midi"
  | "songs"
  | "artists"
  | "genres"
  | "scales"
  | "progressions"
  | "history"
  | "cousins"
  | "concepts"
  | "languages"
  | "lessons";

function isRecentItem(value: unknown): value is RecentSearchItem {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.href === "string" &&
    v.href.startsWith("/") &&
    typeof v.title === "string" &&
    v.title.length > 0 &&
    typeof v.iconId === "string" &&
    typeof v.group === "string"
  );
}

export function loadRecentSearches(): RecentSearchItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isRecentItem).slice(0, RECENT_SEARCH_LIMIT);
  } catch {
    return [];
  }
}

export function rememberSearch(item: RecentSearchItem): RecentSearchItem[] {
  const next = [
    {
      href: item.href,
      title: item.title,
      subtitle: item.subtitle,
      group: item.group,
      iconId: item.iconId,
      soon: item.soon,
    },
    ...loadRecentSearches().filter((r) => r.href !== item.href),
  ].slice(0, RECENT_SEARCH_LIMIT);

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // quota / private mode — the in-memory list still updates this session
  }

  return next;
}
