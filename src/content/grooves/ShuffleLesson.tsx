/**
 * The shuffle, taught from zero.
 *
 * Assumes the reader can tap along to a song and nothing more: not what a
 * bar is, not what "eighths" are. The page opens *straight* on purpose and
 * arrives at the shuffle by dragging one slider, so the feel is heard as a
 * change to something the reader already has, not as a new pattern. One
 * clock, one kit, one feel value for the whole page — the dots and the
 * sound move together.
 *
 * Server component: prose is static HTML; the widgets are client islands.
 */
import { Term } from "@/components/concepts/Term";
import { AccentStrip } from "@/components/grooves/AccentStrip";
import { BeatComparer } from "@/components/grooves/BeatComparer";
import { CountAlong } from "@/components/grooves/CountAlong";
import { FeelControl } from "@/components/grooves/FeelControl";
import { GrooveGrid } from "@/components/grooves/GrooveGrid";
import { GroovePlayer } from "@/components/grooves/GroovePlayer";
import { GrooveProvider } from "@/components/grooves/GrooveProvider";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { getGroove } from "@/lib/grooves/registry";
import { STRAIGHT } from "@/lib/music/clock";

export function ShuffleLesson() {
  const shuffle = getGroove("shuffle");
  const backbeat = getGroove("backbeat");
  if (!shuffle || !backbeat) return null;

  return (
    <GrooveProvider groove={shuffle} swing={STRAIGHT}>
      <section className="mt-8" aria-label="Shuffle lesson">
        <P>
          This page is a lesson, not a poster. Read it top to bottom; every
          section has something to press. The whole page runs on one beat —
          the tempo and the feel you set anywhere hold everywhere — and the
          dot that lights is always the drum that is sounding.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-skeleton">1. Four beats and the space between</H2>
        <P>
          A <em>bar</em> is a small box of time, here four <em>beats</em> —
          the pulse you tap your foot to. Drummers split each beat in two and
          count the halves <Mono>1 &amp; 2 &amp; 3 &amp; 4 &amp;</Mono>: the
          number is the beat, the &ldquo;&amp;&rdquo; is the space between.
          Below, the top row is the hi-hat playing every half; under it the
          snare cracks on <Mono>2</Mono> and <Mono>4</Mono> and the kick holds{" "}
          <Mono>1</Mono> and <Mono>3</Mono>. That is the skeleton of nearly
          every rock and blues beat. Press play and count along.
        </P>
        <div className="mt-4 space-y-3">
          <GroovePlayer />
          <CountAlong />
          <GrooveGrid drumMachineLink />
        </div>
        <P>
          Right now the halves are <em>even</em>: the &ldquo;&amp;&rdquo; sits
          exactly halfway between the beats. Drummers call this{" "}
          <em>straight eighths</em>. It marches.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="long-short">2. Long–short</H2>
        <P>
          Now drag <Mono>Feel</Mono> toward <Mono>Shuffle</Mono> and keep the
          beat playing. Nothing is added and nothing is taken away — the same
          hits — but every &ldquo;&amp;&rdquo; slides <em>late</em>, to about
          two-thirds of the way through its beat. Each beat is now split{" "}
          <em>long–short</em> instead of half–half, and the march turns into a
          walk. That lopsided split is the <Term id="shuffle">shuffle</Term>,
          and it is the default feel of the blues.
        </P>
        <div className="mt-4 space-y-3">
          <FeelControl />
          <GrooveGrid underlay={3} />
        </div>
        <P>
          The faint lines behind the dots divide each beat in three. At{" "}
          <Mono>Shuffle</Mono> the late &ldquo;&amp;&rdquo; lands exactly on
          the third of those lines — a shuffle is a <em>triplet</em> with its
          middle note left out, which is why musicians also call it a triplet
          feel or <em>swung</em> eighths. Push past it to{" "}
          <Mono>Hard shuffle</Mono> and the short note gets shorter still — a
          dotted-eighth, sixteenth snap that some Texas blues and early rock
          and roll use. Straight, shuffle, hard: one slider, not three beats.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-hits">3. The same hits, two feels</H2>
        <P>
          Here the point is made side by side. The shuffle and the{" "}
          <Term id="backbeat">backbeat</Term> below are the <em>identical</em>{" "}
          pattern — kick 1 and 3, snare 2 and 4, hat on every half — one played
          long–short, one played even. Switch between them while the clock
          runs; pick <Mono>Both</Mono> and the two hats fall out of step on
          every &ldquo;&amp;&rdquo; and back in on every beat. Rock and roll grew
          up on the first and settled on the second; the notes never moved.
        </P>
        <BeatComparer className="mt-4" a={shuffle} b={backbeat} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hats-alone">4. Hear it in the hats</H2>
        <P>
          The feel lives in the hi-hat. Back in the grid above, click the{" "}
          <Mono>Snare</Mono> and <Mono>Kick</Mono> labels to mute them and
          listen to the hats on their own: long–short, long–short, the ride
          pattern a blues drummer plays for a whole night. Unmute the snare and
          hear how its <Mono>2</Mono> and <Mono>4</Mono> sit against that lean.
          The row below shows the same argument as bars: the bar wants weight
          on <Mono>1</Mono> and <Mono>3</Mono>; the drums put it on{" "}
          <Mono>2</Mono> and <Mono>4</Mono>.
        </P>
        <AccentStrip className="mt-4" />

        {/* ---------------------------------------------------------------- */}
        <H2 id="build">5. Build it yourself</H2>
        <P>
          The grid is a step sequencer: tap any empty cell to add a hit, tap a
          dot to remove it, hold <Mono>Shift</Mono> while tapping for a quiet
          ghost note. Try adding a kick on the &ldquo;&amp;&rdquo; of 2, or a
          second snare on the &ldquo;&amp;&rdquo; of 4 — every addition still
          shuffles, because the feel belongs to the clock, not to the hits. A{" "}
          <Mono>Reset</Mono> link appears once you have changed something.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">6. Where it goes next</H2>
        <P>
          Slow the shuffle right down and the missing middle note becomes
          audible; write it out and you have a{" "}
          <LessonLink href="/rhythm/slow-blues">slow blues in 12/8</LessonLink>{" "}
          — four beats, three notes each. The chart the shuffle usually carries
          is the{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>,
          whose player now has a <Mono>Shuffle</Mono> switch of its own. And the
          count you have been saying — four beats to a bar — is a{" "}
          <LessonLink href="/rhythm/four-four">meter</LessonLink>, taught on
          its own page.
        </P>

        <Sources
          items={[
            {
              label: "Swing (jazz performance style) — Wikipedia (swing as a rhythmic style; the long–short division and the triplet feel)",
              url: "https://en.wikipedia.org/wiki/Swing_(jazz_performance_style)",
            },
            {
              label: "Beat (music) § Backbeat — Wikipedia (the accent on 2 and 4)",
              url: "https://en.wikipedia.org/wiki/Beat_(music)#Backbeat",
            },
            {
              label: "One drop rhythm — Wikipedia (the standard rock pattern in notation: hats on eighths, snare 2 and 4, kick 1 and 3)",
              url: "https://en.wikipedia.org/wiki/One_drop_rhythm",
            },
          ]}
        />
      </section>
    </GrooveProvider>
  );
}
