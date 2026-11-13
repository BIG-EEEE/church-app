import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import type { BibleIndex } from './data';

type Props = { open: boolean; index: BibleIndex; current: { book: string; chapter: number }; onPick: (book: string, chapter: number) => void; onClose: () => void };

/** Bottom sheet: pick a book, then a chapter. Old Testament is the first 39 books of the canon. */
export function Picker({ open, index, current, onPick, onClose }: Props) {
  const [book, setBook] = useState<string | null>(null);

  useEffect(() => { if (open) setBook(null); }, [open]);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [open, onClose]);

  const sel = index.books.find((b) => b.id === book);
  const ot = index.books.filter((b) => b.order <= 39);
  const nt = index.books.filter((b) => b.order > 39);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="sheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} onClick={onClose}>
          <motion.div
            className="sheet" role="dialog" aria-modal="true" aria-label={sel ? `${sel.name} chapters` : 'Choose a book'}
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 380, damping: 40 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sheet-head">
              {sel ? (
                <button type="button" className="icon-btn" onClick={() => setBook(null)} aria-label="Back to books"><ChevronLeft size={20} strokeWidth={1.75} /></button>
              ) : <span className="icon-btn" aria-hidden="true" />}
              <h2>{sel ? sel.name : 'Books'}</h2>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><X size={20} strokeWidth={1.75} /></button>
            </div>
            <div className="sheet-body">
              {sel ? (
                <div className="chapter-grid">
                  {Array.from({ length: sel.chapters }, (_, i) => i + 1).map((c) => (
                    <button key={c} type="button" className="chip-btn" data-on={sel.id === current.book && c === current.chapter} onClick={() => onPick(sel.id, c)}>{c}</button>
                  ))}
                </div>
              ) : (
                <>
                  <h3 className="group-title">Old Testament</h3>
                  <div className="book-grid">{ot.map((b) => <BookBtn key={b.id} b={b} on={b.id === current.book} pick={setBook} />)}</div>
                  <h3 className="group-title">New Testament</h3>
                  <div className="book-grid">{nt.map((b) => <BookBtn key={b.id} b={b} on={b.id === current.book} pick={setBook} />)}</div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BookBtn({ b, on, pick }: { b: { id: string; name: string }; on: boolean; pick: (id: string) => void }) {
  return <button type="button" className="chip-btn book" data-on={on} onClick={() => pick(b.id)}>{b.name}</button>;
}
