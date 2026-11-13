import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Bookmark, BookmarkCheck, ChevronDown, ChevronLeft, ChevronRight, Copy, Highlighter, Minus, Plus, Share2 } from 'lucide-react';
import { loadBook, loadIndex, type BibleIndex, type BookData, type Item } from './data';
import { bibleStore, SIZES, toggleIn, useBible, vkey } from './store';
import { Picker } from './Picker';

type Block = { kind: 'h'; text: string } | { kind: 's'; text: string } | { kind: 'para'; verses: { v: number; t: string }[] };

/** Groups a chapter's flat items into headings and paragraphs of inline verses. */
export function toBlocks(items: Item[]): Block[] {
  const out: Block[] = [];
  let para: { v: number; t: string }[] | null = null;
  const flush = () => { if (para?.length) out.push({ kind: 'para', verses: para }); para = null; };
  for (const it of items) {
    if ('h' in it) { flush(); out.push({ kind: 'h', text: it.h }); }
    else if ('s' in it) { flush(); out.push({ kind: 's', text: it.s }); }
    else if ('p' in it) flush();
    else (para ??= []).push(it);
  }
  flush();
  return out;
}

export function Reader() {
  const { book = '', chapter = '1' } = useParams();
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const st = useBible();
  const ch = Number(chapter);
  const [index, setIndex] = useState<BibleIndex | null>(null);
  const [data, setData] = useState<BookData | null>(null);
  const [error, setError] = useState('');
  const [picker, setPicker] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  useEffect(() => { loadIndex().then(setIndex).catch((e) => setError(String(e.message))); }, []);
  useEffect(() => {
    setData(null); setSelected(null); setError('');
    loadBook(st.translation, book).then(setData).catch((e) => setError(String(e.message)));
  }, [book, st.translation]);

  const meta = index?.books.find((b) => b.id === book);
  useEffect(() => { if (meta && ch >= 1 && ch <= meta.chapters) bibleStore.set({ last: { book, chapter: ch } }); }, [meta, book, ch]);

  const items = data?.chapters[ch - 1];
  const blocks = useMemo(() => (items ? toBlocks(items) : []), [items]);

  // Land on a requested verse (?v=16) once the text is on screen.
  const wantVerse = Number(sp.get('v')) || null;
  useEffect(() => {
    if (!items) return;
    if (!wantVerse) { window.scrollTo({ top: 0 }); return; }
    setSelected(wantVerse);
    requestAnimationFrame(() => document.getElementById(`v-${wantVerse}`)?.scrollIntoView({ block: 'center' }));
  }, [items, wantVerse]);

  if (index && !meta) return <Navigate to="/bible" replace />;
  if (meta && (ch < 1 || ch > meta.chapters || !Number.isInteger(ch))) return <Navigate to={`/bible/${book}/1`} replace />;

  const tr = index?.translations.find((t) => t.id === st.translation);
  const prev = meta && index ? (ch > 1 ? `/bible/${book}/${ch - 1}` : prevBook(index, meta.order)) : null;
  const next = meta && index ? (ch < meta.chapters ? `/bible/${book}/${ch + 1}` : nextBook(index, meta.order)) : null;

  const selectedText = selected ? items?.find((i): i is { v: number; t: string } => 'v' in i && i.v === selected)?.t : undefined;
  const refLabel = selected && meta ? `${meta.name} ${ch}:${selected}` : '';
  const key = selected ? vkey(book, ch, selected) : '';
  const say = (m: string) => { setToast(m); window.setTimeout(() => setToast(''), 1600); };

  const copy = async () => {
    if (!selectedText) return;
    const text = `“${selectedText.replace(/\s*\n\s*/g, ' ')}” — ${refLabel} (${tr?.short})`;
    try { await navigator.clipboard.writeText(text); say('Copied'); } catch { say('Could not copy'); }
  };
  const share = async () => {
    if (!selectedText) return;
    const text = `“${selectedText.replace(/\s*\n\s*/g, ' ')}” — ${refLabel} (${tr?.short})`;
    if (navigator.share) { try { await navigator.share({ text }); } catch { /* dismissed */ } } else copy();
  };

  const sizeIdx = Math.max(0, SIZES.indexOf(st.size));
  const setSize = (d: number) => bibleStore.set({ size: SIZES[Math.min(SIZES.length - 1, Math.max(0, sizeIdx + d))] });

  return (
    <div className="reader" style={{ ['--read' as string]: `${st.size}px` }}>
      <div className="reader-bar">
        <button type="button" className="title-btn" onClick={() => setPicker(true)} aria-haspopup="dialog">
          <span>{meta ? `${meta.name} ${ch}` : 'Loading'}</span><ChevronDown size={18} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <div className="reader-tools">
          <button type="button" className="icon-btn" onClick={() => setSize(-1)} disabled={sizeIdx === 0} aria-label="Smaller text"><Minus size={18} strokeWidth={1.75} /></button>
          <button type="button" className="icon-btn" onClick={() => setSize(1)} disabled={sizeIdx === SIZES.length - 1} aria-label="Larger text"><Plus size={18} strokeWidth={1.75} /></button>
          <Link to="/settings" className="tr-chip" aria-label={`Translation ${tr?.short ?? st.translation}, change in settings`}>{tr?.short ?? st.translation}</Link>
        </div>
      </div>

      {error && <p className="notice" role="alert">Could not load this chapter. {navigator.onLine ? 'Try again in a moment.' : 'You are offline and it has not been saved yet.'}</p>}
      {!data && !error && <div className="skeleton" aria-busy="true" aria-label="Loading chapter">{Array.from({ length: 9 }, (_, i) => <span key={i} style={{ width: `${70 + ((i * 17) % 30)}%` }} />)}</div>}

      {items && (
        <article className="scripture" lang="en">
          {blocks.map((b, i) =>
            b.kind === 'h' ? <h3 key={i}>{b.text}</h3>
            : b.kind === 's' ? <p key={i} className="sub">{b.text}</p>
            : (
              <p key={i} className="para">
                {b.verses.map((v) => {
                  const k = vkey(book, ch, v.v);
                  return (
                    <span key={v.v} id={`v-${v.v}`} role="button" tabIndex={0} className="verse"
                      data-selected={selected === v.v} data-hl={st.highlights.includes(k)} data-bm={st.bookmarks.includes(k)}
                      onClick={() => setSelected(selected === v.v ? null : v.v)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), setSelected(selected === v.v ? null : v.v))}>
                      <sup>{v.v}</sup>{v.t}{' '}
                    </span>
                  );
                })}
              </p>
            ))}
          <nav className="chapter-nav" aria-label="Chapter navigation">
            {prev ? <Link to={prev} className="pn"><ChevronLeft size={18} strokeWidth={1.75} />Previous</Link> : <span />}
            {next ? <Link to={next} className="pn">Next<ChevronRight size={18} strokeWidth={1.75} /></Link> : <span />}
          </nav>
          {tr && <p className="license">{tr.name}. {tr.license}.</p>}
        </article>
      )}

      {selected && (
        <div className="verse-actions" role="toolbar" aria-label={`Actions for ${refLabel}`}>
          <span className="ref">{refLabel}</span>
          <button type="button" className="icon-btn" onClick={() => toggleIn('highlights', key)} aria-pressed={st.highlights.includes(key)} aria-label="Highlight"><Highlighter size={20} strokeWidth={1.5} /></button>
          <button type="button" className="icon-btn" onClick={() => toggleIn('bookmarks', key)} aria-pressed={st.bookmarks.includes(key)} aria-label="Bookmark">{st.bookmarks.includes(key) ? <BookmarkCheck size={20} strokeWidth={1.5} /> : <Bookmark size={20} strokeWidth={1.5} />}</button>
          <button type="button" className="icon-btn" onClick={copy} aria-label="Copy"><Copy size={20} strokeWidth={1.5} /></button>
          <button type="button" className="icon-btn" onClick={share} aria-label="Share"><Share2 size={20} strokeWidth={1.5} /></button>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}

      {index && <Picker open={picker} index={index} current={{ book, chapter: ch }} onClose={() => setPicker(false)} onPick={(b, c) => { setPicker(false); nav(`/bible/${b}/${c}`); }} />}
    </div>
  );
}

const prevBook = (i: BibleIndex, order: number) => { const b = i.books.find((x) => x.order === order - 1); return b ? `/bible/${b.id}/${b.chapters}` : null; };
const nextBook = (i: BibleIndex, order: number) => { const b = i.books.find((x) => x.order === order + 1); return b ? `/bible/${b.id}/1` : null; };
