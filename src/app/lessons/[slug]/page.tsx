import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LESSONS, getLesson } from "@/lib/lessons/registry";
import { MovedLesson } from "@/components/lessons/MovedLesson";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

/**
 * Legacy `/lessons/<slug>` URLs. Every lesson now lives in a module, so each
 * of these renders a moved notice and sends the reader on. Old links from
 * the synth's learning panel and old sitemaps keep working.
 */
export function generateStaticParams() {
  return LESSONS.map((lesson) => ({ slug: lesson.slug }));
}

export async function generateMetadata({
  params,
}: LessonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const lesson = getLesson(slug);
  return {
    title: lesson ? `${lesson.title} — moved` : "Lesson",
    description: lesson?.summary,
    robots: { index: false, follow: true },
  };
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  // Static export has no server redirects; `permanentRedirect` would only
  // reach the client router (empty HTML, no fallback), so the moved page
  // carries its own meta refresh + link.
  return <MovedLesson title={lesson.title} to={lesson.movedTo} />;
}
