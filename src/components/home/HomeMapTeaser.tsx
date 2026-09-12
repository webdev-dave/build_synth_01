"use client";

/**
 * HomeMapTeaser — a quiet, non-interactive preview of the Music History Map
 * for the bottom of the homepage. One job: show that music history has a
 * geography here (tinted places, historical overlays, city dots — no
 * names; those wait until you zoom in on /map) and carry the click
 * through to /map, where the real bidirectional map lives.
 *
 * Deliberately lighter than MusicMap: world countries only (no US states
 * layer), no zoom, no per-feature handlers — the whole picture is one link.
 * Data comes from the same registry + /geo files, so homepage coverage can
 * never drift from the live map.
 */
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import { PLACES, placeByCountryId } from "@/lib/places/registry";
import { cn } from "@/lib/utils";

const W = 960;
const H = 500;

type NamedFeature = Feature<Geometry, { name?: string }>;

export function HomeMapTeaser() {
  const [countries, setCountries] = useState<NamedFeature[]>([]);
  const [overlays, setOverlays] = useState<NamedFeature[]>([]);

  const projection = useMemo(
    () =>
      geoNaturalEarth1().fitExtent(
        [
          [4, 4],
          [W - 4, H - 4],
        ],
        { type: "Sphere" },
      ),
    [],
  );
  const path = useMemo(() => geoPath(projection), [projection]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const worldRes = await fetch("/geo/world-110m.json");
      const world = (await worldRes.json()) as Topology<{
        countries: GeometryCollection<{ name?: string }>;
      }>;
      const overlayFiles = PLACES.filter((p) => p.geo.overlay).map(
        (p) => p.geo.overlay!,
      );
      const overlayFeatures = await Promise.all(
        overlayFiles.map(async (file) => {
          const res = await fetch(`/geo/overlays/${file}`);
          return (await res.json()) as NamedFeature;
        }),
      );
      if (cancelled) return;
      setCountries(
        (feature(world, world.objects.countries) as FeatureCollection<
          Geometry,
          { name?: string }
        >).features,
      );
      setOverlays(overlayFeatures);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const cityPlaces = PLACES.filter((p) => p.geo.point);

  return (
    <Link
      href="/map"
      aria-label="Open the Music History Map — blues and klezmer are mapped, from the Mississippi Delta to the Pale of Settlement"
      className="group block rounded-lg border bg-card/30 p-4 transition-colors hover:border-foreground/25 hover:bg-accent/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:p-5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="text-base font-semibold tracking-tight text-foreground">
          Where the sounds live
        </h3>
        <span className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          Explore the map
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
      <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Music history happened in places — many with names no modern map
        shows. Blues and klezmer are mapped so far, from the Mississippi Delta
        to the Pale of Settlement; click any place for its story.
      </p>

      <div className="pointer-events-none mt-4">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" aria-hidden>
          <path
            d={path({ type: "Sphere" }) ?? undefined}
            className="fill-transparent stroke-border"
            vectorEffect="non-scaling-stroke"
          />
          {countries.map((c, i) => {
            // world-atlas 110m leaves N. Cyprus, Somaliland, and Kosovo
            // without an ISO numeric id — name (then index) keeps the key unique.
            const id = c.id != null ? String(c.id) : undefined;
            const covered = Boolean(id && placeByCountryId(id));
            return (
              <path
                key={id ?? c.properties?.name ?? `country-${i}`}
                d={path(c) ?? undefined}
                vectorEffect="non-scaling-stroke"
                className={cn(
                  "stroke-border/70 transition-colors duration-300",
                  covered
                    ? "fill-orange-950/60 group-hover:fill-orange-900/50"
                    : "fill-muted/40",
                )}
              />
            );
          })}
          {overlays.map((o, i) => (
            <path
              key={o.properties?.name ?? i}
              d={path(o) ?? undefined}
              vectorEffect="non-scaling-stroke"
              strokeDasharray="5 4"
              className="fill-orange-700/10 stroke-orange-700/70"
            />
          ))}
          {cityPlaces.map((p) => {
            const proj = projection(p.geo.point!);
            if (!proj) return null;
            return (
              <circle
                key={p.id}
                cx={proj[0]}
                cy={proj[1]}
                r={3.5}
                className="fill-orange-600/90 stroke-background"
                strokeWidth={1}
              />
            );
          })}
        </svg>
      </div>
    </Link>
  );
}
