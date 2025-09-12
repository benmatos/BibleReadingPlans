
"use client";

import { Skeleton } from './ui/skeleton';

interface AudioPlayerProps {
  audioUrl: string | null;
  isLoading: boolean;
}

export function AudioPlayer({ audioUrl, isLoading }: AudioPlayerProps) {
  if (isLoading) {
    return <Skeleton className="h-10 w-full mt-2" />;
  }

  if (!audioUrl) {
    return null; // Don't render anything if there's no audio URL
  }

  return (
    <div className="mt-4">
      <audio controls={true} className="w-full" key={audioUrl}>
        <source src={audioUrl} type="audio/mpeg" />
        Seu navegador não suporta o elemento de áudio.
      </audio>
    </div>
  );
}
