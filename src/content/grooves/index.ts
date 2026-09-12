/**
 * Groove & meter lesson content — maps a registry slug to its interactive
 * lesson component. Kept separate from src/lib/grooves/registry.ts so the
 * registry (imported by the sitemap and metadata) never pulls in client
 * components.
 *
 * A slug with no entry here renders the page's "being built" placeholder.
 * Flipping a groove's registry status to "live" should come with an entry
 * in this map — a "live" page with no lesson is just prose.
 */
import type { ComponentType } from "react";

import { BackbeatLesson } from "./BackbeatLesson";
import { FourFourLesson } from "./FourFourLesson";
import { ShuffleLesson } from "./ShuffleLesson";
import { SlowBluesLesson } from "./SlowBluesLesson";
import { TwelveEightLesson } from "./TwelveEightLesson";

const GROOVE_CONTENT: Record<string, ComponentType> = {
  shuffle: ShuffleLesson,
  backbeat: BackbeatLesson,
  "slow-blues": SlowBluesLesson,
  "four-four": FourFourLesson,
  "twelve-eight": TwelveEightLesson,
};

export function getGrooveContent(slug: string): ComponentType | undefined {
  return GROOVE_CONTENT[slug];
}
