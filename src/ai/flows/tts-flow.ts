
'use server';

/**
 * @fileOverview A flow for generating audio from text using a Text-to-Speech model.
 *
 * - textToSpeech - A function that handles the text-to-speech conversion.
 * - TtsInput - The input type for the textToSpeech function (string).
 * - TtsOutput - The return type for the textToSpeech function, containing the audio data URI.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

const TtsInputSchema = z.string();
export type TtsInput = z.infer<typeof TtsInputSchema>;

const TtsOutputSchema = z.object({
  media: z.string().describe('The generated audio as a data URI.'),
});
export type TtsOutput = z.infer<typeof TtsOutputSchema>;

export async function textToSpeech(input: TtsInput): Promise<TtsOutput> {
  return ttsFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const ttsFlow = ai.defineFlow(
  {
    name: 'ttsFlow',
    inputSchema: TtsInputSchema,
    outputSchema: TtsOutputSchema,
  },
  async (query) => {
    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' }, // A pleasant voice
          },
        },
      },
      prompt: query,
    });

    if (!media) {
      throw new Error('No audio media returned from the model.');
    }

    // The audio data is Base64 encoded PCM. We need to convert it to a WAV file data URI.
    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);

    return {
      media: 'data:audio/wav;base64,' + wavBase64,
    };
  }
);
