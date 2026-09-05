import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import { HISTORY_ARTICLES } from "@/lib/history/registry";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

        <section aria-labelledby="articles-heading">
          <h2
            id="articles-heading"
            className="mb-4 text-sm font-medium text-muted-foreground"
          >
            Articles
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {HISTORY_ARTICLES.map((article) => {
              const soon = article.status === "soon";
              return (
                <Link
                  key={article.slug}
                  href={`/history/${article.slug}`}
                  className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">
                          {article.name}
                        </CardTitle>
                        {soon && <Badge variant="secondary">Soon</Badge>}
                      </div>
                      <CardDescription>{article.summary}</CardDescription>
                      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                        {soon ? "Preview" : "Read"}
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
