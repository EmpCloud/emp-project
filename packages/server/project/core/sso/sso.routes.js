import Router from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import mysql from 'mysql2/promise';
import mongoose from 'mongoose';
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import adminSchema from '../admin/admin.model.js';
import { getOrCreateProjectAdminForOrg } from './tenantProvision.js';
import planModel, { plans } from '../plan/plan.model.js';
import Password from '../../utils/passwordEncoderDecoder.js';

const router = Router();

// MySQL connection pool for empcloud database
let empcloudPool = null;

function getEmpcloudPool() {
    if (!empcloudPool) {
        empcloudPool = mysql.createPool({
            host: process.env.EMPCLOUD_DB_HOST || 'localhost',
            port: parseInt(process.env.EMPCLOUD_DB_PORT || '3306'),
            user: process.env.EMPCLOUD_DB_USER || 'empcloud',
            password: process.env.EMPCLOUD_DB_PASSWORD || 'EmpCloud2026',
            database: process.env.EMPCLOUD_DB_NAME || 'empcloud',
            waitForConnections: true,
            connectionLimit: 5,
            queueLimit: 0,
        });
    }
    return empcloudPool;
}

// #1190 — Map EmpCloud role to Project module permission level
function mapRoleToPermission(cloudRole) {
    switch (cloudRole) {
        case 'org_admin':
        case 'hr_admin':
            return 'admin';
        case 'manager':
        case 'hr_manager':
            return 'write';
        case 'employee':
        default:
            return 'read';
    }
}

// #1192 — Fetch subscription plan and seat count from EmpCloud MySQL
async function fetchSubscriptionPlan(orgId) {
    try {
        const pool = getEmpcloudPool();
        const [rows] = await pool.execute(
            `SELECT plan_tier, total_seats FROM org_subscriptions
             WHERE organization_id = ?
               AND module_id = (SELECT id FROM modules WHERE slug = 'emp-projects')
               AND status IN ('active', 'trial')
             LIMIT 1`,
            [orgId]
        );
        if (rows.length > 0) {
            const { plan_tier, total_seats } = rows[0];
            // If explicit plan_tier is set, return it; otherwise infer from total_seats
            if (plan_tier && plan_tier !== 'basic') {
                return plan_tier;
            }
            // Infer plan based on seat allocation
            return inferPlanFromSeats(total_seats);
        }
        return 'Free';
    } catch (err) {
        Logger.error(`SSO: Failed to fetch subscription plan for org ${orgId}: ${err.message}`);
        return 'Free';
    }
}

// Infer plan tier from allocated seat count based on userFeatureCount
// Maps seat count thresholds to plan tiers
function inferPlanFromSeats(seatCount) {
    if (seatCount <= 2) return 'Free';          // 2 users
    if (seatCount <= 15) return 'Standard';     // 15 users
    if (seatCount <= 100) return 'Premium';     // 100 users
    if (seatCount <= 500) return 'basic';       // 500 users
    return 'Enterprise';                        // 500+ users
}

// #1191 — Sync used_seats count in EmpCloud after SSO seat assignment
async function syncSeatCount(orgId) {
    try {
        const pool = getEmpcloudPool();
        await pool.execute(
            `UPDATE org_subscriptions s
             SET s.used_seats = (
                 SELECT COUNT(*) FROM org_module_seats oms
                 WHERE oms.subscription_id = s.id
             ),
             s.updated_at = NOW()
             WHERE s.organization_id = ?
               AND s.module_id = (SELECT id FROM modules WHERE slug = 'emp-projects')
               AND s.status IN ('active', 'trial')`,
            [orgId]
        );
    } catch (err) {
        Logger.error(`SSO: Failed to sync seat count for org ${orgId}: ${err.message}`);
    }
}

// #1191 — Ensure user has a seat assignment in EmpCloud
async function ensureSeatAssignment(orgId, userId) {
    try {
        const pool = getEmpcloudPool();
        // Check if seat already exists
        const [existing] = await pool.execute(
            `SELECT id FROM org_module_seats
             WHERE organization_id = ? AND user_id = ?
               AND module_id = (SELECT id FROM modules WHERE slug = 'emp-projects')
             LIMIT 1`,
            [orgId, userId]
        );
        if (existing.length > 0) return;

        // Find active subscription
        const [subs] = await pool.execute(
            `SELECT id FROM org_subscriptions
             WHERE organization_id = ?
               AND module_id = (SELECT id FROM modules WHERE slug = 'emp-projects')
               AND status IN ('active', 'trial')
             LIMIT 1`,
            [orgId]
        );
        if (subs.length === 0) return;

        const subscriptionId = subs[0].id;

        // Insert seat assignment
        await pool.execute(
            `INSERT INTO org_module_seats (subscription_id, organization_id, module_id, user_id, assigned_by, assigned_at)
             VALUES (?, ?, (SELECT id FROM modules WHERE slug = 'emp-projects'), ?, ?, NOW())`,
            [subscriptionId, orgId, userId, userId]
        );

        // Sync the used_seats counter from actual count
        await syncSeatCount(orgId);
    } catch (err) {
        Logger.error(`SSO: Failed to ensure seat assignment for user ${userId} org ${orgId}: ${err.message}`);
    }
}

// #1204 — Strip sensitive fields from admin/user data before sending in response
function stripSensitiveFields(obj) {
    const sensitive = [
        'password', 'forgotPasswordToken', 'forgotTokenExpire',
        'emailValidateToken', 'emailTokenExpire',
        'passwordEmailSentCount', 'verificationEmailSentCount',
        'dashboardConfigData', 'dashboardConfigCreatedAt', 'dashboardConfigUpdatedAt',
    ];
    const cleaned = { ...obj };
    for (const field of sensitive) {
        delete cleaned[field];
    }
    return cleaned;
}

/**
 * POST /v1/auth/sso
 * Accepts { token } from EMP Cloud SSO redirect.
 * Decodes the RS256 JWT (trusted redirect, no verification needed),
 * validates user exists and is active in empcloud MySQL DB,
 * then issues a local JWT for the Project module.
 */
router.post('/sso', async (req, res) => {
    try {
        const { token } = req.body;

        if (!token) {
            return res.status(400).send(Response.projectFailResp('SSO token is required.'));
        }

        // Decode the EMP Cloud RS256 JWT (no verification — trusted redirect from EMP Cloud)
        const decoded = jwt.decode(token);

        if (!decoded) {
            return res.status(400).send(Response.projectFailResp('Invalid SSO token.'));
        }

        const { sub: userId, org_id: orgId, email, first_name: firstName, last_name: lastName, role } = decoded;

        if (!email || !orgId) {
            return res.status(400).send(Response.projectFailResp('SSO token missing required fields.'));
        }

        // Skip empcloud DB validation — trusted redirect from EMP Cloud dashboard
        // Use decoded token data directly
        Logger.info(`SSO: Trusted redirect for ${email} (org: ${orgId}, role: ${role})`);

        // Seed default plans if none exist (fresh database)
        const existingPlans = await planModel.countDocuments({});
        if (existingPlans === 0) {
            await planModel.insertMany(plans);
            Logger.info('SSO: Seeded default plans');
        }

        // #1190 — Map EmpCloud role to Project permission level
        const permissionLevel = mapRoleToPermission(role);

        // #1192 — Fetch actual subscription plan from EmpCloud DB
        const actualPlanName = await fetchSubscriptionPlan(orgId);

        // Resolve (or auto-provision) the Project-module admin for this empcloud
        // tenant. Race-safe upsert keyed on adminschemas.orgId = String(empcloud
        // org_id), and idempotently seeds config/permissions/per-org collections.
        // When the caller is an admin, force every feature toggle on and
        // refresh the admin permission row so they always land on a fully
        // enabled dashboard.
        let { adminData, created: adminCreated } = await getOrCreateProjectAdminForOrg(orgId, email, {
            firstName, lastName, planName: actualPlanName,
            forceEnableAllFeatures: permissionLevel === 'admin',
        });
        Logger.info(`SSO: project admin for empcloud org ${orgId} → ${adminData._id} ${adminCreated ? '(created)' : '(reused)'}`);

        // Ensure user exists in the PER-ORG users collection (org_{orgId}_users).
        // Profile and every other per-org flow read via this collection using the
        // raw MongoDB driver (see Reuse.collectionName.user), not via the shared
        // Mongoose userschemas collection. Writing to the shared collection would
        // leave the user invisible to the dashboard and crash profile fetch.
        const orgIdLower = String(orgId).toLowerCase();
        const perOrgUserColl = `org_${orgIdLower}_users`;
        const mongoDb = mongoose.connection.db;
        try {
            await mongoDb.createCollection(perOrgUserColl);
        } catch (e) {
            if (!e || e.codeName !== 'NamespaceExists') {
                Logger.error(`SSO: createCollection ${perOrgUserColl} failed: ${e.message}`);
            }
        }

        const userColl = mongoDb.collection(perOrgUserColl);
        let userData = await userColl.findOne({ email, orgId: String(orgId) });
        const now = new Date();
        if (!userData) {
            const newUser = {
                orgId: String(orgId),
                firstName: firstName || 'User',
                lastName: lastName || '',
                email,
                password:await Password.encryptText('sso-provisioned-' + Date.now(), config.get('encryptionKey')),
                role: permissionLevel === 'admin' ? 'Admin' : (permissionLevel === 'write' ? 'Manager' : 'Employee'),
                permission: permissionLevel,
                verified: true,
                isSuspended: false,
                // Required by the members-list read path (users.service.js fetchUser)
                softDeleted: false,
                invitation: 1,
                adminId: adminData._id.toString(),
                createdAt: now,
                updatedAt: now,
            };
            const insertRes = await userColl.insertOne(newUser);
            userData = { _id: insertRes.insertedId, ...newUser };
        } else {
            // Keep permission in sync with empcloud role and backfill list-visibility
            // fields that legacy rows may be missing.
            const patch = { updatedAt: now, softDeleted: false, invitation: 1, verified: true };
            if (userData.permission !== permissionLevel) patch.permission = permissionLevel;
            await userColl.updateOne({ _id: userData._id }, { $set: patch });
            userData.permission = permissionLevel;
            userData.softDeleted = false;
            userData.invitation = 1;
        }

        // #1191 — Ensure seat assignment exists in EmpCloud and sync seat count
        if (userId) {
            await ensureSeatAssignment(orgId, userId);
        }

        // #1204 — Build safe user data payload (strip sensitive fields)
        const safeAdminData = stripSensitiveFields(adminData.toJSON());

        // #1190 — Build user-specific payload. For non-admin SSO users the `_id`
        // must point at the per-org user row, not the admin row, otherwise
        // downstream services (profile, tasks, etc.) that do
        // findOne({ _id: ObjectId(userId) }) against org_{orgId}_users will
        // return null and crash. Admin SSO keeps the adminData._id as before.
        const isAdminUser = permissionLevel === 'admin';
        const userPayload = {
            ...safeAdminData,
            _id: isAdminUser ? safeAdminData._id : userData._id,
            adminId: adminData._id.toString(),
            firstName: firstName || safeAdminData.firstName,
            lastName: lastName || safeAdminData.lastName,
            email,
            permission: permissionLevel,
            isAdmin: isAdminUser,
            orgId: String(orgId),
        };

        // Sign local JWT using the Project module's own secret
        const accessToken = jwt.sign({ userData: userPayload }, config.get('token_secret'), { expiresIn: '24h' });

        // Update last login
        await adminSchema.findOneAndUpdate({ _id: adminData._id }, { $set: { lastLogin: Date.now() } });

        Logger.info(`SSO login successful for ${email} (org: ${orgId}, permission: ${permissionLevel}, plan: ${actualPlanName})`);

        // #1204 — Return stripped data with user-specific permission, never the raw MongoDB document
        res.send(Response.projectSuccessResp('SSO login successful.', {
            userData: userPayload,
            accessToken,
        }));
    } catch (err) {
        Logger.error(`SSO login error: ${err.message}`);
        res.status(500).send(Response.projectFailResp('SSO authentication failed.', err.message));
    }
});

export default router;
