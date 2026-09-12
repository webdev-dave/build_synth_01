/**
 * Form lesson content — maps a registry slug to its interactive lesson
 * component. Kept separate from src/lib/forms/registry.ts so the registry
 * (imported by the sitemap and metadata) never pulls in client components.
 *
 * A slug with no entry here renders the page's "being built" placeholder.
 * Flipping a form's registry status to "live" should come with an entry
 * in this map — a "live" page with no lesson is just prose.
 */
import type { ComponentType } from "react";

import { TwelveBarFormLesson } from "./TwelveBarFormLesson";
import { VerseChorusLesson } from "./VerseChorusLesson";

const FORM_CONTENT: Record<string, ComponentType> = {
  "twelve-bar-blues": TwelveBarFormLesson,
  "verse-chorus": VerseChorusLesson,
};

export function getFormContent(slug: string): ComponentType | undefined {
  return FORM_CONTENT[slug];
}
