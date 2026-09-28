/**
 * Derived facts for the `/lessons` index: how many pages each bucket has,
 * the title of its "start here" page, and which genre layers each bucket
 * teaches. All of it comes from the module registries and `LAYER_MODULES`,
 * never typed by hand — a new scale or a new module row shows up here on
 * its own.
 *
 * Server-side: `layers.ts` pulls in the content maps.
 */

import { LESSON_BUCKETS, type LessonBucket } from "@/lib/lessons/registry";
import { LAYER_MODULES } from "@/lib/lessons/layers";
import {
  GENRES,
  LAYER_INFO,
  LAYER_PAGE_ORDER,
  getGenre,
  type GenreLayer,
} from "@/lib/genres/registry";
import {
  GLOSSARY_CONCEPTS,
  conceptQuestion,
  getConcept,
} from "@/lib/concepts/registry";
import { SCALES, getScale } from "@/lib/scales/registry";
import { PROGRESSIONS, getProgression } from "@/lib/progressions/registry";
import { GROOVES, getGroove } from "@/lib/grooves/registry";
import { FORMS, getForm } from "@/lib/forms/registry";
import { HISTORY_ARTICLES, getArticle } from "@/lib/history/registry";

interface Module {
  rows: ReadonlyArray<{ status: "live" | "soon" }>;
  /** The page question for a slug, or undefined if the slug is unknown. */
  question: (slug: string) => string | undefined;
}

const MODULES: Record<LessonBucket["id"], Module> = {
  concepts: {
    rows: GLOSSARY_CONCEPTS,
    question: (slug) => {
      const c = getConcept(slug);
      return c && conceptQuestion(c);
    },
  },
  scales: { rows: SCALES, question: (slug) => getScale(slug)?.question },
  progressions: {
    rows: PROGRESSIONS,
    question: (slug) => getProgression(slug)?.question,
  },
  rhythm: { rows: GROOVES, question: (slug) => getGroove(slug)?.question },
  forms: { rows: FORMS, question: (slug) => getForm(slug)?.question },
  genres: { rows: GENRES, question: (slug) => getGenre(slug)?.question },
  history: {
    rows: HISTORY_ARTICLES,
    question: (slug) => getArticle(slug)?.question,
  },
};

export interface BucketCount {
  live: number;
  total: number;
}

export function bucketCount(bucket: LessonBucket): BucketCount {
  const rows = MODULES[bucket.id].rows;
  return {
    live: rows.filter((r) => r.status === "live").length,
    total: rows.length,
  };
}

/** The "start here" page's own question, looked up in its registry. */
export function startHereLabel(bucket: LessonBucket): string {
  const slug = bucket.startHere.split("/").filter(Boolean)[1] ?? "";
  const label = MODULES[bucket.id].question(slug);
  if (!label) {
    throw new Error(
      `LESSON_BUCKETS.${bucket.id}.startHere points at an unknown page: ${bucket.startHere}`,
    );
  }
  return label;
}

export interface LayerRow {
  layer: GenreLayer;
  label: string;
  blurb: string;
  /** The bucket that teaches it, or undefined while the layer has no module. */
  bucket?: LessonBucket;
}

/** The genre-page stack, each layer pointing at the bucket that teaches it. */
export function layerRows(): LayerRow[] {
  return LAYER_PAGE_ORDER.map((layer) => {
    const hub = LAYER_MODULES[layer]?.hub;
    return {
      layer,
      label: LAYER_INFO[layer].label,
      blurb: LAYER_INFO[layer].blurb,
      bucket: hub ? LESSON_BUCKETS.find((b) => b.href === hub) : undefined,
    };
  });
}
