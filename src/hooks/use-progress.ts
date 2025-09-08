"use client";

import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY_PREFIX = 'bible-reading-progress';

export function useProgress(planId?: string | null) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const PROGRESS_KEY = planId ? `${PROGRESS_KEY_PREFIX}-${planId}` : null;

  useEffect(() => {
    if (!planId) {
      setCompletedDays(new Set());
      setIsLoaded(true);
      return;
    }
    
    setIsLoaded(false);
    let initialProgress: Set<number> = new Set();
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY!);
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
  }, [planId, PROGRESS_KEY]);

  const saveProgress = (newProgress: Set<number>) => {
    if (PROGRESS_KEY) {
        try {
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(newProgress)));
            setCompletedDays(newProgress);
        } catch (error) {
            console.error("Failed to save progress to localStorage", error);
        }
    }
  }

  const toggleDayCompletion = useCallback((day: number) => {
    const newSet = new Set(completedDays);
    if (newSet.has(day)) {
      newSet.delete(day);
    } else {
      newSet.add(day);
    }
    saveProgress(newSet);
  }, [completedDays, PROGRESS_KEY]);

  const isDayCompleted = useCallback((day: number) => {
    return completedDays.has(day);
  }, [completedDays]);

  return { completedDays, toggleDayCompletion, isDayCompleted, isLoaded };
}
