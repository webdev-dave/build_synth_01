"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioLines, Menu, X } from "lucide-react";

import { NAV_ITEMS, APP_NAME } from "@/lib/navigation";
import { getAppIcon } from "@/lib/appIcons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Header bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="mx-auto flex h-12 max-w-[1200px] items-center justify-between px-4">
          {/* Logo/App name */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground transition-colors hover:text-foreground/80"
          >
            <AudioLines className="h-5 w-5" strokeWidth={1.75} />
            <span>{APP_NAME}</span>
          </Link>

          {/* Desktop nav links (hidden on mobile) */}
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.filter((item) => !item.hidden).map((item) => {
              const Icon = getAppIcon(item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

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
            "absolute right-0 top-0 h-full w-72 max-w-[85vw] transform border-l border-border bg-background shadow-2xl transition-transform duration-300 ease-out",
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
          <nav className="space-y-1 p-4">
            {NAV_ITEMS.filter((item) => !item.hidden).map((item) => {
              const Icon = getAppIcon(item.id);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block rounded-lg p-3 transition-colors",
                    isActive(item.href)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" strokeWidth={1.75} />
                    <div>
                      <div className="font-medium text-foreground">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="mt-0.5 text-xs text-muted-foreground">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 border-t border-border p-4">
            <p className="text-center text-xs text-muted-foreground">
              More tools coming soon
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
