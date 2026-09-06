/**
 * Cousin article content — maps a registry slug to its full article body.
 * Kept separate from src/lib/cousins/registry.ts so the registry (sitemap,
 * metadata, search) never pulls in article component trees.
 */
import type { ComponentType } from "react";

import { DonaDonaCousins } from "./DonaDonaCousins";
import { MiserlouCousins } from "./MiserlouCousins";
import { OverTheRainbowCousins } from "./OverTheRainbowCousins";

const COUSIN_CONTENT: Record<string, ComponentType> = {
  miserlou: MiserlouCousins,
  "dona-dona": DonaDonaCousins,
  "over-the-rainbow": OverTheRainbowCousins,
};

export function getCousinContent(slug: string): ComponentType | undefined {
  return COUSIN_CONTENT[slug];
}
