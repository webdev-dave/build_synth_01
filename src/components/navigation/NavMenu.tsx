"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, APP_NAME } from "@/lib/navigation";

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
      <header className="sticky top-0 z-40 bg-[#1a1a24]/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-[1200px] mx-auto px-4 h-12 flex items-center justify-between">
          {/* Logo/App name */}
          <Link
            href="/"
            className="flex items-center gap-2 text-white font-semibold hover:text-blue-300 transition-colors"
          >
            <span className="text-xl">🎹</span>
            <span className="hidden sm:inline">{APP_NAME}</span>
          </Link>

          {/* Desktop nav links (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.filter((item) => !item.hidden).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Hamburger button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors md:hidden"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>

          {/* Desktop hamburger for quick access */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden md:flex p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <HamburgerIcon isOpen={isOpen} />
          </button>
        </div>
      </header>

      {/* Mobile slide-out menu */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-72 max-w-[85vw] bg-[#12121a] border-l border-gray-700 shadow-2xl transform transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <span className="text-lg font-semibold text-white flex items-center gap-2">
              <span>🎹</span>
              {APP_NAME}
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Nav items */}
          <nav className="p-4 space-y-2">
            {NAV_ITEMS.filter((item) => !item.hidden).map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block p-3 rounded-lg transition-all ${
                  isActive(item.href)
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs text-gray-400 mt-0.5">
                        {item.description}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              More tools coming soon
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function HamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      {isOpen ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      )}
    </svg>
  );
}
