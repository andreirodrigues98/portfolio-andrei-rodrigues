(() => {
  const feedback = document.querySelector("#copyFeedback");
  const copyButtons = document.querySelectorAll("[data-copy]");

  async function copyValue(button) {
    const value = button.dataset.copy || "";

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const input = document.createElement("textarea");
      input.value = value;
      input.setAttribute("readonly", "");
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }

    copyButtons.forEach((item) => {
      item.classList.remove("is-copied");
      item.textContent = "Copiar";
    });

    button.classList.add("is-copied");
    button.textContent = "Copiado";
    if (feedback) feedback.textContent = "Informação copiada para a área de transferência.";

    window.setTimeout(() => {
      button.classList.remove("is-copied");
      button.textContent = "Copiar";
      if (feedback) feedback.textContent = "";
    }, 2200);
  }

  copyButtons.forEach((button) => {
    button.addEventListener("click", () => copyValue(button));
  });

  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxTitle = document.querySelector("#lightboxTitle");
  const closeButton = document.querySelector(".lightbox__close");

  function closeLightbox() {
    if (!lightbox?.open) return;
    lightbox.close();
    document.body.classList.remove("lightbox-open");
  }

  document.querySelectorAll(".gallery-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (!lightbox || !lightboxImage || !lightboxTitle) return;

      const image = card.dataset.full;
      const title = card.dataset.title || "Tela do RodaPay";
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
    const bounds = lightbox.getBoundingClientRect();
    const clickedOutside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;

    if (clickedOutside) closeLightbox();
  });

  lightbox?.addEventListener("close", () => {
    document.body.classList.remove("lightbox-open");
    if (lightboxImage) lightboxImage.src = "";
  });
})();
