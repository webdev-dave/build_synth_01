import { brandSquareIcon } from "@/lib/brandOgImage";

// PWA manifest icon (192x192), generated from the brand mark at build time.
export const dynamic = "force-static";

export function GET() {
  return brandSquareIcon(192);
}
