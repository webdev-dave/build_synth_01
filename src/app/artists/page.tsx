import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";

import { ARTISTS } from "@/lib/catalog/artists";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

        <section aria-labelledby="artists-heading">
          <h2
            id="artists-heading"
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            People
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARTISTS.map((artist) => {
              const soon = artist.status === "soon";
              return (
                <Link
                  key={artist.slug}
                  href={`/artists/${artist.slug}`}
                  className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {artist.name}
                        </CardTitle>
                        {artist.era && (
                          <span className="font-mono text-xs text-muted-foreground">
                            {artist.era}
                          </span>
                        )}
                        {soon && <Badge variant="secondary">Soon</Badge>}
                      </div>
                      <CardDescription>{artist.micro}</CardDescription>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        Read
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
