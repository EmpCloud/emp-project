import JwtAuth from '../jwt.service.js';
import Response from '../response/response.js';
import config from 'config';
import jwt from 'jsonwebtoken';
import { checkCollection } from '../utils/common.utils.js';
import redisClient from '../resources/database/redis.connect.js';
import { ObjectId } from 'mongodb';
async function verifyToken(req, res, next) {
    try {
        const token = JSON.stringify(req.header('x-access-token'));
        if (!token) return res.status(401).send(Response.tokenFailResp('Access token is required.'));

        jwt.verify(JSON.parse(token), config.get('token_secret'), async (error, userData) => {
            if (error == 'JsonWebTokenError: invalid signature') {
                jwt.verify(JSON.parse(token), config.get('user_token_secret'), async (err, userData) => {
                    if (err) {
                        return res.status(401).send(Response.tokenFailResp('Invalid access token....'));
                    } else {
                        const adminSchema=`adminschemas`
                        const admindb = await checkCollection(adminSchema);
                        const FindAdmin=await admindb.collection(adminSchema).findOne({orgId:userData?.userData?.orgId})
                        userData.userData.adminId=FindAdmin._id.toString()
                        const result = {
                            state: true,
                            type: 'user',
                            userData,
                        };
                        req.verified = result;
                        req.mainRoute = req.path;
                        let permissionCollection = `permissionschemas`
                        const db = await checkCollection(permissionCollection);

                        if (!db) return res.status(400).send(Response.taskFailResp(`${permissionCollection} collection is not present in database.`));
                        let permissionData = await db.collection(permissionCollection).findOne({ permissionName: result.userData.userData.permission });

                        //store permissionConfig in redis
                        if (permissionData) {
                            await redisClient.set(`${result.userData.userData.email}_permissions`, JSON.stringify(permissionData.permissionConfig));
                        }

                        let adminId = result.userData?.userData?.adminId;
                        let FindData = await db.collection(`adminschemas`).findOne({ _id: ObjectId(adminId) });
                        userData.userData.language = FindData.language;
                        userData.userData.adminName = FindData.firstName;
                        userData.userData.planData = await db.collection(`planschemas`).findOne({ planName: FindData.planName })
                            || await db.collection(`planschemas`).findOne({ planName: 'Free' })
                            || await db.collection(`planschemas`).findOne({ planName: 'basic' });
                        if (new Date() > new Date(FindData.planExpireDate)) {
                            return res.status(402).send(Response.taskFailResp('Your current plan is expired, please contact your admin to upgrade the plan.'));
                        }
                        next();
                    }
                });
            } else if (userData) {
                if (userData?.userData?.isConfigSet === false) {
                    return res.status(402).send(Response.tokenFailResp('Config data is not added.'));
                }
                if (userData?.userData?.verified === false) {
                    return res.status(402).send(Response.tokenFailResp('email is not verified.'));
                }
                // #1193 — Do NOT reject SSO tokens for missing planName.
                // SSO tokens set planName on the admin record; the plan lookup below handles fallback.

                // #1190 — SSO tokens are signed with token_secret but represent regular users.
                // Determine type based on permission field: if permission is set, treat as 'user' for RBAC.
                const permission = userData?.userData?.permission;
                const isSSO = !!permission;
                const tokenType = isSSO ? 'user' : undefined;

                const result = {
                    state: true,
                    userData,
                };
                // #1190 — Set type to 'user' for SSO users so RBAC middleware applies
                if (tokenType) {
                    result.type = tokenType;
                }
                req.verified = result;
                req.mainRoute = req.path;

                const planCollection = `planschemas`;
                const db = await checkCollection(planCollection);

                userData.userData.adminName = result.userData?.userData.firstName;
                userData.userData.adminId = result.userData?.userData._id;
                if (db) {
                    userData.userData.planData = await db.collection(planCollection).findOne({ planName: result.userData?.userData.planName })
                        || await db.collection(planCollection).findOne({ planName: 'Free' })
                        || await db.collection(planCollection).findOne({ planName: 'basic' });
                }

                // #1190 — For SSO users, load and cache permission config for RBAC middleware
                if (isSSO && permission) {
                    const permissionCollection = `permissionschemas`;
                    const permDb = await checkCollection(permissionCollection);
                    if (permDb) {
                        const orgId = userData?.userData?.orgId;
                        let permissionData = await permDb.collection(permissionCollection).findOne({ orgId: String(orgId), permissionName: permission });
                        if (!permissionData) {
                            permissionData = await permDb.collection(permissionCollection).findOne({ permissionName: permission });
                        }
                        if (permissionData) {
                            await redisClient.set(`${userData.userData.email}_permissions`, JSON.stringify(permissionData.permissionConfig));
                        }
                    }
                }

                next();
            } else {
                return res.status(401).send(Response.tokenFailResp('Invalid access token.'));
            }
        });
    } catch (e) {
        return res.status(401).send(Response.tokenFailResp('Invalid access token.'));
    }
}

export default verifyToken;
