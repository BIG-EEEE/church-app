// Everything church-specific lives in this file and in public/. To reuse the app for another church, edit this and rebuild.
// Only facts that are published by the church itself are filled in. Empty lists simply hide their section.
// Sources for this config are in docs/FIRST-LOVE.md. Confirm times and details with the church before launch.

export interface Service { day: 0 | 1 | 2 | 3 | 4 | 5 | 6; time: string; label: string } // day: 0 = Sunday, time: 24h "HH:MM"
export interface Announcement { id: string; title: string; body: string }
export interface ChurchEvent { id: string; title: string; date: string; time: string; place: string } // date: "YYYY-MM-DD"
export interface Sermon { id: string; title: string; speaker: string; date?: string; youtubeId?: string; audioUrl?: string } // date: "YYYY-MM-DD"
export interface Link { label: string; href: string }
export interface GiveMethod { label: string; detail: string; note?: string; copy?: string } // copy: the value a person would paste, e.g. a MoMo number
export interface Church {
  name: string;
  shortName: string; // shown in the top-left pill
  tagline: string;
  heroImage: string; // path under public/, full-bleed at the top of Home
  address: string;
  mapsUrl: string;
  services: Service[];
  announcements: Announcement[];
  events: ChurchEvent[];
  sermons: Sermon[]; // newest first or any order, the app sorts by date
  watch: Link[]; // official places to watch or listen
  follow: Link[]; // official social accounts
  give: { intro: string; methods: GiveMethod[]; contactHref?: string };
  prayer: { whatsapp?: string; email?: string }; // if empty, requests go through the phone's share sheet
}

export const CHURCH: Church = {
  name: 'First Love Church',
  shortName: 'First Love',
  tagline: 'A global vibrant youth church full of first love for the Lord',
  heroImage: 'church/hero.webp',
  address: 'Trinity Avenue, East Legon, Accra',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=First+Love+Center+Trinity+Avenue+East+Legon+Accra',
  services: [
    { day: 6, time: '18:30', label: 'Saturday evening service' },
    { day: 0, time: '08:30', label: 'Sunday service' },
    { day: 0, time: '12:00', label: 'Sunday second service' },
  ],
  announcements: [],
  events: [],
  // Embedded from the uploader's own YouTube channel (Dag Heward-Mills, tagged @firstlovecenter). Videos stay on YouTube.
  sermons: [
    { id: 'v1', title: '2025: Your Year of Greater and Better', speaker: 'Dag Heward-Mills', youtubeId: 'WV69LrLU4aA' },
    { id: 'v2', title: 'How To Be Humble by Being Like A Servant', speaker: 'Dag Heward-Mills', youtubeId: 'gemocViEAjU' },
    { id: 'v3', title: 'Thanksgiving: Appreciation Sunday', speaker: 'Dag Heward-Mills', youtubeId: 'KmB5grQcHOY' },
  ],
  watch: [
    { label: 'First Love Center Official on YouTube', href: 'https://www.youtube.com/channel/UCEBUZZ9Gyaek_l92J728Yuw' },
    { label: 'Watch on the church website', href: 'https://www.firstlovecenter.com/' },
    { label: 'Podcast: First Love messages', href: 'https://daghewardmillsfirstlove.podbean.com/' },
  ],
  follow: [
    { label: 'X', href: 'https://x.com/FirstLoveCenter' },
    { label: 'Instagram', href: 'https://www.instagram.com/firstlovecenter/' },
    { label: 'TikTok', href: 'https://www.tiktok.com/@firstlovecenter' },
  ],
  give: {
    intro: 'Giving details come from the church. Until they are added here, please give through the church directly.',
    methods: [],
    contactHref: 'https://www.firstlovecenter.com/',
  },
  prayer: {},
};
