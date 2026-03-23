import Responses from '../../response/response.js';
import SubTaskTypeValidation from './subTasktype.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import { commonMessage, subTaskTypeMessage } from '../language/language.translator.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import {
    checkCollection,
    checkIsDefault,
    deleteAllByAdminQuery,
    deleteAllByUserQuery,
    deleteOneByAdminQuery,
    deleteOneByUserQuery,
    findAllItems,
    findByIdAndUpdateQuery,
    findByIdQuery,
    insertAndReturnData,
    isItemExists,
    totalCustomCountForAdmin,
    updateByUserQuery,
} from '../../utils/common.utils.js';
import Reuse from '../../utils/reuse.js';
import NotificationService from '../notifications/notifications.service.js';
import event from '../event/event.emitter.js';
class SubTaskTypeService {
    /* ----------------Task Type APIs -------------------*/
    //Create task type for subTask
    async createSubTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { _id: userId, adminId, language, planData: planTask, firstName, orgId, profilePic,creatorId } = result?.userData?.userData;
        try {
            const type = req.body;
            const { value, error } = SubTaskTypeValidation.createSubTaskType(type);
            Logger.info('Value: ', value);
            Logger.error('Error: ', error);
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const subTaskCollectionName = reusable.collectionName.subTaskType;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const totalCount = await totalCustomCountForAdmin(db, subTaskCollectionName, adminId);
            if(planTask.customizeSubTaskType==0){
                return res.status(400).send(Responses.taskFailResp("Can't create custom subTaskType in free plan subscription"))
            }
            if (totalCount == planTask.customizeSubTaskType) {
                return res.status(429).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK_TYPE_PLAN_LIMIT'][language ?? 'en']));
            }
            const queryCondition = { subTaskType: new RegExp(`^${value?.subTaskType}$`, 'i') };
            const isSubTaskTypePresent = await isItemExists(db, subTaskCollectionName, queryCondition);
            if (isSubTaskTypePresent) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(subTaskTypeMessage['SUBTASK-TYPE_PRESENT'][language ?? 'en']));
            }
            value.adminId = adminId;
            value.isDefault = false;
            value.createdBy = {
                userId: userId,
            };
            const resp = await insertAndReturnData(db, subTaskCollectionName, value);
            Logger.info(`Response ${resp}`);
            //activity
            let taskActivity = activityOfUser(` ${firstName} created ${type.subTaskType} subtask type`, 'SubTaskType', firstName, 'Created', orgId, userId, profilePic);
            taskActivity['subTaskTypeId'] = resp._id.toString();
            event.emit('activity', taskActivity);
            // Notification to Admin
            const message = `Created subtask type ${type.subTaskType}`;
            await NotificationService.adminNotification(message, adminId, userId,{ collection: 'subTaskType', id: resp._id.toString() });
            if (result.type === 'user') {
            if (adminId != creatorId && userId != creatorId) {
                await NotificationService.userNotification(message, creatorId, userId, { collection: 'subTaskType', id: resp._id.toString()});
            }
        }
            return res.status(200).send(Responses.taskSuccessResp(subTaskTypeMessage['SUBTASK-TYPE_CREATED'][language ?? 'en'], resp));
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_CREATED'][language ?? 'en']));
        }
    }

    // Get task type by Id
    async getSubTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { language, firstName, orgId, profilePic, _id: userId, adminId } = result.userData?.userData;
        try {
            const id = req?.query?.id;
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const orderby = reusable.orderby || 'createdAt';
            const sort = reusable.sort;
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            const subTaskCollectionName = reusable.collectionName.subTaskType;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const queryCondition = { $or: [{ adminId: adminId }, { isDefault: true }] };
            let type = id ? await findByIdQuery(db, subTaskCollectionName, id) : await findAllItems(db, subTaskCollectionName, queryCondition, sortBy, skipValue, limitValue);
            let taskActivity = activityOfUser(` ${firstName} viewed subtask type`, 'SubTaskType', firstName, 'Viewed', orgId, userId, profilePic);
            taskActivity['subTaskTypeId'] = id ? id : 'All';
            event.emit('activity', taskActivity);
            Logger.info(`Task types: ${type}`);
            type.length
                ? res.status(200).send(Responses.taskSuccessResp(subTaskTypeMessage['SUBTASK-TYPE_FETCHED'][language ?? 'en'], { data: type, count: type.length }))
                : res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_FETCHED'][language ?? 'en']));
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_FETCHED_INVALID-ID'][language ?? 'en']));
        }
    }

    //Update task type
    async updateSubTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { firstName, _id: userId, adminId, language, orgId, profilePic,creatorId } = result.userData?.userData;
        try {
            const type = req.body;
            const { value, error } = SubTaskTypeValidation.updtateSubTaskType(type);
            Logger.info(`value: ${value}`);
            Logger.info(`error: ${error}`);
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const id = req.params?.id;
            const subTaskCollectionName = reusable.collectionName.subTaskType;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            value.updatedAt = new Date();
            const isDefault = await checkIsDefault(db, subTaskCollectionName, id);
            if (isDefault) {
                return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK_TYPE_DEFAULT'][language ?? 'en']));
            }
            const getType = await findByIdQuery(db, subTaskCollectionName, id);
            const queryCondition = { subTaskType: new RegExp(`^${value?.subTaskType}$`, 'i') };
            const isPresent = await isItemExists(db, subTaskCollectionName, queryCondition);
            if (isPresent) {
                return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_PRESENT'][language ?? 'en']));
            } else {
                let data;
                if (result.type === 'user') {
                    data = await updateByUserQuery(db, subTaskCollectionName, id, userId, value);
                    if (!data.value) return res.send(Responses.taskSuccessResp(`You are not allowed to update this record`));
                } else {
                    data = await findByIdAndUpdateQuery(db, subTaskCollectionName, id, value);
                }
                Logger.info(`updated data ${data}`);
                if (data.value) {
                    let taskActivity = activityOfUser(` ${firstName} updated subtask type`, 'SubTaskType', firstName, 'Updated', orgId, userId, profilePic);
                    taskActivity['subTaskTypeId'] = id;
                    event.emit('activity', taskActivity);
                    // Notification to Admin
                    const message = `Updated subtask type ${getType[0].subTaskType} to ${data.value?.subTaskType}`;
                    await NotificationService.adminNotification(message, adminId, userId, { collection: 'subTaskType', id: data.value._id.toString() });
                    if (adminId != creatorId && userId != creatorId) {
                        await NotificationService.userNotification(message, creatorId, userId, { collection: 'subTaskType', id: data.value._id.toString()});
                    }
                    return res.status(200).send(Responses.taskSuccessResp(subTaskTypeMessage['SUBTASK-TYPE_UPDATED'][language ?? 'en'], data.value));
                }
                return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_UPDATED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_UPDATED'][language ?? 'en']));
        }
    }

    //Delete task by Id
    async deleteSubTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { firstName, language, _id: userId, adminId, orgId, profilePic,creatorId } = result?.userData?.userData;
        try {
            const id = req?.query?.id;
            const subTaskCollectionName = reusable.collectionName.subTaskType;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const isDefault = await checkIsDefault(db, subTaskCollectionName, id);
            if (isDefault) {
                return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK_TYPE_DEFAULT'][language ?? 'en']));
            }
            let type;
            const getType = await findByIdQuery(db, subTaskCollectionName, id);
            if (result.type === 'user') {
                type = id ? await deleteOneByUserQuery(db, subTaskCollectionName, id, userId) : await deleteAllByUserQuery(db, subTaskCollectionName, userId);
            } else {
                type = id ? await deleteOneByAdminQuery(db, subTaskCollectionName, id) : await deleteAllByAdminQuery(db, subTaskCollectionName, adminId);
            }
            Logger.info(`type ${type}`);
            if (type.deletedCount) {
                let taskActivity = activityOfUser(` ${firstName} deleted subtask type.`, 'SubTaskType', firstName, 'Deleted', orgId, userId, profilePic);
                taskActivity['subTaskTypeId'] = id ? id : 'All';
                event.emit('activity', taskActivity);
                // Notification to Admin
                const message = type.deletedCount == 1 && id ? `Deleted the subTask type ${getType[0].subTaskType}.` : `Deleted all non-default subTask types.`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'subTaskStatus', id: null });
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, creatorId, userId, { collection: 'subTaskStatus', id: null  });
                }
                return res.status(200).send(Responses.taskSuccessResp(subTaskTypeMessage['SUBTASK-TYPE_DELETED'][language ?? 'en'], type));
            } else {
                return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_DELETED_INVALID-ID'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskTypeMessage['SUBTASK-TYPE_NOT_DELETED_INVALID-ID'][language ?? 'en']));
        }
    }
}

export default new SubTaskTypeService();
