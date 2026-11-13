import { describe, expect, it } from 'vitest';
import { parseRef } from './refs';
import { matches } from './search';

const books = [
  { id: 'JHN', name: 'John', order: 43, chapters: 21 },
  { id: '1JN', name: '1 John', order: 62, chapters: 5 },
  { id: '1CO', name: '1 Corinthians', order: 46, chapters: 16 },
  { id: 'PSA', name: 'Psalms', order: 19, chapters: 150 },
  { id: 'GEN', name: 'Genesis', order: 1, chapters: 50 },
];

describe('parseRef', () => {
  it('parses book chapter verse', () => expect(parseRef('John 3:16', books)).toEqual({ book: 'JHN', chapter: 3, verse: 16 }));
  it('parses abbreviations and spacing', () => {
    expect(parseRef('1 cor 13', books)).toEqual({ book: '1CO', chapter: 13, verse: undefined });
    expect(parseRef('ps 23', books)?.book).toBe('PSA');
    expect(parseRef('Jn 3', books)?.book).toBe('JHN');
    expect(parseRef('1john 4:8', books)).toEqual({ book: '1JN', chapter: 4, verse: 8 });
  });
  it('prefix match needs three letters and uniqueness', () => expect(parseRef('Gene 1:1', books)?.book).toBe('GEN'));
  it('rejects out of range chapters and plain words', () => {
    expect(parseRef('John 99', books)).toBeNull();
    expect(parseRef('love', books)).toBeNull();
  });
});

describe('matches', () => {
  it('needs every term, case-insensitively', () => {
    expect(matches('For God so loved the world', ['god', 'loved'])).toBe(true);
    expect(matches('For God so loved the world', ['god', 'grace'])).toBe(false);
  });
});
