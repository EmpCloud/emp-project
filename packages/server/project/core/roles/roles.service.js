import Response from '../../response/response.js';
import { checkCollection, removeObjectNull, updateOneByAdmin, updateOneByUser, deleteManyByAdmin, deleteManyByUser, deleteOneByUser, deleteOneByAdmin } from '../../utils/project.utils.js';
import logger from '../../resources/logs/logger.log.js';
import RoleValidation from './roles.validate.js';
import { ObjectId } from 'mongodb';
import { RolesMessageNew } from '../language/language.translator.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/eventEmitter.js';
import Reuse from '../../utils/reuse.js';
import permissionModel from '../permissions/permission.model.js';
import roleModel from './roles.model.js';
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

class RolesService {
    async create(req, res) {
        const reuse = new Reuse(req);
        const { language, planData, orgId, profilePic, firstName, _id, adminId, lastName, creatorId, permission } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const data = req.body;
                const rolesDetails = (data?.roles).map(role => role.toLowerCase());
                const { value, error } = RoleValidation.createRole({ rolesDetails });
                if (error) {
                    return res.send(Response.projectFailResp(RolesMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                }
                let regex = rolesDetails.map(function (e) {
                    return e.toLowerCase();
                });
                let newRole = [];
                let existRole = [];
                const totalRolesCount = await roleModel
                    .aggregate([{ $match: { orgId: orgId } }, { $match: { is_default: { $ne: true } } }]);
                let presentRoles = totalRolesCount.length + rolesDetails.length;
                if (presentRoles > planData.customizeRoles) {
                    if (planData.customizeRoles - totalRolesCount.length == 0) {
                        return res.status(429).send(Response.projectFailResp(RolesMessageNew['ROLE_PLAN_LIMIT'][language ?? 'en']));
                    }
                }
                let response = await roleModel
                    .find({ roles: { $in: regex }, orgId: orgId })
                if (response.length == 0) {
                    rolesDetails.map(roleList => newRole.push(roleList));
                } else {
                    response.map(oldRole => {
                        existRole.push(oldRole.roles);
                    });
                }
                var regexValue = new RegExp(existRole.join('|'), 'i');
                let newRes = rolesDetails.filter(d => !regexValue.test(d));
                newRes.map(roleList => newRole.push(roleList));
                let roleInsert;
                if (newRole.length > 0) {
                    try {
                        newRole.map(async role_new => {
                            let roles = {
                                orgId: orgId,
                                roles: role_new.toLowerCase(),
                                is_default: value.is_default,
                            };
                            roles.orgId;
                            roles.adminId = adminId;
                            roles.createdBy = { userId: _id };
                            roles.createdAt = new Date();
                            roles.updatedAt = new Date();
                            const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                            if (reuse.result.type === 'user' && permissionCheck.permissionConfig.roles.create == false) {
                                return res.send(Response.projectFailResp(`You don't have permission to create role`));
                            }
                            roleInsert = await roleModel.create(roles);
                            if (roleInsert) {
                                let rolesActivityDetails = activityOfUser(`${firstName + ' ' + lastName} created the ${newRole} roles.`, 'Roles', firstName, 'Created', orgId, _id, profilePic);
                                rolesActivityDetails['roleId'] = roleInsert._id.toString();
                                event.emit('activity', rolesActivityDetails);
                                if (reuse.result.type === 'user') {
                                    // To Admin
                                    const message = `${firstName + ' ' + lastName} created the ${newRole} roles.`
                                    await notificationsService.adminNotification(message, adminId, _id, { collection: 'roles', id: roleInsert._id.toString() });
                                    if (adminId != creatorId && _id != creatorId) {
                                        await notificationsService.userNotification(message, _id, creatorId, { collection: 'roles', id: roleInsert._id.toString() });
                                    }
                                }
                            }
                        });
                    } catch (error) {
                        logger.error(`Error while inserting new Roles ${error.message}`);
                    }
                }

                if (existRole.length) {
                    newRole.length
                        ? res.send(Response.projectSuccessResp(`${newRole} ${RolesMessageNew['ROLES_ADD_SUCCESS'][language ?? 'en']} ${existRole} ${RolesMessageNew['ROLES_EXIST'][language ?? 'en']}`))
                        : res.send(Response.projectFailResp(`${existRole} ${RolesMessageNew['ROLES_EXIST'][language ?? 'en']} `));
                } else {
                    res.send(Response.projectSuccessResp(`${newRole} ${RolesMessageNew['ROLES_ADD_SUCCESS'][language ?? 'en']}`));
                }
            } catch (err) {
                res.send(Response.projectFailResp(RolesMessageNew['ROLES_ADD_FAIL'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async fetchRoles(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, _id, profilePic, firstName, lastName } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const role = req.query.roleName;
                const custom = req.query.custom;
                let userObj = {
                    _id: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: 1,
                    orgId: 1,
                    profilePic: 1,
                    isAdmin: 1,
                    isSuspended: 1
                };
                const { value, error } = RoleValidation.fetchRole({ orderby: reuse.orderby || 'createdAt', skipValue: reuse.skip, limitValue: reuse.limit });
                if (error) {
                    return res.send(Response.projectFailResp(RolesMessageNew['VALIDATION_FAIL'], error.message));
                }
                const sortBy = {};
                sortBy[reuse.orderby || 'roles'] = reuse.sort.toString() === 'asc' ? 1 : -1;
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${RolesMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                if (role) {
                    const rolesDetails = await roleModel.findOne({ roles: role });
                    const assignedRole = await db.collection(reuse.collectionName.user).aggregate([{ $match: { $and: [{ role: role }, { invitation: 1 }, { softDeleted: false }] } }, {
                        $project: userObj
                    },
                    ]).toArray();
                    let data = {
                        RoleAssignedUserCount: assignedRole?.length,
                        roleData: rolesDetails,
                        AssignedUserRole: assignedRole,
                    };
                    if (rolesDetails) {
                        const rolesActivityDetails = activityOfUser(`${firstName} viewed ${role} role.`, 'Roles', firstName, 'Viewed', orgId, _id, profilePic);
                        rolesActivityDetails['roleId'] = rolesDetails._id.toString();
                        event.emit('activity', rolesActivityDetails);
                    }
                    return rolesDetails
                        ? res.send(Response.projectSuccessResp(RolesMessageNew['ROLES_FETCH_SUCCESS'][language ?? 'en'], data))
                        : res.send(Response.projectFailResp(RolesMessageNew['ROLES_FETCH_FAIL'][language ?? 'en']));
                }
                let rolesData, roleCount;
                roleCount = await roleModel.countDocuments({ orgId: orgId })
                if (custom) {
                    rolesData = await roleModel
                        .find({ $and: [{ orgId: orgId }, { is_default: custom }] })
                        .sort(sortBy)
                        .skip(value.skipValue)
                        .limit(value.limitValue)
                }
                else {
                    rolesData = await roleModel
                        .find({ orgId })
                        .sort(sortBy)
                        .skip(value.skipValue)
                        .limit(value.limitValue)
                }
                let data = await Promise.all(
                    rolesData.map(async item => {
                        let temp = item.toJSON()
                        let assignedRole = await db.collection(reuse.collectionName.user).aggregate([{ $match: { $and: [{ role: temp.roles }, { invitation: 1 }, { softDeleted: false }] } },
                        {
                            $project: userObj
                        },
                        ]).toArray()
                        temp.AssignedUserRole = assignedRole;
                        return temp;
                    }))
                let response = {
                    rolesCount: roleCount,
                    totalRolesData: data,
                };
                if (rolesData.length > 0) {
                    let rolesActivityDetails = activityOfUser(`${firstName + ' ' + lastName} viewed all roles.`, 'Roles', firstName, 'Viewed', orgId, _id, profilePic);
                    event.emit('activity', rolesActivityDetails);
                }
                response
                    ? res.send(Response.projectSuccessResp(RolesMessageNew['ROLES_FETCH_SUCCESS'][language ?? 'en'], response))
                    : res.send(Response.projectFailResp(RolesMessageNew['ROLES_FETCH_FAIL'][language ?? 'en']));

            } catch (err) {
                logger.error(`Error while fetching Roles ${err.message}`);
                return res.send(Response.projectFailResp(RolesMessageNew['ROLES_FETCH_FAILED'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async updateRoles(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, firstName, _id, profilePic, lastName, adminId, creatorId, permission } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const roleId = req?.query?.roleId;
                const role = req?.body;
                const roleValue = role.roleName.toLowerCase();
                const { error } = RoleValidation.updateRole(role);
                if (error) {
                    return res.send(Response.projectFailResp(RolesMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                }
                const isRoleExist = await roleModel
                    .aggregate([{ $match: { orgId: orgId } }])
                const userRoles = isRoleExist.map(item => {
                    let data = item.roles;
                    return data;
                });
                const output = userRoles.find(role => role === roleValue);
                let isExist = await roleModel.findOne({ _id: ObjectId(roleId) });
                if (output && isExist.is_default === true) {
                    return res.send(Response.projectFailResp(RolesMessageNew['ROLES_DEFAULT_FAILED'][language ?? 'en']));
                }
                if (isExist.is_default === true) {
                    return res.send(Response.projectFailResp(RolesMessageNew['ROLES_DEFAULT_FAIL'][language ?? 'en']));
                }
                if (output) {
                    return res.send(Response.projectFailResp(RolesMessageNew['ROLES_UPDATE_FAIL'][language ?? 'en']));
                }
                let data;
                const updateKey = { roles: roleValue, updatedAt: new Date() };
                if (reuse.result.type === 'user' && permission != 'admin') {
                    data = await updateOneByUser(roleId, _id, roleModel, updateKey);
                    if (!data) return res.send(Response.projectFailResp(`You are not allowed to update record which are created by someone else`));
                } else {
                    data = await updateOneByAdmin(roleId, roleModel, updateKey);
                }
                if (data) {
                    const db = await checkCollection(reuse.collectionName.user);
                    if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${RolesMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                    let userRole = await db.collection(reuse.collectionName.user).find({ role: new RegExp('^' + isExist.roles.toLowerCase(), 'i') }).toArray();
                    userRole?.map(async item => {
                        let updateRole = await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: ObjectId(item._id) }, { $set: { role: data.roles } }, { returnDocument: 'after' })
                    })
                    let rolesActivityDetails = activityOfUser(`${firstName + ' ' + lastName} updated ${isExist.roles} role name as ${roleValue} .`, 'Roles', firstName, 'Updated', orgId, _id, profilePic);
                    rolesActivityDetails['roleId'] = roleId;
                    event.emit('activity', rolesActivityDetails);
                    if (reuse.result.type === 'user') {
                        // To Admin
                        const message = `${firstName + ' ' + lastName} updated ${isExist.roles} role name as ${roleValue} .`
                        await notificationsService.adminNotification(message, adminId, _id, { collection: 'roles', id: roleId });
                        if (adminId != creatorId && _id != creatorId) {
                            await notificationsService.userNotification(message, _id, creatorId, { collection: 'roles', id: roleId });
                        }
                    }
                    return res.send(Response.projectSuccessResp(RolesMessageNew['ROLES_UPDATE_SUCCESS'][language ?? 'en'], data));
                }
            } catch (err) {
                logger.error(`Error while updating Roles ${err.message}`);
                res.send(Response.projectFailResp(RolesMessageNew['ROLES_FOUND'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async fetchRoleByPermissions(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, firstName, profilePic, _id, lastName } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const role = req.query.roleName;
                const permission = req.query.permission;
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) {
                    return res.status(400).send(Response.projectFailResp(`Invitation ${RolesMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                }
                const userDatabase = await checkCollection(reuse.collectionName.user);
                if (!userDatabase) return res.status(400).send(Response.projectFailResp(`Invitation ${RolesMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                if (role && permission) {
                    const rolesDetails = await roleModel.findOne({ roles: role.toLowerCase() });
                    if (!rolesDetails) {
                        return res.send(Response.projectFailResp(RolesMessageNew['FAILED_FETCH_ROLE'][language ?? 'en']));
                    }
                    const permissionDetails = await permissionModel.findOne({ permissionName: permission.toLowerCase() });
                    if (!permissionDetails) {
                        return res.send(Response.projectFailResp(RolesMessageNew['FAILED_FETCH_PERMISSION'][language ?? 'en']));
                    }
                    const permissionData = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { role: new RegExp('^' + rolesDetails.roles, 'i'), permission: new RegExp('^' + permission, 'i') } }])
                        .toArray();
                    let data = {
                        RoleName: rolesDetails.roles,
                        PermissionCount: permissionData?.length,
                        PermissionData: permissionData,
                    };
                    const rolesActivityDetails = activityOfUser(`${firstName + ' ' + lastName} Viewed userDetails of ${role} role and ${permission} permission.`, 'Roles', firstName, 'Viewed', orgId, _id, profilePic);
                    event.emit('activity', rolesActivityDetails);
                    rolesDetails
                        ? res.send(Response.projectSuccessResp(RolesMessageNew['ROLES_FETCH_SUCCESS'][language ?? 'en'], data))
                        : res.send(Response.projectFailResp(RolesMessageNew['ROLES_FETCH_FAIL'][language ?? 'en']));
                }
            } catch (err) {
                logger.error(`Error while fetching  Roles ${err.message}`);
                return res.send(Response.projectFailResp(RolesMessageNew['ROLES_FETCH_FAILED'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async deleteRoles(req, res) {
        const reuse = new Reuse(req);
        const { language, profilePic, firstName, orgId, _id, adminId, lastName, creatorId, permission } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const roleId = req?.query?.roleId;
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${RolesMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                if (roleId) {
                    const roleData = await roleModel.findOne({ _id: ObjectId(req?.query?.roleId) });
                    if (roleData.is_default === true) {
                        return res.send(Response.projectFailResp(RolesMessageNew['DELETE_DEFAULT_FAIL'][language ?? 'en']));
                    }
                    const roleName = roleData?.roles;
                    let isRoleAssigned = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { orgId: orgId } }, { $match: { role: roleName } }])
                        .toArray();
                    if (isRoleAssigned.length) {
                        return res.send(Response.projectFailResp(RolesMessageNew['DELETE_FAIL_USER'][language ?? 'en']));
                    } else {
                        let data;
                        if (reuse.result.type === 'user' && permission != 'admin') {
                            data = await deleteOneByUser(roleId, _id, roleModel);
                            if (data.deletedCount === 0) return res.send(Response.projectFailResp(`You can't delete roles which are created by someone else`));
                        } else {
                            data = await deleteOneByAdmin(roleId, roleModel);
                        }
                        const rolesDetails = activityOfUser(`${firstName + ' ' + lastName} deleted ${roleData.roles} role.`, 'Roles', firstName, 'Deleted', orgId, adminId, profilePic);
                        rolesDetails['roleId'] = roleId;
                        event.emit('activity', rolesDetails);
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${firstName + ' ' + lastName} deleted ${roleData.roles} role.`
                            await notificationsService.adminNotification(message, adminId, _id, { collection: 'roles', id: roleId });
                            if (adminId != creatorId && _id != creatorId) {
                                await notificationsService.userNotification(message, _id, creatorId, { collection: 'roles', id: roleId });
                            }
                        }
                        data.deletedCount
                            ? res.send(Response.projectSuccessResp(RolesMessageNew['DELETE_SUCCESS'][language ?? 'en'], data))
                            : res.send(Response.projectFailResp(RolesMessageNew['ROLES_FOUND'][language ?? 'en']));
                    }
                } else {
                    const allRoleData = await roleModel
                        .aggregate([{ $match: { orgId: orgId } }]);
                    const allData = allRoleData.map(item => {
                        let data = item.roles;
                        return data;
                    });
                    const isRolePresent = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { orgId: orgId } }])
                        .toArray();
                    const userRoles = isRolePresent.map(item => {
                        let data = item.role;
                        return data;
                    });
                    const output = allData.filter(function (obj) {
                        return userRoles.indexOf(obj) !== -1;
                    });
                    if (!output.length) {
                        const response = await roleModel
                            .aggregate([{ $match: { $and: [{ orgId: orgId }, { is_default: { $ne: true } }] } }]);
                        response.forEach(async function (ele) {
                            const key = { is_default: { $ne: true } };
                            if (reuse.result.type === 'user') {
                                if (reuse.result.userData?.userData.permission == 'admin') {
                                    await deleteManyByAdmin(key, roleModel);
                                }
                                else {
                                    await deleteManyByUser(key, _id, roleModel);
                                }
                            } else {
                                await deleteManyByAdmin(key, roleModel);
                            }
                        });
                        response.length
                            ? res.send(Response.projectSuccessResp(RolesMessageNew['DELETE_SUCCESS'][language ?? 'en']))
                            : res.send(Response.projectSuccessResp(RolesMessageNew['DELETE_ALL_FAIL'][language ?? 'en']));
                    } else {
                        const data = await roleModel
                            .aggregate([{ $match: { $and: [{ orgId: orgId }, { is_default: { $ne: true } }, { roles: { $nin: output } }] } }]);
                        data.forEach(async function (ele) {
                            const key = { roles: { $nin: output }, is_default: { $ne: true } };
                            if (reuse.result.type === 'user') {
                                if (reuse.result.userData?.userData.permission == 'admin') {
                                    await deleteManyByAdmin(key, roleModel);
                                }
                                await deleteManyByUser(key, _id, roleModel);
                            } else {
                                await deleteManyByAdmin(key, roleModel);
                            }
                        });
                        const rolesDetails = activityOfUser(`${firstName + ' ' + lastName} deleted all custom roles.`, 'Roles', firstName, 'Deleted', orgId, adminId, profilePic);
                        event.emit('activity', rolesDetails);
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${firstName + ' ' + lastName} deleted all custom roles.`
                            await notificationsService.adminNotification(message, adminId, _id, { collection: 'roles', id: null });
                            if (adminId != creatorId && _id != creatorId) {
                                await notificationsService.userNotification(message, _id, creatorId, { collection: 'roles', id: null });
                            }
                        }
                        data.length
                            ? res.send(Response.projectSuccessResp(RolesMessageNew['DELETE_SUCCESS'][language ?? 'en']))
                            : res.send(Response.projectFailResp(RolesMessageNew['DELETE_ALL_USERFAIL'][language ?? 'en']));
                    }
                }
            } catch (err) {
                logger.error(`Error while deleting Roles ${err.message}`);
                return res.send(Response.projectFailResp(RolesMessageNew['ROLES_FOUND'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }
    async multiDeleteRoles(req, res) {
        const reuse = new Reuse(req);
        const { language, planName } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let response;
                for (const ele of req?.body?.rolesIds) {
                    let findRole = await roleModel.findOne({ _id: ele.id });
                    let roleName = findRole.roles;
                    const userDb = await checkCollection(reuse.collectionName.user);
                    const user_details = await userDb.collection(reuse.collectionName.user).find({ role: roleName }).toArray();
                    if (user_details.length > 0) {
                        for (const key of user_details) {
                            const findRole = await roleModel.find({ is_default: true })
                            await userDb.collection(reuse.collectionName.user).findOneAndUpdate({ _id: ObjectId(key._id) }, { $set: { role: findRole[0].roleName } }, { returnDocument: 'after' });
                        }
                    }
                }
                const key = { _id: { $in: req.body.rolesIds.map(role => role.id) }, is_default: { $ne: true } };
                response = await roleModel.deleteMany(key);
                response.deletedCount > 0 ?
                    res.send(Response.projectSuccessResp("Roles deleted successfully.")) :
                    res.send(Response.projectFailResp("Failed to delete roles,please check provided Ids"));
            } catch (err) {
                return res.send(Response.projectFailResp("Error while deleting roles", err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async search(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, _id, profilePic, firstName, lastName } = reuse.result.userData?.userData;
        try {
            let rolesData = [];
            const db = await checkCollection(reuse.collectionName.user);
            if (!db) return res.send(Response.projectFailResp(`Invitation ${RolesMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const totalRoles = await roleModel.find({ orgId: orgId });
            let query = {};
            if (req?.query.keyword) {
                const keyword = req?.query.keyword;
                logger.info(keyword);
                query.$or = [
                    { roles: new RegExp(keyword, 'i') },
                    { updatedAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { createdAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { orgId: new RegExp(keyword, 'i') },
                ];
            }
            let myFilters = {};

            if (req?.query.roles) {
                logger.info(req?.query.roles);
                myFilters['roles'] = new RegExp(req?.query.roles, 'i');
            }
            if (req?.query.updatedAt) {
                logger.info(req?.query.updatedAt);
                myFilters['updatedAt'] = new Date(req?.query.updatedAt);
            }
            const sortBy = {};
            sortBy[reuse.orderby || 'roles'] = reuse.sort.toString() === 'asc' ? 1 : -1;
            let resp = await roleModel
                .aggregate([{ $match: { $and: [query, { orgId: orgId }] } }])
                .sort(sortBy)
                .skip(reuse.skip)
                .limit(reuse.limit);
            let data = await Promise.all(
                resp.map(async item => {
                    const assignedRole = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { $and: [{ role: item.roles }, { invitation: 1 }, { softDeleted: false }] } }, {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                role: 1,
                                orgId: 1,
                                profilePic: 1,
                                isSuspended: 1,
                                isAdmin: 1
                            }
                        }])
                        .toArray();
                    item.AssignedUserRole = assignedRole;
                    return item;
                }))
            let response = {
                skip: reuse.skip,
                rolesCount: resp.length,
                totalRolesData: data,
            };
            let rolesDetails = activityOfUser(`${firstName + ' ' + lastName} searched roles by ${reuse.orderby} .`, 'Roles', firstName, 'Searched', orgId, _id, profilePic);
            event.emit('activity', rolesDetails);
            logger.info(response);
            return res.send(Response.projectSuccessResp(RolesMessageNew['ROLE_SEARCH'][language ?? 'en'], response));
        } catch (error) {
            logger.error(`error ${error}`);
            return res.send(Response.projectFailResp(RolesMessageNew['ROLE_SEARCH_FAIL'][language ?? 'en'], error));
        }
    }

    async filter(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language: language, orgId, firstName: firstName, profilePic: profilePic, lastName } = reuse?.result?.userData?.userData;
        try {
            const obj = await removeObjectNull(req?.body);
            const { value, error } = RoleValidation.roleFilter(obj);
            logger.error(error);
            if (error) return res.send(Response.projectFailResp(RolesMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
            if (JSON.stringify(value) == '{}') {
                return res.send(Response.projectFailResp(RolesMessageNew['FIELD_NOT_SELECTED'][language ?? 'en']));
            }
            const db = await checkCollection(reuse.collectionName.user);
            if (!db) return res.send(Response.projectFailResp(`Project ${RolesMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
            let query = [];
            let myFilters = {};
            const sortBy = {};
            sortBy[reuse.orderby || 'roles'] = reuse.sort.toString() === 'asc' ? 1 : -1;
            let userObj = {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
                orgId: 1,
                profilePic: 1,
                isAdmin: 1,
                isSuspended: 1
            };
            if (req?.body.assignMember) {
                let resp;
                if (req?.body?.roleName) {
                    const roleName = req?.body?.roleName;
                    const rolesDetails = await roleModel.find({ orgId: orgId, roles: roleName });
                    resp = await Promise.all(
                        rolesDetails.map(async item => {
                            let temp = item.toJSON()
                            let assignedRole = await db.collection(reuse.collectionName.user).aggregate([{ $match: { $and: [{ orgId: orgId }, { role: temp.roles }, { invitation: 1 }, { softDeleted: false }] } },
                            {
                                $project: userObj
                            },
                            ]).toArray()
                            temp.AssignedUserRole = assignedRole;
                            return temp;
                        }))
                }
                else {
                    for (const user of req?.body.assignMember) {
                        const temp = await db
                            .collection(reuse.collectionName.user)
                            .findOne(
                                { _id: ObjectId(user.id) })
                        const rolesDetails = await roleModel.find({ orgId: orgId, roles: temp.role });
                        resp = await Promise.all(
                            rolesDetails.map(async item => {
                                let temp = item.toJSON()
                                let assignedRole = await db.collection(reuse.collectionName.user).aggregate([{ $match: { $and: [{ orgId: orgId }, { role: temp.roles }, { invitation: 1 }, { softDeleted: false }] } },
                                {
                                    $project: userObj
                                },
                                ]).toArray()
                                temp.AssignedUserRole = assignedRole;
                                return temp;
                            }))
                    }
                }
                let rolesDetails = activityOfUser(`${firstName + ' ' + lastName} Filtered roles data `, 'Roles', firstName, 'Filtered', orgId, userId, profilePic);
                event.emit('activity', rolesDetails);
                return res.send(Response.projectSuccessResp(RolesMessageNew['ROLE_SEARCH'][language ?? 'en'], { TotalCount: resp.length, roleData: resp }));
            }
            if (req?.body.roleName) {
                logger.info(req?.body.roleName);
                query.push({ roles: new RegExp(req?.body.roleName, 'i') });
            }
            if (req?.body.createdAt) {
                query.push({
                    createdAt: {
                        $gte: new Date(req?.body?.createdAt?.startDate),
                        $lt: new Date(new Date(req?.body?.createdAt?.endDate).setHours(23, 59, 59, 999)),
                    },
                });
            }
            if (req?.body.updatedAt) {
                query.push({
                    updatedAt: {
                        $gte: new Date(req?.body?.updatedAt?.startDate),
                        $lt: new Date(new Date(req?.body?.updatedAt?.endDate).setHours(23, 59, 59, 999)),
                    },
                });
            }
            if (query.length) myFilters['$and'] = query;

            let resp = await roleModel
                .aggregate([
                    {
                        $match: { $and: [myFilters, { orgId: orgId }] }
                    },
                ]).sort(sortBy)
                .skip(reuse.skip)
                .limit(reuse.limit);

            let data = await Promise.all(
                resp.map(async item => {
                    const assignedRole = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { $and: [{ orgId: orgId }, { role: item.roles }, { invitation: 1 }, { softDeleted: false }] } }, { $project: userObj }])
                        .toArray();
                    item.AssignedUserRole = assignedRole;
                    return item;
                }))
            let response = {
                skip: reuse.skip,
                rolesCount: resp.length,
                roleData: data,
            };
            let rolesDetails = activityOfUser(`${firstName} Filtered roles data `, 'Roles', firstName, 'Filtered', orgId, userId, profilePic);
            event.emit('activity', rolesDetails);
            res.send(Response.projectSuccessResp(RolesMessageNew['ROLE_SEARCH'][language ?? 'en'], response));
        } catch (error) {
            logger.error(`error ${error}`);
            return res.send(Response.projectFailResp('Failed to search', error));
        }
    }
}
export default new RolesService();
