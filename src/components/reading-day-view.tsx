
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Day {
  day: number;
  reading: string;
}

interface ReadingDayViewProps {
  day: Day;
  readingPlan: Day[];
  isLoaded: boolean;
  onNavigate: (offset: number) => void;
  onSelectDay: (dayNumber: number) => void;
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

export function ReadingDayView({ day, readingPlan, isLoaded, onNavigate, onSelectDay, isFirstDay, isLastDay }: ReadingDayViewProps) {
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
            <div className="w-full">
              <Select
                value={day.day.toString()}
                onValueChange={(value) => onSelectDay(parseInt(value, 10))}
              >
                <SelectTrigger className="text-xl font-body">
                  <SelectValue placeholder="Selecione um capítulo" />
                </SelectTrigger>
                <SelectContent>
                  {readingPlan.map(planDay => (
                    <SelectItem key={planDay.day} value={planDay.day.toString()}>
                      Dia {planDay.day}: {planDay.reading}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[60vh] flex flex-col">
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
                  <div className="max-w-none">
                      {verses.map(verse => (
                          <p key={verse.verse} className="mb-4 leading-relaxed text-lg">
                            <sup className="pr-2 font-bold">{verse.verse}</sup> 
                            {verse.text}
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
          <ArrowLeft className="mr-2 h-4 w-4" /> Capítulo Anterior
        </Button>
        <Button onClick={() => onNavigate(1)} disabled={isLastDay || isLoading} variant="outline" className="shadow-sm">
          Próximo Capítulo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
