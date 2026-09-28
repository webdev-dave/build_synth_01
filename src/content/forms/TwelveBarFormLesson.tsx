/**
 * The 12-bar blues *form*, taught from zero.
 *
 * Owns none of the chord explanation — that is /progressions/twelve-bar-
 * blues, and the door to it is at the top. This page is about shape and
 * time: how long the loop is, how its bars group into lines and lines
 * into a chorus, where the words sit and where the answer sits, and how a
 * song stacks choruses. Every widget reads one clock through FormProvider,
 * so the lit bar, the lit chorus, the sounding chord and the answering
 * lick can never disagree.
 *
 * Server component: prose ships as static HTML. The words in the map come
 * from the catalog's public-domain "St. Louis Blues" text, never typed here.
 */
import { Term } from "@/components/concepts/Term";
import { ChorusStack } from "@/components/forms/ChorusStack";
import { FormComparer } from "@/components/forms/FormComparer";
import { FormMap } from "@/components/forms/FormMap";
import { FormPlayer } from "@/components/forms/FormPlayer";
import { FormProvider } from "@/components/forms/FormProvider";
import { SongLink } from "@/components/history/SongLink";
import { KeyName } from "@/components/progressions/ProgressionInline";
import { H2, LessonLink, Mono, P, Sources } from "@/components/scales/lessonPrimitives";
import { BLUES_DEGREES } from "@/components/scales/notes";
import { getFormLick } from "@/content/forms/licks";
import { formLyric } from "@/lib/forms/lyric";
import { getForm } from "@/lib/forms/registry";

// A, as on /scales/blues-scale and /progressions/twelve-bar-blues, so the
// three blues lessons open in one key.
const DEFAULT_KEY_PC = 9;

export function TwelveBarFormLesson() {
  const form = getForm("twelve-bar-blues");
  const foil = getForm("eight-bar-blues");
  if (!form) return null;
  const lyric = formLyric(form);
  const lick = getFormLick(form.slug);

  return (
    <FormProvider form={form} degrees={BLUES_DEGREES} defaultKeyRootPc={DEFAULT_KEY_PC} lick={lick}>
      <section className="mt-8" aria-label="12-bar blues form lesson">
        <P>
          This page is about the <em>shape</em> of a blues — how long it is,
          how it comes round, where the words go. It says nothing about which
          chords those are or why: that is a different question with its own
          page,{" "}
          <LessonLink href="/progressions/twelve-bar-blues">
            What are the 12-bar blues chords?
          </LessonLink>
          . Here the chords simply play underneath so the map has something to
          light. Pick a key below and everything follows it.
        </P>
        <div className="mt-4">
          <FormPlayer keyPicker label="Play the song" />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="comes-around">1. Music comes around</H2>
        <P>
          A <em>form</em> is the length of the loop before it repeats. A blues
          loop is twelve bars long: count twelve boxes of four beats, and you
          are back where you started. One trip round is a <em>chorus</em>.
          Press play and watch the map: the lit cell is the bar sounding
          now, the small row underneath counts its beats, and when the twelfth
          bar ends the first one lights again. That return is the form.
        </P>
        <div className="mt-4">
          <FormMap song={false} />
        </div>

        {/* ---------------------------------------------------------------- */}
        <H2 id="lines">2. Bars into lines, lines into a chorus</H2>
        <P>
          Twelve bars are too many to feel one at a time, so the ear groups
          them. The map above is drawn in three rows of four because that is
          how the music groups them: each row is one <em>line</em>, four bars
          long, and three lines make the chorus. The letters over the rows —{" "}
          <Mono>A</Mono>, <Mono>A</Mono>, <Mono>B</Mono> — say which lines are
          the same and which is different; the next section explains why.
          Click any cell to hear its chord on its own; while the song plays,
          clicking jumps there.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="aab">3. Say it, say it again, answer it</H2>
        <P>
          The blues lyric has a shape of its own, and it fits the three lines
          exactly. The singer sings a line; sings the same line again, maybe
          with a small change; then sings a new line that answers it. Musicians
          write that <Mono>AAB</Mono>. The words in the map are the opening of
          W. C. Handy&rsquo;s{" "}
          {lyric ? <SongLink id={lyric.song.slug} /> : <em>St. Louis Blues</em>}{" "}
          (1914, public domain): the first line, the same line, the answer.
        </P>
        <P>
          Look at where the words sit. Each four-bar line is really two halves:
          the singer takes roughly the first two bars, and the last two are
          open. That gap is not empty — it is where the band, the guitar or the
          harmonica <em>answers</em>. Blues is built on{" "}
          <Term id="call-and-response">call-and-response</Term>, and the form
          leaves room for the response in every line. On this page a lead
          voice plays a short blues-scale answer in each open half; the{" "}
          <Mono>↳ answer</Mono> mark lights only while it is actually
          sounding, so what you see lit is what you hear. The answer is in{" "}
          <KeyName />, from the same blues scale the singer would bend through
          — change the key above and it moves too.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="same">4. Form is what stays the same</H2>
        <P>
          A blues <em>song</em> is choruses stacked end to end. The words
          change every chorus; the twelve bars and their chords do not. That
          is the whole idea of a form: the part that repeats. Below, every
          chorus of the song is a row of the same twelve cells. Read down a
          column — hover any bar — and the chord is identical in every row;
          read across and the words are new each time. One chorus is left to
          the lead alone: an instrumental chorus, the solo, and the form does
          not care — twelve bars is twelve bars.
        </P>
        <div className="mt-4 space-y-4">
          <FormMap beats={false} readout />
          <ChorusStack />
        </div>
        <P>
          The strip at the top is the song at a glance: each block is one
          chorus, its width the twelve bars. Click a block to jump there. The
          read-out under the map names where you are in words —{" "}
          <Mono>Chorus 2 · line B · bar 10 of 12</Mono> — which is exactly what
          a player counts in their head to keep their place.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="other-lengths">5. Other lengths</H2>
        <P>
          Twelve is the common length, not the only one. An{" "}
          <LessonLink href="/forms/eight-bar-blues">eight-bar blues</LessonLink>{" "}
          drops a line — two lines instead of three — and a{" "}
          <LessonLink href="/forms/sixteen-bar-blues">sixteen-bar blues</LessonLink>{" "}
          adds one. Below, the twelve-bar and the eight-bar run on one clock,
          each marked where its cycle starts over: the kick is the twelve-bar
          coming home, the snare the eight-bar. Listen for how long each one
          makes you wait — that wait is the form&rsquo;s length, felt rather
          than counted. They line up again only every twenty-four bars.
        </P>
        {foil && (
          <div className="mt-4">
            <FormComparer a={form} b={foil} />
          </div>
        )}
        <P>
          Rock and pop mostly use a different shape again — a{" "}
          <LessonLink href="/forms/verse-chorus">verse and a chorus</LessonLink>{" "}
          that alternate, where the chorus comes back with the same words and
          the verses change. Same widget, different blocks; that page lands
          with the rock lessons.
        </P>

        {/* ---------------------------------------------------------------- */}
        <H2 id="next">6. Where it goes next</H2>
        <P>
          You can now hear a blues and know where you are in it: which line,
          which half, how far from home. The chords that fill those bars are
          taught at{" "}
          <LessonLink href="/progressions/twelve-bar-blues">
            What are the 12-bar blues chords?
          </LessonLink>
          ; the feel the band plays them with is at{" "}
          <LessonLink href="/rhythm/shuffle">What is a shuffle rhythm?</LessonLink>
          ; and the whole picture — scale, chords, feel, form — is on{" "}
          <LessonLink href="/genres/blues">What is the blues?</LessonLink>.
        </P>

        <Sources
          items={[
            ...form.sources,
            ...(lyric
              ? [
                  {
                    label: `${lyric.version.source.label} — the words in the map`,
                    url: lyric.version.source.url ?? `/songs/${lyric.song.slug}`,
                  },
                ]
              : []),
          ]}
        />
      </section>
    </FormProvider>
  );
}
