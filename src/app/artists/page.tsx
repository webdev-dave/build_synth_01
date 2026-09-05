import type { Metadata } from "next";
import { Users } from "lucide-react";

import { ArtistsExplorer } from "@/components/catalog/ArtistsExplorer";

export const metadata: Metadata = {
  title: "Artists — The Musicians Behind the Music",
  description:
    "The performers and composers the app writes about — W. C. Handy, Bessie Smith, Muddy Waters, and more — each linked to their songs and the histories they shaped.",
  alternates: { canonical: "/artists" },
  keywords: [
    "blues artists",
    "W. C. Handy",
    "Bessie Smith",
    "Muddy Waters",
    "Mamie Smith",
  ],
};

export default function ArtistsPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Users className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Artists</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            The musicians the app writes about. Each page gathers who they were,
            the songs we reference, and the genres and histories they shaped —
            so every mention across the site points back to one place.
          </p>
        </header>

        <ArtistsExplorer />
      </div>
    </main>
  );
}
