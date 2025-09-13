
'use server';

import { bibleBookOrder } from "@/data/bible-book-order";

interface Verse {
    verse_id: number;
    book_name: string;
    chapter: number;
    verse_number: number;
    text: string;
}

interface ApiResponse {
    verses: Verse[];
}

interface ChapterResponse {
    verses: { number: number; text: string }[];
}

const versionMap: Record<string, number> = {
    acf: 1, // Almeida Corrigida Fiel
    nvi: 2, // Nova Versão Internacional
};

export async function fetchChapterText(version: string, bookName: string, chapter: number): Promise<ChapterResponse> {
    
    const versionId = versionMap[version];
    const bookId = bibleBookOrder[bookName];

    if (!versionId || !bookId) {
        throw new Error("Versão ou livro inválido.");
    }
    
    const params = new URLSearchParams({
        version_id: versionId.toString(),
        book_id: bookId.toString(),
        chapter_id: chapter.toString(),
    });

    const url = `https://pesquisarnabiblia.com.br/api-projeto/api/get_verses.php?${params.toString()}`;
    const token = process.env.BEARER_TOKEN;
    
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            } catch (jsonError) {
                throw new Error(`HTTP error! status: ${response.status}. A resposta não é um JSON válido.`);
            }
        }

        const data: ApiResponse = await response.json();

        if (!data.verses) {
            throw new Error('A API retornou uma resposta inesperada.');
        }

        return {
            verses: data.verses.map(v => ({ number: v.verse_number, text: v.text })),
        };

    } catch (error: any) {
        console.error('Failed to fetch chapter text:', error);
        throw new Error(error.message || 'An unknown error occurred while fetching from the Bible API.');
    }
}
