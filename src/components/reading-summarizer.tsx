"use client";

import { useState } from 'react';
import { summarizeReading, type SummarizeReadingOutput } from '@/ai/flows/reading-summary';
import { mockScriptureTexts } from '@/data/reading-plan';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Loader2 } from 'lucide-react';

interface ReadingSummarizerProps {
  readings: string[];
}

export function ReadingSummarizer({ readings }: ReadingSummarizerProps) {
  const [summary, setSummary] = useState<SummarizeReadingOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSummarize = async () => {
    setIsLoading(true);
    setSummary(null);

    const scriptureText = readings
      .map(reading => mockScriptureTexts[reading] || `[Placeholder text for ${reading}]`)
      .join('\n\n');
      
    if (scriptureText.trim() === '' || readings.every(r => !mockScriptureTexts[r])) {
        toast({
            title: "No text to summarize",
            description: "There is no placeholder text available for today's reading to generate a summary.",
        });
        setIsLoading(false);
        return;
    }

    try {
      const result = await summarizeReading({ scriptureText });
      setSummary(result);
    } catch (error) {
      console.error("Failed to generate summary:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Summary",
        description: "Could not connect to the AI service. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
            <h3 className="font-headline text-xl font-semibold">AI Reading Summary</h3>
            <Button onClick={handleSummarize} disabled={isLoading} size="sm">
                {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Summary
            </Button>
        </div>
        
        {isLoading && (
            <div className="flex items-center justify-center rounded-lg border bg-secondary/30 border-dashed p-8 h-48">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="font-body text-sm text-muted-foreground">The AI is reading... <br/>Please wait a moment.</p>
                </div>
            </div>
        )}

        {summary && !isLoading && (
             <Card className="bg-background shadow-inner animate-in fade-in duration-500">
                <CardContent className="pt-6">
                    <p className="font-body text-base whitespace-pre-wrap">{summary.summary}</p>
                </CardContent>
            </Card>
        )}
        
        {!summary && !isLoading && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center h-48 bg-secondary/20">
                <Sparkles className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground font-body">Click "Generate Summary" to get an AI-powered overview of the reading.</p>
            </div>
        )}
    </div>
  );
}
