import { useEffect, useRef, useState } from 'react';
import { enhancePortal, patchLegacyRender } from '../enhancePortal';
import SkeletonScreen, { NavSkeleton } from './SkeletonScreen';

const LEGACY_SCRIPTS = [
  '/js/01-icons.js',
  '/js/02-helpers.js',
  '/js/03-country-data.js',
  '/js/04-reference-data.js',
  '/js/05-language.js',
  '/js/06-state.js',
  '/js/07-header-home.js',
  '/js/08-services.js',
  '/js/09-providers.js',
  '/js/10-analytics.js',
  '/js/11-role-dashboards.js',
  '/js/12-health-card.js',
  '/js/13-modals-login.js',
  '/js/14-about.js',
  '/js/15-find-near-me.js',
  '/js/16-citizen-features.js',
  '/js/17-module-dashboards.js',
  '/js/18-app-render-events.js',
];

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[data-hie="${src}"]`)) {
      resolve();
      return;
    }
    const el = document.createElement('script');
    el.src = src;
    el.async = false;
    el.dataset.hie = src;
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(el);
  });
}

function ensureBridge() {
  if (window.HIE?.S && window.HIE?.render) return;
  if (typeof window.render === 'function') {
    window.HIE = window.HIE || {};
    window.HIE.render = window.render;
    window.HIE.loginAs = window.loginAs;
  }
}

function applyStart(startView, startMod) {
  ensureBridge();
  const S = window.HIE?.S;
  const render = window.HIE?.render || window.render;
  const loginAs = window.HIE?.loginAs || window.loginAs;
  if (!S || typeof render !== 'function') return;

  if (startView && String(startView).indexOf('role:') === 0) {
    const role = String(startView).slice(5);
    if (typeof loginAs === 'function') loginAs(role);
  } else if (startView) {
    S.view = startView;
    S.sel = null;
    S.modal = null;
    if (startMod) {
      S.mod = startMod;
      S.tool = null;
    }
    if (startView === 'home') S.svcLimit = 24;
  }
  render();
  window.scrollTo(0, 0);
}

function loadLegacyOnce() {
  if (!window.__HIE_LOAD_PROMISE__) {
    window.__HIE_LOAD_PROMISE__ = (async () => {
      for (const src of LEGACY_SCRIPTS) {
        await loadScript(src);
      }
      ensureBridge();
      window.__HIE_BOOTED__ = true;
    })();
  }
  return window.__HIE_LOAD_PROMISE__;
}

/**
 * Boots the portal once and syncs React Router views into legacy S.view.
 * Skeleton on first load; light skeleton on route changes.
 */
export default function LegacyPortal({ startView = 'home', startMod = null }) {
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(!!window.__HIE_BOOTED__);
  const [navigating, setNavigating] = useState(false);
  const booted = useRef(!!window.__HIE_BOOTED__);
  const routeKey = useRef(`${startView}:${startMod || ''}`);

  useEffect(() => {
    let cancelled = false;
    let navTimer;
    const key = `${startView}:${startMod || ''}`;
    const isRouteChange = booted.current && routeKey.current !== key;
    routeKey.current = key;

    (async () => {
      window.START_VIEW = startView;
      if (startMod) window.START_MOD = startMod;
      else delete window.START_MOD;

      if (isRouteChange) setNavigating(true);

      try {
        await loadLegacyOnce();
        if (cancelled) return;
        applyStart(startView, startMod);
        patchLegacyRender();
        enhancePortal();
        booted.current = true;
        setReady(true);
        navTimer = setTimeout(() => {
          if (!cancelled) setNavigating(false);
        }, 420);
      } catch (err) {
        if (!cancelled) setError(err.message || String(err));
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(navTimer);
    };
  }, [startView, startMod]);

  if (error) {
    return (
      <div className="react-boot" role="alert">
        Could not start portal: {error}
      </div>
    );
  }

  return (
    <>
      {!ready && <SkeletonScreen label="Loading Bharat HIE Portal…" />}
      {ready && navigating && <NavSkeleton />}
    </>
  );
}
