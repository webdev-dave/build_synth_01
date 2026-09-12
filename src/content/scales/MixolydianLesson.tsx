/**
 * Mixolydian, taught as "the major scale that won't sit down."
 *
 * One changed note — the ♭7 — and the page is about what that note takes
 * away (the leading tone) and what it gives (the dominant chord, the
 * harmonica's second position). Two comparers: major → Mixolydian (swap),
 * and G Mixolydian re-homed as C major (the mode idea). A third puts the
 * harp player's version next to it: Mixolydian vs the blues scale, notes
 * both coming and going.
 *
 * Server component: prose ships as static HTML; widgets are client leaves.
 */
import { Term } from "@/components/concepts/Term";
import { ScaleLessonProvider } from "@/components/scales/ScaleLessonProvider";
import { LessonToolbar } from "@/components/scales/LessonToolbar";
import { ScaleKeyboard } from "@/components/scales/ScaleKeyboard";
import { DegreeStrip } from "@/components/scales/DegreeStrip";
import { PlayPatternButton } from "@/components/scales/PlayPatternButton";
import { ScaleComparer } from "@/components/scales/ScaleComparer";
import { RootName, NoteAt } from "@/components/scales/LessonInline";
import {
  DegreeTable,
  H2,
  LessonIntro,
  LessonLink,
  Mono,
  P,
  type DegreeRow,
} from "@/components/scales/lessonPrimitives";
import { degreesOf } from "@/lib/music/scaleCatalog";

// G is the classroom key: G Mixolydian is all white keys (it is C major from
// G), and a C harp in second position plays in G — the most common harp.
const DEFAULT_ROOT_PC = 7;

const MIXOLYDIAN = degreesOf("mixolydian");
const MAJOR = degreesOf("major");
const BLUES = degreesOf("blues");
const MIXOLYDIAN_OFFSETS = MIXOLYDIAN.map((d) => d.offset);

/** The lowered seventh — the one key this lesson moves. */
const FLAT_SEVENTH = 10;
const MAJOR_SEVENTH = 11;
const MAJOR_THIRD = 4;

const DEGREE_ROWS: DegreeRow[] = [
  { offset: 0, label: "1", role: "the root — home" },
  { offset: 2, label: "2", role: "second" },
  { offset: 4, label: "3", role: "major third — still bright" },
  { offset: 5, label: "4", role: "fourth" },
  { offset: 7, label: "5", role: "fifth" },
  { offset: 9, label: "6", role: "sixth" },
  { offset: 10, label: "♭7", role: "lowered seventh — the changed note" },
];

export function MixolydianLesson() {
  return (
    <ScaleLessonProvider defaultRootPc={DEFAULT_ROOT_PC} degrees={MIXOLYDIAN}>
      <section className="mt-8" aria-label="Mixolydian lesson">
        <LessonIntro />

        {/* ---------------------------------------------------------------- */}
        <H2 id="hear-it">1. First, hear it</H2>
        <P>
          The keyboard below is locked to <RootName /> Mixolydian. Keys with a
          green number are in the <Term id="scale">scale</Term> and play; keys
          with a red dot stay silent. Press <Mono>Play</Mono>. It sounds like a
          major scale — bright, open — right up to the last step, where
          something refuses to close. That refusal is the whole mode. If you
          have heard a blues harmonica, a Southern-rock riff, or a funk vamp
          that sits on one chord for a minute, you have heard it.
        </P>
        <div className="mt-4 space-y-3">
          <LessonToolbar root octave lock>
            <PlayPatternButton
              label="Play the scale"
              offsets={MIXOLYDIAN_OFFSETS}
            />
          </LessonToolbar>
          <ScaleKeyboard degrees={MIXOLYDIAN} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="degrees">2. Counting from home: one flat</H2>
        <P>
          Every scale has a home note, the <Term id="root">root</Term> — here{" "}
          <RootName />, and the picker above moves it. The other notes are named
          by how far above the root they sit: their{" "}
          <Term id="scale-degree">scale degrees</Term>. Count keys to the right,
          black and white alike; each key is one{" "}
          <Term id="steps">half step</Term>. The plain numbers 1 to 7 belong to
          the <LessonLink href="/scales/major-scale">major scale</LessonLink>; a{" "}
          <Term id="flats-and-sharps">flat</Term> (<Mono>♭</Mono>) means
          &ldquo;that note, one key lower.&rdquo;
        </P>
        <DegreeTable rows={DEGREE_ROWS} spotlightOffset={FLAT_SEVENTH} />
        <P>
          Six plain numbers and one flat. Everything through the <Mono>6</Mono>{" "}
          is the major scale, unchanged — the bright major third is still there.
          Only the seventh has moved, from one key below the root to two. Click
          a chip to hear each degree in <RootName />.
        </P>
        <DegreeStrip
          degrees={MIXOLYDIAN}
          spotlightOffset={FLAT_SEVENTH}
          className="mt-4"
        />

        {/* ---------------------------------------------------------------- */}
        <H2 id="lower-the-seventh">
          3. Move one key: major becomes Mixolydian
        </H2>
        <P>
          Take the major scale in <RootName /> and lower its <Mono>7</Mono> —{" "}
          <NoteAt offset={MAJOR_SEVENTH} degrees={MAJOR} /> — one key to{" "}
          <NoteAt offset={FLAT_SEVENTH} />. Nothing else changes. Flip the
          toggle and watch one key go dark while its lower neighbour lights;
          play both runs and listen to the top of the scale. Major climbs the
          last step and lands. Mixolydian steps off a shorter stair and hangs
          there.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "major", name: "Major", degrees: MAJOR }}
          b={{
            id: "mixolydian",
            name: "Mixolydian",
            degrees: MIXOLYDIAN,
            spotlightOffset: FLAT_SEVENTH,
          }}
          defaultSide="b"
        />
        <P>
          Why does one key matter so much? In the major scale the <Mono>7</Mono>{" "}
          sits a single key below home and leans into it — the{" "}
          <em>leading tone</em>, the note that makes <Mono>7 → 1</Mono> feel
          like arriving. Mixolydian has no leading tone. Its <Mono>♭7</Mono> is
          two keys away and does not lean anywhere in particular. Press both
          pairs and hear the difference: the first one arrives; the second one
          just moves.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Major: hear 7 → 1"
              offsets={[MAJOR_SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
            <PlayPatternButton
              label="Mixolydian: hear ♭7 → 1"
              offsets={[FLAT_SEVENTH, 12]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="dominant">4. What the ♭7 gives back: the dominant chord</H2>
        <P>
          Losing the leading tone sounds like a loss, but the <Mono>♭7</Mono>{" "}
          buys something. Build a chord on the root — <Mono>1 3 5</Mono>, a
          plain major <Term id="triad">triad</Term> — and add the{" "}
          <Mono>♭7</Mono> on top. That four-note chord is a{" "}
          <Term id="dominant">dominant seventh</Term>, the sound of a blues
          chord, a rock-and-roll chord, a funk vamp. In the major scale that
          chord only lives on the fifth degree, where it pulls toward home. In
          Mixolydian it lives <em>on</em> home, so the pull points at the chord
          you are already on. The music leans and never falls; it can sit on one
          chord as long as it likes.
        </P>
        <div className="mt-4">
          <LessonToolbar octave>
            <PlayPatternButton
              label="Hear 1 3 5 ♭7"
              offsets={[0, MAJOR_THIRD, 7, FLAT_SEVENTH]}
              withOctave={false}
              descend={false}
            />
          </LessonToolbar>
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same-keys">
          5. Same keys, different home: a major scale from its fifth
        </H2>
        <P>
          Now the map view. Take the seven keys of <RootName /> Mixolydian and,
          without turning any on or off, call the <Mono>4</Mono> home instead.
          You are now playing the{" "}
          <LessonLink href="/scales/major-scale">major scale</LessonLink> on{" "}
          <NoteAt offset={5} />. In <Mono>G</Mono> that is <Mono>C</Mono> major:
          the same white keys, settling one note lower. Flip the toggle and only
          the green <Mono>1</Mono> moves.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "mixolydian", name: "Mixolydian", degrees: MIXOLYDIAN }}
          b={{ id: "major", name: "Major", degrees: MAJOR, rootOffset: 5 }}
        />
        <P>
          Western theory calls Mixolydian the fifth <Term id="mode">mode</Term>{" "}
          of the major scale — the major scale started from its fifth degree.
          That is true of the notes and useful on a keyboard: any tune you can
          play in C major you can play in G Mixolydian with no new keys. It is
          also the reason the harmonica gets involved.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="cross-harp">
          6. Why blues harmonica lives here: second position
        </H2>
        <P>
          A ten-hole diatonic harmonica is built around one major scale — a
          &ldquo;C harp&rdquo; blows and draws the notes of C major. Play it in
          C and you get the major scale: <em>first position</em>, straight harp.
          But most blues players pick up that same C harp and play in{" "}
          <Mono>G</Mono> — the key a fifth up. The notes have not changed. The
          home has. A C harp played in G is playing G Mixolydian, and that is{" "}
          <em>second position</em>, cross harp, the position most blues harp is
          played in.
        </P>
        <P>
          Two things make it work. The <Mono>♭7</Mono> is already there, so the
          scale matches the dominant-seventh chords of a blues. And on a harp
          the notes that can be bent — drawn and pulled down in pitch — are the
          draw notes, and in second position the draw notes land on the strong
          degrees. Bend the <Mono>3</Mono> down and you get the <Mono>♭3</Mono>;
          bend the <Mono>5</Mono> and you get the <Mono>♭5</Mono>. Those are the
          two <Term id="blue-notes">blue notes</Term>, and with them the player
          slides from Mixolydian into the{" "}
          <LessonLink href="/scales/blues-scale">blues scale</LessonLink>. Flip
          the toggle to see which notes each scale has that the other lacks — a
          harp player moves between the two constantly.
        </P>
        <ScaleComparer
          className="mt-4"
          a={{ id: "mixolydian", name: "Mixolydian", degrees: MIXOLYDIAN }}
          b={{
            id: "blues",
            name: "Blues scale",
            degrees: BLUES,
            spotlightOffset: 6,
          }}
        />
        <P>
          A piano cannot bend, so this keyboard shows the two scales as separate
          lists. On a harmonica they are one instrument&rsquo;s worth of notes
          and the bends in between. The{" "}
          <LessonLink href="/harmonica-lab/v2?position=2">
            Harmonica Lab
          </LessonLink>{" "}
          shows exactly which hole and which bend gives each note in second
          position, for any key of harp.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="use-it">7. What to do with it</H2>
        <P>
          Keep the lock on and play the green keys over a single held root —
          Mixolydian is a one-chord mode, so you do not need a progression to
          make it work. Land on <Mono>1</Mono>, <Mono>3</Mono>, or{" "}
          <Mono>5</Mono> for a settled note and <Mono>♭7</Mono> for one that
          leans. Try <Mono>♭7 → 1</Mono> and <Mono>♭7 → 6</Mono> as phrase
          endings; both are more relaxed than the major scale&rsquo;s{" "}
          <Mono>7 → 1</Mono>. Then read{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink> for
          the form this mode was built to sit on.
        </P>
        <div className="mt-4">
          <LessonToolbar octave lock>
            <PlayPatternButton
              label="Play Mixolydian"
              offsets={MIXOLYDIAN_OFFSETS}
            />
          </LessonToolbar>
        </div>
      </section>
    </ScaleLessonProvider>
  );
}
