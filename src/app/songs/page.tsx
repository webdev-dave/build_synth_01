import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Music2 } from "lucide-react";

import { SONGS_CATALOG, songAttribution } from "@/lib/catalog/songs";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

        <section aria-labelledby="songs-heading">
          <h2
            id="songs-heading"
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Recordings
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SONGS_CATALOG.map((song) => {
              const soon = song.status === "soon";
              return (
                <Link
                  key={song.slug}
                  href={`/songs/${song.slug}`}
                  className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {song.title}
                        </CardTitle>
                        {soon && <Badge variant="secondary">Soon</Badge>}
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {songAttribution(song)}
                      </p>
                      {song.micro && (
                        <CardDescription>{song.micro}</CardDescription>
                      )}
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        Listen
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
