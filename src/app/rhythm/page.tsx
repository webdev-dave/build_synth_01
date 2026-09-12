import type { Metadata } from "next";

import { getAppIcon } from "@/lib/appIcons";
import { GroovesExplorer } from "@/components/grooves/GroovesExplorer";

export const metadata: Metadata = {
  title: "Rhythm & Meter — Grooves You Can Play, Bars You Can Count",
  description:
    "How beats are grouped and how drums lean on them: the shuffle, the backbeat, the slow blues in 12/8, 4/4 and compound meters — each with a step grid that sounds every hit, a swing slider, a count-along, and movable bar lines.",
  alternates: { canonical: "/rhythm" },
  keywords: [
    "shuffle rhythm explained",
    "what is a backbeat",
    "12/8 time signature",
    "4/4 time signature",
    "drum groove examples",
    "what is a time signature",
  ],
};

export default function RhythmPage() {
  const Icon = getAppIcon("rhythm");
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <header className="mb-8">
          <div className="flex items-center gap-2.5">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Rhythm &amp; meter</h1>
          </div>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            A meter is how a bar groups its beats; a groove is where the drums
            put their weight inside it. Each page here takes one groove or one
            meter, lays it out on a <strong>step grid that sounds every hit</strong>,
            and lets you count along, slide from straight to shuffle, mute a
            voice, or move the bar lines — the blues shuffle, the rock backbeat,
            the slow 12/8, and the 4/4 they all live in.
          </p>
        </header>

        <GroovesExplorer />
      </div>
    </main>
  );
}
