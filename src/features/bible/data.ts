import { assetUrl } from '../../lib/platform';

export type Item = { h: string } | { s: string } | { p: 1 } | { v: number; t: string };
export interface BookMeta { id: string; name: string; order: number; chapters: number }
export interface BookData { id: string; name: string; chapters: Item[][] }
export interface Translation { id: string; short: string; name: string; website: string; license: string; verses: number }
export interface BibleIndex { translations: Translation[]; books: BookMeta[] }

const books = new Map<string, Promise<BookData>>();
let indexPromise: Promise<BibleIndex> | null = null;

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(assetUrl(path));
  if (!res.ok) throw new Error(`Could not load ${path} (${res.status})`);
  return res.json() as Promise<T>;
}

export function loadIndex(): Promise<BibleIndex> {
  indexPromise ??= getJson<BibleIndex>('bible/index.json').catch((e) => { indexPromise = null; throw e; });
  return indexPromise;
}

export function loadBook(translation: string, bookId: string): Promise<BookData> {
  const key = `${translation}/${bookId}`;
  let p = books.get(key);
  if (!p) {
    p = getJson<BookData>(`bible/${key}.json`).catch((e) => { books.delete(key); throw e; });
    books.set(key, p);
  }
  return p;
}
