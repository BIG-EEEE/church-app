# Roadmap

Milestones are small and each ends with: tests green, build green, committed, notes here.
Each one starts with research. Sources are linked in the milestone notes.

| # | Milestone | Status |
| --- | --- | --- |
| M0 | Research, navigation shell, plan | done |
| M1 | Foundation: router, PWA, tests, Vercel config, native-ready seams | done |
| M2 | Full Bible: 3 translations, reader, picker, search, bookmarks, highlights, offline | done (needs on-device check) |
| M3 | Church content: services, sermons, events, announcements as typed data + admin | in progress: Home reads src/content/church.ts (sample data); sermons and admin next |
| M4 | Give: Paystack mobile money and card, receipts | planned |
| M5 | Groups, prayer requests, member sign-in and directory | planned |
| M6 | Push notifications, install prompt, light polish pass | planned |
| M7 | Native wrap with Capacitor (see APP-UPGRADE.md) | planned |

## M1 and M2 notes

- **Bible data.** BSB, KJV and WEB are all flagged public domain in the HelloAO API metadata
  (BSB was dedicated to the public domain on 30 April 2023, per berean.bible/terms.htm). `scripts/build-bible.mjs`
  refuses to build any translation that is not flagged public domain. Output is committed so builds need no network.
  Format: one JSON file per book, items are `{h}` heading, `{s}` subtitle, `{p}` paragraph break, `{v,t}` verse.
- **Offline.** The app shell is precached (about 360 KB). The Bible is 14 MB, so it is not precached: each book is
  cached the first time it is opened (Workbox runtime CacheFirst, cache `bible-v1`). A "download whole translation"
  button is a good small follow-up.
- **Search.** Loads all books of the active translation once, then scans in memory. 31k verses is fast. A reference
  such as "1 cor 13:4" jumps straight to the passage.
- **State.** One small persisted store (`src/lib/store.ts`) over localStorage. Settings, last position, bookmarks and
  highlights. Keys are translation-independent (`JHN.3.16`).
- **Design.** Palette is #ffffff, #fbfbfb and electric lime #ccff00, near-black ink for text. No shadows; glass is a
  backdrop blur with a hairline border.

## M3 notes

- Home is church-only: next service (computed from weekly services), announcement, upcoming events, weekly schedule.
- Everything Bible lives on the Bible tab: continue reading, verse of the day, Old and New Testament shelves.
- All church details live in src/content/church.ts and are SAMPLE values until the real church supplies them.

## Reusing this for another church

Everything church-specific is in two places: src/content/church.ts (name, address, services, announcements, events) and
public/ (icons, art). Bible text is shared. Change those, rebuild, deploy. Milestone M3 turns church.ts into an admin-edited store.

## Art

Public-domain Dore engravings are fetched and verified by scripts/fetch-art.mjs (it refuses anything not flagged public domain
on Commons) into public/art with credits.json. They appear on the Bible tab header and Stories row.

## Known gaps

- Not yet checked on a real phone or in a screenshot after the palette change (the test machine was at 100% CPU).
- Prayer, directory and giving have no pages yet. The Give pill leads to a page that says so.
- Single bookmark/highlight colour. Notes on verses are not built.
