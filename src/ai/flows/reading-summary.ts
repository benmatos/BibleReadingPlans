// src/ai/flows/reading-summary.ts
'use server';
/**
 * @fileOverview A scripture reading summarization AI agent.
 *
 * - summarizeReading - A function that handles the summarization process.
 * - SummarizeReadingInput - The input type for the summarizeReading function.
 * - SummarizeReadingOutput - The return type for the summarizeReading function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReadingInputSchema = z.object({
  scriptureText: z.string().describe('The scripture text to summarize.'),
});
export type SummarizeReadingInput = z.infer<typeof SummarizeReadingInputSchema>;

const SummarizeReadingOutputSchema = z.object({
  summary: z.string().describe('A short summary of the scripture text.'),
});
export type SummarizeReadingOutput = z.infer<typeof SummarizeReadingOutputSchema>;

export async function summarizeReading(input: SummarizeReadingInput): Promise<SummarizeReadingOutput> {
  return summarizeReadingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeReadingPrompt',
  input: {schema: SummarizeReadingInputSchema},
  output: {schema: SummarizeReadingOutputSchema},
  prompt: `You are a helpful assistant that provides a concise summary of a given scripture passage.

  Summarize the following scripture text:
  {{scriptureText}}`,
});

const summarizeReadingFlow = ai.defineFlow(
  {
    name: 'summarizeReadingFlow',
    inputSchema: SummarizeReadingInputSchema,
    outputSchema: SummarizeReadingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
