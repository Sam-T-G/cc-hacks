/* CC Hacks — MESA proposal interactions */
(function () {
  "use strict";
  document.body.classList.add("js");

  /* ---------- Scroll reveals ---------- */
  var revealTargets = document.querySelectorAll(
    ".section .eyebrow, .big-statement, .section-title, .section-lede, " +
    ".hack-lead, .hack-subhead, .qa-grid, .fmt-grid, .mlh-benefits, .mlh-status, " +
    ".why-body, .why-cards, .facts, .levels, .levels-status, .mesa-track, .dial, " +
    ".tier-panel, .scope-foot, .anchor-card, .fund-list, .fund-foot, .ask-steps, .ask-cta"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Involvement: pick your level ---------- */
  var levels = Array.prototype.slice.call(document.querySelectorAll("[data-level]"));
  var statusEl = document.getElementById("levels-status");
  var messages = [
    "Supporter it is. Promotion and a point of contact go a long way.",
    "Contributor. Mentors and a workshop would be huge.",
    "Co-organizer. Let's build this together."
  ];
  var defaultMsg = "We would be glad to have MESA at any level.";

  levels.forEach(function (btn, i) {
    btn.addEventListener("click", function () {
      var wasOn = btn.getAttribute("aria-pressed") === "true";
      levels.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      if (wasOn) {
        if (statusEl) statusEl.textContent = defaultMsg;
      } else {
        btn.setAttribute("aria-pressed", "true");
        if (statusEl) statusEl.textContent = messages[i] || defaultMsg;
      }
    });
  });

  /* ---------- Scope tiers: the dial ---------- */
  var tiers = [
    {
      color: "var(--blue)",
      posture: "The smallest strong event",
      funded: "Underwritten by the GDG supplement on its own.",
      count: "50–80",
      venue: "One campus room",
      food: "Snacks and a meal",
      prizes: "Modest, swag and gift cards",
      prog: "Kickoff and judging"
    },
    {
      color: "var(--green)",
      posture: "Our target event",
      funded: "GDG supplement, plus some sponsorship.",
      count: "100–150",
      venue: "A larger campus space",
      food: "Catered meals",
      prizes: "Solid cash and hardware",
      prog: "Workshops and mentors"
    },
    {
      color: "var(--red)",
      posture: "If the sponsorship lands",
      funded: "GDG supplement, strong sponsorship, and partners.",
      count: "150–250+",
      venue: "Large or multi-campus",
      food: "Full catering",
      prizes: "Strong cash and sponsor prizes",
      prog: "Named tracks and speakers"
    }
  ];

  var scopeEl = document.querySelector(".scope");
  var dialBtns = Array.prototype.slice.call(document.querySelectorAll(".dial-btn"));
  var thumb = document.getElementById("dial-thumb");
  var panel = document.getElementById("tier-panel");
  var els = {
    posture: document.getElementById("tier-posture"),
    funded: document.getElementById("tier-funded"),
    count: document.getElementById("tier-count"),
    venue: document.getElementById("spec-venue"),
    food: document.getElementById("spec-food"),
    prizes: document.getElementById("spec-prizes"),
    prog: document.getElementById("spec-prog")
  };
  var current = 0;
  var swapTimer = null;

  function paint(i) {
    var t = tiers[i];
    if (scopeEl) scopeEl.style.setProperty("--tc", t.color);
    if (thumb) thumb.style.transform = "translateX(" + (i * 100) + "%)";
    dialBtns.forEach(function (b, bi) {
      var on = bi === i;
      b.classList.toggle("is-active", on);
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
    });
    if (panel) panel.setAttribute("aria-labelledby", "tab-" + i);

    function fill() {
      els.posture.textContent = t.posture;
      els.funded.textContent = t.funded;
      els.count.textContent = t.count;
      els.venue.textContent = t.venue;
      els.food.textContent = t.food;
      els.prizes.textContent = t.prizes;
      els.prog.textContent = t.prog;
    }

    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (panel && !reduce) {
      panel.classList.add("is-swapping");
      clearTimeout(swapTimer);
      swapTimer = setTimeout(function () {
        fill();
        panel.classList.remove("is-swapping");
      }, 180);
    } else {
      fill();
    }
    current = i;
  }

  dialBtns.forEach(function (btn, i) {
    btn.addEventListener("click", function () { if (i !== current) paint(i); });
    btn.addEventListener("keydown", function (e) {
      var next = null;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (current + 1) % tiers.length;
      else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (current - 1 + tiers.length) % tiers.length;
      else if (e.key === "Home") next = 0;
      else if (e.key === "End") next = tiers.length - 1;
      if (next !== null) {
        e.preventDefault();
        paint(next);
        dialBtns[next].focus();
      }
    });
  });

  paint(0);
})();
