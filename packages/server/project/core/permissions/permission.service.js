import Response from '../../response/response.js';
import { checkCollection, updateOneByAdmin, updateOneByUser, deleteOneByAdmin, deleteOneByUser, deleteManyByAdmin, deleteManyByUser } from '../../utils/project.utils.js';
import mongoose from 'mongoose';
import { PermissionMessageNew } from '../language/language.translator.js';
import logger from '../../resources/logs/logger.log.js';
import PermissionValidation from './permission.validate.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import { addExtraPermissions } from './permissions.config.js';
import event from '../event/eventEmitter.js';
import Reuse from '../../utils/reuse.js';
import permissionModel from './permission.model.js';
import notificationsService from '../notifications/notifications.service.js';


/*
If there is any code that can are being used at other places, place them in the reuse.js 
in the utils folder.

the reuse file has the collection names, limit, skip, sort, etc.

To use them create a new object and then use it
e.g.   const reuse = new Reuse(req)
       \\ for group collection name
       reuse.collectionName.project ==> this will give the collection name
*/

class PermissionService {
    async create(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, orgId, planData, adminId, firstName: Name, profilePic: userProfilePic, lastName, creatorId } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const data = req.body;
                const permissionConfig = data.permissionConfig;
                const permissionDetails = data?.permissionName;
                let regex = new RegExp(permissionDetails.toLowerCase(), 'i');
                let newPermission = [];
                let existPermission = [];
                const { error } = PermissionValidation.createPermission(data);
                if (error) {
                    return res.send(Response.projectFailResp(PermissionMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                }
                let totalData = await permissionModel.aggregate([{ $match: { orgId: orgId } }, { $match: { is_default: { $ne: true } } }])
                if (totalData.length == planData.customizePermission) {
                    return res.status(429).send(Response.projectFailResp('Permissions adding limit is reached in your plan, please upgrade your plan.'));
                }
                let response = await permissionModel.find({ permissionName: regex, orgId: orgId });
                if (response.length == 0) {
                    newPermission.push(permissionDetails);
                } else {
                    response.map(oldPermission => {
                        existPermission.push(oldPermission.permissionName);
                    });
                    let regexValue = new RegExp(existPermission.join('|'), 'i');
                    if (!regexValue.test(permissionDetails)) {
                        newPermission.push(permissionDetails);
                    }
                }
                if (existPermission.length) {
                    res.send(Response.projectFailResp(`permission ${existPermission} already exist with organization ${orgId}.`));
                } else {
                    let responseData;
                    let permissionId = await new Promise((resolve, reject) => {
                        if (newPermission.length > 0) {
                            try {
                                newPermission.map(async permission_new => {
                                    let permissionName = {
                                        orgId: orgId,
                                        permissionName: permission_new.toLowerCase(),
                                    };
                                    permissionName.orgId,
                                        permissionName.permissionConfig = permissionConfig,
                                        permissionName.adminId,
                                        permissionName.is_default = false,
                                        permissionName.createdBy = { userId: userId },
                                        permissionName.createdAt = new Date();
                                    responseData = await permissionModel.create(permissionName);
                                    resolve(responseData?._id);
                                });
                            } catch (error) {
                                logger.error(`Error while inserting new permissions ${error.message}`);
                                reject(error);
                            }
                        }
                    });
                    if (newPermission.length > 0) {
                        let permissionData = activityOfUser(`${Name + ' ' + lastName} created a ${newPermission} permission`, 'Permission', Name, 'Created', orgId, userId, userProfilePic);
                        permissionData['permissionId'] = permissionId;
                        event.emit('activity', permissionData);
                        res.send(Response.projectSuccessResp(`${newPermission} permissions created.`));
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${Name + ' ' + lastName} created a ${newPermission} permission.`
                            await notificationsService.adminNotification(message, adminId, userId, { collection: 'permissions', id: permissionId });
                            if (adminId != creatorId && userId != creatorId) {
                                await notificationsService.userNotification(message, userId, creatorId, { collection: 'permissions', id: permissionId });
                            }
                        }
                    }
                }
            } catch (err) {
                logger.error(`error ${err}`);
                res.send(Response.projectFailResp('Error creating permissions.', err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async fetchPermissions(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, orgId, firstName: Name, profilePic: userProfilePic, lastName } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const sortBy = {};
                const custom = req.query.custom;
                sortBy[reuse.orderby || 'createdAt'] = reuse.sort.toString() === 'asc' ? 1 : -1;
                const totalCount = await permissionModel.count({ orgId: orgId });
                let data;
                if (custom) {
                    data = await permissionModel.find({ $and: [{ orgId: orgId }, { is_default: custom }] }).sort(sortBy).skip(reuse.skip).limit(reuse.limit)
                }
                else {
                    data = await permissionModel.find({ orgId: orgId }).sort(sortBy).skip(reuse.skip).limit(reuse.limit)
                }
                if (data.length == 0) {
                    res.send(Response.projectFailResp('Invalid Org Id.'));
                } else {
                    let permissionData = activityOfUser(`${Name + ' ' + lastName} viewed all permissions`, 'Permission', Name, 'Viewed', orgId, userId, userProfilePic);
                    permissionData['permissionId'] = 'All';
                    event.emit('activity', permissionData);
                    let response = {
                        TotalCount: totalCount,
                        Permissions: data,
                    };
                    res.send(Response.projectSuccessResp('Successfully fetched.', response));
                }
            } catch (err) {
                logger.error(`error ${err}`);
                res.send(Response.projectFailResp('Error.', err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async updatePermissions(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, firstName: Name, orgId, profilePic: userProfilePic, lastName, adminId, creatorId } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let permissionId = req?.query?.permissionId;
                const data = req.body;
                const permissionConfig = data.permissionConfig;
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${PermissionMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const { value, error } = PermissionValidation.updatePermission(data);
                if (error) {
                    return res.send(Response.projectFailResp(PermissionMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                }
                let defaultData = await permissionModel.findById({ _id: mongoose.Types.ObjectId(permissionId) });
                let response;
                if (!defaultData) res.send(Response.projectFailResp('Permission is not present, please check ID'));
                if (defaultData.is_default == true) {
                    return res.send(Response.projectFailResp("Can't update default permission."));
                }
                let activity;
                if (value.permissionName) {
                    let permissionName = value?.permissionName;
                    let permissionData = await permissionModel
                        .aggregate([{ $match: { orgId: orgId, _id: { $ne: mongoose.Types.ObjectId(permissionId) } } }, { $match: { permissionName: { $regex: new RegExp('^' + permissionName.toLowerCase(), 'i') } } }]);
                    if (permissionData.length) {
                        return res.send(Response.projectFailResp(`${permissionName} permission Name is already exist, unable to update`));
                    }
                    if (permissionData.length == 0) {
                        let permissionExist = await permissionModel.findById({ _id: mongoose.Types.ObjectId(permissionId) })
                        const updateKey = { permissionName: permissionName.toLowerCase(), permissionConfig: permissionConfig, updatedAt: new Date() };

                        let userPermission = await db.collection(reuse.collectionName.user).find({ permission: new RegExp('^' + permissionExist.permissionName.toLowerCase(), 'i') }).toArray();
                        if (reuse.result.type === 'user') {
                            response = await updateOneByUser(permissionId, userId, permissionModel, updateKey);
                            if (response === null) { return res.send(Response.projectFailResp(`You are not allowed to update this record`)); }
                            else {
                                userPermission?.map(async item => {
                                    await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: mongoose.Types.ObjectId(item._id) }, { $set: { permission: updateKey.permissionName } }, { returnDocument: 'after' })
                                })
                            }
                        } else {
                            response = await updateOneByAdmin(permissionId, permissionModel, updateKey);
                            userPermission?.map(async item => {
                                await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: mongoose.Types.ObjectId(item._id) }, { $set: { permission: updateKey.permissionName } }, { returnDocument: 'after' })
                            })
                        }
                    }
                    activity = `${Name} updated the permission name as ${value.permissionName} and permission config.`;
                } else {
                    const updateKey = { permissionConfig: permissionConfig, updatedAt: new Date() };
                    if (reuse.result.type === 'user') {
                        response = await updateOneByUser(permissionId, userId, permissionModel, updateKey);
                    } else {
                        response = await updateOneByAdmin(permissionId, permissionModel, updateKey);
                    }
                }
                let permissionData = activityOfUser(`${Name + ' ' + lastName} updated the permission config`, 'Permission', Name, 'Updated', orgId, userId, userProfilePic);
                permissionData['permissionId'] = permissionId;
                event.emit('activity', permissionData);
                if (reuse.result.type === 'user') {
                    // To Admin
                    const message = `${Name + ' ' + lastName} updated the permission config.`
                    await notificationsService.adminNotification(message, adminId, userId, { collection: 'permissions', id: permissionId });
                    if (adminId != creatorId && userId != creatorId) {
                        await notificationsService.userNotification(message, userId, creatorId, { collection: 'permissions', id: permissionId });
                    }
                }
                res.send(Response.projectSuccessResp('Successfully updated', response));
            } catch (err) {
                logger.error(`error ${err}`);
                res.send(Response.projectFailResp('Invalid permission Id', err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async deletePermissions(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, orgId, firstName: Name, profilePic: userProfilePic, lastName, adminId, creatorId } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const permissionId = req?.query?.permissionId;
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${PermissionMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                if (permissionId) {
                    let permissionData = await permissionModel.findById({ _id: mongoose.Types.ObjectId(permissionId) });
                    if (!permissionData) {
                        return res.send(Response.projectFailResp('Permission is not present, Please check ID'));
                    }
                    if (permissionData.is_default === true) {
                        return res.send(Response.projectFailResp("can't delete default Permission"));
                    }
                    const permissionName = permissionData?.permissionName;
                    let isPermissionAssigned = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { orgId: orgId } }, { $match: { permission: permissionName } }])
                        .toArray();
                    if (isPermissionAssigned.length) {
                        return res.send(Response.projectFailResp(PermissionMessageNew['DELETE_FAIL_USER'][language ?? 'en']));
                    }
                    else {
                        let data;
                        if (reuse.result.type === 'user') {
                            data = await deleteOneByAdmin(permissionId, permissionModel);
                            if (data.deletedCount === 0) return res.send(Response.projectFailResp(`You are not allowed to update this record`));
                        } else {
                            data = await deleteOneByAdmin(permissionId, permissionModel);
                        }
                        let permissionDeleteData = activityOfUser(`${Name + ' ' + lastName} deleted the ${permissionData.permissionName} permission`, 'Permission', Name, 'Deleted', orgId, userId, userProfilePic);
                        permissionDeleteData['permissionId'] = permissionId;
                        event.emit('activity', permissionDeleteData);
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${Name + ' ' + lastName} deleted the ${permissionData.permissionName} permission.`
                            await notificationsService.adminNotification(message, adminId, userId, { collection: 'permissions', id: permissionId });
                            if (adminId != creatorId && userId != creatorId) {
                                await notificationsService.userNotification(message, userId, creatorId, { collection: 'permissions', id: permissionId });
                            }
                        }
                        res.send(Response.projectSuccessResp('permissions deleted successfully', data));
                    }
                } else {
                    const allPermissionData = await permissionModel
                        .aggregate([{ $match: { orgId: orgId } }]);
                    const allData = allPermissionData.map(item => {
                        let data = item.permissionName;
                        return data;
                    });
                    const isPermissionPresent = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { orgId: orgId } }])
                        .toArray();
                    const userPermissions = isPermissionPresent.map(item => {
                        let data = item.permission;
                        return data;
                    });
                    const output = allData.filter(function (obj) {
                        return userPermissions.indexOf(obj) !== -1;
                    });
                    if (!output.length) {
                        const data = await permissionModel
                            .aggregate([{ $match: { $and: [{ orgId: orgId }, { is_default: { $ne: true } }] } }]);
                        data.forEach(async function (ele) {
                            const key = { is_default: { $ne: true } };
                            if (reuse.result.type === 'user') {
                                await deleteManyByUser(key, _id, permissionModel);
                            } else {
                                await deleteManyByAdmin(key, permissionModel);
                            }
                        });
                        data.length
                            ? res.send(Response.projectSuccessResp('Permission deleted successfully', { DeletedCount: data.length }))
                            : res.send(Response.projectFailResp('there is no permission present except default permissions'));
                    }
                    else {

                        const response = await permissionModel
                            .aggregate([{ $match: { $and: [{ orgId: orgId }, { is_default: { $ne: true } }, { permissionName: { $nin: output } }] } }]);
                        response.forEach(async function (ele) {
                            const key = { permissionName: { $nin: output }, is_default: { $ne: true } };
                            if (reuse.result.type === 'user') {
                                await deleteManyByUser(key, _id, permissionModel);
                            } else {
                                await deleteManyByAdmin(key, permissionModel);
                            }
                        });
                        let permissionDeleteData = activityOfUser(`${Name + ' ' + lastName} deleted all custom permissions`, 'Permission', Name, 'Deleted', orgId, userId, userProfilePic);
                        permissionDeleteData['permissionId'] = 'All';
                        event.emit('activity', permissionDeleteData);
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${Name + ' ' + lastName} deleted all custom permissions.`
                            await notificationsService.adminNotification(message, adminId, userId, { collection: 'permissions', id: null });
                            if (adminId != creatorId && userId != creatorId) {
                                await notificationsService.userNotification(message, userId, creatorId, { collection: 'permissions', id: null });
                            }
                        }
                        response.length
                            ? res.send(Response.projectSuccessResp('Permission deleted successfully', { DeletedCount: response.length }))
                            : res.send(Response.projectFailResp('there is no permission present except default permissions'));
                    }
                }
            } catch (err) {
                logger.error(`error ${err}`);
                res.send(Response.projectFailResp('Invalid permission Id', err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }
    async multideletePermissions(req, res) {
        const reuse = new Reuse(req);
        const { language, planName } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {

                let response;
                for (const ele of req?.body?.permissionsIds) {
                    let findpermission = await permissionModel.findOne({ _id: ele.id });
                    let permissionName = findpermission.permissionName;
                    const userDb = await checkCollection(reuse.collectionName.user);
                    const user_details = await userDb.collection(reuse.collectionName.user).find({ permission: permissionName }).toArray();
                    if(user_details.length>0){
                    for (const key of user_details) {
                        const findpermissions = await permissionModel.find({ is_default: true })
                        await userDb.collection(reuse.collectionName.user).findOneAndUpdate({ _id: ObjectId(key._id) }, { $set: { permission: findpermissions[0].permissionName } }, { returnDocument: 'after' });
                    }
                }
            }
                const key = { _id: { $in: req?.body?.permissionsIds.map(permission=>permission.id) }, is_default: { $ne: true } };
                response = await permissionModel.deleteMany(key);
                response.deletedCount > 0 ?
                    res.send(Response.projectSuccessResp("Permission deleted successfully")) :
                    res.send(Response.projectFailResp("Failed to delete permissions,please check provided Ids"));

            } catch (err) {
                return res.send(Response.projectFailResp("Error while deleting permissions", err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async updateNewPermission(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, orgId, firstName: Name, profilePic: userProfilePic, lastName } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const permissionId = req?.query?.permissionId;
                let newConfig = req.body;
                let validationConfig,
                    newObject = {},
                    invalidObject;
                addExtraPermissions.map(ele => {
                    Object.keys(newConfig).map(el => {
                        if (ele == el) {
                            validationConfig = newConfig[el];
                            newObject[el] = validationConfig;
                        }
                    });
                });
                invalidObject = Object.keys(newConfig).filter(word => !Object.keys(newObject).includes(word));
                const { error } = PermissionValidation.additionalPermission(validationConfig);
                if (error) {
                    return res.send(Response.projectFailResp(PermissionMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                }
                let defaultData = await permissionModel.findById({ _id: mongoose.Types.ObjectId(permissionId) });
                let oldData = defaultData.permissionConfig;
                oldData = { ...oldData, ...newObject };
                if (!defaultData) res.send(Response.projectFailResp('Permission is not present, please check ID'));
                else {
                    const data = await permissionModel.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(permissionId) },
                        {
                            $set: {
                                permissionConfig: oldData,
                            },
                        },
                        { returnDocument: 'after' }
                    );
                    let activity = `${Name + ' ' + lastName} Added the ${Object.getOwnPropertyNames(newConfig)[0]} new permission config for ${defaultData.permissionName} permission`;
                    let categoryType = 'Created';
                    let permissionData = activityOfUser(activity, Name, categoryType, orgId, userId, userProfilePic);
                    permissionData['permissionId'] = permissionId;
                    event.emit('activity', permissionData);
                    res.send(
                        Response.projectSuccessResp(
                            invalidObject.length
                                ? ('Successfully updated', { error: `${invalidObject} name is not allowed Please give correct input`, UpdatedData: data })
                                : 'Successfully updated',
                            data
                        )
                    );
                }
            } catch (err) {
                logger.error(`error ${err}`);
                res.send(Response.projectFailResp('Invalid permission Id', err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }
    async searchPermissions(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, orgId, firstName, profilePic: userProfilePic, lastName } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let permissionData = [];
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${PermissionMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));

                let query = {};
                if (req?.query.keyword) {
                    const keyword = req?.query.keyword;
                    logger.info(keyword);
                    query.$or = [
                        { permissionName: new RegExp(keyword, 'i') },
                        { updatedAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                        { createdAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                        { orgId: new RegExp(keyword, 'i') },
                    ];
                }
                let myFilters = {};

                if (req?.query.permissionName) {
                    logger.info(req?.query.permissionName);
                    myFilters['permissionName'] = new RegExp(req?.query.permissionName, 'i');
                }
                if (req?.query.updatedAt) {
                    logger.info(req?.query.updatedAt);
                    myFilters['updatedAt'] = new Date(req?.query.updatedAt);
                }
                const sortBy = {};
                sortBy[reuse.orderby || 'permissionName'] = reuse.sort.toString() === 'asc' ? 1 : -1;
                let resp = await permissionModel
                    .aggregate([{ $match: { $and: [query, { orgId: orgId }] } }])
                    .sort(sortBy)
                    .skip(reuse.skip)
                    .limit(reuse.limit)
                await Promise.all(
                    resp?.map(async permission => {
                        const assignedPermission = await db
                            .collection(reuse.collectionName.user)
                            .aggregate([{ $match: { permission: new RegExp('^' + permission.permissionName, 'i') } }, { $project: reuse.userObj }])
                            .toArray();
                        let filterData = {
                            permission,
                            AssignedPermission: assignedPermission,
                        };
                        permissionData.push(filterData);
                    })
                );
                const totalPermission = await permissionModel.aggregate([{ $match: { $and: [query, { orgId: orgId }] } }])
                let permissionDetails = activityOfUser(`${firstName + ' ' + lastName} searched permission by ${reuse.orderby} .`, 'Permission', firstName, 'Searched', orgId, userId, userProfilePic);
                event.emit('activity', permissionDetails);
                let data = {
                    skip: reuse.skip,
                    TotalPermissionCount: resp.length,
                    totalPermissionData: resp,
                };
                logger.info(data);
                return res.send(Response.projectSuccessResp('Permissions searched successfully', data));
            } catch (error) {
                logger.error(`error ${error}`);
                return res.send(Response.projectFailResp('Failed to search permissions', error));
            }
        }
    }

    async addPermissionConfig(req, res, _next) {
        try {
          const newPermissionConfig = req.body.permissionConfig;
          const permissionName = req.body.permissionName;
      
          // Define names to exclude if "all" is selected
          const excludedNames = ['admin', 'read', 'write'];
      
          // Determine query condition
          const query = permissionName === 'all'
            ? { permissionName: { $nin: excludedNames } }
            : { permissionName };
      
          const permissionConfigUpdate = await permissionModel.find(query);
      
          const updatedPermissions = permissionConfigUpdate.map(config => {
            const currentConfig = config.permissionConfig;
            const updatedConfig = {};
      
            // Maintain order from newPermissionConfig
            for (const [key, value] of Object.entries(newPermissionConfig)) {
              updatedConfig[key] = currentConfig[key] || value;
            }
      
            return {
              ...config.toObject(),
              permissionConfig: updatedConfig
            };
          });
      
          // Update each document
          await Promise.all(
            updatedPermissions.map(updatedDoc =>
              permissionModel.updateOne(
                { _id: updatedDoc._id },
                { $set: { permissionConfig: updatedDoc.permissionConfig } }
              )
            )
          );
      
          const data = {
            totalCount: updatedPermissions.length,
            updatedPermissions
          };
      
          return res.send(Response.projectSuccessResp('Permissions updated successfully', data));
      
        } catch (error) {
          logger.error(`error ${error}`);
          return res.send(Response.projectFailResp('Failed to update permissions', error));
        }
      }
      
      
}
  
export default new PermissionService();
