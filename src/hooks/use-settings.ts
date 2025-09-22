
"use client";

import { useState, useEffect, useCallback } from "react";

const SETTINGS_KEY = "bible-reading-settings";

export type Theme = "light" | "dark" | "system";
export type BibleVersion = "acf"; // Only ACF is available locally

interface Settings {
  theme: Theme;
  bibleVersion: BibleVersion;
}

const defaultSettings: Settings = {
  theme: "system",
  bibleVersion: "acf",
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  
  useEffect(() => {
    let savedSettings: Partial<Settings> = {};
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === "object" && parsed !== null) {
          savedSettings = parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
    }
    // Ensure bibleVersion is always 'acf' as it's the only one available
    setSettings({ ...defaultSettings, ...savedSettings, bibleVersion: 'acf' });
  }, []);
  
  const updateSettings = useCallback((newSettings: Partial<Omit<Settings, 'bibleVersion'>>) => {
    setSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, ...newSettings };
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
        return updatedSettings;
    });
  }, []);

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
  };
  
  // Bible version is fixed, so this function is no longer needed.
  // const setBibleVersion = (bibleVersion: BibleVersion) => {
  //   updateSettings({ bibleVersion });
  // };

  useEffect(() => {
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = settings.theme === "system" ? systemTheme : settings.theme;
    
    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);

  }, [settings.theme]);

  return { 
    settings,
    setTheme,
    // setBibleVersion is removed
  };
}
