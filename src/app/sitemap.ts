import type { MetadataRoute } from "next";

import { LIVE_GENRES } from "@/lib/genres/registry";
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
    "/genres",
    "/scales",
    "/about",
    "/contact",
  ];

  const spokePaths = [
    ...LIVE_GENRES.map((g) => `/genres/${g.slug}`),
    ...LIVE_SCALES.map((s) => `/scales/${s.slug}`),
  ];

  return [...staticPaths, ...spokePaths].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
