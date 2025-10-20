(async () => {
  const { fetchChapterText } = require('../src/lib/bible-api');
  try {
    const res = await fetchChapterText('acf', 'Cantares', 2);
    console.log('Verses:', res.verses.slice(0,3));
  } catch (e) {
    console.error('Error:', e.message);
    process.exitCode = 1;
  }
})();