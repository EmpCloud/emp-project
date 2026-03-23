import Responses from '../../response/response.js';
import SubTaskStatusValidation from './subTaskStatus.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import { commonMessage, subTaskStatusMessage } from '../language/language.translator.js';
import Reuse from '../../utils/reuse.js';
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
import { activityOfUser } from '../../utils/activity.utils.js';
import NotificationService from '../notifications/notifications.service.js';
import event from '../event/event.emitter.js';
class SubTaskStatusService {
    /* ----------------SubTask Status APIs -------------------*/
    //Create subtask Status
    async createSubTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { _id: userId, adminId, language, planData: planTask, isAdmin, firstName, orgId, profilePic } = result?.userData?.userData;
        try {
            const status = req.body;
            const { value, error } = SubTaskStatusValidation.createSubTaskStatus(status);
            Logger.info('Value: ', value);
            Logger.error('Error: ', error);
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const subTaskCollectionName = reusable.collectionName.subTaskStatus;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const totalCount = await totalCustomCountForAdmin(db, subTaskCollectionName, adminId);
            if(planTask.customizeSubTaskStatus==0){
                return res.status(400).send(Responses.taskFailResp("Can't create custom subTaskStatus in free plan subscription"))
            }
            if (totalCount == planTask.customizeSubTaskStatus) {
                return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK_STATUS_PLAN_LIMIT'][language ?? 'en']));
            }
            const queryCondition = { subTaskStatus: new RegExp(`^${value?.subTaskStatus}$`, 'i') };
            const isSubTaskStatusPresent = await isItemExists(db, subTaskCollectionName, queryCondition);
            if (isSubTaskStatusPresent) {
                return res.status(429).send(Responses.taskDuplicateErrorResp(subTaskStatusMessage['SUBTASK-STATUS_PRESENT'][language ?? 'en']));
            }
            value.adminId = adminId;
            value.isDefault = false;
            value.createdBy = {
                userId: userId,
            };
            const resp = await insertAndReturnData(db, subTaskCollectionName, value);
            let taskActivity = activityOfUser(` ${firstName} created ${status.subTaskStatus} subtask status`, 'SubTaskStatus', firstName, 'Created', orgId, userId, profilePic);
            taskActivity['subTaskStatusId'] = resp._id.toString();
            event.emit('activity', taskActivity);
            // Notification to Admin
            const message = `Created subtask status ${status.subTaskStatus}`;
            await NotificationService.adminNotification(message, adminId, userId,{ collection: 'subTaskStatus', id: resp._id.toString() });
            Logger.info(`Response ${resp}`);
            return res.status(200).send(Responses.taskSuccessResp(subTaskStatusMessage['SUBTASK-STATUS_CREATED'][language ?? 'en'], resp));
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_CREATED'][language ?? 'en']));
        }
    }

    // Get subtask Status by Id
    async getSubTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { _id: adminId, language, firstName, profilePic, orgId } = result?.userData?.userData;
        try {
            const id = req?.query?.id;
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const orderby = reusable.orderby || 'createdAt';
            const sort = reusable.sort;
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            const subTaskCollectionName = reusable.collectionName.subTaskStatus;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const queryCondition = { $or: [{ adminId: adminId }, { isDefault: true }] };
            let status = id ? await findByIdQuery(db, subTaskCollectionName, id) : await findAllItems(db, subTaskCollectionName, queryCondition, sortBy, skipValue, limitValue);
            let taskActivity = activityOfUser(` ${firstName} viewed subtask status`, 'SubTaskStatus', firstName, 'Viewed', orgId, adminId, profilePic);
            taskActivity['subTaskStatusId'] = id ? id : 'All';
            event.emit('activity', taskActivity);
            Logger.info(`SubTask status: ${status}`);
            status
                ? res.status(200).send(Responses.taskSuccessResp(subTaskStatusMessage['SUBTASK-STATUS_FETCHED'][language ?? 'en'], { TotalCount: status.length, SubTaskStatus: status }))
                : res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_FETCHED'][language ?? 'en']));
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_FETCHED_INVALID-ID'][language ?? 'en']));
        }
    }

    //Update subtask Status
    async updateSubTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { firstName, language, _id: userId, adminId, profilePic, orgId } = result.userData?.userData;
        try {
            const status = req.body;
            const { value, error } = SubTaskStatusValidation.updtateSubTaskStatus(status);
            Logger.info(`value: ${value}`);
            Logger.info(`error: ${error}`);
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            value.updatedAt = new Date();
            const id = req.params?.id;
            const subTaskCollectionName = reusable.collectionName.subTaskStatus;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const isDefault = await checkIsDefault(db, subTaskCollectionName, id);
            if (isDefault) {
                return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK_STATUS_DEFAULT'][language ?? 'en']));
            }
            const queryCondition = { subTaskStatus: new RegExp(`^${value?.subTaskStatus}$`, 'i') };
            let isPresent = await isItemExists(db, subTaskCollectionName, queryCondition);
            if (isPresent) {
                return res.status(429).send(Responses.taskDuplicateErrorResp(subTaskStatusMessage['SUBTASK-STATUS_PRESENT'][language ?? 'en']));
            } else {
                const status = await findByIdQuery(db, subTaskCollectionName, id);
                let data;
                if (result.type === 'user') {
                    data = await updateByUserQuery(db, subTaskCollectionName, id, userId, value);
                    if (!data.value) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
                } else {
                    data = await findByIdAndUpdateQuery(db, subTaskCollectionName, id, value);
                }
                Logger.info(`data: ${data}`);
                if (data.value) {
                    let taskActivity = activityOfUser(` ${firstName} updated subtask status as ${data.subTaskStatus}`, 'SubTaskStatus', firstName, 'Updated', orgId, userId, profilePic);
                    taskActivity['subTaskStatusId'] = id;
                    event.emit('activity', taskActivity);
                    // Notification to Admin
                    const message = `Updated subTask Status from ${status[0].subTaskStatus} to ${data.value.subTaskStatus}`;
                    await NotificationService.adminNotification(message, adminId, userId, { collection: 'subTaskStatus', id: data.value._id.toString() });
                    return res.status(200).send(Responses.taskSuccessResp(subTaskStatusMessage['SUBTASK-STATUS_UPDATED'][language ?? 'en'], data.value));
                }
                return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_UPDATED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_UPDATED'][language ?? 'en']));
        }
    }

    //Delete subtask by Id
    async deleteSubTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info(`result: ${result}`);
        const { _id: userId, adminId, firstName, language, orgId, profilePic } = result?.userData?.userData;
        try {
            const statusId = req.query?.id;
            const subTaskCollectionName = reusable.collectionName.subTaskStatus;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const isDefault = await checkIsDefault(db, subTaskCollectionName, statusId);
            if (isDefault) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(subTaskStatusMessage['SUBTASK_STATUS_DEFAULT'][language ?? 'en']));
            }
            let response;
            const data = await findByIdQuery(db, subTaskCollectionName, statusId);
            if (result.type === 'user') {
                response = statusId ? await deleteOneByUserQuery(db, subTaskCollectionName, statusId, userId) : await deleteAllByUserQuery(db, subTaskCollectionName, userId);
            } else {
                response = statusId ? await deleteOneByAdminQuery(db, subTaskCollectionName, statusId) : await deleteAllByAdminQuery(db, subTaskCollectionName, adminId);
            }
            Logger.info(`Task type: ${response}`);
            if (response.deletedCount) {
                let taskActivity = activityOfUser(` ${firstName} deleted subtask status `, 'SubTaskStatus', firstName, 'Deleted', orgId, userId, profilePic);
                taskActivity['subTaskStatusId'] = statusId ? statusId : 'All';
                event.emit('activity', taskActivity);
                // Notification to Admin
                const message = response.deletedCount == 1 && statusId ? `Deleted the subTask status ${data[0].subTaskStatus}.` : `Deleted all non-default subTask status.`;
                await NotificationService.adminNotification(message, adminId, userId,{ collection: 'subTaskStatus', id: null });
                res.status(200).send(Responses.taskSuccessResp(subTaskStatusMessage['SUBTASK-STATUS_DELETED'][language ?? 'en'], response));
            } else {
                res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_DELETED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskStatusMessage['SUBTASK-STATUS_NOT_DELETED'][language ?? 'en']));
        }
    }
}

export default new SubTaskStatusService();
