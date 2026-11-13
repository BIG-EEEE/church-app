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

Status: navigation shell with placeholder content. Church features are planned in `docs/PLAN.md`.
