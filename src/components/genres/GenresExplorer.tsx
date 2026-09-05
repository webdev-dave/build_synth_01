"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  GENRES,
  LAYER_INFO,
  searchGenres,
  type GenreLayer,
} from "@/lib/genres/registry";
import { NativeSpelling } from "@/components/words/NativeSpelling";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HubSearch, toggleChipGroup } from "@/components/content/HubSearch";

const LAYER_ORDER: GenreLayer[] = [
  "rhythm",
  "meter",
  "harmony",
  "scale",
  "form",
  "texture",
];

export function GenresExplorer() {
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState<GenreLayer | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const layerChips = LAYER_ORDER.filter((id) =>
    GENRES.some((genre) => genre.signatureLayers.includes(id)),
  ).map((id) => ({ id, label: LAYER_INFO[id].label }));
  const showStatus =
    GENRES.some((genre) => genre.status === "live") &&
    GENRES.some((genre) => genre.status === "soon");

  const matches = useMemo(
    () => searchGenres(query, { layer, status }),
    [query, layer, status],
  );
  const filtering = query.trim().length > 0 || Boolean(layer) || Boolean(status);

  return (
    <HubSearch
      headingId="genres-heading"
      heading={
        filtering
          ? `${matches.length} of ${GENRES.length}`
          : `${GENRES.length} ${GENRES.length === 1 ? "genre" : "genres"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a genre, scale, or layer…"
      searchLabel="Search genres"
      controlsId="genres-grid"
      groups={[
        toggleChipGroup("Layer", layerChips, layer, (id) =>
          setLayer(id as GenreLayer | undefined),
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
            ? `No genre matches “${query.trim()}”. Try a name, a scale, or a layer.`
            : "No genre matches those filters."
          : undefined
      }
      onClearFilters={
        filtering
          ? () => {
              setQuery("");
              setLayer(undefined);
              setStatus(undefined);
            }
          : undefined
      }
    >
      <div
        id="genres-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((genre) => {
          const soon = genre.status === "soon";
          return (
            <Link
              key={genre.slug}
              href={`/genres/${genre.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">
                      {genre.name}
                      <NativeSpelling
                        id={genre.slug}
                        className="ms-2 text-sm"
                      />
                    </CardTitle>
                    {soon && <Badge variant="secondary">Soon</Badge>}
                  </div>
                  <CardDescription>{genre.summary}</CardDescription>
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
