"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  PROGRESSIONS,
  searchProgressions,
  type ProgressionKind,
} from "@/lib/progressions/registry";
import { genreOptionsFrom } from "@/lib/search/options";
import { LessonAliases } from "@/components/lessons/LessonAliases";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HubSearch,
  genreChipGroup,
  toggleChipGroup,
} from "@/components/content/HubSearch";

export function ProgressionsExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [kind, setKind] = useState<ProgressionKind | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const genreOptions = useMemo(
    () => genreOptionsFrom(PROGRESSIONS.flatMap((p) => p.usedIn)),
    [],
  );
  const showKind =
    PROGRESSIONS.some((p) => p.kind === "progression") &&
    PROGRESSIONS.some((p) => p.kind === "chord");
  const showStatus =
    PROGRESSIONS.some((p) => p.status === "live") &&
    PROGRESSIONS.some((p) => p.status === "soon");

  const matches = useMemo(
    () => searchProgressions(query, { genre, kind, status }),
    [query, genre, kind, status],
  );
  const filtering =
    query.trim().length > 0 || Boolean(genre) || Boolean(kind) || Boolean(status);

  return (
    <HubSearch
      headingId="progressions-heading"
      heading={
        filtering
          ? `${matches.length} of ${PROGRESSIONS.length}`
          : `${PROGRESSIONS.length} ${PROGRESSIONS.length === 1 ? "entry" : "entries"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a progression, a chord, a numeral, or a genre…"
      searchLabel="Search chords and progressions"
      controlsId="progressions-grid"
      groups={[
        genreChipGroup(genreOptions, genre, setGenre),
        toggleChipGroup(
          "Kind",
          showKind
            ? [
                { id: "progression", label: "Progression" },
                { id: "chord", label: "Chord" },
              ]
            : [],
          kind,
          (id) => setKind(id as ProgressionKind | undefined),
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
            ? `No progression matches “${query.trim()}”. Try a name, a numeral, or a genre.`
            : "No progression matches those filters."
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
      <div
        id="progressions-grid"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((p) => {
          const soon = p.status === "soon";
          return (
            <Link
              key={p.slug}
              href={`/progressions/${p.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader className="space-y-0 gap-6 p-6 sm:p-7">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{p.name}</CardTitle>
                    {p.kind === "chord" && <Badge variant="outline">Chord</Badge>}
                    {soon && <Badge variant="secondary">Soon</Badge>}
                    <ArrowRight
                      aria-hidden
                      className="ms-auto h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:-translate-x-1 motion-safe:group-hover:translate-x-0"
                    />
                  </div>
                  <div className="flex flex-col gap-3">
                    <CardDescription
                      className="line-clamp-2 leading-relaxed"
                      title={p.summary}
                    >
                      {p.summary}
                    </CardDescription>
                    <span className="font-mono text-xs leading-relaxed text-muted-foreground">
                      {p.formula}
                    </span>
                  </div>
                  <LessonAliases
                    aliases={p.aliases}
                    variant="line"
                    noun={p.kind === "chord" ? "this chord" : "this progression"}
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
