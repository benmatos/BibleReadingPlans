"use client";

import { useState, useEffect, useCallback } from 'react';

const PROGRESS_KEY = 'bible-reading-progress';

export function useProgress() {
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(PROGRESS_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        if (Array.isArray(parsed)) {
            setCompletedDays(new Set(parsed));
        } else {
            setCompletedDays(new Set());
        }
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage", error);
      setCompletedDays(new Set());
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(Array.from(completedDays)));
      } catch (error) {
        console.error("Failed to save progress to localStorage", error);
      }
    }
  }, [completedDays, isLoaded]);

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
