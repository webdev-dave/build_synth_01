import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { APP_NAME } from "@/lib/navigation";
import { Button } from "@/components/ui/button";
import { HomeApps } from "@/components/home/HomeApps";
import { HeroMap } from "@/components/home/HeroMap";
import { StarfieldBackground } from "@/components/home/StarfieldBackground";

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    "A collection of web-based music tools and instruments: a synth keyboard and a diatonic harmonica lab.",
};

export default function Home() {
  /* overflow-x-clip: the hero starfield bleeds to the viewport edges;
     without the clip it would spawn a horizontal scrollbar. */
  return (
    <main className="min-h-[calc(100vh-3rem)] overflow-x-clip bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-10 sm:py-12">
        {/* Hero — floats on a full-width starfield; the map's opaque
            surfaces occlude the stars behind them. */}
        <section className="relative grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
          <StarfieldBackground />
          <div className="relative max-w-xl">
            <p className="mb-3 text-sm font-medium text-muted-foreground">
              {APP_NAME}
            </p>
            {/* Shrinks with viewport height in step with the hero map,
                so short desktop windows scale both halves consistently. */}
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[min(3rem,7svh)]">
              Don&apos;t study theory.
              <br />
              Play with it.
            </h1>
            <p className="mt-4 max-w-[85%] text-base leading-relaxed text-muted-foreground sm:max-w-none">
              The fastest way to understand music is to make some. Play, listen,
              experiment, and watch the theory map itself out.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                asChild
                size="lg"
              >
                <Link href="/synth/v2">
                  Open the Synth
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
              >
                <Link href="/harmonica-lab/v2">Explore Harmonica Lab</Link>
              </Button>
            </div>
          </div>

          {/* Animated node-graph */}
          <div className="relative flex justify-center lg:justify-end">
            <HeroMap />
          </div>
        </section>

        {/* Tools */}
        <section className="mt-20">
          <h2 className="mb-5 text-sm font-medium text-muted-foreground">
            All tools
          </h2>
          <HomeApps />
        </section>
      </div>
    </main>
  );
}
