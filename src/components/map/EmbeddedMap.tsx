"use client";

/**
 * EmbeddedMap — a small, region-filtered instance of the Music History Map for
 * the bottom of a content page (a genre, artist, history article, …).
 *
 * It shows only the places relevant to that page, opens framed on them
 * (`fitToFocus`), and is a *light teaser*: pan/zoom and tap-to-name, with the
 * real reading pane living on `/map`. It deliberately omits the search box,
 * genre dropdown, and `MapPanel` — the header's "Open in full map" link and a
 * per-place "Read on the full map" link are the doorways in.
 *
 * Two efficiencies matter because these can land on every content page:
 * - geometry is loaded through the shared `geoData` cache (one download per
 *   session, not per embed);
 * - the map only mounts once it nears the viewport (IntersectionObserver), so
 *   a page with an embed far below the fold pays nothing up front.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPlace, type Place } from "@/lib/places/registry";
import { MusicMap, type MapSelection } from "./MusicMap";
import { PlaceChips } from "./PlaceChips";

interface EmbeddedMapProps {
  /** Place ids to frame and tint (already resolved by the page). */
  placeIds: string[];
  /** Section heading, e.g. "Where the blues lives". */
  heading?: string;
  /** The full-map deep link this region opens into (e.g. /map?genre=blues). */
  fullMapHref: string;
}

export function EmbeddedMap({
  placeIds,
  heading = "On the map",
  fullMapHref,
}: EmbeddedMapProps) {
  const [selection, setSelection] = useState<MapSelection | null>(null);
  const [mounted, setMounted] = useState(false);
  const holderRef = useRef<HTMLDivElement>(null);

  // Stable array identity so MusicMap's lens/fit memo doesn't re-run each
  // render (the page hands us a fresh array literal on the server).
  const key = placeIds.join(",");
  const filter = useMemo(() => placeIds, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const places = useMemo(
    () =>
      placeIds
        .map((id) => getPlace(id))
        .filter((p): p is Place => p !== undefined),
    [key], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // Defer mounting the SVG map until it nears the viewport.
  useEffect(() => {
    const el = holderRef.current;
    if (!el || mounted) return;
    if (typeof IntersectionObserver === "undefined") {
      setMounted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMounted(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [mounted]);

  if (placeIds.length === 0) return null;

  const selectedId = selection?.kind === "place" ? selection.id : null;
  const selectedPlace = selectedId ? getPlace(selectedId) : undefined;

  return (
    <section className="mt-10" aria-labelledby="embedded-map-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="embedded-map-heading"
          className="text-sm font-medium text-muted-foreground"
        >
          {heading}
        </h2>
        <Link
          href={fullMapHref}
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Open in full map
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div
        ref={holderRef}
        className="mt-3 overflow-hidden rounded-lg border bg-card/30 p-2"
      >
        {mounted ? (
          <MusicMap
            selectedId={selectedId}
            placeFilter={filter}
            fitToFocus
            compact
            onSelect={setSelection}
          />
        ) : (
          // Reserve the map's aspect ratio so nothing jumps when it mounts.
          <div className="aspect-[960/520] w-full animate-pulse rounded bg-muted/30" />
        )}
      </div>

      {/* Region roster — always shown, so one pick never hides the rest. */}
      <div className="mt-3">
        <PlaceChips
          places={places}
          selectedId={selectedId}
          onToggle={(id) =>
            setSelection(id ? { kind: "place", id } : null)
          }
        />
      </div>

      {/* Read-through for the selected place — sits below the roster so the
          roster stays put. */}
      {selectedPlace && (
        <p className="mt-2 text-sm text-muted-foreground">
          <Link
            href={`/map?place=${selectedPlace.id}`}
            className="text-foreground underline-offset-2 hover:underline"
          >
            Read {selectedPlace.name} on the full map →
          </Link>
        </p>
      )}
    </section>
  );
}
