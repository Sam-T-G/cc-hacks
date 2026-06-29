# DESIGN.md — CC Hacks

The design language for this site. Read this before changing visuals; keep new work consistent with
it. Pairs with [PRODUCT.md](PRODUCT.md).

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
  page's memorable interaction; the content genuinely is an escalating ladder.
- **Track matrix:** project × track grid showing one project competing across several tracks.
- **Color-coded rosters / tiers:** the reach roster and scope tiers use the ascending color system.
- **4-dot brand mark:** the `cc_hacks` mark, blue/red/amber/green.

## Motion

- Shared easing `--ease` (cubic-bezier(.2,.7,.3,1)) for transitions.
- Scroll reveals are subtle (opacity + small translate), one orchestrated hero load-in. Everything
  respects `prefers-reduced-motion`.
- Spend motion on the dial and reveals; keep the rest quiet.

## Rules (anti-slop)

- Color encodes meaning. Never use blue/green/red/amber decoratively.
- Numbers shown are targets; the GDG supplement is pending. No fabricated figures.
- Headings use `text-wrap: balance`; body uses `text-wrap: pretty`.
- Every interactive element has a visible `:focus-visible` ring. Mobile-first responsive. Reduced
  motion respected.
- Match the voice rules in PRODUCT.md (no em dashes in sentences, no AI tells).
