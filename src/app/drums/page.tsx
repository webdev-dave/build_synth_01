import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { getAppIcon } from "@/lib/appIcons";
import { DrumMachine } from "@/instruments/drums/templates/basic-drums/DrumMachine";

export const metadata: Metadata = {
  title: "Drum Machine — Step Sequencer with a Swing Slider",
  description:
    "A synthesized drum machine in the browser: pick a groove from the library (shuffle, backbeat, slow blues), edit hits on a step grid drawn at its real time, slide from straight to shuffle, mute voices, and hear every hit you see.",
  alternates: { canonical: "/drums" },
  keywords: ["online drum machine", "step sequencer", "shuffle swing slider", "drum pattern editor"],
};

export default function DrumsPage() {
  const Icon = getAppIcon("drum-machine");
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <header className="mb-6">
          <div className="flex items-center gap-2.5">
            <Icon className="h-6 w-6" strokeWidth={1.75} />
            <h1 className="text-2xl font-semibold tracking-tight">Drum machine</h1>
            <Badge variant="secondary">Beta</Badge>
          </div>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
            The same kit and grid the rhythm lessons use, with nothing to read.
            Pick a pattern, tap hits in, and slide the feel from straight to
            shuffle — the dots move to where the hits actually land.
          </p>
        </header>

        {/* Lessons deep-link here as /drums?pattern=shuffle; the machine
            reads that itself after mount (static export, no Suspense needed). */}
        <DrumMachine readPatternFromUrl />
      </div>
    </main>
  );
}
