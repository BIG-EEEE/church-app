import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dock } from './Dock';

type Row = { title: string; meta: string; tone: number };
const SECTIONS: { id: string; title: string; rows: Row[] }[] = [
  { id: 'latest', title: 'Latest', rows: [
    { title: 'Borehole completed in Tamale East', meta: '3 days ago', tone: 0 },
    { title: 'School feeding reaches 1,200 pupils', meta: '1 week ago', tone: 1 },
    { title: 'Volunteer intake opens in March', meta: '2 weeks ago', tone: 2 } ] },
  { id: 'programs', title: 'Programs', rows: [
    { title: 'Clean water', meta: '14 communities', tone: 1 },
    { title: 'Girls in school', meta: '9 districts', tone: 2 },
    { title: 'Smallholder farming', meta: '320 farmers', tone: 0 } ] },
  { id: 'stories', title: 'Stories', rows: [
    { title: 'Ama walks 40 minutes less each day', meta: '4 min read', tone: 2 },
    { title: 'A cooperative finds its price', meta: '6 min read', tone: 0 },
    { title: 'What a term of meals changes', meta: '5 min read', tone: 1 } ] },
  { id: 'events', title: 'Events', rows: [
    { title: 'Open day at the Accra office', meta: 'Sat, 21 Mar', tone: 1 },
    { title: 'Community fun run', meta: 'Sun, 12 Apr', tone: 0 } ] },
  { id: 'about', title: 'About', rows: [
    { title: 'Who we are and how we are funded', meta: 'Annual report', tone: 2 } ] },
  { id: 'contact', title: 'Contact', rows: [
    { title: 'hello@example.org', meta: 'Replies within two days', tone: 0 } ] },
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [query, setQuery] = useState('');
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 240);
      if (y < 80) setHeaderHidden(false);
      else if (y > last.current + 6) setHeaderHidden(true);
      else if (y < last.current - 6) setHeaderHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const q = query.trim().toLowerCase();

  return (
    <>
      <motion.header className="top" animate={{ y: headerHidden ? -88 : 0, opacity: headerHidden ? 0 : 1 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        <a href="#top" className="glass-pill logo" aria-label="Home">Logo</a>
        <a href="#donate" className="glass-pill donate">Donate</a>
      </motion.header>

      <main id="top">
        <section className="hero" aria-label="Featured">
          <svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
            <path d="M0 120 C60 80 110 100 170 70 S280 60 320 90 V160 H0Z" fill="var(--hill-1)" />
            <path d="M0 140 C70 110 130 130 200 105 S290 110 320 120 V160 H0Z" fill="var(--hill-2)" />
            <circle cx="236" cy="44" r="14" fill="var(--sun)" />
          </svg>
          <p>Water, school meals and farming support across northern Ghana</p>
        </section>

        {SECTIONS.map((s) => {
          const rows = q ? s.rows.filter((r) => r.title.toLowerCase().includes(q)) : s.rows;
          if (!rows.length) return null;
          return (
            <section key={s.id} id={s.id} className="block">
              <h2>{s.title}</h2>
              <ul>
                {rows.map((r) => (
                  <li key={r.title} className="row">
                    <span className="thumb" data-tone={r.tone} aria-hidden="true" />
                    <span className="row-text"><strong>{r.title}</strong><small>{r.meta}</small></span>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {q && SECTIONS.every((s) => !s.rows.some((r) => r.title.toLowerCase().includes(q))) && <p className="empty">Nothing matches “{query}”</p>}
        <div className="tail" />
      </main>

      <Dock scrolled={scrolled} query={query} onQuery={setQuery} />
    </>
  );
}
