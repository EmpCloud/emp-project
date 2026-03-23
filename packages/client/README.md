# EmpCloud Workforce Management - Client

Frontend application for EmpCloud Workforce Management, built with Next.js and React.

## Tech Stack

- Next.js 13
- React 18
- TypeScript
- Tailwind CSS
- Material Tailwind
- Headless UI
- Axios
- Socket.IO Client

## Project Structure

- `pages/` - Next.js routes (auth, dashboard, members, projects, tasks, reports, etc.)
- `src/components/` - reusable UI components
- `src/helper/` - shared helper utilities
- `styles/` - global and module styles
- `public/` - static assets
- `next.config.js` - frontend runtime and env mappings

## Prerequisites

- Node.js 18+
- npm 9+
- Running backend services:
  - Project API (`http://localhost:9000`)
  - Task API (`http://localhost:9001`)

## Setup

From this directory (`packages/client`):

```bash
npm install
```

Create local environment file:

- macOS/Linux:
  ```bash
  cp .env.example .env
  ```
- Windows PowerShell:
  ```powershell
  Copy-Item .env.example .env
  ```

Update `.env` values for your environment.

Minimum local configuration:

```env
LOCAL_URL=http://localhost:3000
PROJECT_API=http://localhost:9000/v1
TASK_API=http://localhost:9001/v1
```

## Run

```bash
npm run dev
```

App URL: `http://localhost:3000`

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Docker (Optional)

```bash
docker build -t empcloud-client .
docker compose up --build
```

## Deploy

```bash
npm run deploy
```

Requires configured Google Cloud CLI and deployment config.

## Run from Monorepo Root

If you are in the repository root (`emp-project`):

```bash
npm run dev:all
```

This starts Project API, Task API, and Client together.

## Repository

[https://github.com/EmpCloud/emp-project](https://github.com/EmpCloud/emp-project)

