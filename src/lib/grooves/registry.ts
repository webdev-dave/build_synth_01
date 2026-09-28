/**
 * Grooves & meters registry — the rhythm module's rows.
 *
 * Two kinds on one hub (`/rhythm`): a **groove** is a drum pattern with a
 * feel (shuffle, backbeat, one-drop); a **meter** is how the bar is fenced
 * (4/4, 12/8). A groove names the meter spoke it lives in, so a genre's
 * Meter panel can be *derived* from its grooves — no separate list to keep
 * in step. Same contract as scales and progressions (`LessonEntry`).
 *
 * Every pattern's hits are locked against a source before the row goes
 * live (see `sources`); the honesty rule forbids a grid that lights a hit
 * the kit doesn't sound, and equally a "shuffle" whose hits nobody plays.
 *
 * Teaching truth (Wikipedia, verified 2026-09-12):
 * - Rock/backbeat: hats every 8th, snare on 2 and 4, kick on 1 and 3
 *   ("Beat (music)" § Backbeat; the notation in "One drop rhythm").
 * - Shuffle: the same pulse with each beat divided long–short, first note
 *   about twice the second — the triplet feel ("Swing (jazz performance
 *   style)" § Swing as a rhythmic style).
 * - One drop: kick and cross-stick together on beat 3, beat 1 empty, hats
 *   every 8th ("One drop rhythm").
 * - 12/8: compound quadruple — twelve eighths felt as four dotted-quarter
 *   beats of three ("Time signature" § Simple versus compound).
 */

import { getGenre } from "@/lib/genres/registry";
import type { LessonEntry } from "@/lib/lessons/types";
import {
  hitsOnGrid,
  swingFor,
  type DrumHit,
  type DrumVoice,
  type GroovePattern,
} from "@/lib/music/grooves";
import type { TimeSignature } from "@/lib/music/timeSignatures";
import {
  filterByHaystack,
  joinHaystack,
  relatedNames,
  sortByLabel,
} from "@/lib/search/normalize";

export type GrooveKind = "groove" | "meter";

export interface GrooveSource {
  label: string;
  url: string;
}

export interface Groove extends LessonEntry {
  kind: GrooveKind;
  /** Other names an author might write ("swing eighths", "rock beat"). */
  aliases: string[];
  pattern: GroovePattern;
  /**
   * Hits that *are* the groove — the snare on 2 and 4, the one-drop's beat
   * 3. These wear the burnt-orange spotlight on the grid.
   */
  signature: { voice: DrumVoice; at: number }[];
  /** For grooves: slug of the meter spoke this lives in ("four-four"). */
  meter?: string;
  /** For meters: the fence itself. */
  timeSignature?: TimeSignature;
  /** Crawlable one-line description of the hits ("kick 1 3 · snare 2 4 · hats swung 8ths"). */
  formula: string;
  /** Foil groove for the comparer (shuffle ↔ backbeat). */
  compareWith?: string;
  /** Verified references, shown as the lesson's Sources. */
  sources: GrooveSource[];
}

// --- pattern builders -----------------------------------------------------

const hit = (voice: DrumVoice, at: number, velocity: number): DrumHit => ({ voice, at, velocity });

/** Hats on every step of a four-beat bar: firm on the beat, lighter between. */
function hatsEvery(stepsPerBeat: number, beats = 4, onBeat = 0.7, offBeat = 0.45): DrumHit[] {
  const out: DrumHit[] = [];
  for (let s = 0; s < beats * stepsPerBeat; s++) {
    const at = s / stepsPerBeat;
    out.push(hit("hatClosed", at, s % stepsPerBeat === 0 ? onBeat : offBeat));
  }
  return out;
}

/** The rock skeleton: kick 1 and 3, snare 2 and 4. */
const KICK_SNARE_4: DrumHit[] = [
  hit("kick", 0, 0.9),
  hit("snare", 1, 0.9),
  hit("kick", 2, 0.85),
  hit("snare", 3, 0.9),
];

const BACKBEAT_PATTERN: GroovePattern = {
  meter: [4, 4],
  stepsPerBeat: 2,
  feel: "straight",
  swing: swingFor("straight"),
  bpm: 108,
  hits: [...hatsEvery(2), ...KICK_SNARE_4],
  cue: "one TWO three FOUR — the snare cracks on two and four",
};

// The same hits as the backbeat, with each beat divided long–short. The
// grid stores them straight; the clock's swing transform makes the shuffle.
const SHUFFLE_PATTERN: GroovePattern = {
  ...BACKBEAT_PATTERN,
  feel: "shuffle",
  swing: swingFor("shuffle"),
  bpm: 100,
  cue: "ONE-a TWO-a THREE-a FOUR-a — long, short; long, short",
};

// Slow 12/8: four felt beats of three eighths, hats on all twelve.
const SLOW_BLUES_PATTERN: GroovePattern = {
  meter: [12, 8],
  stepsPerBeat: 3,
  feel: "straight",
  swing: swingFor("straight"),
  bpm: 60,
  hits: [...hatsEvery(3, 4, 0.7, 0.4), ...KICK_SNARE_4],
  cue: "ONE trip-let TWO trip-let THREE trip-let FOUR trip-let",
};

const ONE_DROP_PATTERN: GroovePattern = {
  meter: [4, 4],
  stepsPerBeat: 2,
  feel: "straight",
  swing: swingFor("straight"),
  bpm: 76,
  hits: [
    ...hatsEvery(2),
    // Beat 1 is left empty; the kick and cross-stick land together on 3.
    hit("kick", 2, 0.9),
    hit("rim", 2, 0.9),
  ],
  cue: "(one) two THREE four — nothing on the one, everything on three",
};

/** A meter's bare count: click on every beat, heavy on the one. */
function countPattern(meter: TimeSignature, stepsPerBeat: 2 | 3, bpm: number, cue: string): GroovePattern {
  const beats = meter[1] === 8 && meter[0] % 3 === 0 ? meter[0] / 3 : meter[0] * (4 / meter[1]);
  const hits: DrumHit[] = [];
  for (let b = 0; b < beats; b++) hits.push(hit("click", b, b === 0 ? 1 : 0.5));
  return { meter, stepsPerBeat, feel: "straight", swing: swingFor("straight"), bpm, hits, cue };
}

const WIKI = (title: string, page: string): GrooveSource => ({
  label: `${title} — Wikipedia`,
  url: `https://en.wikipedia.org/wiki/${page}`,
});

// --- rows ------------------------------------------------------------------

export const GROOVES: Groove[] = [
  {
    slug: "shuffle",
    kind: "groove",
    name: "Shuffle",
    question: "What is a shuffle rhythm?",
    aliases: ["shuffle feel", "blues shuffle", "swung eighths", "swing eighths", "shuffle beat"],
    summary:
      "The blues walk: every beat split long–short, like a triplet with the middle left out, over a snare on two and four.",
    answer:
      "A shuffle is a groove in which each beat is divided unevenly — a long note then a short one, roughly two-thirds to one-third, the same as the first and third notes of a triplet — while the drums keep a plain rock skeleton of kick on 1 and 3 and snare on 2 and 4. That lopsided division is what makes a blues 'walk' rather than march; play the identical hits with even eighths and you have a straight rock beat.",
    history:
      "The long–short division comes from swing-era jazz drumming and boogie-woogie piano, where the left hand walked in swung eighths. Postwar Chicago and Texas blues bands made it the default blues feel, and early rock and roll inherited it before settling into straight eighths.",
    pattern: SHUFFLE_PATTERN,
    signature: [
      { voice: "hatClosed", at: 0.5 },
      { voice: "hatClosed", at: 1.5 },
      { voice: "hatClosed", at: 2.5 },
      { voice: "hatClosed", at: 3.5 },
    ],
    meter: "four-four",
    formula: "kick 1 · 3 — snare 2 · 4 — hats on every eighth, swung long–short",
    compareWith: "backbeat",
    usedIn: ["blues", "rock"],
    status: "live",
    keywords: [
      "shuffle rhythm",
      "blues shuffle drum beat",
      "what is swing feel",
      "swung eighth notes",
      "triplet feel",
    ],
    sources: [
      WIKI("Swing (jazz performance style)", "Swing_(jazz_performance_style)"),
      WIKI("One drop rhythm (rock pattern notation)", "One_drop_rhythm"),
    ],
  },
  {
    slug: "backbeat",
    kind: "groove",
    name: "Backbeat",
    question: "What is a backbeat?",
    aliases: ["back beat", "rock beat", "straight eighths", "2 and 4"],
    summary:
      "The rock skeleton: even eighths on the hats, kick on 1 and 3, and the snare cracking on 2 and 4 — the weak beats made heavy.",
    answer:
      "A backbeat is a rhythm that accents beats 2 and 4 of a four-beat bar — the beats the bar itself treats as weak. In rock and R&B the snare drum plays it while the kick holds 1 and 3 and the hi-hat keeps even eighth notes. It is the straight-eighth cousin of the shuffle: identical hits, evenly divided.",
    history:
      "Emphasised backbeats show up on 1930s and 40s records — Harry James's 'Back Beat Boogie' (1939), Wynonie Harris's 'Good Rockin' Tonight' (1948) — and became the engine of rhythm and blues and then rock and roll, where the snare took the job for good.",
    pattern: BACKBEAT_PATTERN,
    signature: [
      { voice: "snare", at: 1 },
      { voice: "snare", at: 3 },
    ],
    meter: "four-four",
    formula: "kick 1 · 3 — snare 2 · 4 — hats on every eighth, straight",
    compareWith: "shuffle",
    usedIn: ["rock", "blues"],
    status: "live",
    keywords: ["backbeat drum pattern", "rock drum beat", "snare on 2 and 4", "straight eighths"],
    sources: [WIKI("Beat (music) § Backbeat", "Beat_(music)#Backbeat"), WIKI("One drop rhythm", "One_drop_rhythm")],
  },
  {
    slug: "slow-blues",
    kind: "groove",
    name: "Slow blues (12/8)",
    question: "What is the slow blues 12/8 groove?",
    aliases: ["12/8 blues", "slow blues feel", "12/8 shuffle", "triplet blues"],
    summary:
      "The shuffle slowed until its triplets are written out: four beats a bar, three eighths in each, snare still on two and four.",
    answer:
      "A slow blues is usually written in 12/8: four beats per bar with each beat divided into three eighth notes, played slowly enough that all three are heard. The drums keep the blues skeleton — kick on 1 and 3, snare on 2 and 4 — while the hi-hat or ride plays every one of the twelve eighths. It is the shuffle with nothing left out.",
    pattern: SLOW_BLUES_PATTERN,
    signature: [
      { voice: "hatClosed", at: 1 / 3 },
      { voice: "hatClosed", at: 2 / 3 },
    ],
    meter: "twelve-eight",
    formula: "kick 1 · 3 — snare 2 · 4 — hats on all twelve eighths (ONE-trip-let)",
    compareWith: "shuffle",
    usedIn: ["blues"],
    status: "live",
    keywords: ["slow blues drum beat", "12/8 blues groove", "twelve eight blues", "triplet feel blues"],
    sources: [WIKI("Time signature § Simple versus compound", "Time_signature")],
  },
  {
    slug: "one-drop",
    kind: "groove",
    name: "One drop",
    question: "What is the one drop rhythm?",
    aliases: ["one-drop", "reggae drum beat", "one drop beat"],
    summary:
      "Reggae's signature: beat one left empty, the kick and cross-stick landing together on three.",
    answer:
      "The one drop is a reggae drum pattern in which the bass drum and a cross-stick snare both sound on the third beat of a four-beat bar while beat one is left empty, over steady eighth-note hi-hats. Taking the weight off the one and dropping it on three is what gives reggae its laid-back lean.",
    pattern: ONE_DROP_PATTERN,
    signature: [
      { voice: "kick", at: 2 },
      { voice: "rim", at: 2 },
    ],
    meter: "four-four",
    formula: "nothing on 1 — kick + rim together on 3 — hats on every eighth",
    compareWith: "backbeat",
    usedIn: ["reggae"],
    status: "soon",
    keywords: ["one drop rhythm", "reggae drum pattern", "Carlton Barrett one drop"],
    sources: [WIKI("One drop rhythm", "One_drop_rhythm")],
  },
  // --- meters -------------------------------------------------------------
  {
    slug: "four-four",
    kind: "meter",
    name: "4/4",
    question: "What is 4/4 time?",
    aliases: ["common time", "four four", "4/4 time signature", "four beats to the bar"],
    summary:
      "Four quarter-note beats to the bar, ONE heavy and THREE a little heavy — the fence most pop, rock, and blues sit inside.",
    answer:
      "4/4, or common time, is a time signature with four quarter-note beats in every bar. The bar gives beat 1 the most weight and beat 3 a secondary push; drums may then contradict that — a backbeat puts the snare on the weak beats 2 and 4 — and that argument between the bar and the drums is much of what a groove is.",
    pattern: countPattern([4, 4], 2, 96, "ONE two THREE four"),
    signature: [{ voice: "click", at: 0 }],
    timeSignature: [4, 4],
    formula: "4 beats · quarter note gets the beat · ONE two three four",
    usedIn: ["blues", "rock", "reggae"],
    status: "live",
    keywords: ["4/4 time signature", "common time", "what does 4/4 mean", "time signature explained"],
    sources: [WIKI("Time signature", "Time_signature")],
  },
  {
    slug: "twelve-eight",
    kind: "meter",
    name: "12/8",
    question: "What is 12/8 time?",
    aliases: ["twelve eight", "12/8 time signature", "compound quadruple", "four groups of three"],
    summary:
      "Twelve eighth notes felt as four beats of three — the slow blues and the ballad sway, written down.",
    answer:
      "12/8 is a compound time signature: twelve eighth notes per bar, grouped in threes, so it is felt as four beats each containing a triplet. A slow blues, a doo-wop ballad, and a shuffle slowed right down all live here — the same four-beat bar as 4/4, with the long–short division of a shuffle written out as three even eighths.",
    pattern: countPattern([12, 8], 3, 60, "ONE trip-let TWO trip-let THREE trip-let FOUR trip-let"),
    signature: [{ voice: "click", at: 0 }],
    timeSignature: [12, 8],
    formula: "4 beats · dotted quarter gets the beat · each beat is three eighths",
    compareWith: "four-four",
    usedIn: ["blues"],
    status: "live",
    keywords: ["12/8 time signature", "compound meter", "what is 12/8", "slow blues time signature"],
    sources: [WIKI("Time signature § Simple versus compound", "Time_signature")],
  },
  {
    slug: "three-four",
    kind: "meter",
    name: "3/4",
    question: "What is 3/4 time?",
    aliases: ["waltz time", "three four", "3/4 time signature"],
    summary: "Three quarter-note beats to the bar — the waltz: ONE two three, ONE two three.",
    answer:
      "3/4 is a simple triple time signature: three quarter-note beats in every bar, with the weight on beat 1. It is the meter of the waltz and of many folk songs, and the easiest way to hear what a bar line does — move the same notes into 3/4 and the sway appears without a note changing.",
    pattern: countPattern([3, 4], 2, 120, "ONE two three"),
    signature: [{ voice: "click", at: 0 }],
    timeSignature: [3, 4],
    formula: "3 beats · quarter note gets the beat · ONE two three",
    usedIn: [],
    status: "soon",
    keywords: ["3/4 time signature", "waltz time", "triple meter"],
    sources: [WIKI("Time signature", "Time_signature")],
  },
  {
    slug: "six-eight",
    kind: "meter",
    name: "6/8",
    question: "What is 6/8 time?",
    aliases: ["six eight", "6/8 time signature", "compound duple"],
    summary: "Six eighths felt as two beats of three — a jig or a ballad sway, not a waltz.",
    answer:
      "6/8 is a compound duple time signature: six eighth notes per bar, grouped in two sets of three, so it is felt as two beats each holding a triplet. It lasts as long as a bar of 3/4 at the same eighth-note speed but groups differently — two big steps, not three — which is why a jig and a waltz feel nothing alike.",
    pattern: countPattern([6, 8], 3, 60, "ONE and-a TWO and-a"),
    signature: [{ voice: "click", at: 0 }],
    timeSignature: [6, 8],
    formula: "2 beats · dotted quarter gets the beat · each beat is three eighths",
    compareWith: "three-four",
    usedIn: [],
    status: "soon",
    keywords: ["6/8 time signature", "compound duple", "jig rhythm"],
    sources: [WIKI("Time signature", "Time_signature")],
  },
];

// Every hit must sit on its pattern's grid — a lit cell the kit can't place
// is exactly the lie the honesty rule forbids.
for (const g of GROOVES) {
  if (!hitsOnGrid(g.pattern)) throw new Error(`Groove "${g.slug}" has hits off its grid`);
}

export function getGroove(slug: string): Groove | undefined {
  return GROOVES.find((g) => g.slug === slug);
}

export const LIVE_GROOVES = GROOVES.filter((g) => g.status === "live");

export function getGroovesByGenre(genreSlug: string): Groove[] {
  return GROOVES.filter((g) => g.usedIn.includes(genreSlug));
}

/**
 * The meter spokes a set of grooves live in, in first-seen order — how a
 * genre's Meter panel is derived from its Rhythm list.
 */
export function metersOfGrooves(grooveSlugs: readonly string[]): string[] {
  const out: string[] = [];
  for (const slug of grooveSlugs) {
    const meter = getGroove(slug)?.meter;
    if (meter && !out.includes(meter)) out.push(meter);
  }
  return out;
}

export function isSignatureHit(groove: Groove, voice: DrumVoice, at: number): boolean {
  return groove.signature.some((s) => s.voice === voice && Math.abs(s.at - at) < 1e-6);
}

export interface GrooveFilters {
  genre?: string;
  kind?: GrooveKind;
  status?: "live" | "soon";
}

function grooveHaystack(groove: Groove): string {
  return joinHaystack([
    groove.name,
    groove.slug,
    groove.question,
    groove.summary,
    groove.answer,
    groove.formula,
    groove.pattern.cue,
    ...groove.aliases,
    ...groove.keywords,
    ...relatedNames(groove.usedIn, getGenre),
  ]);
}

const GROOVE_HAY = new Map(GROOVES.map((g) => [g.slug, grooveHaystack(g)]));

export function searchGrooves(query: string, filters: GrooveFilters = {}): Groove[] {
  const pool = GROOVES.filter(
    (g) =>
      (!filters.genre || g.usedIn.includes(filters.genre)) &&
      (!filters.kind || g.kind === filters.kind) &&
      (!filters.status || g.status === filters.status),
  );
  return sortByLabel(
    filterByHaystack(pool, query, (g) => GROOVE_HAY.get(g.slug) ?? ""),
    (g) => g.name,
  );
}
