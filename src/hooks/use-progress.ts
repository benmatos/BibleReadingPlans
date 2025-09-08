"use client";

import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY_PREFIX = 'bible-reading-progress';

export function useProgress(planId?: string | null) {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const PROGRESS_KEY = planId ? `${PROGRESS_KEY_PREFIX}-${planId}` : null;

  useEffect(() => {
    // Reset state when planId changes
    setCompletedDays(new Set());
    setIsLoaded(false);

    if (PROGRESS_KEY) {
      try {
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        if (savedProgress) {
          const parsed = JSON.parse(savedProgress);
          if (Array.isArray(parsed)) {
              setCompletedDays(new Set(parsed));
          } else {
              setCompletedDays(new Set());
          }
        } else {
            setCompletedDays(new Set());
        }
      } catch (error) {
        console.error("Failed to load progress from localStorage", error);
        setCompletedDays(new Set());
      } finally {
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true); // Mark as loaded if there's no planId
    }
  }, [PROGRESS_KEY]);

  useEffect(() => {
    if (isLoaded && PROGRESS_KEY) {
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(completedDays)));
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
      }
    }
  }, [completedDays, isLoaded, PROGRESS_KEY]);

  const toggleDayCompletion = useCallback((day: number) => {
    setCompletedDays(prev => {
      const newSet = new Set(prev);
      if (newSet.has(day)) {
        newSet.delete(day);
      } else {
        newSet.add(day);
      }
      return newSet;
    });
  }, []);

  const isDayCompleted = useCallback((day: number) => {
    return completedDays.has(day);
  }, [completedDays]);

  return { completedDays, toggleDayCompletion, isDayCompleted, isLoaded };
}
