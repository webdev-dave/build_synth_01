import type { Metadata } from "next";

import { getAppIcon } from "@/lib/appIcons";
import { LessonsIndex } from "@/components/lessons/LessonsIndex";

export const metadata: Metadata = {
  title: "Lessons — Music Theory, Played",
  description:
    "The Instrumaps curriculum: concepts, scales and modes, chords and progressions, rhythm and meter, song forms — then the genres that stack them and the history behind the sound. Every lesson is something you hear and play, not just read.",
  alternates: { canonical: "/lessons" },
  keywords: [
    "interactive music theory lessons",
    "learn music theory by playing",
    "music theory curriculum",
    "scales chords rhythm form lessons",
  ],
};

export default function LessonsPage() {
  const Icon = getAppIcon("lessons");
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Lessons</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Don&apos;t study theory — play with it. The lessons are grouped the
            way music is built: first the words, then the <strong>notes</strong>,
            the <strong>chords</strong>, the <strong>groove</strong>, and the{" "}
            <strong>shape</strong> of a song — then the genres that stack all of
            those, and where each sound came from. Start anywhere; every page
            links sideways to the layers it leans on.
          </p>
        </header>

        <LessonsIndex />
      </div>
    </main>
  );
}
