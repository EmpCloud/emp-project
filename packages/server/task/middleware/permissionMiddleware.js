import redisClient from '../resources/database/redis.connect.js';
import Response from '../response/response.js';
import { PermissionMiddlewareMessage } from '../core/language/language.translator.js';
import { createAccessRouteCheck, deleteAccessRouteCheck, editAccessRouteCheck, viewAccessRouteCheck } from './routeChecker.js';
import { viewPermissionConfigChecker, createPermissionConfigChecker, editPermissionConfigChecker, deletePermissionConfigChecker } from './permissionConfigChecker.js';
import { checkCollection } from '../utils/common.utils.js';

// #1193 — Helper to load permission config from Redis with DB fallback
async function getPermissionConfig(email, orgId, permission) {
    let permissionConfig = null;
    try {
        const cached = await redisClient.get(`${email}_permissions`);
        if (cached) permissionConfig = JSON.parse(cached);
    } catch (e) { /* ignore redis errors */ }
    if (!permissionConfig) {
        // Fallback: load from MongoDB
        const permCollection = 'permissionschemas';
        const db = await checkCollection(permCollection);
        if (db) {
            let permData = await db.collection(permCollection).findOne({ orgId: String(orgId), permissionName: permission });
            if (!permData) permData = await db.collection(permCollection).findOne({ permissionName: permission });
            if (permData) {
                permissionConfig = permData.permissionConfig;
                try { await redisClient.set(`${email}_permissions`, JSON.stringify(permissionConfig)); } catch(e) {}
            }
        }
    }
    return permissionConfig;
}

async function viewAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute?.split('/').splice(2).join('/') ?? '';
    let pathCheck = viewPermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            const permissionConfig = await getPermissionConfig(result.userData.userData.email, result.userData.userData.orgId, result.userData.userData.permission);
            let routeCheck = viewAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig?.[pathCheck]?.view) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.taskFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}
async function createAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute?.split('/').splice(2).join('/') ?? '';
    let pathCheck = createPermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            const permissionConfig = await getPermissionConfig(result.userData.userData.email, result.userData.userData.orgId, result.userData.userData.permission);
            let routeCheck = createAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig?.[pathCheck]?.create) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.taskFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}
async function editAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute?.split('/').splice(2).join('/') ?? '';
    let pathCheck = editPermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            const permissionConfig = await getPermissionConfig(result.userData.userData.email, result.userData.userData.orgId, result.userData.userData.permission);
            let routeCheck = editAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig?.[pathCheck]?.edit) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.taskFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}

async function deleteAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute?.split('/').splice(2).join('/') ?? '';
    let pathCheck = deletePermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            const permissionConfig = await getPermissionConfig(result.userData.userData.email, result.userData.userData.orgId, result.userData.userData.permission);
            let routeCheck = deleteAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig?.[pathCheck]?.delete) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.taskFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}

export { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck };
