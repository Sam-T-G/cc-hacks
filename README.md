# CC Hacks — site

The public site for **CC Hacks**, a community-college-only hackathon organized by GDG @ RCC. The
current page is a **partnership proposal for RCC MESA and MVC MESA**.

Live: https://sam-t-g.github.io/cc-hacks/

## Stack

A **Vite + TypeScript** single page with a GSAP / Lenis motion layer, deployed to GitHub Pages by a
GitHub Action (not branch-root serving).

- `index.html` — the page (Vite entry; includes a pre-paint inline `motion` script)
- `styles.css` — design system (warm paper, ink, a Google-color tier system); imported by `src/main.ts`
- `src/main.ts` — Lenis smooth scroll, GSAP/ScrollTrigger reveals, the hero intro, the scope-tier
  dial, selectable involvement cards, count-up stats, track-matrix hover highlight, scroll-progress bar
- `public/assets/` — logos (Google, Gemini, Firebase, MESA, MLH, the RCCD colleges, CCC) + favicon;
  referenced as root-absolute `/assets/...`
- `vite.config.ts` — `base: '/cc-hacks/'` for the Pages project subpath
- `.github/workflows/deploy.yml` — build + deploy to Pages

## Run locally

```bash
npm install
npm run dev       # http://localhost:5173/cc-hacks/
npm run build     # outputs dist/ (gitignored)
npm run preview   # serve the production build
```

## Deploy

Push to `main`. The Action builds `dist/` and publishes it to Pages (~1.5 min). Pages source is set to
**GitHub Actions** (`build_type: workflow`). Raw `index.html` served directly will not work; it needs
the build.

## Notes

- Attendance figures shown are **targets**, not commitments.
- The GDG @ RCC funding supplement (up to $10,000) is **pending ASRCC approval**.
- Motion respects `prefers-reduced-motion`, and the page renders fully with no JS, reduced motion, or
  in print (reveal targets are hidden only on screen + motion).
- The official GDG @ RCC lockup (`public/assets/logos/gdg-rcc.svg`, the GDG On Campus horizontal
  mark) is wired into the nav, the "who runs it" fact, and the footer via the `.gdg-logo` class.
- Detailed internal planning lives in the private `gdg-cc-hackathon` repo. This repo is public on
  purpose: it's the outward-facing site and proposal. Also serves as the foundation for the event
  website MLH Member Events require.
