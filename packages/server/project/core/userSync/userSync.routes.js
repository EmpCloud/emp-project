import express from 'express';
import mongoose from 'mongoose';
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
        let tenantAdminId = null;
        try {
            const prov = await getOrCreateProjectAdminForOrg(organization_id, email, {
                firstName: first_name, lastName: last_name,
            });
            tenantAdminId = prov.adminId;
        } catch (provErr) {
            console.error('Sync: tenant provisioning failed:', provErr.message);
            // Non-fatal — fall through and still try to create the user record.
        }

        // Write the user into the PER-ORG users collection (`org_{orgId}_users`)
        // via the raw driver — this is the collection every dashboard/read flow
        // uses. Writing to the shared Mongoose userschemas would leave the user
        // invisible.
        const orgIdStr = String(organization_id);
        const orgIdLower = orgIdStr.toLowerCase();
        const perOrgUserColl = `org_${orgIdLower}_users`;
        const db = mongoose.connection.db;
        try { await db.createCollection(perOrgUserColl); }
        catch (e) { if (!e || e.codeName !== 'NamespaceExists') throw e; }
        const userColl = db.collection(perOrgUserColl);

        const now = new Date();
        const permission = (role && role.toLowerCase() === 'admin') ? 'admin'
            : (role && (role.toLowerCase() === 'manager' || role.toLowerCase() === 'write')) ? 'write'
            : 'read';

        const existing = await userColl.findOne({ email, orgId: orgIdStr });
        if (existing) {
            await userColl.updateOne(
                { _id: existing._id },
                {
                    $set: {
                        firstName: first_name || existing.firstName,
                        lastName: last_name || existing.lastName,
                        empcloudUserId: String(empcloud_user_id),
                        permission: existing.permission || permission,
                        isSuspended: false,
                        updatedAt: now,
                    },
                }
            );
            return res.json({ success: true, message: 'User updated', data: { id: existing._id } });
        }

        const insertRes = await userColl.insertOne({
            orgId: orgIdStr,
            firstName: first_name || '',
            lastName: last_name || '',
            email,
            password: 'sso-managed',
            empcloudUserId: String(empcloud_user_id),
            role: role || 'Employee',
            permission,
            verified: true,
            isSuspended: false,
            adminId: tenantAdminId,
            createdAt: now,
            updatedAt: now,
        });
        const user = { _id: insertRes.insertedId };

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

// DELETE /v1/users/sync/:empcloudUserId — Remove user across per-org collections
router.delete('/sync/:empcloudUserId', async (req, res) => {
    try {
        const empcloudUserId = String(req.params.empcloudUserId);
        const db = mongoose.connection.db;

        // Per-org user collections follow the pattern org_{orgId}_users.
        // Enumerate them and soft-delete wherever the empcloudUserId matches.
        const collections = await db.listCollections({ name: /^org_.+_users$/ }).toArray();
        let matchedIn = null;
        let matchedId = null;
        for (const c of collections) {
            const coll = db.collection(c.name);
            const result = await coll.findOneAndUpdate(
                { empcloudUserId },
                { $set: { isSuspended: true, updatedAt: new Date() } }
            );
            if (result && result.value) {
                matchedIn = c.name;
                matchedId = result.value._id;
                break;
            }
        }

        if (!matchedIn) {
            return res.status(404).json({ success: false, message: 'User not found in any org' });
        }

        return res.json({ success: true, message: 'User suspended', data: { id: matchedId, collection: matchedIn } });
    } catch (error) {
        console.error('User unsync error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
