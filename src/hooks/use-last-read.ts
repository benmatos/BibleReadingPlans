
"use client";

import { useState, useEffect, useCallback } from 'react';

const LAST_READ_KEY = 'bible-reading-last-read';

type LastReadStore = {
  [planId: string]: number;
};

export function useLastRead() {
  const [lastReadDays, setLastReadDays] = useState<LastReadStore>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let savedLastRead: LastReadStore = {};
    try {
      const stored = localStorage.getItem(LAST_READ_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (typeof parsed === 'object' && parsed !== null) {
          savedLastRead = parsed;
        }
      }
    } catch (error) {
      console.error("Failed to load last read days from localStorage", error);
    }
    setLastReadDays(savedLastRead);
    setIsLoaded(true);
  }, []);

  const saveLastRead = useCallback((newLastRead: LastReadStore) => {
    try {
      localStorage.setItem(LAST_READ_KEY, JSON.stringify(newLastRead));
      setLastReadDays(newLastRead);
    } catch (error) {
      console.error("Failed to save last read days to localStorage", error);
    }
  }, []);

  const setLastReadDay = useCallback((planId: string, day: number) => {
    const newLastRead = { ...lastReadDays, [planId]: day };
    saveLastRead(newLastRead);
  }, [lastReadDays, saveLastRead]);
  
  const getLastReadDay = useCallback((planId: string): number | null => {
    return lastReadDays[planId] || null;
  }, [lastReadDays]);


  return { getLastReadDay, setLastReadDay, isLoaded };
}
