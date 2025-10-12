
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from '@/hooks/use-settings';
import { fetchChapterText } from '@/lib/bible-api';

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

export function ReadingDayView({ day, readingPlan, isLoaded, onNavigate, onSelectDay, isFirstDay, isLastDay }: ReadingDayViewProps) {
  const [versesText, setVersesText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (!day?.reading) {
        return;
    };

    const fetchScripture = async () => {
      setIsLoading(true);
      setError(null);
      setVersesText('');
      
      const readingParts = day.reading.split(' ');
      const chapterStr = readingParts.pop() || '1';
      const bookName = readingParts.join(' ');
      const chapter = parseInt(chapterStr, 10);
      
      if (isNaN(chapter)) {
        setError(`Capítulo inválido: ${chapterStr}`);
        setIsLoading(false);
        return;
      }

      try {
        const data = await fetchChapterText(settings.bibleVersion, bookName, chapter);
        
        if (data.verses.length === 0) {
          throw new Error("Texto não encontrado para este capítulo.");
        }

        const formattedText = data.verses.map(v => `<sup class="pr-2 font-bold">${v.number}</sup>${v.text}`).join(' ');
        setVersesText(formattedText);

      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro ao buscar os dados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScripture();
  }, [day, settings.bibleVersion]);

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="w-full space-y-4">
              <Select
                value={day.day.toString()}
                onValueChange={(value) => onSelectDay(parseInt(value, 10))}
              >
                <SelectTrigger className="text-xl font-body">
                  <SelectValue>
                    {day.reading}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {readingPlan.map(planDay => (
                    <SelectItem key={planDay.day} value={planDay.day.toString()}>
                      {planDay.reading}
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
                  <div className="prose prose-xl max-w-none text-2xl leading-relaxed" dangerouslySetInnerHTML={{ __html: versesText }} />
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
