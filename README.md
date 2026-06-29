# CC Hacks — site

The public site for **CC Hacks**, a community-college-only hackathon organized by GDG @ RCC. The
current page is a **partnership proposal for RCC MESA and MVC MESA**.

Live: https://sam-t-g.github.io/cc-hacks/

## What it is

A single static page (no build step), so GitHub Pages serves it directly from `main`:

- `index.html` — the page
- `styles.css` — design system (warm paper, ink, a Google-color tier system)
- `main.js` — the interactive scope-tier dial, selectable involvement cards, scroll reveals
- `assets/` — favicon

## Run locally

Open `index.html` in a browser, or:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Notes

- Attendance figures shown are **targets**, not commitments.
- The GDG @ RCC funding supplement (up to $10,000) is **pending ASRCC approval**.
- Detailed, internal planning lives in the private `gdg-cc-hackathon` repo. This repo is public on
  purpose: it's the outward-facing site and proposal.

Built to also serve as the foundation for the event website MLH Member Events require.
