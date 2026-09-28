/**
 * The one-line sentences under the chord/scale overlay. Pure functions of
 * the theory (`noteRole`, chord tones) and the spelling, so the widget can
 * never say something the lit keys contradict — and so the sentences can
 * be checked from Node against a hand-written table.
 */
import {
  CHORD_QUALITIES,
  chordPitchClasses,
  identifyChord,
  noteRole,
  type ChordSpec,
} from "@/lib/music/chords";

const mod12 = (n: number) => ((n % 12) + 12) % 12;

export interface CaptionContext {
  keyRootPc: number;
  /** Key name in the lesson's spelling ("A"). */
  keyName: string;
  /** Overlay scale as `[offset, label]` pairs. */
  degrees: readonly { offset: number; label: string }[];
  /** Short name of the overlay scale ("blues scale"). */
  scaleLabel: string;
  /** Note name for a pitch class in this key's spelling. */
  nameOfPc: (pc: number) => string;
  /** Concrete chord name in this key ("D7"). */
  nameOf: (spec: ChordSpec) => string;
}

/**
 * What one pressed note is doing against the chord that is sounding.
 *
 *   "C is the ♭3 of A and the 7th of D7 — a chord tone here."
 *   "C♯ is the 3rd of A7 — not in the A blues scale; the note the ♭3 bends toward."
 *   "C is the ♭3 of A but not a tone of E7 — a scale note passing over the chord."
 *   "D♯ is neither in the A blues scale nor in A7 — a chromatic note here."
 */
export function roleSentence(pc: number, spec: ChordSpec, ctx: CaptionContext): string {
  const { keyRootPc, keyName, degrees, scaleLabel, nameOfPc, nameOf } = ctx;
  const role = noteRole(pc, keyRootPc, spec, degrees);
  const note = nameOfPc(pc);
  const chord = nameOf(spec);

  if (role.inChord && role.scaleDegree) {
    return `${note} is the ${role.scaleDegree} of ${keyName} and the ${role.chordRole} of ${chord} — a chord tone here.`;
  }
  if (role.inChord) {
    // The classic rub: a chord tone one semitone above a scale note (the
    // major 3rd over the blues scale's ♭3) is the note the scale bends toward.
    const below = degrees.find((d) => mod12(keyRootPc + d.offset) === mod12(pc - 1));
    const tail = below
      ? `the note the ${below.label} bends toward.`
      : "outside the scale, but it belongs to the chord.";
    return `${note} is the ${role.chordRole} of ${chord} — not in the ${keyName} ${scaleLabel}; ${tail}`;
  }
  if (role.scaleDegree) {
    return `${note} is the ${role.scaleDegree} of ${keyName} but not a tone of ${chord} — a scale note passing over the chord.`;
  }
  return `${note} is neither in the ${keyName} ${scaleLabel} nor in ${chord} — a chromatic note here.`;
}

/**
 * The pair of adjacent keys where the chord and the scale disagree — over
 * I7 in A that is C (♭3, scale) a semitone *below* C♯ (3rd, chord). Blues
 * bends push up, so only the scale-note-below case is the bend pair; a
 * chord tone with a scale note above it is a plain outside note. Null when
 * the chord's tones all sit in the scale.
 */
export function rubSentence(spec: ChordSpec, ctx: CaptionContext): string | null {
  const { keyRootPc, degrees, nameOfPc, nameOf } = ctx;
  const scalePcs = new Map(degrees.map((d) => [mod12(keyRootPc + d.offset), d.label] as const));
  for (const pc of chordPitchClasses(keyRootPc, spec)) {
    if (scalePcs.has(pc)) continue;
    const below = mod12(pc - 1);
    const label = scalePcs.get(below);
    if (label === undefined) continue;
    const role = noteRole(pc, keyRootPc, spec, degrees);
    return `The rub: ${label} (${nameOfPc(below)}) in the scale sits right under the ${role.chordRole} (${nameOfPc(pc)}) in ${nameOf(spec)} — the blue note, on a piano, is that pair.`;
  }
  return null;
}

/** "You're holding D7" — or null when the held notes don't spell a chord. */
export function heldChordSentence(
  heldPcs: readonly number[],
  ctx: Pick<CaptionContext, "nameOfPc">,
): string | null {
  if (heldPcs.length < 3) return null;
  const found = identifyChord(heldPcs);
  if (!found) return null;
  const q = CHORD_QUALITIES[found.quality];
  return `You're holding ${ctx.nameOfPc(found.rootPc)}${q.symbol} — ${q.name}.`;
}
