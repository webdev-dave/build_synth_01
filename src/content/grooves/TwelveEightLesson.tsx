/**
 * 12/8, taught as "four big beats with a triplet inside each" — the same
 * bar as 4/4, grouped in threes. Count first, then re-fence the same
 * eighths as 4/4, 6/8 and 12/8 so compound meter is heard as a grouping
 * rule, then hear the slow blues that lives here.
 */
import { Term } from "@/components/concepts/Term";
import { AccentStrip } from "@/components/grooves/AccentStrip";
import { BarFence } from "@/components/grooves/BarFence";
import { CountAlong } from "@/components/grooves/CountAlong";
import { GroovePlayer } from "@/components/grooves/GroovePlayer";
import { GrooveProvider } from "@/components/grooves/GrooveProvider";
import { GrooveTeaser } from "@/components/grooves/GrooveTeaser";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { getGroove } from "@/lib/grooves/registry";

export function TwelveEightLesson() {
  const meter = getGroove("twelve-eight");
  const slow = getGroove("slow-blues");
  if (!meter || !slow) return null;

  return (
    <GrooveProvider groove={meter}>
      <section className="mt-8" aria-label="12/8 lesson">
        <P>
          Read this page top to bottom; every section has something to press.
          If you have not met <LessonLink href="/rhythm/four-four">4/4</LessonLink>{" "}
          yet, start there — this page is 4/4 with one twist.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-count">1. ONE trip-let TWO trip-let</H2>
        <P>
          A <Term id="time-signature">time signature</Term> of{" "}
          <Mono>12/8</Mono> says twelve eighth notes to a bar. Nobody counts
          to twelve. The eighths come in <em>threes</em>, so what you feel is
          four big beats, each with three little notes inside —{" "}
          <Mono>ONE trip-let TWO trip-let THREE trip-let FOUR trip-let</Mono>.
          Tap your foot on the numbers only. Press play: the click falls on
          the four big beats, heaviest on the first, and the count runs
          underneath.
        </P>
        <div className="mt-4 space-y-3">
          <GroovePlayer feel={false} />
          <CountAlong click={false} />
        </div>
        <P>
          Musicians call this <em>compound</em> meter: the beat divides in
          three rather than two. Four beats a bar makes it compound{" "}
          <em>quadruple</em> — a 4/4 bar wearing triplets. The lean is the
          same as 4/4&rsquo;s: hard on <Mono>1</Mono>, a little on{" "}
          <Mono>3</Mono>.
        </P>
        <AccentStrip className="mt-4" rows={["bar"]} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="fence">2. The same eighths, grouped in threes</H2>
        <P>
          Below is a stream of even eighth notes and nothing else. Fenced as{" "}
          <Mono>4/4</Mono> they pair up: two to a beat. Fenced as{" "}
          <Mono>12/8</Mono> the <em>same notes</em> gather in threes and the
          click moves to every third one — four beats to the bar, three
          eighths each. <Mono>6/8</Mono> is the same threes with the bar cut
          in half: two beats, then a new one. Play, then change the fence
          while it runs and listen to the click find its new places.
        </P>
        <BarFence className="mt-4" defaultFence="12/8" fences={["4/4", "6/8", "12/8"]} bpm={92} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="where-it-lives">3. Where 12/8 lives</H2>
        <P>
          Slow blues, doo-wop ballads, and gospel sway in 12/8. Here is the
          slow blues groove inside the bar you have just counted: the hi-hat
          plays all twelve eighths, the snare answers on <Mono>2</Mono> and{" "}
          <Mono>4</Mono>, the kick holds <Mono>1</Mono> and <Mono>3</Mono>.
          It is a <LessonLink href="/rhythm/shuffle">shuffle</LessonLink> slowed
          down until its skipped middle note is played.
        </P>
        <GrooveTeaser className="mt-4" groove={slow} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">4. Where it goes next</H2>
        <P>
          The full slow-blues groove, with its own grid and comparer, is at{" "}
          <LessonLink href="/rhythm/slow-blues">the slow blues page</LessonLink>.
          The chart it carries is the{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>,
          and how blues uses meter, rhythm and harmony together is on{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink>
        </P>

        <Sources
          items={[
            {
              label: "Time signature § Simple versus compound — Wikipedia (12/8 as compound quadruple; 6/8 as compound duple)",
              url: "https://en.wikipedia.org/wiki/Time_signature",
            },
            {
              label: "Beat (music) § Division — Wikipedia (simple and compound: beats split in two or three)",
              url: "https://en.wikipedia.org/wiki/Beat_(music)",
            },
          ]}
        />
      </section>
    </GrooveProvider>
  );
}
