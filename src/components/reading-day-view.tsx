
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
import { bibleBookToApiId } from '@/data/bible-api-map';

const BIBLE_ID_TEXT = '685d1470fe4d5c3b-01'; // Bíblia JFA Edição Contemporânea
const BIBLE_ID_AUDIO = 'bba9f4018352646c-02'; // BBE Audio

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
    bookId: string;
    chapterId: string;
    id: string;
    number: string;
    text: string;
}

interface TextApiResponse {
    data: {
        content: string;
        id: string;
    }
}

interface AudioApiResponse {
    data: {
        path: string;
    }[];
}

export function ReadingDayView({ day, readingPlan, isLoaded, onNavigate, onSelectDay, isFirstDay, isLastDay }: ReadingDayViewProps) {
  const [versesText, setVersesText] = useState('');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    // This runs on the client and will have access to environment variables.
    setApiKey(process.env.NEXT_PUBLIC_BIBLE_API_KEY || null);
  }, []);

  useEffect(() => {
    if (!day?.reading || !apiKey) {
        if (apiKey === '') {
            setError('Chave da API da Bíblia não configurada. Por favor, adicione NEXT_PUBLIC_BIBLE_API_KEY ao seu ambiente.');
            setIsLoading(false);
        }
        return;
    };

    const fetchScripture = async () => {
      setIsLoading(true);
      setError(null);
      
      const readingParts = day.reading.match(/(.+?)\s+(\d+)/);
      if (!readingParts) {
          setError('Referência de leitura inválida.');
          setIsLoading(false);
          return;
      }
      const [, bookName, chapterNumber] = readingParts;
      const bookId = bibleBookToApiId[bookName];

      if (!bookId) {
          setError(`Livro não encontrado no mapeamento da API: ${bookName}`);
          setIsLoading(false);
          return;
      }

      const chapterId = `${bookId}.${chapterNumber}`;
      
      const headers = { 'api-key': apiKey };

      try {
        const [textResponse, audioResponse] = await Promise.all([
          fetch(`https://api.scripture.api.bible/v1/bibles/${BIBLE_ID_TEXT}/chapters/${chapterId}?content-type=text`, { headers }),
          fetch(`https://api.scripture.api.bible/v1/audio-bibles/${BIBLE_ID_AUDIO}/chapters/${chapterId}`, { headers })
        ]);

        // Process Text
        if (!textResponse.ok) {
          const errorData = await textResponse.json();
          throw new Error(`Falha ao buscar texto: ${errorData.message || textResponse.statusText}`);
        }
        const textData: TextApiResponse = await textResponse.json();
        // The text is returned as a single HTML string, we'll use it directly.
        // We'll replace verse markers for better readability if needed.
        const formattedText = textData.data.content.replace(/<span class="v-num" id="v\d+">(\d+)<\/span>/g, '<sup class="pr-2 font-bold">$1</sup>');
        setVersesText(formattedText);

        // Process Audio
        if (audioResponse.ok) {
            const audioData: AudioApiResponse = await audioResponse.json();
            if (audioData.data && audioData.data.length > 0) {
                setAudioUrl(audioData.data[0].path);
            } else {
                setAudioUrl(null); // No audio found for this chapter
            }
        } else {
            setAudioUrl(null); // Fail gracefully if audio is not found
        }

      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro ao buscar os dados.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchScripture();
  }, [day, apiKey]);

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
           <AudioPlayer audioUrl={audioUrl} isLoading={isLoading} />
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
                  <div className="prose prose-xl max-w-none text-xl leading-relaxed" dangerouslySetInnerHTML={{ __html: versesText }} />
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
