/**
 * geoData — one shared, cached load of the map's geometry.
 *
 * The world topology (`/geo/world-110m.json`) is the heaviest asset the map
 * touches, and both the full `/map` and every embedded region-map (bottom of
 * genre/history/artist pages) need the same countries, US states, and
 * hand-drawn historical overlays. Fetching per-mount would re-download it on
 * every page. This module memoizes a single in-flight promise per session, so
 * the second map to mount reuses the first's parsed features.
 *
 * Client-only (the maps that use it are `"use client"`); it must never run in
 * a server component.
 */
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import { PLACES } from "@/lib/places/registry";

export type NamedFeature = Feature<Geometry, { name?: string }>;

export interface GeoData {
  countries: NamedFeature[];
  states: NamedFeature[];
  /** Historical-region overlays keyed by place id. */
  overlays: Map<string, NamedFeature>;
}

let cache: Promise<GeoData> | null = null;

async function load(): Promise<GeoData> {
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

  return {
    countries: (
      feature(world, world.objects.countries) as FeatureCollection<
        Geometry,
        { name?: string }
      >
    ).features,
    states: (
      feature(us, us.objects.states) as FeatureCollection<
        Geometry,
        { name?: string }
      >
    ).features,
    overlays: new Map(overlayEntries),
  };
}

/** Load (or reuse) the shared geometry. Safe to call from many components. */
export function loadGeoData(): Promise<GeoData> {
  if (!cache) {
    // Drop a rejected fetch so a later mount can retry rather than reusing the
    // failure forever (offline first paint, etc.).
    cache = load().catch((err) => {
      cache = null;
      throw err;
    });
  }
  return cache;
}
