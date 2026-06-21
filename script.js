/* =============================================================
   SWETHA S — PORTFOLIO INTERACTIONS
   =============================================================
   Sections below:
   1. Shared helpers (reduced-motion check)
   2. Mobile navigation toggle
   3. Active nav-link highlighting on scroll
   4. Hero typing effect
   5. Scroll-reveal (fade-in / slide-up) with stagger
   6. Animated skill bars
   7. Animated achievement counters
   8. Cursor-tilt for glass cards (credential + project/research)
   9. Footer year
   ============================================================= */

(function () {
  "use strict";

  /* ---------- 1. Shared helpers ---------- */
  var prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  var isTouchDevice = window.matchMedia("(hover: none)").matches;

  /* ---------- 2. Mobile navigation toggle ---------- */
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.getElementById("navLinks");

  function closeMenu() {
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

    navLinks.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ---------- 3. Active nav-link highlighting ---------- */
  var sections = document.querySelectorAll("main section[id]");
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
            document
              .querySelectorAll(".nav-link.active")
              .forEach(function (l) {
                l.classList.remove("active");
              });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (s) {
      navObserver.observe(s);
    });
  }

  /* ---------- 4. Hero typing effect ---------- */
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
        var charIndex = 0;
        var deleting = false;

        function tick() {
          var current = phrases[phraseIndex];

          if (!deleting) {
            charIndex++;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
              deleting = true;
              setTimeout(tick, 1800);
              return;
            }
            setTimeout(tick, 55);
          } else {
            charIndex--;
            typedEl.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
              deleting = false;
              phraseIndex = (phraseIndex + 1) % phrases.length;
              setTimeout(tick, 300);
              return;
            }
            setTimeout(tick, 28);
          }
        }
        tick();
      })();
    }
  }

  /* ---------- 5. Scroll-reveal with stagger ---------- */
  var staggerGroups = document.querySelectorAll(
    ".skills-grid, .card-grid, .stats-grid, .contact-grid, .timeline, .about-grid"
  );
  staggerGroups.forEach(function (group) {
    var items = group.querySelectorAll(".reveal");
    items.forEach(function (item, i) {
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
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- 6. Animated skill bars ---------- */
  var skillBars = document.querySelectorAll(".skill-bar");

  skillBars.forEach(function (bar) {
    var name = bar.getAttribute("data-skill") || "";
    var level = parseInt(bar.getAttribute("data-level"), 10) || 0;

    var head = document.createElement("div");
    head.className = "skill-bar-head";

    var nameEl = document.createElement("span");
    nameEl.className = "skill-name";
    nameEl.textContent = name;

    var pctEl = document.createElement("span");
    pctEl.className = "skill-pct mono";
    pctEl.textContent = "0%";

    head.appendChild(nameEl);
    head.appendChild(pctEl);

    var track = document.createElement("div");
    track.className = "skill-track";
    var fill = document.createElement("div");
    fill.className = "skill-fill";
    track.appendChild(fill);

    bar.appendChild(head);
    bar.appendChild(track);

    bar._level = level;
    bar._fill = fill;
    bar._pct = pctEl;
  });

  function animateSkillBar(bar) {
    var level = bar._level;
    bar._fill.style.width = level + "%";

    if (prefersReducedMotion) {
      bar._pct.textContent = level + "%";
      return;
    }

    var start = null;
    var duration = 1100;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      bar._pct.textContent = Math.round(progress * level) + "%";
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var skillObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateSkillBar(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    skillBars.forEach(function (bar) {
      skillObserver.observe(bar);
    });
  } else {
    skillBars.forEach(animateSkillBar);
  }

  /* ---------- 7. Animated achievement counters ---------- */
  var statNumbers = document.querySelectorAll(".stat-number");

  function animateCount(el) {
    if (el.hasAttribute("data-static")) {
      el.textContent = el.getAttribute("data-static");
      return;
    }
    var target = parseFloat(el.getAttribute("data-count"));
    var isDecimal = el.getAttribute("data-decimal") === "true";

    if (prefersReducedMotion || isNaN(target)) {
      el.textContent = isDecimal ? target.toFixed(1) : String(target);
      return;
    }

    var start = null;
    var duration = 1200;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var current = progress * target;
      el.textContent = isDecimal
        ? current.toFixed(1)
        : Math.round(current).toString();
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = isDecimal ? target.toFixed(1) : String(target);
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
    statNumbers.forEach(function (el) {
      statObserver.observe(el);
    });
  } else {
    statNumbers.forEach(animateCount);
  }

  /* ---------- 8. Cursor-tilt for glass cards ---------- */
  if (!prefersReducedMotion && !isTouchDevice) {
    var tiltCards = document.querySelectorAll(".tilt-card");

    tiltCards.forEach(function (card) {
      var bounds;

      card.addEventListener("mouseenter", function () {
        bounds = card.getBoundingClientRect();
      });

      card.addEventListener("mousemove", function (e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        var x = (e.clientX - bounds.left) / bounds.width - 0.5;
        var y = (e.clientY - bounds.top) / bounds.height - 0.5;
        var rotateY = x * 14;
        var rotateX = y * -14;
        card.style.transform =
          "perspective(1000px) rotateX(" +
          rotateX.toFixed(2) +
          "deg) rotateY(" +
          rotateY.toFixed(2) +
          "deg) translateY(-4px)";
      });

      card.addEventListener("mouseleave", function () {
        card.style.transform =
          "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
      });
    });
  }

  /* ---------- 9. Footer year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();
