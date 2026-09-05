import type { Metadata } from "next";
import { Map as MapIcon } from "lucide-react";

import { MapExplorer } from "@/components/map/MapExplorer";
import { PLACES } from "@/lib/places/registry";
import manifest from "@/lib/songs/manifest.json";

export const metadata: Metadata = {
  title: "Music History Map — Where the Sounds Live",
  description:
    "An interactive world map of music history. Click a country, region, or city — or search historical names like Bessarabia and the Mississippi Delta — to trace where blues and klezmer come from.",
  alternates: { canonical: "/map" },
  keywords: [
    "music history map",
    "where did the blues come from map",
    "klezmer map eastern europe",
    "pale of settlement music",
    "mississippi delta blues map",
    "music geography",
  ],
};

interface ManifestEntry {
  labels?: string[];
}

/**
 * Tune counts per Piano Roll label, computed at build time so the client
 * bundle never ships the full 800-song manifest. Only labels the place
 * registry actually references are included.
 */
function buildSongCounts(): Record<string, number> {
  const wanted = new Set(
    PLACES.flatMap((p) => p.music.songLabels ?? []),
  );
  const counts: Record<string, number> = {};
  for (const entry of manifest as ManifestEntry[]) {
    for (const label of entry.labels ?? []) {
      if (wanted.has(label)) counts[label] = (counts[label] ?? 0) + 1;
    }
  }
  return counts;
}

export default function MapPage() {
  const songCounts = buildSongCounts();

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <header>
          <div className="flex items-center gap-2.5">
            <MapIcon className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">
              Music history map
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Music history happened in places — many of which have changed
            names, changed borders, or vanished from modern maps entirely.
            Click a country, state, or city to read what we know about its
            music, or search by any name a place has carried: Kishinev or
            Chișinău, Vilna or Vilnius, the Pale of Settlement, the Delta.
          </p>
        </header>

        <MapExplorer songCounts={songCounts} />
      </div>
    </main>
  );
}
