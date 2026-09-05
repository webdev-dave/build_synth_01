import type { Metadata } from "next";
import { Disc3 } from "lucide-react";

import { LAYER_INFO, type GenreLayer } from "@/lib/genres/registry";
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

/** Order the legend the way genres actually stack, most-structural first. */
const LEGEND_ORDER: GenreLayer[] = [
  "rhythm",
  "meter",
  "harmony",
  "scale",
  "form",
  "texture",
];

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

        <section className="mb-10" aria-labelledby="layers-heading">
          <h2
            id="layers-heading"
            className="mb-3 text-sm font-medium text-muted-foreground"
          >
            The layers
          </h2>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
            {LEGEND_ORDER.map((layer) => (
              <div key={layer} className="rounded-md border bg-muted/20 p-3">
                <dt className="font-mono text-xs uppercase tracking-wide text-foreground">
                  {LAYER_INFO[layer].label}
                </dt>
                <dd className="mt-1 text-sm text-muted-foreground">
                  {LAYER_INFO[layer].blurb}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <GenresExplorer />
      </div>
    </main>
  );
}
