'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Safety net: never leave navigation feedback stuck if a route fails to load.
const NAVIGATION_TIMEOUT_MS = 10000;

interface LoadingContextType {
  /** Full-screen overlay for long blocking work (e.g. image export). Not for route changes. */
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  /** Href the user just clicked; cleared once the new route is shown. */
  pendingHref: string | null;
  startNavigation: (href: string, event?: React.MouseEvent) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);

  // A pending navigation is finished as soon as the pathname moves away from where it started.
  const pendingHref = pending && pending.from === pathname ? pending.href : null;

  useEffect(() => {
    if (!pendingHref) return;
    const timer = setTimeout(() => setPending(null), NAVIGATION_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [pendingHref]);

  // Catch every internal link click (sidebar, navbar, in-page links, slider) so feedback
  // shows the moment the user clicks, before the next route has loaded.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === pathname) return;
      setPending({ href: url.pathname, from: pathname });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  const startNavigation = (href: string, event?: React.MouseEvent) => {
    // Opening in a new tab/window does not navigate this page.
    if (event && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) {
      return;
    }
    if (href === pathname) return;
    setPending({ href, from: pathname });
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading, pendingHref, startNavigation }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
