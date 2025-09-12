
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AudioPlayer } from './audio-player';
import { bibleBookOrder } from '@/data/bible-book-order';
import { useSettings } from '@/hooks/use-settings';

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
    book_name: string;
    chapter: number;
    verse: number;
    text: string;
}

interface TextApiResponse {
    reference: string;
    verses: Verse[];
    text: string;
    translation_id: string;
    translation_name: string;
    translation_note: string;
}


export function ReadingDayView({ day, readingPlan, isLoaded, onNavigate, onSelectDay, isFirstDay, isLastDay }: ReadingDayViewProps) {
  const [versesText, setVersesText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { settings } = useSettings();

  useEffect(() => {
    if (!day?.reading) {
        return;
    };

    const fetchScripture = async () => {
      setIsLoading(true);
      setError(null);
      setVersesText('');
      setAudioUrl(null);
      
      const readingRef = day.reading.replace(/\s/g, '+');
      const bibleVersion = settings.bibleVersion || 'almeida';

      try {
        const response = await fetch(`https://bible-api.com/${readingRef}?translation=${bibleVersion}`);
        
        if (!response.ok) {
            let errorMsg = `Falha ao buscar texto: ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMsg = `Falha ao buscar texto: ${errorData.error || response.statusText}`;
            } catch (e) {
                // Ignore if response is not JSON
            }
          throw new Error(errorMsg);
        }

        const data: TextApiResponse = await response.json();
        
        // Format verses with superscript numbers
        const formattedText = data.verses.map(v => `<sup class="pr-2 font-bold">${v.verse}</sup>${v.text}`).join(' ');
        setVersesText(formattedText);
        
        // Build audio URL
        const bookName = data.verses[0].book_name;
        const chapter = data.verses[0].chapter;
        const bookNumber = bibleBookOrder[bookName];

        if (bookNumber) {
            const url = `https://www.wordproaudio.org/bibles/app/audio/2_BR/${bookNumber}/${chapter}.mp3`;
            setAudioUrl(url);
        }

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
                      Dia {planDay.day}: {planDay.reading} ({settings.bibleVersion.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
               <AudioPlayer audioUrl={audioUrl} isLoading={isLoading} />
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

