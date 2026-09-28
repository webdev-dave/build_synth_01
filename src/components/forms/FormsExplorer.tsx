"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FORMS, formBars, searchForms } from "@/lib/forms/registry";
import { genreOptionsFrom } from "@/lib/search/options";
import { LessonAliases } from "@/components/lessons/LessonAliases";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HubSearch, genreChipGroup, toggleChipGroup } from "@/components/content/HubSearch";

export function FormsExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const genreOptions = useMemo(() => genreOptionsFrom(FORMS.flatMap((f) => f.usedIn)), []);
  const showStatus =
    FORMS.some((f) => f.status === "live") && FORMS.some((f) => f.status === "soon");

  const matches = useMemo(() => searchForms(query, { genre, status }), [query, genre, status]);
  const filtering = query.trim().length > 0 || Boolean(genre) || Boolean(status);

  return (
    <HubSearch
      headingId="forms-heading"
      heading={
        filtering
          ? `${matches.length} of ${FORMS.length}`
          : `${FORMS.length} ${FORMS.length === 1 ? "form" : "forms"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a form, a length in bars, or a genre…"
      searchLabel="Search song forms"
      controlsId="forms-grid"
      groups={[
        genreChipGroup(genreOptions, genre, setGenre),
        toggleChipGroup(
          "Also",
          showStatus
            ? [
                { id: "live", label: "Ready" },
                { id: "soon", label: "Coming soon" },
              ]
            : [],
          status,
          (id) => setStatus(id as "live" | "soon" | undefined),
        ),
      ]}
      empty={
        matches.length === 0
          ? query.trim()
            ? `No form matches “${query.trim()}”. Try a name, a bar count, or a genre.`
            : "No form matches those filters."
          : undefined
      }
      onClearFilters={
        filtering
          ? () => {
              setQuery("");
              setGenre(undefined);
              setStatus(undefined);
            }
          : undefined
      }
    >
      <div id="forms-grid" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((f) => {
          const soon = f.status === "soon";
          return (
            <Link
              key={f.slug}
              href={`/forms/${f.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader className="space-y-0 gap-6 p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{f.name}</CardTitle>
                    <Badge variant="outline">{formBars(f)} bars</Badge>
                    {soon && <Badge variant="secondary">Soon</Badge>}
                    <ArrowRight
                      aria-hidden
                      className="ms-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1 motion-safe:group-hover:translate-x-0"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <CardDescription className="line-clamp-2 leading-relaxed" title={f.summary}>
                      {f.summary}
                    </CardDescription>
                    <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {f.formula}
                    </span>
                  </div>
                  <LessonAliases
                    aliases={f.aliases}
                    variant="line"
                    noun="this form"
                    className="leading-relaxed"
                  />
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </HubSearch>
  );
}
