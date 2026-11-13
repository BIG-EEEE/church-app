import type { BookMeta } from './data';

export interface Ref { book: string; chapter: number; verse?: number }

const ALIASES: Record<string, string> = {
  gen: 'GEN', ge: 'GEN', exo: 'EXO', ex: 'EXO', exod: 'EXO', lev: 'LEV', num: 'NUM', deut: 'DEU', dt: 'DEU', deu: 'DEU',
  josh: 'JOS', judg: 'JDG', jdg: 'JDG', ru: 'RUT', '1sam': '1SA', '2sam': '2SA', '1ki': '1KI', '2ki': '2KI', '1kgs': '1KI', '2kgs': '2KI',
  '1chr': '1CH', '2chr': '2CH', neh: 'NEH', est: 'EST', ps: 'PSA', psa: 'PSA', psalm: 'PSA', psalms: 'PSA', prov: 'PRO', pr: 'PRO',
  eccl: 'ECC', ecc: 'ECC', song: 'SNG', sos: 'SNG', songofsolomon: 'SNG', songofsongs: 'SNG', isa: 'ISA', jer: 'JER', lam: 'LAM',
  ezek: 'EZK', eze: 'EZK', dan: 'DAN', hos: 'HOS', joe: 'JOL', am: 'AMO', ob: 'OBA', jon: 'JON', mic: 'MIC', nah: 'NAM', hab: 'HAB',
  zeph: 'ZEP', hag: 'HAG', zech: 'ZEC', mal: 'MAL', matt: 'MAT', mt: 'MAT', mk: 'MRK', mar: 'MRK', lk: 'LUK', jn: 'JHN', joh: 'JHN',
  act: 'ACT', rom: 'ROM', '1cor': '1CO', '2cor': '2CO', gal: 'GAL', eph: 'EPH', phil: 'PHP', php: 'PHP', col: 'COL',
  '1thess': '1TH', '2thess': '2TH', '1tim': '1TI', '2tim': '2TI', tit: 'TIT', phlm: 'PHM', philem: 'PHM', heb: 'HEB', jas: 'JAS',
  jam: 'JAS', '1pet': '1PE', '2pet': '2PE', '1jn': '1JN', '2jn': '2JN', '3jn': '3JN', '1john': '1JN', '2john': '2JN', '3john': '3JN',
  rev: 'REV', re: 'REV',
};

const norm = (s: string) => s.toLowerCase().replace(/\./g, '').replace(/\s+/g, '');

/** Parses "John 3:16", "1 Cor 13", "ps 23", "Jn 3". Returns null when the input is not a reference. */
export function parseRef(input: string, books: BookMeta[]): Ref | null {
  const m = input.trim().match(/^((?:[1-3]\s*)?[a-zA-Z][a-zA-Z .]*?)\s*(\d{1,3})(?:\s*[:.]\s*(\d{1,3}))?$/);
  if (!m) return null;
  const key = norm(m[1]);
  let book = books.find((b) => norm(b.name) === key)?.id ?? ALIASES[key];
  if (!book && key.length >= 3) {
    const hits = books.filter((b) => norm(b.name).startsWith(key));
    if (hits.length === 1) book = hits[0].id;
  }
  const meta = books.find((b) => b.id === book);
  if (!meta) return null;
  const chapter = Number(m[2]);
  if (chapter < 1 || chapter > meta.chapters) return null;
  return { book: meta.id, chapter, verse: m[3] ? Number(m[3]) : undefined };
}

export const refPath = (r: Ref) => `/bible/${r.book}/${r.chapter}${r.verse ? `?v=${r.verse}` : ''}`;
