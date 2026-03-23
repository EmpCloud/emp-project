import Responses from '../../response/response.js';
import TaskStatusValidation from './taskStatus.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import statusSchema from './taskStatus.model.js'
import { commonMessage, taskStatusMessage } from '../language/language.translator.js';
import {
    checkCollection,
    totalCustomCountForAdmin,
    findByIdQuery,
    insertAndReturnData,
    findByIdAndUpdateQuery,
    checkIsDefault,
    updateByUserQuery,
    deleteOneByUserQuery,
    deleteAllByUserQuery,
    deleteOneByAdminQuery,
    deleteAllByAdminQuery,
    countAllDocumentsQuery,
    searchDocumentsQuery,
    isItemExists,
    findAllItems,
} from '../../utils/common.utils.js';
import Reuse from '../../utils/reuse.js';
import NotificationService from '../notifications/notifications.service.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/event.emitter.js';
class TaskStatusService {
    /* ----------------Task Status APIs -------------------*/
    //Create task Status
    async createTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, planData: planTask, firstName, orgId, profilePic,creatorId } = result?.userData?.userData;
        try {
            const status = req.body;
            const { value, error } = TaskStatusValidation.createTaskStatus(status);
            Logger.info({'Value': value});
            Logger.error({'Error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const totalCount = await statusSchema.countDocuments({ isDefault: false, adminId: adminId });
            if(planTask.customizeTaskStatus==0){
                return res.status(429).send(Responses.taskFailResp("Can't create custom taskStatus in free plan subscription"))
            }
            if (totalCount == planTask?.customizeTaskStatus) {
                return res.status(429).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_PLAN_LIMIT'][language ?? 'en']));
            }
            const queryCondition = {adminId: adminId, taskStatus: new RegExp(`^${value?.taskStatus}$`, 'i') };
            const isTaskStatusPresent = await statusSchema.findOne(queryCondition);
            if (isTaskStatusPresent) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskStatusMessage['TASK_STATUS_PRESENT'][language ?? 'en']));
            }
            value.adminId = adminId;
            value.createdBy = {
                userId: userId,
            };
            const insertedData = await statusSchema.create(value);
            const customStatusCount = await statusSchema.countDocuments({ isDefault: false, adminId: adminId });
            const dataDetails = {
                totalCustomTaskTypes: customStatusCount,
                remainingTaskTypes: planTask?.customizeTaskStatus - customStatusCount,
                data: insertedData,
            };
            Logger.info({'Response': insertedData});
            let taskActivity = activityOfUser(`${firstName} created task status`, 'TaskStatus', firstName, 'Created', orgId, adminId, profilePic);
            taskActivity['taskStatusId'] = insertedData._id.toString();
            event.emit('activity', taskActivity);
            // Notification to Admin
            const message = `Created task status ${status.taskStatus}`;
            await NotificationService.adminNotification(message, adminId, userId,{ collection: 'taskStatus', id: insertedData._id.toString() });
            if (result.type === 'user') {
            if (adminId != creatorId && userId != creatorId) {
                await NotificationService.userNotification(message, userId,creatorId,  {collection: 'taskStatus', id: insertedData._id.toString()});
            }
           }
            return res.status(200).send(Responses.taskSuccessResp(taskStatusMessage['TASK_STATUS_CREATED'][language ?? 'en'], dataDetails));
        } catch (err) {
            Logger.error({'error': err});
            return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_NOT_CREATED'][language ?? 'en']));
        }
    }

    // Get task Status by Id
    async getTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, planName: plan, firstName, orgId, profilePic } = result?.userData?.userData;
        try {
            const taskStatusId = req?.query?.id;
            let skipValue = reusable.skip;
            let limitValue = reusable.limit;
            let orderby = reusable.orderby || 'createdAt';
            let sort = reusable.sort;
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            const keyword=req?.query?.keyword;
            if (req?.query.keyword) {
                let keyword = req?.query.keyword;
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Responses.taskFailResp('Failed to search, please check keyword'));
                }
                Logger.info(keyword);
            }
            let status,statusData;
            if(taskStatusId) status = await statusSchema.find({ _id: taskStatusId,adminId: adminId });
            if(status) statusData = [status];
            if(!taskStatusId) statusData = await statusSchema.find({ adminId: adminId,taskStatus: new RegExp(keyword, 'i')  }).sort(sortBy).skip(skipValue).limit(limitValue)
            const totalCount = await statusSchema.countDocuments({ adminId: adminId });
        
            if (statusData.length) {
                let taskActivity = activityOfUser(`${firstName} viewed task status`, 'TaskStatus', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['taskStatusId'] = taskStatusId ? taskStatusId : 'All';
                event.emit('activity', taskActivity);
            }
            Logger.info({'Task Status': status});
            statusData.length
                ? res.status(200).send(Responses.taskSuccessResp(taskStatusMessage['TASK_STATUS_FETCHED'][language ?? 'en'], { data: statusData, count: totalCount }))
                : res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_NOT_FOUND'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_NOT_FETCHED'][language ?? 'en']));
        }
    }

    //Update task Status
    async updateTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, orgId, profilePic,creatorId } = result?.userData?.userData;
        try {
            const status = req.body;
            const adminOverwrite = result?.userData?.userData?.isOverwrite || false;
            const { value, error } = TaskStatusValidation.updateTaskStatus(status);
            Logger.info({'value': value});
            Logger.info({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            value.updatedAt = new Date();
            const id = req.params?.id;
            
            if (adminOverwrite) {
                const updatedTaskStatus = await statusSchema.findOneAndUpdate({ _id: id,adminId:adminId }, { $set: value })
                Logger.info({'updatedTaskStatus': updatedTaskStatus});
                updatedTaskStatus
                    ? res.status(200).send(Responses.taskSuccessResp(taskStatusMessage['TASK_STATUS_UPDATED'][language ?? 'en'], updatedTaskStatus))
                    : res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_NOT_UPDATED'][language ?? 'en']));
            }
            const isDefault = await statusSchema.findOne({ _id: id,adminId:adminId, isDefault: true })
            if (isDefault) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskStatusMessage['TASK_STATUS_DEFAULT'][language ?? 'en']));
            }
            const taskStatus = await statusSchema.findOne({ _id: id,adminId:adminId})
            const queryCondition = { adminId: adminId, taskStatus: new RegExp(`^${value?.taskStatus}$`, 'i') };
            const isTaskStatusPresent = await statusSchema.findOne(queryCondition);
            if (isTaskStatusPresent) return res.status(400).send(Responses.taskDuplicateErrorResp(taskStatusMessage['TASK_STATUS_PRESENT'][language ?? 'en']));
            let updatedTaskStatus;
            if (result.type === 'user'  && permission !== 'admin') {
                updatedTaskStatus = await statusSchema.findOneAndUpdate({ _id: id,adminId:adminId, $or: [{ 'createdBy.userId': userId, isDefault: false }] }, { $set: value }, { returnDocument: 'after' })
                if (!updatedTaskStatus) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            } else {
                updatedTaskStatus = await statusSchema.findOneAndUpdate({ _id: id,adminId:adminId }, { $set: value }, { returnDocument: 'after' });
            }
            Logger.info({'updatedTaskStatus': updatedTaskStatus});
            if (updatedTaskStatus) {
                let taskActivity = activityOfUser(`${firstName} updated task status from ${taskStatus?.taskStatus} to ${updatedTaskStatus?.taskStatus}`, 'TaskStatus', firstName, 'Updated', orgId, userId, profilePic);
                taskActivity['taskStatusId'] = id;
                event.emit('activity', taskActivity);
                //updating status wherever it is assigned
                const db = await checkCollection(reusable.collectionName.task);
                await db.collection(reusable.collectionName.task)
                            .updateMany( { taskStatus: taskStatus?.taskStatus },{$set: { taskStatus:updatedTaskStatus?.taskStatus }});
                await db.collection(reusable.collectionName.subTask)
                            .updateMany( { subTaskStatus: taskStatus?.taskStatus },{$set: { subTaskStatus:updatedTaskStatus?.taskStatus }});
                // Notification to Admin
                const message = `Updated task status from ${taskStatus.taskStatus} to ${updatedTaskStatus.taskStatus}`;
                await NotificationService.adminNotification(message, adminId, userId,{ collection: 'taskStatus', id: updatedTaskStatus._id.toString() });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  {collection: 'taskStatus', id: updatedTaskStatus._id.toString()});
                }
               }
                return res.status(200).send(Responses.taskSuccessResp(taskStatusMessage['TASK_STATUS_UPDATED'][language ?? 'en'], updatedTaskStatus));
            }
            return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_NOT_UPDATED'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_NOT_UPDATED'][language ?? 'en']));
        }
    }

    //Delete task by Id
    async deleteTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, orgId, profilePic, creatorId, permission} = result?.userData?.userData;
        try {
            const taskStatusId = req?.query?.id;

            let status, data ;
            const db = await checkCollection(reusable.collectionName.task);
            if (taskStatusId) {
                const isDefault = await statusSchema.findOne({ _id: taskStatusId, isDefault: true });
                if (isDefault) {
                    return res.status(400).send(Responses.taskDuplicateErrorResp(taskStatusMessage['TASK_STATUS_DEFAULT'][language ?? 'en']));
                }
                data = await statusSchema.findOne({ _id: taskStatusId, adminId: adminId });
                let isAssignedTask, isAssignedSubtask;
                isAssignedTask = await db
                    .collection(reusable.collectionName.task)
                    .find({ taskStatus: data?.taskStatus })
                    .toArray();
                isAssignedSubtask = await db
                    .collection(reusable.collectionName.subTask)
                    .find({ subTaskStatus: data?.taskStatus })
                    .toArray();
                if (isAssignedTask.length > 0 || isAssignedSubtask > 0) {
                    return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_DELETE_FAILED'][language ?? 'en']));
                }
                if (result.type === 'user' && permission != 'admin') {
                    status = await statusSchema.deleteOne({ 'createdBy.userId': userId, _id: taskStatusId, adminId: adminId })
                    if (status.deletedCount === 0) {
                        return res.status(400).send(Responses.taskFailResp("You can't delete status which are created by someone else"));
                    }
                }
                else {
                    status = await statusSchema.deleteOne({ _id: taskStatusId, adminId: adminId })
                }
            }
            else {
                let notExist = [];

                let data = await statusSchema.find({ adminId: adminId });
                await Promise.all( data.map(async ele => {
                    let isAssigneTask = await db
                        .collection(reusable.collectionName.task)
                        .aggregate([{ $match: { taskStatus: ele?.taskStatus } }])
                        .toArray();
                    if (isAssigneTask.length > 0) {
                        notExist.push(ele.taskStatus)
                        return notExist;
                    }
                }))
                await Promise.all( data.map(async ele => {
                    let isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .aggregate([{ $match: { subTaskStatus: ele?.taskStatus } }])
                        .toArray();
                    if (isAssignedSubtask.length > 0) {
                        notExist.push(ele.taskStatus)
                        return notExist;
                    }
                }))
                let filter;
                if (result.type === 'user' && permission != 'admin') {
                    filter = {
                        'createdBy.userId': userId,
                        adminId: adminId,
                        isDefault: false,
                        taskStatus: { $nin: notExist }
                    };
                } else {
                    filter = {
                        adminId: adminId,
                        isDefault: false,
                        taskStatus: { $nin: notExist }
                    };
                }
                status = await statusSchema.deleteMany(filter);
            }
            Logger.info({'Task status': status});
            if (status.deletedCount) {
                let taskActivity = activityOfUser(`${firstName} deleted task status `, 'TaskStatus', firstName, 'Deleted', orgId, userId, profilePic);
                taskActivity['taskStatusId'] = 'All';
                event.emit('activity', taskActivity);
                // Notification to Admin
                const message = status.deletedCount == 1 && taskStatusId ? `Deleted the task status ${data?.taskStatus}.` : `Deleted all non-default task status.`;
                await NotificationService.adminNotification(message, adminId, userId,{ collection: 'taskStatus', id: null });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  {collection: 'taskStatus', id: null});
                }
            }
                return res.status(200).send(Responses.taskSuccessResp(taskStatusMessage['TASK_STATUS_DELETED'][language ?? 'en'], status));
            } else {
                return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_DELETE_FAILED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_DELETE_ERROR'][language ?? 'en']));
        }
    }

    async searchTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { language, _id: userId, adminId, orgId, profilePic, firstName } = result.userData?.userData;
        try {
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const searchQuery = {adminId:adminId};
            const keyword = req?.query?.keyword;
            if (keyword) {
                searchQuery.$or = [{ taskStatus: new RegExp(keyword, 'i') }];
            }
            const sort = reusable.sort;
            let orderby = reusable.orderby || 'taskStatus';
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;

            const taskStatusCount = await statusSchema.countDocuments({ adminId: adminId });
            let resp = await statusSchema.find(searchQuery).sort(sortBy).skip(skipValue).limit(limitValue);
            let data = { taskStatusCount: taskStatusCount, skip: skipValue, resp };
            Logger.info({'Data': data});
            let taskActivity = activityOfUser(`${firstName} searched task status`, 'TaskStatus', firstName, 'Searched', orgId, userId, profilePic);
            event.emit('activity', taskActivity);
            return res.send(Responses.taskSuccessResp(commonMessage['SEARCH_SUCCESS'][language ?? 'en'], data));
        } catch (error) {
            Logger.error({'Error': error});
            return res.send(Responses.taskFailResp(commonMessage['SEARCH FAILED'][language ?? 'en']));
        }
    }


    async deleteMultiTaskStatus(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission } = result?.userData?.userData;
        Logger.info({ 'result': result });
        try {
            const statusIds = req.body?.statusIds;
            let data;
            const db = await checkCollection(reusable.collectionName.task);
            
            if (statusIds && Array.isArray(statusIds)) {
                // Check if all status IDs exist in the database
                const existingStatuses = await statusSchema.find({ _id: { $in: statusIds }, adminId: adminId }).select('_id isDefault taskStatus taskCategory').lean();
                const existingStatusIds = existingStatuses.map(status => status._id.toString());
                const invalidIds = statusIds.filter(id => !existingStatusIds.includes(id));
    
                if (invalidIds.length > 0) {
                    return res.status(400).send(Responses.taskFailResp(`Invalid status IDs provided: ${invalidIds.join(', ')}`));
                }
    
                for (const taskStatusId of statusIds) {
                    const statusData = existingStatuses.find(status => status._id.toString() === taskStatusId);
                    if (statusData.isDefault) {
                        return res.status(400).send(Responses.taskDuplicateErrorResp(taskStatusMessage['TASK_STATUS_DEFAULT'][language ?? 'en']));
                    }
                    
                    let isAssignedTask, isAssignedSubtask;
                    isAssignedTask = await db
                        .collection(reusable.collectionName.task)
                        .find({ taskStatus: statusData.taskStatus })
                        .toArray();
                    isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .find({ subTaskStatus: statusData.taskStatus })
                        .toArray();
                    
                    if (isAssignedTask.length > 0 || isAssignedSubtask.length > 0) {
                        await db.collection(reusable.collectionName.task).updateMany(
                            { taskStatus: statusData.taskStatus },
                            { $set: { taskStatus: "Todo" } }
                        );
                        await db.collection(reusable.collectionName.subTask).updateMany(
                            { subTaskStatus: statusData.taskStatus },
                            { $set: { subTaskStatus: "Todo" } }
                        );
                    }
    
                    let status;
                    if (result.type === 'user' && permission != 'admin') {
                        status = await categorySchema.deleteOne({ 'createdBy.userId': userId, _id: categoryId, adminId: adminId });
                        if (status.deletedCount === 0) {
                            return res.status(400).send(Responses.taskFailResp("You can't delete Categories which are created by someone else"));
                        }
                    } else {
                        status = await statusSchema.deleteOne({ _id: taskStatusId, adminId: adminId });
                        if (status.deletedCount) {
                            let taskActivity = activityOfUser(`${firstName} deleted task status `, 'TaskStatus', firstName, 'Deleted', orgId, userId, profilePic);
                            taskActivity['taskStatusId'] = 'All';
                            event.emit('activity', taskActivity);
                            // Notification to Admin
                            const message = status.deletedCount == 1 && taskStatusId ? `Deleted the task status ${statusData.taskStatus}.` : `Deleted all non-default task status.`;
                            await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskStatus', id: null });
                            return res.status(200).send(Responses.taskSuccessResp(taskStatusMessage['TASK_STATUS_DELETED'][language ?? 'en'], status));
                        }
                    }
                }
    
                return res.status(200).send(Responses.taskSuccessResp("Statuses deleted successfully"));
            } else {
                return res.status(400).send(Responses.taskFailResp("No valid status IDs provided"));
            }
            
        } catch (err) {
            console.log(err);
            Logger.error({ 'err': err });
            return res.status(400).send(Responses.taskFailResp(taskStatusMessage['TASK_STATUS_DELETE_ERROR'][language ?? 'en']));
        }
    }
    
}

export default new TaskStatusService();
