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
  },
  {
    id: "harmonica-lab",
    label: "Harmonica Lab",
    icon: "🚂",
    href: "/harmonica-lab",
    description: "Position guide & theory for diatonic harmonica",
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
