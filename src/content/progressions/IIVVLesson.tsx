/**
 * I–IV–V, taught from zero: three chords built on one scale, why those
 * three cover every note of it, and the pull that makes V want to go home.
 * The 12-bar lesson assumes this; this page owns it.
 *
 * Server component; widgets and inline key/chord names are client leaves.
 */
import { Term } from "@/components/concepts/Term";
import { ChordScaleOverlay } from "@/components/progressions/ChordScaleOverlay";
import { ChordSounder } from "@/components/progressions/ChordSounder";
import { ProgressionChart } from "@/components/progressions/ProgressionChart";
import { ChordName, ChordTones, KeyName } from "@/components/progressions/ProgressionInline";
import { ProgressionPlayer } from "@/components/progressions/ProgressionPlayer";
import { ProgressionProvider } from "@/components/progressions/ProgressionProvider";
import { ProgressionToolbar } from "@/components/progressions/ProgressionToolbar";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { chord } from "@/lib/music/chords";
import { degreesOf } from "@/lib/music/scaleCatalog";
import { getProgression } from "@/lib/progressions/registry";

// A, to match the 12-bar and blues-scale pages: the same three roots there.
const DEFAULT_KEY_PC = 9;
const MAJOR_DEGREES = degreesOf("major");

const I = chord(0, "major", "I");
const IV = chord(5, "major", "IV");
const V = chord(7, "major", "V");

export function IIVVLesson() {
  const progression = getProgression("i-iv-v");
  if (!progression) return null;

  return (
    <ProgressionProvider
      progression={progression}
      degrees={MAJOR_DEGREES}
      defaultKeyRootPc={DEFAULT_KEY_PC}
    >
      <section className="mt-8" aria-label="I–IV–V lesson">
        <P>
          Read it top to bottom; every section has something to press. The
          whole page follows one key — pick another below and every chord
          name, chart cell and keyboard changes with it. Chords sound on a
          soft electric organ.
        </P>
        <div className="mt-4">
          <ProgressionToolbar keyPicker />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="three-from-one-scale">1. Three chords from one scale</H2>
        <P>
          Start from the <LessonLink href="/scales/major-scale">major scale</LessonLink>{" "}
          — seven notes, numbered 1 to 7 from the <Term id="root">root</Term>.
          Build a <Term id="triad">triad</Term> on note 1 (take it, skip one,
          take the next, skip, take) and you get the chord musicians call{" "}
          <Mono>I</Mono>: in <KeyName />, <ChordTones chord={I} />. Do the
          same on note 4 and you get <Mono>IV</Mono>, <ChordTones chord={IV} />;
          on note 5, <Mono>V</Mono>, <ChordTones chord={V} />. The Roman
          numeral is the <Term id="scale-degree">scale degree</Term> the chord
          stands on, so the numerals mean the same thing in every key while
          the letters change.
        </P>
        <P>
          Press the three in turn and watch the ringed keys accumulate. By the
          third chord every note of the scale is ringed — seven notes, and
          these three chords between them hold all of them. That is the whole
          reason so many songs need nothing else: any melody that stays in the
          key can be harmonised by one of <Mono>I</Mono>, <Mono>IV</Mono> or{" "}
          <Mono>V</Mono>.
        </P>
        <ChordSounder className="mt-4" chords={[I, IV, V]} union />

        {/* ---------------------------------------------------------------- */}
        <H2 id="home-away-pull">2. Home, away, and the pull</H2>
        <P>
          The three do not feel alike. <Mono>I</Mono> is home — music rests
          there. <Mono>IV</Mono> is one step away: warm, open, a place to
          stand for a while. <Mono>V</Mono> is the far side of the key. It
          contains the scale&rsquo;s seventh note, the one that sits a single
          key below the root and leans up into it, so a <Mono>V</Mono> chord
          wants to go home harder than anything else in the key. That is why
          it is called the <Term id="dominant">dominant</Term>, and why the
          plainest chart in music goes out and comes back:{" "}
          <ChordName numeral="I" /> · <ChordName numeral="IV" /> ·{" "}
          <ChordName numeral="V" /> · <ChordName numeral="I" />.
        </P>
        <P>
          Press <Mono>Play the chart</Mono>. The lit cell is the bar that is
          sounding; the outlined one is next. Listen for the landing on the
          last bar — that <Mono>V → I</Mono> is a <Term id="cadence">cadence</Term>,
          the sound of a sentence ending. Click any cell to hear that chord
          alone; while it plays, clicking jumps there.
        </P>
        <div className="mt-4 space-y-3">
          <ProgressionPlayer voicing feel />
          <ProgressionChart />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="under-the-scale">3. The chords under the scale</H2>
        <P>
          The keyboard below shows both layers at once: green numbers are the{" "}
          <KeyName /> major scale, fixed; ringed keys are the chord that is
          sounding, moving as the chart plays. Every ringed key is green —
          these chords never leave the scale — and the rings visit every green
          key across the four bars. Press a key while a chord sounds and the
          line under the keyboard says what that note is doing right now.{" "}
          <Mono>Chord tones</Mono> locks the keys to the current bar&rsquo;s
          three notes so you can play along and never be wrong;{" "}
          <Mono>Major scale</Mono> locks to the scale instead.
        </P>
        <ChordScaleOverlay className="mt-4" scaleLabel="Major scale" />

        {/* ---------------------------------------------------------------- */}
        <H2 id="sevenths">4. Add a seventh and it is the blues</H2>
        <P>
          Tick <Mono>+7</Mono> below and one more note joins each chord — the
          note ten keys above its root. <ChordName numeral="I" /> becomes{" "}
          <ChordName numeral="I7" />, and each chord now leans instead of
          sitting still. Those are exactly the chords of the{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>,
          which is made of nothing but these three, every one a seventh,
          arranged over twelve bars. Untick it and you have the three chords of
          folk, country and early rock and roll.
        </P>
        <ChordSounder className="mt-4" chords={[I, IV, V]} seventhToggle />

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">5. Where it goes next</H2>
        <P>
          You can now name the three primary chords of any key and hear which
          one is home. The 12-bar blues is this progression stretched over
          twelve bars with sevenths on everything:{" "}
          <LessonLink href="/progressions/twelve-bar-blues">What are the 12-bar blues chords?</LessonLink>.
          Rock plays the same three roots as two-note{" "}
          <LessonLink href="/progressions/power-chord">power chords</LessonLink>{" "}
          under a <LessonLink href="/rhythm/backbeat">backbeat</LessonLink>.
          And the four-chord loop of most pop —{" "}
          <LessonLink href="/progressions/i-v-vi-iv">I–V–vi–IV</LessonLink> —
          is these three plus the minor chord on the sixth degree. Hear all of
          it stacked on{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink> and{" "}
          <LessonLink href="/genres/rock">What makes rock sound like rock?</LessonLink>
        </P>

        <Sources
          items={[
            {
              label:
                "Three-chord song — Wikipedia (songs built on I, IV and V; the 12-bar blues as the common case)",
              url: "https://en.wikipedia.org/wiki/Three-chord_song",
            },
            {
              label:
                "Primary triad — Wikipedia (tonic, subdominant and dominant triads on degrees 1, 4 and 5; the other triads as auxiliaries)",
              url: "https://en.wikipedia.org/wiki/Primary_triad",
            },
          ]}
        />
      </section>
    </ProgressionProvider>
  );
}
