# EMP Project — Task API Service

Task management microservice running on **port 9001**. Shares MongoDB (`emp_project`) with the Project API service.

## Prerequisites

- Node.js v20+
- MongoDB running on `localhost:27017`
- Redis running on `localhost:6379`

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create config file

Create `config/default.json`:

```json
{
  "task": {
    "port": 9001,
    "host_url": "http://localhost:9001"
  },
  "mongo_atlas_enabled": false,
  "mongo_atlas_url": "",
  "redis": {
    "url": "redis://:YOUR_REDIS_PASSWORD@localhost:6379"
  },
  "token_secret": "YOUR_TOKEN_SECRET",
  "user_token_secret": "YOUR_USER_TOKEN_SECRET",
  "notification_server_url": "",
  "productName": "EMP Project",
  "sendgrid": {
    "key": "",
    "email": "noreply@empcloud.com",
    "name": "EMP Project",
    "autoMailReportSubject": "Automated Report",
    "TaskAssignmentSubject": "Task Assignment"
  },
  "mongo": {
    "host": "localhost",
    "db_name": "emp_project",
    "username": "",
    "password": ""
  },
  "swagger_host_url": "localhost:9001",
  "limit": 10,
  "skip": 0,
  "SWAGGER_AUTH": {
    "username": "admin",
    "password": "admin123"
  }
}
```

### 3. Create `.env` file

```env
NODE_ENV=production
JWT_ACCESS_TOKEN_SECRET=<your-jwt-secret>
CRYPTO_PASSWORD=<your-crypto-password>
```

> `JWT_ACCESS_TOKEN_SECRET` and `CRYPTO_PASSWORD` must match the values used by the Project API and EMP Cloud frontend for token encryption/decryption.

### 4. MongoDB collections

The service uses the `emp_project` database (shared with Project API). The following per-org collections are created automatically when an organization is onboarded via SSO:

- `org_{orgId}_users`
- `org_{orgId}_taskfeatures`
- `org_{orgId}_subtaskfeatures`
- `org_{orgId}_projectfeatures`
- `adminschemas`, `planschemas`, `permissionschemas` (shared)

## Running

### Development

```bash
npm run dev
```

### Production (PM2)

```bash
pm2 start task.server.js --name emp-project-task-api
pm2 save
```

### Restart (with cache purge)

```bash
pm2 delete emp-project-task-api
rm -rf ~/.cache/tsx
pm2 start task.server.js --name emp-project-task-api
pm2 save
```

## API

- **Base URL**: `https://test-project-task-api.empcloud.com`
- **Health**: `GET /health`
- **Swagger**: `GET /explorer` (requires basic auth)
- **All endpoints require** `x-access-token` header

## Architecture

```
task.server.js          — Express server entry point
jwt.service.js          — JWT verification + AES-256-CBC decryption
middleware/
  verifyToken.js        — Auth middleware (validates token, checks plan expiry)
core/
  task/                 — Task CRUD, filtering, reports
  subTask/              — Sub-task operations
  schema/               — Mongoose models
config/
  default.json          — App configuration (gitignored)
resources/
  database/
    mongo.connect.js    — MongoDB connection
    redis.connect.js    — Redis connection
  routes/
    public.routes.js    — Route definitions
```
