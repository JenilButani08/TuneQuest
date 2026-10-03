import { create } from 'zustand';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: ThemePreference;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;
  initTheme: () => void;
}

const getSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (resolved: 'light' | 'dark') => {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark', // Default fallback
  resolvedTheme: 'dark',

  setTheme: (newTheme) => {
    localStorage.setItem('tunequest_theme_preference', newTheme);
    const resolved = newTheme === 'system' ? getSystemTheme() : newTheme;
    applyThemeToDOM(resolved);
    set({ theme: newTheme, resolvedTheme: resolved });
  },

  initTheme: () => {
    const saved = localStorage.getItem('tunequest_theme_preference') as ThemePreference | null;
    const activeTheme: ThemePreference = saved || 'dark';
    const resolved = activeTheme === 'system' ? getSystemTheme() : activeTheme;

    applyThemeToDOM(resolved);
    set({ theme: activeTheme, resolvedTheme: resolved });

    // Listen to OS system color-scheme changes if 'system' is chosen
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleSystemChange = () => {
        if (get().theme === 'system') {
          const newResolved = mediaQuery.matches ? 'dark' : 'light';
          applyThemeToDOM(newResolved);
          set({ resolvedTheme: newResolved });
        }
      };
      mediaQuery.addEventListener('change', handleSystemChange);
    }
  },
}));
