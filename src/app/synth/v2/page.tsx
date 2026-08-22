import type { Metadata } from "next";
import Link from "next/link";
import { Undo2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SynthV2 } from "@/instruments/synth/v2/SynthV2";

export const metadata: Metadata = {
  title: "Synth v2 (beta) — Web Synthesizer",
  description:
    "A pure Web Audio synthesizer keyboard — oscillators only, no samples. Redesigned beta.",
};

export default function SynthV2Page() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">Synth</h1>
              <Badge variant="secondary">v2 beta</Badge>
            </div>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              A pure Web Audio synthesizer — four primitive waveforms, nothing
              sampled. Pick a scale to see it on the keys, play chords to name
              them.
            </p>
          </div>
          <Link
            href="/synth"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Classic version
          </Link>
        </header>

        <SynthV2 />
      </div>
    </main>
  );
}
