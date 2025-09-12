
"use client";

import { useState, useEffect, useCallback } from "react";

const SETTINGS_KEY = "bible-reading-settings";

export type Theme = "light" | "dark" | "system";
export type BibleVersion = "almeida" | "nvi";

interface Settings {
  theme: Theme;
  bibleVersion: BibleVersion;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    bibleVersion: "almeida",
  });
   const [isLoaded, setIsLoaded] = useState(false);

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
    setSettings(prev => ({...prev, ...savedSettings}));
    setIsLoaded(true);
  }, []);

  const saveSettings = useCallback((newSettings: Partial<Settings>) => {
    if (!isLoaded) return;
    setSettings(prevSettings => {
        const updatedSettings = { ...prevSettings, ...newSettings };
        try {
            localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
        } catch (error) {
            console.error("Failed to save settings to localStorage", error);
        }
        return updatedSettings;
    });
  }, [isLoaded]);

  const setTheme = useCallback((theme: Theme) => {
    saveSettings({ theme });
  }, [saveSettings]);
  
  const setBibleVersion = useCallback((bibleVersion: BibleVersion) => {
    saveSettings({ bibleVersion });
  }, [saveSettings]);

  useEffect(() => {
    if (!isLoaded) return;
    const root = window.document.documentElement;
    
    // Handle Theme
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const currentTheme = settings.theme === "system" ? systemTheme : settings.theme;
    
    root.classList.remove("light", "dark");
    root.classList.add(currentTheme);

  }, [settings.theme, isLoaded]);

  return { 
    settings,
    setTheme, 
    setBibleVersion,
  };
}
