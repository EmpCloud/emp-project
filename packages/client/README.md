# EmpCloud Workforce Management

EmpCloud Workforce Management is a workforce portal built with Next.js and React, designed for corporate dashboard analytics, task/project management, and user administration in a multi-tenant environment.

## 🔍 Project Overview

- Monolithic frontend in `packages/client` with a Next.js app (React 18).
- SPA-like pages under `pages/` for auth, dashboard, chat, reports, members, permissions, teams, etc.
- UI toolset includes Tailwind CSS, Material Tailwind, Headless UI, and custom components.
- Data visualizations via Charts (Apex, Chart.js, amCharts), Trello-style board flows, and date-range filters.
- Real-time features using `socket.io` (client side) for chat and notifications.

## 📁 Key Folder Structure

- `pages/`: route files and nested sections for `admin`, `chat`, `dashboard`, `tasks`, `members`, etc.
- `src/components/`: reusable components (forms, tables, modals, tooltips, loaders, notifications, etc.).
- `src/helper/`: shared utility functions (auth helpers, downloads, fingerprints, no-auth routing).
- `styles/`: Tailwind CSS + custom module styles.
- `public/`: static assets (images, loading animations, icons).
- `next.config.js`: transpilation for `@amcharts/amcharts4`, runtime config, and env var mapping.

## 🏗️ Architecture and Design

- Next.js standard file-based routing with SSR/CSR where needed.
- Environment variables in `next.config.js` (e.g. `PROJECT_API`, `TASK_API`, `USER_API`) to connect API backends.
- `next-themes` for dark/light mode toggling.
- Authentication appears via token-based JWT flow (client stores tokens; `noAuthRoute` helper likely protects pages).
- Central state patterns not visible in root; likely component-level state or context hooks in `src/components`.

## 🚀 Setup and Local Development

1. Clone repo
   ```bash
git clone https://github.com/EmpCloud/emp-project.git
cd emp-project/packages/client
```
2. Install dependencies
   ```bash
npm install
```
3. Copy environment template
   ```bash
cp .env.example .env
```
4. Update `.env` values (most likely):
   - `PRODUCTION_URL` / `LOCAL_URL`
   - `PROJECT_API`, `TASK_API`, `USER_API`
   - `S3`, `HOSTING_URL`, `SHARE_LINK`, `TOTAL_USERS`
5. Start dev server
   ```bash
npm run dev
```

## ⚙️ Production Build

```bash
npm run build
npm start
```

## 🧪 Linting

```bash
npm run lint
```

## 📦 Docker (Optional)

The repository contains `Dockerfile` and `docker-compose.yml`, so container-based deployment is possible using:

```bash
docker build -t empmonitor-client .
# or
docker compose up --build
```

## ☁️ GCP Deployment (configured in `package.json`)

```bash
npm run deploy
```

Requires configured `gcloud` project and `app.yaml` in the repo root.

## 🛠️ Dependencies Highlights

- UI + styling: `tailwindcss`, `@material-tailwind/react`, `@headlessui/react`
- Charts: `react-chartjs-2`, `react-apexcharts`, `@amcharts/*`
- Data handling: `axios`, `date-fns`, `lodash`, `moment`, `xlsx` helpers
- Export, PDF, files: `jsPDF`, `file-saver`, `pdf-lib`, `react-to-pdf`, `react-dropzone-uploader`
- Auth + cookies: `jwt-decode`, `js-cookie`
- Notifications and modals: `sweetalert2`, `react-toastify`, `react-modal`
- Realtime: `socket.io-client`

## 🧩 Suggested Improvements (next-phase)

- Add explicit `README` section with all env var names and sample values.
- Add testing scripts (`jest`, `cypress`) and quality checks in CI.
- Add TypeScript strict mode (`noImplicitAny`, `strict`) and fix existing warnings.
- Add route-based access control docs and API contract summary.

## 📚 Notes for Maintainers

- `next.config.js` currently sets `reactStrictMode: false` and `typescript.ignoreBuildErrors: true`, so production builds may bypass type issues.
- `eslint.ignoreDuringBuilds` is enabled; consider lowering to enforce code quality.

---

## 🏁 Quick Start Checklist

1. install dependencies
2. configure .env
3. run `npm run dev`
4. open `http://localhost:3000`

---

## ✨ Contact

For architecture questions, read `src/helper/noAuthRoute.tsx` and route pages under `pages/*` for protected vs anonymous behavior.

