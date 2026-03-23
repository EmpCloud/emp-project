import redisClient from '../resources/database/redis.connect.js';
import Response from '../response/response.js';
import { PermissionMiddlewareMessage } from '../core/language/language.translator.js';
import { createAccessRouteCheck, deleteAccessRouteCheck, editAccessRouteCheck, viewAccessRouteCheck } from './routeChecker.js';
import { viewPermissionConfigChecker, createPermissionConfigChecker, editPermissionConfigChecker, deletePermissionConfigChecker } from './permissionConfigChecker.js';
import { connection } from '../resources/database/mongo.connect.js'
import permissionModel from '../core/permissions/permission.model.js';
import config from 'config';
import { checkCollection } from '../utils/project.utils.js';

async function viewAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute;
    let pathCheck = viewPermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    let permissionConfig = JSON.parse(await redisClient.get(`${result.userData.userData.email}_permissions`));
    let path = req?.path;

    try {
        if (result.type === 'user') {
            let routeCheck = viewAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig[pathCheck]?.view) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.projectFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}
async function createAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute;
    const orgId = result?.userData?.userData?.orgId;
    const collectionName = `org_${orgId.toLowerCase()}_users`;
    const db = await checkCollection(collectionName);
    const userDetails = await db?.collection(collectionName)?.findOne({email:result?.userData?.userData?.email});
    let permissionData = await permissionModel.findOne({ permissionName: userDetails?.permission });

    let pathCheck = createPermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    // let permissionConfig = JSON.parse(await redisClient.get(`${result.userData.userData.email}_permissions`));
    let permissionConfig = permissionData?.permissionConfig;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            let routeCheck = createAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig[pathCheck].create) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.projectFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}
async function editAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute;
    const {orgId} = result.userData.userData;
    const collectionName = `org_${orgId.toLowerCase()}_users`;
    const db = await checkCollection(collectionName);
    const userDetails = await db?.collection(collectionName)?.findOne({email:result?.userData?.userData?.email});
    let permissionData = await permissionModel.findOne({ permissionName: userDetails?.permission });
    let pathCheck = editPermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
      // let permissionConfig = JSON.parse(await redisClient.get(`${result.userData.userData.email}_permissions`));
      let permissionConfig = permissionData?.permissionConfig;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            let routeCheck = editAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig[pathCheck].edit) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.projectFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}

async function deleteAccessCheck(req, res, next) {
    let result = req.verified;
    let mainPath = req?.mainRoute;
    const {orgId} = result.userData.userData;
    const collectionName = `org_${orgId.toLowerCase()}_users`;
    const db = await checkCollection(collectionName);
    const userDetails = await db?.collection(collectionName)?.findOne({email:result?.userData?.userData?.email});
    let permissionData = await permissionModel.findOne({ permissionName: userDetails?.permission });
    mainPath = req?.mainRoute?.split('/').splice(2).join('/') ?? '';
    let pathCheck = deletePermissionConfigChecker(mainPath);
    let language = result.userData.userData.language;
    // let permissionConfig = JSON.parse(await redisClient.get(`${result.userData.userData.email}_permissions`));
    let permissionConfig = permissionData?.permissionConfig;
    let path = req?.path;

    try {
        if (result.type === 'user') {
            let routeCheck = deleteAccessRouteCheck(path);
            if (!routeCheck || !pathCheck || !permissionConfig[pathCheck].delete) {
                return res.status(400).send(Response.accessDeniedResp(PermissionMiddlewareMessage['ACCESS_DENIED'][language ?? 'en']));
            }
        }
        next();
    } catch (err) {
        return res.send(Response.projectFailResp(PermissionMiddlewareMessage['FAILED_ACCESS'][language ?? 'en']));
    }
}

export { viewAccessCheck, editAccessCheck, createAccessCheck, deleteAccessCheck };
