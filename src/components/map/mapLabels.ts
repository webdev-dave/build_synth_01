/**
 * Place names stay off the quiet globe. They appear only after the camera
 * has left world view *and* that landmass is large enough on screen that
 * you've actually framed it — not every tinted country at once.
 */
import type { GeoPath, GeoPermissibleObjects } from "d3-geo";
import type { Feature, Geometry, Polygon } from "geojson";

export const LAND_LABEL_PX = 14;

/**
 * The dominant landmass of a country/state feature.
 *
 * Natural Earth keeps overseas territory in the same feature — France carries
 * French Guiana, the US carries Hawaii — so raw bounds span an ocean, and
 * "zoom to France" reads as zooming *out*. Frame and label the biggest piece.
 */
export function mainlandFeature<P>(
  feature: Feature<Geometry, P>,
  path: GeoPath,
): Feature<Geometry, P> {
  if (feature.geometry?.type !== "MultiPolygon") return feature;
  let best: Feature<Polygon, P> | undefined;
  let bestArea = -Infinity;
  for (const coordinates of feature.geometry.coordinates) {
    const piece: Feature<Polygon, P> = {
      type: "Feature",
      properties: feature.properties,
      geometry: { type: "Polygon", coordinates },
    };
    const area = Math.abs(path.area(piece as unknown as GeoPermissibleObjects));
    if (area > bestArea) {
      bestArea = area;
      best = piece;
    }
  }
  return best ?? feature;
}

/** The picked place is the biggest word in its region, whatever its scale. */
export const SELECTED_LABEL_PX = 20;

/**
 * Place-name type size in SVG units (the map group already scales by `zoom`).
 * Keep a fixed screen size so the word doesn't balloon as you close in.
 */
export function landLabelFontSvg(zoom: number, emphasized = false): number {
  return (emphasized ? SELECTED_LABEL_PX : LAND_LABEL_PX) / zoom;
}

/** Below this, no country / state / overlay names. */
export const LABEL_MIN_ZOOM = 2.2;

/** Cities wait a little longer so a shallow zoom isn't a name pile. */
export const CITY_LABEL_MIN_ZOOM = 3.2;

const LABEL_MIN_WIDTH = 80;
const LABEL_MIN_HEIGHT = 36;

export function landmassLabelVisible(
  bounds: [[number, number], [number, number]],
  zoom: number,
): boolean {
  if (zoom <= LABEL_MIN_ZOOM) return false;
  const w = (bounds[1][0] - bounds[0][0]) * zoom;
  const h = (bounds[1][1] - bounds[0][1]) * zoom;
  // Framed, not merely visible: skips the Europe pile on a shallow zoom.
  return w >= LABEL_MIN_WIDTH && h >= LABEL_MIN_HEIGHT;
}

/** Zoom that makes `landmassLabelVisible` true for this shape (Ireland, etc.). */
export function zoomForLandLabel(
  bounds: [[number, number], [number, number]],
): number {
  const w = bounds[1][0] - bounds[0][0];
  const h = bounds[1][1] - bounds[0][1];
  return Math.max(
    LABEL_MIN_ZOOM + 0.05,
    w > 0 ? LABEL_MIN_WIDTH / w : LABEL_MIN_ZOOM,
    h > 0 ? LABEL_MIN_HEIGHT / h : LABEL_MIN_ZOOM,
  );
}
