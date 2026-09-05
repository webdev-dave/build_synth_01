import type { Metadata } from "next";
import { BookOpen } from "lucide-react";

import { HistoryExplorer } from "@/components/history/HistoryExplorer";

export const metadata: Metadata = {
  title: "Musical History — Where the Sounds Came From",
  description:
    "The stories behind the music. Sourced, quoted, and linked histories of the genres and scales — where the blues, and the sounds it seeded, actually came from.",
  alternates: { canonical: "/history" },
  keywords: [
    "musical history",
    "history of the blues",
    "origins of music genres",
    "where did the blues come from",
  ],
};

export default function HistoryPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <BookOpen className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">
              Musical history
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            The Genres and Scales pages take a sound apart to show{" "}
            <strong>how</strong> it works. These articles tell the other half of
            the story — <strong>where</strong> it came from — and try to earn
            every claim: quoting original writing and recordings, and linking
            back to the sources so you can hear and read them yourself.
          </p>
        </header>

        <HistoryExplorer />
      </div>
    </main>
  );
}
