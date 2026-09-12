import type { Metadata } from "next";

import { getAppIcon } from "@/lib/appIcons";
import { ProgressionsExplorer } from "@/components/progressions/ProgressionsExplorer";

export const metadata: Metadata = {
  title: "Chords & Progressions — Heard, Seen, and Played",
  description:
    "How chords are built and how they move: the 12-bar blues, I–IV–V, ii–V–I, the four-chord loop, the Andalusian cadence, dominant sevenths and power chords — each with its chart, its chords in a real key, and a player that sounds every bar.",
  alternates: { canonical: "/progressions" },
  keywords: [
    "chord progressions explained",
    "12 bar blues chords",
    "I IV V progression",
    "chord progression examples",
    "what is a chord progression",
    "roman numeral chords",
  ],
};

export default function ProgressionsPage() {
  const Icon = getAppIcon("progressions");
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">
              Chords &amp; progressions
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A chord is a few scale notes sounded together; a progression is the
            path those chords take through the bars. Each page here takes one
            chord or one progression, shows you the{" "}
            <strong>chart and the chords in a real key</strong>, and plays it
            bar by bar — the 12-bar blues&apos; loop, the pull of a dominant
            seventh, the three chords that cover a whole key.
          </p>
        </header>

        <ProgressionsExplorer />
      </div>
    </main>
  );
}
