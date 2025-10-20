
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
    const dirPath = path.join(process.cwd(), 'src', 'data', 'bible', version);
    const filePath = path.join(dirPath, bookFileName);

    async function loadBookFile(fp: string) {
        const fileContent = await fs.readFile(fp, 'utf-8');
        return JSON.parse(fileContent);
    }

    try {
        // Try the straightforward path first
        let bookData: any | null = null;
        try {
            bookData = await loadBookFile(filePath);
        } catch (e) {
            // If not found, try to locate an alternative file in the directory that matches the requested book
            if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
                try {
                    const files = await fs.readdir(dirPath);
                    const targetNormalized = normalizeBookName(bookName);
                    let found: string | null = null;

                    for (const f of files) {
                        if (!f.endsWith('.json')) continue;
                        const candidatePath = path.join(dirPath, f);
                        try {
                            const candidate = await loadBookFile(candidatePath);
                            const candidateName = (candidate.book || candidate.name || '').toString();
                            if (!candidateName) continue;
                            if (normalizeBookName(candidateName) === targetNormalized) {
                                found = candidatePath;
                                break;
                            }
                        } catch (err) {
                            // Ignore parse/read errors on individual files
                        }
                    }

                    // Special-case common variant: Cantares / Canticos
                    if (!found && targetNormalized === 'cantares') {
                        const alt = path.join(dirPath, 'canticos.json');
                        try { await fs.access(alt); found = alt; } catch(_){}
                    }

                    if (found) {
                        bookData = await loadBookFile(found);
                    } else {
                        throw e; // rethrow original ENOENT
                    }
                } catch (inner) {
                    throw inner;
                }
            } else {
                throw e;
            }
        }

        if (!bookData || !bookData.chapters || !Array.isArray(bookData.chapters) || bookData.chapters.length === 0) {
             throw new Error(`Arquivo do livro '${bookName}' está mal formatado ou não contém capítulos.`);
        }

        const chapterData = bookData.chapters.find((c: any) => c.chapter === chapter);

        if (chapterData && chapterData.verses && chapterData.verses.length > 0) {
            return {
                verses: chapterData.verses.map((v: any) => ({ number: v.verse, text: v.text }))
            };
        }

        // If chapter not found in this file, try specific known filename variants (avoid scanning all books)
        const specialFallbacks: Record<string, string> = {
            'cantares': 'canticos'
        };

        const targetNormalized = normalizeBookName(bookName);
        const fallbackKey = specialFallbacks[targetNormalized];
        if (fallbackKey) {
            const altPath = path.join(dirPath, `${fallbackKey}.json`);
            try {
                const altData = await loadBookFile(altPath);
                const altChapter = altData.chapters && altData.chapters.find((c: any) => c.chapter === chapter);
                if (altChapter && altChapter.verses && altChapter.verses.length > 0) {
                    return {
                        verses: altChapter.verses.map((v: any) => ({ number: v.verse, text: v.text }))
                    };
                }
            } catch (err) {
                // ignore alt load errors
            }
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
