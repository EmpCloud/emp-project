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
                        let responseData = await redisClient.set(`${result.userData.userData.email}_permissions`, JSON.stringify(permissionData.permissionConfig));

                        let FindData = await adminSchema.findOne({ _id: ObjectId(result.userData?.userData.adminId) });
                        userData.userData.language = FindData.language;
                        userData.userData.adminName = FindData.firstName;
                        userData.userData.planData = await planModel.findOne({ planName: FindData.planName })
                            || await planModel.findOne({ planName: 'Free' });
                        if (new Date() > new Date(FindData.planExpireDate)) {
                            return res.status(402).send(Response.tokenFailResp('Your current plan is expired, please contact your admin to upgrade the plan.'));
                        }
                        next();
                    }
                });
            } else if (userData != null) {
                console.log(error,'error');
                if (userData?.userData?.isConfigSet == false && userData?.userData?.planName != null) {
                    console.log(userData?.userData?.isConfigSet == false, userData?.userData?.planName != null);
                    return res.status(402).send(Response.tokenFailResp('config data is not added'));
                }
                if (userData?.userData?.verified == false) {
                    return res.status(402).send(Response.tokenFailResp('email is not verified'));
                }
                // if (!req.path.includes('/config') && !req.path.includes('/config-get')) {
                //     if (userData?.userData?.isDasboardConfigSet == false && userData?.userData?.planName != null && userData?.userData?.isConfigSet == true) {
                //         return res.status(402).send(Response.tokenFailResp('Please select dashboard config data'));
                //     }
                // }
                if (req.path == '/get') {
                    if (new Date() > new Date(userData.userData.planExpireDate) && req.path !== '/v1/plan/get'&& req.path !== '/v1/admin/delete-admin'&& req.path !== '/v1/plan/expire/date'&& req.path !== '/v1/plan/downgrade-info'&& req.path !== '/v1/plan/project-downgrade-info'&& req.path !== '/v1/plan/User-downgrade-info'&& req.path !== '/v1/plan/delete-downgraded-projects') {
                        return res.status(402).send(Response.tokenFailResp('Your current plan is expired, please upgrade plan.'));
                    }
                } else if (new Date() > new Date(userData.userData.planExpireDate) && req.path != '/v1/plan/select'&& req.path !== '/v1/admin/delete-admin'&& req.path !== '/v1/plan/expire/date'&& req.path !== '/v1/plan/downgrade-info'&& req.path !== '/v1/plan/project-downgrade-info'&& req.path !== '/v1/plan/User-downgrade-info'&& req.path !== '/v1/plan/delete-downgraded-projects') {
                    return res.status(402).send(Response.tokenFailResp('Your current plan is expired, please upgrade plan.'));
                }
                const result = {
                    state: true,
                    userData,
                };
                req.verified = result;
                userData.userData.adminName = result.userData?.userData.firstName;
                userData.userData.adminId = result.userData?.userData._id;
                userData.userData.planData = await planModel.findOne({ planName: result.userData?.userData.planName })
                    || await planModel.findOne({ planName: 'Free' });
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
