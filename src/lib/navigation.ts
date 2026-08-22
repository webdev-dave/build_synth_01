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
  /**
   * Redesigned v2 route, while it is in beta. The hamburger sends people here
   * so the beta gets real use; `href` stays the legacy page it replaces.
   * Drop this field once v2 becomes the page at `href`.
   */
  betaHref?: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    icon: "🏠",
    href: "/",
    description: "Browse all apps & tools",
  },
  {
    id: "synth",
    label: "Play Synth",
    icon: "🎹",
    href: "/synth",
    description: "Web-based synthesizer keyboard",
    inNav: false,
    betaHref: "/synth/v2",
  },
  {
    id: "harmonica-lab",
    label: "Harmonica Lab",
    icon: "🚂",
    href: "/harmonica-lab",
    description: "Position guide & theory for diatonic harmonica",
    inNav: false,
    betaHref: "/harmonica-lab/v2",
  },
  // TODO: Re-enable when accuracy is improved
  // {
  //   id: "key-detector",
  //   label: "Key Detector",
  //   icon: "🎤",
  //   href: "/#key-detector",
  //   description: "Real-time musical key detection",
  //   hidden: true,
  // },
];

export const APP_NAME = "Instrumaps";

/**
 * Apps/tools shown as widgets on the homepage.
 * Derived from NAV_ITEMS, excluding the Home entry and any hidden items.
 */
export const APPS: NavItem[] = NAV_ITEMS.filter(
  (item) => item.id !== "home" && !item.hidden
);

/** Top-bar links (Back is rendered separately). Currently Home only. */
export const NAV_BAR_ITEMS: NavItem[] = NAV_ITEMS.filter(
  (item) => !item.hidden && item.inNav !== false
);

/** Hamburger drawer: every visible destination, including apps hidden from the top bar. */
export const DRAWER_ITEMS: NavItem[] = NAV_ITEMS.filter((item) => !item.hidden);
