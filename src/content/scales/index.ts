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
import { DorianLesson } from "./DorianLesson";
import { FreygishLesson } from "./FreygishLesson";
import { HarmonicMinorLesson } from "./HarmonicMinorLesson";
import { LocrianLesson } from "./LocrianLesson";
import { LydianLesson } from "./LydianLesson";
import { MajorPentatonicLesson } from "./MajorPentatonicLesson";
import { MajorScaleLesson } from "./MajorScaleLesson";
import { MelodicMinorLesson } from "./MelodicMinorLesson";
import { MinorPentatonicLesson } from "./MinorPentatonicLesson";
import { MixolydianLesson } from "./MixolydianLesson";
import { NaturalMinorLesson } from "./NaturalMinorLesson";
import { PhrygianLesson } from "./PhrygianLesson";
import { UkrainianDorianLesson } from "./UkrainianDorianLesson";

const SCALE_CONTENT: Record<string, ComponentType> = {
  "major-scale": MajorScaleLesson,
  "natural-minor": NaturalMinorLesson,
  "minor-pentatonic": MinorPentatonicLesson,
  "major-pentatonic": MajorPentatonicLesson,
  dorian: DorianLesson,
  mixolydian: MixolydianLesson,
  phrygian: PhrygianLesson,
  lydian: LydianLesson,
  locrian: LocrianLesson,
  "melodic-minor": MelodicMinorLesson,
  "blues-scale": BluesScaleLesson,
  "harmonic-minor": HarmonicMinorLesson,
  freygish: FreygishLesson,
  "ukrainian-dorian": UkrainianDorianLesson,
};

export function getScaleContent(slug: string): ComponentType | undefined {
  return SCALE_CONTENT[slug];
}
