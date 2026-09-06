/**
 * Navigation configuration
 * Centralized definition of all navigation items
 */

export type AppSectionId = "learn" | "instruments" | "tools";

export interface AppSection {
  id: AppSectionId;
  title: string;
  description: string;
}

/** Homepage + hamburger groupings. Order here is the order they render. */
export const APP_SECTIONS: AppSection[] = [
  {
    id: "learn",
    title: "Learn",
    description:
      "Genres, scales, history, cousins, and the people and songs behind them.",
  },
  {
    id: "instruments",
    title: "Instruments",
    description: "Playable instruments — press a note and hear the theory.",
  },
  {
    id: "tools",
    title: "Tools",
    description: "Studios for writing, editing, and arranging.",
  },
];

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  href: string;
  description?: string;
  hidden?: boolean;
  /** When false, omitted from the top bar (Back/Home). Still in the hamburger. Default true. */
  inNav?: boolean;
  /** Early/public beta — shown as a badge on the home widget and in the hamburger. */
  beta?: boolean;
  /** Homepage / drawer group. Home itself is ungrouped. */
  section?: AppSectionId;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    href: "/",
    description: "Browse all apps & tools",
    inNav: false,
  },
  {
    id: "genres",
    label: "Genres",
    icon: "💿",
    href: "/genres",
    description: "What makes a genre sound like itself — layer by layer",
    inNav: false,
    section: "learn",
  },
  {
    id: "scales",
    label: "Scales",
    icon: "🎶",
    href: "/scales",
    description: "How scales and modes are built — see it, hear it, play it",
    inNav: false,
    section: "learn",
  },
  {
    id: "concepts",
    label: "Concepts",
    icon: "📑",
    href: "/concepts",
    description: "A playable glossary of the music-theory terms behind the app",
    inNav: false,
    section: "learn",
  },
  {
    id: "history",
    label: "Musical History",
    icon: "📖",
    href: "/history",
    description: "Where the sounds came from — sourced, quoted, and linked",
    inNav: false,
    section: "learn",
  },
  {
    id: "map",
    label: "History Map",
    icon: "🗺️",
    href: "/map",
    description: "A world map of music history — click a place, hear its story",
    inNav: false,
    beta: true,
    section: "learn",
  },
  {
    id: "artists",
    label: "Artists",
    icon: "🎤",
    href: "/artists",
    description: "The musicians behind the music — bios, songs, and histories",
    inNav: false,
    section: "learn",
  },
  {
    id: "songs",
    label: "Songs",
    icon: "🎵",
    href: "/songs",
    description: "Landmark recordings — hear them, open them, trace them back",
    inNav: false,
    section: "learn",
  },
  {
    id: "cousins",
    label: "Cousins",
    icon: "🌿",
    href: "/cousins",
    description:
      "One melody, many lives — rearrangements, translations, folk variants",
    inNav: false,
    section: "learn",
  },
  {
    id: "languages",
    label: "Languages",
    icon: "🗣️",
    href: "/languages",
    description: "Browse genres, songs, and words by the language they speak",
    inNav: false,
    section: "learn",
  },
  {
    id: "synth",
    label: "WebSynth",
    icon: "🎹",
    href: "/synth/v2",
    description: "Web-based synthesizer keyboard",
    inNav: false,
    section: "instruments",
  },
  {
    id: "harmonica-lab",
    label: "Harmonica Lab",
    icon: "🚂",
    href: "/harmonica-lab/v2",
    description: "Position guide & theory for diatonic harmonica",
    inNav: false,
    section: "instruments",
  },
  {
    id: "piano-roll",
    label: "Piano Roll",
    icon: "🎼",
    href: "/piano-roll",
    description: "Draw, play, and edit melodies on a piano roll",
    inNav: false,
    beta: true,
    section: "tools",
  },
];

export const APP_NAME = "Instrumaps";

/**
 * Apps/tools shown as widgets on the homepage.
 * Derived from NAV_ITEMS, excluding the Home entry and any hidden items.
 */
export const APPS: NavItem[] = NAV_ITEMS.filter(
  (item) => item.id !== "home" && !item.hidden
);

export interface AppSectionGroup {
  section: AppSection;
  apps: NavItem[];
}

/** Homepage / drawer groups, in APP_SECTIONS order. Empty groups are omitted. */
export const APP_SECTION_GROUPS: AppSectionGroup[] = APP_SECTIONS.map(
  (section) => ({
    section,
    apps: APPS.filter((app) => app.section === section.id),
  })
).filter((group) => group.apps.length > 0);

/** Top-bar links (Back is rendered separately). */
export const NAV_BAR_ITEMS: NavItem[] = NAV_ITEMS.filter(
  (item) => !item.hidden && item.inNav !== false
);

/** Hamburger drawer: every visible destination, including apps hidden from the top bar. */
export const DRAWER_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.hidden);

/** True for a nav destination and its legacy sibling (e.g. /synth and /synth/v2). */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.href === "/") return pathname === "/";
  const base = item.href.replace(/\/v2$/, "");
  return pathname === base || pathname.startsWith(`${base}/`);
}
