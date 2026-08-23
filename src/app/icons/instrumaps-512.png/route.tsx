import { brandSquareIcon } from "@/lib/brandOgImage";

// PWA manifest icon (512x512), generated from the brand mark at build time.
export const dynamic = "force-static";

export function GET() {
  return brandSquareIcon(512);
}
