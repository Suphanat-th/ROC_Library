'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { DARK_THEME, LIGHT_THEME, THEME_STORAGE_KEY } from './theme';


function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const getTheme = () => document.documentElement.getAttribute('data-theme') ?? LIGHT_THEME;
// Unknown on the server: the saved Theme mode only exists in the browser.
const getServerTheme = () => null;

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const isDark = theme === DARK_THEME;

  const toggle = () => {
    const next = isDark ? LIGHT_THEME : DARK_THEME;
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage blocked (private mode): the choice still applies for this visit.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn btn-ghost btn-circle"
      aria-label={isDark ? 'สลับเป็นโหมดสว่าง' : 'สลับเป็นโหมดมืด'}
      title={isDark ? 'โหมดสว่าง' : 'โหมดมืด'}
    >
      {/* Render nothing until mounted so server and client markup match. */}
      {theme === null ? <span className="w-5 h-5" /> : isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
