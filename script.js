/* =========================================================
   SWETHA S - PROFESSIONAL PORTFOLIO
   Main JavaScript
========================================================= */

"use strict";


/* =========================================================
   1. DOM ELEMENTS
========================================================= */

const body = document.body;

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

const navLinks = document.querySelectorAll(".nav-link");

const sections = document.querySelectorAll("main section[id]");

const siteHeader = document.getElementById("site-header");


/* =========================================================
   2. THEME MANAGEMENT
========================================================= */

const THEME_STORAGE_KEY = "swetha-portfolio-theme";


/*
    Apply selected theme
*/
function applyTheme(theme) {

    if (theme === "dark") {

        body.setAttribute("data-theme", "dark");

        if (themeIcon) {
            themeIcon.textContent = "☀";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                "Switch to light theme"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to light theme"
            );
        }

    } else {

        body.setAttribute("data-theme", "light");

        if (themeIcon) {
            themeIcon.textContent = "☾";
        }

        if (themeToggle) {
            themeToggle.setAttribute(
                "aria-label",
                "Switch to dark theme"
            );

            themeToggle.setAttribute(
                "title",
                "Switch to dark theme"
            );
        }
    }
}


/*
    Get saved theme.
    If there is no saved theme, use light theme.
*/
function initializeTheme() {

    const savedTheme =
        localStorage.getItem(THEME_STORAGE_KEY);

    const initialTheme =
        savedTheme === "dark"
            ? "dark"
            : "light";

    applyTheme(initialTheme);
}


/*
    Theme toggle click
*/
if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        const currentTheme =
            body.getAttribute("data-theme");

        const newTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        applyTheme(newTheme);

        localStorage.setItem(
            THEME_STORAGE_KEY,
            newTheme
        );

    });

}


/* Initialize theme immediately */
initializeTheme();


/* =========================================================
   3. MOBILE NAVIGATION
========================================================= */


/*
    Open / close mobile menu
*/
function toggleMobileMenu() {

    if (!menuToggle || !navMenu) {
        return;
    }

    const isOpen =
        menuToggle.classList.toggle("active");

    navMenu.classList.toggle(
        "active",
        isOpen
    );

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.setAttribute(
        "aria-label",
        isOpen
            ? "Close navigation menu"
            : "Open navigation menu"
    );
}


/*
    Mobile menu button
*/
if (menuToggle) {

    menuToggle.addEventListener(
        "click",
        toggleMobileMenu
    );

}


/* =========================================================
   4. CLOSE MOBILE MENU
========================================================= */

function closeMobileMenu() {

    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.classList.remove("active");

    navMenu.classList.remove("active");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );
}


/*
    Close menu when navigation link is clicked
*/
navLinks.forEach((link) => {

    link.addEventListener(
        "click",
        () => {

            closeMobileMenu();

        }
    );

});


/*
    Close menu when user clicks outside it
*/
document.addEventListener(
    "click",
    (event) => {

        if (!menuToggle || !navMenu) {
            return;
        }

        const clickedInsideMenu =
            navMenu.contains(event.target);

        const clickedMenuButton =
            menuToggle.contains(event.target);

        if (
            navMenu.classList.contains("active") &&
            !clickedInsideMenu &&
            !clickedMenuButton
        ) {

            closeMobileMenu();

        }

    }
);


/*
    Close menu with Escape key
*/
document.addEventListener(
    "keydown",
    (event) => {

        if (event.key === "Escape") {

            closeMobileMenu();

            if (themeToggle) {
                themeToggle.blur();
            }
        }

    }
);


/* =========================================================
   5. ACTIVE NAVIGATION
========================================================= */


/*
    Highlight the navigation item
    belonging to the current section.
*/
function updateActiveNavigation() {

    if (!sections.length || !navLinks.length) {
        return;
    }

    const currentScrollPosition =
        window.scrollY + 180;

    let currentSectionId = "home";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop;

        const sectionHeight =
            section.offsetHeight;

        if (
            currentScrollPosition >= sectionTop &&
            currentScrollPosition <
                sectionTop + sectionHeight
        ) {

            currentSectionId =
                section.id;
        }

    });


    navLinks.forEach((link) => {

        const targetId =
            link.getAttribute("href");

        link.classList.toggle(
            "active",
            targetId === `#${currentSectionId}`
        );

    });

}


/*
    Run on scroll
*/
window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
);


/*
    Run once after page loads
*/
window.addEventListener(
    "load",
    updateActiveNavigation
);


/* =========================================================
   6. STICKY HEADER EFFECT
========================================================= */


/*
    Adds a small shadow when the user
    has moved away from the top.
*/
function updateHeaderState() {

    if (!siteHeader) {
        return;
    }

    if (window.scrollY > 20) {

        siteHeader.classList.add(
            "scrolled"
        );

    } else {

        siteHeader.classList.remove(
            "scrolled"
        );

    }

}


window.addEventListener(
    "scroll",
    updateHeaderState,
    { passive: true }
);

updateHeaderState();


/* =========================================================
   7. SMOOTH INTERNAL NAVIGATION
========================================================= */


/*
    Handle internal anchor navigation manually.
    This gives us consistent behavior with
    the fixed header.
*/
document.querySelectorAll(
    'a[href^="#"]'
).forEach((link) => {

    link.addEventListener(
        "click",
        (event) => {

            const targetSelector =
                link.getAttribute("href");

            if (
                !targetSelector ||
                targetSelector === "#"
            ) {
                return;
            }

            const targetElement =
                document.querySelector(
                    targetSelector
                );

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            const headerHeight =
                siteHeader
                    ? siteHeader.offsetHeight
                    : 0;

            const targetPosition =
                targetElement.getBoundingClientRect().top +
                window.scrollY -
                headerHeight -
                15;

            window.scrollTo({
                top: targetPosition,
                behavior: "smooth"
            });

            closeMobileMenu();

        }
    );

});


/* =========================================================
   8. SCROLL REVEAL ANIMATION
========================================================= */


/*
    Add reveal classes dynamically so the HTML
    does not become unnecessarily complicated.
*/

const revealElements = document.querySelectorAll(
    ".section-heading, " +
    ".about-content, " +
    ".snapshot-card, " +
    ".skill-card, " +
    ".project-card, " +
    ".certification-card, " +
    ".education-item, " +
    ".conference-card, " +
    ".soft-skills-wrapper, " +
    ".contact-intro, " +
    ".contact-card"
);


/*
    Create animation CSS dynamically.
    This keeps animation behavior in one place.
*/
const revealStyle =
    document.createElement("style");

revealStyle.textContent = `
    .js-reveal {
        opacity: 0;
        transform: translateY(24px);
        transition:
            opacity 0.7s ease,
            transform 0.7s ease;
    }

    .js-reveal.is-visible {
        opacity: 1;
        transform: translateY(0);
    }

    .site-header.scrolled {
        box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.08);
    }

    [data-theme="dark"] .site-header.scrolled {
        box-shadow:
            0 8px 30px rgba(0, 0, 0, 0.28);
    }

    @media (prefers-reduced-motion: reduce) {

        .js-reveal {
            opacity: 1;
            transform: none;
            transition: none;
        }

    }
`;

document.head.appendChild(
    revealStyle
);


/*
    Give each element the reveal class.
*/
revealElements.forEach(
    (element) => {

        element.classList.add(
            "js-reveal"
        );

    }
);


/*
    Intersection Observer
*/
if ("IntersectionObserver" in window) {

    const revealObserver =
        new IntersectionObserver(
            (entries, observer) => {

                entries.forEach(
                    (entry) => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "is-visible"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    }
                );

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );


    revealElements.forEach(
        (element) => {

            revealObserver.observe(
                element
            );

        }
    );

} else {

    /*
        Fallback for browsers without
        IntersectionObserver.
    */
    revealElements.forEach(
        (element) => {

            element.classList.add(
                "is-visible"
            );

        }
    );

}


/* =========================================================
   9. PROJECT CARD INTERACTION
========================================================= */


/*
    Prevent placeholder links from behaving
    like real links.
*/
document.querySelectorAll(
    ".placeholder-link"
).forEach((placeholder) => {

    placeholder.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

        }
    );

});


/* =========================================================
   10. WINDOW RESIZE
========================================================= */


/*
    Close mobile menu if the screen becomes
    desktop-sized.
*/
window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 768
        ) {

            closeMobileMenu();

        }

        updateActiveNavigation();

    }
);


/* =========================================================
   11. IMAGE ERROR HANDLING
========================================================= */


/*
    Show a graceful fallback if the
    profile image cannot be loaded.
*/
const profileImage =
    document.querySelector(
        ".hero-image"
    );

if (profileImage) {

    profileImage.addEventListener(
        "error",
        () => {

            profileImage.style.display =
                "none";

            const imageFrame =
                profileImage.parentElement;

            if (imageFrame) {

                imageFrame.setAttribute(
                    "data-image-error",
                    "true"
                );

                imageFrame.insertAdjacentHTML(
                    "beforeend",
                    `
                    <div
                        style="
                            min-height: 420px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            text-align: center;
                            padding: 30px;
                            color: var(--text-secondary);
                            font-size: 13px;
                        "
                    >
                        Profile image could not be loaded.
                    </div>
                    `
                );

            }

        }
    );

}


/* =========================================================
   12. INITIAL PAGE STATE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
            Ensure the page starts from the top
            when loaded without a hash.
        */
        if (!window.location.hash) {

            window.scrollTo({
                top: 0,
                behavior: "auto"
            });

        }

        updateActiveNavigation();
        updateHeaderState();

    }
);
