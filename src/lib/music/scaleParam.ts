/**
 * The `?scale=` deep link into the synth: `/synth/v2?scale=D-dorian`.
 *
 * Root then catalog id, joined by a hyphen. The root accepts what people
 * type — `C#`, `Db`, `C♯`, `D♭`, any case — and the type must be a real
 * `ScaleTypeId`, so a stale or mistyped link simply preselects nothing
 * instead of half a scale.
 */
import { SCALE_CATALOG, type ScaleTypeId } from "./scaleCatalog";

export interface ScaleSelection {
  rootPc: number;
  typeId: ScaleTypeId;
}

const LETTER_PC: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

/** Sharp names for the URL — ASCII so the link survives copy-paste. */
const URL_ROOTS = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const mod12 = (n: number) => ((n % 12) + 12) % 12;

export function parseRootName(raw: string): number | null {
  const m = /^([A-Ga-g])([#♯]|[b♭])?$/.exec(raw.trim());
  if (!m) return null;
  const base = LETTER_PC[m[1].toUpperCase()];
  const acc = m[2] === undefined ? 0 : m[2] === "#" || m[2] === "♯" ? 1 : -1;
  return mod12(base + acc);
}

export function parseScaleParam(
  value: string | null | undefined,
): ScaleSelection | null {
  if (!value) return null;
  const dash = value.indexOf("-");
  if (dash === -1) return null;
  const rootPc = parseRootName(value.slice(0, dash));
  const typeId = value.slice(dash + 1);
  if (rootPc === null || !(typeId in SCALE_CATALOG)) return null;
  return { rootPc, typeId: typeId as ScaleTypeId };
}

export function formatScaleParam(rootPc: number, typeId: ScaleTypeId): string {
  return `${URL_ROOTS[mod12(rootPc)]}-${typeId}`;
}

export function synthHrefFor(rootPc: number, typeId: ScaleTypeId): string {
  return `/synth/v2?scale=${encodeURIComponent(formatScaleParam(rootPc, typeId))}`;
}
