const LAZY_SECTION_SEL = [
  '#services',
  '#how',
  '#providers',
  '.hgrid > .side',
  'footer',
].join(',');

let sectionObserver;
let moreObserver;

function shellHtml() {
  return `<div class="hie-lazy-shell" aria-hidden="true">
    <div class="hie-skel sk-line lg"></div>
    <div class="hie-skel sk-line" style="width:90%"></div>
    <div class="hie-skel sk-line" style="width:70%;margin-bottom:16px"></div>
    <div class="sk-grid">
      <div class="hie-skel sk-card"></div>
      <div class="hie-skel sk-card"></div>
      <div class="hie-skel sk-card"></div>
      <div class="hie-skel sk-card"></div>
    </div>
  </div>`;
}

function ensureSectionObserver() {
  if (sectionObserver) return sectionObserver;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }
  sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.remove('hie-section-pending');
        el.classList.add('hie-section-ready');
        sectionObserver.unobserve(el);
      });
    },
    { rootMargin: '120px 0px', threshold: 0.05 }
  );
  return sectionObserver;
}

function setupLazySections(root) {
  const obs = ensureSectionObserver();
  root.querySelectorAll(LAZY_SECTION_SEL).forEach((el, idx) => {
    if (el.dataset.hieLazy === '1') return;
    el.dataset.hieLazy = '1';

    // Keep first block (services) slightly deferred but vision/hero already visible
    const rect = el.getBoundingClientRect();
    const belowFold = rect.top > window.innerHeight * 0.72;

    if (!belowFold || !obs) {
      el.classList.add('hie-section-ready');
      return;
    }

    if (!el.querySelector('.hie-lazy-shell')) {
      el.insertAdjacentHTML('afterbegin', shellHtml());
    }
    el.classList.add('hie-section-pending');
    // Stagger observation so scroll loads feel sequential
    setTimeout(() => obs.observe(el), idx * 40);
  });
}

function setupInfiniteServices(root) {
  const sentinel = root.querySelector('#svc-scroll-more');
  if (!sentinel || sentinel.dataset.done === '1') {
    moreObserver?.disconnect();
    return;
  }

  if (!moreObserver) {
    moreObserver = new IntersectionObserver(
      (entries) => {
        const hit = entries.some((e) => e.isIntersecting);
        if (!hit) return;
        const S = window.HIE?.S;
        const render = window.HIE?.render || window.render;
        if (!S || typeof render !== 'function') return;
        S.svcLimit = (S.svcLimit || 24) + 24;
        render();
      },
      { rootMargin: '200px 0px', threshold: 0 }
    );
  }

  moreObserver.disconnect();
  moreObserver.observe(sentinel);
}

/** Mark shell + wire lazy sections / infinite services after each render. */
export function enhancePortal() {
  const root = document.getElementById('app');
  if (!root) return;
  root.dataset.hieMotion = 'on';
  setupLazySections(root);
  setupInfiniteServices(root);
}

/** Wrap legacy render so polish runs after every UI update. */
export function patchLegacyRender() {
  const api = window.HIE;
  if (!api?.render || api.__enhanced) return;
  const original = api.render.bind(api);
  const wrapped = (...args) => {
    original(...args);
    requestAnimationFrame(enhancePortal);
  };
  api.render = wrapped;
  window.render = wrapped;
  api.__enhanced = true;
  requestAnimationFrame(enhancePortal);
}
