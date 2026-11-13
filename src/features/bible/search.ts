import { loadBook, type BibleIndex } from './data';

export interface Hit { book: string; bookName: string; chapter: number; verse: number; text: string }

export const searchTerms = (q: string) => q.toLowerCase().split(/[^\p{L}\p{N}']+/u).filter((w) => w.length > 0);

/** Pure matcher: every term must appear in the verse. Exported for tests. */
export function matches(text: string, terms: string[]): boolean {
  const t = text.toLowerCase();
  return terms.every((w) => t.includes(w));
}

/** Loads every book of a translation (cached after first load) and returns up to `limit` hits in canon order. */
export async function searchBible(
  translation: string, index: BibleIndex, query: string, limit = 150, onProgress?: (done: number, total: number) => void,
): Promise<{ hits: Hit[]; total: number }> {
  const terms = searchTerms(query);
  if (!terms.length) return { hits: [], total: 0 };
  const hits: Hit[] = [];
  let total = 0;
  let done = 0;
  const loaded = await Promise.all(index.books.map(async (b) => {
    const data = await loadBook(translation, b.id);
    onProgress?.(++done, index.books.length);
    return data;
  }));
  for (const data of loaded) {
    data.chapters.forEach((items, ci) => {
      for (const it of items) {
        if ('v' in it && matches(it.t, terms)) {
          total++;
          if (hits.length < limit) hits.push({ book: data.id, bookName: data.name, chapter: ci + 1, verse: it.v, text: it.t });
        }
      }
    });
  }
  return { hits, total };
}
