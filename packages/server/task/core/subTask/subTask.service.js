import Responses from '../../response/response.js';
import SubTaskValidation from './subTask.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import mongoose from 'mongoose';
import { viewFields, addNewDynamicFields, getFieldExist, subtractAndFormat, findByIdQuery, calculateProgress } from '../../utils/common.utils.js';
import { configSubTaskFieldsAdd } from '../../utils/customFields.utils.js';
import { ObjectId } from 'mongodb';
import { activityOfUser } from '../../utils/activity.utils.js';
import { commonMessage, subTaskMessage, commentMessage } from '../language/language.translator.js';
import GroupSchema from '../schema/group.model.js';
import { checkCollection, creatorDetails } from '../../utils/common.utils.js';
import Reuse from '../../utils/reuse.js';
import NotificationService from '../notifications/notifications.service.js';
import event from '../event/event.emitter.js';
import subtaskCommentSchema from './subtask.comment.schema.js';
import typeSchema from '../taskType/taskType.model.js';
import statusSchema from '../taskStatus/taskStatus.model.js';
class SubTaskService {
    //Function to Create SubTask
    async createSubTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, orgId: organizationId, _id: subTaskCreatorId, adminId, planData: planTask, firstName, lastName, profilePic, creatorId,isAdmin } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const subtask = req.body;
            const subTaskCustomFields = await configSubTaskFieldsAdd(organizationId, subtask, res, language);
            if (subTaskCustomFields.Error) {
                return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], subTaskCustomFields.Error));
            } else {
                const { value, error } = SubTaskValidation.createSubTask(subtask);
                Logger.info('Value: ', value);
                Logger.error('Error: ', error);
                if (error) {
                    return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
                }
                addNewDynamicFields(value, subTaskCustomFields.obj);
                Logger.info({ "SubTask": subtask });
                const subTaskCreator = {
                    id: subTaskCreatorId,
                    isAdmin:isAdmin
                    //firstName: firstName,
                    //lastName: lastName,
                    //profilePic: profilePic,
                };
                value.subTaskCreator = subTaskCreator;
                if (!value.subTaskAssignedTo) value.subTaskAssignedTo = [];
                const { subTaskTitle, subTaskType, subTaskStatus } = value;
                const taskId = value.taskId;
                let adminModel=`adminschemas`;
                const taskCollectionName = reusable.collectionName.task;
                const subTaskCollectionName = reusable.collectionName.subTask;
                const db = await checkCollection(subTaskCollectionName);
                if (!db) return res.send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
                let isTaskValid = await db.collection(taskCollectionName).findOne({ _id: ObjectId(taskId) });
                if (!isTaskValid) return res.send(Responses.taskFailResp('Please Enter Valid TaskId'));
                if (isTaskValid.taskStatus == 'Done') {
                    return res.status(400).send(Responses.taskFailResp(subTaskMessage['ENABLE_TO_CREATE_SUBTASK'][language ?? 'en']))
                }
                const userCollection = reusable.collectionName.user;
                let user,admin;
                let subtaskperProject = await db.collection(subTaskCollectionName).find({}).toArray();
                subtaskperProject.map(async(ele)=>{
                    user = await db.collection(adminModel).findOne({ _id: ObjectId(ele.subTaskCreator.id) })
                    if (user) { 
                       let updatedValue=await db.collection(subTaskCollectionName).findOneAndUpdate({_id:ObjectId(ele._id)},{$set:{"subTaskCreator.isAdmin":user.isAdmin}},{returnDocument: 'after'})
                     } else {
                        admin = await db.collection(userCollection).findOne({ _id: ObjectId(ele.subTaskCreator.id) });
                       await db.collection(subTaskCollectionName).findOneAndUpdate({_id:ObjectId(ele._id)},{$set:{"subTaskCreator.isAdmin":admin.isAdmin}},{returnDocument: 'after'})
                        
                    }
                })
                subtaskperProject.map(async (assign)=>{
                    assign.subTaskAssignedTo.map(async (ele)=>{
                        let adminModel=`adminschemas`;
                        user = await db.collection(adminModel).findOne({ _id: ele.id })
                        if (user) { 
                            await db.collection(subTaskCollectionName).findOneAndUpdate({_id:ObjectId(assign._id)},{$set:{"subTaskAssignedTo.$[].isAdmin":user.isAdmin}},{returnDocument: 'after'})
                         } else {
                            admin = await db.collection(userCollection).findOne({ _id: ObjectId(ele.id) });
                            await db.collection(subTaskCollectionName).findOneAndUpdate({_id:ObjectId(assign._id)},{$set:{"subTaskAssignedTo.$[].isAdmin":admin.isAdmin}},{returnDocument: 'after'})
                            
                        }
                    })

                })
                if (subtaskperProject.length == planTask.subTaskFeatureCount) {
                    return res.status(429).send(Responses.taskFailResp(`subTask adding limit is reached not able to add subtasks under your ${planTask.planName} plan `))
                }
                const project_id = isTaskValid.projectId;
                if (project_id) value.projectId = project_id;

                if (subTaskType) {
                    let exist = await typeSchema.find({ adminId: adminId, taskType: subTaskType })
                    if (!exist) {
                        return res.send(Responses.taskFailResp(subTaskMessage['SUBTASK-TYPE_NOT_PRESENT'][language ?? 'en']));
                    }
                }
                if (subTaskStatus) {
                    let exist = await statusSchema.find({ adminId: adminId, taskStatus: subTaskStatus })
                    if (!exist) {
                        return res.send(Responses.taskFailResp(subTaskMessage['SUBTASK-STATUS_NOT_PRESENT'][language ?? 'en']));
                    }
                }
                // Check for sub-task if already present
                let isSubTaskPresent = await db.collection(subTaskCollectionName).findOne({ taskId, subTaskTitle });
                if (isSubTaskPresent) {
                    Logger.info({ "isSubTaskPresent": isSubTaskPresent });
                    return res.send(Responses.taskDuplicateErrorResp(subTaskMessage['SUB_TASK_ALREADY_PRESENT'][language ?? 'en']));
                }
                
                if (value.subTaskAssignedTo.length) {
                    //checking each user assigned with task
                    for (const [index, user] of value.subTaskAssignedTo.entries()) {
                        const userCheck = await db.collection(userCollection).findOne({ _id: ObjectId(user.id) });
                        user.isAdmin=userCheck?.isAdmin;
                        //check for soft deleted user
                        if (!userCheck || userCheck?.softDeleted) return res.send(Responses.taskFailResp(commonMessage['USER_NOT_FOUND'][language ?? 'en']));
                        if (userCheck.invitation != 1) return res.send(Responses.taskFailResp('Unable to assign user,please check invitation status of the user.'));
                        //if (userCheck.isSuspended === false) return res.send(Responses.taskFailResp('Unable to assign user,user is suspended.'));
                    }
                }
                if (value.group?.length) {
                    for (const [index, group] of value?.group.entries()) {
                        const groupCheck = await GroupSchema.findById({ _id: ObjectId(group.groupId) });
                        if (!groupCheck) return res.send(Responses.taskFailResp(commonMessage['GROUP_NOT_FOUND'][language ?? 'en'], group.id));
                    }
                }
                if ((value?.actualHours == '') || (value?.actualHours == null)) {
                    value.actualHours = "00:00";
                }
                if (value?.estimationTime && value?.actualHours) {
                    if (value.actualHours <= value.estimationTime) {
                        value.remainingHours = subtractAndFormat(value.estimationTime, value.actualHours);

                    } else {
                        value.exceededHours = subtractAndFormat(value.actualHours, value.estimationTime);
                        value.remainingHours = "00:00";
                    }
                }
                let response = await db.collection(subTaskCollectionName).insertOne(value);
                let progress = await calculateProgress(subTaskCollectionName, db, taskId)
                event.emit('progress', db, taskCollectionName, progress, taskId);

                value.createdAt = new Date();
                Logger.info({ "response": response });
                let subTaskActivity = activityOfUser(`${firstName + ' ' + lastName} created subtask ${subTaskTitle}`, 'SubTask', firstName, 'Created', organizationId, subTaskCreatorId, profilePic);
                subTaskActivity['subTaskId'] = response.insertedId.toString();
                subTaskActivity['taskId'] = taskId;
                if (project_id) {
                    subTaskActivity['projectId'] = project_id;
                }
                event.emit('activity', subTaskActivity);
                let subTaskCount = await db.collection(subTaskCollectionName).countDocuments({});
                let remainingSubtasks = planTask.subTaskFeatureCount - subTaskCount;
                // Notification
                if (result.type === 'user') {
                    // To Admin
                    const message = `Created subtask ${subTaskTitle}`;
                    await NotificationService.adminNotification(message, adminId, subTaskCreatorId, { collection: 'subTask', id: response.insertedId.toString() });
                    if (adminId != creatorId && subTaskCreatorId != creatorId) {
                        await NotificationService.userNotification(message,subTaskCreatorId,creatorId,  { collection: 'subTask', id: response.insertedId.toString() });
                    }
                }
                // To Users
                if (value?.subTaskAssignedTo?.length) {
                    for (const user of value?.subTaskAssignedTo) {
                        const message = `Assigned you subtask ${subTaskTitle}`;
                        await NotificationService.userNotification(message, subTaskCreatorId, user.id, { collection: 'subTask', id: response.insertedId.toString() });
                    }
                }
                return res.send(
                    Responses.taskSuccessResp(subTaskMessage['SUB_TASK_CREATED'][language ?? 'en'], { totalCreatedSubtasks: subTaskCount, remainingSubtasks: remainingSubtasks, response })
                );
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(subTaskMessage['SUB_TASK_NOT_CREATED'][language ?? 'en']));
        }
    }
    //update subTask
    async updateSubTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { firstName, language, orgId: organizationId, _id: subTaskCreatorId, adminId, lastName, creatorId,permission} = result.userData?.userData;
        try {
            const subtask = req.body;
            let CreatorName = result?.userData?.userData?.firstName;
            let creatorProfilePic = result?.userData?.userData?.profilePic;
            let id = req.params?.id;
            const { value, error } = SubTaskValidation.updateSubtask(subtask);
            Logger.info({ "value": value });
            Logger.info({ "error": error });
            if (error) return res.status(400).send(Responses.validationfailResp('validation failed', error));
            const { taskId, subTaskType, subTaskStatus } = value;
            const subTaskCollectionName = reusable.collectionName.subTask;
            const userCollection = reusable.collectionName.user;
            const taskCollectionName = reusable.collectionName.task;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            if (taskId) {
                let isTaskValid = await db.collection(taskCollectionName).findOne({ _id: ObjectId(taskId) });
                if (!isTaskValid) return res.send(Responses.taskFailResp('Please Enter Valid Taskid'));
                if (isTaskValid.taskStatus == 'Done') {
                    return res.status(429).send(Responses.taskFailResp(subTaskMessage['ENABLE_TO_CREATE_SUBTASK'][language ?? 'en']))
                }
            }
            const subTaskExist = await findByIdQuery(db, subTaskCollectionName, id)
            if (!subTaskExist.length) {
                return res.send(Responses.taskFailResp(subTaskMessage['INVALID_SUBTASK-ID'][language ?? 'en']));
            }
            if (subTaskType) {
                let exist = await typeSchema.find({ adminId: adminId, taskType: subTaskType })
                if (!exist) {
                    return res.send(Responses.taskFailResp(subTaskMessage['SUBTASK-TYPE_NOT_PRESENT'][language ?? 'en']));
                }
            }
            if (subTaskStatus) {
                let exist = await statusSchema.find({ adminId: adminId, taskStatus: subTaskStatus })
                if (!exist) {
                    return res.send(Responses.taskFailResp(subTaskMessage['SUBTASK-STATUS_NOT_PRESENT'][language ?? 'en']));
                }
                if (subTaskStatus === 'Todo') {
                    value.progress = 0;
                }
                else if (subTaskStatus === 'Inprogress') {
                    value.progress = 50;
                }
                else if (subTaskStatus === 'Done') {
                    value.progress = 100;
                }
                else {
                    value.progress = subTaskExist[0].progress
                }
            }
            if (value.subTaskAssignedTo) {
                //checking each user assigned with task
                for (const [index, user] of value.subTaskAssignedTo.entries()) {
                    const userCheck = await db.collection(userCollection).findOne({ _id: ObjectId(user.id) });
                    user.userCheck=userCheck?.isAdmin;
                    //check for soft deleted user
                    if (!userCheck || userCheck?.softDeleted) return res.send(Responses.taskFailResp(commonMessage['USER_NOT_FOUND'][language ?? 'en']));
                }
            }
            if (value.group?.length) {
                for (const [index, group] of value?.group.entries()) {
                    const groupCheck = await GroupSchema.findById({ _id: ObjectId(group.groupId) });
                    if (!groupCheck) return res.send(Responses.taskFailResp(commonMessage['GROUP_NOT_FOUND'][language ?? 'en'], group.id));
                }
            }
            if ((value?.actualHours == '') || (value?.actualHours == null)) {
                value.actualHours = "00:00";
            }
            if (value?.actualHours) {
                if (value.actualHours <= subTaskExist[0].estimationTime) {
                    value.remainingHours = subtractAndFormat(subTaskExist[0].estimationTime, value.actualHours);
                    value.exceededHours = "00:00"

                } else {
                    value.exceededHours = subtractAndFormat(value.actualHours, subTaskExist[0].estimationTime);
                    value.remainingHours = "00:00";
                }
            }
            let updatedSubTask;
            if (result.type === 'user' && permission != 'admin') {
                updatedSubTask = await db
                    .collection(subTaskCollectionName)
                    .findOneAndUpdate({ $and: [{ _id: ObjectId(id) }, { $or: [{ 'subTaskCreator.id': subTaskCreatorId }, { "subTaskAssignedTo.id": subTaskCreatorId }] }] }, { $set: value }, { returnDocument: 'after' });
                if (!updatedSubTask.value) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            } else {
                updatedSubTask = await db.collection(subTaskCollectionName).findOneAndUpdate({ _id: ObjectId(id) }, { $set: value }, { returnDocument: 'after' });
            }
            if (updatedSubTask.value) {
                let taskId = updatedSubTask.value.taskId
                let progress = await calculateProgress(subTaskCollectionName, db, taskId)
                event.emit('progress', db, taskCollectionName, progress, taskId);

                Logger.info({ "updatedSubTask": updatedSubTask });
                let changed_property = [];
                Object.keys(subtask).forEach(entry => {
                    changed_property.push(`${entry}`);
                });
                let subTaskActivity = activityOfUser(
                    `${firstName + ' ' + lastName} updated ${changed_property} in  ${updatedSubTask.value.subTaskTitle} subtask`,
                    'SubTask',
                    CreatorName,
                    'Updated',
                    organizationId,
                    subTaskCreatorId,
                    creatorProfilePic
                );
                subTaskActivity['subTaskId'] = req.params?.id;
                event.emit('activity', subTaskActivity);
                const getSubTask = await db.collection(subTaskCollectionName).findOne({ _id: ObjectId(id) });
                // Notification
                if (result.type === 'user') {
                    // To Admin`
                    const message = `Updated details of ${updatedSubTask.value.subTaskTitle} subtask`;
                    await NotificationService.adminNotification(message, adminId, subTaskCreatorId, { collection: 'subTask', id: updatedSubTask.value._id.toString() });
                    if (adminId != creatorId && subTaskCreatorId != creatorId) {
                        await NotificationService.userNotification(message, subTaskCreatorId,creatorId,  { collection: 'subTask', id: updatedSubTask.value._id.toString() });
                    }
                }
                // To Users
                if (getSubTask?.subTaskAssignedTo?.length) {
                    for (const user of getSubTask?.subTaskAssignedTo) {
                        const message = `Updated details of ${updatedSubTask.value.subTaskTitle} subtask`;
                        await NotificationService.userNotification(message, subTaskCreatorId, user.id, { collection: 'subTask', id: updatedSubTask.value._id.toString() });
                    }
                }
                // To new assigned users
                if (value?.subTaskAssignedTo?.length) {
                    for (const user of value?.subTaskAssignedTo) {
                        if (getSubTask?.subTaskAssignedTo.includes(user.id) === false) {
                            const message = `Assigned you subtask ${updatedSubTask.value.subTaskTitle}`;
                            await NotificationService.userNotification(message, subTaskCreatorId, user.id, {
                                collection: 'subTask',
                                id: updatedSubTask.value._id.toString(),
                            });
                        }
                    }
                }
                res.status(200).send(Responses.taskSuccessResp(subTaskMessage['SUB_TASK_UPDATED'][language ?? 'en'], updatedSubTask.value))
            }
            else {
                return res.status(400).send(Responses.taskFailResp(subTaskMessage['SUB_TASK_NOT_UPDATED_INVALID-SUBTASK-ID'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(subTaskMessage['SUB_TASK_NOT_UPDATED_INVALID-SUBTASK-ID'][language ?? 'en']));
        }
    }

    //Delete all
    async deleteSubTasks(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language, orgId: organizationId, firstName: name, profilePic: profilePic, _id: userId, adminId, lastName, creatorId, permission } = result.userData?.userData;
        try {
            let subTaskId = req.query?.subTaskId;
            let taskId = req?.query?.taskId;

            const subTaskCollectionName = reusable.collectionName.subTask;
            const TaskCollectionName = reusable.collectionName.task;
            const commentCollectionName = reusable.collectionName.subTaskComment;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`${subTaskCollectionName} not present`));
            let subtask, deleteComment, status;
            if (taskId || subTaskId) {
                if (result.type === 'user' && permission != 'admin') {
                    if (subTaskId) {
                        subtask = await db.collection(subTaskCollectionName).findOneAndDelete({ _id: ObjectId(subTaskId), 'subTaskCreator.id': userId });
                        deleteComment = await db.collection(commentCollectionName).deleteMany({ subtask_id: subtask._id });
                    } 
                    if (taskId) {
                        status = await db.collection(subTaskCollectionName).deleteMany({ taskId: taskId, 'subTaskCreator.id': userId });
                        deleteComment = await db.collection(commentCollectionName).deleteMany({ task_id: taskId });
                    } 
                } else {
                    if (subTaskId) {
                        subtask = await db.collection(subTaskCollectionName).findOneAndDelete({ _id: ObjectId(subTaskId) });
                        deleteComment = await db.collection(commentCollectionName).deleteMany({ subtask_id: subTaskId });
                    }

                    if (taskId) {
                        status = await db.collection(subTaskCollectionName).deleteMany({ taskId: taskId });
                        deleteComment = await db.collection(commentCollectionName).deleteMany({ task_id: taskId });
                    }
                }

                if (subtask?.value) {
                    let subTaskActivity = activityOfUser(`${result?.userData?.userData?.firstName + ' ' + lastName} deleted ${subtask.value.subTaskTitle}subTask`, 'subTask', name, 'Deleted', organizationId, userId, profilePic);
                    subTaskActivity['subTaskId'] = req.params?.id;
                    event.emit('activity', subTaskActivity);
                    Logger.info({ "SubTask": subtask });
                    Logger.info({ "SubTask Comment Deleted": deleteComment });
                    // Notification
                    if (result.type === 'user') {
                        // To Admin
                        const message = `Deleted subtask ${subtask?.value?.subTaskTitle}`;
                        await NotificationService.adminNotification(message, adminId, userId, { collection: 'subTask', id: subtask.value?._id.toString() });
                        if (adminId != creatorId && userId != creatorId) {
                            await NotificationService.userNotification(message,userId,creatorId,  { collection: 'subTask', id: subtask.value?._id.toString() });
                        } 
                    }
                    // To Users
                    if (subtask?.subTaskAssignedTo?.length) {
                        for (const user of subtask?.subTaskAssignedTo) {
                            const message = `Deleted subtask ${subtask?.value?.subTaskTitle}`;
                            await NotificationService.userNotification(message, userId, user.id, { collection: 'subTask', id: subtask.value?._id.toString() });
                        }
                    }
                    return res.status(200).send(Responses.taskSuccessResp(`Successfully deleted  SubTask`));
                } else if (status?.deletedCount > 0) {
                    const getTask = await db.collection(TaskCollectionName).findOne({ _id: mongoose.Types.ObjectId(taskId) });
                    let subTaskActivity = activityOfUser(
                        `${result?.userData?.userData?.firstName + ' ' + lastName} deleted all subtasks under the task ${getTask.taskTitle}`,
                        'SubTask',
                        name,
                        'Deleted',
                        organizationId,
                        userId,
                        profilePic
                    );
                    subTaskActivity['taskId'] = req.params?.id;
                    event.emit('activity', subTaskActivity);
                    // Notification
                    if (result.type === 'user') {
                        // To Admin
                        const message = `Deleted all subtasks under the task ${getTask.taskTitle}`;
                        await NotificationService.adminNotification(message, adminId, userId, { collection: 'subTask', id: null });
                        if (adminId != creatorId && userId != creatorId) {
                            await NotificationService.userNotification(message,  userId,creatorId,  { collection: 'subTask', id: null  });
                        }
                    }
                    return res.status(200).send(Responses.taskSuccessResp(`Subtasks deleted successfully`, status));
                } else {
                    return res.status(400).send(Responses.taskFailResp('Failed to delete Invalid Task Id'));
                }
            } else if (!taskId || !subTaskId) {
                return res.status(400).send(Responses.taskFailResp('TaskId or subTaskId required'));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.status(400).send(Responses.taskFailResp(subTaskMessage['SUB_TASKS_NOT_DELETED'][language ?? 'en']));
        }
    }

    //analysis
    async searchSubTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language, orgId: organizationId, firstName: name, profilePic: profilePic, _id: Id, adminId, lastName, permission } = result.userData?.userData;
        try {
            const subTaskCollectionName = reusable.collectionName.subTask;
            const userCollectionName = reusable.collectionName.user;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const id = result?.userData?.userData?._id;
            let searchQuery = {};
            result.type === 'user' && permission != 'admin' ? searchQuery = { $or: [{ 'subTaskCreator.id': Id }, { 'subTaskAssignedTo.id': Id }] }
                : searchQuery['subTaskCreator.id'] = adminId;
            let keyword = req?.query?.keyword;
            if (keyword) {
                searchQuery.$or = [
                    { projectId: new RegExp(keyword, 'i') },
                    { subTaskTitle: new RegExp(keyword, 'i') },
                    { subTaskStageName: new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.firstName': new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.id': new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.lastName': new RegExp(keyword, 'i') },
                    { 'group.groupId': new RegExp(keyword, 'i') },
                ];
            }
            let sort = reusable.sort;
            let skipValue = reusable.skip;
            let limit = reusable.limit;
            let orderby = reusable.orderby || 'createdAt';
            let fieldValue,
                obj = {},
                fields;
            const dynamicCollection = `configviewfieldschemas`;
            const dynamicDataBase = await checkCollection(dynamicCollection);
            const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
            configFields.forEach(entry => {
                fields = entry['subTaskViewFields'];
            });
            let viewAccess = viewFields(configFields, fields, fieldValue, obj);
            const extraAccess = {
                reason: 1,
                completedDate: 1,
            };
            let totalViewAccess = { ...viewAccess, ...extraAccess };
            let filterData = [];
            filterData = Object.keys(viewAccess);
            if (orderby != 'createdAt') {
                let outIn = filterData.filter(word => orderby.includes(word));
                if (outIn.length == 0) {
                    return res.send(Responses.taskFailResp('Failed to search, please check config Fields'));
                }
            }
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            Logger.info({ "query length": Object.keys(searchQuery).length });
            let resp = await db
                .collection(subTaskCollectionName)
                .aggregate([{ $match: searchQuery }, { $project: totalViewAccess }], { collation: { locale: 'en', caseFirst: 'upper' } })
                .sort(sortBy)
                .skip(Number(skipValue))
                .limit(Number(limit))
                .toArray();
            await this.fetchCreator(resp, userCollectionName, db);
            resp = await this.user_GroupDetails(resp, db, userCollectionName);
            let data = { skip: skipValue, resp };
            Logger.info({ "Data": data });
            let subTaskActivity = activityOfUser(`${result?.userData?.userData?.firstName + ' ' + lastName} searched by ${orderby} key`, 'SubTask', name, 'Searched', organizationId, Id, profilePic);
            event.emit('activity', subTaskActivity);
            return res.send(Responses.taskSuccessResp(subTaskMessage['SUB_TASKS_FETCHED'][language ?? 'en'], resp));
        } catch (error) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(subTaskMessage['SUB_TASK_SEARCH_FAIL'][language ?? 'en'], error));
        }
    }
    async postComment(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language, user, orgId } = result.userData?.userData;
        try {
            const subtaskId = req.params.id;
            const comment = req.body.comment;
            const userNameInput=req.body.userName;
            const user = result?.userData?.userData;
            let creatorProfilePic = result?.userData?.userData?.profilePic;
            const subTaskCreatorId = result?.userData?.userData?._id;
            const name = `${user.firstName} ${user.lastName}`;
            const { value, error } = SubTaskValidation.postCommentValidation(req.body);
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            if (comment == 'null') { return res.send(Responses.taskFailResp("Comment is not allowed to be empty")); }
            const taskCollectionName = reusable.collectionName.task;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`${subtaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const subtaskCollectionName = reusable.collectionName.subTask;
            const temp = await checkCollection(subtaskCollectionName);
            if (!temp) return res.send(Responses.taskFailResp(`${subtaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            let subtask = await temp.collection(subtaskCollectionName).findOne({ _id: mongoose.Types.ObjectId(subtaskId) });
            if (!subtask) { return res.send(Responses.taskFailResp("Failed to add comment,please check subtask Id")) }
            let taskId = subtask.taskId;
            let userName=userNameInput;
            let commentCreator = {
                creatorId: subTaskCreatorId,
                creatorName: name,
                creatorProfilePic: creatorProfilePic,
            };
            let results = { taskId, subtaskId, comment,userName, commentCreator, isEdited: false, orgId: orgId };
            results.createdAt = new Date();
            results.updatedAt = new Date();
            let response = await subtaskCommentSchema.create(results);
            Logger.info({ "comment": response });
            if (response) {
                if (result.type === 'user') {
                    // To Admin
                    const message = `${name} commented on ${subtask.subTaskTitle} subtask`;
                    await NotificationService.adminCommentNotification(message, user.adminId, response.commentCreator.creatorId, { collection: 'SubTaskComment', id: response.insertedId });
                } else {
                    // To user
                    const message = `${name} commented on ${subtask.subTaskTitle} subtask`;
                    await NotificationService.adminCommentNotification(message, user._id, response.commentCreator.creatorId, { collection: 'SubTaskComment', id: response.insertedId });
                }const adminModel=`adminschemas`
                const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
                const db = await checkCollection(userCollection);
                if (response.userName) {
                    userNameInput?.map(async (ele) => {
                        const userDetails = await db.collection(userCollection).findOne({ userName: ele })
                        if (userDetails) {
                            const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${user.firstName + ' ' + user.lastName} tagged you on the comment`;;
                            await NotificationService.UserCommentNotification(message, response.commentCreator.creatorId, userDetails._id, { collection: 'ProjectComment', id: response._id });
                        }
                        const adminDetails = await db.collection(adminModel).findOne({ userName: ele })
                        if (adminDetails) {
                            const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${user.firstName + ' ' +user.lastName} tagged you on the comment`;
                            await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId, { collection: 'ProjectComment', id: response._id });
                        }
    
                    })
                }
            }
            response
                ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_ADDED'][language ?? 'en'], response))
                : res.send(Responses.taskFailResp(commentMessage['COMMENT_ADDED_FAILED'][language ?? 'en'], null));
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_ADDED_FAILED_INVALID_SUBTASK-ID'][language ?? 'en'], err));
        }
    }

    async updateComment(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language, firstName, lastName, adminId, _id } = result.userData?.userData;
        try {
            const comment_id = req.params.id;
            const comment = req.body;
            const userNameInput=req.body.userName;
            const { value, error } = SubTaskValidation.postCommentValidation(req.body);
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            if (comment == 'null') { return res.send(Responses.taskFailResp("Comment is not allowed to be empty")); }
            const isExist = await subtaskCommentSchema.findOne({ _id: comment_id })

            if (!isExist) { return res.send(Responses.taskFailResp("Invalid comment Id")) }
            let response = await subtaskCommentSchema.findOneAndUpdate(
                { _id: mongoose.Types.ObjectId(comment_id) },
                {
                    $set: {
                        comment: value?.comment,
                        isEdited: true,
                        updatedAt: new Date(),
                    },
                },
                {returnDocument:'after'}
            );
            Logger.info({ "updateComment": response });
            if (response) {
                if (result.type === 'user') {
                    // To Admin
                    const message = `${firstName + ' ' + lastName} updated comment`;
                    await NotificationService.adminCommentNotification(message, adminId, isExist.commentCreator.creatorId, { collection: 'SubTaskComment', id: response.insertedId });
                } else {
                    // To user
                    const message = `you updated comment`;
                    await NotificationService.adminCommentNotification(message, _id, isExist.commentCreator.creatorId, { collection: 'SubTaskComment', id: response.insertedId });
                }
                const adminModel=`adminschemas`;
                const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
                const db = await checkCollection(userCollection);
                if (response?.userName) {
                    userNameInput?.map(async (ele) => {
                        const userDetails = await db.collection(userCollection).findOne({ userName: ele });
                        if (userDetails) {
                            const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${firstName + ' ' + lastName} tagged you on the comment`;
                            await NotificationService.UserCommentNotification(message, response.commentCreator.creatorId, userDetails._id, { collection: 'SubTaskComment', id: response.insertedId });
                        }
                        const adminDetails = await db.collection(adminModel).findOne({ userName: ele })
                        if (adminDetails) {
                            const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${firstName + ' ' +lastName} tagged you on the comment`;
                            await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId, {collection: 'SubTaskComment', id: response.insertedId});
                        }
    
                    })
                }
            }
           return  res.send(Responses.taskSuccessResp(commentMessage['COMMENT_UPDATED'][language ?? 'en'],response))
                
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_UPDATE_FAILED_INVALID_ID'][language ?? 'en'],err.message));
        }
    }

    async getComments(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language,orgId } = result.userData?.userData;
        try {
            const subtask_id = req.query.subtask_id;
            const comment_id = req.query.comment_id;
            const subtaskCollectionName = reusable.collectionName.subTask;
            const { value, error } = SubTaskValidation.commentValidation(req.query);
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const sortBy = {};
            sortBy[reusable.orderby || 'createdAt'] = reusable.sort.toString() === 'desc' ? -1 : 1;
            const db = await checkCollection(subtaskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`${subtaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            //fetch comment based on both subtask_id and comment_id
            if (subtask_id && comment_id) {
                const isSubTaskPresent = await db.collection(subtaskCollectionName).findOne({ _id: mongoose.Types.ObjectId(subtask_id) });
                if (!isSubTaskPresent) return res.send(Responses.taskFailResp(subTaskMessage['INVALID_SUBTASK-ID'][language ?? 'en']));
                let comments = await subtaskCommentSchema.
                    find({ _id: ObjectId(req.query.comment_id), subtaskId: req.query.subtask_id })
                comments
                    ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_FETCHED'][language ?? 'en'], comments))
                    : res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en'], null));
            }
            //fetching based on subtask id
            else if (subtask_id) {
                const value = await subtaskCommentSchema.find({ subtaskId: subtask_id,orgId:orgId }).sort(sortBy).skip(skipValue).limit(limitValue)
                value.length
                    ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_FETCHED'][language ?? 'en'], value))
                    : res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en'], null));
            } else {
                //fetching based on comment id
                let response = await subtaskCommentSchema.findOne({ _id: mongoose.Types.ObjectId(comment_id) });
                response
                    ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_FETCHED'][language ?? 'en'], response))
                    : res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en'], null));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED_INVALID_SUBTASK-ID'][language ?? 'en'], err));
        }
    }

    async deleteComment(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language } = result.userData?.userData;
        try {
            const subtaskId = req?.query?.subtask_id || null;
            const commentId = req?.query?.comment_id || null;
            const { value, error } = SubTaskValidation.commentValidation(req.query);
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const subtaskCollectionName = reusable.collectionName.subTask;
            const db = await checkCollection(subtaskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`${subtaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            if (subtaskId) {
                const isSubTaskPresent = await db.collection(subtaskCollectionName).findOne({ _id: mongoose.Types.ObjectId(subtaskId) });
            }
            let response;
            if (commentId && !subtaskId) response = await subtaskCommentSchema.deleteOne({ _id: mongoose.Types.ObjectId(commentId) });
            else if (commentId && subtaskId) response = await subtaskCommentSchema.deleteMany({ subtaskId: subtaskId, _id: mongoose.Types.ObjectId(commentId) });
            else response = await subtaskCommentSchema.deleteMany({ subtaskId: subtaskId });
            response.deletedCount > 0
                ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_DELETED'][language ?? 'en'], response))
                : res.send(Responses.commentSuccessResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en']));
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_DELETED_INVALID_SUBTASK-ID'][language ?? 'en'], err));
        }
    }

    async getSubTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, orgId: organizationId, firstName: name, profilePic: profilePic, _id: Id, adminId, lastName, permission } = result.userData.userData;
        Logger.info({ "result": result });
        try {
            const { taskId } = req?.query;
            const projectId = req.query.projectId;
            const subTaskId = req?.query?.subTaskId;
            const status = req?.query?.status;
            const assignedTo = req?.query?.userId;
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            let sort = reusable.sort;
            let orderby = reusable.orderby || 'subTaskTitle';
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            let fieldValue,
                obj = {},
                fields;
            const dynamicCollection = `configviewfieldschemas`;
            const dynamicDataBase = await checkCollection(dynamicCollection);
            const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
            configFields.forEach(entry => {
                fields = entry['subTaskViewFields'];
            });
            let viewAccess = viewFields(configFields, fields, fieldValue, obj);
            const extraAccess = {
                reason: 1,
                completedDate: 1,
            };
            let totalViewAccess = { ...viewAccess, ...extraAccess };
            let filterData = [];
            filterData = Object.keys(viewAccess);
            if (orderby != 'subTaskTitle') {
                let isPresent = filterData.filter(word => orderby.includes(word));
                if (isPresent.length == 0) {
                    return res.send(Responses.subTaskFailResp('Failed to search, please check config Fields'));
                }
            }
            const taskCollectionName = reusable.collectionName.task;
            const subTaskCollectionName = reusable.collectionName.subTask;
            const userCollectionName = reusable.collectionName.user;
            const projectCollection = reusable.collectionName.project;
            const db = await checkCollection(subTaskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`${subTaskCollectionName} not present`));
            const userCollection = reusable.collectionName.user;
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
                orgId: 'GLB-BAN-001',
                createdAt: 1,
            };
            if (subTaskId) {
                let query = result.type === 'user' && permission != 'admin' ? { $or: [{ _id: ObjectId(subTaskId) }, { 'subTaskAssignedTo.id': Id }] }
                    : { _id: ObjectId(subTaskId) }
                let singleSubTask = await db
                    .collection(subTaskCollectionName)
                    .aggregate([
                        {
                            $match: query,
                        },
                        { $addFields: { task_Id: { $toObjectId: '$taskId' } } },
                        {
                            $lookup: { from: taskCollectionName, localField: 'task_Id', foreignField: '_id', as: 'task' },
                        },
                        {
                            $project: totalViewAccess,
                        },
                    ])
                    .toArray();
                await this.fetchCreator(singleSubTask, userCollectionName, db)
                let subTaskActivity = activityOfUser(`${result?.userData?.userData?.firstName + ' ' + lastName} viewed ${singleSubTask[0].subTaskTitle}subtasks`, 'SubTask', name, 'Viewed', organizationId, Id, profilePic);
                subTaskActivity['subTaskId'] = subTaskId;
                event.emit('activity', subTaskActivity);
                singleSubTask = await this.user_GroupDetails(singleSubTask, db, userCollection);
                return singleSubTask.length ? res.send(Responses.taskSuccessResp('Sub-Task fetching successful', singleSubTask)) : res.send(Responses.subTaskFailResp('Please check subtaskId'));
            } else if (taskId) {
                let query = result.type === 'user' && permission != 'admin' ? { $or: [{ taskId: taskId }, { 'assignedTo.id': Id }] }
                    : { taskId: taskId }
                if (status) {
                    if (!query.$and) query.$and = []
                    query.$and.push({ subTaskStatus: status });
                }
                if (assignedTo) {
                    if (!query.$and) query.$and = []
                    query.$and.push({ subTaskAssignedTo: { $elemMatch: { id: assignedTo } } });
                }
                const taskDetails = await db.collection(taskCollectionName).findOne({ _id: ObjectId(taskId) });
                if (!taskDetails) return res.send(Responses.subTaskFailResp('Please check TaskId'));
                let subTasks = await db
                    .collection(subTaskCollectionName)
                    .aggregate(
                        [
                            {
                                $match: query,
                            },
                            { $addFields: { task_Id: { $toObjectId: '$taskId' } } },
                            {
                                $lookup: { from: taskCollectionName, localField: 'task_Id', foreignField: '_id', as: 'task' },
                            },
                            {
                                $project: totalViewAccess,
                            },
                        ],
                        { collation: { locale: 'en', caseFirst: 'upper' } }
                    )
                    .sort(sortBy)
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();
                let subTaskCounts = await db.collection(subTaskCollectionName).aggregate([{ $match: query }]).toArray();
                await this.fetchCreator(subTasks, userCollectionName, db)
                let subTaskActivity = activityOfUser(`${result?.userData?.userData?.firstName + ' ' + lastName} viewed subtasks under ${taskDetails.taskTitle} task`, 'SubTask', name, 'Viewed', organizationId, Id, profilePic);
                subTaskActivity['taskId'] = taskId;
                event.emit('activity', subTaskActivity);
                subTasks = await this.user_GroupDetails(subTasks, db, userCollectionName);
                let data = { subTaskCount: subTaskCounts?.length, skip: skipValue, subTasks: subTasks };
                return res.send(Responses.taskSuccessResp('Sub-Task fetching successful', data));
            } else {
                let query = result.type === 'user' && permission != 'admin' ? { $or: [{ 'subTaskCreator.id': Id }, { 'subTaskAssignedTo.id': Id }] }
                    : {}
                if (projectId) {
                    if (!query.$and) query.$and = []
                    query.$and.push({ projectId: projectId });
                }
                if (status) {
                    if (!query.$and) query.$and = []
                    query.$and.push({ subTaskStatus: status });
                }
                if (assignedTo) {
                    if (!query.$and) query.$and = []
                    query.$and.push({ subTaskAssignedTo: { $elemMatch: { id: assignedTo } } });
                }

                let allSubTasks = await db
                    .collection(subTaskCollectionName)
                    .aggregate(
                        [
                            {
                                $match: query,
                            },
                            { $addFields: { task_Id: { $toObjectId: '$taskId' } } },
                            {
                                $lookup: { from: taskCollectionName, localField: 'task_Id', foreignField: '_id', as: 'task' },
                            },
                            {
                                $project: totalViewAccess,
                            },
                        ],
                        { collation: { locale: 'en', caseFirst: 'upper' } }
                    )
                    .sort(sortBy)
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();
                let subTaskCounts = await db.collection(subTaskCollectionName).aggregate([{ $match: query }]).toArray();
                await this.fetchCreator(allSubTasks, userCollectionName, db)
                let subTaskActivity = activityOfUser(`${result?.userData?.userData?.firstName + ' ' + lastName} viewed all subtasks `, 'SubTask', name, 'Viewed', organizationId, Id, profilePic);
                event.emit('activity', subTaskActivity);
                allSubTasks = await this.user_GroupDetails(allSubTasks, db, userCollectionName);
                let data = { subTaskCount: subTaskCounts?.length, skip: skipValue, subTasks: allSubTasks };
                return res.send(Responses.taskSuccessResp('Sub-Task fetching successful', data));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.subTaskFailResp('Failed to fetch sub-tasks', err.message));
        }
    }

    async user_GroupDetails(response, db, userCollection) {
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
            };
            const groupObj = {
                _id: 1,
                adminId: 1,
                groupName: 1,
                groupDescription: 1,
                groupLogo: 1,
                assignedMembers: 1,
                createdAt: 1,
            };
            for (const [idx, subtask] of response.entries()) {
                if (subtask.subTaskAssignedTo?.length) {
                    let users = [];
                    for (const [index, user] of subtask.subTaskAssignedTo.entries()) {
                        const userDetails = await db
                            .collection(userCollection)
                            .aggregate([
                                {
                                    $match: { _id: ObjectId(user.id) },
                                },
                                {
                                    $project: userObj,
                                },
                            ])
                            .toArray();
                        if (userDetails.length) users.push(userDetails[0]);
                    }
                    subtask.subTaskAssignedTo = users;
                }
                if (subtask?.group?.length) {
                    for (const [index, value] of subtask.group.entries()) {
                        const groupDetails = await GroupSchema.aggregate([
                            { $match: { _id: ObjectId(value.groupId) } },
                            {
                                $project: groupObj,
                            },
                        ]);
                        if (groupDetails.length) {
                            subtask.group[index] = groupDetails[0];
                            let users = [];
                            for (const user of subtask.group[index].assignedMembers) {
                                const userDetails = await db
                                    .collection(userCollection)
                                    .aggregate([
                                        {
                                            $match: { _id: ObjectId(user.userId) },
                                        },
                                        {
                                            $project: userObj,
                                        },
                                    ])
                                    .toArray();
                                users.push(userDetails[0]);
                            }
                            subtask.group[index].assignedMembers = users;
                        }
                    }
                }
            }
            return response;
        } catch (err) {
            Logger.error({ "err": err });
        }
    }

    async deleteMultipleSubTask(req, res) {
        const result = req.verified;
        const reusable = new Reuse(req);
        const { firstName: userName, adminId: Id, _id: userId, profilePic: userProfilePic, orgId: organizationId, language: language } = result.userData?.userData;
        try {
            const data = req?.body;
            const SubTaskId = data.SubTaskId;
            const { value, error } = SubTaskValidation.deleteMultiple(data);
            if (error) {
                Logger.error(error);
                return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            }
            const subTaskCollection = reusable.collectionName.subTask;
            const subTaskCommentCollection = reusable.collectionName.subTaskComment;
            const db = await checkCollection(subTaskCollection);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${subTaskCollection} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));

            let exist = [];
            let notExist = [];

            for (const ele of SubTaskId) {
                const userData = await db
                    .collection(subTaskCollection)
                    .aggregate([{ $match: { _id: ObjectId(ele.id), subTaskStatus: { $eq: 'Done' } } }])
                    .toArray();
                userData.length == 0 ? notExist.push({ id: ele.id }) : exist.push({ id: ele.id });
            }
            if (notExist.length > 0 && exist.length == 0) {
                return res.status(400).send(Responses.taskFailResp('SubTask is not present/Incomplete for the given Id, please check the ID', notExist));
            }
            if (notExist.length == 0 && exist.length == 0) {
                return res.status(400).send(Responses.taskFailResp('Please provide valid subTask Id'));
            }
            let response = 0;
            if (exist.length > 0) {
                for (const ele of exist) {
                    let count = await db.collection(subTaskCollection).deleteMany({ _id: ObjectId(ele.id) });
                    await db.collection(subTaskCommentCollection).deleteMany({ subtask_id: ele.id.toString() });
                    if (count.deletedCount) {
                        response++;
                    }
                }
            }
            return res.status(200).send(Responses.taskSuccessResp(subTaskMessage['SUB_TASKS_DELETED'][language ?? 'en'], { deletedCount: response, deletedSubTasks: exist }));
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.status(400).send(Responses.taskFailResp(subTaskMessage['SUB_TASKS_NOT_DELETED'][language ?? 'en']));
        }
    }
    async fetchCreator(subtasks, collectionName, db) {

        for (const subtask of subtasks) {
            subtask.subTaskCreator = await creatorDetails(subtask.subTaskCreator, collectionName, db);
            if (subtask?.project?.length) {
                subtask.project[0].projectCreatedBy = await creatorDetails(subtask.project[0].projectCreatedBy, collectionName, db);
            }
            if (subtask?.task?.length) {
                subtask.task[0].taskCreator = await creatorDetails(subtask.task[0].taskCreator, collectionName, db);
            }
        }
    }
    async filterSubTask(req, res, next) {
        const result = req.verified;
        const reusable = new Reuse(req);
        const {
          _id: userId,
          orgId: organizationId,
          language = 'en',
        } = result.userData?.userData || {};
      
        const subTaskCollection = reusable.collectionName.subTask;
        const skip = req.query.skip || 0;
        const limit = req.query.limit || 10;
        const filter = req.query.filter;
        const projectId = req.query.projectId;
        let search = req.query.search;
               
      
        try {
          let match = {projectId}; // Always filter by orgId



          if(filter !== "OverDueTask"&& filter !== "pendingTask"){

            let searchFilter = {};
            if (search) {
                let regex = new RegExp(search, 'i'); // case-insensitive
                searchFilter = {
                    $or: [
                        { projectName: regex },
                        { subTaskStageName: regex },
                        { subTaskCategory: regex },
                        { subTaskTitle: regex },
                        { subTaskDetails: regex },
                        { permission: regex },
                        { priority: regex },
                        { taskStatus: regex },
                    ]
                };
            }
      
          if (filter === "completedSubtask") {
            match.subTaskStatus = "Done";
          } else if (filter === "pendingSubtask") {
            match.subTaskStatus = "Todo";
          } else if (filter === "OverDueSubTask") {
            match.subTaskStatus = { $ne: "Done" };
            match.dueDate = { $lt: new Date() };
          }
          console.log(match,'match');
          const pipeline = [
            { $match: {...match,...searchFilter}},
            {
              $facet: {
                subTaskData: [
                  { $sort: { dueDate: -1 } }, // You can change sort field if needed
                  { $skip: skip },
                  { $limit: limit }
                ],
                totalCount: [
                  { $count: "count" }
                ]
              }
            }
          ];

          const db = await checkCollection(subTaskCollection);
          const [resultData] = await db
            .collection(subTaskCollection)
            .aggregate(pipeline, { allowDiskUse: true }) // allowDiskUse handles large datasets better
            .toArray();
          const subTaskData = resultData.subTaskData || [];
          const totalCount = resultData.totalCount[0]?.count || 0;
      
          return res.status(200).send(
            Responses.taskSuccessResp(
              "Subtask List fetched successfully.",
              { totalCount,subTaskData }
            )
          );
        }else if(filter !== "OverDueTask"){

            let searchFilter = {};
            if (search) {
                let regex = new RegExp(search, 'i'); // case-insensitive
                searchFilter = {
                    $or: [
                        { projectName: regex },
                        { stageName: regex },
                        { category: regex },
                        { taskTitle: regex },
                        { taskType: regex },
                        { taskDetails: regex },
                        { priority: regex },
                        { taskStatus: regex },
                    ]
                };
            }

            const TaskCollection = reusable.collectionName.task;
            const pipeline = [
                { $match: {
                    projectId,
                    taskStatus:{$ne: "Done"},
                    dueDate:{$lt: new Date()},
                    ...searchFilter
                },  
                },
                {
                  $facet: {
                    subTaskData: [
                      { $sort: { dueDate: -1 } }, // You can change sort field if needed
                      { $skip: skip },
                      { $limit: limit }
                    ],
                    totalCount: [
                      { $count: "count" }
                    ]
                  }
                }
              ];
            const db = await checkCollection(TaskCollection);
            const [resultData] = await db
              .collection(TaskCollection)
              .aggregate(pipeline, { allowDiskUse: true }) // allowDiskUse handles large datasets better
              .toArray();
            const subTaskData = resultData.subTaskData || [];
            const totalCount = resultData.totalCount[0]?.count || 0;
        
            return res.status(200).send(
              Responses.taskSuccessResp(
                "Task List fetched successfully.",
                { totalCount,subTaskData }
              )
            );
        }else if(filter !== "pendingTask"){
            let searchFilter = {};
            if (search) {
                let regex = new RegExp(search, 'i'); // case-insensitive
                searchFilter = {
                    $or: [
                        { projectName: regex },
                        { stageName: regex },
                        { category: regex },
                        { taskTitle: regex },
                        { taskType: regex },
                        { taskDetails: regex },
                        { priority: regex },
                        { taskStatus: regex },
                    ]
                };
            }
            const TaskCollection = reusable.collectionName.task;
            const pipeline = [
                { $match: {
                    projectId,
                    taskStatus:{$ne: "Done"},
                    dueDate:{$lt: new Date()},
                    ...searchFilter
                },  
                },
                {
                  $facet: {
                    subTaskData: [
                      { $sort: { dueDate: -1 } }, // You can change sort field if needed
                      { $skip: skip },
                      { $limit: limit }
                    ],
                    totalCount: [
                      { $count: "count" }
                    ]
                  }
                }
              ];
            const db = await checkCollection(TaskCollection);
            const [resultData] = await db
              .collection(TaskCollection)
              .aggregate(pipeline, { allowDiskUse: true }) // allowDiskUse handles large datasets better
              .toArray();
            const subTaskData = resultData.subTaskData || [];
            const totalCount = resultData.totalCount[0]?.count || 0;
        
            return res.status(200).send(
              Responses.taskSuccessResp(
                "Task List fetched successfully.",
                { totalCount,subTaskData }
              )
            );
        }
      
        } catch (err) {
          Logger.error(`filterSubTask error: ${err}`);
          return res.status(400).send(
            Responses.taskFailResp('Failed to fetch Subtask.')
          );
        }
      }
      
}
export default new SubTaskService();
