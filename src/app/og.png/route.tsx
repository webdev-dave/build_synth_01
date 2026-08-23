import { brandOgImage } from "@/lib/brandOgImage";

// Social link-preview image (Open Graph + Twitter). Served from a `.png` route
// so the exported file keeps the correct `image/png` Content-Type on any static
// host — link scrapers (WhatsApp, iMessage, X) reject mislabeled images.
export const dynamic = "force-static";

export function GET() {
  return brandOgImage();
}
