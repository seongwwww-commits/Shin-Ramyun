const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const navLinks = mainNav ? mainNav.querySelectorAll("a") : [];
const localDefaultImage = document.getElementById("localDefaultImage");
const heroImage = document.getElementById("heroImage");
const heroImagePath = document.getElementById("heroImagePath");

function parseCandidates(raw) {
  if (!raw) return [];
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function resolveFirstAvailableImage(imgElement, options = {}) {
  if (!imgElement) return;

  const candidates = parseCandidates(imgElement.dataset.candidates);
  const fallback = imgElement.getAttribute("src");
  const allCandidates = [...new Set([fallback, ...candidates])];
  let currentIndex = 0;

  const tryNext = () => {
    if (currentIndex >= allCandidates.length) return;
    imgElement.src = allCandidates[currentIndex];
    currentIndex += 1;
  };

  imgElement.addEventListener("error", tryNext);
  imgElement.addEventListener("load", () => {
    if (typeof options.onResolved === "function") {
      options.onResolved(imgElement.currentSrc || imgElement.src);
    }
  });

  tryNext();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (mainNav && mainNav.classList.contains("open")) {
      mainNav.classList.remove("open");
    }
  });
});

resolveFirstAvailableImage(heroImage, {
  onResolved: (resolvedSrc) => {
    if (heroImagePath) {
      const path = resolvedSrc.startsWith(window.location.origin)
        ? resolvedSrc.replace(`${window.location.origin}/`, "")
        : resolvedSrc;
      heroImagePath.textContent = path;
    }
  }
});

resolveFirstAvailableImage(localDefaultImage);

const revealNodes = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -8% 0px"
    }
  );

  revealNodes.forEach((node) => revealObserver.observe(node));
} else {
  revealNodes.forEach((node) => node.classList.add("is-visible"));
}
