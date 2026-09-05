import type { Metadata } from "next";
import { GraduationCap } from "lucide-react";

import { LessonsExplorer } from "@/components/lessons/LessonsExplorer";

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

        <LessonsExplorer />
      </div>
    </main>
  );
}
