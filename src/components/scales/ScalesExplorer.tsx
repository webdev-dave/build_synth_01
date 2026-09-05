"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  SCALES,
  searchScales,
  type ScaleKind,
} from "@/lib/scales/registry";
import { genreOptionsFrom } from "@/lib/search/options";
import { NativeSpelling } from "@/components/words/NativeSpelling";
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

export function ScalesExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [kind, setKind] = useState<ScaleKind | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const genreOptions = useMemo(
    () => genreOptionsFrom(SCALES.flatMap((scale) => scale.usedIn)),
    [],
  );
  const showKind =
    SCALES.some((scale) => scale.kind === "scale") &&
    SCALES.some((scale) => scale.kind === "mode");
  const showStatus =
    SCALES.some((scale) => scale.status === "live") &&
    SCALES.some((scale) => scale.status === "soon");

  const matches = useMemo(
    () => searchScales(query, { genre, kind, status }),
    [query, genre, kind, status],
  );
  const filtering =
    query.trim().length > 0 ||
    Boolean(genre) ||
    Boolean(kind) ||
    Boolean(status);

  return (
    <HubSearch
      headingId="scales-heading"
      heading={
        filtering
          ? `${matches.length} of ${SCALES.length}`
          : `${SCALES.length} ${SCALES.length === 1 ? "scale" : "scales"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a scale, formula, or genre…"
      searchLabel="Search scales"
      controlsId="scales-grid"
      groups={[
        genreChipGroup(genreOptions, genre, setGenre),
        toggleChipGroup(
          "Kind",
          showKind
            ? [
                { id: "scale", label: "Scale" },
                { id: "mode", label: "Mode" },
              ]
            : [],
          kind,
          (id) => setKind(id as ScaleKind | undefined),
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
            ? `No scale matches “${query.trim()}”. Try a name, a formula, or a genre.`
            : "No scale matches those filters."
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
        id="scales-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((scale) => {
          const soon = scale.status === "soon";
          return (
            <Link
              key={scale.slug}
              href={`/scales/${scale.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {scale.name}
                      <NativeSpelling
                        id={scale.slug}
                        className="ms-2 text-sm"
                      />
                    </CardTitle>
                    {scale.kind === "mode" && (
                      <Badge variant="outline">Mode</Badge>
                    )}
                    {soon && <Badge variant="secondary">Soon</Badge>}
                  </div>
                  <CardDescription>{scale.summary}</CardDescription>
                  <span className="mt-1 font-mono text-xs text-muted-foreground">
                    {scale.formula}
                  </span>
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
