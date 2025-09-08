
"use client";

import { useState, useEffect, useCallback } from "react";

const SETTINGS_KEY = "bible-reading-settings";

type Theme = "light" | "dark" | "system";
type FontSize = "sm" | "base" | "lg" | "xl";

const fontSizes: FontSize[] = ["sm", "base", "lg", "xl"];

interface Settings {
  theme: Theme;
  fontSize: FontSize;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>({
    theme: "system",
    fontSize: "base",
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
    try {
      const updatedSettings = { ...settings, ...newSettings };
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
    } catch (error)
      {
      console.error("Failed to save settings to localStorage", error);
    }
  }, [settings, isLoaded]);

  const setTheme = useCallback((theme: Theme) => {
    saveSettings({ theme });
  }, [saveSettings]);
  
  const setFontSize = useCallback((fontSize: FontSize) => {
    saveSettings({ fontSize });
  }, [saveSettings]);

  const increaseFontSize = useCallback(() => {
    const currentIndex = fontSizes.indexOf(settings.fontSize);
    if (currentIndex < fontSizes.length - 1) {
      setFontSize(fontSizes[currentIndex + 1]);
    }
  }, [settings.fontSize, setFontSize]);

  const decreaseFontSize = useCallback(() => {
    const currentIndex = fontSizes.indexOf(settings.fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizes[currentIndex - 1]);
    }
  }, [settings.fontSize, setFontSize]);


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
    theme: settings.theme, 
    setTheme, 
    fontSize: settings.fontSize, 
    setFontSize,
    increaseFontSize,
    decreaseFontSize
  };
}
