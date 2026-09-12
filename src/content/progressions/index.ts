/**
 * Progression lesson content — maps a registry slug to its interactive
 * lesson component. Kept separate from src/lib/progressions/registry.ts so
 * the registry (imported by the sitemap and metadata) never pulls in client
 * components.
 *
 * A slug with no entry here renders the page's "being built" placeholder.
 * Flipping a progression's registry status to "live" should come with an
 * entry in this map — a "live" page with no lesson is just prose.
 */
import type { ComponentType } from "react";

const PROGRESSION_CONTENT: Record<string, ComponentType> = {};

export function getProgressionContent(slug: string): ComponentType | undefined {
  return PROGRESSION_CONTENT[slug];
}
