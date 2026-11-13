// Downloads public-domain Bible translations (HelloAO API, license flags verified) and splits
// them into compact per-book JSON files under public/bible/<id>/<BOOK>.json.
// Run once: node scripts/build-bible.mjs   (output is committed so builds need no network)
import { mkdir, writeFile } from 'node:fs/promises';

const BASE = 'https://bible.helloao.org';
const WANT = [
  { id: 'BSB', short: 'BSB', fetchId: 'BSB' },
  { id: 'KJV', short: 'KJV', fetchId: 'eng_kjv' },
  { id: 'WEB', short: 'WEB', fetchId: 'ENGWEBP' },
];

const meta = await (await fetch(`${BASE}/api/available_translations.json`)).json();
const index = { translations: [], books: null };

for (const w of WANT) {
  const info = meta.translations.find((t) => t.id === w.fetchId);
  if (!info?.license?.publicDomain) throw new Error(`${w.fetchId} is not flagged public domain, refusing`);
  console.log('fetching', w.fetchId);
  const data = await (await fetch(`${BASE}/api/${w.fetchId}/complete.simple.json`)).json();
  const dir = `public/bible/${w.id}`;
  await mkdir(dir, { recursive: true });

  const books = [];
  for (const b of data.books) {
    const chapters = b.chapters.map(({ chapter }) => {
      const items = [];
      for (const x of chapter.content) {
        if (x.type === 'heading') items.push({ h: x.text });
        else if (x.type === 'hebrew_subtitle') items.push({ s: x.text });
        else if (x.type === 'line_break') items.push({ p: 1 });
        else if (x.type === 'verse') {
          // KJV marks paragraph starts with a pilcrow; turn it into a real paragraph break
          const t = x.text.replace(/^¶s*/, '');
          if (t !== x.text) items.push({ p: 1 });
          items.push({ v: x.number, t });
        }
      }
      return items;
    });
    await writeFile(`${dir}/${b.id}.json`, JSON.stringify({ id: b.id, name: b.commonName || b.name, chapters }));
    books.push({ id: b.id, name: b.commonName || b.name, order: b.order, chapters: chapters.length });
  }
  if (!index.books) index.books = books; // book list/order is identical across these translations
  index.translations.push({
    id: w.id, short: w.short, name: info.englishName || info.name, website: info.website,
    license: 'Public domain', verses: info.totalNumberOfVerses,
  });
  console.log(w.id, books.length, 'books');
}
await writeFile('public/bible/index.json', JSON.stringify(index));
console.log('done');
