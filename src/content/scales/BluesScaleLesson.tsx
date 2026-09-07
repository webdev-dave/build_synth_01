/**
 * The blues scale, taught from zero.
 *
 * Assumes the reader knows nothing: not what a scale is, not what a degree
 * or a flat means. Each section introduces one idea and puts the widget
 * that *plays* that idea directly under it. Root, octave, lock, and audio
 * are shared page-wide through ScaleLessonProvider, so "change the root at
 * the top" really changes every keyboard, chip, and run below.
 *
 * Server component: the prose ships in static HTML. Only the widgets (and
 * the <RootName>/<NoteAt> leaves that keep the prose truthful when the
 * reader transposes) are client components.
 */
import Link from "next/link";
import type { ReactNode } from "react";

import { Term } from "@/components/concepts/Term";
import { ScaleLessonProvider } from "@/components/scales/ScaleLessonProvider";
import { LessonToolbar } from "@/components/scales/LessonToolbar";
import { ScaleKeyboard } from "@/components/scales/ScaleKeyboard";
import { DegreeStrip } from "@/components/scales/DegreeStrip";
import { PlayPatternButton } from "@/components/scales/PlayPatternButton";
import { ScaleComparer } from "@/components/scales/ScaleComparer";
import { RootName, NoteAt } from "@/components/scales/LessonInline";
import {
  BLUES_DEGREES,
  BLUE_NOTE_OFFSET,
  MINOR_PENTATONIC_DEGREES,
} from "@/components/scales/notes";

// A is the guitar-blues home key — the classroom default for this scale.
const DEFAULT_ROOT_PC = 9;

const BLUES_OFFSETS = BLUES_DEGREES.map((d) => d.offset);
const PENTATONIC_OFFSETS = MINOR_PENTATONIC_DEGREES.map((d) => d.offset);

/** Degree · keys above the root · what it is, for the counting table. */
const DEGREE_ROWS: { offset: number; label: string; role: string }[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 3, label: "♭3", role: "lowered third" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 6, label: "♭5", role: "lowered fifth — the blue note" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 10, label: "♭7", role: "lowered seventh" },
];

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-10 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function Mono({ children }: { children: ReactNode }) {
  return <span className="font-mono text-foreground">{children}</span>;
}

export function BluesScaleLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC}>
      <section className="mt-8" aria-label="Blues scale lesson">
        <P>
          This page is a lesson, not a poster. Read it top to bottom; every
          section has something to press, and the whole page follows one root
          and one octave — change either and everything below changes with it.
          If the low keys are hard to hear on your speaker, use{" "}
          <Mono>Octave +</Mono> to lift the whole lesson.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="what-is-a-scale">1. First: what a scale is</H2>
        <P>
          A piano has only twelve different notes. After twelve keys the names
          start over — seven white (<Mono>C D E F G A B</Mono>) and five black
          — so a keyboard is the same twelve-note pattern repeated at higher and
          higher pitch. A <Term id="scale">scale</Term> is a short list of those
          twelve that a piece of music treats as home. Play only the notes on
          the list and everything sounds like it belongs together; the notes
          left off the list sound &ldquo;outside&rdquo; when they turn up.
        </P>
        <P>
          The keyboard below is locked to <RootName /> blues. Keys with a green
          number are on the list and play; keys with a red dot are off the list
          and stay silent. Press a few. Then press <Mono>Play</Mono> to hear the
          whole list in order, low to high and back. Tick{" "}
          <Mono>Unlock other notes</Mono> and the silent keys wake up — press
          one right next to a green key and hear how it sits outside the scale.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton label="Play the scale" offsets={BLUES_OFFSETS} />
          </LessonToolbar>
          <ScaleKeyboard degrees={BLUES_DEGREES} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="scale-degrees">2. Counting from home: scale degrees</H2>
        <P>
          Every scale has one note that feels like home: the{" "}
          <Term id="root">root</Term>. The page opened on <Mono>A</Mono>; the
          root is now <RootName />, and the picker above moves it. Musicians
          name the other notes by how far above the root they sit — those names
          are <Term id="scale-degree">scale degrees</Term>. The easiest way to
          find one is to count keys to the right of the root, black and white
          alike; each key is one{" "}
          <Term id="steps">half step</Term>.
        </P>
        <div className="mt-4 overflow-hidden rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs text-muted-foreground">
              <tr>
                <th scope="col" className="px-3 py-2 text-left font-medium">
                  Degree
                </th>
                <th scope="col" className="px-3 py-2 text-left font-medium">
                  Keys above the root
                </th>
                <th scope="col" className="px-3 py-2 text-left font-medium">
                  In <RootName />
                </th>
                <th scope="col" className="px-3 py-2 text-left font-medium">
                  What it is
                </th>
              </tr>
            </thead>
            <tbody>
              {DEGREE_ROWS.map((row) => {
                const isBlue = row.offset === BLUE_NOTE_OFFSET;
                return (
                  <tr
                    key={row.offset}
                    className={
                      isBlue
                        ? "border-t bg-orange-700/10"
                        : "border-t"
                    }
                  >
                    <td
                      className={`px-3 py-2 font-mono ${
                        isBlue ? "text-orange-600" : "text-foreground"
                      }`}
                    >
                      {row.label}
                    </td>
                    <td className="px-3 py-2 font-mono text-muted-foreground">
                      {row.offset}
                    </td>
                    <td className="px-3 py-2">
                      <NoteAt offset={row.offset} />
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">
                      {row.role}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <P>
          Why the odd names — why <Mono>♭3</Mono> and not just{" "}
          <Mono>3</Mono>? The plain numbers 1 to 7 belong to the major scale,
          the do-re-mi scale that everything else is measured against; in{" "}
          <Mono>A</Mono> it runs <Mono>A B C♯ D E F♯ G♯</Mono>. A{" "}
          <Term id="flats-and-sharps">flat</Term> sign (<Mono>♭</Mono>) in
          front of a number means &ldquo;that note, one key lower.&rdquo; So{" "}
          <Mono>♭3</Mono> in <Mono>A</Mono> is <Mono>C</Mono>, one key below the
          major scale&rsquo;s <Mono>C♯</Mono>. The blues lowers its third,
          fifth, and seventh — that lowering is what &ldquo;flattening&rdquo;
          means, and it is most of the flavour.
        </P>
        <P>
          One spelling note: the keyboard labels black keys with sharps (
          <Mono>D♯</Mono>), while blues writing spells the same key as a flat (
          <Mono>E♭</Mono>). It is one key with two names — nothing is out of
          tune. Click a chip below to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={BLUES_DEGREES}
          spotlightOffset={BLUE_NOTE_OFFSET}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="minor-pentatonic">3. Start with five notes: the minor pentatonic</H2>
        <P>
          Before the blues scale, meet the scale it is built from. Take degrees{" "}
          <Mono>1 ♭3 4 5 ♭7</Mono> — five notes — and you have the{" "}
          <Term id="pentatonic">minor pentatonic</Term> (&ldquo;penta&rdquo; is
          Greek for five). Nothing in it sits right next to anything else: every
          note is at least two keys from its neighbours, so no two notes rub
          against each other. That is why it is the first solo scale most
          guitarists learn — you can play its notes in almost any order over a
          blues or rock song and nothing sounds wrong. Press play and listen to
          how open and even it sounds.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Play the minor pentatonic"
              offsets={PENTATONIC_OFFSETS}
            />
          </LessonToolbar>
          <DegreeStrip degrees={MINOR_PENTATONIC_DEGREES} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-blue-note">4. Add one note: the blue note</H2>
        <P>
          Now squeeze one more key in: the <Mono>♭5</Mono> — six keys above
          the root, sitting between the <Mono>4</Mono> and the <Mono>5</Mono>{" "}
          with no gap on either side. In <RootName /> that key is{" "}
          <NoteAt offset={BLUE_NOTE_OFFSET} />. That single note is the entire
          difference between the minor pentatonic and the blues scale. Five
          notes become six: <Mono>1 ♭3 4 ♭5 5 ♭7</Mono>.
        </P>
        <P>
          Flip the toggle below and watch which key changes — a red dot (locked
          out) becomes a green <Mono>♭5</Mono> (in the scale). Play both
          versions back to back and listen for the extra step in the middle of
          the run. That crunch is the blues.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{
            id: "pentatonic",
            name: "Minor pentatonic",
            degrees: MINOR_PENTATONIC_DEGREES,
          }}
          b={{
            id: "blues",
            name: "Blues scale",
            degrees: BLUES_DEGREES,
            spotlightOffset: BLUE_NOTE_OFFSET,
          }}
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="why-blue">5. Why it sounds &ldquo;blue&rdquo;</H2>
        <P>
          The <Mono>♭5</Mono> is restless for two reasons. First, its distance
          from the root — six keys, exactly half of the twelve-key octave — is
          the interval musicians call a <Term id="tritone">tritone</Term>, the
          most unsettled sound in Western music. Second, it is wedged between two
          notes that are already in the scale, so it never gets to sit still: it
          wants to slide up into the <Mono>5</Mono> or fall back to the{" "}
          <Mono>4</Mono>. Press <Mono>Hear the slide</Mono> to hear{" "}
          <Mono>4 → ♭5 → 5</Mono>.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear the slide"
              offsets={[5, BLUE_NOTE_OFFSET, 7]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>
        <P>
          Blues singers and guitarists do not treat this as a fixed key at all.
          They bend into it, landing in the crack between{" "}
          <NoteAt offset={BLUE_NOTE_OFFSET} /> and <NoteAt offset={7} />. Those
          in-between pitches are <Term id="blue-notes">blue notes</Term>, and
          they are older than the blues — they come out of work songs, field
          hollers, and spirituals. A piano cannot bend, so the blues scale
          freezes the bend onto the nearest key. What you are playing here is the
          piano&rsquo;s honest approximation of a note that, on a voice or a
          guitar, lives between the keys.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">6. What to do with it</H2>
        <P>
          You now know the whole scale. Pick the root that matches your song —
          guitar blues usually lives in <Mono>A</Mono> or <Mono>E</Mono>; the
          picker at the top moves everything. Keep the lock on and play the green
          keys in any order: with the lock on there are no wrong notes. Land on{" "}
          <Mono>1</Mono> or <Mono>5</Mono> when you want a phrase to feel
          finished, and treat <Mono>♭5</Mono> as a note you pass through, not one
          you stop on. Then take it to a{" "}
          <Term id="twelve-bar-blues">12-bar blues</Term> —{" "}
          <Link
            href="/genres/blues"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            What is the blues?
          </Link>{" "}
          covers the form and the shuffle the scale sits on.
        </P>
      </section>
    </ScaleLessonProvider>
  );
}
