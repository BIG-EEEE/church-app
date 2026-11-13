import { forwardRef, useEffect, useRef, useState } from 'react';
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Home, BookOpen, Ellipsis, Search, ArrowUp, X } from 'lucide-react';
import { MORE } from './app/nav';

/* Ported from EasyUI GooeyMenu: SVG metaball filter + spring physics.
   Surface is Apple-style glass: real backdrop blur underneath, goo tint + specular rim on top. */

const BAR_H = 64;
const CIRCLE = 64;
const GAP = 12;
const ROW_H = 48;
const PAD = 8;
const PANEL_W = 232;

const DROP = { type: 'spring', stiffness: 240, damping: 18, mass: 1 } as const;
const GROW = { type: 'spring', stiffness: 210, damping: 22, mass: 1 } as const;
const SNAP = { type: 'spring', stiffness: 260, damping: 22, mass: 0.9 } as const;
const ROW = { type: 'spring', stiffness: 420, damping: 28 } as const;

const PANEL_H = MORE.length * ROW_H + PAD * 2;
const TOTAL_H = PANEL_H + GAP + BAR_H;

type Props = { scrolled: boolean };

export function Dock({ scrolled }: Props) {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [sp, setSp] = useSearchParams();
  const searching = pathname === '/search';
  const query = sp.get('q') ?? '';
  const onQuery = (q: string) => setSp(q ? { q } : {}, { replace: true });
  const fromRef = useRef('/');
  const [focusIdx, setFocusIdx] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const moreBtn = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const down = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); moreBtn.current?.focus(); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIdx((i) => (i - 1 + MORE.length) % MORE.length); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIdx((i) => (i + 1) % MORE.length); }
    };
    window.addEventListener('pointerdown', down);
    window.addEventListener('keydown', key);
    return () => { window.removeEventListener('pointerdown', down); window.removeEventListener('keydown', key); };
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(`more-${MORE[focusIdx].path.slice(1)}`)?.focus();
  }, [focusIdx, open]);

  const circleMode: 'close' | 'top' | 'search' = searching ? 'close' : scrolled ? 'top' : 'search';

  const onCircle = () => {
    if (circleMode === 'close') nav(fromRef.current);
    else if (circleMode === 'top') window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    else { setOpen(false); fromRef.current = pathname; nav('/search'); }
  };

  const go = (path: string) => { setOpen(false); nav(path); };

  const closedY = GAP + BAR_H - 10;
  const closed = { y: closedY, scaleX: 92 / PANEL_W, scaleY: (BAR_H - 20) / PANEL_H };
  const opened = { y: 0, scaleX: 1, scaleY: 1 };
  const instant = { duration: 0 };

  return (
    <div className="dock" ref={root}>
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <filter id="dock-goo" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" result="goo" />
            <feGaussianBlur in="goo" stdDeviation="1.6" result="soft" />
            <feSpecularLighting in="soft" surfaceScale="5" specularConstant="1" specularExponent="26" lightingColor="#ffffff" result="spec">
              <feDistantLight azimuth="235" elevation="38" />
            </feSpecularLighting>
            <feComposite in="spec" in2="goo" operator="in" result="rim" />
            <feComposite in="goo" in2="rim" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="lit" />
            <feComponentTransfer in="lit">
              <feFuncA type="linear" slope="0.5" />
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      <div className="dock-inner" style={{ height: TOTAL_H }}>
        {/* 1. real glass: backdrop blur */}
        <div className="glass-shape" style={{ left: 0, right: CIRCLE + GAP, bottom: 0, height: BAR_H, borderRadius: BAR_H / 2 }} />
        <div className="glass-shape" style={{ right: 0, bottom: 0, width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2 }} />
        <motion.div
          className="glass-shape"
          style={{ right: CIRCLE + GAP, top: 0, width: PANEL_W, height: PANEL_H, borderRadius: 28 }}
          initial={false}
          animate={{ opacity: open ? 1 : 0 }}
          transition={open ? { duration: 0.2, delay: 0.28 } : { duration: 0.12 }}
        />

        {/* 2. goo layer: metaball morph + tint + specular rim */}
        <div className="goo" style={{ filter: 'url(#dock-goo)' }} aria-hidden="true">
          <div className="blob" style={{ left: 0, right: CIRCLE + GAP, bottom: 0, height: BAR_H, borderRadius: BAR_H / 2 }} />
          <div className="blob" style={{ right: 0, bottom: 0, width: CIRCLE, height: CIRCLE, borderRadius: CIRCLE / 2 }} />
          <motion.div
            className="blob"
            style={{ right: CIRCLE + GAP, top: 0, width: PANEL_W, height: PANEL_H, borderRadius: 28, transformOrigin: '100% 100%', willChange: 'transform' }}
            initial={false}
            animate={open ? opened : closed}
            transition={reduce ? instant : open ? { y: DROP, scaleX: GROW, scaleY: { ...GROW, delay: 0.04 } } : { y: SNAP, scaleX: SNAP, scaleY: SNAP }}
          />
        </div>

        {/* 3. content */}
        <LayoutGroup>
          <div className="bar" style={{ right: CIRCLE + GAP, height: BAR_H }}>
            <AnimatePresence mode="popLayout" initial={false}>
              {searching ? (
                <motion.label key="search" className="search" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.18 }}>
                  <Search size={18} strokeWidth={1.75} aria-hidden="true" />
                  <input autoFocus type="search" placeholder="Search" aria-label="Search" value={query} onChange={(e) => onQuery(e.target.value)} onKeyDown={(e) => e.key === 'Escape' && onCircle()} />
                </motion.label>
              ) : (
                <motion.div key="tabs" className="tabs" initial={{ opacity: 0, filter: 'blur(4px)' }} animate={{ opacity: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, filter: 'blur(4px)' }} transition={{ duration: 0.18 }}>
                  <Tab label="Home" icon={Home} active={!open && pathname === '/'} onClick={() => go('/')} />
                  <Tab label="Bible" icon={BookOpen} active={!open && pathname.startsWith('/bible')} onClick={() => go('/bible')} />
                  <Tab ref={moreBtn} label="More" icon={Ellipsis} active={open} expanded={open} onClick={() => { setOpen((o) => !o); setFocusIdx(0); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </LayoutGroup>

        <button type="button" className="circle" onClick={onCircle} aria-label={circleMode === 'close' ? 'Close search' : circleMode === 'top' ? 'Back to top' : 'Search'}>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={circleMode} className="icon-swap" initial={{ opacity: 0, scale: 0.8, filter: 'blur(3px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, scale: 0.8, filter: 'blur(3px)' }} transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}>
              {circleMode === 'close' ? <X size={22} strokeWidth={1.75} /> : circleMode === 'top' ? <ArrowUp size={22} strokeWidth={1.75} /> : <Search size={22} strokeWidth={1.75} />}
            </motion.span>
          </AnimatePresence>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              className="menu"
              role="menu"
              aria-label="More"
              style={{ right: CIRCLE + GAP, top: 0, width: PANEL_W, height: PANEL_H, padding: PAD }}
              initial="closed"
              animate="open"
              exit="closed"
              variants={{ open: { transition: { staggerChildren: 0.035, delayChildren: 0.1 } }, closed: { transition: { staggerChildren: 0.012, staggerDirection: -1 } } }}
            >
              {MORE.map(({ path, label, icon: Icon }, i) => (
                <motion.li key={path} role="none" variants={{ open: { opacity: 1, y: 0, transition: ROW }, closed: { opacity: 0, y: 10, transition: { duration: 0.1 } } }}>
                  <button id={`more-${path.slice(1)}`} role="menuitem" type="button" className="menu-row" data-current={pathname === path} tabIndex={i === focusIdx ? 0 : -1} onClick={() => go(path)} onMouseEnter={() => setFocusIdx(i)}>
                    <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
                    <span>{label}</span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type TabProps = { label: string; icon: typeof Home; active: boolean; onClick: () => void; expanded?: boolean };
const Tab = forwardRef<HTMLButtonElement, TabProps>(function Tab({ label, icon: Icon, active, onClick, expanded }, ref) {
  return (
    <button ref={ref} type="button" className="tab" data-active={active} onClick={onClick} aria-haspopup={expanded === undefined ? undefined : 'menu'} aria-expanded={expanded} aria-current={active && expanded === undefined ? 'page' : undefined}>
      {active && <motion.span layoutId="tab-pill" className="tab-pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
      <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
});
