/**
 * Concept demo content — maps a concepts-registry slug to its interactive
 * widget. Kept separate from src/lib/concepts/registry.ts so the registry
 * (imported by the sitemap and metadata) never pulls in client components.
 *
 * Most concepts are prose-only (micro + definition); a slug appears here only
 * when it has something worth *playing* — e.g. "steps" carries a v2 piano.
 */
import type { ComponentType } from "react";

import { StepsDemo } from "./StepsDemo";

const CONCEPT_CONTENT: Record<string, ComponentType> = {
  steps: StepsDemo,
};

export function getConceptContent(slug: string): ComponentType | undefined {
  return CONCEPT_CONTENT[slug];
}
