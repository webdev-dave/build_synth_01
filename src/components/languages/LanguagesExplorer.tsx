"use client";

/**
 * Hub list + filter for /languages. The registry will grow; this keeps
 * the grid scannable by name, native script, or anything the language
 * gathers (klezmer, krechtz, Brandwein…).
 */
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LANGUAGES, searchLanguages } from "@/lib/languages/registry";
import { NativeScript } from "@/components/words/NativeScript";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HubSearch } from "@/components/content/HubSearch";

export function LanguagesExplorer() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchLanguages(query), [query]);
  const filtering = query.trim().length > 0;

  return (
    <HubSearch
      headingId="languages-heading"
      heading={
        filtering
          ? `${matches.length} of ${LANGUAGES.length}`
          : `${LANGUAGES.length} language${LANGUAGES.length === 1 ? "" : "s"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a language, song, word, or artist…"
      searchLabel="Search languages"
      controlsId="languages-grid"
      empty={
        matches.length === 0
          ? `No language matches “${query.trim()}”. Try a name, a native spelling, or something it gathers — a genre, song, artist, or word.`
          : undefined
      }
      onClearFilters={filtering ? () => setQuery("") : undefined}
    >
      <div
        id="languages-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((language) => {
          const soon = language.status === "soon";
          return (
            <Link
              key={language.slug}
              href={`/languages/${language.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="inline-flex items-baseline gap-2 text-base">
                      {language.name}
                      {language.nativeName && (
                        <NativeScript
                          spelling={language.nativeName}
                          lang={language.lang}
                          className="text-sm font-normal text-muted-foreground"
                        />
                      )}
                    </CardTitle>
                    {soon && <Badge variant="secondary">Soon</Badge>}
                  </div>
                  <CardDescription>{language.summary}</CardDescription>
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
    </HubSearch>
  );
}
