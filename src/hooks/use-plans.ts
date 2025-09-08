"use client";

import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const PLANS_KEY = 'bible-reading-plans';

export interface ReadingPlan {
  id: string;
  name: string;
  startBook: string;
  endBook: string;
}

export function usePlans() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem(PLANS_KEY);
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        if (Array.isArray(parsed)) {
            setPlans(parsed);
        } else {
            setPlans([]);
        }
      } else {
        setPlans([]);
      }
    } catch (error) {
      console.error("Failed to load plans from localStorage", error);
      setPlans([]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const savePlans = (newPlans: ReadingPlan[]) => {
    try {
      localStorage.setItem(PLANS_KEY, JSON.stringify(newPlans));
      setPlans(newPlans);
    } catch (error) {
      console.error("Failed to save plans to localStorage", error);
    }
  };

  const addPlan = useCallback((planData: Omit<ReadingPlan, 'id'>) => {
    const newPlans = [...plans, { ...planData, id: uuidv4() }];
    savePlans(newPlans);
  }, [plans]);

  const updatePlan = useCallback((updatedPlan: ReadingPlan) => {
    const newPlans = plans.map(p => p.id === updatedPlan.id ? updatedPlan : p);
    savePlans(newPlans);
  }, [plans]);
  
  const deletePlan = useCallback((planId: string) => {
    const newPlans = plans.filter(p => p.id !== planId);
    savePlans(newPlans);
  }, [plans]);


  return { plans, addPlan, updatePlan, deletePlan, isLoaded };
}
