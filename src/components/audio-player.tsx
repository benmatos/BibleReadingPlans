
"use client";

import { Skeleton } from './ui/skeleton';

interface AudioPlayerProps {
  audioUrl: string | null;
  isLoading: boolean;
}

export function AudioPlayer({ audioUrl, isLoading }: AudioPlayerProps) {
  
  if (isLoading) {
    return <Skeleton className="h-12 w-full mt-4" />;
  }

  if (!audioUrl) {
    return null; // Don't render the player if there's no audio URL
  }
  
  return (
    <div className="mt-4">
      <audio controls src={audioUrl} className="w-full">
        Seu navegador não suporta o elemento de áudio.
        <a href={audioUrl}>Baixar áudio</a>
      </audio>
    </div>
  );
}
