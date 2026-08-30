import type { LearnPanelConcept } from "@/components/learn/LearnPanel";
import { TICKS_PER_BEAT } from "@/lib/song/ticks";

export type TimeSignature = [numerator: number, denominator: number];

export const COMMON_TIME_SIGNATURES: TimeSignature[] = [
  [2, 4],
  [3, 4],
  [4, 4],
  [5, 4],
  [6, 8],
  [7, 8],
  [9, 8],
  [12, 8],
];

export function formatTimeSignature(sig: TimeSignature): string {
  return `${sig[0]}/${sig[1]}`;
}

export function parseTimeSignature(value: string): TimeSignature {
  const [n, d] = value.split("/").map(Number);
  const num = Number.isFinite(n) && n > 0 ? n : 4;
  const den = d === 8 || d === 4 || d === 2 ? d : 4;
  return [num, den];
}

export function sameTimeSignature(a: TimeSignature, b: TimeSignature): boolean {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Ticks in one bar. `TICKS_PER_BEAT` is ticks per quarter note, so
 * 6/8 (six eighths) is the same clock length as 3/4.
 */
export function ticksPerBar(
  sig: TimeSignature,
  ticksPerQuarter = TICKS_PER_BEAT,
): number {
  const [num, den] = sig;
  return Math.max(1, Math.round(num * ticksPerQuarter * (4 / den)));
}

type MeterCopy = {
  title: string;
  feel: string;
  body: [string, string];
};

const METER_LESSONS: Record<string, MeterCopy> = {
  "2/4": {
    title: "2/4 — march time",
    feel: "ONE-two",
    body: [
      "Two quarter notes per bar. The downbeat is a step; the second beat is the lift. Marches and a lot of polkas live here.",
      "On the roll, bar lines now fall every two quarter-note beats. A melody written in 4/4 will look twice as many bars long — same notes, different grouping.",
    ],
  },
  "3/4": {
    title: "3/4 — waltz time",
    feel: "ONE-two-three",
    body: [
      "Three quarter notes per bar. The first beat is the sway; the next two are the turn. Waltzes and Tumbalalaika are counted this way.",
      "Bar lines now sit every three beats. If a 4/4 tune suddenly feels rushed or late at the line, the notes did not move — the fence did.",
    ],
  },
  "4/4": {
    title: "4/4 — common time",
    feel: "ONE-two-three-four",
    body: [
      "Four quarter notes per bar. Most pop, rock, and the homepage hero sit here. Beat 1 is home; beat 3 is a secondary push.",
      "This is the roll’s default fence. Changing away from 4/4 does not rewrite pitches — it only redraws where a measure starts and ends.",
    ],
  },
  "5/4": {
    title: "5/4 — odd meter",
    feel: "ONE-two-three | ONE-two  (or 2+3)",
    body: [
      "Five quarter notes per bar. Players usually feel it as 3+2 or 2+3 so the bar has two smaller steps instead of five equal punches.",
      "The roll now draws a line every five beats. Try looping one bar and tapping the groups — the notes teach the count better than a diagram.",
    ],
  },
  "6/8": {
    title: "6/8 — two groups of three",
    feel: "ONE-and-a TWO-and-a",
    body: [
      "Six eighth notes, felt as two dotted-quarter pulses — not three pairs. That is why 6/8 is a jig or a ballad sway, not a waltz (3/4).",
      "A 6/8 bar lasts as long as a 3/4 bar at the same quarter-note BPM, but the grid groups in threes. Listen for two big steps, not three.",
    ],
  },
  "7/8": {
    title: "7/8 — uneven walk",
    feel: "often 2+2+3 (or 3+2+2)",
    body: [
      "Seven eighth notes per bar. Balkan and some klezmer tunes lean on a short-short-long limp so the last group lands heavier.",
      "Bar lines now fall every seven eighths. Tap a 2-2-3 pattern against the roll — the uneven last step is the whole point of the meter.",
    ],
  },
  "9/8": {
    title: "9/8 — three groups of three",
    feel: "ONE-and-a TWO-and-a THREE-and-a",
    body: [
      "Nine eighths, usually three dotted-quarter pulses. Slip jigs and some compound-triple tunes live here.",
      "The bar is a half again as long as 6/8. Count three big steps, each split into three, rather than nine tiny ones.",
    ],
  },
  "12/8": {
    title: "12/8 — four groups of three",
    feel: "ONE-and-a TWO-and-a THREE-and-a FOUR-and-a",
    body: [
      "Twelve eighths, felt as four dotted-quarter pulses. A slow blues or 12/8 rock ballad is often 4/4 with a triplet inside each beat.",
      "Same four big beats as 4/4, but each beat is a triplet. The roll’s bar is longer in eighths; the feel is a swing, not a march.",
    ],
  },
};

const FALLBACK: MeterCopy = {
  title: "Time signature",
  feel: "beats grouped into bars",
  body: [
    "The top number is how many beats sit in a bar. The bottom number is what kind of note gets one beat (4 = quarter, 8 = eighth).",
    "Changing this control only moves the bar lines on the roll. The painted notes stay where they are — you are changing the fence, not the melody.",
  ],
};

/** Mini-lesson for the meter currently on the roll. */
export function timeSignatureLesson(sig: TimeSignature): LearnPanelConcept {
  const key = formatTimeSignature(sig);
  const copy = METER_LESSONS[key] ?? {
    ...FALLBACK,
    title: `${key} — time signature`,
  };
  return {
    id: `meter-${sig[0]}-${sig[1]}`,
    title: copy.title,
    body: [
      `Feel: ${copy.feel}.`,
      copy.body[0],
      copy.body[1],
    ],
    lessonHref: "/lessons/time-signatures",
  };
}
