"use client";

import type { readingPlan } from '@/data/reading-plan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ReadingSummarizer } from "@/components/reading-summarizer";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Separator } from './ui/separator';
import { Skeleton } from './ui/skeleton';

interface ReadingDayViewProps {
  day: typeof readingPlan[0];
  isCompleted: boolean;
  isLoaded: boolean;
  onToggleComplete: () => void;
  onNavigate: (offset: number) => void;
  isFirstDay: boolean;
  isLastDay: boolean;
}

export function ReadingDayView({ day, isCompleted, isLoaded, onToggleComplete, onNavigate, isFirstDay, isLastDay }: ReadingDayViewProps) {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-3xl text-accent">{`Day ${day.day}`}</CardTitle>
              <CardDescription className="font-body text-base mt-1">{day.title}</CardDescription>
            </div>
            {isLoaded ? (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 shrink-0">
                    <Checkbox id={`day-${day.day}`} checked={isCompleted} onCheckedChange={onToggleComplete} aria-label="Mark as read" />
                    <label htmlFor={`day-${day.day}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-body">
                        Mark as Read
                    </label>
                </div>
            ) : <Skeleton className="h-10 w-32 rounded-lg" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 font-body text-lg">
            <h3 className="font-headline text-xl font-semibold">Today's Reading</h3>
            <ul className="list-disc list-inside space-y-2 pl-2">
              {day.readings.map((reading, index) => (
                <li key={index}>{reading}</li>
              ))}
            </ul>
          </div>
          
          <Separator className="my-8" />
          
          <ReadingSummarizer readings={day.readings} />
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button onClick={() => onNavigate(-1)} disabled={isFirstDay} variant="outline" className="shadow-sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous Day
        </Button>
        <Button onClick={() => onNavigate(1)} disabled={isLastDay} variant="outline" className="shadow-sm">
          Next Day <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
