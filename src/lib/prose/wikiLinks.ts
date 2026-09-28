/**
 * Inline Wikipedia links in registry prose, which cannot hold JSX.
 *
 *   his sister [Sarah](https://en.wikipedia.org/wiki/Sarah_Reisen)
 *
 * `makeTermLinker()` renders these. Search and FAQ text should call
 * `stripWikiLinks` so the URL never leaks into plain text.
 * House rule: `.cursor/rules/person-names.mdc`.
 */

const WIKI_LINK =
  /\[([^\[\]\n]+)\]\((https:\/\/[a-z0-9-]+\.wikipedia\.org\/wiki\/[^\s()]+(?:\([^\s()]*\))?)\)/g;

/** Drop the markup and keep the visible name. */
export function stripWikiLinks(text: string): string {
  return text.replace(WIKI_LINK, "$1");
}

export interface WikiLinkMatch {
  label: string;
  url: string;
  index: number;
  length: number;
}

export function wikiLinksIn(text: string): WikiLinkMatch[] {
  const re = new RegExp(WIKI_LINK.source, "g");
  const out: WikiLinkMatch[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({
      label: m[1],
      url: m[2],
      index: m.index,
      length: m[0].length,
    });
  }
  return out;
}
