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

function setTheme(next: string) {
  document.documentElement.setAttribute('data-theme', next);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // Storage blocked (private mode): the choice still applies for this visit.
  }
}

/** Both modes side by side with the current one lit, for the Sidebar. */
export function ThemeSwitch() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const options = [
    { value: LIGHT_THEME, label: 'สว่าง', Icon: Sun },
    { value: DARK_THEME, label: 'มืด', Icon: Moon },
  ];

  return (
    <div role="group" aria-label="โหมดสี" className="flex rounded-field border border-primary/30 bg-base-100/60 p-0.5">
      {options.map(({ value, label, Icon }) => {
        const on = theme === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => setTheme(value)}
            aria-pressed={on}
            className={`flex items-center gap-1.5 rounded-[calc(var(--radius-field)-2px)] px-3 py-1.5 text-sm transition-colors ${on ? 'cursor-default' : 'cursor-pointer'} ${
              on ? 'bg-primary/20 font-semibold text-primary shadow-[0_0_10px_color-mix(in_oklab,var(--color-primary)_30%,transparent)]' : 'text-base-content/70 hover:text-primary'
            }`}
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);

  const isDark = theme === DARK_THEME;

  const toggle = () => setTheme(isDark ? LIGHT_THEME : DARK_THEME);

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
