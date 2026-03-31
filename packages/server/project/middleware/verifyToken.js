import Response from '../response/response.js';
import config from 'config';
import jwt from 'jsonwebtoken';
import adminSchema from '../core/admin/admin.model.js';
import planModel from '../core/plan/plan.model.js';
import { ObjectId } from 'mongodb';
import redisClient from '../resources/database/redis.connect.js';
import permissionModel from '../core/permissions/permission.model.js';

async function verifyToken(req, res, next) {
    try {
        const token = JSON.stringify(req.header('x-access-token'));
        if (!token) return res.status(401).send(Response.tokenFailResp('Access token is required .....'));
        jwt.verify(JSON.parse(token), config.get('token_secret'), async (error, userData) => {
            if (error == 'JsonWebTokenError: invalid signature') {
                jwt.verify(JSON.parse(token), config.get('user_token_secret'), async (err, userData) => {
                    if (err) {
                        return res.status(401).send(Response.tokenFailResp('Invalid access token....'));
                    } else {
                        const FindAdmin=await  adminSchema.findOne({orgId:userData?.userData?.orgId})
                        userData.userData.adminId=FindAdmin._id.toString()
                        const result = {
                            state: true,
                            type: 'user',
                            userData,
                        };
                        req.verified = result;
                        req.mainRoute = req.path;

                        let permissionData = await permissionModel.findOne({ permissionName: result.userData.userData.permission });
                        if (permissionData) {
                            await redisClient.set(`${result.userData.userData.email}_permissions`, JSON.stringify(permissionData.permissionConfig));
                        }

                        let FindData = await adminSchema.findOne({ _id: ObjectId(result.userData?.userData.adminId) });
                        userData.userData.language = FindData.language;
                        userData.userData.adminName = FindData.firstName;
                        userData.userData.planData = await planModel.findOne({ planName: FindData.planName })
                            || await planModel.findOne({ planName: 'Free' })
                            || await planModel.findOne({ planName: 'basic' });
                        if (new Date() > new Date(FindData.planExpireDate)) {
                            return res.status(402).send(Response.tokenFailResp('Your current plan is expired, please contact your admin to upgrade the plan.'));
                        }
                        next();
                    }
                });
            } else if (userData != null) {
                if (userData?.userData?.isConfigSet == false && userData?.userData?.planName != null) {
                    return res.status(402).send(Response.tokenFailResp('config data is not added'));
                }
                if (userData?.userData?.verified == false) {
                    return res.status(402).send(Response.tokenFailResp('email is not verified'));
                }

                // #1190 — SSO tokens are signed with token_secret but represent regular users.
                // Determine type based on permission field: if permission is set, treat as 'user' for RBAC.
                const permission = userData?.userData?.permission;
                const isSSO = !!permission; // SSO tokens always include permission field
                const tokenType = isSSO ? 'user' : undefined;

                const result = {
                    state: true,
                    userData,
                };
                // #1190 — Set type to 'user' for SSO-authenticated users so RBAC middleware applies
                if (tokenType) {
                    result.type = tokenType;
                }
                req.verified = result;
                req.mainRoute = req.path;

                userData.userData.adminName = result.userData?.userData.firstName;
                userData.userData.adminId = result.userData?.userData._id;
                userData.userData.planData = await planModel.findOne({ planName: result.userData?.userData.planName })
                    || await planModel.findOne({ planName: 'Free' })
                    || await planModel.findOne({ planName: 'basic' });

                // #1190 — For SSO users, load and cache permission config for RBAC middleware
                if (isSSO && permission) {
                    const orgId = userData?.userData?.orgId;
                    let permissionData = await permissionModel.findOne({ orgId: String(orgId), permissionName: permission });
                    if (!permissionData) {
                        permissionData = await permissionModel.findOne({ permissionName: permission });
                    }
                    if (permissionData) {
                        await redisClient.set(`${userData.userData.email}_permissions`, JSON.stringify(permissionData.permissionConfig));
                    }
                }

                next();
            } else {
                return res.status(401).send(Response.tokenFailResp('Invalid access token....'));
            }
        });
    } catch (e) {
        return res.status(401).send(Response.tokenFailResp('Invalid access token'));
    }
}

export default verifyToken;
