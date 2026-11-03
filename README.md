# Bharat HIE Portal

Health Information Exchange (HIE) citizen and provider portal — **React + Vite**.

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173**

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview build |
| `npm run test` | Vitest smoke tests (routes + text visibility) |

## Structure

```
src/                  React app (router, LegacyPortal host, styles)
public/js/            Portal modules (loaded in order)
public/assets/        Images & hero video
legacy-html/          Original static HTML pages (reference)
.cursor/rules/        Cursor agent rules
AGENTS.md             Agent guide
```

## Routes

| Path | View |
|------|------|
| `/` | Home |
| `/about` | About |
| `/find-healthcare` | Find healthcare |
| `/book-appointment` | Appointments |
| `/health-camps` | Health camps |
| `/complaints` | Complaints |
| `/faq` | FAQ |
| `/health-dashboards` | Module hub |
| `/dashboard/:mod` | Module dashboard |
| `/role/:role` | Role dashboard |

## Notes

- Demo login/registration only until a real auth API is connected.
- Chatbot falls back to rule-based triage outside claude.ai hosting.
- See `AGENTS.md` for agent conventions; text must stay visible (`src/styles/visibility.css`).
