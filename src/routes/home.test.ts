import { describe, expect, it } from 'vitest';
import { nextService, relativeDay } from './Home';

const services = [
  { day: 0 as const, time: '09:00', label: 'Sunday service' },
  { day: 3 as const, time: '18:30', label: 'Midweek prayer' },
];

describe('nextService', () => {
  it('picks the midweek service on a Monday', () => {
    const mon = new Date(2026, 10, 16, 10, 0); // Mon 16 Nov 2026
    const n = nextService(services, mon)!;
    expect(n.service.label).toBe('Midweek prayer');
    expect(n.at.getDay()).toBe(3);
  });
  it('picks later today when it has not started', () => {
    const sun = new Date(2026, 10, 15, 7, 0); // Sun 15 Nov 2026, 07:00
    const n = nextService(services, sun)!;
    expect(n.service.label).toBe('Sunday service');
    expect(n.at.getDate()).toBe(15);
  });
  it('rolls to next week once the service has started', () => {
    const sun = new Date(2026, 10, 15, 9, 30);
    const n = nextService([services[0]], sun)!;
    expect(n.at.getDate()).toBe(22);
  });
  it('returns null with no services', () => expect(nextService([], new Date())).toBeNull());
});

describe('relativeDay', () => {
  it('words today, tomorrow and later', () => {
    const now = new Date(2026, 10, 15, 12, 0);
    expect(relativeDay(new Date(2026, 10, 15, 18, 0), now)).toBe('Today');
    expect(relativeDay(new Date(2026, 10, 16, 8, 0), now)).toBe('Tomorrow');
    expect(relativeDay(new Date(2026, 10, 18, 8, 0), now)).toBe('In 3 days');
  });
});
