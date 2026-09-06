# Plan: Cousins — melodies that took on many lives

> **Status: first two articles shipped locally (2026-09-06) — Misirlou +
> Dona Dona. Not live until a production promote.**
> Companion to `/history` (where a *genre* came from) and `/songs` (one
> recording). This module is about a *tune* that wandered: rearrangements,
> translations, contrafacts, folk variants, and the Hasidic/other-culture
> pairs that keep turning up.

## What it is

A hub-and-spoke teaching section. Each spoke is one **melody** (a riff, hook,
nigun, dance tune), not one hit record. The article tells how that melody
moved — across years, places, languages, and genres — and every instance it
names is a real `/songs/<slug>` catalog entry, heard in place via `<SongLink>`.

Three shapes of kinship, one module (don't split them):

| Shape | Example | What's shared |
|---|---|---|
| **Tune family** | Misirlou: Greek/Ottoman folk → Jewish dance bands → Dick Dale surf | The pitches / contour, not a copyright |
| **One work, many lives** | Dona Dona: *Esterke* Yiddish → Kevess/Schwartz English → Baez, Donovan, The Shvesters | The same composition, new clothes |
| **Contrafact / borrowing** | A Hasidic nigun that is also a march, a Ukrainian song, a pop hook | New words (or no words) on a known tune |

The Hasidic-growing-up case is the long-term reason this exists: you already
know the *feeling* of “wait, that’s our nigun — and also their song.” The
module makes that kinship audible and sourced.

## Name

**Recommended: Cousins.** Route `/cousins`, `/cousins/miserlou`.

Hub tagline: **“One melody, many lives.”** Spoke title:
**“History & versions of {name}.”** Song-page card: **“History & versions.”**
Locked in `src/lib/cousins/registry.ts` (`cousinQuestion`,
`COUSIN_SONG_HEADING`, `cousinSongLinkLabel`). Do not revive
“Where else does this tune live?”.

Why this word:

- A cousin is *related*, not a copy and not a cover. That is the honest
  relationship (especially for folk variants and nigunim).
- It is the word we already reach for (“song relationships / cousins”).
- It is calm and un-academic. “Tune family” is the ethnomusicology term —
  keep it in the `about` prose, not the nav.
- It is not “covers,” “remixes,” or “samples,” which are too narrow.

Also-rans, if Cousins feels too informal later: **Kin**, **Echoes**,
**Afterlives**. Don’t use “Melody maps” — it collides with `/map`.

Nav: Learn section, next to Songs and History. `inNav: false` at first (same
as those). Icon: something lineage-shaped in `appIcons.ts` (e.g. Lucide
`GitFork` or `Share2`) — pick when we build, don’t invent a new icon set.

## How a page is arranged

Mirror History. Don’t invent a second article chrome.

**Hub `/cousins`**

- Lead: one standalone answer (“A melody can be a Greek dance, a Jewish
  wedding tune, and a surf-rock hit — same contour, new rooms.”).
- Cards: one per melody. Title = the familiar name (*Misirlou*, *Dona Dona*).
  Summary = the travel in one line. **`<GenrePills>` from `article.genres`**
  (required). Quiet chips for languages / centuries touched (derived from
  member songs, not hand-duplicated).

**Spoke `/cousins/<slug>`**

1. Title as `<h1>` (`cousinQuestion` → “History & versions of Misirlou”).
2. **`<GenrePills slugs={article.genres} />`** — required field, existing
   genre slugs only (don’t invent “rebetiko” / “surf”).
3. Quotable `answer` (meta + FAQ JSON-LD).
4. `<SongJumpNav>` of member songs, appearance order.
5. Body (server TSX): predecessors → the tune takes shape → each life in
   turn. First mention of a recording is `<SongLink id>`. First mention of a
   person is `<ArtistLink>`. Theory and loanwords as today.
6. A **family list** (not a second essay): every catalog song in this
   cousin group, with year, place, language, a one-word `kind`, and that
   song’s `<GenrePills>` when it has existing slugs.
7. `<RelatedPages>` + `<PageMapSection>` from the article’s `genres` /
   `places` / `history`.
8. Sources + the existing fair-use note.
9. Contribution footer (same humble line as history/map). Until auth is
   on: `/contact`. After: “I know another version” (see below).

**Song page `/songs/<slug>`**

Grow a “One melody, many lives” card (link: “History & versions”) via `song.cousins: ["miserlou"]`
→ `getCousinsBySong`. **At the top** of the page (title → attribution →
genre pills → cousin card → lead). Bidirectional: every `members[].song`
lists this article slug on `CatalogSong.cousins`, and every `cousins`
slug lists that song as a member. Same change, both sides. The Dona Dona
*song* page stays the home of lyrics + the two players; the Dona Dona
*cousin* page is the travel essay and the longer instance list (Hebrew,
French, etc. as we add those catalog rows).

Authoring: `.cursor/rules/cousins.mdc` and `.cursor/rules/catalog-songs.mdc`.

**Languages / map**

A cousin that lists `languages: ["yiddish"]` or member songs tagged
klezmer/yiddish shows up on `/languages/yiddish`. Places on the article
light the map the same way history does.

## Data model

Do **not** fork a second song catalog. Instances are `CatalogSong`s.
The new registry only stores the *relationship*.

```ts
// src/lib/cousins/registry.ts
interface CousinMember {
  song: string;          // catalog slug
  kind: "folk-source" | "translation" | "rearrangement"
      | "contrafact" | "quotation" | "revival";
  year?: string;         // this instance, if it differs from the song year
  place?: string;        // place-registry id
  note?: string;         // one line, not a bio
}

interface CousinArticle {
  slug: string;
  name: string;          // "Misirlou"
  question: string;      // derived: "History & versions of {name}"
  summary: string;
  answer: string;
  members: CousinMember[];
  genres: string[];      // required — pills on hub + spoke
  places?: string[];
  languages?: string[];
  history?: string[];    // e.g. klezmer, if the article belongs there
  sources: Source[];     // reuse history Source type
  status: "live" | "soon";
  keywords?: string[];
}
```

```ts
// on CatalogSong
cousins?: string[];      // reverse: this recording belongs to these articles
```

Body lives in `src/content/cousins/MiserlouCousins.tsx` (server TSX),
registered like history. Citations reuse `Cite` / `Blockquote` / `SourceList`.

**Hard rule, same as today:** name a song in the article → it has a catalog
entry first (`youtubeId` verified, lyrics sourced if possible, artist
entries for people we mention). No orphan titles.

## First two articles

### 1. Misirlou (`/cousins/miserlou`) — build this first

The reference implementation. Research before writing; do not invent a
Yiddish “version” we cannot point at.

Known spine (to verify, not to ship from memory):

- Name from Turkish *Mısırlı* (“Egyptian”). Ottoman / Greek / Arabic urban
  folk, early 20th c.
- Greek recordings (e.g. Tetos Demetriades 1927; Nick Roubanis’s later
  popularization) — catalog each distinct file.
- Jewish / Yiddish-world life: wedding-band and klezmer-dance repertoire
  (hora / freylekhs treatments), any *documented* Yiddish lyric or labeled
  Jewish 78. This is the mention you asked for — it has to be a real
  recording or a cited contemporary account, then its own `/songs` row.
- Dick Dale, 1962 (surf; later *Pulp Fiction*). The rearrangement most
  English listeners think *is* the song.
- Later rock / film quotes as a short coda, only if we catalog them.

Geography on the map: eastern Mediterranean + New York + California.

### 2. Dona Dona (`/cousins/dona-dona`) — second

The song page already holds the Yiddish/English lyrics and The Shvesters +
Baez players. The cousin article is the *evolution essay* plus instances we
have not catalogued yet (Bikel as its own row if we want a dedicated
Yiddish-1959 player, Hebrew/French/etc. as we find verified uploads).
`members` point at `dona-dona` and any new slugs. Don’t duplicate the lyric
block; link to `/songs/dona-dona`.

## Screenshot pairs (Hasidic ↔ elsewhere)

Workflow when you send playlist screenshots:

1. Identify both sides (title, artist, language, a source URL).
2. Ingest/create two `CatalogSong`s (+ artists). Lyrics if we can source
   them; YouTube (and later Spotify embed) verified, never from memory.
3. Either add both as `members` of an existing cousin, or open a new
   article if it’s a new melody.
4. Write the kinship in prose (who borrowed, which way, or “shared folk
   stock — direction unknown”). Don’t launder a just-so story.

We do **not** need Spotify audio-features for this. Playback identity can
wait for the [Spotify embed plan](spotify-integration.md); knowledge stays
in our catalog.

## User suggestions (later — don’t build a second pipe)

This is exactly the “open-sourced, or we only have the cases I know”
problem already scoped in
[music-history-map-and-contributions.md](music-history-map-and-contributions.md).

Reuse that system. Git stays the source of truth; the database is a
**queue**.

| When | What the user can do |
|---|---|
| **Now** (static export, no auth) | Cousin footer → `/contact`. You forward screenshots in chat; we write. |
| **Auth on** (Supabase already coded, dormant) | Same “Suggest an improvement” modal. Add `target_type: "cousin"` and `kind: "instance"`. Form fields: other title, artist, year if known, link (YouTube/Spotify/page), one sentence on *how* they’re related, a source. |
| **Structured (stage 2)** | “Add a version” matches `CousinMember` so an accepted row is close to a registry append. Credit the suggester on the article. |
| **Not in scope until a community exists** | Public wiki editing of the essay. |

Do not let suggestions go live unreviewed. A bad kinship (two songs that
only share a Phrygian flavor) would teach a lie.

Extend the existing `submissions` kinds; don’t add a parallel table until
volume hurts.

## Honesty rules (this module will be tempted)

- **Kinship is a claim.** Cite a recording, a score, a scholar, or a
  contemporary account. “Sounds similar” is not enough.
- **Direction can be unknown.** Say so. Hasidic oral history often
  reverses or forgets a secular source; that’s part of the story.
- **Same mode ≠ cousins.** Freygish / Hijaz / Phrygian dominant is a
  neighborhood, not a melody.
- **Copyright.** Lyrics and long quotes follow the history-articles rule.
  Instances we can’t hear legally still get a catalog row with a source
  link and no pirate upload.

## Phases

0. **Skeleton.** Done — registry, `/cousins` hub + `[slug]` spoke, nav
   (`inNav: false`), sitemap, `CatalogSong.cousins` reverse card at the
   top of the song page, required `genres` + pills, authoring in
   `.cursor/rules/cousins.mdc` and `.cursor/rules/catalog-songs.mdc`.
1. **Misirlou.** Done as the reference implementation (Demetriades 1927,
   Patrinos ~1930, Rexite/Kressyn Yiddish ~1948 via UW–Madison, Dale 1962).
2. **Dona Dona cousin article.** Done — travel essay; lyrics stay on
   `/songs/dona-dona`. Extra instances (Bikel player, Hebrew/French) still
   wait on verified uploads.
3. **Screenshot pipeline.** You send pairs; we add members or new slugs.
   Keep a private working list in the plan or a `ToDo` as the queue fills.
4. **Suggestions.** When Supabase env vars are on: cousin footer uses the
   existing modal with `target_type: "cousin"`. Admin still = you merge
   into git.

## What you do next (no code required)

- Confirm or reject the name **Cousins**.
- Send the first screenshot pair(s) whenever — they can land as `soon`
  registry rows even before the Misirlou essay is finished.
- Misirlou Yiddish: if you already have a specific recording in mind
  (filename, artist, a link), send it so we don’t pick a weak stand-in.

## Relevant existing files

| Purpose | Path |
|---|---|
| Pattern to copy | `src/lib/history/registry.ts`, `src/content/history/KlezmerHistory.tsx` |
| Songs / artists | `src/lib/catalog/songs.ts`, `artists.ts` |
| Authoring rules | `.cursor/rules/history-articles.mdc` |
| Contribution / auth | `docs/plans/music-history-map-and-contributions.md`, `docs/plans/supabase-setup.md` |
| Spotify (playback later) | `docs/plans/spotify-integration.md` |
| Nav | `src/lib/navigation.ts` |
