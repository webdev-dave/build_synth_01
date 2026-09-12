/**
 * Which lesson module teaches which genre layer.
 *
 * A genre page is an accordion of layers (scale, harmony, rhythm, meter,
 * form, texture). Each layer that has a module opens into a panel: a door
 * to the full lesson, the short answer, a mono formula line, a playable
 * teaser, and "also heard here" links. This file is the one place that
 * says where each layer's lessons live and how to resolve a genre's slugs
 * into panel data — `GenreLayers` reads it instead of hard-coding "scale".
 *
 * Adding a module = one row here plus the genre registry's slug array.
 * A layer with `null` has no module yet and keeps its "Coming soon" pill.
 *
 * Server-side only: it imports the content maps (to know whether a spoke
 * has a real lesson), which pull in lesson components. The client accordion
 * receives the resolved, serialisable `LayerPanelData`.
 */

import type { Genre, GenreLayer } from "@/lib/genres/registry";
import { getScale } from "@/lib/scales/registry";
import { parseRootName } from "@/lib/music/scaleParam";
import type { ScaleTypeId } from "@/lib/music/scaleCatalog";
import { getScaleContent } from "@/content/scales";

/**
 * What the panel's teaser widget needs, per layer. A discriminated union so
 * the client `LayerPanel` can pick the right client component without the
 * server passing components across the boundary.
 */
export type LayerTeaser =
  | {
      kind: "scale";
      patternKey: ScaleTypeId;
      defaultRootPc: number;
      playLabel: string;
    }
  | { kind: "none" };

export interface LayerPanelData {
  layer: GenreLayer;
  /** `/scales/blues-scale` — the door. */
  href: string;
  /** "scale" — for "About this scale" when there is no full lesson yet. */
  noun: string;
  name: string;
  question: string;
  answer: string;
  /** Crawlable formula ("1 – ♭3 – 4 – ♭5 – 5 – ♭7", "I7 · I7 · …"). */
  formula: string;
  /** Worked example: key + notes/chords in it. */
  exampleKey: string;
  exampleNotes: string;
  /** True when the spoke has an interactive lesson, not a placeholder. */
  hasLesson: boolean;
  teaser: LayerTeaser;
  /** The genre's other slugs in this layer — "Also heard here". */
  related: { href: string; question: string }[];
}

interface LayerModule {
  hub: string;
  noun: string;
  /** Slugs for this layer on a genre — a registry field, or derived. */
  slugsOf: (genre: Genre) => string[];
  /** Resolve one slug to panel data (without `related`), or undefined. */
  resolve: (slug: string) => Omit<LayerPanelData, "layer" | "related"> | undefined;
  /** Whether the resolved entry can put a playable widget on the page. */
  ready: (data: Omit<LayerPanelData, "layer" | "related">) => boolean;
}

const scaleModule: LayerModule = {
  hub: "/scales",
  noun: "scale",
  slugsOf: (genre) => genre.scales,
  resolve: (slug) => {
    const scale = getScale(slug);
    if (!scale) return undefined;
    return {
      href: `/scales/${scale.slug}`,
      noun: "scale",
      name: scale.name,
      question: scale.question,
      answer: scale.answer,
      formula: scale.formula,
      exampleKey: scale.exampleKey,
      exampleNotes: scale.exampleNotes,
      hasLesson: Boolean(getScaleContent(scale.slug)),
      teaser: scale.patternKey
        ? {
            kind: "scale",
            patternKey: scale.patternKey,
            // The registry's worked example is also the classroom key the
            // teaser opens on, so the notes printed above match the piano.
            defaultRootPc: parseRootName(scale.exampleKey) ?? 0,
            playLabel: `Play the ${scale.name.toLowerCase()}`,
          }
        : { kind: "none" },
    };
  },
  ready: (data) => data.teaser.kind !== "none",
};

export const LAYER_MODULES: Record<GenreLayer, LayerModule | null> = {
  scale: scaleModule,
  harmony: null,
  rhythm: null,
  meter: null,
  form: null,
  texture: null,
};

/**
 * Panel data for one layer of a genre, or undefined when the layer has no
 * module, the genre lists nothing for it, or the first entry can't put a
 * widget on the page. "Ready" is honest by construction: a panel opens
 * only when something real can play inside it.
 */
export function resolveLayerPanel(
  genre: Genre,
  layer: GenreLayer,
): LayerPanelData | undefined {
  const mod = LAYER_MODULES[layer];
  if (!mod) return undefined;
  const slugs = mod.slugsOf(genre);
  const resolved = slugs
    .map((slug) => ({ slug, data: mod.resolve(slug) }))
    .filter((r): r is { slug: string; data: NonNullable<typeof r.data> } =>
      Boolean(r.data),
    );
  const signature = resolved[0];
  if (!signature || !mod.ready(signature.data)) return undefined;
  return {
    layer,
    ...signature.data,
    related: resolved
      .slice(1)
      .map((r) => ({ href: r.data.href, question: r.data.question })),
  };
}

/** Every layer the genre claims that has a working panel today. */
export function resolveLayerPanels(
  genre: Genre,
): Partial<Record<GenreLayer, LayerPanelData>> {
  const out: Partial<Record<GenreLayer, LayerPanelData>> = {};
  for (const layer of genre.signatureLayers) {
    const panel = resolveLayerPanel(genre, layer);
    if (panel) out[layer] = panel;
  }
  return out;
}
