"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";

import {
  LAYER_INFO,
  orderLayersForPage,
  type GenreLayer,
} from "@/lib/genres/registry";
import { degreesOf, type ScaleTypeId } from "@/lib/music/scaleCatalog";
import { ScaleTeaser } from "@/components/scales/ScaleTeaser";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface GenreLayerScale {
  slug: string;
  name: string;
  question: string;
  answer: string;
  formula: string;
  exampleKey: string;
  exampleNotes: string;
  /** Catalog id — present means the layer can put a playable piano on the page. */
  patternKey?: ScaleTypeId;
  /** Pitch class of `exampleKey`, the root the teaser opens on. */
  defaultRootPc: number;
  /** True when /scales/<slug> has a real interactive lesson, not a placeholder. */
  hasLesson: boolean;
}

interface GenreLayersProps {
  layers: GenreLayer[];
  scales: GenreLayerScale[];
  /** Layer open on first paint. Blues opens Scale so the piano is waiting. */
  defaultOpen?: GenreLayer | null;
}

/**
 * Accordion of the layers that make a genre sound like itself. One panel
 * open at a time so a playable widget (the scale piano) has the stage.
 * Layers without a widget stay closed and wear a Coming soon pill.
 * Every page reads the same way: scale, harmony, rhythm, then form.
 */
export function GenreLayers({
  layers,
  scales,
  defaultOpen = null,
}: GenreLayersProps) {
  const ordered = orderLayersForPage(layers);
  const signatureScale = scales[0];
  const layerReady = (layer: GenreLayer) =>
    layer === "scale" && Boolean(signatureScale?.patternKey);
  const [open, setOpen] = useState<GenreLayer | null>(
    defaultOpen && layerReady(defaultOpen) ? defaultOpen : null,
  );

  return (
    <ol className="mt-3 space-y-2">
      {ordered.map((layer, i) => {
        const ready = layerReady(layer);
        const isOpen = ready && open === layer;
        const panelId = `genre-layer-${layer}`;
        const header = (
          <>
            <span className="font-mono text-xs text-muted-foreground">
              {i + 1}
            </span>
            <span className="min-w-0 flex-1">
              <span className="font-mono text-xs uppercase tracking-wide text-foreground">
                {LAYER_INFO[layer].label}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {LAYER_INFO[layer].blurb}
              </span>
            </span>
            {ready ? (
              <ChevronDown
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                  isOpen && "rotate-180",
                )}
                aria-hidden
              />
            ) : (
              <Badge variant="secondary" className="mt-0.5 shrink-0">
                Coming soon
              </Badge>
            )}
          </>
        );
        return (
          <li key={layer} className="overflow-hidden rounded-md border bg-muted/20">
            {ready ? (
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : layer)}
                className="flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-accent/40"
              >
                {header}
              </button>
            ) : (
              <div className="flex w-full items-start gap-3 p-3">
                {header}
              </div>
            )}
            {ready && isOpen && signatureScale?.patternKey && (
              <div
                id={panelId}
                className="border-t px-3 pb-3 pt-3 sm:px-4"
              >
                <ScaleLayerPanel
                  scale={signatureScale}
                  patternKey={signatureScale.patternKey}
                  related={scales.slice(1)}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * The genre page's short take on its signature scale. The genre page is
 * about how the music *uses* the scale; /scales/<slug> is where the scale is
 * taught from zero. So the door to the full lesson comes first — before the
 * reader starts reading or playing here — and the widget below stays short:
 * the notes, and a piano locked to them.
 */
function ScaleLayerPanel({
  scale,
  patternKey,
  related,
}: {
  scale: GenreLayerScale;
  patternKey: ScaleTypeId;
  related: GenreLayerScale[];
}) {
  const href = `/scales/${scale.slug}`;
  return (
    <div>
      <Link
        href={href}
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
              {scale.hasLesson ? "View the full lesson" : "About this scale"}
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              {scale.hasLesson
                ? `${scale.question} Taught from zero, every idea playable.`
                : scale.question}
            </span>
          </span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>

      <p className="mt-4 text-sm leading-relaxed text-foreground">{scale.answer}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {scale.formula}
        <span className="text-muted-foreground/80">
          {" "}
          · in {scale.exampleKey}: {scale.exampleNotes}
        </span>
      </p>
      <ScaleTeaser
        className="mt-4"
        degrees={degreesOf(patternKey)}
        defaultRootPc={scale.defaultRootPc}
        playLabel={`Play the ${scale.name.toLowerCase()}`}
      />
      {related.length > 0 && (
        <div className="mt-4 flex flex-col items-start gap-2">
          <p className="text-xs text-muted-foreground">Also heard here</p>
          {related.map((other) => (
          <Link
            key={other.slug}
            href={`/scales/${other.slug}`}
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
