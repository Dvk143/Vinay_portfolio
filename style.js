const body = document.body;
const themeToggle = document.getElementById("theme-toggle");
const toggleLabel = document.querySelector(".toggle-label");
const revealItems = document.querySelectorAll("[data-reveal]");
const navLinks = document.querySelectorAll(".main-nav a");
const statNumbers = document.querySelectorAll(".stat-number");
const heroVisual = document.querySelector(".hero-visual");

const setTheme = (mode) => {
    const isLight = mode === "light";
    body.classList.toggle("light-mode", isLight);
    if (toggleLabel) {
        toggleLabel.textContent = isLight ? "Daylight" : "Midnight";
    }
    localStorage.setItem("portfolio-theme", mode);
};

const storedTheme = localStorage.getItem("portfolio-theme");
setTheme(storedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
    const nextTheme = body.classList.contains("light-mode") ? "dark" : "light";
    setTheme(nextTheme);
});

revealItems.forEach((item) => {
    item.classList.add("revealed");
});

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.16,
        rootMargin: "0px 0px -40px 0px",
    }
);

revealItems.forEach((item) => {
    item.classList.remove("revealed");
    revealObserver.observe(item);
});

const countObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            const element = entry.target;
            const target = Number(element.dataset.count || 0);
            const duration = 1100;
            const start = performance.now();

            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                element.textContent = Math.floor(progress * target).toString();
                if (progress < 1) {
                    requestAnimationFrame(tick);
                } else {
                    element.textContent = target.toString();
                }
            };

            requestAnimationFrame(tick);
            countObserver.unobserve(element);
        });
    },
    { threshold: 0.5 }
);

statNumbers.forEach((number) => countObserver.observe(number));

const sectionObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            const id = entry.target.getAttribute("id");
            if (!id) {
                return;
            }

            const matchingLink = document.querySelector(`.main-nav a[href="#${id}"]`);
            if (matchingLink && entry.isIntersecting) {
                navLinks.forEach((link) => link.classList.remove("is-active"));
                matchingLink.classList.add("is-active");
            }
        });
    },
    {
        threshold: 0.45,
    }
);

document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
});

if (heroVisual && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener("pointermove", (event) => {
        const { innerWidth, innerHeight } = window;
        const moveX = (event.clientX / innerWidth - 0.5) * 14;
        const moveY = (event.clientY / innerHeight - 0.5) * 10;
        heroVisual.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
}
