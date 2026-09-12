"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  LAYER_INFO,
  orderLayersForPage,
  type GenreLayer,
} from "@/lib/genres/registry";
import type { LayerPanelData } from "@/lib/lessons/layers";
import { LayerPanel } from "./LayerPanel";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GenreLayersProps {
  layers: GenreLayer[];
  /** Resolved panel data per layer that has a module and a playable entry. */
  panels: Partial<Record<GenreLayer, LayerPanelData>>;
  /** Layer open on first paint. Blues opens Scale so the piano is waiting. */
  defaultOpen?: GenreLayer | null;
}

/**
 * Accordion of the layers that make a genre sound like itself. One panel
 * open at a time so a playable widget has the stage. Layers without a
 * module (or without a playable entry) stay closed and wear a Coming soon
 * pill. Every page reads the same way: scale, harmony, rhythm, then form.
 */
export function GenreLayers({
  layers,
  panels,
  defaultOpen = null,
}: GenreLayersProps) {
  const ordered = orderLayersForPage(layers);
  const layerReady = (layer: GenreLayer) => Boolean(panels[layer]);
  const [open, setOpen] = useState<GenreLayer | null>(
    defaultOpen && layerReady(defaultOpen) ? defaultOpen : null,
  );

  return (
    <ol className="mt-3 space-y-2">
      {ordered.map((layer, i) => {
        const panel = panels[layer];
        const ready = Boolean(panel);
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
            {panel && isOpen && (
              <div
                id={panelId}
                className="border-t px-3 pb-3 pt-3 sm:px-4"
              >
                <LayerPanel data={panel} />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
