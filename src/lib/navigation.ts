/**
 * Navigation configuration
 * Centralized definition of all navigation items
 */

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
  },
  {
    id: "synth",
    label: "WebSynth",
    icon: "🎹",
    href: "/synth/v2",
    description: "Web-based synthesizer keyboard",
    inNav: false,
  },
  {
    id: "harmonica-lab",
    label: "Harmonica Lab",
    icon: "🚂",
    href: "/harmonica-lab/v2",
    description: "Position guide & theory for diatonic harmonica",
    inNav: false,
  },
  {
    id: "piano-roll",
    label: "Piano Roll",
    icon: "🎼",
    href: "/piano-roll",
    description: "Draw, play, and edit melodies on a piano roll",
    inNav: false,
    beta: true,
  },
  {
    id: "scales",
    label: "Scales",
    icon: "🎶",
    href: "/scales",
    description: "How scales and modes are built — see it, hear it, play it",
    inNav: false,
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
