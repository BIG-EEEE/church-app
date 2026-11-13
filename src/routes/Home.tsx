import { ArrowUpRight, MapPin } from 'lucide-react';
import { CHURCH, type Service } from '../content/church';
import { assetUrl } from '../lib/platform';

const DAY_MS = 86400000;

/** The next time a service starts, from `now`. Pure, so it is easy to test. */
export function nextService(services: Service[], now: Date): { service: Service; at: Date } | null {
  let best: { service: Service; at: Date } | null = null;
  for (const service of services) {
    const [h, m] = service.time.split(':').map(Number);
    const at = new Date(now);
    at.setHours(h, m, 0, 0);
    at.setDate(at.getDate() + ((service.day - now.getDay() + 7) % 7));
    if (at.getTime() < now.getTime()) at.setDate(at.getDate() + 7);
    if (!best || at < best.at) best = { service, at };
  }
  return best;
}

export function relativeDay(at: Date, now: Date): string {
  const a = new Date(at.getFullYear(), at.getMonth(), at.getDate()).getTime();
  const b = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const d = Math.round((a - b) / DAY_MS);
  return d === 0 ? 'Today' : d === 1 ? 'Tomorrow' : `In ${d} days`;
}

const clock = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(2000, 0, 1, h, m).toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true }).toUpperCase();
};

export function Home() {
  const now = new Date();
  const next = nextService(CHURCH.services, now);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const events = CHURCH.events
    .map((e) => ({ ...e, at: new Date(`${e.date}T00:00:00`) }))
    .filter((e) => e.at.getTime() >= today)
    .sort((a, b) => a.at.getTime() - b.at.getTime());

  return (
    <div className="page home church-home">
      <div className="bible-hero" aria-hidden="true"><img src={assetUrl(CHURCH.heroImage)} alt="" fetchPriority="high" /></div>
      {next && (
        <section className="next-service" aria-label="Next service">
          <p className="eyebrow">{relativeDay(next.at, now)}</p>
          <h1 className="display">{next.at.toLocaleDateString('en-GB', { weekday: 'long' })}<br /><span className="mark">{clock(next.service.time)}</span></h1>
          <p className="muted">{next.service.label}</p>
          <a className="btn-lime" href={CHURCH.mapsUrl} target="_blank" rel="noreferrer"><MapPin size={18} strokeWidth={1.75} aria-hidden="true" />Get directions<ArrowUpRight size={18} strokeWidth={1.75} aria-hidden="true" /></a>
          <p className="address">{CHURCH.address}</p>
        </section>
      )}

      {CHURCH.announcements.map((a) => (
        <article key={a.id} className="note-card">
          <h2>{a.title}</h2>
          <p>{a.body}</p>
        </article>
      ))}

      {events.length > 0 && <section className="shelf" aria-label="Coming up">
        <h2>Coming up</h2>
        <ul className="events">
          {events.map((e) => (
            <li key={e.id}>
              <span className="date" aria-hidden="true"><b>{e.at.getDate()}</b><small>{e.at.toLocaleDateString('en-GB', { month: 'short' })}</small></span>
              <span className="what"><strong>{e.title}</strong><small>{e.at.toLocaleDateString('en-GB', { weekday: 'long' })}, {clock(e.time)} · {e.place}</small></span>
            </li>
          ))}
        </ul>
      </section>}

      <section className="shelf" aria-label="Weekly services">
        <h2>Every week</h2>
        <ul className="events plain">
          {CHURCH.services.map((s) => (
            <li key={s.label}>
              <span className="what"><strong>{s.label}</strong><small>{['Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'][s.day]}, {clock(s.time)}</small></span>
            </li>
          ))}
        </ul>
      </section>

      <section className="shelf" aria-label="Follow">
        <h2>Follow {CHURCH.shortName}</h2>
        <div className="follow">
          {CHURCH.follow.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="btn-ring pill">{l.label}</a>)}
        </div>
      </section>
    </div>
  );
}
