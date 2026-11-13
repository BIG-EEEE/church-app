import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Dock } from '../Dock';

/** Persistent frame: glass pills on top, routed page in the middle, glass dock at the bottom. */
export function Shell() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const last = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 240);
      if (y < 80) setHidden(false);
      else if (y > last.current + 6) setHidden(true);
      else if (y < last.current - 6) setHidden(false);
      last.current = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // A new page starts at the top (the reader handles its own verse jumps).
  useEffect(() => { if (!pathname.startsWith('/bible')) window.scrollTo({ top: 0 }); setHidden(false); }, [pathname]);

  return (
    <>
      <motion.header className="top" animate={{ y: hidden ? -88 : 0, opacity: hidden ? 0 : 1 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        <Link to="/" className="glass-pill logo" aria-label="Home">Logo</Link>
        <Link to="/give" className="glass-pill donate">Give</Link>
      </motion.header>
      <main><Outlet /></main>
      <Dock scrolled={scrolled} />
    </>
  );
}
