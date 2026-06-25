/* =============================================================
   SWETHA S — PORTFOLIO INTERACTIONS  (Production v2)
   =============================================================
   Sections:
   1. Shared helpers
   2. Mobile navigation
   3. Active nav-link on scroll
   4. Hero typing effect
   5. Scroll-reveal with stagger
   6. Animated achievement counters
   7. Cursor-tilt for glass cards
   8. Footer year
   ============================================================= */

(function () {
  "use strict";

  /* ── 1. Shared helpers ─────────────────────────────────────── */
  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isTouchDevice        = window.matchMedia("(hover: none)").matches;

  /* ── 2. Mobile navigation toggle ───────────────────────────── */
  var navToggle = document.getElementById("navToggle");
  var navLinks  = document.getElementById("navLinks");

  function closeMenu() {
    if (!navToggle || !navLinks) return;
    navToggle.classList.remove("is-open");
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var willOpen = !navLinks.classList.contains("is-open");
      navToggle.classList.toggle("is-open", willOpen);
      navLinks.classList.toggle("is-open", willOpen);
      navToggle.setAttribute("aria-expanded", String(willOpen));
    });

    /* Close on any nav-link click */
    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });

    /* Close when user clicks outside the nav */
    document.addEventListener("click", function (e) {
      if (!navLinks.contains(e.target) && !navToggle.contains(e.target)) {
        closeMenu();
      }
    });

    /* Close on Escape key */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ── 3. Active nav-link highlighting on scroll ─────────────── */
  var sections   = document.querySelectorAll("main section[id]");
  var navLinkMap = {};
  document.querySelectorAll(".nav-link").forEach(function (link) {
    var id = link.getAttribute("href").replace("#", "");
    navLinkMap[id] = link;
  });

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = navLinkMap[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            document.querySelectorAll(".nav-link.active").forEach(function (l) {
              l.classList.remove("active");
            });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { navObserver.observe(s); });
  }

  /* ── 4. Hero typing effect ─────────────────────────────────── */
  var typedEl = document.getElementById("typedRole");
  var phrases = [
    "Java Developer.",
    "Python Engineer.",
    "Full-Stack Web Developer.",
    "Oracle Certified Java SE 17 Developer."
  ];

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = phrases[0];
    } else {
      (function typeLoop() {
        var phraseIndex = 0;
        var charIndex   = 0;
        var deleting    = false;

        function tick() {
          var current = phrases[phraseIndex];

          if (!deleting) {
            charIndex++;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
              deleting = true;
              setTimeout(tick, 2000);
              return;
            }
            setTimeout(tick, 55);
          } else {
            charIndex--;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
              deleting    = false;
              phraseIndex = (phraseIndex + 1) % phrases.length;
              setTimeout(tick, 350);
              return;
            }
            setTimeout(tick, 28);
          }
        }
        tick();
      })();
    }
  }

  /* ── 5. Scroll-reveal with stagger ────────────────────────── */
  /* Add stagger delay to children of grid/list containers */
  var staggerParents = document.querySelectorAll(
    ".skills-grid, .card-grid, .stats-grid, .contact-grid, .about-grid"
  );
  staggerParents.forEach(function (parent) {
    parent.querySelectorAll(".reveal").forEach(function (item, i) {
      item.style.transitionDelay = Math.min(i * 80, 320) + "ms";
    });
  });

  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ── 6. Animated achievement counters ─────────────────────── */
  var statNumbers = document.querySelectorAll(".stat-number");

  function animateCount(el) {
    if (el.hasAttribute("data-static")) {
      el.textContent = el.getAttribute("data-static");
      return;
    }
    var target    = parseFloat(el.getAttribute("data-count"));
    var isDecimal = el.getAttribute("data-decimal") === "true";

    if (prefersReducedMotion || isNaN(target)) {
      el.textContent = isDecimal ? target.toFixed(1) : String(target);
      return;
    }

    var start    = null;
    var duration = 1300;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      /* Ease-out cubic */
      var eased    = 1 - Math.pow(1 - progress, 3);
      var current  = eased * target;
      el.textContent = isDecimal ? current.toFixed(1) : Math.round(current).toString();
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isDecimal ? target.toFixed(1) : String(target);
      }
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    statNumbers.forEach(function (el) { statObserver.observe(el); });
  } else {
    statNumbers.forEach(animateCount);
  }

  /* ── 7. Cursor-tilt for glass cards ───────────────────────── */
  if (!prefersReducedMotion && !isTouchDevice) {
    var tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach(function (card) {
      var bounds = null;

      card.addEventListener("mouseenter", function () {
        bounds = card.getBoundingClientRect();
      });

      card.addEventListener("mousemove", function (e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var x       = (e.clientX - bounds.left)  / bounds.width  - 0.5;
        var y       = (e.clientY - bounds.top)   / bounds.height - 0.5;
        var rotateY = x * 12;
        var rotateX = y * -12;
        card.style.transform =
          "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" +
          rotateY.toFixed(2) + "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ── 8. Footer year ────────────────────────────────────────── */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
