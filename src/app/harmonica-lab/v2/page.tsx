import type { Metadata } from "next";
import Link from "next/link";
import { Undo2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HarmonicaLabV2 } from "@/components/harmonica/v2/HarmonicaLabV2";

export const metadata: Metadata = {
  title: "Harmonica Lab v2 (beta) — Position Guide & Theory",
  description:
    "Redesigned interactive position guide for 10-hole diatonic harmonica: 5 positions, bends, blues scale, and the full harp matrix.",
};

export default function HarmonicaLabV2Page() {
  return (
    <main className="min-h-[calc(100vh-3rem)] bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight">
                Harmonica Lab
              </h1>
              <Badge variant="secondary">v2 beta</Badge>
            </div>
            <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
              Pick a key, pick a position, and see exactly where every note
              lives on a 10-hole diatonic harp — bends, blue notes, and all.
            </p>
          </div>
          <Link
            href="/harmonica-lab"
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Undo2 className="h-3.5 w-3.5" />
            Classic version
          </Link>
        </header>

        <HarmonicaLabV2 />
      </div>
    </main>
  );
}
