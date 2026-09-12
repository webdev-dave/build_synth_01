import type { Metadata } from "next";
import { BookMarked } from "lucide-react";

import { ConceptsExplorer } from "@/components/concepts/ConceptsExplorer";

export const metadata: Metadata = {
  title: "Music Theory Concepts — An Interactive Glossary",
  description:
    "Short, honest definitions of the terms behind the app — pentatonic, blue notes, syncopation, the 12-bar blues, race records, and more — each linked to a page where you can learn it, and hear it when the idea is audible.",
  alternates: { canonical: "/concepts" },
  keywords: [
    "music theory glossary",
    "what is a pentatonic scale",
    "what are blue notes",
    "what is syncopation",
    "12-bar blues explained",
  ],
};

export default function ConceptsPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <BookMarked className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Concepts</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A plain-language glossary of the terms that show up across the app
            — theory, and the history that explains a loaded word. Each one is
            a sentence you can actually understand — and, where the idea is
            audible, a link to a page where you can <strong>see and hear</strong>{" "}
            it, not just read about it.
          </p>
        </header>

        <ConceptsExplorer />
      </div>
    </main>
  );
}
