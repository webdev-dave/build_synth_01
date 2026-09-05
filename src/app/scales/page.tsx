import type { Metadata } from "next";
import { Waypoints } from "lucide-react";

import { ScalesExplorer } from "@/components/scales/ScalesExplorer";

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

        <ScalesExplorer />
      </div>
    </main>
  );
}
