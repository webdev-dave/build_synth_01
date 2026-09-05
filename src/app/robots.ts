import type { MetadataRoute } from "next";

/**
 * robots.txt emitted at build (works under `output: "export"`).
 *
 * We *want* to be crawled by search engines and AI answer engines alike, so
 * everything is allowed and the sitemap is advertised. Individual thin pages
 * opt out via per-page `robots: { index: false }`, not here.
 */
const BASE = "https://instrumaps.com";

// Required under `output: "export"` — emit as a static file at build time.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
