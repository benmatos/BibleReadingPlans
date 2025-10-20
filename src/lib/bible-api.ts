
'use server';

import {promises as fs} from 'fs';
import path from 'path';

interface ChapterResponse {
    verses: { number: number; text: string }[];
}

function normalizeBookName(bookName: string): string {
    return bookName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/\s+/g, '_'); // Substitui espaços por underscores
}

export async function fetchChapterText(version: string, bookName: string, chapter: number): Promise<ChapterResponse> {
    if (version !== 'acf') {
        throw new Error("Somente a versão 'acf' está disponível localmente.");
    }
    
    if (isNaN(chapter) || chapter < 1) {
        throw new Error(`Número de capítulo inválido: ${chapter}`);
    }

    const bookFileName = normalizeBookName(bookName) + '.json';
        
    const filePath = path.join(process.cwd(), 'src', 'data', 'bible', version, bookFileName);

    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const bookData = JSON.parse(fileContent);
        
        if (!bookData.chapters || !Array.isArray(bookData.chapters) || bookData.chapters.length === 0) {
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
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
            throw new Error(`Arquivo do livro '${bookName}' (${bookFileName}) não encontrado. Verifique se o nome está correto e o arquivo existe.`);
        }
        throw new Error(`Não foi possível carregar o texto para ${bookName} ${chapter}. Verifique se o arquivo JSON está correto.`);
    }
}
