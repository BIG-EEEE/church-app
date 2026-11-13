// Public-domain Gustave Doré engravings (see public/art/credits.json). Each story opens its chapter.
export interface Story { slug: string; title: string; book: string; chapter: number }

export const STORIES: Story[] = [
  { slug: 'deluge', title: 'The flood', book: 'GEN', chapter: 7 },
  { slug: 'abraham', title: 'Abraham tested', book: 'GEN', chapter: 22 },
  { slug: 'jacob', title: 'Jacob wrestles', book: 'GEN', chapter: 32 },
  { slug: 'joseph', title: 'Joseph reveals himself', book: 'GEN', chapter: 45 },
  { slug: 'daniel', title: 'Writing on the wall', book: 'DAN', chapter: 5 },
  { slug: 'jonah', title: 'Jonah', book: 'JON', chapter: 1 },
  { slug: 'cana', title: 'The wedding at Cana', book: 'JHN', chapter: 2 },
  { slug: 'judas', title: 'The betrayal', book: 'MAT', chapter: 26 },
  { slug: 'crucifixion', title: 'The crucifixion', book: 'JHN', chapter: 19 },
];

export const HERO = { slug: 'light', book: 'GEN', chapter: 1 };
