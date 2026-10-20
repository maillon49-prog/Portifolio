/* Animação de entrada ao rolar, com acessibilidade e sem bibliotecas. */
(() => {
  'use strict';

  // Conteúdo continua visível sem JS, sem suporte ao recurso ou
  // quando o usuário prefere movimento reduzido.
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || motionPreference.matches) return;

  const groups = [
    ['.section-grid > .panel', 0],
    ['.tech-grid > .tech-item', 45],
    ['.timeline > .timeline-item', 50],
    ['.learning-list > .learning-item', 50],
    ['.projects-heading', 0],
    ['.projects-grid > .project-card', 80],
    ['.future > .section-heading', 0],
    ['.future-feature', 0],
    ['.future-items > div', 55],
    ['.contact', 0],
    ['.site-footer', 0]
  ];

  const items = [];
  for (const [selector, stagger] of groups) {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add('reveal-target');
      element.style.setProperty('--reveal-delay', `${Math.min(index * stagger, 240)}ms`);
      items.push(element);
    });
  }
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, {
    threshold: 0,
    rootMargin: '0px 0px -5% 0px'
  });

  for (const item of items) observer.observe(item);
  document.documentElement.classList.add('scroll-reveal-enabled');

  // Respeita alterações da preferência durante a visita.
  const showAll = (event) => {
    if (!event.matches) return;
    observer.disconnect();
    document.documentElement.classList.remove('scroll-reveal-enabled');
  };
  if (motionPreference.addEventListener) {
    motionPreference.addEventListener('change', showAll);
  } else if (motionPreference.addListener) {
    motionPreference.addListener(showAll);
  }
})();
