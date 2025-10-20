const https = require('https');
const fs = require('fs');
const path = require('path');

const url = 'https://raw.githubusercontent.com/thiagobodruk/biblia/master/json/acf.json';

function normalizeBookName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

https.get(url, (res) => {
  if (res.statusCode !== 200) {
    console.error('Failed to download acf.json', res.statusCode);
    process.exit(1);
  }

  let raw = '';
  res.setEncoding('utf8');
  res.on('data', (chunk) => raw += chunk);
  res.on('end', () => {
    try {
      // Remove possible UTF-8 BOM (EF BB BF) which breaks JSON.parse
      if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
      const data = JSON.parse(raw);
      const outDir = path.join(process.cwd(), 'src', 'data', 'bible', 'acf');
      if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

      data.forEach(book => {
        const name = book.name || book.book || '';
        const normalized = normalizeBookName(name);
        const chapters = book.chapters || [];
        const out = {
          book: name,
          chapters: chapters.map((ch, idx) => ({
            chapter: idx + 1,
            verses: (ch || []).map((v, i) => ({ verse: i + 1, text: v }))
          }))
        };

        const filePath = path.join(outDir, `${normalized}.json`);
        fs.writeFileSync(filePath, JSON.stringify(out, null, 2));
        console.log('Wrote', filePath);
      });

      console.log('Import completed.');
    } catch (e) {
      console.error('Error parsing acf.json', e);
      process.exit(1);
    }
  });
}).on('error', (e) => {
  console.error('Request error', e);
  process.exit(1);
});
