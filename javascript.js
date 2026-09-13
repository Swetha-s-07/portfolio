const LINKEDIN_URL = "https://www.linkedin.com/in/swetha-s-swetha/"; // Add your actual LinkedIn profile URL here.
const GITHUB_URL = "https://github.com/Swetha-s-07";   // Add your actual GitHub profile URL here.

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const themeLabel = document.getElementById("themeLabel");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

/* =========================
   THEME SWITCHER
========================= */

function applyTheme(theme) {
  const isLight = theme === "light-blue";

  body.classList.toggle("light-blue", isLight);

  themeLabel.textContent = isLight
    ? "Black & White"
    : "Light Blue";

  themeToggle.setAttribute(
    "aria-label",
    isLight
      ? "Switch to Black & White theme"
      : "Switch to Light Blue & White theme"
  );

  localStorage.setItem("portfolio-theme", theme);
}

// Load saved theme
const savedTheme =
  localStorage.getItem("portfolio-theme") || "black-white";

applyTheme(savedTheme);

// Toggle theme
themeToggle.addEventListener("click", () => {
  const nextTheme = body.classList.contains("light-blue")
    ? "black-white"
    : "light-blue";

  applyTheme(nextTheme);
});

/* =========================
   MOBILE MENU
========================= */

menuToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");

  menuToggle.setAttribute(
    "aria-expanded",
    String(isOpen)
  );
});

// Close mobile menu after clicking a navigation link
const navigationLinks = navMenu.querySelectorAll("a");

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");

    menuToggle.setAttribute(
      "aria-expanded",
      "false"
    );
  });
});

/* =========================
   LINKEDIN / GITHUB
========================= */

const missingLinks =
  document.querySelectorAll(".missing-link");

missingLinks.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonText = button.textContent.toLowerCase();

    // LinkedIn
    if (buttonText.includes("linkedin")) {
      if (LINKEDIN_URL.trim() !== "") {
        window.open(
          LINKEDIN_URL,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        window.alert(
          "LinkedIn profile URL is not available. Add your actual LinkedIn URL in JavaScript.js."
        );
      }

      return;
    }

    // GitHub
    if (buttonText.includes("github")) {
      if (GITHUB_URL.trim() !== "") {
        window.open(
          GITHUB_URL,
          "_blank",
          "noopener,noreferrer"
        );
      } else {
        window.alert(
          "GitHub profile URL is not available. Add your actual GitHub URL in JavaScript.js."
        );
      }
    }
  });
});

/* =========================
   ACTIVE NAVIGATION
========================= */

const sections =
  document.querySelectorAll("main section[id]");

const navLinks =
  document.querySelectorAll(".nav-menu a");

const sectionObserver =
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        navLinks.forEach((link) => {
          const targetId =
            link.getAttribute("href");

          link.classList.toggle(
            "active",
            targetId === `#${entry.target.id}`
          );
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px"
    }
  );

sections.forEach((section) => {
  sectionObserver.observe(section);
});

/* =========================
   SCROLL REVEAL ANIMATION
========================= */

const revealElements =
  document.querySelectorAll(".reveal");

const revealObserver =
  new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("visible");

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08
    }
  );

revealElements.forEach((element) => {
  revealObserver.observe(element);
});

/* =========================
   FOOTER YEAR
========================= */

const yearElement =
  document.getElementById("year");

if (yearElement) {
  yearElement.textContent =
    new Date().getFullYear();
}
