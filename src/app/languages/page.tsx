import type { Metadata } from "next";
import { Languages } from "lucide-react";

import { LanguagesExplorer } from "@/components/languages/LanguagesExplorer";

export const metadata: Metadata = {
  title: "Languages — Browse Music by the Language It Speaks",
  description:
    "Explore the app by language. Every genre, scale, concept, artist, song, and word that lives in Yiddish, Hebrew, or Romanian, gathered in one place — a lens onto a tradition from the language itself.",
  alternates: { canonical: "/languages" },
  keywords: [
    "music by language",
    "yiddish music",
    "hebrew music",
    "romanian music",
    "browse songs by language",
  ],
};

export default function LanguagesPage() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Languages className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Languages</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A tradition is easiest to enter through the language it speaks.
            Pick a language and see everything the app teaches that lives in
            it — the <strong>genres and scales</strong>, the{" "}
            <strong>concepts</strong>, the <strong>history and artists</strong>,
            the <strong>songs</strong> you can hear and open, and the{" "}
            <strong>words</strong> with their home spellings — all in one place.
          </p>
        </header>

        <LanguagesExplorer />
      </div>
    </main>
  );
}
