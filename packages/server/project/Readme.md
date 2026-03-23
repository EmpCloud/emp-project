# 📋 EmpMonitor Work Management API — Project Status & Documentation

> **Project:** `empmonitor-project-management`
> **Version:** 1.0.0
> **Author:** Jagadeesha Ravibabu
> **Runtime:** Node.js (ESM modules)
> **Database:** MongoDB (Mongoose)
> **Cache:** Redis
> **Last Updated:** 2026-03-23

---

## 📁 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Project Folder Structure](#3-project-folder-structure)
4. [Configuration](#4-configuration)
5. [Entry Point — project.server.js](#5-entry-point)
6. [Middleware](#6-middleware)
7. [All API Routes — Full Reference](#7-all-api-routes)
   - [Admin](#71-admin---v1admin)
   - [Auth / Unauthorized](#72-auth--unauthorized---v1)
   - [Social Login](#73-social-login---v1social)
   - [Password](#74-password---v1password)
   - [Plan](#75-plan---v1plan)
   - [Admin Config](#76-admin-config---v1admin-config)
   - [Project](#77-project---v1project)
   - [Roles](#78-roles---v1role)
   - [Permissions](#79-permissions---v1permission)
   - [Users](#710-users---v1user)
   - [Client](#711-client---v1client)
   - [Groups](#712-groups---v1groups)
   - [Dashboard](#713-dashboard---v1dashboard-view)
   - [Shortcut Keys](#714-shortcut-keys---v1shortcut-key)
   - [Chat Channel](#715-chat-channel---v1chat-channel)
   - [Messages](#716-messages---v1messages)
   - [Activity Log](#717-activity-log---v1activity)
   - [Custom Fields](#718-custom-fields---v1custom)
   - [Calendar](#719-calendar---v1calendar)
   - [Notifications](#720-notifications---v1notifications)
   - [Upload](#721-upload---v1upload)
   - [Language](#722-language---v1)
   - [Table / Screen Config](#723-table--screen-config---v1table-config)
   - [Default Screen Config](#724-default-screen-config---v1table-config)
   - [Profile](#725-profile---v1profile)
   - [Auto Report](#726-auto-report---v1report)
   - [Swagger Explorer](#727-swagger-explorer)
8. [Cron Jobs](#8-cron-jobs)
9. [Utilities](#9-utilities)
10. [Mail Service](#10-mail-service)
11. [Local Development Setup](#11-local-development-setup)

---

## 1. Project Overview

**EmpMonitor Work Management API** is a complete backend REST API for an employee work-management platform. It handles:

- 🏢 **Admin registration, login, email verification & social OAuth**
- 👥 **User (employee) management with roles & granular permissions**
- 📂 **Project & task/sub-task life-cycle tracking with analytics**
- 📋 **Plans & subscription management with expiry enforcement**
- 💬 **Real-time chat channels (private/group) and messaging with file attachments**
- 📅 **Calendar events**
- 🔔 **In-app notifications**
- 📁 **File uploads to Google Cloud Storage**
- 📊 **Auto-generated scheduled email reports**
- 🔑 **Shortcut keys configuration per organisation**
- 🌐 **Multi-language support**
- 📈 **Activity logs with cron-based cleanup**

The server is built with **Express.js** (ESM), connects to **MongoDB** via Mongoose, uses **Redis** for permission caching, and exposes a **Swagger UI** for API exploration.

---

## 2. Technology Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Runtime | Node.js (ESM) | Latest LTS |
| Framework | Express.js | 4.18.x |
| Database | MongoDB + Mongoose | 6.7.x |
| Cache | Redis | 4.6.x |
| Authentication | JWT (jsonwebtoken) | 9.0.x |
| File Upload | Multer | 1.4.x |
| Cloud Storage | Google Cloud Storage | 6.7.x |
| Email | SendGrid | 7.7.x |
| PDF Generation | pdfmake, pdfkit, pdf-lib | Latest |
| Excel Export | xlsx | 0.18.x |
| CSV Export | csv-writer | 1.6.x |
| Logging | Winston + Morgan + DailyRotate | Latest |
| Cron Jobs | cron | 2.2.x |
| Validation | Joi + @joi/date | 17.x |
| Swagger | swagger-autogen + swagger-ui-express | Latest |
| Security | Helmet + Compression | Latest |
| Social Auth | Google OAuth2, Facebook, Twitter | Latest |

---

## 3. Project Folder Structure

```
Project/
├── project.server.js            # Application entry point
├── package.json                 # Dependencies & scripts
├── storageconfig.json           # Google Cloud Storage config
├── jwt.service.js               # JWT token generation helper
├── tokenVerify.js               # Standalone token verify utility
│
├── config/                      # Environment-specific config files
│   └── localDev.json            # Local development configuration
│
├── core/                        # All feature modules (27 modules)
│   ├── activity/                # Activity log module
│   ├── admin/                   # Admin authentication & management
│   ├── autoReport/              # Scheduled report generation
│   ├── calendar/                # Calendar events
│   ├── chatChannel/             # Chat channel management
│   ├── client/                  # Client & company management
│   ├── config/                  # Admin-level configuration
│   ├── customFields/            # Dynamic custom fields
│   ├── dashBoard/               # Dashboard config
│   ├── defaultScreenConfig/     # Default table/screen config
│   ├── event/                   # Event handling
│   ├── groups/                  # User groups
│   ├── language/                # Language settings
│   ├── messages/                # Chat messages
│   ├── notifications/           # In-app notifications
│   ├── password/                # Password utilities
│   ├── pdf-maker/               # PDF generation helpers
│   ├── permissions/             # Permission definitions
│   ├── plan/                    # Subscription plan management
│   ├── profile/                 # User/admin profile
│   ├── project/                 # Project CRUD + comments + analytics
│   ├── roles/                   # Role management
│   ├── shortcutKeys/            # Shortcut key configuration
│   ├── socialLogin/             # OAuth integrations
│   ├── unauthorized/            # Public auth routes (login, verify, etc.)
│   ├── upload/                  # File upload to GCS
│   └── users/                   # Employee/user management
│
├── cronJobs/                    # Scheduled background jobs
│   ├── cronSchedule.js          # Job registration & scheduler
│   ├── allActivity.cronjobs.js  # Activity cleanup jobs
│   ├── autoSendReports.cronjobs.js # Auto email report sender
│   └── restore.cronjobs.js      # Data restore job
│
├── mailService/                 # Email templates & service
├── middleware/                  # Express middleware
│   ├── verifyToken.js           # JWT verification (admin + user)
│   ├── userToken.js             # User-specific token middleware
│   ├── permissionMiddleware.js  # CRUD permission guards
│   ├── permissionConfigChecker.js
│   ├── multerFileUpload.js      # File upload validation
│   ├── rateLimitter.js          # API rate limiting
│   └── routeChecker.js         # Route access checker
│
├── resources/
│   ├── database/
│   │   ├── mongo.database.js    # MongoDB initializer
│   │   ├── mongo.connect.js     # Mongoose connection logic
│   │   └── redis.connect.js     # Redis client connection
│   ├── logs/                    # Winston log output
│   │   └── responselogs/        # HTTP access logs (rotated daily)
│   ├── routes/
│   │   └── public.routes.js     # Main router registry
│   └── views/
│       ├── swagger-api-view.json # Auto-generated Swagger spec
│       ├── swagger.config.js    # Swagger auto-gen config
│       └── swaggerAuth.js       # Basic auth for Swagger UI
│
├── response/
│   └── response.js              # Standardised response helpers
│
├── public/                      # Static file serving (uploads)
│   └── uploadsFile/
│       └── userFile/            # Bulk user import files
│
└── utils/                       # Reusable utility helpers
    ├── activity.utils.js
    ├── admin.utils.js
    ├── calendar.utils.js
    ├── customFields.utils.js
    ├── notification.client.js   # SockJS notification client
    ├── passwordEncoderDecoder.js
    ├── project.utils.js
    ├── reuse.js
    ├── social.utils.js
    ├── twitter.utils.js
    └── user.utils.js
```

---

## 4. Configuration

All configuration is managed by the `config` npm package. The active config file is selected via the `NODE_ENV` environment variable.

| ENV value | Config file |
|-----------|-------------|
| `local` (default) | `config/localDev.json` |
| `development` | `config/development.json` |
| `production` | `config/production.json` |

### Key `localDev.json` values

| Key | Value | Description |
|-----|-------|-------------|
| `project.port` | `9000` | Server port |
| `project.host_url` | `localhost:9000` | Base URL |
| `mongo.host` | `140.245.23.118` | MongoDB host |
| `mongo.db_name` | `WorkForceManagement` | Database name |
| `mongo.username` | `apluser` | DB username |
| `mongo_atlas_enabled` | `false` | Use Atlas connection string instead |
| `token_secret` | `SAkjSOciObOard_7541` | Admin JWT secret |
| `user_token_secret` | `SAkjSsad33_sajfkf` | User JWT secret |
| `redis.url` | `redis://localhost:6379` | Redis connection |
| `notification_server_url` | `http://localhost:9000` | SockJS server |
| `swagger_host_url` | `localhost:9000` | Swagger UI host |
| `role_limit` | `9` | Max roles per org |
| `permission_limit` | `5` | Max permission sets |
| `limit` | `10` | Default pagination limit |
| `file.max_image_size` | `4` (MB) | Image upload limit |
| `file.max_doc_size` | `10` (MB) | Document upload limit |
| `file.upload_count` | `10` | Max files per upload |
| `sendgrid.email` | `admin@empmonitor.com` | From email |
| `bucketName` | `work-force-management` | GCS bucket |
| `SWAGGER_AUTH` | `{ admin: "admin" }` | Swagger basic auth |

---

## 5. Entry Point

### `project.server.js`

This is the main application bootstrap file. On startup it:

1. **Initialises Express** with all global middleware (CORS, Helmet, Compression, Body Parser, Cookie Parser)
2. **Loads Swagger spec** from `resources/views/swagger-api-view.json`
3. **Configures Morgan HTTP logger** with daily rotating file streams
4. **Connects to MongoDB** via `MongoConnect.initialize()`
5. **Registers all routes** via `new Routes(app)` from `public.routes.js`
6. **Starts cron jobs** via `cronJobActivity.initializeCronJobs()`
7. **Starts the HTTP server** on the configured port
8. **Initialises the SockJS notification client** for real-time notifications
9. **Handles global process events**: `unhandledRejection`, `uncaughtException`, `warning`

```
GET /                → Returns "Working.......!"  (health check)
GET /explorer        → Swagger UI (Basic Auth protected)
```

---

## 6. Middleware

### `verifyToken.js` — JWT Authentication Guard

Applied globally to **all protected routes** (mounted after the public routes).

- Reads the `x-access-token` header
- First tries to verify with `token_secret` (admin token)
- Falls back to `user_token_secret` (employee/user token)
- On success: attaches `req.verified` with `userData` and `type`
- Fetches the admin's active `planData` from MongoDB
- Validates plan expiry — returns `402` if expired (with exceptions for plan/billing routes)
- Caches permission config in Redis under `{email}_permissions`

### `permissionMiddleware.js` — CRUD Permission Guards

Four middleware functions protecting routes based on the user's role:

| Middleware | What it checks |
|---|---|
| `viewAccessCheck` | User has **view** permission |
| `createAccessCheck` | User has **create** permission |
| `editAccessCheck` | User has **edit** permission |
| `deleteAccessCheck` | User has **delete** permission |

### `userToken.js`
Token verification limited to user tokens only (for plan-related routes).

### `multerFileUpload.js`
Validates file MIME types, sizes, and counts before uploading messages.

### `rateLimitter.js`
Rate-limits sensitive endpoints (e.g., admin sign-in) using a sliding window.

### `routeChecker.js`
Verifies route-level access based on the plan's allowed features.

---

## 7. All API Routes

> **Base URL:** `http://localhost:9000`
> **Auth Header:** `x-access-token: <jwt_token>`
>
> Routes marked 🔓 are **public** (no token required).
> Routes marked 🔐 require the **verifyToken** middleware.
> Routes marked 📋 additionally require a **permission check**.

---

### 7.1 Admin — `/v1/admin`

Handles admin account creation, authentication, email verification, and password management.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/admin/add` | 🔓 | Register a new admin organisation account. Creates an admin record, sends email verification mail. |
| `POST` | `/v1/admin/fetch` | 🔓 | Fetch admin details by email or orgId (used for login flow). |
| `POST` | `/v1/admin/isEmp-user` | 🔓 | Checks whether a given user exists in the EmpMonitor system (cross-service call to EmpMonitor API). |
| `POST` | `/v1/admin/verify-admin` | 🔓 | Verifies admin email via activation link token and activates the account. |
| `POST` | `/v1/admin/is-email-exist` | 🔓 | Checks if an email is already registered. |
| `POST` | `/v1/admin/is-org-exist` | 🔓 | Checks if an organisation name is already taken. |
| `POST` | `/v1/admin/forgot-password-mail` | 🔓 | Sends a password reset email to the admin. |
| `POST` | `/v1/admin/reset-password` | 🔓 | Resets admin password using the link token. |
| `POST` | `/v1/admin/email-verification-token-generate` | 🔓 | Re-generates and re-sends the verification email. |
| `POST` | `/v1/admin/signIn-signUp` | 🔓 | Combined sign-in / sign-up flow (also handles EmpMonitor user onboarding). |
| `PUT` | `/v1/admin/update` | 🔐 | Update admin profile details (name, org info, etc.). |
| `PUT` | `/v1/admin/update-password` | 🔐 | Change admin password while authenticated. |
| `DELETE` | `/v1/admin/delete-admin` | 🔐 | Soft-delete the admin account and all related data. |

---

### 7.2 Auth / Unauthorized — `/v1/`

Public authentication routes for **member/employee** users.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/verify-user` | 🔓 | Verify member's email link (activation token). |
| `POST` | `/v1/set-password` | 🔓 | Set initial password for a newly invited user. |
| `POST` | `/v1/user-login` | 🔓 | Employee login — returns JWT token on success. |
| `POST` | `/v1/forgot-password` | 🔓 | Sends password reset email to the member. |
| `PUT` | `/v1/reset-password` | 🔓 | Resets the member's password via token. |
| `POST` | `/v1/generate-token` | 🔓 | Re-sends email verification token to the member. |
| `PUT` | `/v1/update-password` | 🔐 | Updates member password while authenticated. |

---

### 7.3 Social Login — `/v1/social`

OAuth 2.0 flows for Google, Facebook, and Twitter.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/social/social-login` | 🔓 | Generic social login redirect initiator. |
| `POST` | `/v1/social/google-callback` | 🔓 | Handles Google OAuth2 callback; exchanges code for user info, signs in or registers the admin. |
| `POST` | `/v1/social/facebook-callback` | 🔓 | Handles Facebook login callback; fetches email & profile and signs in. |
| `POST` | `/v1/social/twitter-callback` | 🔓 | Handles Twitter OAuth callback. |

---

### 7.4 Password — `/v1/password`

Utility for fetching password policy information.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/password/get` | 🔓 | Retrieves the current password policy/requirements for the organisation. |

---

### 7.5 Plan — `/v1/plan`

Subscription plan management, including upgrading, downgrading, and expiry handling.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/plan/get` | 🔐 | Fetch all available subscription plans. |
| `GET` | `/v1/plan/downgrade-info` | 🔐 | Returns information about what data will be lost on plan downgrade. |
| `POST` | `/v1/plan/select` | 🔐 | Assign/purchase a plan for the organisation. |
| `GET` | `/v1/plan/get-history` | 🔐 | Fetch the plan purchase history for the organisation. |
| `PUT` | `/v1/plan/delete/data` | 🔐 | Deletes excess data after downgrade (trimming users/projects to new limits). |
| `PUT` | `/v1/plan/expire/date` | 🔐 | Manually update the plan expiry date (admin use). |
| `GET` | `/v1/plan/usage` | 🔐 | Returns current resource usage vs plan limits (users, projects, storage). |
| `GET` | `/v1/plan/project-downgrade-info` | 🔐 | Returns project data that exceeds the new plan's project limit. |
| `GET` | `/v1/plan/User-downgrade-info` | 🔐 | Returns user data that exceeds the new plan's user limit. |
| `DELETE` | `/v1/plan/delete-downgraded-projects` | 🔐 | Bulk-deletes projects that exceed the downgraded plan's limit. |

---

### 7.6 Admin Config — `/v1/admin-config`

Organisation-level configuration saved by the admin (e.g., task stages, task types, categories).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/admin-config/create` | 🔐📋 | Create a new admin-level configuration record for the org. |
| `GET` | `/v1/admin-config/fetch` | 🔐📋 | Retrieve admin configuration for the org. |
| `PUT` | `/v1/admin-config/update` | 🔐📋 | Update an existing admin configuration. |

---

### 7.7 Project — `/v1/project`

Full project life-cycle management including comments, analytics, and time tracking.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/project/create` | 🔐📋 | Create a new project within the organisation. |
| `GET` | `/v1/project/fetch` | 🔐📋 | Fetch all projects (with pagination) for the organisation. |
| `GET` | `/v1/project/search` | 🔐📋 | Full-text search across project names and descriptions. |
| `POST` | `/v1/project/filter` | 🔐📋 | Filter projects by status, date, assignees, tags, etc. |
| `GET` | `/v1/project/stat` | 🔐📋 | Project statistics (total, active, completed, overdue). |
| `GET` | `/v1/project/exist` | 🔐📋 | Check if a project with a given name already exists. |
| `GET` | `/v1/project/status` | 🔐📋 | Get all possible project statuses. |
| `GET` | `/v1/project/totalTime/fetch` | 🔐📋 | Calculate and return total time logged against a project. |
| `GET` | `/v1/project/userdetails` | 🔐📋 | Fetch individual user progress within a project (tasks completed, pending). |
| `GET` | `/v1/project/analytics` | 🔐 | Detailed analytics for a project (burn-down, velocity, time distribution). |
| `PUT` | `/v1/project/update/:id` | 🔐📋 | Update project details by project ID. |
| `PUT` | `/v1/project/remove-member/:id` | 🔐📋 | Remove a member from a project. |
| `DELETE` | `/v1/project/delete` | 🔐📋 | Soft-delete a project. |
| `DELETE` | `/v1/project/multiDelete` | 🔐📋 | Bulk-delete multiple projects. |
| **Comments** | | | |
| `POST` | `/v1/project/comment-post` | 🔐 | Add a comment to a project. |
| `POST` | `/v1/project/comment-reply` | 🔐 | Add a reply to an existing comment. |
| `GET` | `/v1/project/comment-get` | 🔐 | Fetch all comments for a project. |
| `PUT` | `/v1/project/comment-update` | 🔐 | Edit a comment. |
| `PUT` | `/v1/project/comment-reply-update` | 🔐 | Edit a reply. |
| `DELETE` | `/v1/project/comment-delete` | 🔐 | Delete a comment. |
| `DELETE` | `/v1/project/reply-delete` | 🔐 | Delete a reply. |

---

### 7.8 Roles — `/v1/role`

Role management for RBAC (Role-Based Access Control).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/role/create` | 🔐📋 | Create a new role (max 9 per org). |
| `GET` | `/v1/role/fetch` | 🔐📋 | Fetch all roles for the organisation. |
| `GET` | `/v1/role/fetch-role-by-permission` | 🔐📋 | Fetch roles filtered by their associated permission set. |
| `GET` | `/v1/role/search` | 🔐📋 | Search roles by name. |
| `POST` | `/v1/role/filter` | 🔐📋 | Filter roles with advanced criteria. |
| `PUT` | `/v1/role/update` | 🔐📋 | Update role name or assigned permission. |
| `DELETE` | `/v1/role/delete` | 🔐📋 | Delete a role. |
| `DELETE` | `/v1/role/multi/delete` | 🔐📋 | Bulk-delete multiple roles. |

---

### 7.9 Permissions — `/v1/permission`

Permission set management. Permissions define what actions each role can perform.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/permission/create` | 🔐📋 | Create a new permission configuration set. |
| `GET` | `/v1/permission/fetch` | 🔐 | Fetch all permission sets for the organisation. |
| `GET` | `/v1/permission/search` | 🔐 | Search permissions by name. |
| `PUT` | `/v1/permission/update` | 🔐📋 | Update an existing permission set. |
| `PUT` | `/v1/permission/additional` | 🔐 | Add new permission config entries (e.g., when new features are released). |
| `POST` | `/v1/permission/addPermissionConfigs` | 🔐 | Seed default permission config structure into an existing permission. |
| `DELETE` | `/v1/permission/delete` | 🔐📋 | Delete a permission set. |
| `DELETE` | `/v1/permission/multi/delete` | 🔐📋 | Bulk-delete multiple permission sets. |

---

### 7.10 Users — `/v1/user`

Employee (member) management including CRUD, suspension, bulk ops, and profile management.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/user/create` | 🔐📋 | Invite and create a new user. Sends a verification email. |
| `GET` | `/v1/user/fetch` | 🔐 | Fetch all users for the organisation. |
| `GET` | `/v1/user/fetch-users-by-roles` | 🔐📋 | Fetch users filtered by their assigned role. |
| `GET` | `/v1/user/search` | 🔐 | Search users by name or email. |
| `POST` | `/v1/user/filter` | 🔐 | Filter users by department, role, status, etc. |
| `GET` | `/v1/user/fetch-emp-users` | 🔐📋 | Fetch users from EmpMonitor (cross-service call). |
| `GET` | `/v1/user/recoverable-users` | 🔐📋 | List soft-deleted users that can be recovered. |
| `GET` | `/v1/user/stat` | 🔐📋 | User statistics (total, active, suspended, deleted). |
| `GET` | `/v1/user/fetch/suspend` | 🔐📋 | Fetch suspended users. |
| `PUT` | `/v1/user/update` | 🔐📋 | Update user details (name, role, email, etc.). |
| `PUT` | `/v1/user/restore-users` | 🔐📋 | Restore previously soft-deleted users. |
| `PUT` | `/v1/user/user-suspend` | 🔐 | Suspend or un-suspend a user. |
| `PUT` | `/v1/user/update-profile` | 🔐 | User updates their own profile (avatar, name). |
| `PUT` | `/v1/user/update-password` | 🔐 | User updates their own password. |
| `POST` | `/v1/user/resend-verify-mail` | 🔐 | Re-send the email verification mail to a user. |
| `DELETE` | `/v1/user/delete` | 🔐📋 | Soft-delete a user. |
| `DELETE` | `/v1/user/multi/delete` | 🔐📋 | Bulk soft-delete multiple users. |
| `DELETE` | `/v1/user/force-delete-users` | 🔐📋 | Permanently delete users (hard delete). |
| **Bulk Ops** | | | |
| `POST` | `/v1/user/bulk-register` | 🔐📋 | Bulk-import users from an Excel/CSV file (Multer: `files`). |
| `GET` | `/v1/user/downloadForBulkUpdate` | 🔐📋 | Download the current user data as a template Excel file for bulk update. |
| `POST` | `/v1/user/bulk-update` | 🔐📋 | Bulk-update users from an uploaded Excel/CSV file. |

---

### 7.11 Client — `/v1/client`

Client and company management for project billing and relationship tracking.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/client/add-client` | 🔐📋 | Add a new client contact. |
| `POST` | `/v1/client/add-company` | 🔐📋 | Add a new company associated with clients. |
| `GET` | `/v1/client/fetch-client` | 🔐📋 | Fetch all clients for the organisation. |
| `GET` | `/v1/client/fetch-company` | 🔐📋 | Fetch all companies. |
| `GET` | `/v1/client/report` | 🔐 | Generate a client-level report with project/time summary. |
| `PUT` | `/v1/client/update-client` | 🔐📋 | Update client information. |
| `PUT` | `/v1/client/update-company` | 🔐📋 | Update company information. |
| `DELETE` | `/v1/client/delete-client` | 🔐📋 | Delete a client record. |

---

### 7.12 Groups — `/v1/groups`

User group management (departments, teams, etc.).

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/groups/create` | 🔐📋 | Create a new group. |
| `GET` | `/v1/groups/fetch` | 🔐 | Fetch all groups for the organisation. |
| `GET` | `/v1/groups/search` | 🔐 | Search groups by name. |
| `POST` | `/v1/groups/filter` | 🔐📋 | Filter groups. |
| `PUT` | `/v1/groups/update` | 🔐 | Update group details or membership. |
| `DELETE` | `/v1/groups/delete` | 🔐📋 | Delete a group. |
| `DELETE` | `/v1/groups/multi/delete` | 🔐📋 | Bulk-delete multiple groups. |

---

### 7.13 Dashboard — `/v1/dashboard-view`

Dashboard widget layout configuration per admin/user.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/dashboard-view/config` | 🔐📋 | Create or switch the dashboard configuration (widget layout). |
| `GET` | `/v1/dashboard-view/config-get` | 🔐📋 | Fetch the current dashboard configuration. |
| `PUT` | `/v1/dashboard-view/config-update` | 🔐📋 | Update the dashboard configuration. |

---

### 7.14 Shortcut Keys — `/v1/shortcut-key`

Custom keyboard shortcut configuration per organisation.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/shortcut-key/create` | 🔐📋 | Create a new shortcut key mapping. |
| `GET` | `/v1/shortcut-key/get` | 🔐📋 | Fetch all shortcut key mappings. |
| `PUT` | `/v1/shortcut-key/update` | 🔐📋 | Update a shortcut key mapping. |
| `DELETE` | `/v1/shortcut-key/delete` | 🔐📋 | Delete a shortcut key mapping. |

---

### 7.15 Chat Channel — `/v1/chat-channel`

Private and group chat channel management.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/chat-channel/private` | 🔐📋 | Create a private (1-on-1) chat channel. |
| `POST` | `/v1/chat-channel/group` | 🔐📋 | Create a group chat channel with multiple members. |
| `GET` | `/v1/chat-channel/fetch` | 🔐📋 | Fetch all channels accessible to the authenticated user. |
| `GET` | `/v1/chat-channel/fetch-users` | 🔐📋 | Fetch all users available to start a chat with. |
| `GET` | `/v1/chat-channel/group-members` | 🔐📋 | Fetch members of a specific group channel. |
| `PUT` | `/v1/chat-channel/group-rename` | 🔐📋 | Rename a group channel. |
| `PUT` | `/v1/chat-channel/group-remove` | 🔐📋 | Remove a member from a group channel. |
| `PUT` | `/v1/chat-channel/group-add` | 🔐📋 | Add a new member to a group channel. |
| `DELETE` | `/v1/chat-channel/delete` | 🔐📋 | Delete a chat channel. |

---

### 7.16 Messages — `/v1/messages`

Messaging within chat channels, including polls and file attachments.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/messages/fetch` | 🔐📋 | Fetch messages for a channel (paginated). |
| `POST` | `/v1/messages/send` | 🔐📋 | Send a text message in a channel. |
| `POST` | `/v1/messages/forward` | 🔐📋 | Forward a message to another channel. |
| `POST` | `/v1/messages/poll-create` | 🔐📋 | Create a poll message in a channel. |
| `POST` | `/v1/messages/upload` | 🔐📋 | Upload and send file attachments in a channel (Multer). |
| `PUT` | `/v1/messages/edit` | 🔐📋 | Edit an existing message. |
| `PUT` | `/v1/messages/poll-vote` | 🔐📋 | Cast a vote on a poll message. |
| `DELETE` | `/v1/messages/delete` | 🔐📋 | Delete a message. |

---

### 7.17 Activity Log — `/v1/activity`

Tracks all organisation-level actions for audit purposes.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/activity/fetch` | 🔐 | Fetch activity logs (paginated) for the organisation. |
| `GET` | `/v1/activity/search` | 🔐 | Search activity logs by action, user, or entity. |
| `POST` | `/v1/activity/filter` | 🔐 | Filter activity records by date range, user, module, etc. |

---

### 7.18 Custom Fields — `/v1/custom`

Dynamic custom field configuration per organisation for extending entity schemas.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/custom/fields/fetch` | 🔐📋 | Fetch all custom field definitions for the organisation. |
| `POST` | `/v1/custom/fields/create` | 🔐📋 | Add a new dynamic custom field. |
| `POST` | `/v1/custom/fields/update` | 🔐📋 | Update the configuration of existing custom fields (enable/disable, rename). |
| `POST` | `/v1/custom/fields/view/update` | 🔐📋 | Update the visibility/display settings of custom fields in table views. |

---

### 7.19 Calendar — `/v1/calendar`

Calendar event management per organisation or user.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/calendar/add-event` | 🔐 | Add a new calendar event (meeting, deadline, etc.). |
| `GET` | `/v1/calendar/get-events` | 🔐 | Fetch all calendar events for the organisation/user. |
| `GET` | `/v1/calendar/search-events` | 🔐 | Search events by title or date. |
| `POST` | `/v1/calendar/filter` | 🔐 | Filter events by date range, assignees, type. |
| `PUT` | `/v1/calendar/update-event/:id` | 🔐 | Update a calendar event by ID. |
| `DELETE` | `/v1/calendar/delete-events` | 🔐 | Delete one or more calendar events. |

---

### 7.20 Notifications — `/v1/notifications`

In-app notification management.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/notifications/get` | 🔐 | Fetch all notifications for the authenticated user. |
| `PUT` | `/v1/notifications/mark-read` | 🔐 | Mark one or all notifications as read. |
| `DELETE` | `/v1/notifications/delete` | 🔐 | Delete one or more notifications. |

---

### 7.21 Upload — `/v1/upload`

File upload and management using Google Cloud Storage.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/upload/upload-file` | 🔐 | Upload one or more files to GCS. Accepts `multipart/form-data` with field name `files`. Returns public URLs. Multer stores in memory before streaming to GCS. |
| `GET` | `/v1/upload/getFiles` | 🔐 | List all uploaded files for the organisation from GCS. |
| `DELETE` | `/v1/upload/delete-files` | 🔐 | Delete one or more files from GCS by their names/URLs. |

---

### 7.22 Language — `/v1/`

Sets the preferred display language for the admin's organisation.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `PUT` | `/v1/language` | 🔐 | Update the language preference for the organisation (e.g., `en`, `es`, `fr`). |

---

### 7.23 Table / Screen Config — `/v1/table-config`

User-level table column and view configuration.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/table-config/fetch-default-config` | 🔐 | Fetch the default screen/table column configuration. |
| `PUT` | `/v1/table-config/update-default-config` | 🔐 | Update/save a user's table column preferences. |

---

### 7.24 Default Screen Config

> Same base path `/v1/table-config` — see section 7.23 above.

---

### 7.25 Profile — `/v1/profile`

Authenticated user's complete profile fetching.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/v1/profile/fetch` | 🔐 | Fetch full profile of the authenticated admin or user, including plan, permissions, and org info. |

---

### 7.26 Auto Report — `/v1/report`

Automated scheduled email report configuration and management.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/v1/report/create` | 🔐 | Configure a new auto-report schedule (recipients, frequency, content). Creates or updates the cron job. |
| `GET` | `/v1/report/get` | 🔐 | Fetch the current auto-report configuration. |
| `PUT` | `/v1/report/update` | 🔐 | Update an existing report schedule. |
| `POST` | `/v1/report/testmail` | 🔐 | Send a test report email immediately to validate the configuration. |
| `DELETE` | `/v1/report/delete` | 🔐 | Delete the auto-report configuration and stop the associated cron job. |

---

### 7.27 Swagger Explorer

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/explorer` | Basic Auth | Swagger UI for interactive API exploration. Credentials defined in `SWAGGER_AUTH` config (`admin:admin` in localDev). |

---

## 8. Cron Jobs

All cron jobs are registered in `cronJobs/cronSchedule.js` and start automatically when the server boots.

### 8.1 Activity Cleanup Jobs

Run **daily at midnight** (`0 0 0 * * *` — Asia/Kolkata timezone).

| Job | Function | Description |
|-----|----------|-------------|
| `checkPlanActivity` | `planActivityRemove` | Removes old plan-related activity log entries beyond retention threshold. |
| `checkProjectActivity` | `projectActivityRemove` | Cleans up project activity logs. |
| `checkPermissionActivity` | `permissionActivityRemove` | Cleans up permission-related activity logs. |
| `checkConfigActivity` | `configActivityRemove` | Cleans up admin config activity logs. |
| `userActivityRemove` | `userActivityRemove` | Removes stale user activity logs. |
| `taskActivityRemove` | `taskActivityRemove` | Removes task activity logs. |
| `subTaskActivityRemove` | `subTaskActivityRemove` | Removes sub-task activity logs. |
| `adminActivityRemove` | `adminActivityRemove` | Removes admin activity logs. |
| `subTaskStatusActivityRemove` | `subTaskStatusActivityRemove` | Sub-task status change log cleanup. |
| `subTaskTypeActivityRemove` | `subTaskTypeActivityRemove` | Sub-task type change log cleanup. |
| `TaskCategoryActivityRemove` | `TaskCategoryActivityRemove` | Task category activity cleanup. |
| `TaskStageActivityRemove` | `TaskStageActivityRemove` | Task stage activity cleanup. |
| `TaskStatusActivityRemove` | `TaskStatusActivityRemove` | Task status change activity cleanup. |
| `TaskTypeActivityRemove` | `TaskTypeActivityRemove` | Task type activity cleanup. |

### 8.2 Auto Report Jobs

Dynamic cron jobs created at runtime based on user-defined report schedules.

| Function | Description |
|----------|-------------|
| `initializeCronJobs()` | On server start, reads all `autoReport` documents from MongoDB and spins up a cron job for each (Daily/Weekly/Monthly). |
| `createOrUpdateCronJob(Id, time, frequency)` | Creates or replaces a cron job for a given report config. |
| `deleteCronJob(Id, frequency)` | Stops and removes a cron job when a report is deleted. |

**Frequencies supported:**
- `Daily` → `0 <min> <hour> * * *`
- `Weekly` → `0 <min> <hour> * * 0` (Sunday)
- `Monthly` → `0 <min> <hour> 1 * *` (1st of month)

---

## 9. Utilities

Located in `utils/`, these are shared helper modules used across multiple features.

| File | Description |
|------|-------------|
| `activity.utils.js` | Creates activity log entries for various actions. |
| `admin.utils.js` | Admin-related helpers (org lookup, plan checks). |
| `calendar.utils.js` | Date/time formatting and calendar helpers. |
| `customFields.utils.js` | Processes and validates dynamic custom field data. |
| `notification.client.js` | SockJS client that connects to the notification server and publishes events. |
| `passwordEncoderDecoder.js` | AES encryption/decryption for password fields. |
| `project.utils.js` | Project-specific helpers (time calculations, member validation). |
| `reuse.js` | Generic reusable utilities (pagination helpers, response formatters). |
| `social.utils.js` | Google & Facebook OAuth token exchange and user info fetching. |
| `twitter.utils.js` | Twitter OAuth flow helpers. |
| `user.utils.js` | User lookup and validation helpers. |

---

## 10. Mail Service

Located in `mailService/`, handles all outbound transactional emails via **SendGrid**.

| Email Event | Triggered By |
|------------|-------------|
| Admin registration verification | `POST /v1/admin/add` |
| Admin forgot password | `POST /v1/admin/forgot-password-mail` |
| Admin welcome email | On first verified login |
| User (member) invite email | `POST /v1/user/create` |
| User resend verification | `POST /v1/user/resend-verify-mail` |
| User forgot password | `POST /v1/forgot-password` |
| Auto reports (scheduled) | Cron jobs in `autoSendReports.cronjobs.js` |
| Test report email | `POST /v1/report/testmail` |

**SendGrid config** (from `localDev.json`):
- **From:** `admin@empmonitor.com` (EmpMonitor)
- **Subjects:** Defined per email type in config file.

---

## 11. Local Development Setup

### Prerequisites

Ensure the following are installed on your machine:

| Tool | Version | Notes |
|------|---------|-------|
| **Node.js** | v18+ (LTS) | Required. Use `node -v` to check. |
| **npm** | v9+ | Comes with Node.js. |
| **Redis** | v6+ | Must be running locally on port `6379`. |
| **MongoDB** | Access to the dev DB | Connects to remote host `140.245.23.118` (see config). No local Mongo needed by default. |

---

### Step 1 — Clone / Navigate to the project

```bash
cd c:\Backend\WM\Project\emp-monitor-work-management-api\Project
```

---

### Step 2 — Install Dependencies

```bash
npm install
```

This installs all packages listed in `package.json`.

---

### Step 3 — Set the Environment

The `config` package reads the environment from `NODE_ENV`.

**Windows PowerShell:**
```powershell
$env:NODE_ENV = "localDev"
```

**Windows CMD:**
```cmd
set NODE_ENV=localDev
```

> When `NODE_ENV=local`, the app loads `config/localDev.json`.

---

### Step 4 — Start Redis (Required)

Redis is used for permission caching. Start it locally:

```bash
# If installed via WSL or standalone:
redis-server

# Or start Redis via Docker:
docker run -d -p 6379:6379 redis:latest
```

Verify Redis is running:
```bash
redis-cli ping
# Should return: PONG
```

---

### Step 5 — Generate Swagger Spec (First time / after route changes)

Before starting for the first time, generate the Swagger API spec:

```bash
node ./resources/views/swagger.config.js
```

This creates/updates `resources/views/swagger-api-view.json`.

> **Note:** The `npm run dev` script below does this automatically.

---

### Step 6 — Start the Development Server

```bash
npm run dev
```

This runs:
```
node ./resources/views/swagger.config.js && nodemon project.server.js
```

**With `nodemon`**, the server auto-restarts on any file change.

**Expected output:**
```
Mongo Database has been connected.
service listening on localhost:9000 with local Environment!
```

---

### Step 7 — Access the Application

| URL | Description |
|-----|-------------|
| `http://localhost:9000/` | Health check → `Working.......!` |
| `http://localhost:9000/explorer` | Swagger UI (login: `admin` / `admin`) |

---

### Step 8 — Test an API

Use the Swagger UI at `/explorer` or a tool like **Postman / Thunder Client**.

**Example: Admin Login**
```http
POST http://localhost:9000/v1/admin/fetch
Content-Type: application/json

{
  "email": "your-admin@email.com"
}
```

**Example: Protected Route**
```http
GET http://localhost:9000/v1/project/fetch
Content-Type: application/json
x-access-token: <your_jwt_token>
```

---

### Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| `Cannot connect to Redis` | Redis not running | Start Redis: `redis-server` |
| `Mongo connection failed` | DB host unreachable | Check VPN/network access to `140.245.23.118` |
| `Invalid access token` | Missing/expired token | Include `x-access-token` header with a valid JWT |
| `402 Plan expired` | Plan expiry date in DB has passed | Update plan expiry via `/v1/plan/expire/date` |
| `swagger-api-view.json not found` | Swagger not generated | Run `node ./resources/views/swagger.config.js` first |
| `NODE_ENV not set` | Wrong config loaded | Set `$env:NODE_ENV = "local"` in PowerShell |
| PORT already in use | Port 9000 occupied | Kill the process: `netstat -ano | findstr :9000` then `taskkill /PID <pid> /F` |

---

### Environment Variables Reference

These can optionally be set as actual environment variables (override config):

| Variable | Description |
|----------|-------------|
| `NODE_ENV` | `local` \| `development` \| `production` |
| `IS_DEBUGGING` | Set to any value to enable debug filename logging |

---

*Generated: 2026-03-23 | EmpMonitor Work Management API*
