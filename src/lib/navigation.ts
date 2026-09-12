/**
 * Navigation configuration
 * Centralized definition of all navigation items
 */

export type AppSectionId = "theory" | "music" | "play";

export interface AppSection {
  id: AppSectionId;
  title: string;
  /** Omitted when the title already says it (the instruments/tools group). */
  description?: string;
}

/** Homepage + hamburger groupings. Order here is the order they render. */
export const APP_SECTIONS: AppSection[] = [
  {
    id: "theory",
    title: "Theory",
    description: "Genres, scales, concepts, and where the sounds came from.",
  },
  {
    id: "music",
    title: "Music",
    description:
      "Songs, the artists behind them, and the melodies they have in common.",
  },
  {
    id: "play",
    title: "Instruments, Editors & Tools",
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
  /** Drawer nest: render under this nav id. Omitted from the homepage grid. */
  parent?: string;
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
    section: "theory",
  },
  {
    id: "scales",
    label: "Scales",
    icon: "🎶",
    href: "/scales",
    description: "How scales and modes are built — see it, hear it, play it",
    inNav: false,
    section: "theory",
  },
  {
    id: "history",
    label: "History",
    icon: "📖",
    href: "/history",
    description: "Where the sounds came from — sourced, quoted, and linked",
    inNav: false,
    section: "theory",
  },
  {
    id: "map",
    label: "Map",
    icon: "🗺️",
    href: "/map",
    description: "A world map of music history — click a place, hear its story",
    inNav: false,
    beta: true,
    section: "theory",
    parent: "history",
  },
  {
    id: "languages",
    label: "Languages",
    icon: "🗣️",
    href: "/languages",
    description: "Browse genres, songs, and words by the language they speak",
    inNav: false,
    section: "theory",
  },
  /* Reference, so it sits last in Theory: the other pages teach a sound,
     this one defines the words they use. */
  {
    id: "concepts",
    label: "Concepts & Terms",
    icon: "📑",
    href: "/concepts",
    description:
      "An interactive glossary of the music-theory terms behind the app",
    inNav: false,
    section: "theory",
  },
  {
    id: "songs",
    label: "Songs",
    icon: "🎵",
    href: "/songs",
    description: "Landmark recordings — hear them, open them, trace them back",
    inNav: false,
    section: "music",
  },
  {
    id: "artists",
    label: "Artists",
    icon: "🎤",
    href: "/artists",
    description: "The musicians behind the music — bios, songs, and histories",
    inNav: false,
    section: "music",
  },
  {
    id: "cousins",
    label: "Cousins",
    icon: "🌿",
    href: "/cousins",
    description:
      "One melody, many lives — rearrangements, translations, folk variants",
    inNav: false,
    section: "music",
  },
  {
    id: "synth",
    label: "WebSynth",
    icon: "🎹",
    href: "/synth/v2",
    description: "Web-based synthesizer keyboard",
    inNav: false,
    section: "play",
  },
  {
    id: "harmonica-lab",
    label: "Harmonica Lab",
    icon: "🚂",
    href: "/harmonica-lab/v2",
    description: "Position guide & theory for diatonic harmonica",
    inNav: false,
    section: "play",
  },
  {
    id: "piano-roll",
    label: "Piano Roll",
    icon: "🎼",
    href: "/piano-roll",
    description: "Draw, play, and edit melodies on a piano roll",
    inNav: false,
    beta: true,
    section: "play",
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

/**
 * Section groups for the homepage grid and the drawer. Both show every
 * visible app in the section; the drawer additionally nests children under
 * their `parent`.
 */
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
