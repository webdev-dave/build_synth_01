import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Hammer } from "lucide-react";

import { LESSONS, getLesson } from "@/lib/lessons/registry";
import { Badge } from "@/components/ui/badge";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return {
    title: lesson ? `${lesson.title} — Lesson (coming soon)` : "Lesson",
    description: lesson?.summary,
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Link
          href="/lessons"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All lessons
        </Link>

        <header className="mt-6">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-semibold tracking-tight">
              {lesson.title}
            </h1>
            <Badge variant="secondary">Coming soon</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {lesson.summary}
          </p>
        </header>

        <div className="mt-8 rounded-lg border border-dashed p-6 text-center">
          <Hammer
            className="mx-auto h-5 w-5 text-muted-foreground"
            strokeWidth={1.75}
          />
          <p className="mt-3 text-sm text-muted-foreground">
            This lesson is being written. It will be a short interactive walk
            through the concept — playable examples, not just prose.
          </p>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">
          Until then, the best way to build intuition is to play:
        </p>
        <Link
          href={lesson.tryHref ?? "/synth/v2"}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {lesson.tryLabel ?? "Open the synth"}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
