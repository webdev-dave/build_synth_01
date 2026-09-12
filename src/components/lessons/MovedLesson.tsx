"use client";

/**
 * A lesson slug that now lives elsewhere. The site is a static export, so
 * there is no server to answer 308 — instead the page carries its own
 * redirect three ways: a `<meta http-equiv="refresh">` (React hoists it
 * into <head>) for browsers without JS and for crawlers, a router
 * `replace` the moment we hydrate, and a plain link in case both are
 * slow. Old links from the synth's learning panel keep working.
 */
import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface MovedLessonProps {
  title: string;
  to: string;
}

/** Which module a path belongs to, by its first segment. */
const MODULE_BY_SEGMENT: Record<string, string> = {
  scales: "Scales",
  progressions: "Chords & Progressions",
  rhythm: "Rhythm",
  forms: "Forms",
  genres: "Genres",
  concepts: "Glossary",
};

/** Short module name for a path ("Scales"), or null when it isn't a module. */
export function moduleNameFor(to: string): string | null {
  const segment = to.split("/").filter(Boolean)[0] ?? "";
  return MODULE_BY_SEGMENT[segment] ?? null;
}

export function moduleLabelFor(to: string): string {
  const name = moduleNameFor(to);
  return name ? `the ${name} module` : "another page";
}

export function MovedLesson({ title, to }: MovedLessonProps) {
  const router = useRouter();
  useEffect(() => {
    router.replace(to);
  }, [router, to]);

  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{title}</span> now lives
          in {moduleLabelFor(to)}.
        </p>
        <Link
          href={to}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          Continue
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </main>
  );
}
