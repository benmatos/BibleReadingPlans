
"use client";

import { useState, useEffect } from 'react';
import type { readingPlan } from '@/data/reading-plan';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ReadingDayViewProps {
  day: typeof readingPlan[0];
  isCompleted: boolean;
  isLoaded: boolean;
  onToggleComplete: () => void;
  onNavigate: (offset: number) => void;
  isFirstDay: boolean;
  isLastDay: boolean;
}

interface Verse {
    book_id: string;
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

interface ApiResponse {
    reference: string;
    verses: Verse[];
    text: string;
    translation_id: string;
    translation_name: string;
    translation_note: string;
}


export function ReadingDayView({ day, isCompleted, isLoaded, onToggleComplete, onNavigate, isFirstDay, isLastDay }: ReadingDayViewProps) {
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!day?.reading) return;

    const fetchScripture = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const reference = day.reading.replace(/\s/g, '+');
        // A API está em inglês, então precisamos traduzir alguns nomes de livros
        const apiReference = reference
            .replace("Cantares", "Song+of+Solomon");

        const response = await fetch(`https://bible-api.com/${apiReference}?translation=almeida`);
        if (!response.ok) {
          throw new Error('Texto da escritura não encontrado. Por favor, verifique a referência.');
        }
        const data: ApiResponse = await response.json();
        
        setVerses(data.verses);

      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro ao buscar o texto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScripture();
  }, [day]);


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
        <CardContent className="h-[60vh] flex flex-col">
          <h3 className="font-headline text-xl font-semibold mb-4">Leitura de Hoje</h3>
           <div className="flex-grow overflow-hidden relative">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : error ? (
              <div className="flex items-center justify-center h-full">
                <Alert variant="destructive" className="max-w-md">
                    <BookOpen className="h-4 w-4" />
                    <AlertTitle>Erro ao Carregar</AlertTitle>
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
              </div>
            ) : (
              <ScrollArea className="h-full pr-4">
                  <div className="prose prose-lg max-w-none text-foreground/90">
                      {verses.map(verse => (
                          <p key={verse.verse}>
                            <sup>{verse.verse}</sup> {verse.text}
                          </p>
                      ))}
                  </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between mt-6">
        <Button onClick={() => onNavigate(-1)} disabled={isFirstDay} variant="outline" className="shadow-sm">
          <ArrowLeft className="mr-2 h-4 w-4" /> Dia Anterior
        </Button>
        <Button onClick={() => onNavigate(1)} disabled={isLastDay || isLoading} variant="outline" className="shadow-sm">
          Próximo Dia <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
