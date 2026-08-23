import { brandSquareIcon } from "@/lib/brandOgImage";

// iOS home-screen / Safari touch icon (180x180), generated from the brand mark.
// Served from a `.png` route for a correct Content-Type on static hosting.
export const dynamic = "force-static";

export function GET() {
  return brandSquareIcon(180);
}
