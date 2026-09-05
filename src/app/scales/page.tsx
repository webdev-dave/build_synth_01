import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Waypoints } from "lucide-react";

import { SCALES } from "@/lib/scales/registry";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Scales & Modes — Built, Heard, and Played",
  description:
    "A deep dive into how scales and modes are built — the blues scale, the major scale, pentatonics, and the modes. See the formula, hear the sound, play each one.",
  alternates: { canonical: "/scales" },
  keywords: [
    "music scales explained",
    "scales and modes",
    "what is the blues scale",
    "scale formulas",
  ],
};

export default function ScalesPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Waypoints className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">
              Scales &amp; modes
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A scale is a small map of notes a melody draws from. Each page here
            takes one scale or mode, shows you the{" "}
            <strong>formula and the notes</strong>, and lets you hear why it
            sounds the way it does — the blues scale&apos;s ache, the major
            scale&apos;s resolve, Dorian&apos;s brightness.
          </p>
        </header>

        <section aria-labelledby="scales-heading">
          <h2
            id="scales-heading"
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Scales
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SCALES.map((scale) => {
              const soon = scale.status === "soon";
              return (
                <Link
                  key={scale.slug}
                  href={`/scales/${scale.slug}`}
                  className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {scale.name}
                        </CardTitle>
                        {scale.kind === "mode" && (
                          <Badge variant="outline">Mode</Badge>
                        )}
                        {soon && <Badge variant="secondary">Soon</Badge>}
                      </div>
                      <CardDescription>{scale.summary}</CardDescription>
                      <span className="mt-1 font-mono text-xs text-muted-foreground">
                        {scale.formula}
                      </span>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {soon ? "Preview" : "Explore"}
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
