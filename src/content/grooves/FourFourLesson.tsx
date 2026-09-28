/**
 * 4/4, taught from zero — the fence most music sits inside. The page leads
 * with the bare count (the meter *is* the click), re-fences the same notes
 * as 3/4 and 4/4 so the bar line is heard doing its job, then hands the
 * bar to the drums and shows them arguing with it.
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

export function FourFourLesson() {
  const meter = getGroove("four-four");
  const backbeat = getGroove("backbeat");
  if (!meter || !backbeat) return null;

  return (
    <GrooveProvider groove={meter}>
      <section className="mt-8" aria-label="4/4 lesson">
        <P>
          Read this page top to bottom; every section has something to press.
          There are no drums here until the end — a meter is what is there
          before the drums arrive.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-count">1. ONE two THREE four</H2>
        <P>
          Music divides time into <em>beats</em> — the steady pulse you tap —
          and groups the beats into <em>bars</em>. A <Term id="time-signature">
          time signature</Term> says how: the top number is how many beats a
          bar holds, the bottom number what kind of note gets one beat. In{" "}
          <Mono>4/4</Mono> a bar holds four beats and a quarter note is one of
          them. Press play: a click on every beat, heavier on the first. Say
          the numbers with it.
        </P>
        <div className="mt-4 space-y-3">
          <GroovePlayer feel={false} />
          <CountAlong click={false} />
        </div>
        <P>
          Hear how the count is not flat. The bar leans on <Mono>1</Mono> —
          the <em>downbeat</em> — and a little on <Mono>3</Mono>; <Mono>2</Mono>{" "}
          and <Mono>4</Mono> are the light steps in between. That shape is
          the whole personality of 4/4, and the reason it is called{" "}
          <em>common time</em>: most pop, rock, blues, and dance music lives
          inside it.
        </P>
        <AccentStrip className="mt-4" rows={["bar"]} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="fence">2. Move the bar lines</H2>
        <P>
          A meter is a grouping rule, not a set of notes. Below is a run of
          even notes with no drums. Fence it as <Mono>4/4</Mono> and the click
          lands hard every four beats; switch to <Mono>3/4</Mono> and the same
          notes group in threes — a waltz appears without a single note
          moving. <Mono>6/8</Mono> lasts as long as a bar of 3/4 but groups in
          two threes, and <Mono>12/8</Mono> is four beats again, each holding
          three. Play, then flip the fence while it runs.
        </P>
        <BarFence className="mt-4" defaultFence="4/4" bpm={100} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-drums-argue">3. Then the drums argue</H2>
        <P>
          The bar says ONE two THREE four. Rock drums answer with the snare
          on <Mono>2</Mono> and <Mono>4</Mono> — the{" "}
          <LessonLink href="/rhythm/backbeat">backbeat</LessonLink> — and the
          tension between what the bar wants and what the drums do is most of
          what a groove <em>is</em>. Here is the backbeat inside the 4/4 you
          have just counted:
        </P>
        <GrooveTeaser className="mt-4" groove={backbeat} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">4. Where it goes next</H2>
        <P>
          Split each beat long–short and 4/4 becomes the blues{" "}
          <LessonLink href="/rhythm/shuffle">shuffle</LessonLink>; write the
          three-way split out and it is{" "}
          <LessonLink href="/rhythm/twelve-eight">12/8</LessonLink>. Twelve
          bars of 4/4 in a particular order is the{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>.
          The <LessonLink href="/piano-roll">piano roll</LessonLink> lets you
          re-fence any song in the library.
        </P>

        <Sources
          items={[
            {
              label: "Time signature — Wikipedia (what the two numbers mean; common time; simple versus compound)",
              url: "https://en.wikipedia.org/wiki/Time_signature",
            },
            {
              label: "Beat (music) — Wikipedia (downbeat, on-beats and off-beats, the backbeat)",
              url: "https://en.wikipedia.org/wiki/Beat_(music)",
            },
          ]}
        />
      </section>
    </GrooveProvider>
  );
}
