/* Portfólio Maillon Andrade — navegação, acessibilidade e efeitos discretos */
(() => {
  "use strict";

  const toggle = document.getElementById("mobile-toggle");
  const menu = document.getElementById("mobile-menu");
  const progress = document.getElementById("scroll-progress");
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  function closeMenu() {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    menu.hidden = true;
  }

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const willOpen = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(willOpen));
      toggle.setAttribute("aria-label", willOpen ? "Fechar menu" : "Abrir menu");
      menu.hidden = !willOpen;
    });

    menu.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", event => {
      if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) {
        closeMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeMenu();
    }, { passive: true });
  }

  // Pequeno indicador de leitura — sem efeitos sobre o conteúdo.
  if (progress) {
    let scheduled = false;
    const paintProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0;
      progress.style.width = pct + "%";
      scheduled = false;
    };
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(paintProgress);
    }, { passive: true });
    window.addEventListener("resize", paintProgress, { passive: true });
    paintProgress();
  }

  const navLinks = [...document.querySelectorAll(".nav-links .nav-link")];
  const ids = ["inicio", "sobre", "tecnologias", "projetos", "jornada"];
  if ("IntersectionObserver" in window && navLinks.length) {
    const activeObserver = new IntersectionObserver((entries) => {
      const active = entries.filter(entry => entry.isIntersecting);
      if (!active.length) return;
      active.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const id = active[0].target.id;
      navLinks.forEach(link => {
        const selected = link.getAttribute("href") === "#" + id;
        link.classList.toggle("active", selected);
        if (selected) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-20% 0px -56% 0px", threshold: [0, 0.1, 0.5] });

    ids.forEach(id => {
      const section = document.getElementById(id);
      if (section) activeObserver.observe(section);
    });
  }

  // Mostra tudo por padrão; só ativa a revelação quando há suporte e movimento permitido.
  const media = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  if (!("IntersectionObserver" in window) || (media && media.matches)) return;

  const selectors = [
    ".section-intro", ".about-aside", ".section-header",
    ".technology", ".project-card", ".journey-panel",
    ".contact-content", ".contact-actions", ".highlight"
  ];
  const items = [];
  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal-item");
      element.style.setProperty("--delay", Math.min(index * 55, 220) + "ms");
      items.push(element);
    });
  });
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.04, rootMargin: "0px 0px -30px 0px" });

  items.forEach(item => observer.observe(item));
  document.documentElement.classList.add("motion-ready");

  const disableMotion = event => {
    if (!event.matches) return;
    observer.disconnect();
    document.documentElement.classList.remove("motion-ready");
  };
  if (media && media.addEventListener) media.addEventListener("change", disableMotion);
})();
