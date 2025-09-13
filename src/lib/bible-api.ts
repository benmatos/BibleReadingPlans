
'use server';

const API_BASE_URL = 'https://pesquisarnabiblia.com.br/api-projeto/api';
const API_TOKEN = 'b343f12294c2671792d4bd90812ff19aa731df837b04813a8ab8093c7fbac812';

interface Verse {
    number: number;
    text: string;
}

interface ChapterResponse {
    chapter: {
        number: number;
        verses: number;
    };
    verses: Verse[];
}

export async function fetchChapterText(version: string, bookAbbr: string, chapter: number): Promise<ChapterResponse> {
    const url = `${API_BASE_URL}/verses/${version}/${bookAbbr}/${chapter}`;

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error: any) {
        console.error('Failed to fetch chapter text:', error);
        throw new Error(error.message || 'An unknown error occurred while fetching from the Bible API.');
    }
}
