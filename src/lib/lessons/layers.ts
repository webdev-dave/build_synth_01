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
import { getProgression } from "@/lib/progressions/registry";
import { getGroove, metersOfGrooves } from "@/lib/grooves/registry";
import { formBars, getForm } from "@/lib/forms/registry";
import { formLyricSample } from "@/lib/forms/lyric";
import { parseRootName } from "@/lib/music/scaleParam";
import type { ScaleTypeId } from "@/lib/music/scaleCatalog";
import { getScaleContent } from "@/content/scales";
import { getProgressionContent } from "@/content/progressions";
import { getGrooveContent } from "@/content/grooves";
import { getFormContent } from "@/content/forms";

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
  | {
      kind: "progression";
      slug: string;
      /** Scale that spells the chart's note names (the lesson's overlay scale). */
      patternKey: ScaleTypeId;
      defaultKeyRootPc: number;
      playLabel: string;
    }
  | {
      kind: "groove";
      slug: string;
      playLabel: string;
    }
  | {
      kind: "form";
      slug: string;
      defaultKeyRootPc: number;
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

const harmonyModule: LayerModule = {
  hub: "/progressions",
  noun: "progression",
  slugsOf: (genre) => genre.progressions ?? [],
  resolve: (slug) => {
    const progression = getProgression(slug);
    if (!progression) return undefined;
    // Spell the teaser's chord names with the progression's first scale
    // (the blues scale on the 12-bar), the same way the lesson does.
    const patternKey =
      progression.scales.map((s) => getScale(s)?.patternKey).find(Boolean) ?? "major";
    return {
      href: `/progressions/${progression.slug}`,
      noun: progression.kind === "chord" ? "chord" : "progression",
      name: progression.name,
      question: progression.question,
      answer: progression.answer,
      formula: progression.formula,
      exampleKey: progression.exampleKey,
      exampleNotes: progression.exampleChords,
      hasLesson: Boolean(getProgressionContent(progression.slug)),
      // A single chord has no chart to play; its teaser waits for the chord spokes.
      teaser:
        progression.kind === "progression"
          ? {
              kind: "progression",
              slug: progression.slug,
              patternKey,
              defaultKeyRootPc: parseRootName(progression.exampleKey) ?? 0,
              playLabel: "Play the chart",
            }
          : { kind: "none" },
    };
  },
  ready: (data) => data.teaser.kind !== "none",
};

/** Rhythm and Meter share one registry; the meter panel is derived from the grooves. */
function grooveModule(noun: "groove" | "meter", slugsOf: LayerModule["slugsOf"]): LayerModule {
  return {
    hub: "/rhythm",
    noun,
    slugsOf,
    resolve: (slug) => {
      const groove = getGroove(slug);
      if (!groove) return undefined;
      return {
        href: `/rhythm/${groove.slug}`,
        noun: groove.kind === "meter" ? "meter" : "groove",
        name: groove.name,
        question: groove.question,
        answer: groove.answer,
        formula: groove.formula,
        exampleKey: `${groove.pattern.bpm} BPM`,
        exampleNotes: groove.pattern.cue,
        hasLesson: Boolean(getGrooveContent(groove.slug)),
        teaser: {
          kind: "groove",
          slug: groove.slug,
          playLabel: groove.kind === "meter" ? "Count it" : `Play the ${groove.name.toLowerCase()}`,
        },
      };
    },
    ready: (data) => data.teaser.kind !== "none",
  };
}

const rhythmModule = grooveModule("groove", (genre) => genre.grooves ?? []);
// A genre's meters are exactly the meters its grooves declare — no second list.
const meterModule = grooveModule("meter", (genre) => metersOfGrooves(genre.grooves ?? []));

const formModule: LayerModule = {
  hub: "/forms",
  noun: "form",
  slugsOf: (genre) => genre.forms ?? [],
  resolve: (slug) => {
    const form = getForm(slug);
    if (!form) return undefined;
    // The worked example is the public-domain lyric the map sings from,
    // resolved from the catalog so the panel never retypes a line.
    const sample = formLyricSample(form) ?? form.exampleNotes ?? `${formBars(form)} bars`;
    const progression = form.progression ? getProgression(form.progression) : undefined;
    return {
      href: `/forms/${form.slug}`,
      noun: "form",
      name: form.name,
      question: form.question,
      answer: form.answer,
      formula: form.formula,
      exampleKey: form.exampleKey,
      exampleNotes: sample,
      hasLesson: Boolean(getFormContent(form.slug)),
      // Only a form with a chart under it can put a sounding map on the page.
      teaser: progression
        ? {
            kind: "form",
            slug: form.slug,
            defaultKeyRootPc: parseRootName(progression.exampleKey) ?? 0,
            playLabel: "Play one chorus",
          }
        : { kind: "none" },
    };
  },
  ready: (data) => data.teaser.kind !== "none",
};

export const LAYER_MODULES: Record<GenreLayer, LayerModule | null> = {
  scale: scaleModule,
  harmony: harmonyModule,
  rhythm: rhythmModule,
  meter: meterModule,
  form: formModule,
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
