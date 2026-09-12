/**
 * "Where did the blues come from?" — the body of the /history/blues article.
 *
 * Server-rendered prose (no "use client") so quotes and footnotes are in the
 * static HTML. Sources are the ones declared on the registry entry, so the
 * inline `[n]` footnotes and the bibliography stay in one numbering.
 *
 * Editorial stance (per the module plan): quote briefly, attribute, link out,
 * and don't launder legend as fact — where the popular story is contested, say
 * so and cite the scholarship.
 */
import Link from "next/link";

import { getArticle } from "@/lib/history/registry";
import { Blockquote, Cite, SourceList } from "@/components/history/citations";
import { SongJumpNav } from "@/components/history/SongJumpNav";
import { SongLink } from "@/components/history/SongLink";
import { Term } from "@/components/concepts/Term";
import { ArtistLink } from "@/components/catalog/ArtistLink";

const SOURCES = getArticle("blues")?.sources ?? [];

/**
 * Songs named in this article, in appearance order — the data lives in the
 * catalog (`src/lib/catalog/songs.ts`); we just list the slugs so the jump-nav
 * and the inline `<SongLink id>`s resolve to the same entries.
 */
const SONG_IDS = [
  "yellow-dog-blues",
  "st-louis-blues",
  "crazy-blues",
  "strange-fruit",
];

/** Bind the shared footnote to this article's source ordering. */
function Ref({ id }: { id: string }) {
  return <Cite id={id} sources={SOURCES} />;
}

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className="mt-10 scroll-mt-24 text-lg font-semibold tracking-tight text-foreground"
    >
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

export function BluesHistory() {
  return (
    <article className="mt-8">
      <SongJumpNav ids={SONG_IDS} />

      <H2 id="predecessors">Predecessors: West Africa, and what else it borrowed</H2>
      <P>
        The blues did not appear from nowhere, and it did not already exist as
        “the blues” in West Africa. What crossed the Atlantic with enslaved
        people were practices — <Term id="call-and-response">call-and-response</Term>,
        a five-note (<Term id="pentatonic">pentatonic</Term>) sense of pitch,{" "}
        <Term id="syncopation">off-beat accent</Term>, and the habit of sliding
        or bending a note instead of landing it square on a piano key.
        Smithsonian Folkways
        traces those aesthetics through two American predecessors of the blues:
        field hollers and ring shouts.<Ref id="folkways-before" />
      </P>
      <Blockquote
        attribution="Gerhard Kubik, interviewed by Afropop Worldwide"
        cite="kubik-afropop"
        sources={SOURCES}
      >
        &ldquo;Across the West African savanna you often find a characteristic{" "}
        <Term id="pentatonic">pentatonic</Term> system. &hellip; It is slightly
        different from the notes found on European instruments with their tuning
        temperament.&rdquo;
      </Blockquote>
      <P>
        That pentatonic column is the ancestor of the{" "}
        <Link
          href="/scales/minor-pentatonic"
          className="text-foreground underline-offset-2 hover:underline"
        >
          minor pentatonic
        </Link>{" "}
        — five notes, no <Term id="steps">half-steps</Term> to clash. Pin a
        flattened fifth onto it and
        you have the{" "}
        <Link
          href="/scales/blues-scale"
          className="text-foreground underline-offset-2 hover:underline"
        >
          blues scale
        </Link>
        , which is how those sliding pitches look once they have to live on a
        keyboard. Kubik is careful not to flatten this into a slogan
        (&ldquo;from Mali to Mississippi&rdquo;): the relevant traits cluster
        in the west-central Sudanic belt — the savanna and Sahel — and were
        remade under new conditions in the United States, not shipped over as a
        finished genre.<Ref id="kubik-1999" />
        <Ref id="kubik-afropop" />
      </P>
      <P>
        Other inspirations sat next to that African inheritance. The Library of
        Congress notes that early blues also drew on{" "}
        <em>Anglo and European derived forms</em> — ballads, guitar
        accompaniment, the three common chords that later sit under a{" "}
        <Term id="twelve-bar-blues">12-bar chorus</Term>.<Ref id="loc-blues" />{" "}
        The slide technique Handy heard at
        Tutwiler (a knife on the strings) has both a Central African zither
        precedent and a Hawaiian-guitar cousin; those strands meet in the
        American South rather than replacing each other.<Ref id="kubik-afropop" />{" "}
        To hear how the later stack fits together — form, scale, shuffle,
        harmony — open{" "}
        <Link
          href="/genres/blues"
          className="text-foreground underline-offset-2 hover:underline"
        >
          What is the blues?
        </Link>
        . The{" "}
        <Link
          href="/scales"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Scales
        </Link>{" "}
        pages are where those pitch collections can be played.
      </P>

      <H2 id="roots">Work songs, field hollers, spirituals</H2>
      <P>
        The blues is a secular African-American music that took shape in the
        rural South in the decades after Emancipation. There are no recordings
        from that era, but the Library of Congress dates a recognizable style to
        the 1890s, assembled out of older forms.<Ref id="loc-blues" />
        <Ref id="loc-folklife" />
      </P>
      <Blockquote attribution="Library of Congress, “Blues”" cite="loc-blues" sources={SOURCES}>
        &ldquo;The songs drew freely from earlier African American styles, such
        as work songs, field hollers, spirituals, minstrelsy, as well as from
        Anglo and European derived forms. Blues singers emphasized &lsquo;blue
        notes,&rsquo; usually the third, fifth and seventh degrees of the scale,
        which they often slurred or &lsquo;bent&rsquo; upward a quarter tone or
        more.&rdquo;
      </Blockquote>
      <P>
        Calling the blues &ldquo;secular&rdquo; is no contradiction with those
        sacred roots. The word describes what the music is about — love, work,
        trouble, travel, this world rather than the next — not where its sound
        came from. The blues borrowed the church&rsquo;s techniques, like
        call-and-response and bent, moaned pitches, and turned them to worldly
        ends.
      </P>
      <P>
        Those bent{" "}
        <Term id="blue-notes">&ldquo;blue notes&rdquo;</Term> are the same ones
        the{" "}
        <Link
          href="/scales/blues-scale"
          className="text-foreground underline-offset-2 hover:underline"
        >
          blues scale
        </Link>{" "}
        freezes into fixed keys — the flattened third, fifth, and seventh. The
        scale is what happens when a singing, sliding pitch gets pinned onto a
        piano.
      </P>

      <H2 id="birthplace">A form with a contested birthplace</H2>
      <P>
        The popular story — the blues &ldquo;born&rdquo; from suffering in the
        Mississippi Delta — is more legend than settled history. Recent
        scholarship traces it instead to a wandering lyric form with roots in
        black vaudeville and, plausibly, the Ohio River Valley, before it
        crystallized in the Delta.<Ref id="southern-cultures-handy" /> The most
        famous first-hand account belongs to the bandleader{" "}
        <ArtistLink id="w-c-handy">W. C. Handy</ArtistLink>, who remembered
        hearing it around 1903 at a train station in Tutwiler, Mississippi.
      </P>
      <Blockquote
        attribution="W. C. Handy, Father of the Blues (1941)"
        cite="handy-1941"
        sources={SOURCES}
      >
        &ldquo;As he played, he pressed a knife on the strings of the guitar in
        a manner popularized by Hawaiian guitarists who used steel bars. The
        effect was unforgettable. &hellip; The singer repeated the line three
        times, accompanying himself on the guitar with the weirdest music I had
        ever heard.&rdquo;
      </Blockquote>
      <P>
        Handy&rsquo;s guitarist was singing &ldquo;Goin&rsquo; where the
        Southern cross&rsquo; the Dog&rdquo; — a reference to a railroad
        junction — and Handy later adapted it into{" "}
        <SongLink id="yellow-dog-blues" />.
        <Ref id="msbluestrail-handy" /> It&rsquo;s a vivid scene,
        but worth reading as one witness&rsquo;s memory written decades later,
        not the moment of a genre&rsquo;s birth.
      </P>

      <H2 id="published">From vernacular to published and recorded</H2>
      <P>
        Handy began publishing adaptations of blues themes in 1912 and reached a
        national audience with <SongLink id="st-louis-blues" /> in 1914
        — the point
        where a folk practice became sheet music and, soon after, a record
        industry.<Ref id="loc-blues" /> The commercial turn came in 1920, when
        <ArtistLink id="mamie-smith">Mamie Smith</ArtistLink>&rsquo;s{" "}
        <SongLink id="crazy-blues" /> became the
        first big hit recording in the genre by a Black artist.
      </P>
      <Blockquote
        attribution="Hearing the Americas"
        cite="hearing-americas"
        sources={SOURCES}
      >
        &ldquo;In August of [1920], Smith&rsquo;s recording of Bradford&rsquo;s
        &lsquo;Crazy Blues&rsquo; became a crazy success, selling over one
        million records in a year&rsquo;s time, many bought by Black Americans
        &hellip; [it] &lsquo;set off a recording boom that was previously
        unheard of.&rsquo;&rdquo;
      </Blockquote>
      <P>
        That success opened a segregated market the industry called{" "}
        <Term id="race-records">race records</Term> — 78s by Black musicians,
        sold as a category apart to African American buyers — and convinced the
        labels there was an audience for Black musicians playing in their own
        styles. It was a Jim Crow shelf, and it was also the commercial door the
        country and city blues of the next decades walked through.
        <Ref id="hearing-americas" />
      </P>

      <H2 id="migration">The Great Migration and the electric blues</H2>
      <P>
        As millions of Black Americans left the rural South for northern cities,
        Delta players carried the music with them.{" "}
        <ArtistLink id="muddy-waters">Muddy Waters</ArtistLink> — first recorded
        in Mississippi by Alan Lomax and John Work for the Library of Congress in
        1941 — moved to Chicago in 1943, where the sound had to change to
        survive the room.<Ref id="ms-encyclopedia-muddy" />
      </P>
      <Blockquote
        attribution="Mississippi Encyclopedia, “Muddy Waters”"
        cite="ms-encyclopedia-muddy"
        sources={SOURCES}
      >
        &ldquo;In these informal sessions, Waters switched to an electric guitar
        to project his music into the noisy crowds.&rdquo;
      </Blockquote>
      <P>
        Electrified and pushed by a full band, the country blues became Chicago
        blues — and from there fed directly into rhythm and blues and{" "}
        <Link
          href="/genres/rock"
          className="text-foreground underline-offset-2 hover:underline"
        >
          rock
        </Link>
        , which kept the scale and often the I–IV–V harmony but traded the{" "}
        <Term id="shuffle">shuffle</Term> for a straight backbeat.
      </P>

      <H2 id="abroad">Blues around the world</H2>
      <P>
        By the 1950s the blues was no longer only American music, and the
        places that adopted it did more than listen — they promoted it,
        recorded it, archived it, and in Britain&rsquo;s case sold it back to
        the country that made it. Every place named below is on the map at the
        foot of this article.
      </P>
      <P>
        Britain heard the blues before it could see it, on 78s and on
        shortwave. Live music was the hard part: the Musicians&rsquo; Union
        barred visiting American instrumentalists, so the trombonist{" "}
        <ArtistLink id="chris-barber">Chris Barber</ArtistLink> worked the
        loophole that singers belonged to a different union, then used the
        1956 exchange agreement — putting{" "}
        <ArtistLink id="big-bill-broonzy">Big Bill Broonzy</ArtistLink> on a
        British concert tour in 1957 and bringing Muddy Waters over in October
        1958.<Ref id="barber-froots" /> The legend that Muddy&rsquo;s amplifier
        scandalized the nation is worth deflating: Barber says Muddy never
        played loud, Sister Rosetta Tharpe had already taken an electric guitar
        onto a British stage the year before, and while Leeds was cool, the
        London reviews were warm.<Ref id="record-collector-barber" />
      </P>
      <P>
        What turned an audience into a scene was a basement. On 17 March 1962{" "}
        <ArtistLink id="alexis-korner">Alexis Korner</ArtistLink> and Cyril
        Davies moved their blues night to the Ealing Jazz Club; by Korner&rsquo;s
        estimate about a hundred people in London cared about the blues, and all
        of them came.<Ref id="ealing-club-history" /> Within a month Brian Jones
        met Mick Jagger and Keith Richards there and{" "}
        <ArtistLink id="the-rolling-stones">the Rolling Stones</ArtistLink> took
        shape, naming themselves after a Muddy Waters record.
        <Ref id="wikipedia-blues-incorporated" /> The other school was{" "}
        <ArtistLink id="john-mayall">John Mayall</ArtistLink>&rsquo;s
        Bluesbreakers, whose revolving guitarists left to form or join Cream,
        Fleetwood Mac, and the Stones.<Ref id="bbc-mayall" /> The Rock &amp; Roll
        Hall of Fame inducted Korner and Mayall together in 2024 under
        &ldquo;Musical Influence&rdquo; rather than as performers — an accurate
        description of the job they did.<Ref id="rockhall-2024" />
      </P>
      <P>
        Then the loan came back. Taping ABC&rsquo;s <em>Shindig!</em> on 20 May
        1965, the Stones made a booking for{" "}
        <ArtistLink id="howlin-wolf">Howlin&rsquo; Wolf</ArtistLink> a condition
        of their own appearance, and sat on the floor at his feet while he played
        to American teenagers who mostly did not know who he was — his first
        performance on national television.
        <Ref id="openculture-wolf-shindig" /> Britain did not improve the blues.
        It raised the music&rsquo;s standing, and handed a Chicago bandleader a
        prime-time introduction his own country had not.
      </P>
      <P>
        On the continent the decisive institution was a package tour. From 1962
        the German promoters Horst Lippmann and Fritz Rau ran the American Folk
        Blues Festival, using{" "}
        <ArtistLink id="willie-dixon">Willie Dixon</ArtistLink>&rsquo;s Chicago
        contacts to book players who had never worked outside the United States,
        and touring Germany, Austria, Switzerland, France, and Britain almost
        every year into the 1970s; the 1962 Manchester audience included Jagger,
        Richards, Jones, and Jimmy Page.<Ref id="wikipedia-afbf" /> Some
        musicians simply stayed —{" "}
        <ArtistLink id="memphis-slim">Memphis Slim</ArtistLink> moved to Paris in
        1962 and lived there until his death in 1988, a fixture of French
        television and Latin Quarter clubs.<Ref id="wikipedia-memphis-slim" /> In
        the Netherlands,{" "}
        <ArtistLink id="cuby-and-blizzards">Cuby + Blizzards</ArtistLink> ran a
        farmhouse in the Drenthe village of Grolloo as a blues waystation: they
        backed the visiting Chicago pianist Eddie Boyd on a 1967 album, and John
        Mayall stayed there the same year.
        <Ref id="wikipedia-cuby-blizzards" /> Norway&rsquo;s contribution came
        later and from an unlikely town — Notodden, whose ironworks closed in
        1988, the year local musicians spent their own savings on a blues
        festival.<Ref id="european-blues-union-notodden" /> It now draws tens of
        thousands, houses a European blues archive, and won Memphis&rsquo;s Blues
        Foundation award for the best international blues festival in 2010.
        <Ref id="notodden-festival" />
      </P>
      <P>
        Ireland is its own case, and a divided one. Belfast built a
        rhythm-and-blues scene around the Maritime Hotel, where{" "}
        <ArtistLink id="van-morrison">Van Morrison</ArtistLink>&rsquo;s band Them
        played;{" "}
        <ArtistLink id="rory-gallagher">Rory Gallagher</ArtistLink>, who grew up
        in Cork hunting the blues out of shortwave static, based himself there
        from 1967 because the city sat outside the Federation of Irish
        Musicians&rsquo; reach and had somewhere to play loudly, which Dublin&rsquo;s
        showband circuit did not.<Ref id="louder-gallagher" />
      </P>
      <P>
        The most interesting case looks like a homecoming and mostly is not.
        Since the 1990s, guitar music from Mali and the Sahara has been sold in
        Europe and America as &ldquo;desert blues,&rdquo; and the family
        resemblance is real. But{" "}
        <ArtistLink id="ali-farka-toure">Ali Farka Touré</ArtistLink>, the
        musician most responsible for the label, spent his career refusing it.
      </P>
      <Blockquote
        attribution="Ali Farka Touré, quoted in The Guardian"
        cite="guardian-toure"
        sources={SOURCES}
      >
        &ldquo;This music has been taken from here. I play traditional music and
        I don&rsquo;t know what blues is. For me, blues is a type of soap
        powder.&rdquo;
      </Blockquote>
      <P>
        <ArtistLink id="tinariwen">Tinariwen</ArtistLink>, the Tuareg collective
        from northern Mali and southern Algeria whose founder learned partly from
        Touré&rsquo;s cassettes, say they had not heard American blues at all
        until they began touring internationally in the 2000s; the bootlegs that
        reached the Sahara were Dire Straits and Jimi Hendrix.
        <Ref id="wikipedia-tinariwen" /> What the map shows there is shared
        ancestry — the savanna practices described{" "}
        <a
          href="#predecessors"
          className="text-foreground underline-offset-2 hover:underline"
        >
          at the top of this article
        </a>{" "}
        — not a round trip.
      </P>
      <P>
        Japan arrived at the blues backwards. Its blues boom came in the
        1970s, <em>after</em> rock rather than before it, as musicians chasing
        what &ldquo;real rock&rdquo; meant traced it back to its sources; the
        Kansai blues scene of Kyoto and Osaka is what that search produced.
        <Ref id="nagai-2023" /> Infrastructure followed the enthusiasm: the Tokyo
        label P-Vine started in 1976 to put blues and R&amp;B on Japanese
        shelves, and named itself after the Peavine railroad branch that Delta
        bluesmen sang about.<Ref id="wikipedia-pvine" />
      </P>
      <P>
        Two more scenes grew far from any migration route. Byron Bay&rsquo;s
        Bluesfest opened in New South Wales in 1990 as an indoor Easter weekend
        for six thousand people and became a five-day festival drawing over a
        hundred thousand.<Ref id="bluesfest-about" /> In Canada,{" "}
        <ArtistLink id="downchild">Downchild</ArtistLink> — house band at a
        Toronto tavern from 1969 — wrote two of the songs the Blues Brothers put
        on <em>Briefcase Full of Blues</em> in 1978, which is how a Toronto bar
        repertoire reached American radio.
        <Ref id="canadian-encyclopedia-downchild" />
      </P>
      <P>
        None of this gives the blues a second birthplace. It has one origin
        story and many adoptions, and the honest way to draw that is a map with
        a single source region and a long list of places that took the music in,
        taught it, and sent it back changed.
      </P>

      <H2 id="legacy">What the blues carried</H2>
      <P>
        The blues became the root system of American popular music, but it was
        never only about private sorrow. From work songs protesting prison
        conditions to{" "}
        <ArtistLink id="billie-holiday">Billie Holiday</ArtistLink>&rsquo;s{" "}
        <SongLink id="strange-fruit" />,
        the form also carried a language of witness and protest.<Ref id="loc-protest" />{" "}
        To hear how its pieces fit together — the 12-bar form, the shuffle, the
        scale — take it apart on the{" "}
        <Link
          href="/genres/blues"
          className="text-foreground underline-offset-2 hover:underline"
        >
          What is the blues?
        </Link>{" "}
        page.
      </P>

      <SourceList sources={SOURCES} />

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
        Quotations are reproduced briefly for commentary and criticism, with
        attribution and links to the originals. Where a source is public domain
        it is marked as such; other works are quoted under fair use. Click a
        song title to play a popular recording in place or open it in the Piano
        Roll.
      </p>
    </article>
  );
}
