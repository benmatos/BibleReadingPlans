
"use client";

import { useState } from 'react';
import { textToSpeech, TtsOutput } from '@/ai/flows/tts-flow';
import { Button } from './ui/button';
import { Volume2, Loader, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface AudioPlayerProps {
  text: string;
}

export function AudioPlayer({ text }: AudioPlayerProps) {
  const [audioData, setAudioData] = useState<TtsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleListen = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Limit text length to avoid overly long API calls for long chapters
      const textToSynthesize = text.length > 4000 ? text.substring(0, 4000) : text;
      const result = await textToSpeech(textToSynthesize);
      setAudioData(result);
    } catch (e: any) {
      setError(e.message || 'Falha ao gerar o áudio.');
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
      return (
        <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Erro de Áudio</AlertTitle>
            <AlertDescription>
                {error}
                <Button variant="link" onClick={handleListen} className="p-1 h-auto">Tentar novamente</Button>
            </AlertDescription>
        </Alert>
      )
  }

  if (audioData?.media) {
    return (
      <div className="mt-4">
        <audio controls autoPlay className="w-full">
          <source src={audioData.media} type="audio/wav" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      </div>
    );
  }

  return (
    <Button onClick={handleListen} disabled={isLoading} className="mt-4 w-full sm:w-auto" variant="outline">
      {isLoading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Gerando Áudio...
        </>
      ) : (
        <>
          <Volume2 className="mr-2 h-4 w-4" />
          Ouvir
        </>
      )}
    </Button>
  );
}
