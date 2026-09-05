"use client";

import { useState, type ComponentType } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

import { LAYER_INFO, type GenreLayer } from "@/lib/genres/registry";
import { getScaleContent } from "@/content/scales";
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
 * Scale always leads the list — it's the layer we can play today.
 */
function layersWithScaleFirst(layers: GenreLayer[]): GenreLayer[] {
  const scale = layers.filter((layer) => layer === "scale");
  const rest = layers.filter((layer) => layer !== "scale");
  return [...scale, ...rest];
}

export function GenreLayers({
  layers,
  scales,
  defaultOpen = null,
}: GenreLayersProps) {
  const ordered = layersWithScaleFirst(layers);
  const signatureScale = scales[0];
  const Lesson = signatureScale
    ? getScaleContent(signatureScale.slug)
    : undefined;
  const layerReady = (layer: GenreLayer) =>
    layer === "scale" && Boolean(signatureScale && Lesson);
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
            {ready && isOpen && signatureScale && Lesson && (
              <div
                id={panelId}
                className="border-t px-3 pb-3 pt-3 sm:px-4"
              >
                <ScaleLayerPanel
                  scale={signatureScale}
                  related={scales.slice(1)}
                  Lesson={Lesson}
                />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function ScaleLayerPanel({
  scale,
  related,
  Lesson,
}: {
  scale: GenreLayerScale;
  related: GenreLayerScale[];
  Lesson: ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-foreground">{scale.answer}</p>
      <p className="mt-2 font-mono text-xs text-muted-foreground">
        {scale.formula}
        <span className="text-muted-foreground/80">
          {" "}
          · in {scale.exampleKey}: {scale.exampleNotes}
        </span>
      </p>
      <Lesson className="mt-4" />
      <div className="mt-4 flex flex-col items-start gap-2">
        <Link
          href={`/scales/${scale.slug}`}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-foreground underline-offset-4 hover:underline"
        >
          {scale.question}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
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
    </div>
  );
}
