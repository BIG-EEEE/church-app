import { createStore, useStore } from '../../lib/store';

export interface BibleState {
  translation: string;
  size: number; // reader text size in px
  last: { book: string; chapter: number };
  bookmarks: string[]; // "JHN.3.16"
  highlights: string[];
}

export const bibleStore = createStore<BibleState>('bible', {
  translation: 'BSB',
  size: 19,
  last: { book: 'JHN', chapter: 1 },
  bookmarks: [],
  highlights: [],
});

export const useBible = () => useStore(bibleStore);

export const vkey = (book: string, chapter: number, verse: number) => `${book}.${chapter}.${verse}`;

export function toggleIn(field: 'bookmarks' | 'highlights', key: string) {
  bibleStore.set((s) => ({ [field]: s[field].includes(key) ? s[field].filter((k) => k !== key) : [...s[field], key] }));
}

export const SIZES = [16, 18, 19, 21, 24, 28];
