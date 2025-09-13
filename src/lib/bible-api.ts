
'use server';

import { bibleBookOrder } from "@/data/bible-book-order";

const API_BASE_URL = 'https://pesquisarnabiblia.com.br/api-projeto/api/get_verses.php';

interface Verse {
    number: number;
    text: string;
}

interface ApiResponse {
    status: string;
    msg: string;
    book: {
        book_id: string;
        name: string;
        version: string;
    };
    chapter: {
        number: number;
        verses: Verse[];
    }
}

interface ChapterResponse {
    chapter: {
        number: number;
        verses: number;
    };
    verses: Verse[];
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

    const url = `${API_BASE_URL}?${params.toString()}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            try {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            } catch (jsonError) {
                throw new Error(`HTTP error! status: ${response.status}. A resposta não é um JSON válido.`);
            }
        }

        const data: ApiResponse = await response.json();

        if (data.status !== 'success' || !data.chapter || !data.chapter.verses) {
            throw new Error(data.msg || 'A API retornou uma resposta inesperada.');
        }

        return {
            chapter: {
                number: data.chapter.number,
                verses: data.chapter.verses.length,
            },
            verses: data.chapter.verses,
        };

    } catch (error: any) {
        console.error('Failed to fetch chapter text:', error);
        throw new Error(error.message || 'An unknown error occurred while fetching from the Bible API.');
    }
}
