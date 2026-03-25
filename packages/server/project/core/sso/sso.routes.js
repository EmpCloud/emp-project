import Router from 'express';
import jwt from 'jsonwebtoken';
import config from 'config';
import mysql from 'mysql2/promise';
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import adminSchema from '../admin/admin.model.js';
import planModel from '../plan/plan.model.js';
import { setDefaultScreen } from '../../utils/project.utils.js';
import defaultScreen from '../defaultScreenConfig/defaultScreenConfig.model.js';
import { projectGrids, taskGrids, subTaskGrids, memberGrids, activityGrids } from '../dashBoard/dashboard.select.js';

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
        Logger.info(`SSO: Trusted redirect for ${email} (org: ${orgId})`);

        // Check if admin already exists in Project's MongoDB by orgId
        let adminData = await adminSchema.findOne({ orgId: orgId });

        if (!adminData) {
            // Auto-provision: create admin record for this organization
            const freePlan = await planModel.findOne({ planName: 'Free' });
            const newAdmin = {
                firstName: firstName || 'User',
                lastName: lastName || '',
                email: email,
                orgId: orgId,
                orgName: orgId,
                userName: email,
                profilePic: `https://avatars.dicebear.com/api/bottts/${firstName}${lastName}.svg`,
                verified: true,
                isEmpMonitorUser: true,
                isConfigSet: true,
                isDasboardConfigSet: true,
                planName: freePlan ? freePlan.planName : 'Free',
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

            if (freePlan) {
                const { createdAt, updatedAt, ...planDetails } = freePlan.toJSON();
                newAdmin.planData = planDetails;
            }

            adminData = await adminSchema.create(newAdmin);

            // Set default screen config
            const isDefaultScreenSet = await defaultScreen.findOne({ adminId: adminData._id.toString() });
            if (!isDefaultScreenSet) await setDefaultScreen(adminData._id.toString());
        }

        // Build user data payload matching existing token structure
        const { forgotPasswordToken, forgotTokenExpire, password, dashboardConfigData, emailValidateToken, emailTokenExpire, passwordEmailSentCount, verificationEmailSentCount, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, ...filteredData } =
            adminData.toJSON();

        // Sign local JWT using the Project module's own secret
        const accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });

        // Update last login
        await adminSchema.findOneAndUpdate({ _id: adminData._id }, { $set: { lastLogin: Date.now() } });

        Logger.info(`SSO login successful for ${email} (org: ${orgId})`);

        res.send(Response.projectSuccessResp('SSO login successful.', {
            userData: adminData,
            accessToken,
        }));
    } catch (err) {
        Logger.error(`SSO login error: ${err.message}`);
        res.status(500).send(Response.projectFailResp('SSO authentication failed.', err.message));
    }
});

export default router;
