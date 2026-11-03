import '@testing-library/jest-dom/vitest';

beforeEach(() => {
  if (!document.getElementById('app')) {
    const host = document.createElement('div');
    host.id = 'app';
    document.body.appendChild(host);
  }
  window.__HIE_BOOTED__ = false;
  window.__HIE_LOAD_PROMISE__ = undefined;
  window.HIE = undefined;
});
