import { useEffect, useState } from 'react';
import { ArrowRight, ArrowUpRight, Search as SearchIcon, Share2 } from 'lucide-react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { loadBook, loadIndex, type BibleIndex } from '../features/bible/data';
import { parseRef, refPath } from '../features/bible/refs';
import { searchBible, searchTerms, type Hit } from '../features/bible/search';
import { bibleStore, SIZES, useBible } from '../features/bible/store';

function useIndex() {
  const [index, setIndex] = useState<BibleIndex | null>(null);
  useEffect(() => { loadIndex().then(setIndex).catch(() => setIndex(null)); }, []);
  return index;
}

const flat = (t: string) => t.replace(/\s*\n\s*/g, ' ');

/** Well-loved verses; one per day, the same for everyone, so it is predictable. */
const DAILY = ['PSA.23.1', 'JHN.3.16', 'PRO.3.5', 'ISA.41.10', 'PHP.4.13', 'ROM.8.28', 'JER.29.11', 'MAT.11.28', 'PSA.46.1', 'JOS.1.9', 'ROM.12.2', 'PSA.119.105', '2CO.5.7', 'GAL.5.22', 'HEB.11.1', 'PSA.121.1', 'MAT.6.33', 'JHN.14.6', '1CO.13.4', 'EPH.2.8', 'PSA.27.1', 'ISA.40.31', 'JAS.1.5', '1JN.4.8', 'COL.3.23', 'LAM.3.22', 'MIC.6.8', 'PHP.4.6', 'PSA.37.4', '2TI.1.7', 'MAT.5.16'];

export function Home() {
  const st = useBible();
  const index = useIndex();
  const day = Math.floor((Date.now() - new Date().getTimezoneOffset() * 60000) / 86400000);
  const [b, c, v] = DAILY[day % DAILY.length].split('.');
  const [text, setText] = useState('');
  useEffect(() => {
    loadBook(st.translation, b).then((d) => {
      const it = d.chapters[Number(c) - 1]?.find((i) => 'v' in i && i.v === Number(v));
      setText(it && 'v' in it ? flat(it.t) : '');
    }).catch(() => setText(''));
  }, [b, c, v, st.translation]);
  const name = (id: string) => index?.books.find((x) => x.id === id)?.name ?? id;
  const tr = index?.translations.find((t) => t.id === st.translation);
  const ref = `${name(b)} ${c}:${v}`;

  const share = async () => {
    const msg = `“${text}” — ${ref} (${st.translation})`;
    if (navigator.share) { try { await navigator.share({ text: msg }); } catch { /* dismissed */ } }
    else { try { await navigator.clipboard.writeText(msg); } catch { /* no clipboard */ } }
  };

  return (
    <div className="page home">
      <section className="today">
        <p className="eyebrow">Continue reading</p>
        <h1 className="display">{name(st.last.book)} <span className="mark">{st.last.chapter}</span></h1>
        <p className="muted">{tr ? tr.name : ' '}</p>
        <div className="btn-row">
          <Link to={`/bible/${st.last.book}/${st.last.chapter}`} className="btn-lime">Start reading <ArrowRight size={18} strokeWidth={1.75} aria-hidden="true" /></Link>
          <Link to="/search" className="btn-ring" aria-label="Search the Bible"><SearchIcon size={20} strokeWidth={1.75} aria-hidden="true" /></Link>
        </div>
      </section>

      <figure className="votd">
        <figcaption>{ref}</figcaption>
        {text ? <blockquote>“{text}”</blockquote> : <div className="skeleton"><span style={{ width: '90%' }} /><span style={{ width: '60%' }} /></div>}
        <button type="button" className="icon-btn" onClick={share} aria-label="Share today’s verse"><Share2 size={20} strokeWidth={1.5} /></button>
      </figure>

      {index && ([['Old Testament', index.books.filter((x) => x.order <= 39)], ['New Testament', index.books.filter((x) => x.order > 39)]] as const).map(([title, list]) => (
        <section key={title} className="shelf" aria-label={title}>
          <h2>{title}</h2>
          <div className="tiles">
            {list.map((bk) => (
              <Link key={bk.id} to={`/bible/${bk.id}/1`} className="tile">
                <span className="arrow"><ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" /></span>
                <span><strong>{bk.name}</strong><small>{bk.chapters} {bk.chapters === 1 ? 'chapter' : 'chapters'}</small></span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function BibleHome() {
  const { last } = useBible();
  return <Navigate to={`/bible/${last.book}/${last.chapter}`} replace />;
}

export function Search() {
  const [sp] = useSearchParams();
  const nav = useNavigate();
  const q = (sp.get('q') ?? '').trim();
  const st = useBible();
  const index = useIndex();
  const [res, setRes] = useState<{ hits: Hit[]; total: number } | null>(null);
  const [progress, setProgress] = useState(0);
  const ref = index && q ? parseRef(q, index.books) : null;

  useEffect(() => {
    setRes(null);
    if (!index || !q || ref) return;
    let live = true;
    const t = window.setTimeout(() => {
      searchBible(st.translation, index, q, 150, (d, n) => live && setProgress(d / n))
        .then((r) => live && setRes(r))
        .catch(() => live && setRes({ hits: [], total: 0 }));
    }, 250);
    return () => { live = false; window.clearTimeout(t); };
  }, [q, index, st.translation, ref]);

  if (!q) return <div className="page"><p className="muted">Type a word or phrase, or a reference such as John 3:16.</p></div>;
  if (ref) return <Navigate to={refPath(ref)} replace />;

  const terms = searchTerms(q);
  const re = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  const mark = (text: string) => text.split(re).map((part, i) => (terms.includes(part.toLowerCase()) ? <mark key={i}>{part}</mark> : part));

  return (
    <div className="page">
      {!res && <p className="muted" role="status">Searching{progress > 0 && progress < 1 ? ` ${Math.round(progress * 100)}%` : ''}</p>}
      {res && <p className="muted" role="status">{res.total === 0 ? `No verses match “${q}”` : `${res.total} ${res.total === 1 ? 'verse' : 'verses'}${res.total > res.hits.length ? `, showing the first ${res.hits.length}` : ''}`}</p>}
      <ul className="hits">
        {res?.hits.map((h) => (
          <li key={`${h.book}.${h.chapter}.${h.verse}`}>
            <button type="button" onClick={() => nav(`/bible/${h.book}/${h.chapter}?v=${h.verse}`)}>
              <strong>{h.bookName} {h.chapter}:{h.verse}</strong>
              <span>{mark(flat(h.text))}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Saved() {
  const st = useBible();
  const index = useIndex();
  const [texts, setTexts] = useState<Record<string, string>>({});
  const keys = [...new Set([...st.bookmarks, ...st.highlights])];
  const dep = keys.join(',');
  useEffect(() => {
    keys.forEach(async (k) => {
      const [b, c, v] = k.split('.');
      const d = await loadBook(st.translation, b).catch(() => null);
      const it = d?.chapters[Number(c) - 1]?.find((i) => 'v' in i && i.v === Number(v));
      if (it && 'v' in it) setTexts((t) => ({ ...t, [k]: flat(it.t) }));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dep, st.translation]);

  if (!keys.length) return <div className="page"><h1>Saved</h1><p className="muted">Tap a verse in the Bible to bookmark or highlight it. It shows up here.</p></div>;
  return (
    <div className="page">
      <h1>Saved</h1>
      <ul className="hits">
        {keys.map((k) => {
          const [b, c, v] = k.split('.');
          return (
            <li key={k}>
              <Link to={`/bible/${b}/${c}?v=${v}`}>
                <strong>{index?.books.find((x) => x.id === b)?.name ?? b} {c}:{v}</strong>
                <span>{texts[k] ?? ''}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function Settings() {
  const st = useBible();
  const index = useIndex();
  return (
    <div className="page">
      <h1>Settings</h1>
      <h2 className="group-title">Bible translation</h2>
      <div className="radio-list" role="radiogroup" aria-label="Bible translation">
        {index?.translations.map((t) => (
          <button key={t.id} type="button" role="radio" aria-checked={st.translation === t.id} className="radio" onClick={() => bibleStore.set({ translation: t.id })}>
            <strong>{t.short}</strong><span>{t.name}</span>
          </button>
        ))}
      </div>
      <h2 className="group-title">Reading size</h2>
      <div className="radio-list sizes" role="radiogroup" aria-label="Reading text size">
        {SIZES.map((s, i) => (
          <button key={s} type="button" role="radio" aria-checked={st.size === s} aria-label={`${s} pixels`} className="radio size" onClick={() => bibleStore.set({ size: s })}>
            <strong style={{ fontSize: 14 + i * 2 }}>Aa</strong>
          </button>
        ))}
      </div>
    </div>
  );
}

export function About() {
  const index = useIndex();
  return (
    <div className="page">
      <h1>About</h1>
      <p>The full Bible is stored in the app, so a book reads offline once it has been opened. All three translations are in the public domain.</p>
      <ul className="hits plain">
        {index?.translations.map((t) => (
          <li key={t.id}><strong>{t.name} ({t.short})</strong><span>{t.license}. {t.verses.toLocaleString()} verses. <a href={t.website} target="_blank" rel="noreferrer">Source</a></span></li>
        ))}
      </ul>
      <p className="muted">Text from the HelloAO Bible API, built from eBible.org and the Berean Bible.</p>
    </div>
  );
}

export function Give() {
  return <div className="page"><h1>Give</h1><p className="muted">Giving by mobile money and card arrives in a later milestone. Nothing is collected here yet.</p></div>;
}

export function NotFound() {
  return <div className="page"><h1>Page not found</h1><Link to="/" className="pn">Go home</Link></div>;
}
