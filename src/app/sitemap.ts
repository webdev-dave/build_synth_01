import type { MetadataRoute } from "next";

import { LIVE_ARTISTS } from "@/lib/catalog/artists";
import { LIVE_SONGS } from "@/lib/catalog/songs";
import { LIVE_CONCEPTS } from "@/lib/concepts/registry";
import { LIVE_GENRES } from "@/lib/genres/registry";
import { LIVE_COUSINS } from "@/lib/cousins/registry";
import { LIVE_HISTORY } from "@/lib/history/registry";
import { LIVE_LANGUAGES } from "@/lib/languages/registry";
import { LIVE_SCALES } from "@/lib/scales/registry";

/**
 * Static sitemap emitted at build (works under `output: "export"`).
 *
 * Source of truth for indexable URLs. Hubs are always listed; spokes are
 * listed only when the registry marks them "live", so thin "coming soon"
 * placeholders don't dilute the index. Add new hubs here as modules land.
 */
const BASE = "https://instrumaps.com";

// Required under `output: "export"` — emit as a static file at build time.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Stable, hand-maintained routes (tools + top-level pages).
  const staticPaths = [
    "/",
    "/synth/v2",
    "/harmonica-lab/v2",
    "/piano-roll",
    "/lessons",
    "/map",
    "/genres",
    "/scales",
    "/history",
    "/concepts",
    "/artists",
    "/songs",
    "/cousins",
    "/languages",
    "/about",
    "/contact",
  ];

  const spokePaths = [
    ...LIVE_GENRES.map((g) => `/genres/${g.slug}`),
    ...LIVE_SCALES.map((s) => `/scales/${s.slug}`),
    ...LIVE_HISTORY.map((a) => `/history/${a.slug}`),
    ...LIVE_CONCEPTS.map((c) => `/concepts/${c.slug}`),
    ...LIVE_ARTISTS.map((a) => `/artists/${a.slug}`),
    ...LIVE_SONGS.map((s) => `/songs/${s.slug}`),
    ...LIVE_COUSINS.map((c) => `/cousins/${c.slug}`),
    ...LIVE_LANGUAGES.map((l) => `/languages/${l.slug}`),
  ];

  return [...staticPaths, ...spokePaths].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
