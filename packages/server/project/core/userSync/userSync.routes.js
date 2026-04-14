import express from 'express';
import UserModel from '../users/users.model.js';
import { getOrCreateProjectAdminForOrg } from '../sso/tenantProvision.js';

const router = express.Router();

// API key auth
function requireApiKey(req, res, next) {
    const expectedKey = process.env.MODULE_SYNC_API_KEY || process.env.EMPCLOUD_API_KEY || '';
    // Skip auth if no key configured (dev mode)
    if (!expectedKey) return next();
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== expectedKey) {
        return res.status(401).json({ success: false, message: 'Invalid API key' });
    }
    next();
}

router.use(requireApiKey);

// POST /v1/users/sync — Create/update user from EmpCloud
router.post('/sync', async (req, res) => {
    try {
        const { empcloud_user_id, organization_id, email, first_name, last_name, role } = req.body;

        if (!empcloud_user_id || !organization_id || !email) {
            return res.status(400).json({ success: false, message: 'empcloud_user_id, organization_id, and email required' });
        }

        // Ensure this empcloud tenant's Project-module org is fully provisioned
        // (admin record, config, permissions, per-org collections, task metadata).
        // First-touch syncs would otherwise create a stranded user with no org
        // infrastructure, so later SSO logins would hit a half-built state.
        try {
            await getOrCreateProjectAdminForOrg(organization_id, email, {
                firstName: first_name, lastName: last_name,
            });
        } catch (provErr) {
            console.error('Sync: tenant provisioning failed:', provErr.message);
            // Non-fatal — fall through and still try to create the user record.
        }

        // Check if user exists
        let user = await UserModel.findOne({ email, orgId: String(organization_id) });

        if (user) {
            user.firstName = first_name || user.firstName;
            user.lastName = last_name || user.lastName;
            user.empcloudUserId = String(empcloud_user_id);
            user.updatedAt = new Date();
            await user.save();
            return res.json({ success: true, message: 'User updated', data: { id: user._id } });
        }

        // Create new user
        user = new UserModel({
            orgId: String(organization_id),
            firstName: first_name || '',
            lastName: last_name || '',
            email,
            password: 'sso-managed', // Password is managed by EmpCloud SSO
            empcloudUserId: String(empcloud_user_id),
            role: role || 'Read',
            permission: 'Read',
            verified: true,
        });
        await user.save();

        // Notify EmpCloud about the seat
        try {
            const empcloudUrl = process.env.EMPCLOUD_API_URL || 'http://localhost:3000/api/v1';
            const apiKey = process.env.EMPCLOUD_API_KEY || process.env.EMP_CLOUD_SECRET_KEY || '';
            await fetch(`${empcloudUrl}/subscriptions/seat-webhook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
                body: JSON.stringify({
                    module_slug: 'emp-projects',
                    empcloud_user_id,
                    organization_id,
                    action: 'added',
                }),
                signal: AbortSignal.timeout(5000),
            });
        } catch (err) {
            console.error('Failed to notify EmpCloud:', err.message);
        }

        return res.status(201).json({ success: true, message: 'User created', data: { id: user._id } });
    } catch (error) {
        console.error('User sync error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /v1/users/sync/:empcloudUserId — Remove user
router.delete('/sync/:empcloudUserId', async (req, res) => {
    try {
        const empcloudUserId = req.params.empcloudUserId;

        const user = await UserModel.findOne({ empcloudUserId: String(empcloudUserId) });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Soft delete
        user.isSuspended = true;
        user.updatedAt = new Date();
        await user.save();

        // No webhook callback here — EmpCloud already handles seat removal
        // when it calls this DELETE endpoint.

        return res.json({ success: true, message: 'User suspended', data: { id: user._id } });
    } catch (error) {
        console.error('User unsync error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
