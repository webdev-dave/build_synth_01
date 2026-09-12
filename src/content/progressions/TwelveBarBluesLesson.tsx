/**
 * The 12-bar blues, taught from zero.
 *
 * Assumes the reader has met the blues scale (or can follow the link) but
 * knows nothing about chords: not what a triad is, not what "IV" means.
 * Each section introduces one idea and puts the widget that *plays* that
 * idea directly under it. Key, octave, variants, lock, and the one clock
 * are page-wide through ProgressionProvider, so "pick a key at the top"
 * really transposes every chart cell, button, and keyboard below — and the
 * bar that is lit is always the bar that is sounding.
 *
 * Server component: the prose ships in static HTML. Only the widgets (and
 * the <KeyName>/<ChordName> leaves that keep the prose truthful when the
 * reader transposes) are client components.
 */
import { Term } from "@/components/concepts/Term";
import { ChordScaleOverlay } from "@/components/progressions/ChordScaleOverlay";
import { ChordSounder } from "@/components/progressions/ChordSounder";
import { ProgressionChart } from "@/components/progressions/ProgressionChart";
import { ChordName, ChordTones, KeyName } from "@/components/progressions/ProgressionInline";
import { ProgressionPlayer } from "@/components/progressions/ProgressionPlayer";
import { ProgressionProvider } from "@/components/progressions/ProgressionProvider";
import { ProgressionToolbar } from "@/components/progressions/ProgressionToolbar";
import { VariantToggles } from "@/components/progressions/VariantToggles";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { BLUES_DEGREES } from "@/components/scales/notes";
import { chord } from "@/lib/music/chords";
import { getProgression } from "@/lib/progressions/registry";

// A is the guitar-blues home key — matches /scales/blues-scale, so the genre
// page's scale teaser and harmony teaser open in the same key.
const DEFAULT_KEY_PC = 9;

const I = chord(0, "major", "I");
const IV = chord(5, "major", "IV");
const V = chord(7, "major", "V");

export function TwelveBarBluesLesson() {
  const progression = getProgression("twelve-bar-blues");
  if (!progression) return null;

  return (
    <ProgressionProvider
      progression={progression}
      degrees={BLUES_DEGREES}
      defaultKeyRootPc={DEFAULT_KEY_PC}
    >
      <section className="mt-8" aria-label="12-bar blues lesson">
        <P>
          This page is a lesson, not a poster. Read it top to bottom; every
          section has something to press, and the whole page follows one key —
          pick a different one below and every chord name, chart cell, and
          keyboard changes with it. Chords sound on a soft electric organ; if
          the low keys are hard to hear on your speaker, use{" "}
          <Mono>Octave +</Mono> beside any keyboard.
        </P>
        <div className="mt-4">
          <ProgressionToolbar keyPicker />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="a-chord">1. A chord, here</H2>
        <P>
          A <Term id="scale">scale</Term> is notes played one after another; a
          chord is notes played <em>at once</em>. The simplest useful chord is
          a <Term id="triad">triad</Term>: pick a <Term id="root">root</Term>,
          skip a scale note, take the next, skip again, take the next. Three
          notes, stacked — in <KeyName /> that is{" "}
          <ChordTones chord={I} />. Press <Mono>I</Mono> below to hear it.
          The strip under the keys names each note&rsquo;s job in the chord:
          root, 3rd, 5th.
        </P>
        <P>
          Now tick <Mono>+7</Mono>. One more note joins on top — the{" "}
          <em>seventh</em>, ten keys above the root — and the chord turns into
          a <Term id="dominant">dominant seventh</Term>, written{" "}
          <Mono>I7</Mono>. Listen to what it does: the triad sat still; the
          seventh leans. That lean is the sound of the blues, and every chord
          on this page has it.
        </P>
        <ChordSounder
          className="mt-4"
          chords={[I]}
          seventhToggle
          captionTriad={<>Three notes: root, 3rd, 5th. Tick +7 to hear it lean.</>}
          captionSeventh={
            <>
              The 7th is the key&rsquo;s <Mono>♭7</Mono> — the same lowered
              seventh the blues scale has.
            </>
          }
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="three-chords">2. Three chords, three homes</H2>
        <P>
          Build a chord the same way on other notes of the key and you get
          more chords. Musicians number them with Roman numerals by the{" "}
          <Term id="scale-degree">scale degree</Term> they start on: a chord on
          the root is <Mono>I</Mono>, on the fourth degree <Mono>IV</Mono>, on
          the fifth <Mono>V</Mono>. The numerals are the point — they mean the
          same thing in every key. In <KeyName /> they come out as{" "}
          <ChordName numeral="I7" />, <ChordName numeral="IV7" />, and{" "}
          <ChordName numeral="V7" />; change the key above and the letters
          change while the numerals stay.
        </P>
        <P>
          These three are the <Term id="i-iv-v">I, IV and V</Term> — the
          primary chords, and the whole harmony of a plain blues. <Mono>I</Mono>{" "}
          is home. <Mono>IV</Mono> is a step away, warm and open. <Mono>V</Mono>{" "}
          is the far side of the key, tense, and it pulls back toward{" "}
          <Mono>I</Mono> harder than anything else does — that pull is why it is
          called the dominant. Press the three buttons in turn and watch the
          ringed keys pile up: between them the three chords touch every note
          of the major scale.
        </P>
        <ChordSounder className="mt-4" chords={[I, IV, V]} seventhToggle defaultSeventh union />

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-twelve-bars">3. The twelve bars</H2>
        <P>
          A <em>bar</em> is a small box of time — here, four beats. A blues
          strings twelve of them together and then starts over; one trip round
          is a <em>chorus</em>. The chart below is the map. Each cell is one
          bar: the numeral on top, the actual chord in <KeyName /> underneath.
          Read it in three rows of four, like three lines of a verse:
        </P>
        <P>
          Line one stays home on <Mono>I</Mono> for four bars. Line two steps
          out to <Mono>IV</Mono> for two and comes home for two. Line three
          goes to the far side — <Mono>V</Mono>, then <Mono>IV</Mono> — and
          lands on <Mono>I</Mono> for the last two bars. Press{" "}
          <Mono>Play the chart</Mono>: the lit cell is the bar that is sounding,
          the outlined cell is the one coming next, and the organ holds each
          chord for its bar over a quiet pulse on every beat. Click any cell to
          hear that chord on its own; while it plays, clicking jumps there.
        </P>
        <div className="mt-4 space-y-3">
          <ProgressionPlayer voicing />
          <ProgressionChart />
        </div>
        <P>
          Two things to notice. The chords are played as <em>smooth</em>{" "}
          voicings by default: when the chord changes, notes that both chords
          share stay put and the rest move to the nearest key, so the organ
          slides rather than jumps. Flip to <Mono>Root position</Mono> to hear
          the same chords stacked plainly from the root. And the beat is a
          straight four for now — the loping blues{" "}
          <Term id="shuffle">shuffle</Term> is a rhythm idea, taught on its own
          page.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="why-sevenths">4. Why every chord is a seventh</H2>
        <P>
          Here is the payoff, and the answer to a question the{" "}
          <LessonLink href="/scales/blues-scale">blues scale</LessonLink> page
          leaves open: why does one six-note scale fit over all three chords?
          The keyboard below shows both at once. Green numbers are the{" "}
          <KeyName /> blues scale, fixed. Ringed keys are the chord that is
          sounding, and they move as the chart plays. Press play and watch the
          rings travel under the scale.
        </P>
        <P>
          Three things line up. The scale&rsquo;s <Mono>♭7</Mono> is the
          seventh of <ChordName numeral="I7" /> — the note that makes it a
          seventh chord is already in the scale. The scale&rsquo;s{" "}
          <Mono>♭3</Mono> is the seventh of <ChordName numeral="IV7" /> — the
          blue third literally lives inside the IV chord. And the scale&rsquo;s{" "}
          <Mono>♭3</Mono> sits one key <em>under</em> the 3rd of{" "}
          <ChordName numeral="I7" />: those two side-by-side keys are the rub
          you hear as &ldquo;blue&rdquo;. Singers and guitarists bend from one
          to the other; a piano plays them both and lets them fight.
        </P>
        <P>
          Press any key while a chord sounds and the line under the keyboard
          says what that note is doing right now — a chord tone, a scale note
          passing over the chord, or neither. Then try the lock:{" "}
          <Mono>Chord tones</Mono> lets you play only the four notes of the
          current bar, and the set moves every time the chart moves, so you
          can comp along and never be wrong. <Mono>Blues scale</Mono> locks to
          the scale instead — solo along. <Mono>Off</Mono> frees every key.
        </P>
        <ChordScaleOverlay className="mt-4" scaleLabel="Blues scale" />

        {/* ---------------------------------------------------------------- */}
        <H2 id="variants">5. Quick change and turnaround</H2>
        <P>
          The plain chart is the skeleton; players dress it two common ways.
          The <em>quick change</em> moves to <Mono>IV</Mono> in bar 2 instead
          of waiting for bar 5, so the first line moves sooner and comes
          straight back. The <em>turnaround</em> puts <Mono>V</Mono> in the
          last bar instead of resting on <Mono>I</Mono>, so the chorus leans
          into the next one rather than settling — a small{" "}
          <Term id="cadence">cadence</Term> that keeps the loop turning. Tick
          either and the changed cells get a mark; press play and the organ
          plays the new bars.
        </P>
        <div className="mt-4 space-y-3">
          <VariantToggles />
          <ProgressionPlayer tempo={false} />
          <ProgressionChart />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">6. Where it goes next</H2>
        <P>
          You can now read a blues chart in any key: twelve bars, three chords,
          every one a seventh. A blues <em>song</em> stacks choruses of this
          chart and lays a three-line lyric across each one — the form is on{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink>. The
          same twelve bars carry rock and roll, early R&amp;B, and a good share
          of country; jazz players thicken the last line with extra chords (a{" "}
          <Mono>ii–V</Mono> in bars 9–10), which gets its own page when the{" "}
          <LessonLink href="/progressions/ii-v-i">ii–V–I</LessonLink> lesson
          lands. And the beat you have been hearing is a straight four: the
          shuffle that a real blues band plays is a rhythm lesson, not a chord
          lesson, and it arrives at <LessonLink href="/rhythm">/rhythm</LessonLink>.
        </P>

        <Sources
          items={[
            {
              label: "Twelve-bar blues — Wikipedia (plain form, quick change, turnarounds, seventh chords)",
              url: "https://en.wikipedia.org/wiki/Twelve-bar_blues",
            },
            {
              label: "Dominant seventh chord — Wikipedia (construction and the pull to the tonic)",
              url: "https://en.wikipedia.org/wiki/Dominant_seventh_chord",
            },
          ]}
        />
      </section>
    </ProgressionProvider>
  );
}
