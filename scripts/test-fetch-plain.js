const fs = require('fs').promises;
const path = require('path');

function normalizeBookName(bookName) {
  return bookName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

async function findAndLoadBook(version, bookName) {
  const dirPath = path.join(process.cwd(), 'src', 'data', 'bible', version);
  const targetNormalized = normalizeBookName(bookName);
  const wantedFile = path.join(dirPath, `${targetNormalized}.json`);

  async function loadJson(p) {
    return JSON.parse(await fs.readFile(p, 'utf8'));
  }

  try {
    const book = await loadJson(wantedFile);
    return { book, path: wantedFile };
  } catch (e) {
    if (e.code === 'ENOENT') {
      // try to find a file whose internal book name normalizes to the same value
      const files = await fs.readdir(dirPath);
      for (const f of files) {
        if (!f.endsWith('.json')) continue;
        try {
          const candidate = await loadJson(path.join(dirPath, f));
          const candidateName = (candidate.book || candidate.name || '').toString();
          if (!candidateName) continue;
          if (normalizeBookName(candidateName) === targetNormalized) {
            return { book: candidate, path: path.join(dirPath, f) };
          }
        } catch (err) {
          // ignore parse/read errors
        }
      }

      // special-case known variants
      if (targetNormalized === 'cantares') {
        const alt = path.join(dirPath, 'canticos.json');
        try { const b = await loadJson(alt); return { book: b, path: alt }; } catch(_){}
      }

      throw new Error('Not found');
    }
    throw e;
  }
}

(async ()=>{
  try {
    const result = await findAndLoadBook('acf','Cantares');
    const book = result.book;
    console.log('Loaded book file:', result.path);
    console.log('Loaded book name:', book.book || book.name);
    let ch = book.chapters.find(c => c.chapter === 2);
    if (!ch) {
      // If initial file doesn't contain the chapter, try the specific fallback file (handled in findAndLoadBook for ENOENT)
      // but also attempt the special 'canticos.json' fallback if we didn't already load it
      const dirPath = path.join(process.cwd(), 'src', 'data', 'bible', 'acf');
      const altPath = path.join(dirPath, 'canticos.json');
      if (result.path !== altPath) {
        try {
          const alt = JSON.parse(await fs.readFile(altPath,'utf8'));
          const altChapter = alt.chapters && alt.chapters.find(c => c.chapter === 2);
          if (altChapter) {
            console.log('Found chapter 2 in fallback file: canticos.json');
            ch = altChapter;
          }
        } catch (_) {}
      }
    }
    if (!ch) { console.error('Chapter 2 not found'); process.exitCode=1; return; }
    console.log('Verses count:', ch.verses.length);
    console.log('First 3 verses:', ch.verses.slice(0,3));
  } catch (e) {
    console.error('Error:', e.message);
    process.exitCode=1;
  }
})();