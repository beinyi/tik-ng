import { signal, effect, inject, WritableSignal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

function getInitialTheme(): boolean {
  return document.cookie.includes('theme=dark');
}

function saveThemeToCookie(isDark: boolean) {
  document.cookie = `theme=${
    isDark ? 'dark' : 'light'
  }; path=/; max-age=31536000`;
}

export type ThemeSignal = {
  isDarkTheme: WritableSignal<boolean>;
  toggleTheme: () => void;
};

export function createThemeSignal(): ThemeSignal {
  const document = inject(DOCUMENT);
  const isDarkTheme = signal(getInitialTheme());

  effect(() => {
    const dark = isDarkTheme();
    document.documentElement.classList.toggle('dark', dark);
    saveThemeToCookie(dark);
  });

  return {
    isDarkTheme,
    toggleTheme: () => isDarkTheme.update((v) => !v),
  };
}
