"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";

import type { LayerPanelData, LayerTeaser } from "@/lib/lessons/layers";
import { degreesOf } from "@/lib/music/scaleCatalog";
import { ScaleTeaser } from "@/components/scales/ScaleTeaser";

/**
 * The genre page's short take on one layer. The genre page is about how the
 * music *uses* the layer; the module spoke is where it is taught from zero.
 * So the door to the full lesson comes first — before the reader starts
 * reading or playing here — and the widget below stays short: the answer,
 * the formula, and one playable teaser.
 *
 * Server-safe data in, one teaser out. The panel knows nothing about audio;
 * each module's teaser wraps its own provider.
 */
export function LayerPanel({ data }: { data: LayerPanelData }) {
  return (
    <div>
      <Link
        href={data.href}
        className="group flex items-center justify-between gap-3 rounded-md border bg-background p-3 transition-colors hover:border-foreground/25 hover:bg-accent/40"
      >
        <span className="flex min-w-0 items-start gap-2.5">
          <BookOpen
            className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
            strokeWidth={1.75}
            aria-hidden
          />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground">
              {data.hasLesson ? "View the full lesson" : `About this ${data.noun}`}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {data.hasLesson
                ? `${data.question} Taught from zero, every idea playable.`
                : data.question}
            </span>
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>

      <p className="mt-4 text-sm leading-relaxed text-foreground">{data.answer}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {data.formula}
        <span className="text-muted-foreground/80">
          {" "}
          · in {data.exampleKey}: {data.exampleNotes}
        </span>
      </p>
      <Teaser teaser={data.teaser} />
      {data.related.length > 0 && (
        <div className="mt-4 flex flex-col items-start gap-2">
          <p className="text-xs text-muted-foreground">Also heard here</p>
          {data.related.map((other) => (
            <Link
              key={other.href}
              href={other.href}
              className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {other.question}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Teaser({ teaser }: { teaser: LayerTeaser }) {
  switch (teaser.kind) {
    case "scale":
      return (
        <ScaleTeaser
          className="mt-4"
          degrees={degreesOf(teaser.patternKey)}
          defaultRootPc={teaser.defaultRootPc}
          playLabel={teaser.playLabel}
        />
      );
    case "none":
      return null;
  }
}
