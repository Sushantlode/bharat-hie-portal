# Bharat HIE Portal — Agent Guide

React (Vite) citizen & provider Health Information Exchange portal.

## Stack
- **React 18** + **Vite** + **React Router**
- Portal UI logic lives in `public/js/` (legacy modules loaded in order by `LegacyPortal`)
- Styles: `src/styles/portal.css` + `src/styles/visibility.css` (text must stay readable)
- Assets: `public/assets/`

## Commands
```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run test     # Vitest — text/visibility smoke tests
npm run preview
```

## Rules for agents
1. Prefer React components under `src/` for new UI; keep `public/js/` load order intact if editing legacy modules.
2. **All text must remain visible** — never use transparent/near-invisible body text; use `--fg` / `--muted` from CSS variables.
3. Do not remove translations in `public/js/05-language.js` without replacing them.
4. Paths to images/video are rooted at `/assets/...`.
5. Login/registration remain demo-only until a real auth API exists.
6. After UI changes, run `npm run test` and spot-check Home, About, Find, FAQ.

## Key routes
| Path | View |
|------|------|
| `/` | home |
| `/about` | about |
| `/find-healthcare` | find |
| `/book-appointment` | appt |
| `/health-camps` | camps |
| `/complaints` | griev |
| `/faq` | faq |
| `/health-dashboards` | mods |
| `/dashboard/:mod` | module dashboard |
| `/role/:role` | role login dashboard |
