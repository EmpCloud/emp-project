// =============================================================================
// EMP Project — Tenant provisioning helper
// Centralises the "get or create a Project-module org for a given empcloud
// org_id" flow so SSO and the /v1/users/sync endpoint share one code path.
//
// Tenant bridge: adminschemas.orgId = String(empcloud_org_id). Every per-org
// collection (`Org_{orgId}_projectFeature`, permissions, task metadata, etc.)
// is keyed on the same string, so one empcloud tenant maps to exactly one
// Project-module org.
// =============================================================================

import adminSchema from '../admin/admin.model.js';
import planModel from '../plan/plan.model.js';
import defaultScreen from '../defaultScreenConfig/defaultScreenConfig.model.js';
import ConfigSchema from '../config/adminConfig.model.js';
import { configFieldSchema, configViewFieldSchema } from '../customFields/customFields.model.js';
import permissionModel, { defaultPermission } from '../permissions/permission.model.js';
import { setDefaultScreen } from '../../utils/project.utils.js';
import { projectGrids, taskGrids, subTaskGrids, memberGrids, activityGrids } from '../dashBoard/dashboard.select.js';
import { SaveDefaultTaskTypeData, defaultTaskTypes } from '../config/defaults/taskType.schema.js';
import { SaveDefaultTaskStatusData, defaultTaskStatus } from '../config/defaults/taskStatus.schema.js';
import { SaveDefaultTaskStageData, defaultTaskStages } from '../config/defaults/taskStages.schema.js';
import { SaveDefaultTaskCategoryData, defaultTaskCategory } from '../config/defaults/taskCategory.schema.js';
import { SaveData, project } from '../config/defaults/project.schema.js';
import { SaveDefaultTaskData, task } from '../config/defaults/task.schema.js';
import { saveDefaultSubData, subtask } from '../config/defaults/subtask.schema.js';
import { viewFieldConfig, createFields } from '../customFields/fields.constants.js';
import Logger from '../../resources/logs/logger.log.js';

/**
 * Resolve (or auto-provision) the Project-module admin record that mirrors a
 * given empcloud org_id. Uses adminschemas.orgId as the tenant bridge — one
 * Project-module org per empcloud tenant, so every SSO login and every
 * /v1/users/sync call from the same empcloud org lands on the same dashboard
 * and shares the same project/task data.
 *
 * Race-safe: uses findOneAndUpdate with $setOnInsert + upsert so two
 * concurrent requests cannot create duplicate admin rows.
 *
 * @param {number|string} empcloudOrgId  empcloud organization_id
 * @param {string} ownerEmail            email of the caller (used as owner of a
 *                                       newly-created admin row)
 * @param {object} opts
 * @param {string} [opts.firstName]
 * @param {string} [opts.lastName]
 * @param {string} [opts.planName]       resolved plan from empcloud
 * @returns {Promise<{ adminData: object, adminId: string, orgIdStr: string, created: boolean }>}
 */
export async function getOrCreateProjectAdminForOrg(empcloudOrgId, ownerEmail, opts = {}) {
    if (!empcloudOrgId) throw new Error('getOrCreateProjectAdminForOrg: empcloudOrgId required');
    const orgIdStr = String(empcloudOrgId);
    const firstName = opts.firstName || 'User';
    const lastName = opts.lastName || '';
    const desiredPlanName = opts.planName || 'Free';

    // Resolve plan document (fall back to Free, then anything)
    const plan =
        (await planModel.findOne({ planName: desiredPlanName })) ||
        (await planModel.findOne({ planName: 'Free' })) ||
        null;

    const { createdAt: _pc, updatedAt: _pu, ...planDetails } = plan ? plan.toJSON() : {};

    // Race-safe upsert — atomic find-or-create keyed on orgId.
    const now = new Date();
    const upsertDoc = {
        $setOnInsert: {
            firstName,
            lastName,
            email: ownerEmail,
            orgId: orgIdStr,
            orgName: orgIdStr,
            userName: ownerEmail,
            password: 'sso-provisioned-' + Date.now(),
            address: 'SSO Provisioned',
            country: 'IN',
            profilePic: `https://avatars.dicebear.com/api/bottts/${firstName}${lastName}.svg`,
            verified: true,
            isEmpMonitorUser: true,
            isConfigSet: true,
            isDasboardConfigSet: true,
            planName: plan ? plan.planName : desiredPlanName,
            planStartDate: now,
            planExpireDate: new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000),
            planData: plan ? planDetails : null,
            dashboardConfigData: [
                { dashboardConfig_id: 1, dashboardConfig: projectGrids },
                { dashboardConfig_id: 2, dashboardConfig: taskGrids },
                { dashboardConfig_id: 3, dashboardConfig: subTaskGrids },
                { dashboardConfig_id: 4, dashboardConfig: memberGrids },
                { dashboardConfig_id: 5, dashboardConfig: activityGrids },
            ],
        },
    };

    let adminData;
    let created = false;
    try {
        // upsert=true + new=true returns the doc after insert/fetch; rawResult
        // lets us detect whether we inserted.
        const upsertResult = await adminSchema.findOneAndUpdate(
            { orgId: orgIdStr },
            upsertDoc,
            { upsert: true, new: true, rawResult: true, setDefaultsOnInsert: true }
        );
        adminData = upsertResult.value;
        created = !!(upsertResult.lastErrorObject && upsertResult.lastErrorObject.updatedExisting === false);
    } catch (err) {
        // MongoDB E11000 on a concurrent upsert — re-read and use the winner.
        if (err && (err.code === 11000 || (err.message && err.message.includes('E11000')))) {
            adminData = await adminSchema.findOne({ orgId: orgIdStr });
            if (!adminData) throw err;
            created = false;
        } else {
            throw err;
        }
    }

    // Update plan if empcloud's plan has changed for an existing admin
    if (!created && plan && adminData.planName !== plan.planName) {
        adminData = await adminSchema.findOneAndUpdate(
            { _id: adminData._id },
            { $set: { planName: plan.planName, planData: planDetails, updatedAt: now } },
            { new: true }
        );
    }

    const adminId = adminData._id.toString();

    // Idempotently seed per-org defaults. Each check-then-create is safe to
    // run on every login — they short-circuit when records already exist.
    try {
        if (!(await defaultScreen.findOne({ adminId }))) {
            await setDefaultScreen(adminId);
        }

        if (!(await ConfigSchema.findOne({ orgId: orgIdStr }))) {
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
            SaveData('Org_' + orgIdStr + '_projectFeature', project);
            SaveDefaultTaskData('Org_' + orgIdStr + '_taskFeature', task);
            saveDefaultSubData('Org_' + orgIdStr + '_subTaskFeature', subtask);
        }

        if ((await permissionModel.countDocuments({ orgId: orgIdStr })) === 0) {
            await permissionModel.insertMany(
                defaultPermission.map(p => ({ ...p, orgId: orgIdStr }))
            );
        }

        if ((await configFieldSchema.find({ orgId: orgIdStr })).length === 0) {
            await configFieldSchema.create({ ...createFields, orgId: orgIdStr });
            await configViewFieldSchema.create({ ...viewFieldConfig, orgId: orgIdStr });
        }

        const typeSchema = (await import('../config/defaults/taskType.schema.js')).default;
        if ((await typeSchema.countDocuments({ adminId })) === 0) {
            await SaveDefaultTaskTypeData([...defaultTaskTypes], adminId);
        }
        const statusSchema = (await import('../config/defaults/taskStatus.schema.js')).default;
        if ((await statusSchema.countDocuments({ adminId })) === 0) {
            await SaveDefaultTaskStatusData([...defaultTaskStatus], adminId);
        }
        const stageSchema = (await import('../config/defaults/taskStages.schema.js')).default;
        if ((await stageSchema.countDocuments({ adminId })) === 0) {
            await SaveDefaultTaskStageData([...defaultTaskStages], adminId);
        }
        const categorySchema = (await import('../config/defaults/taskCategory.schema.js')).default;
        if ((await categorySchema.countDocuments({ adminId })) === 0) {
            await SaveDefaultTaskCategoryData([...defaultTaskCategory], adminId);
        }
    } catch (seedErr) {
        Logger.error(`Tenant seed failed for org ${orgIdStr}: ${seedErr.message}`);
        // Non-fatal — SSO/sync should still succeed even if seeding partially failed.
    }

    return { adminData, adminId, orgIdStr, created };
}
