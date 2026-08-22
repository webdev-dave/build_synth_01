"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type HistoryAvailability = {
  canGoBack: boolean;
  canGoForward: boolean;
};

function readNavigationApi(): HistoryAvailability | null {
  if (typeof window === "undefined") return null;

  const nav = (
    window as Window & {
      navigation?: { canGoBack: boolean; canGoForward: boolean };
    }
  ).navigation;

  if (!nav || typeof nav.canGoBack !== "boolean") return null;

  return { canGoBack: nav.canGoBack, canGoForward: nav.canGoForward };
}

/** Whether browser history back/forward are currently available. */
export function useBrowserHistoryNav(): HistoryAvailability {
  const pathname = usePathname();
  const stackRef = useRef<string[]>([]);
  const indexRef = useRef(0);
  const fromPopStateRef = useRef(false);
  const [availability, setAvailability] = useState<HistoryAvailability>({
    canGoBack: false,
    canGoForward: false,
  });

  const sync = useCallback(() => {
    const fromApi = readNavigationApi();
    if (fromApi) {
      setAvailability(fromApi);
      return;
    }

    setAvailability({
      canGoBack:
        indexRef.current > 0 ||
        (typeof window !== "undefined" && window.history.length > 1),
      canGoForward: indexRef.current < stackRef.current.length - 1,
    });
  }, []);

  useEffect(() => {
    const onPopState = () => {
      fromPopStateRef.current = true;
      queueMicrotask(sync);
    };

    window.addEventListener("popstate", onPopState);

    const nav = (window as Window & { navigation?: EventTarget }).navigation;
    nav?.addEventListener("currententrychange", sync);

    return () => {
      window.removeEventListener("popstate", onPopState);
      nav?.removeEventListener("currententrychange", sync);
    };
  }, [sync]);

  useEffect(() => {
    if (stackRef.current.length === 0) {
      stackRef.current = [pathname];
      indexRef.current = 0;
      sync();
      return;
    }

    if (fromPopStateRef.current) {
      fromPopStateRef.current = false;
      const idx = stackRef.current.lastIndexOf(pathname);
      if (idx >= 0) indexRef.current = idx;
    } else if (stackRef.current[indexRef.current] !== pathname) {
      stackRef.current = stackRef.current.slice(0, indexRef.current + 1);
      stackRef.current.push(pathname);
      indexRef.current = stackRef.current.length - 1;
    }

    sync();
  }, [pathname, sync]);

  return availability;
}
