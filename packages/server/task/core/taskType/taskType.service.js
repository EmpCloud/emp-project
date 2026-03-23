import Responses from '../../response/response.js';
import TaskTypeValidation from './taskType.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import { commonMessage, taskTypeMessage } from '../language/language.translator.js';
import Reuse from '../../utils/reuse.js';
import {
    checkCollection,
    checkIsDefault,
    countAllDocumentsQuery,
    totalCustomCountForAdmin,
    deleteAllByAdminQuery,
    deleteAllByUserQuery,
    deleteOneByAdminQuery,
    deleteOneByUserQuery,
    findByIdAndUpdateQuery,
    findByIdQuery,
    insertAndReturnData,
    searchDocumentsQuery,
    updateByUserQuery,
    isItemExists,
    findAllItems,
} from '../../utils/common.utils.js';
import NotificationService from '../notifications/notifications.service.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/event.emitter.js';
import typeSchema from './taskType.model.js';
class TaskTypeService {
    /* ----------------Task Type APIs -------------------*/
    //Create task type
    async createTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, planData: planTask, firstName, profilePic, orgId,creatorId } = result?.userData?.userData;
        try {
            const type = req.body;
            type.adminId = adminId;
            const { value, error } = TaskTypeValidation.createTaskType(type);
            Logger.info({'value': value});
            Logger.error({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            
            const customTypes = await typeSchema.countDocuments({ isDefault: false, adminId: adminId });
            if(planTask.customizeTaskType==0){
                return res.status(429).send(Responses.taskFailResp("Can't create custom taskType in free plan subscription"))
            }
            if (customTypes == planTask.customizeTaskType) {
                return res.status(429).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_PLAN_LIMIT'][language ?? 'en']));
            }
            const queryCondition = { adminId: adminId,taskType: new RegExp(`^${value?.taskType}$`, 'i') };
            const isTaskTypePresent = await typeSchema.findOne(queryCondition);
            if (isTaskTypePresent) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskTypeMessage['TASK_TYPE_PRESENT'][language ?? 'en']));
            }
            value.createdBy = {
                userId: userId,
            };
            const insertedData = await typeSchema.create(value);  
            const totalCustomTypes = await typeSchema.countDocuments({ isDefault: false, adminId: adminId });
            const dataDetails = {
                totalCustomTaskTypes: totalCustomTypes,
                remainingTaskTypes: planTask.customizeTaskType - totalCustomTypes,
                data: insertedData,
            };
            Logger.info({'Response': insertedData});
            let taskActivity = activityOfUser(`${firstName} created task type ${type.taskType}`, 'TaskType', firstName, 'Created', orgId, userId, profilePic);
            taskActivity['taskTypeId'] = insertedData._id.toString();
            event.emit('activity', taskActivity);
            // Notification to Admin
            const message = `Created task type ${type.taskType}`;
            await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskType', id: insertedData._id.toString() });
            if (result.type === 'user') {
            if (adminId != creatorId && userId != creatorId) {
                await NotificationService.userNotification(message,userId,creatorId,  {collection: 'taskType', id: insertedData._id.toString()});
            }
           }
            return res.status(200).send(Responses.taskSuccessResp(taskTypeMessage['TASK_TYPE_CREATED'][language ?? 'en'], dataDetails));
        } catch (err) {
            Logger.error({'error': err});
            return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASKTYPE_NOT_CREATED'][language ?? 'en']));
        }
    }

    // Get task type
    async getTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, profilePic, orgId } = result?.userData?.userData;
        try {
            const taskTypeId = req.query.id;
            let skipValue = reusable.skip;
            let limitValue = reusable.limit;
            let orderby = reusable.orderby || 'createdAt';
            let sort = reusable.sort;
            const keyword=req?.query?.keyword;
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            if (req?.query.keyword) {
                let keyword = req?.query.keyword;
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Responses.taskFailResp('Failed to search, please check keyword'));
                }
                Logger.info(keyword);
            }
            let type,typeData;
            if(taskTypeId) type = await typeSchema.findOne({_id:taskTypeId,adminId:adminId});
            if(type) typeData = [type];
            if(!taskTypeId)  typeData = await typeSchema.find({  adminId: adminId,taskType:new RegExp(keyword, 'i') }).sort(sortBy).skip(skipValue).limit(limitValue)
            const totalCount = await typeSchema.countDocuments({ adminId: adminId }); 
            if (typeData.length) {
                let taskActivity = activityOfUser(`${firstName} viewed task type`, 'TaskType', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['taskTypeId'] = taskTypeId ? taskTypeId : 'All';
                event.emit('activity', taskActivity);
            }
            Logger.info({'Task type': type});
            typeData.length
                ? res.status(200).send(Responses.taskSuccessResp(taskTypeMessage['TASK_TYPE_FETCHED'][language ?? 'en'], { data: typeData, count: totalCount }))
                : res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_NOT_FOUND'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_NOT_FETCHED'][language ?? 'en']));
        }
    }
    //Update task type
    async updateTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, isAdmin, orgId, profilePic,creatorId } = result?.userData?.userData;
        try {
            const type = req.body;
            const adminOverwrite = result?.userData?.userData?.isOverwrite || false;
            const { value, error } = TaskTypeValidation.updateTaskType(type);
            Logger.info({'value': value});
            Logger.info({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            value.updatedAt = new Date();
            const id = req?.params?.id;
           
            if (adminOverwrite) {
                const updatedTaskType = await typeSchema.findOneAndUpdate({_id:id,adminId:adminId},{$set:value},{ returnDocument: 'after' })
                let taskActivity = activityOfUser(`${firstName} updated task type`, 'TaskType', firstName, 'Updated', orgId, userId, profilePic);
                taskActivity['taskTypeId'] = id;
                event.emit('activity', taskActivity);
                updatedTaskType
                    ? res.status(200).send(Responses.taskSuccessResp(taskTypeMessage['TASK_TYPE_UPDATED'][language ?? 'en'], updatedTaskType))
                    : res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_NOT_UPDATED'][language ?? 'en']));
            }
            const isDefault = await typeSchema.findOne({ _id: id,adminId:adminId, isDefault: true })
            if (isDefault) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskTypeMessage['TASK_TYPE_DEFAULT'][language ?? 'en']));
            }
            const taskType = await typeSchema.findOne({_id: id,adminId: adminId})
            const queryCondition = { adminId: adminId,taskType: new RegExp(`^${value?.taskType}$`, 'i') };
            const isTaskTypePresent = await typeSchema.findOne(queryCondition);
            Logger.info({'isTaskTypePresent': isTaskTypePresent});
            if (isTaskTypePresent) return res.status(400).send(Responses.taskDuplicateErrorResp(taskTypeMessage['TASK_TYPE_PRESENT'][language ?? 'en']));
            let updatedTaskType;
            if (result.type === 'user'  && permission !== 'admin') {
                updatedTaskType = await typeSchema.findOneAndUpdate({_id: id,adminId: adminId, $or: [{ 'createdBy.userId': userId, isDefault: false }] },{$set:value},{ returnDocument: 'after' }) 
                if (!updatedTaskType) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            } else {
                updatedTaskType = await typeSchema.findOneAndUpdate({_id: id,adminId: adminId },{$set:value}, { returnDocument: 'after' });
            }
            Logger.info({'updatedTaskType': updatedTaskType});
            if (updatedTaskType) {
                let taskActivity = activityOfUser(`${firstName} updated task type  ${updatedTaskType?.taskType} to ${updatedTaskType?.taskType}`, 'TaskType', firstName, 'Updated', orgId, userId, profilePic);
                taskActivity['taskTypeId'] = id;
                event.emit('activity', taskActivity);
                //updating types wherever it is assigned
                const db = await checkCollection(reusable.collectionName.task);
                await db.collection(reusable.collectionName.task)
                            .updateMany( { taskType: taskType?.taskType },{$set: {taskType:updatedTaskType?.taskType}});
                await db.collection(reusable.collectionName.subTask)
                            .updateMany( { subTaskType: taskType?.taskType },{$set: {subTaskType:updatedTaskType?.taskType}});
                // Notification to Admin
                const message = `Updated task type from ${taskType.taskType} to ${updatedTaskType.taskType}`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskType', id: updatedTaskType._id.toString() });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  {collection: 'taskType', id: updatedTaskType._id.toString()});
                }
               }
                return res.status(200).send(Responses.taskSuccessResp(taskTypeMessage['TASK_TYPE_UPDATED'][language ?? 'en'], updatedTaskType));
            }
            return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_NOT_UPDATED'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err' :err});
            return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_NOT_UPDATED'][language ?? 'en']));
        }
    }

    //Delete task by Id
    async deleteTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission } = result?.userData?.userData;
        try {
            const taskTypeId = req.query.id;
            

            let type, data;
            const db = await checkCollection(reusable.collectionName.task);
            if (taskTypeId) {
                const isDefault = await typeSchema.findOne({ _id: taskTypeId, isDefault: true });
                if (isDefault) {
                    return res.status(400).send(Responses.taskDuplicateErrorResp(taskTypeMessage['TASK_TYPE_DEFAULT'][language ?? 'en']));
                }
                data = await typeSchema.findOne({ _id: taskTypeId, adminId: adminId });
                let isAssignedTask, isAssignedSubtask;
                isAssignedTask = await db
                    .collection(reusable.collectionName.task)
                    .find({ taskType: data?.taskType })
                    .toArray();
                isAssignedSubtask = await db
                    .collection(reusable.collectionName.subTask)
                    .find({ subTaskType: data?.taskType })
                    .toArray();
                if (isAssignedTask.length > 0 || isAssignedSubtask > 0) {
                    return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_DELETE_FAILED'][language ?? 'en']));
                }
                if (result.type === 'user' && permission != 'admin') {
                    type = await typeSchema.deleteOne({ 'createdBy.userId': userId, _id: taskTypeId, adminId: adminId })
                    if (status.deletedCount === 0) {
                        return res.status(400).send(Responses.taskFailResp("You can't delete type which are created by someone else"));
                    }
                }
                else {
                    type = await typeSchema.deleteOne({ _id: taskTypeId, adminId: adminId })
                }
            }
            else {
                let notExist = [];

                let data = await typeSchema.find({ adminId: adminId });
                await Promise.all( data.map(async ele => {
                    let isAssigneTask = await db
                        .collection(reusable.collectionName.task)
                        .aggregate([{ $match: { taskType: ele?.taskType } }])
                        .toArray();
                    if (isAssigneTask.length > 0) {
                        notExist.push(ele.taskType)
                        return notExist;
                    }
                }))
                await Promise.all( data.map(async ele => {
                    let isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .aggregate([{ $match: { subTaskType: ele?.taskType } }])
                        .toArray();
                    if (isAssignedSubtask.length > 0) {
                        notExist.push(ele.taskType)
                        return notExist;
                    }
                }))
                let filter;
                if (result.type === 'user' && permission != 'admin') {
                    filter = {
                        'createdBy.userId': userId,
                        adminId: adminId,
                        isDefault: false,
                        taskType: { $nin: notExist }
                    };
                } else {
                    filter = {
                        adminId: adminId,
                        isDefault: false,
                        taskType: { $nin: notExist }
                    };
                }
                type = await typeSchema.deleteMany(filter);
            }
            Logger.info({'Task type': type});
            if (type.deletedCount) {
                let taskActivity = activityOfUser(`${firstName} deleted task type`, 'TaskType', firstName, 'Deleted', orgId, userId, profilePic);
                taskActivity['taskTypeId'] = taskTypeId ? taskTypeId : 'All';
                event.emit('activity', taskActivity);
                // Notification to Admin
                const message = type.deletedCount == 1 && taskTypeId ? `Deleted the task type ${data?.taskType}.` : `Deleted all non-default task types.`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskType', id: null });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  { collection: 'taskType', id: null });
                }
               }
                res.status(200).send(Responses.taskSuccessResp(taskTypeMessage['TASK_TYPE_DELETED'][language ?? 'en'], type));
            } else {
                res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_DELETE_FAILED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_DELETE_FAILED'][language ?? 'en']));
        }
    }

    async searchTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { language, firstName, orgId,adminId, profilePic, _id: userId } = result.userData?.userData;
        try {
            let skipValue = reusable.skip;
            let limitValue = reusable.limit;
            let searchQuery = {adminId: adminId};
            let keyword = req?.query?.keyword;
            if (keyword) {
                searchQuery.$or = [{ taskType: new RegExp(keyword, 'i') }];
            }

            let sort = reusable.sort;
            let orderby = reusable.orderby || 'taskType';
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            const taskTypeCount = await typeSchema.countDocuments({ adminId: adminId });
            let searchedData = await typeSchema.find(searchQuery).sort(sortBy).skip(skipValue).limit(limitValue);
            let data = { taskTypeCount: taskTypeCount, skip: skipValue, resp: searchedData };
            let taskActivity = activityOfUser(`${firstName} searched task type`, 'TaskType', firstName, 'Searched', orgId, userId, profilePic);
            event.emit('activity', taskActivity);
            Logger.info({'Data': data});
            return res.send(Responses.taskSuccessResp(commonMessage['SEARCH_SUCCESS'][language ?? 'en'], data));
        } catch (error) {
            Logger.error({'Error': error});
            return res.send(Responses.taskFailResp(commonMessage['SEARCH FAILED'][language ?? 'en']));
        }
    }


    async deleteMultiTaskType(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission } = result?.userData?.userData;
        Logger.info({ 'result': result });
        try {
            const taskTypeIds = req.body?.taskTypeIds;
            let data;
            const db = await checkCollection(reusable.collectionName.task);
            
            if (taskTypeIds && Array.isArray(taskTypeIds)) {
                // Check if all status IDs exist in the database
                const existingTaskTypeSchema = await typeSchema.find({ _id: { $in: taskTypeIds }, adminId: adminId }).select('_id isDefault taskStatus taskCategory taskType').lean();
                const existingTaskTypeIds = existingTaskTypeSchema.map(status => status._id.toString());
                const invalidIds = taskTypeIds.filter(id => !existingTaskTypeIds.includes(id));
    
                if (invalidIds.length > 0) {
                    return res.status(400).send(Responses.taskFailResp(`Invalid TaskType IDs provided: ${invalidIds.join(', ')}`));
                }
    
                for (const taskTypeId of taskTypeIds) {
                    const taskTypeData = existingTaskTypeSchema.find(status => status._id.toString() === taskTypeId);
                    if (taskTypeData.isDefault) {
                        return res.status(400).send(Responses.taskDuplicateErrorResp(taskStatusMessage['TASK_STATUS_DEFAULT'][language ?? 'en']));
                    }
                    
                    let isAssignedTask, isAssignedSubtask;
                    isAssignedTask = await db
                        .collection(reusable.collectionName.task)
                        .find({taskType: taskTypeData.taskType })
                        .toArray();
                    isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .find({ subTaskType: taskTypeData.taskType })
                        .toArray();
                    
                    if (isAssignedTask.length > 0 || isAssignedSubtask.length > 0) {
                        await db.collection(reusable.collectionName.task).updateMany(
                            { taskType: taskTypeData.taskType },
                            { $set: { taskType: "Default" } }
                        );
                        await db.collection(reusable.collectionName.subTask).updateMany(
                            { subTaskType: taskTypeData.taskType },
                            { $set: { subTaskType: "Default" } }
                        );
                    }
    
                    let status;
                    if (result.type === 'user' && permission != 'admin') {
                        status = await typeSchema.deleteOne({ 'createdBy.userId': userId, _id: taskTypeId, adminId: adminId });
                        if (status.deletedCount === 0) {
                            return res.status(400).send(Responses.taskFailResp("You can't delete TaskType's which are created by someone else"));
                        }
                    } else {
                        status = await typeSchema.deleteOne({ _id: taskTypeId, adminId: adminId });
                        if (status.deletedCount) {
                            let taskActivity = activityOfUser(`${firstName} deleted task Type `, 'TaskType', firstName, 'Deleted', orgId, userId, profilePic);
                            taskActivity['taskStatusId'] = 'All';
                            event.emit('activity', taskActivity);
                            // Notification to Admin
                            const message = status.deletedCount == 1 && taskTypeId ? `Deleted the task Type ${taskTypeData.taskType}.` : `Deleted all non-default task Types.`;
                            await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskTypes', id: null });
                            res.status(200).send(Responses.taskSuccessResp(taskTypeMessage['TASK_TYPE_DELETED'][language ?? 'en'], status));
                        }
                    }
                }
    
                return res.status(200).send(Responses.taskSuccessResp("TaskTypes deleted successfully"));
            } else {
                return res.status(400).send(Responses.taskFailResp("No valid taskType IDs provided"));
            }
            
        } catch (err) {
            console.log(err);
            Logger.error({ 'err': err });
            return res.status(400).send(Responses.taskFailResp(taskTypeMessage['TASK_TYPE_DELETE_FAILED'][language ?? 'en']));
        }
    }
}

export default new TaskTypeService();
