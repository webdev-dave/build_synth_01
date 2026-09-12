/**
 * The slow blues in 12/8 — the shuffle with nothing left out. The page
 * leads with the count (ONE trip-let), sets the 12/8 grid beside the
 * shuffle on one clock so the reader hears they share a bar, then re-fences
 * the same eighths as 4/4 and 12/8 to show the meter is a grouping, not a
 * new set of notes.
 */
import { Term } from "@/components/concepts/Term";
import { AccentStrip } from "@/components/grooves/AccentStrip";
import { BarFence } from "@/components/grooves/BarFence";
import { BeatComparer } from "@/components/grooves/BeatComparer";
import { CountAlong } from "@/components/grooves/CountAlong";
import { GrooveGrid } from "@/components/grooves/GrooveGrid";
import { GroovePlayer } from "@/components/grooves/GroovePlayer";
import { GrooveProvider } from "@/components/grooves/GrooveProvider";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { getGroove } from "@/lib/grooves/registry";

export function SlowBluesLesson() {
  const slow = getGroove("slow-blues");
  const shuffle = getGroove("shuffle");
  if (!slow || !shuffle) return null;

  return (
    <GrooveProvider groove={slow}>
      <section className="mt-8" aria-label="Slow blues lesson">
        <P>
          Read this page top to bottom; every section has something to press.
          One slow beat runs the whole page, and the dot that lights is the
          drum that is sounding.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="four-beats-of-three">1. Four beats, three notes each</H2>
        <P>
          Count this one <Mono>ONE trip-let TWO trip-let THREE trip-let FOUR
          trip-let</Mono>. There are still four beats in the bar — tap your
          foot on the numbers — but each beat now holds <em>three</em> notes
          instead of two. The hi-hat plays all twelve; the snare keeps{" "}
          <Mono>2</Mono> and <Mono>4</Mono> and the kick <Mono>1</Mono> and{" "}
          <Mono>3</Mono>, exactly as in a{" "}
          <LessonLink href="/rhythm/backbeat">backbeat</LessonLink>. Written
          down, twelve eighth notes to a bar is called{" "}
          <LessonLink href="/rhythm/twelve-eight">12/8</LessonLink>, and it is
          the time signature of nearly every slow blues.
        </P>
        <div className="mt-4 space-y-3">
          <GroovePlayer />
          <CountAlong />
          <GrooveGrid />
        </div>
        <P>
          Notice the tempo: around sixty beats a minute. Slow is the point. At
          this speed every one of the three notes is heard on its own, and the
          bar has room to breathe — which is where a singer bends a note and a
          guitarist leaves a gap.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-shuffle-written-out">2. The shuffle, written out</H2>
        <P>
          A <Term id="shuffle">shuffle</Term> splits each beat long–short:
          the first and third notes of a triplet, with the middle one silent.
          Slow it down and play the middle note too, and you have the 12/8
          groove above. The comparer sets the two on one clock: same four
          beats, same snare and kick; the only difference is that the slow
          blues fills in the note the shuffle skips. Pick <Mono>Both</Mono>{" "}
          and the hats lock on the first and third of every triplet and part
          on the second.
        </P>
        <BeatComparer className="mt-4" a={slow} b={shuffle} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="fence">3. Same eighths, new fence</H2>
        <P>
          Here is a stream of even eighth notes with no drums at all. Fence
          them as <Mono>4/4</Mono> and they group in twos — a beat is two
          eighths. Fence them as <Mono>12/8</Mono> and the <em>same notes</em>{" "}
          group in threes — a beat is three eighths, and there are still four
          beats in the bar. The click marks each beat and lands hardest on
          every <Mono>1</Mono>. Nothing about the notes changed; only where
          the bar lines fell.
        </P>
        <BarFence className="mt-4" defaultFence="12/8" fences={["4/4", "12/8"]} bpm={92} />
        <P>
          That is all a meter is: a rule for grouping. 12/8 is the rule
          &ldquo;four beats, three each&rdquo;. The bar still leans on{" "}
          <Mono>1</Mono> and a little on <Mono>3</Mono>, and the drums still
          argue for <Mono>2</Mono> and <Mono>4</Mono>:
        </P>
        <AccentStrip className="mt-4" />

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">4. Where it goes next</H2>
        <P>
          Speed this groove up and drop the middle note of each three and you
          are back at the <LessonLink href="/rhythm/shuffle">shuffle</LessonLink>.
          The chart a slow blues almost always carries is the{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>,
          and the sound over it is the{" "}
          <LessonLink href="/scales/blues-scale">blues scale</LessonLink>. How
          the three fit together into a song is on{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink>
        </P>

        <Sources
          items={[
            {
              label: "Time signature § Simple versus compound — Wikipedia (12/8 as compound quadruple: four dotted-quarter beats of three eighths)",
              url: "https://en.wikipedia.org/wiki/Time_signature",
            },
            {
              label: "Swing (jazz performance style) — Wikipedia (the long–short division as the first and third notes of a triplet)",
              url: "https://en.wikipedia.org/wiki/Swing_(jazz_performance_style)",
            },
          ]}
        />
      </section>
    </GrooveProvider>
  );
}
