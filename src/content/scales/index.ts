/**
 * Scale lesson content — maps a registry slug to its interactive lesson
 * component. Kept separate from src/lib/scales/registry.ts so the registry
 * (imported by the sitemap and metadata) never pulls in client components.
 *
 * A slug with no entry here renders the page's "being built" placeholder.
 * Flipping a scale's registry status to "live" should come with (or follow)
 * an entry in this map — a "live" page with no lesson is just prose.
 */
import type { ComponentType } from "react";

import { BluesScaleLesson } from "./BluesScaleLesson";
import { FreygishLesson } from "./FreygishLesson";
import { HarmonicMinorLesson } from "./HarmonicMinorLesson";
import { MajorScaleLesson } from "./MajorScaleLesson";
import { MinorPentatonicLesson } from "./MinorPentatonicLesson";
import { MixolydianLesson } from "./MixolydianLesson";
import { PhrygianLesson } from "./PhrygianLesson";
import { UkrainianDorianLesson } from "./UkrainianDorianLesson";

const SCALE_CONTENT: Record<string, ComponentType> = {
  "major-scale": MajorScaleLesson,
  "minor-pentatonic": MinorPentatonicLesson,
  mixolydian: MixolydianLesson,
  phrygian: PhrygianLesson,
  "blues-scale": BluesScaleLesson,
  "harmonic-minor": HarmonicMinorLesson,
  freygish: FreygishLesson,
  "ukrainian-dorian": UkrainianDorianLesson,
};

export function getScaleContent(slug: string): ComponentType | undefined {
  return SCALE_CONTENT[slug];
}
