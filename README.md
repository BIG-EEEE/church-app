# Church app

A mobile-first church web app, starting from one fixed navigation and layout:

- Glass pills at the top (logo, give) that tuck away on scroll
- A floating glass dock at the bottom: Home, Explore, More
- **More** opens a gooey popover (metaball morph, ported from EasyUI GooeyMenu)
- The round button is Search at the top of the page and turns into Back to top when you scroll

Stack: Vite, React, TypeScript, Framer Motion, Lucide.

```
npm install
npm run dev
```

`/frame.html` shows the app inside an iPhone 11 frame during development.

Status: M0 to M2 done (navigation shell, PWA, full Bible reader). See docs/ROADMAP.md for milestones, docs/PLAN.md for the research, and docs/APP-UPGRADE.md for the native-app path.

The Bible (BSB, KJV, WEB, all public domain) is built by scripts/build-bible.mjs into public/bible/.
