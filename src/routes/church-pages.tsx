import { useState } from 'react';
import { ArrowUpRight, Check, Copy, Play } from 'lucide-react';
import { CHURCH, type Sermon } from '../content/church';

export const sortSermons = (list: Sermon[]) => [...list].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

const when = (iso: string) => new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

function SermonCard({ s }: { s: Sermon }) {
  const [play, setPlay] = useState(false);
  return (
    <article className="sermon">
      {s.youtubeId && (
        <div className="video">
          {play ? (
            <iframe src={`https://www.youtube-nocookie.com/embed/${s.youtubeId}?autoplay=1&rel=0`} title={s.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />
          ) : (
            <button type="button" onClick={() => setPlay(true)} aria-label={`Play ${s.title}`}>
              <img src={`https://i.ytimg.com/vi/${s.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
              <span className="play"><Play size={22} strokeWidth={1.75} aria-hidden="true" /></span>
            </button>
          )}
        </div>
      )}
      <h3>{s.title}</h3>
      <p className="muted">{s.speaker}{s.date ? ` · ${when(s.date)}` : ''}</p>
      {s.audioUrl && <audio controls preload="none" src={s.audioUrl} />}
    </article>
  );
}

export function Watch() {
  const sermons = sortSermons(CHURCH.sermons);
  return (
    <div className="page">
      <h1>Watch and listen</h1>
      {sermons.map((s) => <SermonCard key={s.id} s={s} />)}
      {!sermons.length && <p className="muted">Messages from {CHURCH.name} are on the church’s own channels. Open one below.</p>}
      <ul className="link-list">
        {CHURCH.watch.map((l) => (
          <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer"><span>{l.label}</span><span className="arrow"><ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" /></span></a></li>
        ))}
      </ul>
    </div>
  );
}

export function Prayer() {
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [state, setState] = useState<'idle' | 'sent' | 'copied'>('idle');
  const { whatsapp, email } = CHURCH.prayer;

  const send = async () => {
    const body = `Prayer request${name.trim() ? ` from ${name.trim()}` : ''}:\n\n${text.trim()}`;
    if (whatsapp) { window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(body)}`, '_blank', 'noopener'); setState('sent'); return; }
    if (email) { window.location.href = `mailto:${email}?subject=${encodeURIComponent('Prayer request')}&body=${encodeURIComponent(body)}`; setState('sent'); return; }
    if (navigator.share) { try { await navigator.share({ text: body }); setState('sent'); } catch { /* dismissed */ } return; }
    try { await navigator.clipboard.writeText(body); setState('copied'); } catch { /* no clipboard */ }
  };

  return (
    <div className="page">
      <h1>Prayer</h1>
      <p className="muted">Share what you would like prayer for. Nothing is stored in this app; your request goes to the church through the option your phone offers.</p>
      <label className="field"><span>Your name (optional)</span><input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
      <label className="field"><span>Prayer request</span><textarea rows={6} value={text} onChange={(e) => { setText(e.target.value); setState('idle'); }} /></label>
      <button type="button" className="btn-lime solid" onClick={send} disabled={!text.trim()}>{whatsapp ? 'Send on WhatsApp' : email ? 'Send by email' : 'Share request'}</button>
      {state === 'sent' && <p className="muted" role="status"><Check size={16} aria-hidden="true" /> Thank you. We are praying with you.</p>}
      {state === 'copied' && <p className="muted" role="status"><Check size={16} aria-hidden="true" /> Copied. Paste it to the church in any message.</p>}
    </div>
  );
}

function CopyRow({ m }: { m: { label: string; detail: string; note?: string; copy?: string } }) {
  const [ok, setOk] = useState(false);
  return (
    <li className="give-row">
      <span className="what"><strong>{m.label}</strong><span>{m.detail}</span>{m.note && <small>{m.note}</small>}</span>
      {m.copy && <button type="button" className="icon-btn" aria-label={`Copy ${m.label}`} onClick={async () => { try { await navigator.clipboard.writeText(m.copy!); setOk(true); window.setTimeout(() => setOk(false), 1500); } catch { /* no clipboard */ } }}>{ok ? <Check size={18} strokeWidth={1.75} /> : <Copy size={18} strokeWidth={1.5} />}</button>}
    </li>
  );
}

export function Give() {
  const { intro, methods, contactHref } = CHURCH.give;
  return (
    <div className="page">
      <h1>Give</h1>
      <p className="muted">{intro}</p>
      {methods.length > 0 && <ul className="give-list">{methods.map((m) => <CopyRow key={m.label} m={m} />)}</ul>}
      {contactHref && <a className="btn-lime solid" href={contactHref} target="_blank" rel="noreferrer">{methods.length ? 'More ways to give' : 'Go to the church'}<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" /></a>}
    </div>
  );
}
