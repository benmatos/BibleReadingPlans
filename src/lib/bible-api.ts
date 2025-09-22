
'use server';

import {promises as fs} from 'fs';
import path from 'path';

interface ChapterResponse {
    verses: { number: number; text: string }[];
}

export async function fetchChapterText(version: string, bookName: string, chapter: number): Promise<ChapterResponse> {
    if (version !== 'acf') {
        throw new Error("Somente a versão 'acf' está disponível localmente.");
    }

    // Normalize book name to match file name format (e.g., "1 João" -> "1_joao.json")
    const bookFileName = bookName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s/g, '_') + '.json';
        
    const filePath = path.join(process.cwd(), 'src', 'data', 'bible', version, bookFileName);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const bookData = JSON.parse(fileContent);
        
        // Ensure chapters property exists and is an array
        if (!bookData.chapters || !Array.isArray(bookData.chapters)) {
             throw new Error(`Arquivo do livro '${bookName}' está mal formatado ou não contém capítulos.`);
        }

        const chapterData = bookData.chapters.find((c: any) => c.chapter === chapter);

        if (chapterData && chapterData.verses.length > 0) {
            return {
                verses: chapterData.verses.map((v: any) => ({ number: v.verse, text: v.text }))
            };
        }
        
        throw new Error(`Capítulo ${chapter} de ${bookName} não encontrado ou está vazio.`);

    } catch (error) {
        console.error(`Erro ao carregar o capítulo local para ${bookName} ${chapter}:`, error);
        throw new Error(`Não foi possível carregar o texto para ${bookName} ${chapter}. Verifique se o arquivo JSON está correto.`);
    }
}
