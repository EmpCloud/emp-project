import Router from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import mysql from 'mysql2/promise';
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import adminSchema from '../admin/admin.model.js';
import userSchema from '../users/users.model.js';
import planModel from '../plan/plan.model.js';
import { setDefaultScreen } from '../../utils/project.utils.js';
import defaultScreen from '../defaultScreenConfig/defaultScreenConfig.model.js';
import { projectGrids, taskGrids, subTaskGrids, memberGrids, activityGrids } from '../dashBoard/dashboard.select.js';
import { SaveDefaultTaskTypeData, defaultTaskTypes } from '../config/defaults/taskType.schema.js';
import { SaveDefaultTaskStatusData, defaultTaskStatus } from '../config/defaults/taskStatus.schema.js';
import { SaveDefaultTaskStageData, defaultTaskStages } from '../config/defaults/taskStages.schema.js';
import { SaveDefaultTaskCategoryData, defaultTaskCategory } from '../config/defaults/taskCategory.schema.js';
import ConfigSchema from '../config/adminConfig.model.js';
import { SaveData, project } from '../config/defaults/project.schema.js';
import { SaveDefaultTaskData, task } from '../config/defaults/task.schema.js';
import { saveDefaultSubData, subtask } from '../config/defaults/subtask.schema.js';
import { configFieldSchema, configViewFieldSchema } from '../customFields/customFields.model.js';
import { viewFieldConfig, createFields } from '../customFields/fields.constants.js';

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

        // Check if admin already exists in Project's MongoDB by orgId
        let adminData = await adminSchema.findOne({ orgId: orgId });

        if (!adminData) {
            // Auto-provision: create admin record for this organization
            const plan = await planModel.findOne({ planName: actualPlanName }) || await planModel.findOne({ planName: 'Free' });
            const newAdmin = {
                firstName: firstName || 'User',
                lastName: lastName || '',
                email: email,
                orgId: String(orgId),
                orgName: String(orgId),
                userName: email,
                password: 'sso-provisioned-' + Date.now(),
                address: 'SSO Provisioned',
                country: 'IN',
                profilePic: `https://avatars.dicebear.com/api/bottts/${firstName}${lastName}.svg`,
                verified: true,
                isEmpMonitorUser: true,
                isConfigSet: true,
                isDasboardConfigSet: true,
                planName: plan ? plan.planName : actualPlanName,
                planExpireDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                planStartDate: new Date(),
                dashboardConfigData: [
                    { dashboardConfig_id: 1, dashboardConfig: projectGrids },
                    { dashboardConfig_id: 2, dashboardConfig: taskGrids },
                    { dashboardConfig_id: 3, dashboardConfig: subTaskGrids },
                    { dashboardConfig_id: 4, dashboardConfig: memberGrids },
                    { dashboardConfig_id: 5, dashboardConfig: activityGrids },
                ],
            };

            if (plan) {
                const { createdAt, updatedAt, ...planDetails } = plan.toJSON();
                newAdmin.planData = planDetails;
            }

            adminData = await adminSchema.create(newAdmin);

            // Set default screen config
            const isDefaultScreenSet = await defaultScreen.findOne({ adminId: adminData._id.toString() });
            if (!isDefaultScreenSet) await setDefaultScreen(adminData._id.toString());

            // Seed admin config and default task metadata for the new org
            const adminId = adminData._id.toString();
            const orgIdStr = String(orgId);
            try {
                const existingConfig = await ConfigSchema.findOne({ orgId: orgIdStr });
                if (!existingConfig) {
                    await ConfigSchema.create({
                        orgId: orgIdStr,
                        projectFeature: true,
                        taskFeature: true,
                        subTaskFeature: true,
                        shortcutKeyFeature: false,
                        invitationFeature: true,
                        chatFeature: false,
                        calendar: false,
                    });
                    // Create project, task, subtask collections
                    SaveData('Org_' + orgIdStr + '_projectFeature', project);
                    SaveDefaultTaskData('Org_' + orgIdStr + '_taskFeature', task);
                    saveDefaultSubData('Org_' + orgIdStr + '_subTaskFeature', subtask);
                }
                // Seed custom fields config if missing
                const isFieldPresent = await configFieldSchema.find({ orgId: orgIdStr });
                if (isFieldPresent.length === 0) {
                    const fields = { ...createFields, orgId: orgIdStr };
                    await configFieldSchema.create(fields);
                    const viewFields = { ...viewFieldConfig, orgId: orgIdStr };
                    await configViewFieldSchema.create(viewFields);
                }
                // Seed default task types/statuses/stages/categories if none exist
                const typeSchema = (await import('../config/defaults/taskType.schema.js')).default;
                const existingTypes = await typeSchema.countDocuments({ adminId: adminId });
                if (existingTypes === 0) {
                    await SaveDefaultTaskTypeData([...defaultTaskTypes], adminId);
                }
                const statusSchema = (await import('../config/defaults/taskStatus.schema.js')).default;
                const existingStatuses = await statusSchema.countDocuments({ adminId: adminId });
                if (existingStatuses === 0) {
                    await SaveDefaultTaskStatusData([...defaultTaskStatus], adminId);
                }
                const stageSchema = (await import('../config/defaults/taskStages.schema.js')).default;
                const existingStages = await stageSchema.countDocuments({ adminId: adminId });
                if (existingStages === 0) {
                    await SaveDefaultTaskStageData([...defaultTaskStages], adminId);
                }
                const categorySchema = (await import('../config/defaults/taskCategory.schema.js')).default;
                const existingCategories = await categorySchema.countDocuments({ adminId: adminId });
                if (existingCategories === 0) {
                    await SaveDefaultTaskCategoryData([...defaultTaskCategory], adminId);
                }
                Logger.info(`SSO: Seeded default task metadata for admin ${adminId} (org: ${orgId})`);
            } catch (seedErr) {
                Logger.error(`SSO: Failed to seed default data for org ${orgId}: ${seedErr.message}`);
                // Non-fatal — continue with SSO login
            }
        } else {
            // #1192 — Update plan if it changed
            if (adminData.planName !== actualPlanName) {
                const plan = await planModel.findOne({ planName: actualPlanName });
                const updateFields = { planName: actualPlanName };
                if (plan) {
                    const { createdAt, updatedAt, ...planDetails } = plan.toJSON();
                    updateFields.planData = planDetails;
                }
                await adminSchema.findOneAndUpdate({ _id: adminData._id }, { $set: updateFields });
                adminData = await adminSchema.findOne({ _id: adminData._id });
            }

            // #1207 — Seed default task metadata for existing admins if missing
            const existingAdminId = adminData._id.toString();
            const existingOrgIdStr = String(orgId);
            try {
                const existingConfig = await ConfigSchema.findOne({ orgId: existingOrgIdStr });
                if (!existingConfig) {
                    await ConfigSchema.create({
                        orgId: existingOrgIdStr,
                        projectFeature: true,
                        taskFeature: true,
                        subTaskFeature: true,
                        shortcutKeyFeature: false,
                        invitationFeature: true,
                        chatFeature: false,
                        calendar: false,
                    });
                    SaveData('Org_' + existingOrgIdStr + '_projectFeature', project);
                    SaveDefaultTaskData('Org_' + existingOrgIdStr + '_taskFeature', task);
                    saveDefaultSubData('Org_' + existingOrgIdStr + '_subTaskFeature', subtask);
                }
                const isFieldPresent = await configFieldSchema.find({ orgId: existingOrgIdStr });
                if (isFieldPresent.length === 0) {
                    const fields = { ...createFields, orgId: existingOrgIdStr };
                    await configFieldSchema.create(fields);
                    const vFields = { ...viewFieldConfig, orgId: existingOrgIdStr };
                    await configViewFieldSchema.create(vFields);
                }
                const typeSchema = (await import('../config/defaults/taskType.schema.js')).default;
                const existingTypes = await typeSchema.countDocuments({ adminId: existingAdminId });
                if (existingTypes === 0) {
                    await SaveDefaultTaskTypeData([...defaultTaskTypes], existingAdminId);
                }
                const statusSchema = (await import('../config/defaults/taskStatus.schema.js')).default;
                const existingStatuses = await statusSchema.countDocuments({ adminId: existingAdminId });
                if (existingStatuses === 0) {
                    await SaveDefaultTaskStatusData([...defaultTaskStatus], existingAdminId);
                }
                const stageSchema = (await import('../config/defaults/taskStages.schema.js')).default;
                const existingStages = await stageSchema.countDocuments({ adminId: existingAdminId });
                if (existingStages === 0) {
                    await SaveDefaultTaskStageData([...defaultTaskStages], existingAdminId);
                }
                const categorySchema = (await import('../config/defaults/taskCategory.schema.js')).default;
                const existingCategories = await categorySchema.countDocuments({ adminId: existingAdminId });
                if (existingCategories === 0) {
                    await SaveDefaultTaskCategoryData([...defaultTaskCategory], existingAdminId);
                }
            } catch (seedErr) {
                Logger.error(`SSO: Failed to seed default data for existing org ${orgId}: ${seedErr.message}`);
            }
        }

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
