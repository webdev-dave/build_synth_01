"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import {
  COUSIN_ARTICLES,
  COUSIN_SONG_LINK,
  searchCousins,
} from "@/lib/cousins/registry";
import { getLanguage } from "@/lib/languages/registry";
import { genreOptionsFrom } from "@/lib/search/options";
import { NativeSpelling } from "@/components/words/NativeSpelling";
import { GenrePills } from "@/components/content/GenrePills";
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

function languageOptions() {
  const slugs = [
    ...new Set(COUSIN_ARTICLES.flatMap((article) => article.languages ?? [])),
  ];
  return slugs
    .map((slug) => {
      const language = getLanguage(slug);
      return language ? { id: slug, label: language.name } : null;
    })
    .filter((option): option is { id: string; label: string } =>
      Boolean(option),
    );
}

function centuryChips(article: (typeof COUSIN_ARTICLES)[number]): string[] {
  const centuries = new Set<string>();
  for (const member of article.members) {
    const year = Number.parseInt(member.year ?? "", 10);
    if (!Number.isFinite(year)) continue;
    centuries.add(`${Math.floor(year / 100) * 100}s`);
  }
  return [...centuries].sort();
}

export function CousinsExplorer() {
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [status, setStatus] = useState<"live" | "soon" | undefined>();

  const genreOptions = useMemo(
    () => genreOptionsFrom(COUSIN_ARTICLES.flatMap((article) => article.genres)),
    [],
  );
  const languages = useMemo(() => languageOptions(), []);
  const showStatus =
    COUSIN_ARTICLES.some((article) => article.status === "live") &&
    COUSIN_ARTICLES.some((article) => article.status === "soon");

  const matches = useMemo(
    () => searchCousins(query, { genre, language, status }),
    [query, genre, language, status],
  );
  const filtering =
    query.trim().length > 0 ||
    Boolean(genre) ||
    Boolean(language) ||
    Boolean(status);

  return (
    <HubSearch
      headingId="cousins-heading"
      heading={
        filtering
          ? `${matches.length} of ${COUSIN_ARTICLES.length}`
          : `${COUSIN_ARTICLES.length} ${
              COUSIN_ARTICLES.length === 1 ? "tune" : "tunes"
            }`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a tune, language, or recording…"
      searchLabel="Search cousin articles"
      controlsId="cousins-grid"
      groups={[
        genreChipGroup(genreOptions, genre, setGenre),
        toggleChipGroup(
          "Language",
          languages,
          language,
          (id) => setLanguage(id),
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
            ? `No tune matches “${query.trim()}”. Try a name or a language.`
            : "No tune matches those filters."
          : undefined
      }
      onClearFilters={
        filtering
          ? () => {
              setQuery("");
              setGenre(undefined);
              setLanguage(undefined);
              setStatus(undefined);
            }
          : undefined
      }
    >
      <div
        id="cousins-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((article) => {
          const soon = article.status === "soon";
          const chips = [
            ...(article.languages ?? []).map(
              (slug) => getLanguage(slug)?.name ?? slug,
            ),
            ...centuryChips(article),
          ];
          return (
            <Link
              key={article.slug}
              href={`/cousins/${article.slug}`}
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
                  <GenrePills
                    slugs={article.genres}
                    compact
                    className="mt-2"
                  />
                  {chips.length > 0 && (
                    <p className="mt-2 font-mono text-xs text-muted-foreground">
                      {chips.join(" · ")}
                    </p>
                  )}
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    {soon ? "Preview" : COUSIN_SONG_LINK}
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
