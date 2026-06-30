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
  '.section .eyebrow, .big-statement, .section-title, .section-lede, ' +
  '.hack-lead, .hack-subhead, .qa-grid, .fmt-grid, .mlh-benefits, .mlh-status, ' +
  '.why-body, .why-cards, .facts, .levels, .levels-status, .mesa-track, ' +
  '.podium, .track-cards, .track-matrix, .dial, .tier-panel, .scope-foot, ' +
  '.reach-stats, .reach-strategy, .roster, ' +
  '.anchor-card, .fund-list, .fund-foot, .ask-steps, .ask-cta';

if (motion) {
  /* ---------- Lenis smooth scroll, driven by the GSAP ticker ---------- */
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

/* ---------- Scroll progress bar (Google-color, always on) ---------- */
const progress = document.querySelector<HTMLElement>('.scroll-progress');
if (progress) {
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(window.scrollY / max, 1) : 0})`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
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

/* ---------- Scope tiers: the dial ---------- */
interface Tier {
  color: string;
  posture: string;
  funded: string;
  count: string;
  venue: string;
  food: string;
  prizes: string;
  prog: string;
}

const tiers: Tier[] = [
  {
    color: 'var(--blue)',
    posture: 'The smallest strong event',
    funded: 'Underwritten by the GDG supplement on its own.',
    count: '25–50',
    venue: 'One campus room',
    food: 'Snacks and a meal',
    prizes: 'Modest, swag and gift cards',
    prog: 'Kickoff and judging',
  },
  {
    color: 'var(--green)',
    posture: 'Our target event',
    funded: 'GDG supplement, plus some sponsorship.',
    count: '50–125',
    venue: 'A larger campus space',
    food: 'Catered meals',
    prizes: 'Solid cash and hardware',
    prog: 'Workshops and mentors',
  },
  {
    color: 'var(--red)',
    posture: 'If the sponsorship lands',
    funded: 'GDG supplement, strong sponsorship, and partners.',
    count: '125+',
    venue: 'Large or multi-campus',
    food: 'Full catering',
    prizes: 'Strong cash and sponsor prizes',
    prog: 'Named tracks and speakers',
  },
];

const scopeEl = document.querySelector<HTMLElement>('.scope');
const dialBtns = Array.from(document.querySelectorAll<HTMLButtonElement>('.dial-btn'));
const thumb = document.getElementById('dial-thumb');
const panel = document.getElementById('tier-panel');
const els = {
  posture: document.getElementById('tier-posture'),
  funded: document.getElementById('tier-funded'),
  count: document.getElementById('tier-count'),
  venue: document.getElementById('spec-venue'),
  food: document.getElementById('spec-food'),
  prizes: document.getElementById('spec-prizes'),
  prog: document.getElementById('spec-prog'),
};
let current = 0;

function paint(i: number, animate: boolean): void {
  const t = tiers[i];
  if (scopeEl) scopeEl.style.setProperty('--tc', t.color);
  if (thumb) thumb.style.transform = 'translateX(' + i * 100 + '%)';
  dialBtns.forEach((b, bi) => {
    const on = bi === i;
    b.classList.toggle('is-active', on);
    b.setAttribute('aria-selected', on ? 'true' : 'false');
    b.tabIndex = on ? 0 : -1;
  });
  if (panel) panel.setAttribute('aria-labelledby', 'tab-' + i);

  const fill = () => {
    if (els.posture) els.posture.textContent = t.posture;
    if (els.funded) els.funded.textContent = t.funded;
    if (els.count) els.count.textContent = t.count;
    if (els.venue) els.venue.textContent = t.venue;
    if (els.food) els.food.textContent = t.food;
    if (els.prizes) els.prizes.textContent = t.prizes;
    if (els.prog) els.prog.textContent = t.prog;
  };

  if (animate && !prefersReduced()) {
    fill();
    gsap.fromTo(
      '#tier-panel .spec dd, #tier-posture, #tier-funded',
      { autoAlpha: 0, y: 8 },
      { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.045, ease: 'power2.out', overwrite: true },
    );
    gsap.fromTo(
      '#tier-count',
      { scale: 0.82 },
      { scale: 1, duration: 0.45, ease: 'power3.out', overwrite: true, transformOrigin: 'left bottom' },
    );
  } else {
    fill();
  }
  current = i;
}

dialBtns.forEach((btn, i) => {
  btn.addEventListener('click', () => {
    if (i !== current) paint(i, true);
  });
  btn.addEventListener('keydown', (e: KeyboardEvent) => {
    let next: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (current + 1) % tiers.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
      next = (current - 1 + tiers.length) % tiers.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = tiers.length - 1;
    if (next !== null) {
      e.preventDefault();
      paint(next, true);
      dialBtns[next].focus();
    }
  });
});

paint(0, false);
