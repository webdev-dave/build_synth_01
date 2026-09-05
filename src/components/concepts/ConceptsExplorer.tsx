"use client";

/**
 * Hub list + filter for /concepts. The glossary will grow; this keeps
 * the grid scannable by term, alias, native script, or a genre/scale
 * the concept already names.
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";

import { CONCEPTS, searchConcepts } from "@/lib/concepts/registry";
import { NativeSpelling } from "@/components/words/NativeSpelling";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ConceptsExplorer() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchConcepts(query), [query]);
  const filtering = query.trim().length > 0;

  return (
    <section aria-labelledby="concepts-heading">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="concepts-heading"
          className="text-sm font-medium text-muted-foreground"
        >
          {filtering
            ? `${matches.length} of ${CONCEPTS.length}`
            : `${CONCEPTS.length} term${CONCEPTS.length === 1 ? "" : "s"}`}
        </h2>
        <div className="flex w-full items-center gap-2 rounded-md border bg-background px-3 py-2 sm:max-w-md">
          <Search
            className="h-4 w-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a term, alias, or genre…"
            aria-label="Search concepts"
            aria-controls="concepts-grid"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60"
          />
          {filtering && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-sm text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {matches.length === 0 ? (
        <p
          role="status"
          className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground"
        >
          No concept matches “{query.trim()}”. Try a name, another spelling,
          or a genre it shows up in.
        </p>
      ) : (
        <div
          id="concepts-grid"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {matches.map((concept) => {
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
      )}
    </section>
  );
}
