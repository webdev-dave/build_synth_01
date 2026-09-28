"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { GROOVES, searchGrooves, type GrooveKind } from "@/lib/grooves/registry";
import { genreOptionsFrom } from "@/lib/search/options";
import { LessonAliases } from "@/components/lessons/LessonAliases";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HubSearch, genreChipGroup, toggleChipGroup } from "@/components/content/HubSearch";

export function GroovesExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [kind, setKind] = useState<GrooveKind | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const genreOptions = useMemo(() => genreOptionsFrom(GROOVES.flatMap((g) => g.usedIn)), []);
  const showStatus =
    GROOVES.some((g) => g.status === "live") && GROOVES.some((g) => g.status === "soon");

  const matches = useMemo(
    () => searchGrooves(query, { genre, kind, status }),
    [query, genre, kind, status],
  );
  const filtering =
    query.trim().length > 0 || Boolean(genre) || Boolean(kind) || Boolean(status);

  return (
    <HubSearch
      headingId="grooves-heading"
      heading={
        filtering
          ? `${matches.length} of ${GROOVES.length}`
          : `${GROOVES.length} ${GROOVES.length === 1 ? "entry" : "entries"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a groove, a meter, a count, or a genre…"
      searchLabel="Search rhythm and meter"
      controlsId="grooves-grid"
      groups={[
        genreChipGroup(genreOptions, genre, setGenre),
        toggleChipGroup(
          "Kind",
          [
            { id: "groove", label: "Groove" },
            { id: "meter", label: "Meter" },
          ],
          kind,
          (id) => setKind(id as GrooveKind | undefined),
        ),
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
            ? `No groove or meter matches “${query.trim()}”. Try a name, a count, or a genre.`
            : "No groove or meter matches those filters."
          : undefined
      }
      onClearFilters={
        filtering
          ? () => {
              setQuery("");
              setGenre(undefined);
              setKind(undefined);
              setStatus(undefined);
            }
          : undefined
      }
    >
      <div id="grooves-grid" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((g) => {
          const soon = g.status === "soon";
          return (
            <Link
              key={g.slug}
              href={`/rhythm/${g.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader className="space-y-0 gap-6 p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{g.name}</CardTitle>
                    {g.kind === "meter" && <Badge variant="outline">Meter</Badge>}
                    {soon && <Badge variant="secondary">Soon</Badge>}
                    <ArrowRight
                      aria-hidden
                      className="ms-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1 motion-safe:group-hover:translate-x-0"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <CardDescription className="line-clamp-2 leading-relaxed" title={g.summary}>
                      {g.summary}
                    </CardDescription>
                    <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {g.formula}
                    </span>
                  </div>
                  <LessonAliases
                    aliases={g.aliases}
                    variant="line"
                    noun={g.kind === "meter" ? "this meter" : "this groove"}
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
