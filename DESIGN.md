# DESIGN.md — CC Hacks

The design language for this site. Read this before changing visuals; keep new work consistent with
it. Pairs with [PRODUCT.md](PRODUCT.md). The site is a Vite + TypeScript build with a GSAP / Lenis
motion layer; see [README.md](README.md) for run and deploy.

## Direction

**Build Studio:** warm, bright, confident, and inclusive. It carries GDG's brand energy without the
garish primary-color look, and it reads as hopeful and credible to an educator audience. Maximal where
it counts (a few signature moments), disciplined everywhere else.

## Color

Tokens live in `:root` in `styles.css`. Color **encodes meaning**; it is not decoration.

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#FCFAF5` | Page background (warm off-white) |
| `--paper-2` | `#F4F0E6` | Full-bleed band background (Hackathon 101) |
| `--card` | `#FFFFFF` | Card surfaces |
| `--ink` | `#17161D` | Primary text; dark sections (the ask) |
| `--ink-soft` | `#3A3942` | Secondary text |
| `--muted` | `#6A6873` | Mono labels, captions (AA on paper) |
| `--blue` | `#1A73E8` | Tier 1 / level 1 / "ascending" step one |
| `--green` | `#1E8E3E` | Tier 2 / level 2 |
| `--red` | `#EA4335` | Tier 3 / level 3 |
| `--amber` | `#F9AB00` | **Spotlight only:** key numbers, CTAs, the funding anchor, 1st place |

The four accents derive from the Google palette, refined and deepened. Ascending sequences run
blue → green → red. Amber is reserved for the single most important thing in view.

Wherever paper-colored text sits ON an accent (the dial thumb), use the `-ink` deepened tokens for
AA contrast; the vivid tokens stay on big display digits, dots, bars, and fills. On the podium the
medal color lives in the top border only; place numbers stay ink (amber is never text on white).

## Type

- **Display — Bricolage Grotesque** (`--f-display`): headlines and big numbers. Tight tracking
  (-.02 to -.04em), weights 700–800, optical sizing on.
- **Body — Hanken Grotesk** (`--f-body`): paragraphs and UI text. Weights 400–600.
- **Utility — Space Mono** (`--f-mono`): eyebrows, labels, data, status lines. Uppercase + letter-spacing
  for labels. This is the "developer texture" of the system.

Not Inter, not a serif display. The trio is the typographic signature.

## Layout

- Content max-width `--maxw` (1120px), centered, with `--pad` inline padding.
- Section rhythm via `--sec-y`. Full-bleed bands (Hackathon 101 on `--paper-2`, the ask on `--ink`)
  are deliberate accents, not the default. Bands wrap content in `.band-inner` so the left edge stays
  consistent.

## Signature elements

- **Scope-tier dial:** a segmented control that morphs the event spec and recolors per tier. The
  page's memorable interaction; the content genuinely is an escalating ladder. Defaults to Tier 2,
  the tier the copy names as the target.
- **Track matrix:** project × track grid showing one project competing across several tracks.
- **Color-coded rosters / tiers:** the reach roster and scope tiers use the ascending color system.
- **4-dot brand mark:** the `cc_hacks` mark, blue/red/amber/green.

## Motion

A GSAP + Lenis system in `src/main.ts`, restrained register (eased, no bounce).

- **Lenis** smooth scroll, wired to the GSAP ticker; smooth in-page anchor nav that also updates the
  hash and moves keyboard focus to the target (the skip link keeps native behavior).
- **GSAP / ScrollTrigger** choreographed, staggered reveals (replaces the old IntersectionObserver),
  plus one orchestrated hero intro. Reveals use `autoAlpha` (opacity + visibility) so hidden elements
  are also out of the Tab order.
- Signature touches: scope-dial spec transitions, count-up reach stats, track-matrix row/column hover
  highlight (hover-capable input only), a Google-color scroll-progress bar, and the copy-morph CTA
  (the ask button copies the email to the clipboard and the pill crossfades to show the address;
  mailto is the no-JS fallback and the explicit "mail app" link below).
- **Gating:** all motion sits behind a pre-paint `.motion` class (added only when reduced-motion is
  off). Reveal targets are hidden via `@media screen { html.motion :is(...) }` and animated in, so the
  page renders fully with no JS, reduced motion, or in print (an `@media print` block also unhides all
  tier panels and expands the collapsed rosters; a `beforeprint` hook opens every `<details>`). Keep
  the reveal list in `styles.css` in sync with `REVEAL_SELECTOR` in `src/main.ts`.
- Everything respects `prefers-reduced-motion`. Shared `--ease` (cubic-bezier(.2,.7,.3,1)) for CSS
  transitions.

## Rules (anti-slop)

- Color encodes meaning. Never use blue/green/red/amber decoratively.
- Numbers shown are targets; the GDG supplement is pending. No fabricated figures.
- Headings use `text-wrap: balance`; body uses `text-wrap: pretty`.
- Every interactive element has a visible `:focus-visible` ring. Mobile-first responsive. Reduced
  motion respected.
- Match the voice rules in PRODUCT.md (no em dashes in sentences, no AI tells).
