import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookMarked } from "lucide-react";

import { CONCEPTS } from "@/lib/concepts/registry";
import { NativeSpelling } from "@/components/words/NativeSpelling";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Music Theory Concepts — A Playable Glossary",
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

        <section aria-labelledby="concepts-heading">
          <h2
            id="concepts-heading"
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Terms
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONCEPTS.map((concept) => {
              const soon = concept.status === "soon";
              return (
                <Link
                  key={concept.slug}
                  href={concept.href}
                  className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {concept.term}
                          <NativeSpelling
                            id={concept.slug}
                            className="ms-2 text-sm"
                          />
                        </CardTitle>
                        {soon && <Badge variant="secondary">Soon</Badge>}
                      </div>
                      <CardDescription>{concept.micro}</CardDescription>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        Learn more
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
