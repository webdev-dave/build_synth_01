/**
 * PageMapSection — server wrapper that drops a region-filtered map at the
 * bottom of a content page (genre, artist, history article, language,
 * concept, song).
 *
 * It resolves the entity's relevant places server-side and renders the client
 * `EmbeddedMap` only when at least one place resolves. When nothing does it
 * renders nothing — the house honesty rule: never show an empty globe that
 * implies coverage we don't have (most pages won't map until the places
 * registry grows past blues + klezmer).
 */
import { placesForEntity } from "@/lib/places/registry";
import { EmbeddedMap } from "./EmbeddedMap";

interface PageMapSectionProps {
  /**
   * The entity's cross-link fields. `places` (if set) pins an exact, curated
   * set; otherwise places are derived from genres/history/songLabels.
   */
  entity: {
    genres?: string[];
    history?: string[];
    songLabels?: string[];
    places?: string[];
  };
  heading?: string;
  /** Full-map deep link, e.g. `/map?genre=blues` or `/map`. */
  fullMapHref: string;
}

export function PageMapSection({
  entity,
  heading,
  fullMapHref,
}: PageMapSectionProps) {
  const places = placesForEntity(entity);
  if (places.length === 0) return null;

  return (
    <EmbeddedMap
      placeIds={places.map((p) => p.id)}
      heading={heading}
      fullMapHref={fullMapHref}
    />
  );
}
