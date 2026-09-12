/**
 * The backbeat, taught from zero — as an argument between the bar and the
 * drums. The bar says ONE two THREE four; the snare says two and FOUR. The
 * accent strip shows the disagreement, the click lets the reader hear the
 * bar's side, and the comparer sets it against the shuffle it replaced.
 */
import { Term } from "@/components/concepts/Term";
import { AccentStrip } from "@/components/grooves/AccentStrip";
import { BeatComparer } from "@/components/grooves/BeatComparer";
import { CountAlong } from "@/components/grooves/CountAlong";
import { GrooveGrid } from "@/components/grooves/GrooveGrid";
import { GroovePlayer } from "@/components/grooves/GroovePlayer";
import { GrooveProvider } from "@/components/grooves/GrooveProvider";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { getGroove } from "@/lib/grooves/registry";

export function BackbeatLesson() {
  const backbeat = getGroove("backbeat");
  const shuffle = getGroove("shuffle");
  if (!backbeat || !shuffle) return null;

  return (
    <GrooveProvider groove={backbeat}>
      <section className="mt-8" aria-label="Backbeat lesson">
        <P>
          Read this page top to bottom; every section has something to press.
          One beat runs the whole page, and the dot that lights is the drum
          that is sounding.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-bar-says">1. What the bar says</H2>
        <P>
          A bar of four beats is not four equal things. Count it aloud —{" "}
          <Mono>ONE two THREE four</Mono> — and you already lean on the one
          and a little on the three. That lean is built into the{" "}
          <LessonLink href="/rhythm/four-four">meter</LessonLink> itself, before
          any drum is hit. Tick <Mono>Click on the beat</Mono> and the count
          plays that way: a heavier click on <Mono>1</Mono>, lighter on the
          rest.
        </P>
        <div className="mt-4 space-y-3">
          <GroovePlayer />
          <CountAlong />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-drums-say">2. What the drums say</H2>
        <P>
          Now the pattern. The hi-hat plays every half beat, even. The kick
          holds <Mono>1</Mono> and <Mono>3</Mono>, agreeing with the bar. And
          the snare cracks on <Mono>2</Mono> and <Mono>4</Mono> — the beats
          the bar treats as weak. That contradiction is the{" "}
          <Term id="backbeat">backbeat</Term>: the bar pushes on one, the
          snare answers on two and four, and the tug between them is what
          makes a rock beat feel like it is <em>driving</em> rather than
          marching. The two rows under the grid draw the argument: the
          bar&rsquo;s weight, then the drums&rsquo;.
        </P>
        <div className="mt-4 space-y-4">
          <GrooveGrid />
          <AccentStrip />
        </div>
        <P>
          Mute the snare (click its label) and the beat goes polite — kick and
          hats agreeing with the bar. Bring it back and the drive returns. The
          snare on 2 and 4 is doing almost all of the work.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="straight-or-swung">3. Straight, or swung</H2>
        <P>
          The backbeat&rsquo;s eighths are <em>straight</em>: each beat split
          exactly in half. Play the same hits long–short instead and you have
          the blues <Term id="shuffle">shuffle</Term> — identical dots, a
          different clock. Compare them here; on <Mono>Both</Mono> the two hats
          agree on every beat and disagree on every &ldquo;&amp;&rdquo;. The
          shuffle is the older feel — the boogie and jump-blues records the
          backbeat first cracked on were swung — and the straight version is
          what rock settled into.
        </P>
        <BeatComparer className="mt-4" a={backbeat} b={shuffle} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="build">4. Build it yourself</H2>
        <P>
          The grid above is a step sequencer. Tap a cell to add a hit or
          remove one; hold <Mono>Shift</Mono> for a quiet ghost note. Two
          classic moves: add a kick on the &ldquo;&amp;&rdquo; of 3 for a
          pushier rock beat, or ghost the snare on the &ldquo;&amp;&rdquo; of 2
          and the &ldquo;&amp;&rdquo; of 4 for a funk lean. The{" "}
          <Mono>Reset</Mono> link brings the backbeat back.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">5. Where it goes next</H2>
        <P>
          The backbeat under a{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>{" "}
          chart is early rock and roll; under a swung clock it is the blues{" "}
          <LessonLink href="/rhythm/shuffle">shuffle</LessonLink>. Slowed to a
          crawl with every triplet note played, it becomes the{" "}
          <LessonLink href="/rhythm/slow-blues">slow blues in 12/8</LessonLink>.
          Reggae takes the same four beats and empties the one — that page
          arrives with the reggae genre.
        </P>

        <Sources
          items={[
            {
              label: "Beat (music) § Backbeat — Wikipedia (accent on 2 and 4; Back Beat Boogie, Good Rockin' Tonight)",
              url: "https://en.wikipedia.org/wiki/Beat_(music)#Backbeat",
            },
            {
              label: "One drop rhythm — Wikipedia (the standard rock pattern in notation)",
              url: "https://en.wikipedia.org/wiki/One_drop_rhythm",
            },
          ]}
        />
      </section>
    </GrooveProvider>
  );
}
