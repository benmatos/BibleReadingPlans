
"use client";

import type { readingPlan } from '@/data/reading-plan';
import { mockScriptureTexts } from '@/data/reading-plan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

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
  const scriptureText = mockScriptureTexts[day.reading] || `[Texto do capítulo ${day.reading} não disponível]`;

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="font-headline text-3xl text-accent">{`Dia ${day.day}`}</CardTitle>
              <CardDescription className="font-body text-base mt-1">{day.reading}</CardDescription>
            </div>
            {isLoaded ? (
                <div className="flex items-center space-x-3 p-3 rounded-lg bg-secondary/50 shrink-0">
                    <Checkbox id={`day-${day.day}`} checked={isCompleted} onCheckedChange={onToggleComplete} aria-label="Marcar como lido" />
                    <label htmlFor={`day-${day.day}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-body">
                        Marcar como lido
                    </label>
                </div>
            ) : <Skeleton className="h-10 w-32 rounded-lg" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 font-body text-lg">
            <h3 className="font-headline text-xl font-semibold">Leitura de Hoje</h3>
            <ScrollArea className="h-[60vh] pr-4">
                <div className="prose prose-lg max-w-none text-foreground/90 whitespace-pre-wrap">
                    {scriptureText}
                </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button onClick={() => onNavigate(-1)} disabled={isFirstDay} variant="outline" className="shadow-sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Dia Anterior
        </Button>
        <Button onClick={() => onNavigate(1)} disabled={isLastDay} variant="outline" className="shadow-sm">
          Próximo Dia <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
