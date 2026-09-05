import type { Metadata } from "next";
import { Music2 } from "lucide-react";

import { SongsExplorer } from "@/components/catalog/SongsExplorer";

export const metadata: Metadata = {
  title: "Songs — The Recordings the App Writes About",
  description:
    "Landmark recordings referenced across the site — “St. Louis Blues,” “Crazy Blues,” “Strange Fruit,” and more — each with a player, its artists, and the histories it belongs to.",
  alternates: { canonical: "/songs" },
  keywords: [
    "blues songs",
    "St. Louis Blues",
    "Crazy Blues",
    "Strange Fruit",
    "landmark blues recordings",
  ],
};

export default function SongsPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Music2 className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Songs</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            The recordings the app writes about. Each page lets you hear it,
            open it in the Piano Roll when we have an arrangement, and follow it
            back to its artists and the histories it belongs to.
          </p>
        </header>

        <SongsExplorer />
      </div>
    </main>
  );
}
