/**
 * "Where else does Dona Dona live?" — the body of /cousins/dona-dona.
 *
 * Two catalog songs now hold the words and players: the Yiddish original
 * (`dona-dona`) and the English "Donna, Donna" (`donna-donna`). This article
 * is the travel essay tying them together. Server-rendered so quotes and
 * footnotes ship in the static HTML; the players are collapsed by default.
 */
import Link from "next/link";

import { getCousin } from "@/lib/cousins/registry";
import { Cite, SourceList } from "@/components/history/citations";
import { SongJumpNav } from "@/components/history/SongJumpNav";
import { SongLink } from "@/components/history/SongLink";
import { ArtistLink } from "@/components/catalog/ArtistLink";
import { Word } from "@/components/words/Word";
import { CollapsibleVideo } from "@/components/media/CollapsibleVideo";
import { CousinFamilyList } from "@/components/cousins/CousinFamilyList";

const ARTICLE = getCousin("dona-dona");
const SOURCES = ARTICLE?.sources ?? [];
const SONG_IDS = ["dona-dona", "donna-donna"];

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

export function DonaDonaCousins() {
  return (
    <article className="mt-8">
      <SongJumpNav ids={SONG_IDS} />

      <H2 id="esterke">A calf for a Polish legend</H2>
      <P>
        <ArtistLink id="aaron-zeitlin">Aaron Zeitlin</ArtistLink> wrote the
        lyric and <ArtistLink id="sholom-secunda">Sholom Secunda</ArtistLink>{" "}
        the tune for Zeitlin’s play <em>Esterke</em>, staged by{" "}
        <ArtistLink id="maurice-schwartz">Maurice Schwartz</ArtistLink> at the
        Yiddish Art Theatre in 1940–41.<Ref id="mlotek-dona" />
        <Ref id="wikipedia-dona-dona" /> The play retells the Polish legend of
        Esterke and King Casimir. The song — first titled{" "}
        <em>Dana Dana</em>, also known as{" "}
        <Word id="dos-kelbl">
          <em>Dos kelbl</em>
        </Word>{" "}
        (“the calf”) — is a parable: a bound calf on a wagon, a swallow free
        in the sky, and a wind that laughs in the rye.
      </P>
      <P>
        Metro Music published the sheet music in New York in 1943. Later
        collections sometimes credited a Warsaw Ghetto poet; that is a
        mistake — Zeitlin wrote the words in New York.
        <Ref id="wikipedia-zeitlin" />
        <Ref id="mlotek-dona" /> Listeners after the war often heard the calf
        as a Holocaust allegory. Zeitlin had written it before the murder of
        his family; the song is older than that reading, even if the reading
        is how many people now meet it.
      </P>
      <P>
        The Yiddish original —{" "}
        <SongLink id="dona-dona">Dona Dona</SongLink>, with{" "}
        <ArtistLink id="the-shvesters">The Shvesters</ArtistLink> singing it
        live:
      </P>
      <CollapsibleVideo videoId="hVZnQ6THZrI" label="Yiddish — The Shvesters, live" />

      <H2 id="dana">Not a woman’s name</H2>
      <P>
        The refrain — <em>dana, dana</em> — is not a woman’s name. It is a
        Polish folk vocable: syllables that fill a chorus without carrying a
        dictionary meaning. Singers have long tucked it into dance songs as{" "}
        <Word id="oj-dana">
          <em>oj, dana dana</em>
        </Word>{" "}
        or <em>oj, dana dana, moja dana</em> — a call that can imitate an
        instrument, mark the beat, or just give the room something to shout.
        <Ref id="trochimczyk-oberek" /> Zeitlin grew up in
        that Polish-speaking world and left it only in 1939; the refrain is
        almost certainly what he brought with him.
        <Ref id="wikipedia-dona-dona" />
      </P>
      <P>
        One folk etymology, circulated when Kol Israel aired Nechama Hendel’s
        Hebrew of the song in 1962, hears <em>dana</em> as the sound a
        cart-driver calls to keep a horse stepping under a load. That reading
        sits next to Zeitlin’s bound calf on a wagon, but it is one telling,
        not a settled translation. What English ears later heard was simpler:
        “Dona,” then “Donna” — as if the calf were being sung to a woman.
        <Ref id="wikipedia-dona-dona" />
      </P>

      <H2 id="folk">Folk-circuit Yiddish, then the whole revival</H2>
      <P>
        <ArtistLink id="sholom-secunda">Secunda</ArtistLink> made an English
        version that did not travel. In 1953{" "}
        <ArtistLink id="arthur-kevess">Arthur Kevess</ArtistLink> published a
        singable translation in <em>Sing Out!</em>; in 1956 he and{" "}
        <ArtistLink id="teddi-schwartz">Teddi Schwartz</ArtistLink> revised it
        for their pamphlet <em>Tumbalalaika</em>, and that is the English most
        later singers used.<Ref id="wikipedia-dona-dona" />
      </P>
      <P>
        <ArtistLink id="theodore-bikel">Theodore Bikel</ArtistLink> recorded
        the Yiddish on his 1959 Elektra album{" "}
        <em>Theodore Bikel Sings More Jewish Folk Songs</em>, keeping the
        theater song alive on the American folk circuit just before the
        English crossed over.<Ref id="wikipedia-bikel" /> We do not yet have a
        verified upload of that side to play here.
      </P>
      <P>
        <ArtistLink id="joan-baez">Joan Baez</ArtistLink> put the
        Kevess–Schwartz English on her 1960 Vanguard debut as{" "}
        <SongLink id="donna-donna">Donna, Donna</SongLink>, and the calf
        became a folk-revival standard — sung at civil-rights gatherings,
        covered by <ArtistLink id="donovan">Donovan</ArtistLink> on his 1965
        debut, and translated onward into Hebrew, German, French, Japanese,
        and more.
        <Ref id="wikipedia-baez" />
        <Ref id="wikipedia-donovan" />
        <Ref id="wikipedia-dona-dona" /> Those later languages are real lives;
        they get their own catalog rows when we can point at a sourced
        recording.
      </P>
      <CollapsibleVideo videoId="j1zBEWyBJb0" label="English — Joan Baez, 1960" />

      <H2 id="family">The family, as a list</H2>
      <P>
        Two catalog songs now: the Yiddish original and the English standard.
        The{" "}
        <Link
          href="/songs/dona-dona"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Yiddish page
        </Link>{" "}
        holds Zeitlin and Secunda’s words and{" "}
        <ArtistLink id="the-shvesters">The Shvesters</ArtistLink>’ recording;
        the{" "}
        <Link
          href="/songs/donna-donna"
          className="text-foreground underline-offset-2 hover:underline"
        >
          English page
        </Link>{" "}
        holds Kevess and Schwartz’s translation and{" "}
        <ArtistLink id="joan-baez">Baez</ArtistLink>’s 1960 side. Hebrew,
        French, and a dedicated Bikel player can join as separate rows when we
        have verified uploads.<Ref id="shvesters-about" />
      </P>
      {ARTICLE && <CousinFamilyList article={ARTICLE} />}

      <P>
        For the wider Yiddish-stage crossings this song sits among, see{" "}
        <Link
          href="/history/klezmer"
          className="text-foreground underline-offset-2 hover:underline"
        >
          Where did klezmer come from?
        </Link>
        .
      </P>

      <SourceList sources={SOURCES} />

      <p className="mt-8 text-xs leading-relaxed text-muted-foreground/70">
        Quotations are reproduced briefly for commentary and criticism, with
        attribution and links to the originals. Where a source is public domain
        it is marked as such; other works are quoted under fair use. Click a
        song title to open its page, or a player to hear it in place.
      </p>
    </article>
  );
}
