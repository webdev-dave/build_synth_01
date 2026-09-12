"use client";

/**
 * Inline leaves for progression prose. Server components render the
 * sentence; these tiny client islands fill in the one thing that changes
 * with the key picker, so "the IV chord is <ChordName numeral="IV7" />"
 * reads D7 in A and A7 in E without re-rendering the paragraph.
 */
import type { ChordRole, ChordSpec } from "@/lib/music/chords";
import { useProgression, type ProgressionState } from "./ProgressionProvider";

/**
 * A chord of the chart by numeral ("IV7"), including variant bars; or the
 * spec handed in directly for a chord the chart doesn't hold (the plain
 * triad "I" on a page whose chart is all sevenths).
 */
function resolve(
  progression: ProgressionState["progression"],
  numeral?: string,
  chord?: ChordSpec,
): ChordSpec | undefined {
  if (chord) return chord;
  return (
    progression.bars.find((b) => b.chord.numeral === numeral)?.chord ??
    progression.variants?.flatMap((v) => v.edits).find((e) => e.chord.numeral === numeral)?.chord
  );
}

interface ChordRefProps {
  numeral?: string;
  chord?: ChordSpec;
}

/** The current key ("A", "E♭"). */
export function KeyName() {
  const { keyName } = useProgression();
  return <span className="font-mono">{keyName}</span>;
}

/**
 * A chord's concrete name in the current key ("IV7" → "D7" in A). Falls
 * back to the numeral itself if nothing resolves, so a typo is visible.
 */
export function ChordName({ numeral, chord }: ChordRefProps) {
  const { progression, nameOf } = useProgression();
  const spec = resolve(progression, numeral, chord);
  return <span className="font-mono">{spec ? nameOf(spec) : numeral}</span>;
}

const ROLE_ORDER: ChordRole[] = ["root", "3rd", "5th", "7th"];

/** The tones of a chord, root first, spelled in this key ("A C♯ E G"). */
export function ChordTones({
  numeral,
  chord,
  separator = " ",
}: ChordRefProps & { separator?: string }) {
  const { progression, tonesOf } = useProgression();
  const spec = resolve(progression, numeral, chord);
  if (!spec) return <span className="font-mono">{numeral}</span>;
  const names = [...tonesOf(spec)]
    .sort((a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role))
    .map((t) => t.name);
  return <span className="font-mono">{names.join(separator)}</span>;
}
