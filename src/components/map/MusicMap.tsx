"use client";

/**
 * MusicMap — the SVG world map behind /map.
 *
 * Custom d3-geo rendering, not a tile map: the same calm SVG language as the
 * home page's HeroMap, drawn with theme tokens so the music can be the color.
 * Geometry (Natural Earth TopoJSON + hand-drawn historical overlays) is
 * fetched from /geo/*; what's selectable and what it means comes from
 * src/lib/places/registry.ts.
 *
 * Visual honesty: places with content get a quiet warm tint and a dot;
 * everything else stays neutral. Clicking anywhere still answers — unmapped
 * features report their name so the panel can say "not mapped yet."
 */
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { useReducedMotion } from "motion/react";

import {
  PLACES,
  placeByCountryId,
  placeByStateId,
  placeInGenre,
  type Place,
} from "@/lib/places/registry";
import { cn } from "@/lib/utils";

/** What a map click/zoom resolves to. */
export type MapSelection =
  | { kind: "place"; id: string }
  | { kind: "unknown"; label: string };

interface MusicMapProps {
  /** Registry place to highlight + zoom to (from search or panel links). */
  selectedId: string | null;
  /** Active genre filter: only matching places keep the orange tint and markers. */
  genreFilter: string | null;
  onSelect: (selection: MapSelection | null) => void;
}

const W = 960;
const H = 520;
const MAX_K = 24;

interface ViewTransform {
  k: number;
  tx: number;
  ty: number;
}

const WORLD_VIEW: ViewTransform = { k: 1, tx: 0, ty: 0 };

/** Keep the content covering the viewport: no drifting into empty space. */
function clampView(v: ViewTransform): ViewTransform {
  const k = Math.min(MAX_K, Math.max(1, v.k));
  return {
    k,
    tx: Math.min(0, Math.max(W * (1 - k), v.tx)),
    ty: Math.min(0, Math.max(H * (1 - k), v.ty)),
  };
}

type NamedFeature = Feature<Geometry, { name?: string }>;

export function MusicMap({
  selectedId,
  genreFilter,
  onSelect,
}: MusicMapProps) {
  const reducedMotion = useReducedMotion();
  const [countries, setCountries] = useState<NamedFeature[]>([]);
  const [states, setStates] = useState<NamedFeature[]>([]);
  const [overlays, setOverlays] = useState<Map<string, NamedFeature>>(
    new Map(),
  );
  const [view, setView] = useState<ViewTransform>(WORLD_VIEW);
  const [isDragging, setIsDragging] = useState(false);
  // The last feature we zoomed into from a click, so a second click resets.
  const zoomedRef = useRef<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  // Live mirror of view so pointer handlers read the current transform
  // without being re-created on every frame of a drag.
  const viewRef = useRef(view);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
  });

  useEffect(() => {
    viewRef.current = view;
  }, [view]);

  const projection = useMemo(
    () =>
      geoNaturalEarth1().fitExtent(
        [
          [8, 8],
          [W - 8, H - 8],
        ],
        { type: "Sphere" },
      ),
    [],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  // ── Load geometry once ───────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [worldRes, usRes] = await Promise.all([
        fetch("/geo/world-110m.json"),
        fetch("/geo/us-states-10m.json"),
      ]);
      const world = (await worldRes.json()) as Topology<{
        countries: GeometryCollection<{ name?: string }>;
      }>;
      const us = (await usRes.json()) as Topology<{
        states: GeometryCollection<{ name?: string }>;
      }>;
      const overlayPlaces = PLACES.filter((p) => p.geo.overlay);
      const overlayEntries = await Promise.all(
        overlayPlaces.map(async (p) => {
          const res = await fetch(`/geo/overlays/${p.geo.overlay}`);
          return [p.id, (await res.json()) as NamedFeature] as const;
        }),
      );
      if (cancelled) return;
      setCountries(
        (feature(world, world.objects.countries) as FeatureCollection<
          Geometry,
          { name?: string }
        >).features,
      );
      setStates(
        (feature(us, us.objects.states) as FeatureCollection<
          Geometry,
          { name?: string }
        >).features,
      );
      setOverlays(new Map(overlayEntries));
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ── Zoom helpers ─────────────────────────────────────────────────────────
  const zoomToBounds = useCallback(
    (bounds: [[number, number], [number, number]], maxK = MAX_K) => {
      const [[x0, y0], [x1, y1]] = bounds;
      const k = Math.min(
        maxK,
        Math.max(1, 0.85 / Math.max((x1 - x0) / W, (y1 - y0) / H)),
      );
      const cx = (x0 + x1) / 2;
      const cy = (y0 + y1) / 2;
      setView(clampView({ k, tx: W / 2 - k * cx, ty: H / 2 - k * cy }));
    },
    [],
  );

  const zoomToPoint = useCallback(
    (lngLat: [number, number], k = 7) => {
      const p = projection(lngLat);
      if (!p) return;
      setView(clampView({ k, tx: W / 2 - k * p[0], ty: H / 2 - k * p[1] }));
    },
    [projection],
  );

  const resetView = useCallback(() => {
    zoomedRef.current = null;
    setView(WORLD_VIEW);
  }, []);

  // Step zoom from the +/- buttons, anchored on the viewport center so the
  // middle of what you're looking at stays put.
  const zoomBy = useCallback((factor: number) => {
    zoomedRef.current = null;
    setView((v) => {
      const k = Math.min(MAX_K, Math.max(1, v.k * factor));
      const cx = (W / 2 - v.tx) / v.k;
      const cy = (H / 2 - v.ty) / v.k;
      return clampView({ k, tx: W / 2 - k * cx, ty: H / 2 - k * cy });
    });
  }, []);

  // ── Drag-to-pan (mouse + touch via Pointer Events) ─────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 && e.pointerType === "mouse") return;
    const v = viewRef.current;
    dragRef.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startTx: v.tx,
      startTy: v.ty,
    };
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const dxClient = e.clientX - d.startX;
    const dyClient = e.clientY - d.startY;
    // Only treat it as a drag past a small threshold, so taps still register
    // as clicks on the feature underneath.
    if (!d.moved && Math.abs(dxClient) + Math.abs(dyClient) > 4) {
      d.moved = true;
      setIsDragging(true);
      svg.setPointerCapture?.(e.pointerId);
    }
    if (!d.moved) return;
    const dx = dxClient * (W / rect.width);
    const dy = dyClient * (H / rect.height);
    setView(() =>
      clampView({
        k: viewRef.current.k,
        tx: d.startTx + dx,
        ty: d.startTy + dy,
      }),
    );
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<SVGSVGElement>) => {
    const d = dragRef.current;
    if (!d.active) return;
    d.active = false;
    if (d.moved) {
      setIsDragging(false);
      try {
        svgRef.current?.releasePointerCapture?.(e.pointerId);
      } catch {
        /* pointer already released */
      }
    }
    // d.moved lingers until the next pointerdown so the click that fires right
    // after a drag is swallowed by the feature handlers' guard.
  }, []);

  /** Geometry a registry place occupies, for zooming from search/panel. */
  const zoomToPlace = useCallback(
    (place: Place) => {
      if (place.geo.point) {
        zoomToPoint(place.geo.point);
        return;
      }
      let geom: NamedFeature | undefined;
      if (place.geo.overlay) geom = overlays.get(place.id);
      else if (place.geo.countryId)
        geom = countries.find((c) => String(c.id) === place.geo.countryId);
      else if (place.geo.stateId)
        geom = states.find((s) => String(s.id) === place.geo.stateId);
      if (geom) zoomToBounds(path.bounds(geom), place.geo.stateId ? 12 : 8);
    },
    [countries, states, overlays, path, zoomToBounds, zoomToPoint],
  );

  // External selection (search, panel cross-links) drives the camera.
  useEffect(() => {
    if (!selectedId) return;
    const place = PLACES.find((p) => p.id === selectedId);
    if (place) {
      zoomedRef.current = `place:${place.id}`;
      zoomToPlace(place);
    }
  }, [selectedId, zoomToPlace]);

  // Choosing (or clearing) a genre returns to the world view, so every
  // matching marker is visible at once. Deliberately depends only on
  // genreFilter: map clicks must not trigger this and yank the camera.
  useEffect(() => {
    setView(WORLD_VIEW);
    zoomedRef.current = genreFilter ? `genre:${genreFilter}` : null;
  }, [genreFilter]);

  // ── Click handling ───────────────────────────────────────────────────────
  const handleFeatureClick = useCallback(
    (
      featureKey: string,
      geom: NamedFeature,
      place: Place | undefined,
      fallbackName: string,
    ) => {
      if (dragRef.current.moved) return; // this "click" was the end of a pan
      if (zoomedRef.current === featureKey) {
        resetView();
        onSelect(null);
        return;
      }
      zoomedRef.current = featureKey;
      zoomToBounds(path.bounds(geom), featureKey.startsWith("state:") ? 12 : 8);
      onSelect(
        place
          ? { kind: "place", id: place.id }
          : { kind: "unknown", label: fallbackName },
      );
    },
    [onSelect, path, resetView, zoomToBounds],
  );

  const keyboardActivate =
    (fn: () => void) => (e: React.KeyboardEvent<SVGElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    };

  // ── Style helpers ────────────────────────────────────────────────────────
  const zoomedIn = view.k > 2.2;
  const transform = `translate(${view.tx}, ${view.ty}) scale(${view.k})`;

  const cityPlaces = PLACES.filter((p) => p.geo.point);
  const overlayPlaces = PLACES.filter((p) => p.geo.overlay);

  /**
   * Which places wear the orange tint / markers. With a genre lens on, that's
   * every place in the genre — plus whatever the user has clicked, even if it
   * sits outside the lens, so picking a place never blanks the filtered view.
   * With no lens, every mapped place shows (the plain globe).
   */
  const isFocused = (place: Place | undefined) => {
    if (!place) return false;
    if (genreFilter) return placeInGenre(place, genreFilter) || place.id === selectedId;
    return true;
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className={cn(
          "h-auto w-full touch-none select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab",
        )}
        role="group"
        aria-label="World map of music history. Countries and regions with stories are tinted; select one to read it. Drag to pan; use the zoom buttons to zoom."
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
      >
        <g
          transform={transform}
          style={{
            transition:
              reducedMotion || isDragging
                ? undefined
                : "transform 900ms cubic-bezier(0.33, 1, 0.68, 1)",
          }}
        >
          {/* Globe outline */}
          <path
            d={path({ type: "Sphere" }) ?? undefined}
            className="fill-transparent stroke-border"
            vectorEffect="non-scaling-stroke"
          />

          {/* Countries */}
          {countries.map((c, i) => {
            // world-atlas 110m leaves N. Cyprus, Somaliland, and Kosovo
            // without an ISO numeric id — name (then index) keeps the key unique.
            const id = c.id != null ? String(c.id) : undefined;
            const place = id ? placeByCountryId(id) : undefined;
            const name = c.properties?.name ?? "this region";
            const featureKey = id ?? c.properties?.name ?? `country-${i}`;
            const isSelected = place && place.id === selectedId;
            const focused = isFocused(place);
            return (
              <path
                key={`country-${featureKey}`}
                d={path(c) ?? undefined}
                vectorEffect="non-scaling-stroke"
                tabIndex={0}
                role="button"
                aria-label={
                  place ? `${place.name} — has a story` : `${name} — not mapped yet`
                }
                onClick={() =>
                  handleFeatureClick(`country:${featureKey}`, c, place, name)
                }
                onKeyDown={keyboardActivate(() =>
                  handleFeatureClick(`country:${featureKey}`, c, place, name),
                )}
                className={cn(
                  "stroke-border/70 outline-none transition-all duration-500",
                  place && focused
                    ? isSelected
                      ? "cursor-pointer fill-orange-800/50"
                      : "cursor-pointer fill-orange-950/60 hover:fill-orange-900/50 focus-visible:fill-orange-900/50"
                    : "cursor-pointer fill-muted/40 hover:fill-muted/70 focus-visible:fill-muted/70",
                )}
              >
                <title>{place ? place.name : name}</title>
              </path>
            );
          })}

          {/* US states — visible detail once the camera is near */}
          {states.map((s) => {
            const id = String(s.id);
            const place = placeByStateId(id);
            const name = s.properties?.name ?? "this state";
            const isSelected = place && place.id === selectedId;
            const focused = isFocused(place);
            return (
              <path
                key={`state-${id}`}
                d={path(s) ?? undefined}
                vectorEffect="non-scaling-stroke"
                tabIndex={zoomedIn ? 0 : -1}
                role="button"
                aria-label={
                  place ? `${place.name} — has a story` : `${name} — not mapped yet`
                }
                onClick={() => handleFeatureClick(`state:${id}`, s, place, name)}
                onKeyDown={keyboardActivate(() =>
                  handleFeatureClick(`state:${id}`, s, place, name),
                )}
                className={cn(
                  "outline-none transition-all duration-500",
                  zoomedIn ? "stroke-border/60" : "stroke-transparent",
                  place && focused
                    ? isSelected
                      ? "cursor-pointer fill-orange-800/50"
                      : "cursor-pointer fill-orange-950/50 hover:fill-orange-900/40 focus-visible:fill-orange-900/40"
                    : "cursor-pointer fill-transparent hover:fill-muted/50 focus-visible:fill-muted/50",
                )}
              >
                <title>{place ? place.name : name}</title>
              </path>
            );
          })}

          {/* Historical overlays — dashed, above modern borders, labels only.
              pointer-events stay off the fills so countries underneath remain
              clickable; overlays are selected via their labels or search. */}
          {overlayPlaces.map((p) => {
            const geom = overlays.get(p.id);
            if (!geom || !isFocused(p)) return null;
            const isSelected = p.id === selectedId;
            const centroid = path.centroid(geom);
            return (
              <g key={`overlay-${p.id}`}>
                <path
                  d={path(geom) ?? undefined}
                  vectorEffect="non-scaling-stroke"
                  className={cn(
                    "pointer-events-none stroke-orange-700/70 transition-colors duration-300",
                    isSelected ? "fill-orange-700/25" : "fill-orange-700/10",
                  )}
                  strokeDasharray="5 4"
                />
                {zoomedIn && (
                  <text
                    x={centroid[0]}
                    y={centroid[1]}
                    textAnchor="middle"
                    tabIndex={0}
                    role="button"
                    aria-label={`${p.name} — historical region`}
                    onClick={() => {
                      if (dragRef.current.moved) return;
                      zoomedRef.current = `place:${p.id}`;
                      onSelect({ kind: "place", id: p.id });
                    }}
                    onKeyDown={keyboardActivate(() =>
                      onSelect({ kind: "place", id: p.id }),
                    )}
                    className="cursor-pointer fill-orange-600/90 font-mono outline-none hover:underline"
                    fontSize={11 / view.k}
                  >
                    {p.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* City points */}
          {cityPlaces.map((p) => {
            const proj = projection(p.geo.point!);
            if (!proj || !isFocused(p)) return null;
            const isSelected = p.id === selectedId;
            return (
              <g key={`city-${p.id}`}>
                {/* A generous, invisible hit target: a 4–6px dot is far too
                    small to tap, and the country/state shapes underneath would
                    otherwise grab clicks meant for the city. Constant ~13px
                    screen radius (÷ view.k) keeps it comfortable at any zoom.
                    It's the `peer` so the visible dot below lights on hover /
                    keyboard focus. */}
                <circle
                  cx={proj[0]}
                  cy={proj[1]}
                  r={13 / view.k}
                  tabIndex={0}
                  role="button"
                  aria-label={`${p.name} — has a story`}
                  onClick={() => {
                    if (dragRef.current.moved) return;
                    zoomedRef.current = `place:${p.id}`;
                    zoomToPoint(p.geo.point!);
                    onSelect({ kind: "place", id: p.id });
                  }}
                  onKeyDown={keyboardActivate(() => {
                    zoomToPoint(p.geo.point!);
                    onSelect({ kind: "place", id: p.id });
                  })}
                  className="peer cursor-pointer fill-transparent outline-none"
                />
                {/* The visible dot — decorative; the ring above it drives it. */}
                <circle
                  cx={proj[0]}
                  cy={proj[1]}
                  r={(isSelected ? 6 : 4) / view.k}
                  className={cn(
                    "pointer-events-none stroke-background transition-colors duration-300",
                    isSelected
                      ? "fill-orange-500"
                      : "fill-orange-600/90 peer-hover:fill-orange-500 peer-focus-visible:fill-orange-500",
                  )}
                  strokeWidth={1 / view.k}
                >
                  <title>{p.name}</title>
                </circle>
                {zoomedIn && (
                  <text
                    x={proj[0]}
                    y={proj[1] - 6 / view.k}
                    textAnchor="middle"
                    className="pointer-events-none fill-foreground/80 font-mono"
                    fontSize={10 / view.k}
                  >
                    {p.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Zoom + pan controls */}
      <div className="absolute bottom-2 right-2 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => zoomBy(1.6)}
          disabled={view.k >= MAX_K}
          aria-label="Zoom in"
          className="flex h-8 w-8 items-center justify-center rounded-md border bg-background/80 font-mono text-lg leading-none text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomBy(1 / 1.6)}
          disabled={view.k <= 1}
          aria-label="Zoom out"
          className="flex h-8 w-8 items-center justify-center rounded-md border bg-background/80 font-mono text-lg leading-none text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => {
            resetView();
            onSelect(null);
          }}
          disabled={view.k === 1}
          aria-label="Reset to world view"
          title="World view"
          className="flex h-8 w-8 items-center justify-center rounded-md border bg-background/80 font-mono text-sm leading-none text-muted-foreground backdrop-blur transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
        >
          ⤢
        </button>
      </div>
    </div>
  );
}
