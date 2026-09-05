/**
 * In-article song helpers: the jump-target anchor id and the "find me" event
 * the jump-nav fires so the target song can highlight itself on arrival.
 *
 * Song *data* lives in the catalog (`src/lib/catalog/songs.ts`); articles refer
 * to songs by slug. These helpers just wire the in-page scroll + highlight.
 */

export function songAnchorId(id: string) {
  return `song-${id}`;
}

/** Dispatched when a jump-nav link scrolls to a song in the article. */
export const FIND_SONG_EVENT = "instrumaps:find-song";

export function findSongInArticle(id: string) {
  window.dispatchEvent(new CustomEvent(FIND_SONG_EVENT, { detail: id }));
}
