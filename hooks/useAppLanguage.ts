/*
  useAppLanguage.ts
  - Small hook to manage application language (English / Chinese).
  - Persists selection in localStorage and broadcasts a custom event so multiple
    windows/components can react to language changes.
*/
import { useCallback, useEffect, useState } from 'react';

export type AppLanguage = 'en' | 'zh';

// Local storage key and custom event name used to synchronize language
const STORAGE_KEY = 'shenzhen-metro-language';
const LANGUAGE_CHANGE_EVENT = 'shenzhen-metro-language-change';

function isAppLanguage(value: string | null): value is AppLanguage {
  return value === 'en' || value === 'zh';
}

// Read stored value from localStorage with a safe fallback
function readStoredLanguage(fallback: AppLanguage) {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const storedLanguage = window.localStorage.getItem(STORAGE_KEY);
  return isAppLanguage(storedLanguage) ? storedLanguage : fallback;
}

// Hook: returns current language and a setter that persists across tabs
export function useAppLanguage(fallback: AppLanguage = 'en') {
  const [language, setLanguageState] = useState<AppLanguage>(() => readStoredLanguage(fallback));

  // Sync language when other tabs change localStorage or when the custom event fires
  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const syncLanguage = () => {
      setLanguageState(readStoredLanguage(fallback));
    };

    window.addEventListener('storage', syncLanguage);
    window.addEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage);

    return () => {
      window.removeEventListener('storage', syncLanguage);
      window.removeEventListener(LANGUAGE_CHANGE_EVENT, syncLanguage);
    };
  }, [fallback]);

  // Setter that writes to localStorage and dispatches the custom event
  const setLanguage = useCallback((nextLanguage: AppLanguage) => {
    setLanguageState(nextLanguage);

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
      window.dispatchEvent(new Event(LANGUAGE_CHANGE_EVENT));
    }
  }, []);

  return { language, setLanguage };
}
