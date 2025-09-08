
"use client";

import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY_PREFIX = 'bible-reading-progress';

export function useProgress(planId?: string | null) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  
  const getProgressKey = useCallback(() => {
    return planId ? `${PROGRESS_KEY_PREFIX}-${planId}` : null;
  }, [planId]);

  useEffect(() => {
    const PROGRESS_KEY = getProgressKey();
    if (!PROGRESS_KEY) {
      setCompletedDays(new Set());
      setIsLoaded(true);
      return;
    }
    
    setIsLoaded(false);
    let initialProgress: Set<number> = new Set();
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed)) {
            initialProgress = new Set(parsed);
        }
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
    } finally {
      setCompletedDays(initialProgress);
      setIsLoaded(true);
    }
  }, [planId, getProgressKey]);

  const saveProgress = useCallback((newProgress: Set<number>) => {
    const PROGRESS_KEY = getProgressKey();
    if (PROGRESS_KEY) {
        try {
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(newProgress)));
            setCompletedDays(newProgress);
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }
  }, [getProgressKey]);

  const toggleDayCompletion = useCallback((day: number) => {
    setCompletedDays(prevCompleted => {
        const newSet = new Set(prevCompleted);
        if (newSet.has(day)) {
          newSet.delete(day);
        } else {
          newSet.add(day);
        }
        saveProgress(newSet);
        return newSet;
    });
  }, [saveProgress]);

  const isDayCompleted = useCallback((day: number) => {
    return completedDays.has(day);
  }, [completedDays]);

  return { completedDays, toggleDayCompletion, isDayCompleted, isLoaded };
}
