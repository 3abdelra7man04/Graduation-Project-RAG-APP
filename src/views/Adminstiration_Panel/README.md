# UniAsk — RAG Admin Dashboard

A Vite + React dashboard for a RAG (Retrieval-Augmented Generation) system.

---

## ▶ How to run

```bash
npm install
npm run dev        # http://localhost:3000
```

`npm run build` produces a production build in `dist/`; `npm run preview` serves that build
locally.

### Backend URL

The app reads the backend base URL from `VITE_API_URL` (see `.env.example`). Copy it to `.env`
and adjust if your backend isn't on `http://localhost:5000`:

```bash
cp .env.example .env
```

`.env` is gitignored — never commit real values there.

---

## 📁 Full project structure

```
uniask-dashboard/
│
├── index.html              ← Vite entry HTML — loads /src/main.jsx as a module
├── vite.config.js          ← React plugin, dev server pinned to port 3000
├── .env.example            ← VITE_API_URL — copy to .env to override
│
├── package.json
│
└── src/
    │
    ├── main.jsx            ← Mounts <App /> via ReactDOM.createRoot, imports css/main.css
    ├── App.jsx              ← Root component: routing, dark/RTL, sign-in gate
    ├── api.js               ← BASE_URL (from VITE_API_URL) + apiFetch() helper
    ├── icons.jsx            ← Icon.Dashboard, Icon.Trash, Icon.Bell … (SVG)
    ├── i18n.js              ← TRANSLATIONS object + makeT(lang) helper
    ├── charts.jsx           ← <Sparkline> <BarChart> <DonutChart>
    ├── Sidebar.jsx          ← Fixed left nav + user card
    ├── Topbar.jsx           ← Sticky header: title, dark mode, lang switch
    ├── SignIn.jsx           ← Administration Portal sign-in page
    │
    ├── css/
    │   └── main.css         ← ALL styles (CSS variables, layout, components)
    │
    ├── hooks/
    │   └── useApiData.js    ← Shared fetch hook: { data, loading, error } + transform
    │
    ├── components/
    │   └── StatusBadge.jsx  ← Shared pill/dot status renderer (each page owns its own
    │                          status → style config; vocabularies are not merged)
    │
    └── pages/
        ├── Dashboard.jsx    ← Stats grid, weekly chart, activity feed
        ├── Knowledge.jsx    ← Document upload, search, table
        ├── Analysis.jsx     ← Topic coverage bars + unanswered queries
        ├── Inbox.jsx        ← Chat log with cost/latency/token KPIs + agent trace
        ├── Admins.jsx       ← Admin table + invite modal
        └── Settings.jsx     ← LLM config, chunking, feature flags, vector DB
```

---

## 🔧 Build tooling

This project is a standard Vite + React app — `vite`, `@vitejs/plugin-react`, `react` and
`react-dom` are real dependencies (see `package.json`). There is no more CDN React/Babel and no
in-browser JSX transpilation: every `.jsx` file is compiled at build/dev-server time like any
normal Vite project.

`tailwindcss`, `postcss` and `autoprefixer` are still listed as devDependencies but are **not**
wired into the build (no PostCSS config, no Tailwind directives active) — `src/css/main.css` is
plain hand-written CSS. They're unused leftovers; wiring Tailwind up is a separate task.

---

## 🌐 Assets

There are **no image assets** in this project. All visuals are:
- SVG icons defined inline in `src/icons.jsx`
- CSS-drawn UI (gradients, borders, shadows) in `src/css/main.css`
- SVG charts rendered by React components in `src/charts.jsx`
- Google Fonts loaded from CDN (DM Sans + Space Grotesk + Outfit) via `index.html`

---

## 🌍 i18n (English / Arabic)

- All UI strings live in `src/i18n.js` under `TRANSLATIONS.en` and `TRANSLATIONS.ar`
- Switch language with the **AR / EN** button in the top-right
- Arabic mode automatically sets `dir="rtl"` on `<html>` via `App.jsx`

---

## 🔌 Connecting to a real backend

Most pages already call the live backend through `src/api.js` (`apiFetch` / `BASE_URL`), pointed
at `VITE_API_URL`. `Settings.jsx` is still local React state only — it renders LLM config,
chunking and feature-flag controls but doesn't call any API yet.

Key endpoints in use today:
| File              | Endpoints used                                                          |
|--------------------|--------------------------------------------------------------------------|
| `SignIn.jsx`       | `POST /api/v1/admin/login/1`, `GET /api/v1/admin/get-profile/1`          |
| `pages/Dashboard.jsx` | `GET /api/v1/dashboard/*` (uploaded_documents, queries_answered, avg_latency, failed_queries, count_queries_this_week_per_day) |
| `pages/Knowledge.jsx` | `GET /api/v1/data/list/0`, `POST /api/v1/data/upload/:projectId`, `DELETE /api/v1/data/delete/:projectId/:id` |
| `pages/Analysis.jsx`  | `GET /api/v1/gap_analysis/topics`, `.../well_covered`, `.../unanswered`, `PUT .../dismiss`, `POST .../suggest_document` |
| `pages/Inbox.jsx`     | `GET /api/v1/monitor/stats/:projectId`, `GET /api/v1/dashboard/avg_latency/:projectId`, `GET /api/v1/chat_inbox/list/:projectId`, `GET /api/v1/monitor/conversation/:chatId` |
| `pages/Admins.jsx`    | `GET /api/v1/admin/:projectId/list` (invite/remove are still local-only) |
