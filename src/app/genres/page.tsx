import type { Metadata } from "next";
import { Disc3 } from "lucide-react";

import { GenresExplorer } from "@/components/genres/GenresExplorer";

export const metadata: Metadata = {
  title: "Music Genres — What Makes Each One Itself",
  description:
    "Hear what makes a genre sound like itself. Every genre is a stack of layers — rhythm, meter, harmony, scale, and form — and each page leads with the one that defines it.",
  alternates: { canonical: "/genres" },
  keywords: [
    "music genres explained",
    "what makes a genre",
    "genre music theory",
    "what is the blues",
  ],
};

export default function GenresPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Disc3 className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Genres</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            What actually makes a genre sound like itself? It&apos;s almost
            never one thing. Every genre is a <strong>stack of layers</strong> —
            rhythm, meter, harmony, scale, form, texture — and each one leads
            with the layer that defines it. Reggae is a groove long before it is
            a chord chart; the blues is a form, a feel, and a scale at once.
          </p>
        </header>

        <GenresExplorer />
      </div>
    </main>
  );
}
