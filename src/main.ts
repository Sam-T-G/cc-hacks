/* CC Hacks — MESA proposal interactions + motion system */
import '../styles.css';
import 'lenis/dist/lenis.css';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

document.body.classList.add('js');

/* `.motion` is added to <html> by a pre-paint inline script (in index.html <head>)
   only when prefers-reduced-motion is OFF. This single flag gates all motion, and
   content is never hidden when motion is off (no-JS / reduced-motion / print). */
const motion = document.documentElement.classList.contains('motion');
const prefersReduced = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Keep this list in sync with the `html.motion :is(...)` hide rule in styles.css. */
const REVEAL_SELECTOR =
  '.section .eyebrow, .big-statement, .why-thesis, .assurance-line, .section-title, .section-lede, ' +
  '.hack-lead, .hack-subhead, .qa-grid, .fmt-grid, .mlh-benefits, .mlh-status, ' +
  '.why-body, .why-cards, .gdg-cred, .gdg-advisor, .gdg-intro-logo, .gdg-grid, .gr-list, .gdg-io, .facts, .levels, .levels-status, .mesa-track, ' +
  '.podium, .track-cards, .track-matrix, .dial, .tier-panels, .scope-foot, ' +
  '.reach-stats, .reach-strategy, .roster, ' +
  '.anchor-card, .fund-list, .fund-foot, .ask-steps, .ask-cta';

if (motion) {
  /* ---------- Lenis smooth scroll, driven by the GSAP ticker ----------
     Desktop only. On touch / coarse-pointer devices, native scrolling has momentum,
     costs no continuous main-thread rAF, and saves battery; CSS `scroll-behavior: smooth`
     plus scroll-margin handle in-page anchors there. ScrollTrigger reveals work either way. */
  const useLenis = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (useLenis) {
    const lenis = new Lenis({ lerp: 0.1 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    /* Smooth in-page anchor navigation through Lenis */
    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (!id || id === '#') return;
        const target = document.querySelector<HTMLElement>(id);
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -80 });
      });
    });
  }

  /* ---------- Choreographed scroll reveals (replaces IntersectionObserver) ---------- */
  const revealTargets = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR);
  ScrollTrigger.batch(revealTargets, {
    start: 'top 86%',
    once: true,
    onEnter: (batch) =>
      gsap.fromTo(
        batch,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true },
      ),
  });

  /* Reveal pass is wired up: cancel the pre-paint failsafe (in index.html <head>) that
     would otherwise strip `.motion` and force everything visible. */
  const failsafe = (window as any).__revealFailsafe;
  if (failsafe) {
    window.clearTimeout(failsafe);
    (window as any).__revealFailsafe = null;
  }

  /* ---------- Hero intro: staggered reveal ---------- */
  const HERO_ELS =
    '.hero-eyebrow, .hero-title .line, .hero-sub, .hero-meta, .hero-sponsor, .scroll-cue';
  const runHero = () => {
    let done = false;
    gsap
      .timeline({ defaults: { ease: 'power3.out' }, onComplete: () => (done = true) })
      .fromTo('.hero-eyebrow', { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.1)
      .fromTo(
        '.hero-title .line',
        { autoAlpha: 0, y: 42 },
        { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'expo.out' },
        0.18,
      )
      .fromTo(
        '.hero-sub, .hero-meta, .hero-sponsor, .scroll-cue',
        { autoAlpha: 0, y: 16 },
        { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.09 },
        0.55,
      );
    // The hero is above the fold; never let it stay hidden if the timeline stalls.
    window.setTimeout(() => {
      if (!done) gsap.set(HERO_ELS, { autoAlpha: 1, y: 0 });
    }, 2600);
  };
  Promise.race([
    document.fonts.ready,
    new Promise((resolve) => window.setTimeout(resolve, 500)),
  ]).then(runHero);

  /* ---------- Magnetic "Let's talk" CTA ---------- */
  const cta = document.querySelector<HTMLElement>('.btn-mail');
  if (cta && window.matchMedia('(pointer: fine)').matches) {
    cta.style.transition = 'background .2s ease';
    const xTo = gsap.quickTo(cta, 'x', { duration: 0.4, ease: 'power3' });
    const yTo = gsap.quickTo(cta, 'y', { duration: 0.4, ease: 'power3' });
    cta.addEventListener('mousemove', (e) => {
      const r = cta.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.3);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.4);
    });
    cta.addEventListener('mouseleave', () => {
      xTo(0);
      yTo(0);
    });
  }

  /* ---------- Count-up reach stats ---------- */
  gsap.utils.toArray<HTMLElement>('.rs-num').forEach((numEl) => {
    const target = parseInt(numEl.textContent || '0', 10);
    if (!target) return;
    const counter = { v: 0 };
    ScrollTrigger.create({
      trigger: numEl,
      start: 'top 90%',
      once: true,
      onEnter: () =>
        gsap.to(counter, {
          v: target,
          duration: 1.2,
          ease: 'power2.out',
          onUpdate: () => {
            numEl.textContent = String(Math.round(counter.v));
          },
        }),
    });
  });

  /* ---------- Anchor colleges: white marks stagger up ---------- */
  const collegeMarks = gsap.utils.toArray<HTMLElement>('.colleges-marks img');
  if (collegeMarks.length) {
    gsap.from(collegeMarks, {
      scrollTrigger: { trigger: '.colleges', start: 'top 82%', once: true },
      autoAlpha: 0,
      y: 22,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }

  // Recompute trigger positions once fonts/images settle.
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/* ---------- I/O panel lockup: horizontal when the line has room, else vertical ----------
   Keyed to the header's real free width, not a viewport breakpoint, so the mark only stacks
   when the horizontal lockup genuinely would not fit beside the label. Always on. */
const ioHead = document.querySelector<HTMLElement>('.gdg-io-head');
if (ioHead) {
  const label = ioHead.querySelector<HTMLElement>('.gdg-io-label');
  const place = ioHead.querySelector<HTMLElement>('.gdg-io-place');
  if (label && place) {
    const HORIZ_W = 40 * (560 / 70); // horizontal lockup width at its 40px display height
    const GAP = 24; // head column-gap when horizontal (1.5rem)
    const MARGIN = 14; // stay off the exact boundary
    /* Intrinsic (unwrapped) width of the label block, measured with a momentary nowrap so the
       real layout can still wrap the label when it's stacked. */
    const metaWidth = (): number => {
      const a = label.style.whiteSpace;
      const b = place.style.whiteSpace;
      label.style.whiteSpace = place.style.whiteSpace = 'nowrap';
      const w = Math.max(label.scrollWidth, place.scrollWidth);
      label.style.whiteSpace = a;
      place.style.whiteSpace = b;
      return w;
    };
    const decide = () => {
      const fits = HORIZ_W + GAP + metaWidth() + MARGIN <= ioHead.clientWidth;
      ioHead.classList.toggle('io-horiz', fits);
    };
    decide();
    window.addEventListener('resize', decide, { passive: true });
    window.addEventListener('load', decide);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(decide);
  }
}

/* ---------- Scroll progress bar (Google-color, always on) ---------- */
const progress = document.querySelector<HTMLElement>('.scroll-progress');
if (progress) {
  /* Cache the scrollable height so the scroll handler only reads window.scrollY (no layout
     read per scroll = no forced reflow / jank). Recompute on resize and after load. */
  let max = 0;
  const measure = () => {
    max = document.documentElement.scrollHeight - window.innerHeight;
  };
  const update = () => {
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', () => {
    measure();
    update();
  });
  window.addEventListener('load', () => {
    measure();
    update();
  });
  measure();
  update();
}

/* ---------- Track matrix: row + column hover highlight ---------- */
const matrix = document.querySelector<HTMLTableElement>('.track-matrix');
if (matrix) {
  const clear = () =>
    matrix
      .querySelectorAll('.is-row, .is-col')
      .forEach((el) => el.classList.remove('is-row', 'is-col'));
  matrix.addEventListener('pointerover', (e) => {
    const cell = (e.target as HTMLElement).closest('td, th');
    if (!cell || !matrix.contains(cell)) return;
    const row = cell.parentElement as HTMLTableRowElement;
    const colIndex = Array.from(row.children).indexOf(cell);
    clear();
    Array.from(row.children).forEach((c) => c.classList.add('is-row'));
    matrix.querySelectorAll('tr').forEach((tr) => {
      const c = tr.children[colIndex];
      if (c) c.classList.add('is-col');
    });
  });
  matrix.addEventListener('pointerleave', clear);
}

/* ---------- Involvement: pick your level ---------- */
const levels = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-level]'));
const statusEl = document.getElementById('levels-status');
const messages = [
  'Supporter it is. Promotion and a point of contact go a long way.',
  'Contributor. Mentors and a workshop would be huge.',
  "Co-organizer. Let's build this together.",
];
const defaultMsg = 'We would be glad to have MESA at any level.';

levels.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    const wasOn = btn.getAttribute('aria-pressed') === 'true';
    levels.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    if (wasOn) {
      if (statusEl) statusEl.textContent = defaultMsg;
    } else {
      btn.setAttribute('aria-pressed', 'true');
      if (statusEl) statusEl.textContent = messages[i] || defaultMsg;
    }
  });
});

/* ---------- Scope tiers: the dial ----------
   All three tier panels live in the static HTML (so no-JS and crawlers see every tier).
   JS enhances: show the active panel, hide the rest, and recolor per tier. */
const scopeEl = document.querySelector<HTMLElement>('.scope');
const dialBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.dial-btn'));
const thumb = document.getElementById('dial-thumb');
const tierPanels = Array.from(document.querySelectorAll<HTMLElement>('.tier-panel'));
const tierColors = ['var(--blue)', 'var(--green)', 'var(--red)'];
let current = 0;

function paintTier(i: number, animate: boolean): void {
  if (scopeEl) scopeEl.style.setProperty('--tc', tierColors[i] || 'var(--blue)');
  if (thumb) thumb.style.transform = 'translateX(' + i * 100 + '%)';
  dialBtns.forEach((b, bi) => {
    const on = bi === i;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.tabIndex = on ? 0 : -1;
  });
  tierPanels.forEach((p, pi) => {
    p.hidden = pi !== i;
  });

  const active = tierPanels[i];
  if (active && animate && !prefersReduced()) {
    gsap.fromTo(
      active.querySelectorAll('.spec dd, .tier-posture, .tier-funded'),
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power2.out', overwrite: true },
    );
    gsap.fromTo(
      active.querySelector('.tier-count-num'),
      { scale: 0.82 },
      { scale: 1, duration: 0.45, ease: 'power3.out', overwrite: true, transformOrigin: 'left bottom' },
    );
  }
  current = i;
}

if (tierPanels.length) {
  dialBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      if (i !== current) paintTier(i, true);
    });
    btn.addEventListener('keydown', (e: KeyboardEvent) => {
      let next: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tierPanels.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        next = (current - 1 + tierPanels.length) % tierPanels.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tierPanels.length - 1;
      if (next !== null) {
        e.preventDefault();
        paintTier(next, true);
        dialBtns[next].focus();
      }
    });
  });

  paintTier(0, false);
}
