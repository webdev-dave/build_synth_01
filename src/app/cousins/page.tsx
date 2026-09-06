import type { Metadata } from "next";
import { GitFork } from "lucide-react";

import { CousinsExplorer } from "@/components/cousins/CousinsExplorer";

export const metadata: Metadata = {
  title: "Cousins — One melody, many lives",
  description:
    "History and versions of one melody: a Greek dance, a Jewish wedding tune, a surf-rock hit — same contour, new rooms. Sourced stories of tunes that wandered.",
  alternates: { canonical: "/cousins" },
  keywords: [
    "song cousins",
    "tune family",
    "Misirlou history",
    "Dona Dona versions",
    "melodies across cultures",
  ],
};

export default function CousinsPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <GitFork className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Cousins</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A melody can be a Greek dance, a Jewish wedding tune, and a
            surf-rock hit — <strong>same contour, new rooms</strong>. History
            articles tell where a genre came from; a song page holds one
            recording. These pages tell the history and versions of one
            melody.
          </p>
        </header>

        <CousinsExplorer />
      </div>
    </main>
  );
}
