/**
 * Verse–chorus form, taught from zero — the rock shape, and the second
 * form spoke, so the form module's contract gets a second data point.
 *
 * Verse–chorus fixes no chords, so nothing "is" its progression. To keep
 * the map honest and audible, the registry names the four-chord pop loop
 * as the chart under it and the prose says so: the loop is a stand-in that
 * many real songs happen to use, not part of the form. Everything reads one
 * clock through FormProvider; the loop tiles the sixteen-bar cycle four
 * times, so the lit bar is always the sounding bar.
 *
 * Server component; widgets are client leaves.
 */
import { Term } from "@/components/concepts/Term";
import { ChorusStack } from "@/components/forms/ChorusStack";
import { FormComparer } from "@/components/forms/FormComparer";
import { FormMap } from "@/components/forms/FormMap";
import { FormPlayer } from "@/components/forms/FormPlayer";
import { FormProvider } from "@/components/forms/FormProvider";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { getForm } from "@/lib/forms/registry";
import { degreesOf } from "@/lib/music/scaleCatalog";

// C, the four-chord loop's classroom key in its registry row.
const DEFAULT_KEY_PC = 0;
const MAJOR_DEGREES = degreesOf("major");

export function VerseChorusLesson() {
  const form = getForm("verse-chorus");
  const foil = getForm("twelve-bar-blues");
  if (!form) return null;

  return (
    <FormProvider form={form} degrees={MAJOR_DEGREES} defaultKeyRootPc={DEFAULT_KEY_PC} bpm={104}>
      <section className="mt-8" aria-label="Verse–chorus form lesson">
        <P>
          This page is about <em>shape</em>: two kinds of section, how long
          each runs, and which one comes back. Unlike the blues, verse–chorus
          form fixes no chords — a song in this shape can use any. So that the
          map has something to light, the four-chord loop most pop and rock
          reaches for (<LessonLink href="/progressions/i-v-vi-iv">I–V–vi–IV</LessonLink>)
          plays underneath, round and round through both sections. It is a
          stand-in, not part of the form. Pick a key below and it follows.
        </P>
        <div className="mt-4">
          <FormPlayer keyPicker label="Play the song" />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="two-sections">1. Two kinds of section</H2>
        <P>
          A <em>verse</em> and a <em>chorus</em> are both stretches of bars —
          here eight each, the common length — but they do opposite jobs. The
          verse tells the story: its music stays the same each time it comes
          round, and its <em>words change</em>. The chorus is the part
          everyone sings: it comes back with the <em>same words and the same
          music</em> every time, usually carrying the title. Press play and
          watch the map — width is time, and the lit cell is the bar sounding
          now. Eight bars of verse, then the chorus arrives.
        </P>
        <div className="mt-4">
          <FormMap song={false} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="the-chorus-comes-back">2. The chorus comes back</H2>
        <P>
          One verse and one chorus make a cycle; a song stacks cycles. Where
          a blues song is chorus after chorus of the same twelve bars (the
          &ldquo;<Term id="chorus">chorus</Term>&rdquo; there means one whole
          trip round), a rock song alternates: verse 1, chorus, verse 2,
          chorus, and so on. The rows below are three cycles stacked so the
          same bar can be read down every row. Click a cycle in the strip to
          jump the playhead there. The chorus half is the part that never
          changes — which is the whole point of having one.
        </P>
        <div className="mt-4 space-y-4">
          <FormMap beats={false} />
          <ChorusStack />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="against-the-blues">3. Sixteen bars against twelve</H2>
        <P>
          The blues chorus is twelve bars; this cycle is sixteen. Both below
          run on one clock — a click on every beat, a kick where the
          verse–chorus cycle starts, a snare where the blues chorus starts —
          so you can feel the two homes drift apart and meet again after
          forty-eight bars. Rock kept the blues&rsquo; scale and often its
          chords; it did not keep this shape.
        </P>
        {foil && (
          <div className="mt-4">
            <FormComparer a={form} b={foil} />
          </div>
        )}

        {/* ---------------------------------------------------------------- */}
        <H2 id="not-drawn">4. What the map leaves out</H2>
        <P>
          Real songs dress the cycle. A <em>pre-chorus</em> is a short lift
          between verse and chorus that builds toward it; a <em>bridge</em> is
          a contrasting section, once, usually after the second chorus, that
          makes the final chorus land harder; an <em>intro</em> and{" "}
          <em>outro</em> frame the whole. The formula in the quick reference —{" "}
          <Mono>Verse · Chorus · Verse · Chorus · Bridge · Chorus</Mono> — is
          the plain version of that. The map here draws only the repeating
          cycle, because the cycle is the form; the rest is arrangement.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">5. Where it goes next</H2>
        <P>
          The blues shape this replaced is at{" "}
          <LessonLink href="/forms/twelve-bar-blues">What is the 12-bar blues form?</LessonLink>.
          The loop that played under the map has its own page when it lands:{" "}
          <LessonLink href="/progressions/i-v-vi-iv">What is the I–V–vi–IV progression?</LessonLink>.
          Hear the shape with the rest of the stack on{" "}
          <LessonLink href="/genres/rock">What makes rock sound like rock?</LessonLink>
        </P>

        <Sources items={form.sources} />
      </section>
    </FormProvider>
  );
}
