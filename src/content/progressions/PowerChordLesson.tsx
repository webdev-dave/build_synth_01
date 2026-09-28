/**
 * The power chord, taught from zero — the first `kind: "chord"` spoke.
 *
 * Assumes the reader can follow "a chord is notes at once" and nothing
 * else. Each section puts the widget that plays the idea under it; key
 * and octave are page-wide through ProgressionProvider. The chords sound
 * on the lesson organ, not a guitar — the prose says so, because the
 * point survives the instrument: two notes, no third, neither major nor
 * minor.
 *
 * Server component; only the widgets and the inline key/chord names are
 * client leaves.
 */
import { Term } from "@/components/concepts/Term";
import { ChordScaleOverlay } from "@/components/progressions/ChordScaleOverlay";
import { ChordSounder } from "@/components/progressions/ChordSounder";
import { ChordName, ChordTones, KeyName } from "@/components/progressions/ProgressionInline";
import { ProgressionProvider } from "@/components/progressions/ProgressionProvider";
import { ProgressionToolbar } from "@/components/progressions/ProgressionToolbar";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { MINOR_PENTATONIC_DEGREES } from "@/components/scales/notes";
import { chord } from "@/lib/music/chords";
import { getProgression } from "@/lib/progressions/registry";

// E: the lowest open string on a guitar, and where rock power chords live.
const DEFAULT_KEY_PC = 4;

const I = chord(0, "major", "I");
const i = chord(0, "minor", "i");
const I5 = chord(0, "power", "I5");
const IV5 = chord(5, "power", "IV5");
const V5 = chord(7, "power", "V5");

export function PowerChordLesson() {
  const progression = getProgression("power-chord");
  if (!progression) return null;

  return (
    <ProgressionProvider
      progression={progression}
      degrees={MINOR_PENTATONIC_DEGREES}
      defaultKeyRootPc={DEFAULT_KEY_PC}
    >
      <section className="mt-8" aria-label="Power chord lesson">
        <P>
          A short lesson with three things to press. The whole page follows one
          key — pick another below and every chord name and keyboard moves
          with it. The chords sound on the lesson&rsquo;s soft organ rather
          than a guitar; the idea is the same on either.
        </P>
        <div className="mt-4">
          <ProgressionToolbar keyPicker />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="take-the-third-out">1. Take the third out</H2>
        <P>
          A <Term id="triad">triad</Term> is three notes: a{" "}
          <Term id="root">root</Term>, a third, a fifth. The middle one — the
          third — decides the mood. In <KeyName /> the major chord is{" "}
          <ChordTones chord={I} />; lower that middle note one key and it turns
          minor, <ChordTones chord={i} />. Press <Mono>I</Mono> and{" "}
          <Mono>i</Mono> and listen to the middle note flip.
        </P>
        <P>
          Now press <Mono>I5</Mono>. The third is gone. What is left is the
          root and the fifth — <ChordTones chord={I5} /> — and the chord is
          neither major nor minor. It is not sad, not bright: just a solid
          fifth. Guitarists call it a <em>power chord</em> and write it with a{" "}
          <Mono>5</Mono>: <ChordName numeral="I5" />. The strip under the keys
          names each note&rsquo;s job; notice there is no &ldquo;3rd&rdquo;
          left to name.
        </P>
        <ChordSounder className="mt-4" chords={[I, i, I5]} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="why-distortion-likes-it">2. Why distortion likes it</H2>
        <P>
          This is why rock guitar leans on it. An overdriven amplifier does not
          just make notes louder — it bends the signal, and bent signals grow
          extra tones at the sums and differences of every frequency going in.
          Feed a full triad through that and the third&rsquo;s overtones
          collide with the root&rsquo;s and the fifth&rsquo;s, and the result
          smears into mud. A root and a fifth vibrate very nearly in a{" "}
          <Mono>3 : 2</Mono> ratio, so the extra tones they generate line up
          with notes already in the chord. The power chord stays clean through
          heavy distortion where a major or minor chord would blur — which is
          the sound of punk, metal, and most rock riffs.
        </P>
        <P>
          Players usually add the root again an octave up (<Mono>E – B – E</Mono>),
          which thickens it without adding any new note. Try that yourself:
          press <Mono>I5</Mono> above, then hold the root one octave higher on
          the keyboard while it rings.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="move-it">3. Move it around</H2>
        <P>
          Because a power chord has no third, it is a movable shape: the same
          two-note grip slid to another root gives another power chord, and
          nothing about it has to change to fit the key. Rock&rsquo;s three
          chords are the blues&rsquo; three chords — <Mono>I</Mono>,{" "}
          <Mono>IV</Mono>, <Mono>V</Mono> — played this way:{" "}
          <ChordName numeral="I5" />, <ChordName numeral="IV5" />,{" "}
          <ChordName numeral="V5" /> in <KeyName />. Press them in turn and
          watch the ringed keys pile up: between them the three shapes touch
          only four notes of the key — <Mono>1 · 2 · 4 · 5</Mono> — where the
          full triads would cover all seven. The gap is deliberate; a riff
          fills it.
        </P>
        <ChordSounder className="mt-4" chords={[I5, IV5, V5]} union />

        {/* ---------------------------------------------------------------- */}
        <H2 id="under-the-pentatonic">4. What plays over it</H2>
        <P>
          With no third in the chord, the melody is free to choose one — and
          rock usually chooses the minor side. The keyboard below lays the{" "}
          <KeyName /> <LessonLink href="/scales/minor-pentatonic">minor pentatonic</LessonLink>{" "}
          over the power chord: green numbers are the scale, ringed keys are
          the chord. The scale&rsquo;s <Mono>♭3</Mono> sits where a major third
          would have been, and nothing in the chord argues with it. Press any
          key and the line under the keyboard says what that note is doing
          against the chord.
        </P>
        <ChordScaleOverlay className="mt-4" scaleLabel="Minor pentatonic" chart={false} />

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">5. Where it goes next</H2>
        <P>
          The three power chords above are the{" "}
          <LessonLink href="/progressions/i-iv-v">I–IV–V</LessonLink> stripped
          to two notes each; with a seventh added instead they become the{" "}
          <LessonLink href="/progressions/twelve-bar-blues">12-bar blues</LessonLink>.
          What makes them sound like rock rather than blues is mostly the
          drums: a hard snare on 2 and 4 —{" "}
          <LessonLink href="/rhythm/backbeat">What is a backbeat?</LessonLink>.
          The whole stack is on{" "}
          <LessonLink href="/genres/rock">What makes rock sound like rock?</LessonLink>
        </P>

        <Sources
          items={[
            {
              label:
                "Power chord — Wikipedia (root and fifth, intermodulation under distortion, the 3:2 ratio, octave doubling)",
              url: "https://en.wikipedia.org/wiki/Power_chord",
            },
          ]}
        />
      </section>
    </ProgressionProvider>
  );
}
