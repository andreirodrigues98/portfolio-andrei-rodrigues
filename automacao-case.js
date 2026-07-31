(() => {
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxTitle = document.querySelector("#lightboxTitle");
  const closeButton = document.querySelector(".lightbox__close");
  const navigationLinks = document.querySelectorAll('.nav-link[href^="#"]');

  function closeLightbox() {
    if (!lightbox?.open) return;

    lightbox.close();
    document.body.classList.remove("lightbox-open");
  }

  document.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxTitle) return;

      const image = card.dataset.full;
      const title = card.dataset.title || "Imagem do projeto de automação";

      if (!image) return;

      lightboxImage.src = image;
      lightboxImage.alt = `Visualização ampliada: ${title}`;
      lightboxTitle.textContent = title;
      lightbox.showModal();
      document.body.classList.add("lightbox-open");
    });
  });

  closeButton?.addEventListener("click", closeLightbox);

  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  lightbox?.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");

    if (lightboxImage) {
      lightboxImage.src = "";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeLightbox();
    }
  });

  const observedSections = [...navigationLinks]
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && observedSections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          navigationLinks.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("is-active", isCurrent);
          });
        });
      },
      {
        rootMargin: "-35% 0px -55% 0px",
        threshold: 0,
      }
    );

    observedSections.forEach((section) => observer.observe(section));
  }
})();
