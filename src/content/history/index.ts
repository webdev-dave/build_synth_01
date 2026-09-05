/**
 * History article content — maps a registry slug to its full article body.
 * Kept separate from src/lib/history/registry.ts so the registry (imported by
 * the sitemap and metadata) never pulls in article component trees.
 *
 * A slug with no entry here renders the spoke's "being written" placeholder.
 * Flipping an article's registry status to "live" should come with an entry
 * here — a "live" page with no body is just a lead sentence.
 */
import type { ComponentType } from "react";

import { BluesHistory } from "./BluesHistory";
import { KlezmerHistory } from "./KlezmerHistory";

const HISTORY_CONTENT: Record<string, ComponentType> = {
  blues: BluesHistory,
  klezmer: KlezmerHistory,
};

export function getHistoryContent(slug: string): ComponentType | undefined {
  return HISTORY_CONTENT[slug];
}
