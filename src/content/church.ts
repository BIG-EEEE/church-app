// SAMPLE CONTENT. Replace with the church's real details. In milestone M3 this moves behind a simple admin screen.
// Keep the shape; the Home page reads only from here.

export interface Service { day: 0 | 1 | 2 | 3 | 4 | 5 | 6; time: string; label: string } // day: 0 = Sunday, time: 24h "HH:MM"
export interface Announcement { id: string; title: string; body: string }
export interface ChurchEvent { id: string; title: string; inDays: number; time: string; place: string } // inDays keeps the sample always upcoming; real events use a date
export interface Church {
  name: string;
  address: string;
  mapsUrl: string;
  services: Service[];
  announcements: Announcement[];
  events: ChurchEvent[];
}

export const CHURCH: Church = {
  name: 'Your Church',
  address: 'Add the church address here',
  mapsUrl: 'https://www.google.com/maps',
  services: [
    { day: 0, time: '09:00', label: 'Sunday service' },
    { day: 3, time: '18:30', label: 'Midweek prayer' },
  ],
  announcements: [
    { id: 'a1', title: 'Welcome', body: 'New here? Introduce yourself to an usher after the service and we will be glad to meet you.' },
  ],
  events: [
    { id: 'e1', title: 'Youth fellowship', inDays: 3, time: '17:00', place: 'Main hall' },
    { id: 'e2', title: 'Community outreach', inDays: 6, time: '08:00', place: 'Meet at the church' },
    { id: 'e3', title: 'Choir practice', inDays: 9, time: '18:00', place: 'Sanctuary' },
  ],
};
