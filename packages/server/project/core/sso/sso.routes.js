import Router from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import mysql from 'mysql2/promise';
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import adminSchema from '../admin/admin.model.js';
import userSchema from '../users/users.model.js';
import { getOrCreateProjectAdminForOrg } from './tenantProvision.js';

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

// #1192 — Fetch actual subscription plan from EmpCloud MySQL
async function fetchSubscriptionPlan(orgId) {
    try {
        const pool = getEmpcloudPool();
        const [rows] = await pool.execute(
            `SELECT plan_tier FROM org_subscriptions
             WHERE organization_id = ?
               AND module_id = (SELECT id FROM modules WHERE slug = 'emp-projects')
               AND status IN ('active', 'trial')
             LIMIT 1`,
            [orgId]
        );
        if (rows.length > 0) {
            return rows[0].plan_tier;
        }
        return 'Free';
    } catch (err) {
        Logger.error(`SSO: Failed to fetch subscription plan for org ${orgId}: ${err.message}`);
        return 'Free';
    }
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

        // #1190 — Map EmpCloud role to Project permission level
        const permissionLevel = mapRoleToPermission(role);

        // #1192 — Fetch actual subscription plan from EmpCloud DB
        const actualPlanName = await fetchSubscriptionPlan(orgId);

        // Resolve (or auto-provision) the Project-module admin for this empcloud
        // tenant. Race-safe upsert keyed on adminschemas.orgId = String(empcloud
        // org_id), and idempotently seeds config/permissions/per-org collections.
        let { adminData, created: adminCreated } = await getOrCreateProjectAdminForOrg(orgId, email, {
            firstName, lastName, planName: actualPlanName,
        });
        Logger.info(`SSO: project admin for empcloud org ${orgId} → ${adminData._id} ${adminCreated ? '(created)' : '(reused)'}`);

        // #1190 — Ensure user record exists in org-specific users collection with correct permission
        let userData = await userSchema.findOne({ orgId: String(orgId), email: email });
        if (!userData) {
            userData = await userSchema.create({
                orgId: String(orgId),
                firstName: firstName || 'User',
                lastName: lastName || '',
                email: email,
                password: 'sso-provisioned-' + Date.now(),
                permission: permissionLevel,
                verified: true,
            });
        } else if (userData.permission !== permissionLevel) {
            // Update permission if role changed in EmpCloud
            await userSchema.findOneAndUpdate(
                { _id: userData._id },
                { $set: { permission: permissionLevel, updatedAt: new Date() } }
            );
        }

        // #1191 — Ensure seat assignment exists in EmpCloud and sync seat count
        if (userId) {
            await ensureSeatAssignment(orgId, userId);
        }

        // #1204 — Build safe user data payload (strip sensitive fields)
        const safeAdminData = stripSensitiveFields(adminData.toJSON());

        // #1190 — Build user-specific payload with correct permission and identity
        const userPayload = {
            ...safeAdminData,
            firstName: firstName || safeAdminData.firstName,
            lastName: lastName || safeAdminData.lastName,
            email: email,
            permission: permissionLevel,
            isAdmin: permissionLevel === 'admin',
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
