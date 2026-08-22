import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, GraduationCap } from "lucide-react";

import { LESSONS } from "@/lib/lessons/registry";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Lessons — Music Theory, Played",
  description:
    "Interactive music-theory lessons: scales, chords, waveforms, and more. Coming soon.",
};

export default function LessonsPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <GraduationCap className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Lessons</h1>
          </div>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Short interactive lessons where you hear and play every concept
            instead of reading about it. They&apos;re being written now — here
            is what&apos;s on the way.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LESSONS.map((lesson) => (
            <Link
              key={lesson.slug}
              href={`/lessons/${lesson.slug}`}
              className="group block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Card className="h-full transition-colors group-hover:border-foreground/25 group-hover:bg-accent/40">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                    <Badge variant="secondary">Soon</Badge>
                  </div>
                  <CardDescription>{lesson.summary}</CardDescription>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
                    Preview
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
