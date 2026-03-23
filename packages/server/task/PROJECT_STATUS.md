# 📋 EmpMonitor Task Management API — Project Status & Documentation

> **Version:** 1.0.0  
> **Author:** Jagadeesha Ravibabu  
> **Last Updated:** 2026-03-23  
> **Base URL (Local):** `http://localhost:9001`  
> **Swagger UI:** `http://localhost:9001/explorer`

---

## 📖 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Structure](#3-project-structure)
4. [Configuration Files](#4-configuration-files)
5. [Entry Point — task.server.js](#5-entry-point--taskserverjs)
6. [Database Layer](#6-database-layer)
7. [Authentication & Middleware](#7-authentication--middleware)
8. [API Routes — Complete Reference](#8-api-routes--complete-reference)
   - [Task Routes](#81-task-routes---v1task)
   - [SubTask Routes](#82-subtask-routes---v1subtask)
   - [Task Type Routes](#83-task-type-routes---v1task-type)
   - [Task Status Routes](#84-task-status-routes---v1task-status)
   - [Task Stage Routes](#85-task-stage-routes---v1task-stage)
   - [Task Category Routes](#86-task-category-routes---v1task-category)
   - [SubTask Type Routes](#87-subtask-type-routes---v1subtask-type)
   - [SubTask Status Routes](#88-subtask-status-routes---v1subtask-status)
9. [Data Models (MongoDB Schemas)](#9-data-models-mongodb-schemas)
10. [Utilities](#10-utilities)
11. [Notification Client](#11-notification-client)
12. [Logger & Log Rotation](#12-logger--log-rotation)
13. [Local Dev Setup Guide](#13-local-dev-setup-guide)

---

## 1. Project Overview

The **EmpMonitor Task Management API** is a RESTful backend service built with **Node.js + Express.js** and **MongoDB**. It is part of the larger EmpMonitor Work Management (WM) ecosystem and handles all task and subtask lifecycle operations for teams and organizations.

### Core Capabilities

| Feature | Description |
|---|---|
| **Task Management** | Create, read, update, delete tasks with rich metadata |
| **SubTask Management** | Full CRUD for subtasks linked to parent tasks |
| **Comments & Replies** | Nested comment threads on both tasks and subtasks |
| **Task Metadata** | Configurable types, statuses, stages, and categories |
| **Permission System** | Role-based access control (RBAC) via Redis-cached permission configs |
| **JWT Authentication** | Dual-secret JWT verification (admin & user tokens) |
| **Multi-tenant** | Organization-level data isolation via `orgId` and `adminId` |
| **Plan Enforcement** | API blocks requests if the admin's subscription plan has expired |
| **Swagger UI** | Interactive API documentation at `/explorer` |
| **Log Rotation** | Daily log file rotation (7-day retention, 100 MB size cap) |
| **Notification Integration** | SockJS client connects to a separate notification microservice |

---

## 2. Tech Stack & Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^4.18.2 | Core web framework |
| `mongoose` | ^6.7.1 | MongoDB ODM for schema modeling |
| `mongodb` | (peer) | Direct MongoDB driver for raw queries |
| `redis` | ^4.6.4 | Caching permission configs per user |
| `jsonwebtoken` | ^8.5.1 | JWT token signing and verification |
| `config` | ^3.3.8 | Environment-based configuration loader |
| `joi` | ^17.7.0 | Request body validation schemas |
| `@joi/date` | ^2.1.0 | Joi extension for date validation |
| `helmet` | ^6.0.0 | Security headers (XSS, clickjacking, etc.) |
| `compression` | ^1.7.4 | Gzip response compression |
| `body-parser` | ^1.20.1 | Parses JSON and URL-encoded request bodies |
| `cookie-parser` | ^1.4.6 | Parses cookies from requests |
| `cors` | ^2.8.5 | Cross-Origin Resource Sharing |
| `morgan` | ^1.10.0 | HTTP request logger middleware |
| `winston` | ^3.8.2 | Structured application logging |
| `winston-daily-rotate-file` | ^4.7.1 | Rotating log file transport for Winston |
| `file-stream-rotator` | ^0.6.1 | Rotates log streams daily |
| `sockjs-client` | ^1.6.1 | Client for SockJS WebSocket-like connections |
| `swagger-autogen` | ^2.22.0 | Auto-generates Swagger JSON from JSDoc comments |
| `swagger-ui-express` | ^4.5.0 | Serves Swagger UI at `/explorer` |
| `express-basic-auth` | ^1.2.1 | Basic auth guard for Swagger UI |
| `@sendgrid/mail` | ^7.7.0 | Email delivery via SendGrid |
| `nodemon` | (dev) | Auto-restarts server on file changes |

---

## 3. Project Structure

```
emp-monitor-work-management-api/
│
├── task.server.js               # 🚀 Application entry point
├── jwt.service.js               # JWT verification & AES decryption service
├── tokenVerify.js               # Standalone token verification utility
├── package.json                 # NPM metadata & scripts
│
├── config/                      # Environment-based configuration
│   ├── localDev.json            # Local development config
│   ├── predevelopment.json      # Staging/pre-prod config
│   └── production.json          # Production config
│
├── core/                        # 🧠 Domain logic (each module = feature)
│   ├── task/                    # Task entity
│   │   ├── task.model.js        # Mongoose schema
│   │   ├── task.routes.js       # Express router
│   │   ├── task.controller.js   # Request handlers (thin layer)
│   │   ├── task.service.js      # Business logic & DB queries
│   │   ├── task.validate.js     # Joi validation schemas
│   │   ├── task.comment.js      # Comment schema definition
│   │   └── task.commentReply.service.js  # Reply CRUD logic
│   │
│   ├── subTask/                 # SubTask entity
│   │   ├── subTask.model.js
│   │   ├── subTask.routes.js
│   │   ├── subTask.controller.js
│   │   ├── subTask.service.js
│   │   ├── subTask.validate.js
│   │   ├── subtask.comment.schema.js
│   │   └── subtask.commentReply.service.js
│   │
│   ├── taskType/                # Task type definitions (Bug, Feature, etc.)
│   ├── taskStatus/              # Task statuses (Todo, In Progress, Done, etc.)
│   ├── taskStage/               # Task stages (Sprint 1, Backlog, etc.)
│   ├── taskCategory/            # Task categories (General, Problem Ticket, etc.)
│   ├── subTaskType/             # SubTask type definitions
│   ├── subTaskStatus/           # SubTask status definitions
│   ├── schema/                  # Shared schemas (permission model, etc.)
│   ├── language/                # i18n translation for middleware messages
│   ├── event/                   # Event-related utilities
│   └── notifications/           # Notification push utilities
│
├── middleware/                  # Express middleware
│   ├── verifyToken.js           # JWT auth guard (runs on every route)
│   ├── permissionMiddleware.js  # RBAC: view/create/edit/delete guards
│   ├── permissionConfigChecker.js  # Maps route paths → permission keys
│   └── routeChecker.js          # Validates route patterns for RBAC
│
├── resources/
│   ├── database/
│   │   ├── mongo.database.js    # MongoConnect initializer (config-driven)
│   │   ├── mongo.connect.js     # Raw MongoDB driver connection pool
│   │   └── redis.connect.js     # Redis client (for permission caching)
│   ├── routes/
│   │   └── public.routes.js     # Registers all sub-routers on app
│   ├── logs/
│   │   ├── logger.log.js        # Winston logger configuration
│   │   └── responselogs/        # Daily rotating HTTP log files
│   └── views/
│       ├── swagger.config.js    # Swagger autogen runner (pre-start)
│       ├── swagger-api-view.json  # Generated Swagger spec
│       └── swaggerAuth.js       # Basic auth guard for /explorer
│
├── response/
│   └── response.js              # Standardized response shape helpers
│
├── mailService/                 # Email sending utilities (SendGrid)
│
└── utils/
    ├── common.utils.js          # Shared DB helpers, query builders
    ├── customFields.utils.js    # Dynamic custom field processing
    ├── activity.utils.js        # Activity log helpers
    ├── notification.client.js   # SockJS notification client
    └── reuse.js                 # General purpose reusable functions
```

---

## 4. Configuration Files

Configuration is managed by the `config` npm package. The active config is selected by the `NODE_ENV` environment variable.

| `NODE_ENV` value | Config file loaded |
|---|---|
| `local` | `config/localDev.json` |
| `predevelopment` | `config/predevelopment.json` |
| `production` | `config/production.json` |

### `config/localDev.json` — Key Fields

```json
{
  "task": {
    "host_url": "localhost:9001",
    "port": "9001",
    "host": "localhost:9001"
  },
  "redis": {
    "url": "redis://127.0.0.1:6379"
  },
  "swagger_host_url": "localhost:9001",
  "user_token_secret": "SAkjSsad33_sajfkf",
  "notification_server_url": "http://localhost:9005/notification",
  "mongo": {
    "username": "",
    "password": "",
    "host": "127.0.0.1",
    "db_name": "WM-Dev"
  },
  "mongo_atlas_enabled": false,
  "token_secret": "SAkjSOciObOard_7541",
  "customTaskType": 5,
  "customTaskStatus": 5,
  "customTaskCategory": 45,
  "skip": 0,
  "limit": 10,
  "SWAGGER_AUTH": { "admin": "admin" }
}
```

| Config Key | Description |
|---|---|
| `task.port` | Port the server listens on |
| `task.host_url` | Full host URL (used in log messages) |
| `redis.url` | Redis connection URL for caching permission configs |
| `mongo` | MongoDB connection details (host, DB name, credentials) |
| `mongo_atlas_enabled` | Toggle to switch between local MongoDB and MongoDB Atlas |
| `mongo_atlas_url` | Atlas connection string (used when `mongo_atlas_enabled: true`) |
| `token_secret` | JWT secret for **admin** tokens |
| `user_token_secret` | JWT secret for **user** tokens (separate secret) |
| `customTaskType` | Max allowed custom task types per org |
| `customTaskStatus` | Max allowed custom task statuses per org |
| `customTaskCategory` | Max allowed custom task categories per org |
| `skip` / `limit` | Default pagination values |
| `SWAGGER_AUTH` | Credentials for Swagger UI basic auth (format: `{ username: password }`) |

---

## 5. Entry Point — `task.server.js`

This is the application bootstrap file. It performs the following in sequence:

1. **Imports** all required packages (Express, Helmet, Compression, Morgan, Cookie-parser, etc.)
2. **Configures Express middleware:**
   - `Helmet` — security headers
   - `Compression` — gzip compression
   - `bodyParser` — JSON + URL-encoded body parsing (up to 100 MB JSON, 50 MB body-parser)
   - `cookieParser` — cookie parsing
   - `morgan` — HTTP request logging (to console in dev, to rotating file in staging/prod)
3. **Sets response headers** — `Keep-Alive: timeout=300` for long-lived connections
4. **Registers Swagger UI** at `/explorer` with basic auth via `swaggerAuth.js`
5. **Health check** — `GET /` returns `"Working.......!"`
6. **MongoDB initialization** — calls `mongoConnect.initialize()` before mounting routes
7. **Mounts Routes** — instantiates `public.routes.js` which registers all feature routers
8. **Starts HTTP server** on the port from config
9. **Connects SockJS client** to the notification server for real-time notification delivery
10. **Global error handlers** — `unhandledRejection`, `uncaughtException`, `warning` events are caught and logged

### Startup Sequence (Chain)

```
mongoConnect.initialize()
  → new Routes(app)       ← mounts all API routers
  → startServer()         ← begins listening on configured port
  → SockJsClient(url)     ← opens WS connection to notification service
```

---

## 6. Database Layer

### MongoDB Connection (`resources/database/mongo.database.js`)

Uses config values from `config.get('mongo')` to build the connection. Supports both local MongoDB and MongoDB Atlas (toggled via `mongo_atlas_enabled`).

### Redis Connection (`resources/database/redis.connect.js`)

Redis is used exclusively for **caching permission configurations** per logged-in user. The key format is:

```
{email}_permissions  →  JSON string of permissionConfig object
```

This cache is populated on each login/token verification and read by the permission middleware on every protected request.

### Raw MongoDB Driver

The project uses both **Mongoose** (for schema-based models) and the **raw MongoDB driver** (`mongodb` package via `mongo.connect.js`) for native queries in services and `common.utils.js`. The raw driver gives access to the `connection.client` for cross-collection queries.

---

## 7. Authentication & Middleware

### 7.1 `verifyToken.js` — JWT Authentication Guard

Runs on **every API request** (applied globally in `public.routes.js`).

**Flow:**

```
Request → Read x-access-token header
  → Try verify with token_secret (admin token)
    ✅ valid → attach userData to req.verified → fetch planData → next()
    ❌ invalid signature → try user_token_secret (user token)
      ✅ valid → fetch adminId from adminschemas → cache permissionConfig in Redis → check plan expiry → next()
      ❌ → 401 Invalid access token
  → Check: isConfigSet, email verified, planName set
  → 402 if plan expired
```

**Populates `req.verified`** with:
```json
{
  "state": true,
  "type": "user | admin",
  "userData": {
    "userData": {
      "email": "...",
      "orgId": "...",
      "adminId": "...",
      "language": "en",
      "adminName": "...",
      "planData": { ... },
      "permission": "...",
      ...
    }
  }
}
```

**Error Responses:**

| Status | Reason |
|---|---|
| `401` | Invalid/missing token |
| `402` | Plan expired / email not verified / config not set / no plan selected |

### 7.2 `permissionMiddleware.js` — RBAC Guards

Four middleware functions guard CRUD operations based on the user's `permissionConfig` (fetched from Redis):

| Middleware | Applied to | Permission key checked |
|---|---|---|
| `viewAccessCheck` | GET routes | `permissionConfig[path].view` |
| `createAccessCheck` | POST `/create` routes | `permissionConfig[path].create` |
| `editAccessCheck` | PUT `/update` routes | `permissionConfig[path].edit` |
| `deleteAccessCheck` | DELETE routes | `permissionConfig[path].delete` |

**Note:** Permission checks are **only enforced for `type: "user"` tokens**. Admin tokens bypass RBAC.

**Error Responses:**

| Status | Reason |
|---|---|
| `400` | Access denied (permission not granted) |

### 7.3 `jwt.service.js` — JWT + AES Decryption Service

Provides a `verify(token)` method that:
1. AES-256-CBC **decrypts** the incoming token (tokens are encrypted before being issued)
2. Verifies the decrypted JWT against `accessTokenSecret`
3. Decrypts the `signature` field inside the JWT payload
4. Returns the decoded `signature` as the final user data

Used for admin-level tokens that pass through a secondary encryption layer.

---

## 8. API Routes — Complete Reference

**Base URL:** `http://localhost:9001`  
**Authentication:** All routes require the `x-access-token` header.

---

### 8.1 Task Routes — `/v1/task`

| Method | Endpoint | Guard | Controller | Description |
|---|---|---|---|---|
| `POST` | `/v1/task/create` | `createAccessCheck` | `createTask` | Create a new task with full metadata |
| `GET` | `/v1/task/fetch` | `viewAccessCheck` | `getTasks` | Fetch tasks (by projectId, taskId, or all) |
| `GET` | `/v1/task/status` | `viewAccessCheck` | `taskStatus` | Get task status counts grouped by project/task |
| `GET` | `/v1/task/search` | `viewAccessCheck` | `searchTask` | Full-text search tasks by keyword |
| `GET` | `/v1/task/search-default-values` | — | `searchTaskDefaultValue` | Search task default values (status/type/category/stage) |
| `GET` | `/v1/task/comment/get` | — | `getComments` | Get all comments for a task |
| `GET` | `/v1/task/fetch-report` | `viewAccessCheck` | `getReports` | Fetch task reports within a date range |
| `POST` | `/v1/task/comment/:id` | — | `postComment` | Post a comment on a task (`:id` = taskId) |
| `POST` | `/v1/task/fetch/by-userId` | `viewAccessCheck` | `fetchaTaskByuserId` | Fetch tasks and subtasks assigned to specific users |
| `POST` | `/v1/task/add-reply` | — | `addReply` | Add a reply to a task comment |
| `POST` | `/v1/task/filter` | `viewAccessCheck` | `filterByKey` | Filter tasks by specific field keys |
| `PUT` | `/v1/task/update/:id` | `editAccessCheck` | `updateTask` | Update task fields by task ID |
| `PUT` | `/v1/task/comment/update/:id` | — | `updateComment` | Edit a specific comment |
| `PUT` | `/v1/task/update-reply` | — | `updateReply` | Edit a reply on a comment |
| `DELETE` | `/v1/task/delete` | `deleteAccessCheck` | `deleteTask` | Delete a single task by ID |
| `DELETE` | `/v1/task/comment/delete` | — | `deleteComment` | Delete a comment from a task |
| `DELETE` | `/v1/task/reply/delete` | — | `deleteReply` | Delete a reply from a comment |
| `DELETE` | `/v1/task/multiDelete` | `deleteAccessCheck` | `multipleTaskDelete` | Bulk delete multiple tasks |

#### Query Parameters for `GET /v1/task/fetch`

| Param | Type | Description |
|---|---|---|
| `projectId` | string | Optional — filters all tasks under a project |
| `Id` | string | Optional — fetches a specific task by ID |
| `CreatedDate` | date | Optional — fetch tasks by creation date |
| `UpdatedDate` | date | Optional — fetch tasks by last updated date |
| `sort` | `asc` / `desc` | Sort direction |
| `order` | enum | Sort field: `taskTitle`, `createdAt`, `category`, `priority`, `taskType`, `stageName`, `assignedTo` |
| `standAloneTask` | `true` / `false` | Fetch only standalone (non-project) tasks |
| `skip` | integer | Pagination offset |
| `limit` | integer | Pagination page size |

#### Query Parameters for `GET /v1/task/search`

| Param | Type | Description |
|---|---|---|
| `keyword` | string | Search keyword |
| `sort` | `asc` / `desc` | Sort direction |
| `order` | enum | Sort field: `taskTitle`, `createdAt`, `createdBy`, `assignedTo`, `priority` |
| `standAloneTask` | `true` / `false` | Filter standalone tasks |
| `skip` / `limit` | integer | Pagination |

#### Query Parameters for `GET /v1/task/fetch-report`

| Param | Type | Description |
|---|---|---|
| `startDate` | date | Report start date |
| `endDate` | date | Report end date |
| `skip` / `limit` | integer | Pagination |

#### Body for `POST /v1/task/filter`

Sends an array of filter keys (e.g., `priority`, `taskStatus`, `taskType`) and their values to filter tasks accordingly.

---

### 8.2 SubTask Routes — `/v1/subtask`

| Method | Endpoint | Guard | Controller | Description |
|---|---|---|---|---|
| `POST` | `/v1/subtask/create` | `createAccessCheck` | `createSubTask` | Create a new subtask linked to a task |
| `POST` | `/v1/subtask/create-comment/:id` | — | `postComment` | Post a comment on a subtask |
| `POST` | `/v1/subtask/add-reply` | — | `addReply` | Add a reply to a subtask comment |
| `POST` | `/v1/subtask/ReportHeaderGrid` | — | `filterSubTask` | Filter subtasks for report grid display |
| `GET` | `/v1/subtask/getAll` | `viewAccessCheck` | `getSubTask` | Get all subtasks (optionally by taskId/projectId) |
| `GET` | `/v1/subtask/search` | `viewAccessCheck` | `searchSubTask` | Search subtasks by keyword |
| `GET` | `/v1/subtask/get-comments` | — | `getComments` | Get all comments for a subtask |
| `PUT` | `/v1/subtask/update/:id` | `editAccessCheck` | `updateSubTask` | Update subtask fields |
| `PUT` | `/v1/subtask/update-comment/:id` | — | `updateComment` | Edit a subtask comment |
| `PUT` | `/v1/subtask/update-reply` | — | `updateReply` | Edit a reply on a subtask comment |
| `DELETE` | `/v1/subtask/delete` | `deleteAccessCheck` | `deleteSubTasks` | Delete a single subtask |
| `DELETE` | `/v1/subtask/delete-comment` | — | `deleteComment` | Delete a subtask comment |
| `DELETE` | `/v1/subtask/delete-reply` | — | `deleteReply` | Delete a reply from a subtask comment |
| `DELETE` | `/v1/subtask/multiDelete` | `deleteAccessCheck` | `multipleSubtaskDelete` | Bulk delete multiple subtasks |

---

### 8.3 Task Type Routes — `/v1/task-type`

Manages the types of tasks (e.g., New Feature, Improvement, Bug, Epic).

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/v1/task-type/create` | `createAccessCheck` | Create a new task type |
| `GET` | `/v1/task-type/fetch` | — | Fetch all task types |
| `GET` | `/v1/task-type/search` | `viewAccessCheck` | Search task types by keyword |
| `PUT` | `/v1/task-type/update/:id` | `editAccessCheck` | Update a task type by ID |
| `DELETE` | `/v1/task-type/delete` | `deleteAccessCheck` | Delete a task type |
| `DELETE` | `/v1/task-type/multi/delete` | — | Bulk delete task types |

> **Note:** A configurable maximum of **5 custom task types** per org is enforced (`customTaskType` in config).

---

### 8.4 Task Status Routes — `/v1/task-status`

Manages task status labels (e.g., Todo, In Progress, Pending, Review, Done, Hold).

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/v1/task-status/create` | `createAccessCheck` | Create a new task status |
| `GET` | `/v1/task-status/fetch` | — | Fetch all task statuses |
| `GET` | `/v1/task-status/search` | `viewAccessCheck` | Search task statuses |
| `PUT` | `/v1/task-status/update/:id` | `editAccessCheck` | Update a task status by ID |
| `DELETE` | `/v1/task-status/delete` | `deleteAccessCheck` | Delete a task status |
| `DELETE` | `/v1/task-status/multi/delete` | — | Bulk delete task statuses |

> **Note:** A configurable maximum of **5 custom task statuses** per org is enforced (`customTaskStatus` in config).

---

### 8.5 Task Stage Routes — `/v1/task-stage`

Manages task stages (e.g., Backlog, Sprint 1, Sprint 2).

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/v1/task-stage/create` | `createAccessCheck` | Create a new task stage |
| `GET` | `/v1/task-stage/get` | — | Fetch task stage(s) |
| `PUT` | `/v1/task-stage/update/:id` | `editAccessCheck` | Update a task stage by ID |
| `DELETE` | `/v1/task-stage/delete` | `deleteAccessCheck` | Delete a task stage |
| `DELETE` | `/v1/task-stage/multi/delete` | — | Bulk delete task stages |

---

### 8.6 Task Category Routes — `/v1/task-category`

Manages task categories (e.g., General, Problem Ticket, Incident, Service Request).

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/v1/task-category/create` | `createAccessCheck` | Create a new task category |
| `GET` | `/v1/task-category/get` | — | Fetch task category by ID |
| `PUT` | `/v1/task-category/update/:id` | `editAccessCheck` | Update a task category by ID |
| `DELETE` | `/v1/task-category/delete` | `deleteAccessCheck` | Delete a task category |
| `DELETE` | `/v1/task-category/multi/delete` | — | Bulk delete task categories |

> **Note:** A configurable maximum of **45 custom task categories** per org is enforced (`customTaskCategory` in config).

---

### 8.7 SubTask Type Routes — `/v1/subtask-type`

Manages subtask type definitions.

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/v1/subtask-type/create` | `createAccessCheck` | Create a new subtask type |
| `GET` | `/v1/subtask-type/get` | — | Fetch all subtask types |
| `PUT` | `/v1/subtask-type/update/:id` | `editAccessCheck` | Update a subtask type by ID |
| `DELETE` | `/v1/subtask-type/delete` | `deleteAccessCheck` | Delete a subtask type |

---

### 8.8 SubTask Status Routes — `/v1/subtask-status`

Manages subtask status definitions.

| Method | Endpoint | Guard | Description |
|---|---|---|---|
| `POST` | `/v1/subtask-status/create` | `createAccessCheck` | Create a new subtask status |
| `GET` | `/v1/subtask-status/get` | — | Fetch all subtask statuses |
| `PUT` | `/v1/subtask-status/update/:id` | `editAccessCheck` | Update a subtask status by ID |
| `DELETE` | `/v1/subtask-status/delete` | `deleteAccessCheck` | Delete a subtask status |

---

## 9. Data Models (MongoDB Schemas)

### 9.1 Task Model — `task_management` collection

```
Field             Type        Description
─────────────────────────────────────────────────────────────────
id                Number      Sequential numeric ID
projectName       String      Name of the associated project
projectId         String      ID of the associated project (null = standalone)
stageName         String      Current stage (e.g., "Sprint 1")
category          String      Task category (General, Problem ticket, Incident, Service Req)
taskTitle         String      Title/name of the task
taskType          String      Task type (New Feature, Improvement, Bug, Epic)
taskDetails       String      Full description / task body
taskCreator       Object      Embedded creator user object
  ├── id          String      User's ID
  ├── orgId       String      Organization ID
  ├── email       String      Creator's email
  ├── firstName   String
  ├── lastName    String
  ├── role        String
  ├── verified    Boolean
  └── profilePic  String
dueDate           Date        Task deadline
estimationTime    String      Time estimation (e.g., "3h")
estimationDate    Date        Estimated completion date
assignedTo        Array       List of assigned user objects (same shape as taskCreator)
attachment        [String]    Array of attachment file URLs/paths
epicLink          [String]    Links to related epics
priority          String      High / Medium (default) / Low
taskStatus        String      Todo / In Progress / Pending / Review / Done / Hold
createdAt         Date        Auto-set on creation
updatedAt         Date        Auto-updated on modification
```

### 9.2 SubTask Model — `subtask_management` collection

```
Field               Type        Description
───────────────────────────────────────────────────────────────────
id                  Number      Sequential numeric ID
projectName         String      Name of the associated project
projectId           String      Project ID
taskId              ObjectId    Reference to parent task in task_management
subTaskStageName    String      Stage name for this subtask
subTaskCategory     String      Category (General, Problem ticket, Incident, etc.)
subTaskTitle        String      Title of the subtask
subTaskType         Number      1=New Feature, 2=Improvement, 3=Bug, 4=Epic (default: 1)
subTaskDetails      String      Detailed description
subTaskCreator      Object      Embedded creator user object (same shape as Task)
dueDate             Date
estimationTime      String
estimationDate      Date
subTaskAssignedTo   Array       Assigned users array
attachment          [String]    Attachment URLs
epicLink            [String]    Epic links
priority            String      High / Medium / Low (default: Medium)
subTaskStatus       Number      Status (number-based, references subTaskStatus collection)
createdAt           Date
updatedAt           Date
```

### 9.3 Metadata Models

The following collections store configurable metadata and are managed via their respective routes. Each document typically contains:

| Collection (approx.) | Route | Key fields |
|---|---|---|
| `taskType` / custom equiv. | `/v1/task-type` | `name`, `isDefault`, `adminId`, `orgId` |
| `taskStatus` / custom equiv. | `/v1/task-status` | `name`, `isDefault`, `adminId`, `orgId` |
| `taskStage` / custom equiv. | `/v1/task-stage` | `name`, `isDefault`, `adminId`, `orgId` |
| `taskCategory` / custom equiv. | `/v1/task-category` | `name`, `isDefault`, `adminId`, `orgId` |
| `subTaskType` | `/v1/subtask-type` | `name`, `adminId` |
| `subTaskStatus` | `/v1/subtask-status` | `name`, `adminId` |

**Default records** (seeded by the platform) have `isDefault: true`. Custom records created by admins have `isDefault: false` and count toward org-specific limits.

### 9.4 External Collections (from other microservices, read-only here)

| Collection | Purpose |
|---|---|
| `adminschemas` | Admin user records; read to resolve `adminId`, `language`, `planName`, `planExpireDate` |
| `permissionschemas` | Permission configurations keyed by `permissionName` |
| `planschemas` | Subscription plan data (limits, features, expiry) |

---

## 10. Utilities

### `utils/common.utils.js`

Central hub of reusable database query helpers used across all services:

| Function | Description |
|---|---|
| `checkCollection(name)` | Verifies a collection exists in the DB; returns DB handle or `null` |
| `insertAndReturnData(db, coll, data)` | Inserts a document and returns the newly created object |
| `isItemExists(db, coll, query)` | Boolean check — does a document matching query exist? |
| `findAllItems(db, coll, query, sort, skip, limit)` | Paginated aggregate query with sort |
| `findAllDocuments(db, coll, adminId, sort, skip, limit)` | Fetches docs matching adminId OR isDefault=true |
| `totalCustomCountForAdmin(db, coll, adminId)` | Count of custom (non-default) records for an admin |
| `totalDefaultCountForAdmin(db, coll, adminId)` | Count of default records for an admin |
| `countAllDocumentsQuery(db, coll)` | Total document count for a collection |
| `searchDocumentsQuery(db, coll, query, sort, skip, limit)` | Aggregation-based search with pagination |
| `findByIdQuery(db, coll, id)` | Find a document by MongoDB `_id` |
| `checkIsDefault(db, coll, id)` | Boolean — is the record a default (non-editable) record? |
| `findByIdAndUpdateQuery(db, coll, id, value)` | Update document by ID, return updated doc |
| `updateByUserQuery(db, coll, id, userId, value)` | Update only if owned by userId and not default |
| `deleteOneByUserQuery(db, coll, id, userId)` | Delete one doc by ID and userId ownership |
| `deleteAllByUserQuery(db, coll, userId)` | Delete all non-default docs for a user |
| `deleteOneByAdminQuery(db, coll, id)` | Delete one doc by ID (admin-level) |
| `deleteAllByAdminQuery(db, coll, adminId)` | Delete all non-default docs for an admin |
| `removeObjectNull(obj)` | Deep cleans null/undefined/empty fields from object |
| `addNewDynamicFields(value, obj)` | Merges dynamic fields from `obj` into `value` |
| `getFieldExist(value, field, coll, db)` | Find documents by a specific field value |
| `viewFields(data, fields, value, obj)` | Projects specific fields from an aggregation result |
| `checkingFieldValues(configFields, enabled, required, unrequired)` | Classifies project custom fields into buckets |
| `filterFieldsValues(data, value)` | Filters data array to include only permitted values |
| `subtractAndFormat(time1, time2)` | Computes `time1 - time2` in `"HH:MM"` format |
| `creatorDetails(creator, coll, db)` | Enriches a creator object with fresh DB-fetched name/pic/status |
| `calculateProgress(subTaskColl, db, taskId)` | Calculates subtask completion % for a task |
| `calculateTaskProgress(db, taskColl, projectId)` | Calculates task completion % for a project |
| `getPermissions(orgId, permissionName)` | Fetches permission doc via Mongoose model |

### `utils/customFields.utils.js`

Handles project-level custom field definitions — enabling/disabling/requiring fields per project configuration.

### `utils/activity.utils.js`

Helper functions for recording and retrieving activity log entries associated with task/subtask changes.

### `utils/reuse.js`

General-purpose reusable helper functions shared across multiple modules.

### `utils/notification.client.js`

Creates and manages a **SockJS client** connection to the notification microservice running at `notification_server_url` (default: `http://localhost:9005/notification`). Used to push real-time notifications when tasks are created, updated, assigned, or deleted.

---

## 11. Notification Client

The server exports a `SockClient` instance in `task.server.js`:

```js
const serverUrl = config.get('notification_server_url');
const SockClient = new SockJsClient(serverUrl);
export default SockClient;
```

This client is imported by service files to emit notification events (e.g., `task assigned`, `comment added`) to the notification microservice, which then pushes them to connected frontend clients via WebSocket.

---

## 12. Logger & Log Rotation

### Winston Logger (`resources/logs/logger.log.js`)

Provides structured logging at multiple levels: `info`, `error`, `warn`, `debug`.

### Morgan HTTP Logger (`task.server.js`)

- **In all environments:** Logs HTTP requests via `morgan('tiny')` to the Winston stream.
- **Non-local environments:** Additionally logs to daily rotating files in `resources/logs/responselogs/` using the pattern `YYYY-MM-DD-logs.log`.

### Log Rotation Settings

| Setting | Value |
|---|---|
| Rotation frequency | Daily |
| Filename pattern | `YYYY-MM-DD-logs.log` |
| Max retention | 7 days |
| Max file size | 100 MB |
| Storage | `resources/logs/responselogs/` |

---

## 13. Local Dev Setup Guide

### Prerequisites

Ensure the following are installed on your machine:

| Tool | Version | Download |
|---|---|---|
| **Node.js** | >= 16.x (LTS recommended) | https://nodejs.org |
| **npm** | >= 8.x (comes with Node) | — |
| **MongoDB** | >= 5.x (running locally) | https://www.mongodb.com/try/download/community |
| **Redis** | >= 6.x (running locally) | https://redis.io/download |
| **nodemon** | (installed via npm) | included in dev script |

---

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd emp-monitor-work-management-api
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

---

### Step 3 — Configure Local Environment

Open `config/localDev.json` and verify / update the following fields:

```json
{
  "mongo": {
    "host": "127.0.0.1",
    "db_name": "WM-Dev",
    "username": "",
    "password": ""
  },
  "redis": {
    "url": "redis://127.0.0.1:6379"
  },
  "task": {
    "port": "9001"
  },
  "notification_server_url": "http://localhost:9005/notification"
}
```

> **If MongoDB requires auth**, add your `username` and `password`. Leave empty for no-auth local setup.
> 
> **If you don't have the notification service running**, the SockJS client will fail to connect but the API itself will still function normally.

---

### Step 4 — Start MongoDB

Make sure your local MongoDB instance is running:

```bash
# Windows (if installed as a service)
net start MongoDB

# Or manually start mongod
mongod --dbpath "C:\data\db"
```

---

### Step 5 — Start Redis

```bash
# Windows (using Redis for Windows or WSL)
redis-server

# Or if using Redis as a Windows service
net start Redis
```

---

### Step 6 — Set the NODE_ENV Variable & Start the Server

```bash
# Windows PowerShell
$env:NODE_ENV="localDev"
npm run dev

# Windows CMD
set NODE_ENV=localDev && npm run dev
```

The `dev` script runs:
```bash
node ./resources/views/swagger.config.js && nodemon task.server.js
```

This will:
1. **Generate** the Swagger JSON file (`resources/views/swagger-api-view.json`) from JSDoc annotations in the controllers
2. **Start** the server with `nodemon` for hot-reloading on file changes

---

### Step 7 — Verify the Server is Running

Open your browser or use curl:

```bash
# Health check
curl http://localhost:9001/
# Expected: Working.......!

# Swagger UI (requires auth: admin/admin)
http://localhost:9001/explorer
```

---

### Swagger UI Access

| URL | `http://localhost:9001/explorer` |
|---|---|
| **Username** | `admin` |
| **Password** | `admin` |

> Credentials are configurable in `config/localDev.json` → `SWAGGER_AUTH`.

Once logged in, click **Authorize** in Swagger UI and enter your `x-access-token` JWT to test authenticated routes.

---

### Common Issues & Fixes

| Problem | Fix |
|---|---|
| `Error: connect ECONNREFUSED 127.0.0.1:27017` | MongoDB is not running. Start it with `mongod`. |
| `Error: connect ECONNREFUSED 127.0.0.1:6379` | Redis is not running. Start it with `redis-server`. |
| `MongoServerError: Authentication failed` | Check `username`/`password` in `localDev.json`. |
| `config` module can't find config | Ensure `NODE_ENV=local` is set before running. |
| `swagger-api-view.json not found` | Run `node ./resources/views/swagger.config.js` manually first. |
| Port `9001` already in use | Change `task.port` in `config/localDev.json` or kill the process using the port. |
| `Invalid access token` on all routes | Pass a valid JWT in the `x-access-token` header. Use Swagger UI Authorize button. |
| SockJS connection error | Notification microservice is not running. Safe to ignore for task API testing. |

---

### NPM Scripts Reference

| Script | Command | Description |
|---|---|---|
| `npm run dev` | `node ./resources/views/swagger.config.js && nodemon task.server.js` | Generate Swagger + start dev server with hot reload |

---

### Environment Variables

| Variable | Description | Example |
|---|---|---|
| `NODE_ENV` | Selects which config file to load | `local`, `predevelopment`, `production` |
| `IS_DEBUGGING` | If set, prints `__filename` on startup | `true` |

---

*This document covers the complete API surface, data models, middleware pipeline, utilities, and local development setup for the EmpMonitor Task Management API. Keep this file updated as new features and routes are added.*
