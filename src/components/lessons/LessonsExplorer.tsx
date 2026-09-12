"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { LESSONS, searchLessons } from "@/lib/lessons/registry";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HubSearch } from "@/components/content/HubSearch";

export function LessonsExplorer() {
  const [query, setQuery] = useState("");
  const matches = useMemo(() => searchLessons(query), [query]);
  const filtering = query.trim().length > 0;

  return (
    <HubSearch
      headingId="lessons-heading"
      heading={
        filtering
          ? `${matches.length} of ${LESSONS.length}`
          : `${LESSONS.length} ${LESSONS.length === 1 ? "lesson" : "lessons"}`
      }
      query={query}
      onQueryChange={setQuery}
      placeholder="Search a lesson…"
      searchLabel="Search lessons"
      controlsId="lessons-grid"
      empty={
        matches.length === 0
          ? `No lesson matches “${query.trim()}”. Try a title or an idea — scales, chords, waveforms.`
          : undefined
      }
      onClearFilters={filtering ? () => setQuery("") : undefined}
    >
      <div
        id="lessons-grid"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {matches.map((lesson) => (
          <Link
            key={lesson.slug}
            href={lesson.movedTo ?? `/lessons/${lesson.slug}`}
            className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base">{lesson.title}</CardTitle>
                  {lesson.movedTo ? (
                    <Badge variant="outline">In Scales</Badge>
                  ) : (
                    <Badge variant="secondary">Soon</Badge>
                  )}
                </div>
                <CardDescription>{lesson.summary}</CardDescription>
                <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                  {lesson.movedTo ? "Open" : "Preview"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </HubSearch>
  );
}
