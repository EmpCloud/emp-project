import Response from '../../response/response.js';
import GroupValidation from './group.validation.js';
import Logger from '../../resources/logs/logger.log.js';
import { checkCollection, checkData, updateOneByAdmin, deleteOneByAdmin, updateOneByUser, deleteOneByUser, deleteManyByAdmin, deleteManyByUser } from '../../utils/project.utils.js';
import mongoose from 'mongoose';
import { GroupMessageNew, UserMessageNew } from '../language/language.translator.js';
import NotificationService from '../notifications/notifications.service.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/eventEmitter.js';
import Reuse from '../../utils/reuse.js';
import groupSchema from './group.schema.js';
import adminModel from '../admin/admin.model.js';
import permissionModel from '../permissions/permission.model.js';
import { ObjectId } from 'mongodb';
import moment from 'moment';


/*
If there is any code that can are being used at other places, place them in the reuse.js 
in the utils folder.

the reuse file has the collection names, limit, skip, sort, etc.

To use them create a new object and then use it
e.g.   const reuse = new Reuse(req)
       \\ for group collection name
       reuse.collectionName.project ==> this will give the collection name
*/
class GroupService {
    async createGroup(req, res) {
        const reuse = new Reuse(req);
        Logger.info(`result: ${reuse.result}`);
        if (reuse.result.state === true) {
            const { language, orgId, _id, firstName, lastName, profilePic, adminId, userName, creatorId, permission, isAdmin } = reuse?.result?.userData?.userData;
            try {
                const data = req.body;
                const assignedMembers = data.group[0].assignedMembers;
                const groupLogo = data?.group[0].groupLogo
                const { error } = GroupValidation.createGroup(data?.group);
                Logger.error(`error ${error}`);
                if (error) {
                    return res.status(400).send(Response.validationFailResp(GroupMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                }
                if (
                    !(
                        groupLogo?.includes('.jpeg') ||
                        groupLogo?.includes('.png') ||
                        groupLogo?.includes('.jpg') ||
                        groupLogo?.includes('.svg+xml') ||
                        groupLogo?.includes('.svg') ||
                        groupLogo?.includes('https') ||
                        groupLogo?.includes('http')
                    ) &&
                    groupLogo
                )
                    return res.status(400).send(Response.validationFailResp('Invalid Input,Provide valid image extension or url for group logo'));
                const db = await checkCollection(reuse?.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`${reuse?.collectionName.user} ${GroupMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
                const groupCount = await groupSchema.countDocuments({ orgId: orgId })
                if (reuse?.result?.userData?.userData?.planData?.groupFeatureCount == 0) {
                    return res.status(429).send(Response.projectFailResp(`Can't Access group feature in Free subscription`));
                }
                if (groupCount >= reuse?.result?.userData?.userData?.planData?.groupFeatureCount) {
                    return res.status(429).send(Response.projectFailResp(GroupMessageNew['GROUP_PLAN_LIMIT'][language ?? 'en']));
                }
                let exist = [];
                let notExist = [];

                for (const ele of assignedMembers) {
                    const userData = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { _id: mongoose.Types.ObjectId(ele.userId) } }])
                        .toArray();
                    if (userData[0].invitation != 1) return res.status(400).send(Response.projectFailResp('Unable to add user,please check invitation status of the user'));
                    if (userData[0].isSuspended === true) return res.send(Response.projectFailResp('Unable to assign user,user is suspended.'));
                    userData.length == 0 ? notExist.push({ userId: ele.userId }) : exist.push({ userId: ele.userId, isAdmin: userData[0].isAdmin });
                }
                if (notExist.length > 0 && exist.length == 0) {
                    res.status(400).send(Response.projectFailResp(notExist, `${GroupMessageNew['USER_NOT_EXIST'][language ?? 'en']}`));
                }
                const dataArray = data?.group?.map(element => {
                    return element;
                });
                for (const key of dataArray) {
                    let isGroupExist = await groupSchema.findOne({ orgId: orgId, groupName: new RegExp(`^${key?.groupName}$`, 'i') });
                    if (isGroupExist) {
                        Logger.info('Group Name Already Exist');
                        res.status(400).send(Response.projectAlreadyExistResp(GroupMessageNew['GROUP_ALREADY_EXIST'][language ?? 'en']));
                    } else {
                        if (notExist.length >= 0 && exist.length > 0) {
                            let group = {
                                adminId: adminId, //TODO - think for User Token
                                groupName: key?.groupName,
                                groupDescription: key?.groupDescription,
                                groupLogo: key?.groupLogo,
                                groupCreatedBy: {
                                    userId: _id,
                                    userName: userName,
                                    isAdmin: isAdmin,
                                    userProfilePic: profilePic,
                                },
                                groupUpdatedBy: {
                                    userId: _id,
                                    userName: userName,
                                    isAdmin: isAdmin,
                                    userProfilePic: profilePic,
                                },
                                createdBy: {
                                    userId: _id,
                                },
                                orgId: orgId
                            };
                            group.assignedMembers = exist;

                            const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                            if (reuse.result.type === 'user' && permissionCheck.permissionConfig.user.create == false) {
                                return res.send(Response.projectFailResp(`You don't have permission to create group`));
                            }
                            let groupData = await groupSchema.create(group);
                            if (groupData) {
                                let groupDetails = activityOfUser(`${firstName} created the group ${groupData.groupName}.`, 'Group', firstName, 'Created', orgId, _id, profilePic);
                                groupDetails['groupId'] = groupData._id.toString();
                                event.emit('activity', groupDetails);
                            }
                            // Notification
                            if (reuse.result.type === 'user') {
                                // To Admin
                                const message = ` ${firstName + " " + lastName} Created group ${key.groupName}.`;
                                await NotificationService.adminNotification(message, adminId, _id, { collection: 'groups', id: groupData._id.toString() });
                                if (adminId != creatorId && _id != creatorId) {
                                    await NotificationService.userNotification(message, _id, creatorId, { collection: 'groups', id: groupData._id.toString() });
                                }

                            }
                            // To Users
                            if (exist?.length) {
                                for (const user of exist) {
                                    const message = `${firstName + " " + lastName} Added you in group ${key.groupName}.`;
                                    await NotificationService.userNotification(message, _id, user.userId, {
                                        collection: 'groups',
                                        id: groupData._id.toString(),
                                    });
                                }
                            }

                            notExist.length
                                ? res.status(206).send(Response.projectPartialSuccessResp(GroupMessageNew['GROUP_CREATE_SUCCESS'][language ?? 'en'], { nonExistUser: notExist, groupData }))
                                : res.status(200).send(Response.projectSuccessResp(GroupMessageNew['GROUP_CREATE_SUCCESS'][language ?? 'en'], { groupData }));
                        }
                    }
                }
            } catch (err) {
                Logger.error(err);
                return res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_CREATE_FAIL'][language ?? 'en'], err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async fetchGroup(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, _id, firstName, profilePic, adminId, userName } = reuse?.result?.userData?.userData;
        try {
            const Id = reuse?.result?.userData?.userData?._id; //TODO - Think for user flow
            let { groupId } = req.query;
            const db = await checkCollection(reuse?.collectionName.user);
            if (!db) return res.status(400).send(Response.projectFailResp(`${reuse?.collectionName.user} ${GroupMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
            const sortBy = {};
            sortBy[reuse.orderby || 'groupName'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
            let data;

            if (groupId) {
                data = await groupSchema.findOne({ _id: mongoose.Types.ObjectId(groupId) });
                await this.user_details(data, db, reuse?.collectionName.user);
                let groupDetails = activityOfUser(`${firstName} viewed the group details.`, 'Group', firstName, 'Created', orgId, _id, profilePic);
                groupDetails['groupId'] = groupId;
                event.emit('activity', groupDetails);
                Logger.info(`success ${data}`);
                data.groupCount = data?.length;
                if (data) {
                    let groupDetails = activityOfUser(`${firstName} viewed the group details.`, 'Group', firstName, 'Created', orgId, _id, profilePic);
                    groupDetails['groupId'] = groupId;
                    event.emit('activity', groupDetails);
                    res.status(200).send(Response.projectSuccessResp(GroupMessageNew['GROUP_FETCH_SUCCESS'][language ?? 'en'], data));
                } else {
                    res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_ID_NOT_EXIST'][language ?? 'en']));
                }
            } else {
                let total_count = await groupSchema.countDocuments({ orgId: orgId });
                data = await groupSchema.find({ orgId: orgId }).sort(sortBy).skip(reuse?.skip).limit(reuse?.limit);
                let user, admin;
                data.map(async (ele) => {
                    user = await adminModel.findOne({ _id: ele.groupCreatedBy.userId })
                    if (user) {
                        await groupSchema.findOneAndUpdate({ _id: ele._id }, { $set: { "groupCreatedBy.isAdmin": user.isAdmin } }, { returnDocument: 'after' })
                    } else {
                        admin = await db.collection(reuse?.collectionName.user).findOne({ _id: ObjectId(ele.groupCreatedBy.userId) });
                        await groupSchema.findOneAndUpdate({ _id: ele._id }, { $set: { "groupCreatedBy.isAdmin": admin.isAdmin } }, { returnDocument: 'after' })

                    }
                })
                data.map(async (assign) => {
                    assign.assignedMembers.map(async (ele) => {
                        user = await adminModel.findOne({ _id: ele.userId })
                        if (user) {
                            await groupSchema.findOneAndUpdate({ _id: assign._id }, { $set: { "assignedMembers.$[].isAdmin": user.isAdmin } }, { returnDocument: 'after' })
                        } else {
                            admin = await db.collection(reuse?.collectionName.user).findOne({ _id: ObjectId(ele.userId) });
                            await groupSchema.findOneAndUpdate({ _id: assign._id }, { $set: { "assignedMembers.$[].isAdmin": admin.isAdmin } }, { returnDocument: 'after' })

                        }
                    })

                })
                await this.user_details(data, db, reuse?.collectionName.user);
                Logger.info(`success ${data}`);
                data.groupCount = data.length;
                let result = {
                    groupCount: total_count,
                    groupDetails: data,
                };

                if (data) {
                    let groupDetails = activityOfUser(`${firstName} viewed the all groups details.`, 'Group', firstName, 'Created', orgId, _id, profilePic);
                    event.emit('activity', groupDetails);
                    res.status(200).send(Response.projectSuccessResp(GroupMessageNew['GROUP_FETCH_SUCCESS'][language ?? 'en'], result));
                } else {
                    res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_FETCH_FAIL'][language ?? 'en']));
                }
            }
        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_FETCH_FAIL'][language ?? 'en'], err));
        }
    }

    async updateGroup(req, res) {
        const reuse = new Reuse(req);
        Logger.info(`result: ${reuse.result}`);
        const { language, _id: Id, adminId, firstName, lastName, profilePic, orgId, userName, creatorId, permission, isAdmin } = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const updateData = req.body;
                const { groupId } = req?.query;
                const assignedMembers = updateData.assignedMembers;
                const groupLogo = updateData.groupLogo
                const { value, error } = GroupValidation.updateGroup(updateData);
                Logger.error(error);
                if (error) return res.status(400).send(Response.validationFailResp(GroupMessageNew['VALIDATION_FAIL'][language ?? 'en'], error));
                if (
                    !(
                        groupLogo?.includes('.jpeg') ||
                        groupLogo?.includes('.png') ||
                        groupLogo?.includes('.jpg') ||
                        groupLogo?.includes('.svg+xml') ||
                        groupLogo?.includes('.svg') ||
                        groupLogo?.includes('https') ||
                        groupLogo?.includes('http')
                    ) &&
                    groupLogo
                )
                    return res.status(400).send(Response.validationFailResp('Invalid Input,Provide valid image extension or url for group logo'));

                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`${reuse.collectionName.user} ${GroupMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));

                // Check if data exist, then update
                const isDataExist = await groupSchema.findOne({ _id: groupId });
                if (isDataExist === null) {
                    return res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_ID_NOT_EXIST'][language ?? 'en']));
                }
                if (updateData?.groupName) {
                    let isGroupExist = await groupSchema.findOne({ orgId: orgId, _id: { $ne: groupId }, groupName: new RegExp(`^${updateData?.groupName}$`, 'i') });
                    if (isGroupExist) return res.status(400).send(Response.projectAlreadyExistResp(GroupMessageNew['GROUP_ALREADY_EXIST'][language ?? 'en']));
                }

                if (value.assignedMembers) {
                    for (const ele of value.assignedMembers) {
                        const userData = await db
                            .collection(reuse.collectionName.user)
                            .aggregate([{ $match: { _id: mongoose.Types.ObjectId(ele.userId), softDeleted: false } }])
                            .toArray();
                        ele.isAdmin = userData[0].isAdmin;
                        if (!userData.length) return res.send(Response.projectFailResp(UserMessageNew['USER_NOT_FOUND'][language ?? 'en'], `userId ${ele.userId} not found`));
                    }
                }
                value.groupUpdatedBy = {
                    userId: Id,
                    userName: userName,
                    isAdmin: isAdmin,
                    userProfilePic: profilePic,
                };

                value.updatedAt = new Date();
                let updated;
                if (reuse.result.type === 'user' && permission != 'admin') {
                    updated = await groupSchema.findOneAndUpdate({ _id: groupId, 'groupCreatedBy.userId': Id }, { $set: value }, { returnDocument: 'after' });
                    if (updated === null) return res.send(Response.projectFailResp(`You are not allowed to update this record`));
                } else {
                    //query to update the record based on given id and data
                    updated = await updateOneByAdmin(groupId, groupSchema, value);
                }
                Logger.info(`success ${updated}`);
                // Notification
                if (reuse.result.type === 'user') {
                    // To Admin`
                    const message = ` ${firstName + " " + lastName} Updated group ${updated.groupName}`;
                    await NotificationService.adminNotification(message, adminId, Id, { collection: 'groups', id: updated._id.toString() });
                    if (adminId != creatorId && Id != creatorId) {
                        await NotificationService.userNotification(message, Id, creatorId, { collection: 'groups', id: updated._id.toString() });
                    }
                }
                // To Users
                if (isDataExist?.assignedMembers?.length) {
                    for (const user of isDataExist?.assignedMembers) {
                        const message = ` ${firstName + " " + lastName} Updated group ${updated.groupName}`;
                        await NotificationService.userNotification(message, Id, user.id, { collection: 'groups', id: updated._id.toString() });
                    }
                }
                // To new added users
                if (assignedMembers?.length) {
                    for (const element of assignedMembers) {
                        if (isDataExist?.assignedMembers.includes(element.userId) === false) {
                            const message = ` ${firstName + " " + lastName} Added you in group ${updated.groupName}`;
                            await NotificationService.userNotification(message, Id, element.userId, { collection: 'groups', id: updated._id.toString() });
                        }
                    }
                }
                if (updated) {
                    //activity logs
                    let groupDetails = activityOfUser(`${firstName} updated the group ${updated.groupName}.`, 'Group', firstName, 'Updated', orgId, Id, profilePic);
                    groupDetails['groupId'] = groupId;
                    event.emit('activity', groupDetails);
                    res.status(200).send(Response.projectSuccessResp(GroupMessageNew['GROUP_UPDATE_SUCCESS'][language ?? 'en'], updated));
                } else {
                    res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_ID_NOT_EXIST'][language ?? 'en']));
                }
            } catch (err) {
                Logger.error(err);
                return res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_UPDATE_FAIL'][language ?? 'en']));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async deleteGroup(req, res) {
        const reuse = new Reuse(req);
        const { language, _id: Id, firstName, lastName, profilePic, orgId, adminId, creatorId } = reuse?.result?.userData?.userData;
        try {
            const { groupId } = req?.query;
            // Check if data exist, then delete
            const db = await checkCollection(reuse?.collectionName.user);
            if (!db) return res.status(400).send(Response.projectFailResp(`${reuse?.collectionName.user} ${GroupMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));

            let deleted;
            if (groupId) {
                const isDataExist = await groupSchema.findOne({ _id: groupId });
                if (isDataExist === null) {
                    return res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_ID_NOT_EXIST'][language ?? 'en']));
                }
                if (reuse.result.type === 'user') {
                    deleted = await deleteOneByUser(groupId, Id, groupSchema);
                    if (deleted.deletedCount === 0) return res.send(Response.projectFailResp(`You are not allowed to delete this record`));
                } else {
                    //query to delete the record based on given id and data
                    deleted = await deleteOneByAdmin(groupId, groupSchema);
                }
                if (isDataExist) {
                    let groupDetails = activityOfUser(`${firstName} deleted the ${isDataExist?.groupName} group .`, 'Group', firstName, 'Deleted', orgId, Id, profilePic);
                    groupDetails['groupId'] = groupId;
                    event.emit('activity', groupDetails);
                }
                // Notification
                if (reuse.result.type === 'user') {
                    // To Admin
                    const message = `${firstName + " " + lastName} Deleted group ${isDataExist?.groupName}`;
                    await NotificationService.adminNotification(message, adminId, Id, { collection: 'groups', id: null });
                    if (adminId != creatorId && Id != creatorId) {
                        await NotificationService.userNotification(message, Id, creatorId, { collection: 'groups', id: null });
                    }
                }
                return res.send(Response.projectSuccessResp(GroupMessageNew['GROUP_DELETE_SUCCESS'][language ?? 'en'], deleted))
            }
            else {
                if (reuse.result.type === 'user')
                    deleted = await deleteManyByUser(key, Id, groupSchema);
                else
                    deleted = await deleteManyByAdmin({ orgId: orgId }, groupSchema);

                if (deleted.deletedCount > 0) {
                    let groupActivity = activityOfUser(`${firstName} deleted all groups`, 'Group', firstName, 'Deleted', orgId, Id, profilePic);
                    event.emit('activity', groupActivity);
                    // Notification
                    if (reuse.result.type === 'user') {
                        // To Admin
                        const message = `${firstName + " " + lastName} Deleted all groups`;
                        await NotificationService.adminNotification(message, adminId, Id, { collection: 'groups', id: null });
                        if (adminId != creatorId && Id != creatorId) {
                            await NotificationService.userNotification(message, Id, creatorId, { collection: 'groups', id: null });
                        }
                    }
                    return res.send(Response.projectSuccessResp(GroupMessageNew['GROUP_DELETE_SUCCESS'][language ?? 'en'], deleted))
                }
                else return res.send(Response.projectFailResp(GroupMessageNew['GROUP_NOT_PRESENT'][language ?? 'en']))

            }
        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp(GroupMessageNew['GROUP_DELETE_FAIL'][language ?? 'en']));
        }
    }
    async multideleteGroups(req, res) {
        const reuse = new Reuse(req);
        const { language, planName } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let response;
                for (const ele of req?.body?.groupsIds) {
                    let findgroup = await groupSchema.findOne({ _id: ele.id });
                    let groupName = findgroup.groupName;
                    let allMembers = findgroup.assignedMembers;
                    const findDefaultGroup = await permissionModel.find({ is_default: true })
                    await permissionModel.findOneAndUpdate({ groupName: findDefaultGroup[0].groupName }, { $push: { userAssigned: allMembers } })
                    // const updateUser = await userDb.collection(reuse.collectionName.user).findOneAndUpdate({ _id: key._id }, { $set: { permission: findpermissions[0].permissionName } }, { returnDocument: 'after' });
                }
                const key = { _id: { $in: req?.body?.groupsIds.map(group => group.id) }, is_default: { $ne: true } };
                response = await groupSchema.deleteMany(key);
                response.deletedCount > 0 ?
                    res.send(Response.projectSuccessResp("Groups deleted successfully")) :
                    res.send(Response.projectFailResp("Failed to delete Groups,please check provided Ids"));
            } catch (err) {
                return res.send(Response.projectFailResp("Error while deleting Groups", err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }


    async searchGroup(req, res) {
        const reuse = new Reuse(req);
        const { language, profilePic, firstName, _id, adminId, orgId } = reuse.result.userData?.userData;
        try {
            let { keyword } = req.query;
            const db = await checkCollection(reuse.collectionName.user);
            if (!db) return res.send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));

            const query = {};
            if (keyword) {
                Logger.info(keyword);
                query['$or'] = [
                    { groupName: new RegExp(keyword, 'i') },
                    { groupDescription: new RegExp(keyword, 'i') },
                    { groupLogo: new RegExp(keyword, 'i') },
                    { 'assignedMembers.userId': new RegExp(keyword, 'i') },
                ];
            }
            query['$and'] = [{ adminId: adminId }];
            const sortBy = {};
            sortBy[reuse.orderby || 'groupName'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
            let data = await groupSchema
                .find({ $and: [query, { adminId: adminId }] })
                .sort(sortBy)
                .skip(reuse.skip)
                .limit(reuse.limit);
            const groupCount = await groupSchema.countDocuments({ $and: [query, { adminId: adminId }] });
            //to get the user details who are present in the group
            await this.user_details(data, db, reuse.collectionName.user);
            if (!data.length) return res.send(Response.projectSuccessResp(GroupMessageNew['GROUP_FETCH_SUCCESS'][language ?? 'en'], { group: data }));
            const resData = {
                skip: reuse.skip,
                groupCount: groupCount,
                groupData: data,
            };
            Logger.info(data);
            if (data.length > 0) {
                let groupDetails = activityOfUser(`${firstName} searched groups by ${reuse?.orderby} keyword.`, 'Group', firstName, 'Searched', orgId, _id, profilePic);
                event.emit('activity', groupDetails);
                return res.send(Response.projectSuccessResp(GroupMessageNew['GROUP_FETCH_SUCCESS'][language ?? 'en'], resData));
            }
        } catch (error) {
            Logger.error(`error ${error}`);
            return res.send(Response.projectFailResp(GroupMessageNew['GROUP_FETCH_FAIL'][language ?? 'en'], error));
        }
    }

    async groupFilter(req, res, next) {
        const reuse = new Reuse(req);
        const { language, profilePic, firstName, _id, orgId } = reuse.result.userData?.userData;
        try {
            const data = req?.body;
            const db = await checkCollection(reuse?.collectionName.user);
            if (!db) return res.status(400).send(Response.projectFailResp(`${reuse?.collectionName.user} ${GroupMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
            const { value, error } = GroupValidation.groupFilterValidation(data);
            if (error) return res.send(Response.projectFailResp("validation failed", error.message));

            let query = [];
            let myFilters = {};
            const sortBy = {};
            sortBy[reuse.orderby || 'groupName'] = reuse.sort?.toString() === 'desc' ? -1 : 1;
            query.push({ orgId: orgId });
            if (req?.body.groupName != " " && req?.body.groupName!==null) {
                query.push({ groupName: new RegExp(req?.body.groupName, 'i') });
            }
            if (req?.body?.userId) {
                Logger.info(req?.body.userId);
                req?.body.userId.forEach(ele => {
                    if (ele.id != ' ' || null) {
                        query.push({ 'assignedMembers.userId': ele.id });
                    }
                });
            }
            if (req?.body?.createdAt?.startDate || req?.body?.createdAt?.endDate) {
                const filter = {};
              
                if (req.body.createdAt.startDate) {
                  filter.$gte = moment(req.body.createdAt.startDate).startOf("day").toDate();
                }
              
                if (req.body.createdAt.endDate) {
                  filter.$lt = moment(req.body.createdAt.endDate).endOf("day").toDate();
                }
              
                query.push({ createdAt: filter });
              }
              if (req?.body?.updatedAt?.startDate || req?.body?.updatedAt?.endDate) {
                const filter = {};
              
                if (req.body.updatedAt.startDate) {
                  filter.$gte = moment(req.body.updatedAt.startDate).startOf('day').toDate();
                }
              
                if (req.body.updatedAt.endDate) {
                  filter.$lt = moment(req.body.updatedAt.endDate).endOf('day').toDate();
                }
              
                query.push({ updatedAt: filter });
              }
            if (query.length) myFilters['$and'] = query;
            let resp = await groupSchema
                .aggregate([
                    {
                        $match: myFilters,
                    },
                ]).sort(sortBy).skip(reuse.skip)
                .limit(reuse.limit);
            await this.user_details(resp, db, reuse.collectionName.user)
            let groupDetails = activityOfUser(`${firstName} filtered groups .`, 'Group', firstName, 'Filtered', orgId, _id, profilePic);
            event.emit('activity', groupDetails);
            res.send(Response.projectSuccessResp(GroupMessageNew['GROUP_FETCH_SUCCESS'][language ?? 'en'], resp));

        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp(GroupMessageNew['GROUP_FETCH_FAIL'][language ?? 'en'], err));
        }
    }

    //Helper Function
    async user_details(response, db, userCollection) {
        let groupArray = [];
        if (Array.isArray(response)) groupArray = response;
        else groupArray[0] = response;
        try {
            const userObj = {
                _id: 1,
                firstName: 1,
                lastName: 1,
                email: 1,
                role: 1,
                permission: 1,
                profilePic: 1,
                isAdmin: 1,
                verified: 1,
                orgId: 1,
                createdAt: 1,
                isSuspended: 1
            };
            groupArray.groupCount = groupArray?.length;
            for (const group of groupArray) {
                let users = [];
                if (group.assignedMembers?.length) {
                    for (const user of group.assignedMembers) {
                        const userDetails = await db
                            .collection(userCollection)
                            .aggregate([
                                {
                                    $match: { _id: mongoose.Types.ObjectId(user.userId) },
                                },
                                {
                                    $project: userObj,
                                },
                            ])
                            .toArray();
                        if (userDetails.length) users.push(userDetails[0]);
                    }
                    group.assignedMembers = users;
                }
            }
        } catch (err) {
            Logger.error(`err ${err}`);
        }
    }
}

export default new GroupService();
