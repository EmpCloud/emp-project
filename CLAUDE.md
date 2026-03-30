# CLAUDE.md — EMP Project Module

## Overview

EMP Project is a monorepo with 3 services: Next.js client, Project API (port 9000), and Task API (port 9001). Both backend services are microservices that share a **single MongoDB database** (`emp_project`).

## Architecture

```
Client (Next.js)  →  port 3100 (prod) / 3000 (dev)
Project API       →  port 9000  →  MongoDB: emp_project, Redis
Task API          →  port 9001  →  MongoDB: emp_project, Redis
```

Both APIs use ESM (`"type": "module"` in package.json). Entry points are plain `.js` files (not TypeScript).

## Database: MongoDB

**Database name**: `emp_project` (shared by both project and task APIs)

### Shared collections
| Collection | Purpose |
|---|---|
| `adminschemas` | Organization admin accounts |
| `planschemas` | Subscription plans (basic, premium, etc.) |
| `planhistoryschemas` | Plan change history |
| `permissionschemas` | Role-based permission configs |
| `rolesschemas` | Role definitions |
| `userschemas` | User accounts |
| `configschemas` | Per-org feature toggles (projectFeature, taskFeature, invitationFeature, etc.) |
| `configfieldschemas` | Custom field configurations |
| `dynamicfieldschemas` | Dynamic field definitions |
| `companymodels` | Company/client data |
| `clientmodels` | Client records |
| `defaultscreens` | Default screen configurations |
| `notificationmodels` | Notifications |
| `messagemodels` | Chat messages |
| `taskstatuses` | Global task status definitions |
| `tasktypes` | Global task type definitions |
| `taskcategories` | Global task categories |
| `taskstages` | Global task stages |
| `taskcomments` | Task comments |
| `subtaskcomments` | Sub-task comments |
| `sprints` | Sprint data |
| `activityschemas` | Activity logs |
| `faileddatas` | Failed operation records |

### Per-organization dynamic collections
Created when an org is onboarded (via SSO from EMP Cloud):

| Pattern | Purpose |
|---|---|
| `org_{orgId}_users` | Org members invited to project module |
| `org_{orgId}_projectfeatures` | Projects belonging to this org |
| `org_{orgId}_taskfeatures` | Tasks belonging to this org |
| `org_{orgId}_subtaskfeatures` | Sub-tasks belonging to this org |
| `org_{orgId}_groups` | User groups |
| `org_{orgId}_notifications` | Per-org notifications |
| `org_{orgId}_taskstatuses` | Custom task statuses |
| `org_{orgId}_tasktypes` | Custom task types |
| `org_{orgId}_taskcategories` | Custom categories |
| `org_{orgId}_taskstages` | Custom stages |
| `org_{orgId}_subtaskstatuses` | Custom sub-task statuses |
| `org_{orgId}_subtasktypes` | Custom sub-task types |
| `org_{orgId}_taskactivityfeatures` | Task activity config |
| `org_{orgId}_taskcommentfeatures` | Task comment config |
| `org_{orgId}_subtaskactivityfeatures` | Sub-task activity config |
| `org_{orgId}_subtaskcommentfeatures` | Sub-task comment config |

**Important**: `orgId` comes from the JWT token's `userData.orgId` field. Currently org `5` is the test org (Ananya / TechNova).

## Database: Redis

Used for:
- Caching user permissions (`{email}_permissions` key)
- Session/token metadata

Connection: `redis://:PASSWORD@localhost:6379`

## Configuration

Both services use the `config` npm package. Config files are **gitignored** (`config/*.json`).

### Project API — `packages/server/project/config/default.json`
```json
{
  "project": { "port": 9000, "host_url": "http://localhost:9000" },
  "mongo": { "host": "localhost", "db_name": "emp_project" },
  "redis": { "url": "redis://:PASSWORD@localhost:6379" },
  "token_secret": "<must-match-task-api>",
  "user_token_secret": "<must-match-task-api>"
}
```

### Task API — `packages/server/task/config/default.json`
```json
{
  "task": { "port": 9001, "host_url": "http://localhost:9001" },
  "mongo": { "host": "localhost", "db_name": "emp_project" },
  "redis": { "url": "redis://:PASSWORD@localhost:6379" },
  "token_secret": "<must-match-project-api>",
  "user_token_secret": "<must-match-project-api>"
}
```

### `.env` files (both services)
```env
NODE_ENV=production
JWT_ACCESS_TOKEN_SECRET=<jwt-secret>
CRYPTO_PASSWORD=<aes-256-cbc-key>
```

**Critical**: `JWT_ACCESS_TOKEN_SECRET`, `CRYPTO_PASSWORD`, `token_secret`, and `user_token_secret` must be identical across both services — tokens are issued by one and verified by the other.

## Authentication Flow

1. User logs into EMP Cloud → gets encrypted JWT token
2. Token is AES-256-CBC encrypted using `CRYPTO_PASSWORD`
3. Both Project and Task APIs decrypt the token in `jwt.service.js`
4. `middleware/verifyToken.js` validates the token and checks:
   - Plan expiry (`planschemas` collection)
   - User permissions (`permissionschemas` collection)
   - Feature toggles (`configschemas` collection)
5. Per-org collection existence is checked via `checkCollection()` in `utils/common.utils.js`

## Deployment (Test Server)

**Server**: 163.227.174.141 (empcloud-development)

### PM2 processes
```
emp-project-api       →  port 9000  →  project.server.js
emp-project-task-api  →  port 9001  →  task.server.js
emp-project-client    →  port 3100  →  npx next dev -p 3100
```

### Nginx domains
```
test-project.empcloud.com          →  client (3100) + project API (/v1/ → 9000)
test-project-api.empcloud.com      →  project API (9000)
test-project-task-api.empcloud.com →  task API (9001)
```

### Deploy procedure
```bash
cd ~/empcloud-projects/emp-project
git pull origin main
pm2 delete emp-project-api emp-project-task-api
pm2 start project.server.js --name emp-project-api --cwd packages/server/project
pm2 start task.server.js --name emp-project-task-api --cwd packages/server/task
pm2 save
```

## Common Issues

| Issue | Cause | Fix |
|---|---|---|
| `JWT_ACCESS_TOKEN_SECRET must be set` | Missing `.env` file | Create `.env` with JWT secret and CRYPTO_PASSWORD |
| `planschemascollection is not present` | Task API using wrong DB (`emp_project_task`) | Set `mongo.db_name` to `emp_project` in task config |
| `org_X_users Collection is not present` | Org not onboarded yet | SSO login creates these collections, or create manually via `db.createCollection()` |
| `Invitation feature is not enabled` | Missing `org_X_users` collection | Same as above — misleading error message from `checkCollection()` |
| `next: No such file or directory` | PM2 can't find Next.js binary | Start with `pm2 start "npx next dev -p 3100"` |

## Code Conventions

- ESM modules (`import/export`, `"type": "module"`)
- `config` package for app configuration (not dotenv for most settings)
- `dotenv` only for secrets (`JWT_ACCESS_TOKEN_SECRET`, `CRYPTO_PASSWORD`)
- Dynamic collection names: `org_{orgId}_collectiontype`
- All API responses use `Response.projectSuccessResp()` / `Response.projectFailResp()` pattern
