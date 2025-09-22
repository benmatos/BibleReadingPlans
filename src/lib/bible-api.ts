
'use server';

import { bibleBookOrder } from "@/data/bible-book-order";
import { bibleBooksARC } from "@/data/books";
import {promises as fs} from 'fs';
import path from 'path';

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

async function getLocalChapter(version: string, bookName: string, chapter: number): Promise<ChapterResponse | null> {
    if (version !== 'acf') {
        return null;
    }
    const bookFileName = bookName.toLowerCase().replace(/\s/g, '_') + '.json';
    const filePath = path.join(process.cwd(), 'src', 'data', 'bible', version, bookFileName);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const bookData = JSON.parse(fileContent);
        const chapterData = bookData.chapters.find((c: any) => c.chapter === chapter);

        if (chapterData) {
            return {
                verses: chapterData.verses.map((v: any) => ({ number: v.verse, text: v.text }))
            };
        }
        return null;
    } catch (error) {
        console.warn(`Could not load local chapter for ${bookName} ${chapter}:`, error);
        return null;
    }
}


export async function fetchChapterText(version: string, bookName: string, chapter: number): Promise<ChapterResponse> {
    
    const localData = await getLocalChapter(version, bookName, chapter);
    if (localData) {
        return localData;
    }

    const versionId = 9 //versionMap[version];
    const bookId = bibleBooksARC.find(book => book.name === bookName)?.id;


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
                throw new Error(url+`\n\nHTTP error! status: ${response.status}. A resposta não é um JSON válido.`);
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
