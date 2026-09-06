"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { usePathname, useRouter } from "next/navigation";
import { GraduationCap, Info, Mail, Search } from "lucide-react";

import type { SearchEntry, SearchGroup, SearchResultGroup } from "@/lib/search";
import {
  loadRecentSearches,
  rememberSearch,
  type RecentSearchItem,
} from "@/lib/search/recents";
import { getAppIcon } from "@/lib/appIcons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Global site search — a Ctrl/⌘K palette over everything the app can open:
 * the Piano Roll MIDI library, song articles, artists, genres, scales,
 * history, concepts, lessons, and the tools/pages themselves.
 *
 * The index (which pulls in the ~800-row MIDI manifest) is `import()`ed the
 * first time the palette opens, so the nav bar itself stays light. An empty
 * query pins the last 10 opened destinations above the tools/pages list.
 */

type SearchFn = (query: string) => SearchResultGroup[];

type PaletteGroup = Omit<SearchResultGroup, "group"> & {
  group: SearchGroup | "recent";
};

function toEntry(item: RecentSearchItem): SearchEntry {
  return {
    ...item,
    haystack: "",
    titleNorm: "",
    titleWords: [],
    titleAliases: [],
    aliasWords: [],
  };
}

// Icons for entries whose iconId isn't a nav id (getAppIcon would fall back
// to a generic note glyph, which reads wrong for these).
const ICON_OVERRIDES: Record<
  string,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  about: Info,
  contact: Mail,
  lessons: GraduationCap,
};

function entryIcon(iconId: string) {
  return ICON_OVERRIDES[iconId] ?? getAppIcon(iconId);
}

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchFn, setSearchFn] = useState<SearchFn | null>(null);
  const [recents, setRecents] = useState<RecentSearchItem[]>([]);
  const [isMac, setIsMac] = useState(false);
  const [mounted, setMounted] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMac(/mac|iphone|ipad/i.test(navigator.userAgent));
    setRecents(loadRecentSearches());
    setMounted(true);
  }, []);

  // Ctrl/⌘K opens (or closes) from anywhere.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Lazy-load the index on first open, then focus the input.
  useEffect(() => {
    if (!open) return;
    if (!searchFn) {
      let cancelled = false;
      import("@/lib/search").then((mod) => {
        if (!cancelled) setSearchFn(() => mod.searchAll);
      });
      return () => {
        cancelled = true;
      };
    }
  }, [open, searchFn]);

  useEffect(() => {
    if (open) {
      // Wait a frame so the overlay is mounted before focusing.
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Safety net: if navigation happens any other way, close the palette.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const groups = useMemo<PaletteGroup[]>(() => {
    const results = searchFn ? searchFn(query) : [];
    if (query.trim() || recents.length === 0) return results;
    return [
      { group: "recent", label: "Recent", items: recents.map(toEntry) },
      ...results,
    ];
  }, [searchFn, query, recents]);
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  // New results — reset the highlight to the top hit.
  useEffect(() => {
    setActiveIndex(0);
  }, [query, searchFn]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(
      `#gs-item-${activeIndex}`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  // Attached after open so the opening tap isn't treated as "outside".
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null;
      if (target && panelRef.current?.contains(target)) return;
      close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open, close]);

  const navigateTo = useCallback(
    (item: SearchEntry) => {
      setRecents(
        rememberSearch({
          href: item.href,
          title: item.title,
          subtitle: item.subtitle,
          group: item.group,
          iconId: item.iconId,
          soon: item.soon,
        }),
      );
      close();
      router.push(item.href);
    },
    [close, router],
  );

  const onInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) =>
        flat.length ? (i - 1 + flat.length) % flat.length : 0,
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIndex];
      if (item) navigateTo(item);
    } else if (e.key === "Escape") {
      e.preventDefault();
      close();
    }
  };

  const shortcutHint = isMac ? "⌘K" : "Ctrl K";

  const overlay = (
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Site search"
        aria-hidden={!open}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onPointerDown={close}
          onClick={close}
        />

        <div
          ref={panelRef}
          className="absolute left-1/2 top-[10vh] w-full max-w-xl -translate-x-1/2 px-3 sm:px-0"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
            {/* Input row */}
            <div className="flex items-center gap-2 border-b border-border px-3">
              <Search
                className="h-4 w-4 shrink-0 text-muted-foreground"
                strokeWidth={1.75}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder="Search songs, artists, scales, tools…"
                className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                role="combobox"
                aria-expanded={flat.length > 0}
                aria-controls="gs-results"
                aria-activedescendant={
                  flat.length ? `gs-item-${activeIndex}` : undefined
                }
                aria-label="Search the site"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden shrink-0 rounded border border-border bg-muted px-1 font-mono text-[10px] leading-4 text-muted-foreground sm:block">
                esc
              </kbd>
            </div>

            {/* Results */}
            <div
              ref={listRef}
              id="gs-results"
              role="listbox"
              aria-label="Search results"
              className="max-h-[55vh] overflow-y-auto overscroll-contain p-1.5"
            >
              {!searchFn && flat.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  Loading the library…
                </p>
              ) : flat.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No matches for{" "}
                  <span className="font-mono text-foreground">
                    “{query.trim()}”
                  </span>
                </p>
              ) : (
                groups.map((group) => {
                  // Index of this group's first item in the flat list, for
                  // stable option ids across group boundaries.
                  const offset = flat.indexOf(group.items[0]);
                  return (
                    <div key={group.group} className="mb-1 last:mb-0">
                      <div className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </div>
                      {group.items.map((item, i) => {
                        const flatIndex = offset + i;
                        const Icon = entryIcon(item.iconId);
                        const active = flatIndex === activeIndex;
                        return (
                          <div
                            key={`${group.group}-${item.href}-${item.title}`}
                            id={`gs-item-${flatIndex}`}
                            role="option"
                            aria-selected={active}
                            tabIndex={-1}
                            onMouseEnter={() => setActiveIndex(flatIndex)}
                            onClick={() => navigateTo(item)}
                            className={cn(
                              "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2",
                              active
                                ? "bg-accent text-accent-foreground"
                                : "text-muted-foreground",
                            )}
                          >
                            <Icon
                              className="h-4 w-4 shrink-0"
                              strokeWidth={1.75}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="truncate text-sm font-medium text-foreground">
                                  {item.title}
                                </span>
                                {item.soon && (
                                  <span className="shrink-0 rounded border border-border px-1 text-[10px] leading-4 text-muted-foreground">
                                    Soon
                                  </span>
                                )}
                              </div>
                              {item.subtitle && (
                                <div className="truncate text-xs text-muted-foreground">
                                  {item.subtitle}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="flex items-center gap-3 border-t border-border px-3 py-1.5 text-[11px] text-muted-foreground">
              <span>
                <kbd className="font-mono">↑↓</kbd> navigate
              </span>
              <span>
                <kbd className="font-mono">↵</kbd> open
              </span>
              <span>
                <kbd className="font-mono">esc</kbd> close
              </span>
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <>
      {/* Tablet/desktop: open field on the right, ahead of the menu. */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden h-9 w-[min(18rem,100%)] items-center gap-2 rounded-md border border-border bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:inline-flex"
        aria-label="Search the site"
      >
        <Search className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
        <span className="min-w-0 flex-1 truncate text-left">
          Search songs, artists, scales…
        </span>
        <kbd className="shrink-0 rounded border border-border bg-muted px-1 font-mono text-[10px] leading-4 text-muted-foreground">
          {shortcutHint}
        </kbd>
      </button>

      {/* Mobile: icon only */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="h-9 w-9 text-muted-foreground sm:hidden"
        aria-label="Search the site"
      >
        <Search className="h-5 w-5" strokeWidth={1.75} />
      </Button>

      {/* Portaled so header `backdrop-filter` can't trap `fixed` to the
          nav bar — otherwise the dimmer is only 48px tall and clicks
          on the page never close the palette. */}
      {mounted ? createPortal(overlay, document.body) : overlay}
    </>
  );
}
