"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HISTORY_ARTICLES, searchHistory } from "@/lib/history/registry";
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

export function HistoryExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const genreOptions = useMemo(
    () =>
      genreOptionsFrom(HISTORY_ARTICLES.flatMap((article) => article.genres)),
    [],
  );
  const showStatus =
    HISTORY_ARTICLES.some((article) => article.status === "live") &&
    HISTORY_ARTICLES.some((article) => article.status === "soon");

  const matches = useMemo(
    () => searchHistory(query, { genre, status }),
    [query, genre, status],
  );
  const filtering =
    query.trim().length > 0 || Boolean(genre) || Boolean(status);

  return (
    <HubSearch
      headingId="articles-heading"
      heading={
        filtering
          ? `${matches.length} of ${HISTORY_ARTICLES.length}`
          : `${HISTORY_ARTICLES.length} ${
              HISTORY_ARTICLES.length === 1 ? "article" : "articles"
            }`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search an article, genre, or scale…"
      searchLabel="Search history articles"
      controlsId="history-grid"
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
            ? `No article matches “${query.trim()}”. Try a name, a genre, or a scale.`
            : "No article matches those filters."
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
      <div
        id="history-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((article) => {
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
                      <NativeSpelling
                        id={article.slug}
                        className="ms-2 text-sm"
                      />
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
    </HubSearch>
  );
}
