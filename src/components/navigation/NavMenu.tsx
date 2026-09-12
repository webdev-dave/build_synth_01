"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, AudioLines, Menu, X } from "lucide-react";

import {
  NAV_BAR_ITEMS,
  DRAWER_ITEMS,
  APP_SECTION_GROUPS,
  APP_NAME,
  isNavItemActive,
  type NavItem,
} from "@/lib/navigation";
import { getAppIcon } from "@/lib/appIcons";
import { useBrowserHistoryNav } from "@/hooks/useBrowserHistoryNav";
import GlobalSearch from "@/components/navigation/GlobalSearch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navLinkClass = (active: boolean) =>
  cn(
    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
    active
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-foreground"
  );

const historyButtonClass =
  "h-8 w-8 text-muted-foreground disabled:pointer-events-none disabled:opacity-35";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { canGoBack, canGoForward } = useBrowserHistoryNav();

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="flex h-12 items-center gap-2 px-3 sm:px-4">
          <div className="flex shrink-0 items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-foreground/80"
            >
              <AudioLines className="h-5 w-5" strokeWidth={1.75} />
              <span>{APP_NAME}</span>
            </Link>

            {/* Browser-style history controls: compact icon pair, like browser chrome */}
            <div className="flex items-center gap-0.5 border-l border-border pl-2 sm:pl-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                disabled={!canGoBack}
                className={historyButtonClass}
                aria-label="Go back"
                title="Back"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.forward()}
                disabled={!canGoForward}
                className={historyButtonClass}
                aria-label="Go forward"
                title="Forward"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
              </Button>
            </div>
          </div>

          <div className="flex min-w-0 flex-1 justify-end">
            <GlobalSearch />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {NAV_BAR_ITEMS.length > 0 && (
              <nav className="hidden items-center gap-1 md:flex">
                {NAV_BAR_ITEMS.map((item) => {
                  const Icon = getAppIcon(item.id);
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className={navLinkClass(isNavItemActive(pathname, item))}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.75} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            )}

            {/* Hamburger button (mobile) */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="h-9 w-9 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Desktop hamburger for quick access */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="hidden h-9 w-9 text-muted-foreground md:inline-flex"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Slide-out menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={cn(
            "absolute right-0 top-0 flex h-full w-72 max-w-[85vw] transform flex-col border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="flex items-center gap-2 text-lg font-semibold text-foreground">
              <AudioLines className="h-5 w-5" strokeWidth={1.75} />
              {APP_NAME}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-muted-foreground"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Nav items */}
          <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
            {DRAWER_ITEMS.filter((item) => !item.section).map((item) => (
              <DrawerLink
                key={item.id}
                item={item}
                pathname={pathname}
                onNavigate={() => setIsOpen(false)}
              />
            ))}
            {APP_SECTION_GROUPS.map((group) => (
              <div key={group.section.id}>
                <p className="mb-1 px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {group.section.title}
                </p>
                <div className="space-y-1">
                  {group.apps
                    .filter((item) => !item.parent)
                    .map((item) => (
                      <div key={item.id}>
                        <DrawerLink
                          item={item}
                          pathname={pathname}
                          onNavigate={() => setIsOpen(false)}
                        />
                        {group.apps
                          .filter((child) => child.parent === item.id)
                          .map((child) => (
                            <DrawerLink
                              key={child.id}
                              item={child}
                              pathname={pathname}
                              onNavigate={() => setIsOpen(false)}
                              nested
                            />
                          ))}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="shrink-0 border-t border-border p-4">
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              About the developer
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function DrawerLink({
  item,
  pathname,
  onNavigate,
  nested = false,
}: {
  item: NavItem;
  pathname: string;
  onNavigate: () => void;
  nested?: boolean;
}) {
  const Icon = getAppIcon(item.id);
  /* One line per destination: the homepage grid carries the descriptions, so
     repeating them here just made the drawer scroll. */
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.description}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        nested && "ml-5",
        isNavItemActive(pathname, item)
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.75} />
      <span className="truncate text-sm font-medium text-foreground">
        {item.label}
      </span>
      {item.beta && (
        <Badge variant="secondary" className="ml-auto shrink-0">
          Beta
        </Badge>
      )}
    </Link>
  );
}
