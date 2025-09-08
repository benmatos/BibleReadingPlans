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

const defaultPlan: ReadingPlan = {
  id: 'default',
  name: 'Plano Cronológico Padrão',
  startBook: 'Gênesis',
  endBook: 'Apocalipse',
};

export function usePlans() {
  const [plans, setPlans] = useState<ReadingPlan[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedPlans = localStorage.getItem(PLANS_KEY);
      if (savedPlans) {
        const parsed = JSON.parse(savedPlans);
        if (Array.isArray(parsed) && parsed.length > 0) {
            setPlans(parsed);
        } else {
            setPlans([defaultPlan]);
        }
      } else {
        setPlans([defaultPlan]);
      }
    } catch (error) {
      console.error("Failed to load plans from localStorage", error);
      setPlans([defaultPlan]);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
      } catch (error) {
        console.error("Failed to save plans to localStorage", error);
      }
    }
  }, [plans, isLoaded]);

  const addPlan = useCallback((planData: Omit<ReadingPlan, 'id'>) => {
    setPlans(prev => [...prev, { ...planData, id: uuidv4() }]);
  }, []);

  const updatePlan = useCallback((updatedPlan: ReadingPlan) => {
    setPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
  }, []);
  
  const deletePlan = useCallback((planId: string) => {
    if (planId === 'default') return; // Cannot delete default plan
    setPlans(prev => prev.filter(p => p.id !== planId));
  }, []);


  return { plans, addPlan, updatePlan, deletePlan, isLoaded };
}
