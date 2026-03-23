import Responses from '../../response/response.js';
import TaskStageValidation from './taskStage.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import { commonMessage, taskStageMessage } from '../language/language.translator.js';
import Reuse from '../../utils/reuse.js';
import {
    checkCollection,
    checkIsDefault,
    countAllDocumentsQuery,
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
    totalDefaultCountForAdmin,
    updateByUserQuery,
} from '../../utils/common.utils.js';
import NotificationService from '../notifications/notifications.service.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import event from '../event/event.emitter.js';
import stageSchema from './taskStage.model.js'
class TaskStageService {
    /* ----------------Task Stage APIs -------------------*/
    //Create task stage
    async createTaskStage(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, planData: planTask, firstName, profilePic, orgId,creatorId } = result?.userData?.userData;
        try {
            const stage = req.body;
            const { value, error } = TaskStageValidation.createTaskStage(stage);
            Logger.info({'value': value});
            Logger.error({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));

            const totalCount = await stageSchema.countDocuments({ isDefault: false, adminId: adminId });
            if(planTask.customizeTaskStage==0){
                return res.status(429).send(Responses.taskFailResp("Can't create custom taskStage in free plan subscription"))
            }
            if (totalCount == planTask.customizeTaskStage) {
                return res.status(429).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_PLAN_LIMIT'][language ?? 'en']));
            }
            const queryCondition = { adminId: adminId, taskStage: new RegExp(`^${value?.taskStage}$`, 'i') };
            const isTaskStagePresent = await stageSchema.findOne(queryCondition);
            Logger.info({'isTaskStagePresent': isTaskStagePresent});
            if (isTaskStagePresent) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskStageMessage['TASK_STAGE_PRESENT'][language ?? 'en']));
            }
            value.adminId = adminId;
            value.createdBy = {
                userId: userId,
            };
            const resp = await stageSchema.create(value);

            const dataDetails = {
                totalCustomTaskTypes: totalCount,
                remainingTaskTypes: planTask.customizeTaskStage - totalCount,
                data: resp,
            };
            Logger.info({'Response': resp});
            let taskActivity = activityOfUser(`${firstName} created task stage ${stage.taskStage}`, 'TaskStage', firstName, 'Created', orgId, userId, profilePic);
            taskActivity['taskStageId'] = resp._id.toString();
            event.emit('activity', taskActivity);
            // Notification to Admin
            const message = `Created task stage ${stage.taskStage}`;
            await NotificationService.adminNotification(message, adminId, userId,{ collection: 'taskStage', id: resp._id.toString() });
            if (result.type === 'user') {
            if (adminId != creatorId && userId != creatorId) {
                await NotificationService.userNotification(message,  userId,creatorId,  { collection: 'taskStage', id: resp._id.toString()});
            }
           }
            return res.status(200).send(Responses.taskSuccessResp(taskStageMessage['TASK_STAGE_CREATED'][language ?? 'en'], dataDetails));
        } catch (err) {
            Logger.error({'error': err});
            return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_CREATED'][language ?? 'en']));
        }
    }

    async getTaskStageById(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, orgId, profilePic } = result?.userData?.userData;
        try {
            const id = req?.query?.id;
            const skip = reusable.skip;
            const limit = reusable.limit;
            const keyword=req?.query?.keyword;
            let orderby = reusable.orderby || 'createdAt';
            let sort = reusable.sort;
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            const data = {};
            if (req?.query.keyword) {
                let keyword = req?.query.keyword;
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Responses.taskFailResp('Failed to search, please check keyword'));
                }
                Logger.info(keyword);
            }
            if (id) {
                data.stageData = await stageSchema.find({ _id: id,adminId:adminId})
                data.stage = [data?.stageData];
                delete data?.stageData;
            } else {
                data.stage = await stageSchema.find( { adminId: adminId,taskStage: new RegExp(keyword, 'i') }).sort(sortBy).skip(skip).limit(limit)
                data.total_count = await stageSchema.countDocuments({ adminId: adminId });
                data.custom_count = await stageSchema.countDocuments({ isDefault: false, adminId: adminId });
                data.default_count = await stageSchema.countDocuments({ isDefault: true, adminId: adminId });
            }
            if (data.stage) {
                let taskActivity = activityOfUser(`${firstName} viewed task stages`, 'TaskStage', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['taskStageId'] = id ? id : 'All';
                event.emit('activity', taskActivity);
            }
            Logger.info({'Task stage': data});
            return data.stage
                ? res.status(200).send(Responses.taskSuccessResp(taskStageMessage['TASK_STAGE_FETCHED'][language ?? 'en'], data))
                : res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_FETCHED'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_FETCHED'][language ?? 'en']));
        }
    }

    //Update task stage
    async updateTaskStage(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission} = result?.userData?.userData;
        try {
            const stage = req.body;
            const { value, error } = TaskStageValidation.updateTaskStage(stage);
            Logger.info({'value': value});
            Logger.info({'error': error});
            if (error) return res.status(400).send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            value.updatedAt = new Date();
            const id = req?.params?.id;
           
            const isDefault = await stageSchema.findOne({ _id: id, isDefault: true })
            if (isDefault) {
                return res.status(400).send(Responses.taskDuplicateErrorResp(taskStageMessage['TASK_STAGE_DEFAULT'][language ?? 'en']));
            }
            const queryCondition = { adminId: adminId, taskStage: new RegExp(`^${stage?.taskStage}$`, 'i') };
            const isTaskStagePresent = await stageSchema.findOne(queryCondition);
            Logger.info({'isTaskStagePresent': isTaskStagePresent});
            if (isTaskStagePresent) return res.status(400).send(Responses.taskDuplicateErrorResp(taskStageMessage['TASK_STAGE_PRESENT'][language ?? 'en']));
            const taskStage = await stageSchema.findOne({ _id: id, adminId: adminId })
            let updatedTaskStage;
            if (result.type === 'user'  && permission !== 'admin') {
                updatedTaskStage = await stageSchema.findOneAndUpdate({ _id: id, adminId: adminId, $or: [{ 'createdBy.userId': userId, isDefault: false }] }, { $set: value }, { returnDocument: 'after' })
                if (!updatedTaskStage) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            } else {
                updatedTaskStage = await stageSchema.findOneAndUpdate({ _id: id, adminId: adminId }, { $set: value }, { returnDocument: 'after' });
            }
            Logger.info({'updatedTaskStage': updatedTaskStage});
            if (updatedTaskStage) {
                let taskActivity = activityOfUser(`${firstName} updated task stage as ${updatedTaskStage.taskStage}`, 'TaskStage', firstName, 'Updated', orgId, userId, profilePic);
                taskActivity['taskStageId'] = id;
                event.emit('activity', taskActivity);
                //updating task stages wherever it is assigned 
                const db = await checkCollection(reusable.collectionName.task);
                await db.collection(reusable.collectionName.task)
                            .updateMany( { stageName: taskStage?.taskStage },{$set: { stageName:updatedTaskStage?.taskStage }});
               await db.collection(reusable.collectionName.subTask)
                            .updateMany( { subTaskStageName: taskStage?.taskStage },{$set: { subTaskStageName:updatedTaskStage?.taskStage }});
                // Notification to Admin
                const message = `Updated task stage from ${taskStage.taskStage} to ${updatedTaskStage.taskStage}`;
                await NotificationService.adminNotification(message, adminId, userId,  { collection: 'taskStage', id: updatedTaskStage._id.toString() });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  { collection: 'taskStage', id: updatedTaskStage._id.toString()});
                }
              }
                return res.status(200).send(Responses.taskSuccessResp(taskStageMessage['TASK_STAGE_UPDATED'][language ?? 'en'], updatedTaskStage));
            }
            return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_UPDATED'][language ?? 'en']));
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_UPDATED'][language ?? 'en']));
        }
    }

    async deleteTaskStageById(req, res, next) {
        const reusable = new Reuse(req);
        const result = reusable.result;
        Logger.info({'result': result});
        const { _id: userId, adminId, language, firstName, profilePic, orgId,permission } = result?.userData?.userData;
        try {
            const id = req.query?.id;
            let taskStage, data;
            const db = await checkCollection(reusable.collectionName.task);
            if (id) {
                const isDefault = await stageSchema.findOne({ _id: id, isDefault: true });
                if (isDefault) {
                    return res.status(400).send(Responses.taskDuplicateErrorResp(taskStageMessage['TASK_STAGE_DEFAULT'][language ?? 'en']));
                }
                data = await stageSchema.findOne({ _id: id, adminId: adminId });
                let isAssignedTask, isAssignedSubtask;
                isAssignedTask = await db
                    .collection(reusable.collectionName.task)
                    .find({ stageName: data?.taskStage })
                    .toArray();
                isAssignedSubtask = await db
                    .collection(reusable.collectionName.subTask)
                    .find({ subTaskStageName: data?.taskStage })
                    .toArray();
                if (isAssignedTask.length > 0 || isAssignedSubtask > 0) {
                    return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_CANNOT_DELETED'][language ?? 'en']));
                }
                if (result.type === 'user' && permission != 'admin') {
                    taskStage = await stageSchema.deleteOne({ 'createdBy.userId': userId, _id: id, adminId: adminId })
                    if (taskStage.deletedCount === 0) {
                        return res.status(400).send(Responses.taskFailResp("You can't delete stage which are created by someone else"));
                    }
                }
                else {
                    taskStage = await stageSchema.deleteOne({ _id: id, adminId: adminId })
                }
            }
            else {
                let notExist = [];

                let data = await stageSchema.find({ adminId: adminId });
                await Promise.all( data.map(async ele => {
                    let isAssigneTask = await db
                        .collection(reusable.collectionName.task)
                        .aggregate([{ $match: { stageName: ele?.taskStage } }])
                        .toArray();
                    if (isAssigneTask.length > 0) {
                        notExist.push(ele.taskStage)
                        return notExist;
                    }
                }))
                await Promise.all( data.map(async ele => {
                    let isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .aggregate([{ $match: { subTaskStageName: ele?.taskStage } }])
                        .toArray();
                    if (isAssignedSubtask.length > 0) {
                        notExist.push(ele.taskStage)
                        return notExist;
                    }
                }))
                let filter;
                if (result.type === 'user' && permission != 'admin') {
                    filter = {
                        'createdBy.userId': userId,
                        adminId: adminId,
                        isDefault: false,
                        taskStage: { $nin: notExist }
                    };
                } else {
                    filter = {
                        adminId: adminId,
                        isDefault: false,
                        taskStage: { $nin: notExist }
                    };
                }
                taskStage = await stageSchema.deleteMany(filter);
            }
            Logger.info({'status': taskStage});
            if (taskStage.deletedCount) {
                let taskActivity = activityOfUser(`${firstName} deleted task stage`, 'TaskStage', firstName, 'Deleted', orgId, userId, profilePic);
                taskActivity['taskStageId'] = id ? id : 'All';
                event.emit('activity', taskActivity);
                // Notification to Admin
                const message = taskStage.deletedCount == 1 && id ? `Deleted the task stage ${data?.taskStage}.` : `Deleted all non-default task stages.`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskStage', id: null });
                if (result.type === 'user') {
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId,creatorId,  {  collection: 'taskStage', id: null});
                }
              }
                return res.status(200).send(Responses.taskSuccessResp(taskStageMessage['TASK_STAGE_DELETED'][language ?? 'en'], taskStage));
            } else {
                return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_CANNOT_DELETED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error({'err': err});
            return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_DELETED'][language ?? 'en']));
        }
    }
    async deleteMultiTaskStageById(req,res,next){
        const reusable = new Reuse(req);
        const result = reusable.result;
        const { _id: userId, adminId, language, firstName, profilePic, orgId, creatorId, permission } = result?.userData?.userData;
        Logger.info({ 'result': result });
        try {
            const taskStagesIds = req.body?.taskStagesIds;
            let data;
            const db = await checkCollection(reusable.collectionName.task);
            
            if (taskStagesIds && Array.isArray(taskStagesIds)) {
                // Check if all status IDs exist in the database
                const existingTaskStagesIdsSchema = await stageSchema.find({ _id: { $in: taskStagesIds }, adminId: adminId }).select('_id isDefault taskStatus taskCategory taskType taskStage').lean();
                const existingTaskStagesIdsIds = existingTaskStagesIdsSchema.map(status => status._id.toString());
                const invalidIds = taskStagesIds.filter(id => !existingTaskStagesIdsIds.includes(id));
    
                if (invalidIds.length > 0) {
                    return res.status(400).send(Responses.taskFailResp(`Invalid TaskStage IDs provided: ${invalidIds.join(', ')}`));
                }
    
                for (const taskStageId of taskStagesIds) {
                    const taskStageData = existingTaskStagesIdsSchema.find(status => status._id.toString() === taskStageId);
                    if (taskStageData.isDefault) {
                        return res.status(400).send(Responses.taskDuplicateErrorResp(taskStageMessage['TASK_STAGE_DEFAULT'][language ?? 'en']));
                    }
                    
                    let isAssignedTask, isAssignedSubtask;
                    isAssignedTask = await db
                        .collection(reusable.collectionName.task)
                        .find({stageName: taskStageData.taskStage })
                        .toArray();
                    isAssignedSubtask = await db
                        .collection(reusable.collectionName.subTask)
                        .find({ subTaskStageName: taskStageData.taskStage })
                        .toArray();
                    
                    if (isAssignedTask.length > 0 || isAssignedSubtask.length > 0) {
                        await db.collection(reusable.collectionName.task).updateMany(
                            { stageName: taskStageData.taskStage },
                            { $set: { stageName: "Default" } }
                        );
                        await db.collection(reusable.collectionName.subTask).updateMany(
                            { subTaskStageName: taskStageData.taskStage },
                            { $set: { subTaskStageName: "Default" } }
                        );
                    }
    
                    let status;
                    if (result.type === 'user' && permission != 'admin') {
                        status = await stageSchema.deleteOne({ 'createdBy.userId': userId, _id: taskStageId, adminId: adminId });
                        if (status.deletedCount === 0) {
                            return res.status(400).send(Responses.taskFailResp("You can't delete TaskStage's which are created by someone else"));
                        }
                    } else {
                        status = await stageSchema.deleteOne({ _id: taskStageId, adminId: adminId });
                        if (status.deletedCount) {
                            let taskActivity = activityOfUser(`${firstName} deleted task Stages `, 'TaskStage', firstName, 'Deleted', orgId, userId, profilePic);
                            taskActivity['taskStatusId'] = 'All';
                            event.emit('activity', taskActivity);
                            // Notification to Admin
                            const message = status.deletedCount == 1 && taskStageId ? `Deleted the task Type ${taskStageData.stageName}.` : `Deleted all non-default task Stages.`;
                            await NotificationService.adminNotification(message, adminId, userId, { collection: 'taskStage', id: null });
                            return res.status(200).send(Responses.taskSuccessResp(taskStageMessage['TASK_STAGE_DELETED'][language ?? 'en'], status));
                        }
                    }
                }
    
                return res.status(200).send(Responses.taskSuccessResp("TaskStages deleted successfully"));
            } else {
                return res.status(400).send(Responses.taskFailResp("No valid taskStages IDs provided"));
            }
            
        } catch (err) {
            console.log(err);
            Logger.error({ 'err': err });
            return res.status(400).send(Responses.taskFailResp(taskStageMessage['TASK_STAGE_NOT_DELETED'][language ?? 'en']));
        }
    }        
    
}

export default new TaskStageService();
