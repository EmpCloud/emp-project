import Responses from '../../response/response.js';
import TaskValidation from './task.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import { ObjectId } from 'mongodb';
import { activityOfUser } from '../../utils/activity.utils.js';
import { commonMessage, taskMessage, commentMessage } from '../language/language.translator.js';
import config from 'config';
import GroupSchema from '../schema/group.model.js';
import { configTaskFieldsAdd } from '../../utils/customFields.utils.js';
import Reuse from '../../utils/reuse.js';
import taskComment from './task.comment.js';
import subTaskCommentSchema from '../subTask/subtask.comment.schema.js';
import permissionModel from '../schema/permission.model.js'
import { calculateTaskProgress } from '../../utils/common.utils.js'
import {
    checkCollection,
    insertAndReturnData,
    countAllDocumentsQuery,
    findByIdQuery,
    isItemExists,
    addNewDynamicFields,
    getFieldExist,
    removeObjectNull,
    viewFields,
    subtractAndFormat,
    creatorDetails,
} from '../../utils/common.utils.js';
import stageSchema from '../taskStage/taskStage.model.js'
import statusSchema from '../taskStatus/taskStatus.model.js'
import typeSchema from '../taskType/taskType.model.js'
import NotificationService from '../notifications/notifications.service.js';
import event from '../event/event.emitter.js';
import activityModel from '../schema/activity.model.js';
import { getPermissions } from '../../utils/common.utils.js';
import moment from 'moment';
class TaskService {
    //Function to Create task
    async createTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const {
            _id: taskCreatorId,
            firstName: taskCreatorName,
            lastName: taskCreatorLastName,
            profilePic: taskCreatorProfilePic,
            planData: planTask,
            language: language,
            orgId: organizationId,
            adminId,
            isAdmin,
            creatorId
        } = result?.userData?.userData;
        Logger.info(`result: ${JSON.stringify(result)}`);
        try {
            const task = req.body;
            const customFields = await configTaskFieldsAdd(organizationId, task, res, language);
            if (customFields.Error) {
                return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], customFields.Error));
            } else {
                const { value, error } = TaskValidation.createTask(task);
                if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
                addNewDynamicFields(value, customFields.obj);
                Logger.info({ "task": value });
                const taskCreator = {
                    id: taskCreatorId,
                    isAdmin: isAdmin
                    //firstName: taskCreatorName,
                    //lastName: taskCreatorLastName,
                    //profilePic: taskCreatorProfilePic,
                };
                value.taskCreator = taskCreator;
                if (!value.assignedTo) value.assignedTo = [];
                const { projectId, taskTitle, stageName, taskType, taskStatus } = value;
                const taskCollectionName = reusable.collectionName.task;
                let adminModel=`adminschemas`;
                // const admindb=await checkCollection(adminModel)
                const db = await checkCollection(taskCollectionName);
                if (!db) return res.send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const projectCollectionName = reusable.collectionName.project;
                const projectDb = await checkCollection(projectCollectionName);
                if (!projectDb) return res.send(Responses.taskFailResp(`Project ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const presentTask = await db.collection(taskCollectionName).find({}).toArray();
                const userCollection = reusable.collectionName.user;
                let user,admin;
                presentTask.map(async(ele)=>{
                    user = await db.collection(adminModel).findOne({ _id:ObjectId(ele.taskCreator.id) })
                    if (user) { 
                       await db.collection(taskCollectionName).findOneAndUpdate({_id:ObjectId(ele._id)},{$set:{"taskCreator.isAdmin":user?.isAdmin}},{returnDocument: 'after'})
                     } else {
                        admin = await db.collection(userCollection).findOne({ _id: ObjectId(ele.taskCreator.id) });
                       await db.collection(taskCollectionName).findOneAndUpdate({_id:ObjectId(ele._id)},{$set:{"taskCreator.isAdmin":admin?.isAdmin}},{returnDocument: 'after'})
                        
                    }
                })
                presentTask.map(async (assign)=>{
                    assign?.assignedTo?.map(async (ele)=>{

                        // let adminModel=`adminschemas`;
                        user = await db.collection(adminModel).findOne({ _id: ObjectId(ele?.id) })
                        if (user) { 
                            await db.collection(taskCollectionName).findOneAndUpdate({_id:ObjectId(assign._id)},{$set:{"assignedTo.$[].isAdmin":user?.isAdmin}},{returnDocument: 'after'})
                         } else {
                            admin = await db.collection(userCollection).findOne({ _id: ObjectId(ele.id) });
                            await db.collection(taskCollectionName).findOneAndUpdate({_id:ObjectId(assign._id)},{$set:{"assignedTo.$[].isAdmin":admin?.isAdmin}},{returnDocument: 'after'})
                            
                        }
                    })

                })
                if (presentTask.length == planTask.taskFeatureCount) {
                    return res.status(429).send(Responses.taskFailResp(taskMessage['TASK_PLAN_LIMIT'][language ?? 'en']));
                }
                if (stageName) {
                    let exist = await stageSchema.find({ adminId: adminId, taskStage: stageName })
                    if (!exist) {
                        return res.send(Responses.taskFailResp(`Task ${taskMessage['TASK_STAGE_NOT_FOUND'][language ?? 'en']}`));
                    }
                }
                if (taskType) {
                    let exist = await typeSchema.find({ adminId: adminId, taskType: taskType })
                    if (!exist) {
                        return res.send(Responses.taskFailResp(`Task ${taskMessage['TASK_TYPE_NOT_FOUND'][language ?? 'en']}`));
                    }
                }
                if (taskStatus) {
                    let exist = await statusSchema.find({ adminId: adminId, taskStatus: taskStatus })
                    if (!exist) {
                        return res.send(Responses.taskFailResp(`Task ${taskMessage['TASK_STATUS_NOT_FOUND'][language ?? 'en']}`));
                    }
                }
                //if projectId is given
                if (projectId) {
                    const project = await projectDb.collection(projectCollectionName).findOne({ _id: ObjectId(projectId) })
                    //check project is present or not
                    if (!project) return res.send(Responses.taskFailResp(commonMessage['PROJECT_ID_NOT_PRESENT'][language ?? 'en']));

                    if (project.status == 'Done') {
                        return res.send(Responses.taskFailResp(taskMessage['ENABLE_TO_CREATE_TASK'][language ?? 'en']));
                    }
                    Logger.info(`isProjectPresent: ${JSON.stringify(project)} `);
                    value.projectName = project.projectName;
                    value.projectCode = project.projectCode;
                    value.standAloneTask = false;
                    const queryCondition = { taskTitle, projectId };
                    const isTaskPresentForProject = await isItemExists(db, taskCollectionName, queryCondition);
                    //Check for task under project if already present
                    if (isTaskPresentForProject) {
                        Logger.info({ "isTaskPresentForProject": isTaskPresentForProject });
                        return res.send(Responses.taskDuplicateErrorResp(taskMessage['TASK_ALREADY_PRESENT'][language ?? 'en']));
                    }
                }
                const queryCondition = { taskTitle, standAloneTask: true };
                const isTaskPresent = await isItemExists(db, taskCollectionName, queryCondition);
                //Check for standalone task if already present
                if (isTaskPresent) {
                    Logger.info({ "isTaskPresent": isTaskPresent });
                    return res.send(Responses.taskDuplicateErrorResp(taskMessage['TASK_ALREADY_PRESENT'][language ?? 'en']));
                }
                
                if (value.assignedTo.length) {
                    //checking each user assigned with task
                    for (const [index, user] of value.assignedTo.entries()) {
                        const userCheck = await db.collection(userCollection).findOne({ _id: ObjectId(user.id) });
                        user.isAdmin=userCheck?.isAdmin
                        //check for soft deleted user
                        if (!userCheck || userCheck?.softDeleted) return res.send(Responses.taskFailResp(commonMessage['USER_NOT_FOUND'][language ?? 'en']));
                        if (userCheck.invitation != 1) return res.send(Responses.taskFailResp('Unable to assign user,please check invitation status of the user.'));
                        //if (userCheck.isSuspended === false) return res.send(Responses.taskFailResp('Unable to assign user,user is suspended.'));
                    }
                    if (process.env.node_env !== 'localDev') {
                        event.emit('mail', value, reusable, db)
                    }
                }
                if (value.group?.length) {
                    for (const [index, group] of value?.group.entries()) {
                        const groupCheck = await GroupSchema.findById({ _id: ObjectId(group.groupId) });
                        if (!groupCheck) return res.send(Responses.taskFailResp(taskMessage['GROUP_NOT_FOUND'][language ?? 'en'], group.id));
                    }
                }
                if (value?.actualHours == '' || value?.actualHours == null) {
                    value.actualHours = '00:00';
                }
                if (value?.estimationTime && value?.actualHours) {
                    if (value.actualHours <= value.estimationTime) {
                        value.remainingHours = subtractAndFormat(value.estimationTime, value.actualHours);
                    } else {
                        value.exceededHours = subtractAndFormat(value.actualHours, value.estimationTime);
                        value.remainingHours = '00:00';
                    }
                }
                let response = await insertAndReturnData(db, taskCollectionName, value);
                if (response.projectId) {
                    let progress = await calculateTaskProgress(db, taskCollectionName, projectId)
                    let status = progress < 100 ? 'Inprogress' : 'Done';
                    event.emit('ProjectProgress', projectDb, projectCollectionName, progress, status, projectId);
                }
                let taskActivity = activityOfUser(
                    ` ${result?.userData?.userData?.firstName + ' ' + result?.userData?.userData?.lastName} created ${taskTitle} task `,
                    'Task',
                    taskCreatorName,
                    'Created',
                    organizationId,
                    taskCreatorId,
                    taskCreatorProfilePic
                );
                taskActivity['taskId'] = response._id.toString();
                if (projectId) {
                    taskActivity['projectId'] = `${projectId}`;
                }
                event.emit('activity', taskActivity);
                const totalTask = await db.collection(taskCollectionName).countDocuments({});
                const remainingTasks = planTask.taskFeatureCount - totalTask;
                // Notification
                if (result.type === 'user') {
                    // To Admin
                    const message = `Created task ${taskTitle}`;
                    await NotificationService.adminNotification(message, adminId, taskCreatorId, { collection: 'Task', id: response._id.toString() });
                    if (adminId != creatorId && taskCreatorId != creatorId) {
                        await NotificationService.userNotification(message, taskCreatorId, creatorId, { collection: 'Task', id: response._id.toString() });
                    }
                }
                // To Users
                if (value?.assignedTo?.length) {
                    for (const user of value?.assignedTo) {
                        const message = `Assigned you task ${taskTitle}`;
                        await NotificationService.userNotification(message, taskCreatorId, user.id, { collection: 'Task', id: response._id.toString() });
                    }
                }
                Logger.info({ "response": response });
                return res.send(Responses.taskSuccessResp(taskMessage['TASK_CREATED'][language ?? 'en'], { totalCreatedTask: totalTask, remainingTasks: remainingTasks, taskData: response }));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(taskMessage['TASK_NOT_CREATED'][language ?? 'en']));
        }
    }

    //Get all tasks based on adminId and projectId
    async getTasks(req, res, next) {

        const reusable = new Reuse(req);
        const result = req.verified;
        const { _id: Id, firstName: Name, profilePic, language, orgId: organizationId, adminId, lastName, permission } = result?.userData?.userData;
        let permissions = await getPermissions(organizationId,permission);
        let managerLevelPermission = permissions?.permissionConfig?.otherTask?.view; 

        const skipValue = reusable.skip;
        const limitValue = reusable.limit;
        let sort = reusable.sort;
        let orderby = reusable.orderby || 'taskTitle';
        const sortBy = {};
        sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
        let standAloneTask = req?.query?.standAloneTask ? req?.query?.standAloneTask : null;
        Logger.info({ "result": result });
        try {
            let projectId = req.query.projectId;
            let CreatedDate = req.query.CreatedDate;
            let UpdatedDate = req.query.UpdatedDate;
            let taskId = req.query.Id;
            let fieldValue,
                obj = {},
                fields;
            const dynamicCollection = `configviewfieldschemas`;
            const dynamicDataBase = await checkCollection(dynamicCollection);
            const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
            configFields.forEach(entry => {
                fields = entry['taskViewFields'];
            });
            let viewAccess = viewFields(configFields, fields, fieldValue, obj);
            const extraAccess = {
                projectName: 1,
                projectCode: 1,
                projectLogo: 1,
                progress: 1,
                reason: 1,
                completedDate: 1
            };
            let totalViewAccess = { ...viewAccess, ...extraAccess };
            Logger.info({ "viewAccess": viewAccess });
            let filterData = [];
            filterData = Object.keys(viewAccess);
            if (orderby != 'taskTitle') {
                let isPresented = filterData.filter(word => orderby.includes(word));
                if (isPresented.length == 0) {
                    return res.send(Response.projectFailResp('Failed to search, please check config Fields'));
                }
            }

            const { value, error } = TaskValidation.getTaskValidation({ projectId, taskId });
            if (error) {
                return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            }
            const taskCollectionName = reusable.collectionName.task;
            const subTaskCol = reusable.collectionName.subTask;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const projectCollectionName = reusable.collectionName.project;
            const projectdb = await checkCollection(projectCollectionName);
            if (projectId && !projectdb) return res.status(400).send(Responses.taskFailResp(`Project ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            //if both projectid and taskId is present based on taskId fetching data
            const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            if (projectId && taskId) {
                let query;

                if (result.type === 'user' && permission !== 'admin') {
                  const conditions = [
                    { projectId: projectId },
                    { _id: ObjectId(taskId) }
                  ];
                
                  if (managerLevelPermission === false) {
                    conditions.push({ 'assignedTo.id': Id });
                  }
                
                  query = { $and: conditions };
                } else {
                  query = {
                    projectId: projectId,
                    _id: ObjectId(taskId)
                  };
                }
                let response = await db
                    .collection(taskCollectionName)
                    .aggregate([
                        {
                            $match: query,
                        },
                        { $addFields: { project_Id: { $toObjectId: '$projectId' }, taskId: { $toString: '$_id' } } },
                        {
                            $lookup: { from: projectCollectionName, localField: 'project_Id', foreignField: '_id', as: 'project' },
                        },
                        {
                            $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                        },
                        {
                            $project: totalViewAccess,
                        },
                    ])
                    .toArray();
                await this.fetchCreator(response, reusable.collectionName.user, db);
                response = await this.calculateProgressForTask(db, response, subTaskCol, result, permission, Id);
                response = await this.user_GroupDetails(response, db, userCollection);
                let taskActivity = activityOfUser(` ${Name + ' ' + lastName} viewed ${response[0].taskTitle} task`, 'Task', Name, 'Viewed', organizationId, Id, profilePic);
                taskActivity['taskId'] = taskId;
                if (projectId) {
                    taskActivity['projectId'] = `${projectId}`;
                }
                event.emit('activity', taskActivity);
                response.length
                    ? res.send(Responses.taskSuccessResp(taskMessage['TASK_FETCHED'][language ?? 'en'], response))
                    : res.send(Responses.taskFailResp(taskMessage['TASK_FETCHING_FAILED'][language ?? 'en']));
            } else if (!projectId && !taskId) {
                let allTasks, query = {};
                if (standAloneTask) query = { $and: [{ 'standAloneTask': JSON.parse(standAloneTask) }] }
                if (standAloneTask && CreatedDate || UpdatedDate) {
                    if (CreatedDate) {
                        query = {
                            $and: [{ 'standAloneTask': JSON.parse(standAloneTask) }, {
                                createdAt: {
                                    $gte: new Date(CreatedDate),
                                    $lt: new Date(new Date(CreatedDate).setHours(23, 59, 59, 999)),
                                }
                            }]
                        }
                    }
                    if (UpdatedDate) {
                        query = {
                            $and: [{ 'standAloneTask': JSON.parse(standAloneTask) }, {
                                updatedAt: {
                                    $gte: new Date(UpdatedDate),
                                    $lt: new Date(new Date(UpdatedDate).setHours(23, 59, 59, 999)),
                                }
                            }]
                        }
                    }

                }
                if (!standAloneTask && CreatedDate) query = {
                    $and: [{
                        createdAt: {
                            $gte: new Date(CreatedDate),
                            $lt: new Date(new Date(CreatedDate).setHours(23, 59, 59, 999)),
                        }
                    }]
                }
                if (!standAloneTask && UpdatedDate) query = {
                    $and: [{
                        updatedAt: {
                            $gte: new Date(UpdatedDate),
                            $lt: new Date(new Date(UpdatedDate).setHours(23, 59, 59, 999)),
                        }
                    }]
                }
                if (result.type === 'user' && permission != 'admin') {
                    if (managerLevelPermission===false) {
                      query.$or = [{ 'taskCreator.id': Id }, { 'assignedTo.id': Id }];
                    } 
                  } else {
                    query.$or = [
                      { 'taskCreator.id': adminId },
                      { 'taskCreator.id': { $ne: adminId } }
                    ];
                  }
                  
                allTasks = await db
                    .collection(taskCollectionName)
                    .aggregate(
                        [
                            { $match: query },
                            {
                                $addFields: {
                                    taskId: { $toString: '$_id' },
                                },
                            },
                            {
                                $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                            },
                            {
                                $project: totalViewAccess,
                            },
                        ],
                        { collation: { locale: "en", numericOrdering: true } }
                    )
                    .sort(sortBy)
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();
                    if (result.type === 'user' && permission !== 'admin') {
                        if (managerLevelPermission) {
                          allTasks = await Promise.all(
                            allTasks.map(async (ele) => {
                              const Tasks = await db
                                .collection(reusable.collectionName.subTask)
                                .aggregate([
                                  {
                                    $match: {
                                      $or: [
                                        { 'subTaskAssignedTo.id': Id },
                                        { 'subTaskCreator.id': Id }
                                      ],
                                      taskId: ele._id.toString()
                                    }
                                  }
                                ])
                                .toArray();
                      
                              ele.subTasks = Tasks;
                              return ele;
                            })
                          );
                        } else {
                          // If no manager-level permission, optionally skip subTasks or filter by orgId
                          allTasks = await Promise.all(
                            allTasks.map(async (ele) => {
                              const Tasks = await db
                                .collection(reusable.collectionName.subTask)
                                .aggregate([
                                  {
                                    $match: {
                                      taskId: ele._id.toString()
                                    }
                                  }
                                ])
                                .toArray();
                      
                              ele.subTasks = Tasks;
                              return ele;
                            })
                          );
                        }
                      }
                      
                let totalTasks = await db.collection(taskCollectionName).aggregate([{
                    $match: query,
                },]).toArray();
                await this.fetchCreator(allTasks, reusable.collectionName.user, db);
                allTasks = await this.calculateProgressForTask(db, allTasks, subTaskCol,result,permission, Id);

                allTasks = await this.user_GroupDetails(allTasks, db, userCollection);
                let taskActivity = activityOfUser(` ${Name + ' ' + lastName} viewed all tasks`, 'Task', Name, 'Viewed', organizationId, Id, profilePic);
                event.emit('activity', taskActivity);
                let data = { taskCount: totalTasks?.length, skip: skipValue, tasks: allTasks };
                res.send(Responses.taskSuccessResp(taskMessage['TASK_FETCHED'][language ?? 'en'], data));
            } else if (projectId) {

                let query;
                if (CreatedDate) {
                    if (result.type === 'user' && permission !== 'admin') {
                        if (managerLevelPermission) {
                          query = {
                            $and: [
                              {
                                createdAt: {
                                  $gte: new Date(CreatedDate),
                                  $lt: new Date(new Date(CreatedDate).setHours(23, 59, 59, 999)),
                                }
                              },
                              { projectId: projectId }
                            ]
                          };
                        } else {
                          query = {
                            $and: [
                              {
                                createdAt: {
                                  $gte: new Date(CreatedDate),
                                  $lt: new Date(new Date(CreatedDate).setHours(23, 59, 59, 999)),
                                }
                              },
                              {
                                $or: [
                                  { projectId: projectId, 'assignedTo.id': Id },
                                  { projectId: projectId, 'projectCreatedBy.id': Id },
                                  { projectId: projectId, 'taskCreator.id': Id }
                                ]
                              }
                            ]
                          };
                        }
                      } else {
                        query = {
                          $and: [
                            { projectId: projectId },
                            {
                              createdAt: {
                                $gte: new Date(CreatedDate),
                                $lt: new Date(new Date(CreatedDate).setHours(23, 59, 59, 999)),
                              }
                            }
                          ]
                        };
                      }
                      
                }
                else if (UpdatedDate) {
                    if (result.type === 'user' && permission !== 'admin') {
                        if (managerLevelPermission) {
                          query = {
                            $and: [
                              {
                                updatedAt: {
                                  $gte: new Date(UpdatedDate),
                                  $lt: new Date(new Date(UpdatedDate).setHours(23, 59, 59, 999)),
                                }
                              },
                              { projectId: projectId }
                            ]
                          };
                        } else {
                          query = {
                            $and: [
                              {
                                updatedAt: {
                                  $gte: new Date(UpdatedDate),
                                  $lt: new Date(new Date(UpdatedDate).setHours(23, 59, 59, 999)),
                                }
                              },
                              {
                                $or: [
                                  { projectId: projectId, 'assignedTo.id': Id },
                                  { projectId: projectId, 'projectCreatedBy.id': Id },
                                  { projectId: projectId, 'taskCreator.id': Id }
                                ]
                              }
                            ]
                          };
                        }
                      } else {
                        query = {
                          $and: [
                            { projectId: projectId },
                            {
                              updatedAt: {
                                $gte: new Date(UpdatedDate),
                                $lt: new Date(new Date(UpdatedDate).setHours(23, 59, 59, 999)),
                              }
                            }
                          ]
                        };
                      }
                      
                }
                else {
                    query = result.type === 'user' && permission !== 'admin'
                    ? (managerLevelPermission
                        ? { projectId: projectId }
                        : {
                            $or: [
                                { projectId: projectId, 'assignedTo.id': Id },
                                { projectId: projectId, 'projectCreatedBy.id': Id },
                                { projectId: projectId, 'taskCreator.id': Id }
                            ]
                            })
                    : { projectId: projectId };

                }
                let projectDetails = await projectdb
                    .collection(projectCollectionName)
                    .find({ _id: ObjectId(projectId) })
                    .toArray();
                if (projectDetails.length) {
                    let tasktotalCount = await db.collection(taskCollectionName).countDocuments({ projectId: projectId })
                    let response = await db
                        .collection(taskCollectionName)
                        .aggregate(
                            [
                                {
                                    $match: query,
                                },
                                { $addFields: { project_Id: { $toObjectId: '$projectId' }, taskId: { $toString: '$_id' } } },
                                {
                                    $lookup: { from: projectCollectionName, localField: 'project_Id', foreignField: '_id', as: 'project' },
                                },
                                {
                                    $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                                },
                                {
                                    $project: totalViewAccess,
                                },
                            ],
                            { collation: { locale: "en", numericOrdering: true } }
                        )
                        .sort(sortBy)
                        .skip(skipValue)
                        .limit(limitValue)
                        .toArray();
                    await this.fetchCreator(response, reusable.collectionName.user, db);
                    response = await this.calculateProgressForTask(db, response, subTaskCol, result, permission, Id);
                    response = await this.user_GroupDetails(response, db, userCollection);

                    let data = { taskCount: tasktotalCount, skip: skipValue, tasks: response };
                    let taskActivity = activityOfUser(` ${Name + ' ' + lastName} viewed tasks under ${projectDetails[0].projectName} project`, 'Task', Name, 'Viewed', organizationId, Id, profilePic);
                    taskActivity['projectId'] = `${projectId}`;
                    event.emit('activity', taskActivity);
                    return res.send(Responses.taskSuccessResp(taskMessage['TASK_FETCHED'][language ?? 'en'], data));
                } else return res.send(Responses.taskFailResp(commonMessage['PROJECT_ID_NOT_PRESENT'][language ?? 'en']));
            } else {
                let query = result.type === 'user' && permission !== 'admin'
                ? (managerLevelPermission
                    ? { _id: ObjectId(req.query.Id) }
                    : {
                        $and: [
                            { _id: ObjectId(req.query.Id) },
                            {
                            $or: [
                                { 'assignedTo.id': Id },
                                { 'taskCreator.id': Id }
                            ]
                            }
                        ]
                        })
                : { _id: ObjectId(req.query.Id) };
                let response = await db
                    .collection(taskCollectionName)
                    .aggregate([
                        {
                            $match: query,
                        },
                        { $addFields: { taskId: { $toString: '$_id' } } },
                        {
                            $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                        },
                        {
                            $project: totalViewAccess,
                        },
                    ])
                    .toArray();
                    if (result.type === 'user' && permission !== 'admin') {
                        if (managerLevelPermission) {
                          // Manager-level user: include all subTasks for their assigned tasks
                          response = await Promise.all(response.map(async (ele) => {
                            const Tasks = await db.collection(reusable.collectionName.subTask).aggregate([
                              {
                                $match: {
                                  taskId: ele._id.toString()
                                }
                              }
                            ]).toArray();
                      
                            ele.subTasks = Tasks;
                            return ele;
                          }));
                        } else {
                          // Regular user: only include subTasks they created or are assigned to
                          response = await Promise.all(response.map(async (ele) => {
                            const Tasks = await db.collection(reusable.collectionName.subTask).aggregate([
                              {
                                $match: {
                                  $or: [
                                    { 'subTaskAssignedTo.id': Id },
                                    { 'subTaskCreator.id': Id }
                                  ],
                                  taskId: ele._id.toString()
                                }
                              }
                            ]).toArray();
                      
                            ele.subTasks = Tasks;
                            return ele;
                          }));
                        }
                      }
                      
                await this.fetchCreator(response, reusable.collectionName.user, db);
                response = await this.calculateProgressForTask(db, response, subTaskCol, result, permission,Id);
                response = await this.user_GroupDetails(response, db, userCollection);
                let taskActivity = activityOfUser(` ${Name + ' ' + lastName} viewed ${response[0].taskTitle} task`, 'Task', Name, 'Viewed', organizationId, Id, profilePic);
                taskActivity['taskId'] = taskId;
                event.emit('activity', taskActivity);
                response.length
                    ? res.send(Responses.taskSuccessResp(taskMessage['TASK_FETCHED'][language ?? 'en'], response))
                    : res.send(Responses.taskFailResp(taskMessage['TASK_FETCHING_FAILED'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.status(400).send(Responses.taskFailResp(taskMessage['FETCH_TASK_FAILED_ID'][language ?? 'en']));
        }
    }

    // Get the task and subtask status with count
    async taskStatus(req, res, next) {
        const reusable = new Reuse(req);
        let result = req.verified;
        Logger.info(result);
        const { language, _id: userId, orgId, firstName, profilePic, adminId, lastName } = result.userData?.userData;
        try {
            const { projectId, taskId } = req.query;
            const taskCollection = reusable.collectionName.task;
            const subTaskCollection = reusable.collectionName.subTask;
            const projectCollection = reusable.collectionName.project;
            const subTaskDb = await checkCollection(subTaskCollection);
            if (!subTaskDb) return res.status(400).send(Responses.taskFailResp(`Sub task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const db = await checkCollection(taskCollection);
            if (!db) return res.status(400).send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            if (taskId) {
                const subTaskData = await subTaskDb.collection(subTaskCollection).find({ taskId: taskId }).toArray();
                const subTaskStatusMap = new Map();

                const allSubTaskStatus = await statusSchema.find({ adminId: adminId })
                allSubTaskStatus.map(data => {
                    if (data.taskStatus) subTaskStatusMap.set(data.taskStatus, { count: 0 });
                });
                let response = { Total: subTaskData?.length ?? 0 };
                let statusData = {};
                let progressData = {};
                if (subTaskData.length) {
                    subTaskData.map(subTask => {
                        if (subTaskStatusMap.has(subTask.subTaskStatus)) subTaskStatusMap.get(subTask.subTaskStatus).count++;
                    });
                }
                const subTaskEntries = subTaskStatusMap.entries();
                for (const [key, value] of subTaskEntries) {
                    statusData[key] = value.count;
                    progressData[key] = Math.round((value.count / subTaskData.length) * 100);
                }
                response['statusData'] = statusData;
                response['progressData'] = progressData;
                Logger.info({ "response": response });
                let taskActivity = activityOfUser(` ${firstName + ' ' + lastName} viewed status of task `, 'task', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['taskId'] = taskId;
                event.emit('activity', taskActivity);
                return res.status(200).send(Responses.taskSuccessResp('Successfully fetched subtask status', response));
            }
            const allTaskStatus = await statusSchema.find({ adminId: adminId })
            const taskStatusMap = new Map();
            allTaskStatus.map(data => {
                if (data.taskStatus) taskStatusMap.set(data.taskStatus, { count: 0 });
            });
            let taskData;
            let subTaskData;
            let statusData = {}, progressData = {}, subtaskStatusData = {}, subtaskProgress = {};
            if (projectId) {
                const projectDb = await checkCollection(projectCollection);
                if (!projectDb) return res.send(Responses.taskFailResp(`Project ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                taskData = await db.collection(taskCollection).find({ projectId: projectId }).toArray();
                subTaskData = await db.collection(subTaskCollection).find({ projectId: projectId }).toArray();

                let response = { Total: taskData?.length ?? 0 };
                if (taskData.length) {
                    taskData.map(task => {
                        if (taskStatusMap.has(task.taskStatus)) taskStatusMap.get(task.taskStatus).count++;
                    });
                }
                const taskEntries = taskStatusMap.entries();
                for (const [key, value] of taskEntries) {
                    statusData[key] = value.count;
                    progressData[key] = Math.round((value.count / taskData.length) * 100);
                }
                const subTaskStatusMap = new Map();

                const allSubTaskStatus = await statusSchema.find({ adminId: adminId })
                allSubTaskStatus.map(data => {
                    if (data.taskStatus) subTaskStatusMap.set(data.taskStatus, { count: 0 });
                });
                if (subTaskData.length) {
                    subTaskData.map(subTask => {
                        if (subTaskStatusMap.has(subTask.subTaskStatus)) subTaskStatusMap.get(subTask.subTaskStatus).count++;
                    });
                }
                const subTaskEntries = subTaskStatusMap.entries();
                for (const [key, value] of subTaskEntries) {
                    subtaskStatusData[key] = value.count;
                    subtaskProgress[key] = Math.round((value.count / subTaskData.length) * 100);
                }
                response['statusData'] = statusData;
                response['progressData'] = progressData;
                response.TotalSubtask = subTaskData?.length ?? 0;
                response['subtaskStatusData'] = subtaskStatusData;
                response['subTaskProgress'] = subtaskProgress;
                Logger.info({ "response": response });
                let taskActivity = activityOfUser(` ${result?.userData?.userData?.firstName} viewed status of task `, 'task', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['ProjectId'] = projectId;
                event.emit('activity', taskActivity);
                return res.status(200).send(Responses.taskSuccessResp('Successfully fetched task status', response));
            }
            if (!projectId && !taskId) {
                let subTaskData = await db.collection(subTaskCollection).find({}).toArray();

                const subTaskStatusMap = new Map();
                const allSubTaskStatus = await statusSchema.find({ adminId: adminId })
                allSubTaskStatus.map(data => {
                    if (data.taskStatus) subTaskStatusMap.set(data.taskStatus, { count: 0 });
                });
                let response = { Total: subTaskData?.length ?? 0 };
                let statusData = {};
                let progressData = {};
                if (subTaskData.length) {
                    subTaskData.map(subTask => {
                        if (subTaskStatusMap.has(subTask.subTaskStatus)) subTaskStatusMap.get(subTask.subTaskStatus).count++;
                    });
                }
                const subTaskEntries = subTaskStatusMap.entries();
                for (const [key, value] of subTaskEntries) {
                    statusData[key] = value.count;
                    progressData[key] = Math.round((value.count / subTaskData.length) * 100);
                }
                response['statusData'] = statusData;
                response['progressData'] = progressData;
                Logger.info({ "response": response });
                let taskActivity = activityOfUser(` ${firstName + ' ' + lastName} viewed status of task `, 'task', firstName, 'Viewed', orgId, userId, profilePic);
                taskActivity['taskId'] = taskId;
                event.emit('activity', taskActivity);
                return res.status(200).send(Responses.taskSuccessResp('Successfully fetched subtask status', response));
            }
        } catch (error) {
            Logger.error({ "error": error });
            res.status(400).send(Responses.taskFailResp(taskMessage['FETCH_TASK_FAILED_ID'][language ?? 'en']));
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
                isSuspended: 1,
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
            for (const [idx, task] of response.entries()) {
                if (task.assignedTo?.length) {
                    let users = [];
                    for (const [index, user] of task.assignedTo.entries()) {
                        const userDetails = await db
                            .collection(userCollection)
                            .aggregate([
                                {
                                    $match: { _id: ObjectId(user.id), softDeleted: false },
                                },
                                {
                                    $project: userObj,
                                },
                            ])
                            .toArray();
                        if (userDetails.length) users.push(userDetails[0]);
                    }
                    task.assignedTo = users;
                }
                if (task?.group?.length) {
                    for (const [index, value] of task.group.entries()) {
                        const groupDetails = await GroupSchema.aggregate([
                            { $match: { _id: ObjectId(value.groupId) } },
                            {
                                $project: groupObj,
                            },
                        ]);
                        if (groupDetails.length) {
                            task.group[index] = groupDetails[0];
                            let users = [];
                            for (const user of task.group[index].assignedMembers) {
                                const userDetails = await db
                                    .collection(userCollection)
                                    .aggregate([
                                        {
                                            $match: { _id: ObjectId(user.userId), softDeleted: false },
                                        },
                                        {
                                            $project: userObj,
                                        },
                                    ])
                                    .toArray();
                                users.push(userDetails[0]);
                            }
                            task.group[index].assignedMembers = users;
                        }
                    }
                }
                if (task?.subTasks?.length) {
                    for (const [index1, subtask] of task.subTasks.entries()) {
                        if (subtask.subTaskAssignedTo?.length) {
                            let users = [];
                            for (const [index, user] of subtask.subTaskAssignedTo.entries()) {
                                const userDetails = await db
                                    .collection(userCollection)
                                    .aggregate([
                                        {
                                            $match: { _id: ObjectId(user.id), softDeleted: false },
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
                        if (subtask.group?.length) {
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
                                                    $match: { _id: ObjectId(user.userId), softDeleted: false },
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
                }
            }
            return response;
        } catch (err) {
            Logger.error({ "err": err });
        }
    }

    //Update task
    async updateTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { _id: userId, firstName: Name, profilePic: userProfilePic, language: language, orgId: organizationId, adminId, lastName, creatorId, permission } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            let permissions = await getPermissions(organizationId,permission);
            let managerLevelPermission = permissions?.permissionConfig?.otherTask?.edit; 
            const task = req.body;
            const id = req?.params?.id;
            const { value, error } = TaskValidation.updatetask(task);
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const projectCollectionName = reusable.collectionName.project;
            const projectDb = await checkCollection(projectCollectionName);
            if (!projectDb) return res.send(Responses.taskFailResp(`Project ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const projectId = value?.projectId;
            if (projectId) {
                const project = await projectDb.collection(projectCollectionName).findOne({ _id: ObjectId(projectId) });
                //check project is present or not
                if (!project) return res.send(Responses.taskFailResp(commonMessage['PROJECT_ID_NOT_PRESENT'][language ?? 'en']));
                if (project.status == 'Done') {
                    return res.send(Responses.taskFailResp(taskMessage['ENABLE_TO_CREATE_TASK'][language ?? 'en']));
                }
                Logger.info(`isProjectPresent: ${JSON.stringify(project)} `);
                value.projectName = project?.projectName;
                value.projectCode = project?.projectCode;
                value.standAloneTask = false;
            }
            const taskCollectionName = reusable.collectionName.task;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const taskExist = await findByIdQuery(db, taskCollectionName, id);
            const userTask = await db
            .collection(taskCollectionName)
            .find({
              _id: ObjectId(id),
              'assignedTo.id': { $ne: userId } // NOTE: userId should be a string here
            })
            .toArray();          
            if (!taskExist.length) {
                return res.send(Responses.taskFailResp(taskMessage['TASKS_NOT_FOUND'][language ?? 'en']));
            }
            const { stageName, taskType, taskStatus } = value;
            if (stageName) {
                let exist = await stageSchema.findOne({ adminId: adminId, taskStage: stageName })
                if (!exist) {
                    return res.send(Responses.taskFailResp(`Task ${taskMessage['TASK_STAGE_NOT_FOUND'][language ?? 'en']}`));
                }
            }
            if (taskType) {
                let exist = await typeSchema.findOne({ adminId: adminId, taskType: taskType })
                if (!exist) {
                    return res.send(Responses.taskFailResp(`Task ${taskMessage['TASK_TYPE_NOT_FOUND'][language ?? 'en']}`));
                }
            }
            if (taskStatus) {
                let exist = await statusSchema.findOne({ adminId: adminId, taskStatus: taskStatus })
                if (!exist) {
                    return res.send(Responses.taskFailResp(`Task ${taskMessage['TASK_STATUS_NOT_FOUND'][language ?? 'en']}`));
                }
                const subTaskCollectionName = reusable.collectionName.subTask;
                const subdb = await checkCollection(subTaskCollectionName);
                if (!subdb) return res.status(400).send(Responses.taskFailResp(`${subTaskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
                let statusCheck = await db.collection(subTaskCollectionName).find({ taskId: id }).toArray()
                if (statusCheck.length == 0) {
                    if(taskStatus === 'Todo'){
                        value.progress = 0;
                    }
                    if (taskStatus === 'Inprogress') {
                        value.progress = 50;
                    }
                    else if (taskStatus === 'Done') {
                        value.progress = 100;
                    }
                    else {
                        value.progress = taskExist[0].progress
                    }
                }
                if (statusCheck.length > 0 && taskStatus === 'Done') {
                    let count = 0;
                    statusCheck.map(ele => {
                        if (ele.subTaskStatus == 'Done') {
                            count++;
                        }
                    })
                    if (statusCheck.length != count) {
                        return res.send(Responses.taskFailResp('Not able to update task status as Done,please check status of subtasks'));
                    }
                }
                if (taskStatus === 'Done') {
                    value.completedDate = new Date()
                }
            }
            if (value?.actualHours == '' || value?.actualHours == null) {
                value.actualHours = '00:00';
            }
            if (value?.actualHours) {
                if (value.actualHours <= taskExist[0].estimationTime) {
                    value.remainingHours = subtractAndFormat(taskExist[0].estimationTime, value.actualHours);
                    value.exceededHours = '00:00';
                } else {
                    value.exceededHours = subtractAndFormat(value.actualHours, taskExist[0].estimationTime);
                    value.remainingHours = '00:00';
                }
            }
            value.updatedAt = new Date();
            const userCollection = reusable.collectionName.user;
            if (value.assignedTo) {
                //checking each user assigned with task
                for (const [index, user] of value.assignedTo.entries()) {
                    const userCheck = await db.collection(userCollection).findOne({ _id: ObjectId(user.id) });
                    user.isAdmin=userCheck?.isAdmin;
                    //check for soft deleted user
                    if (!userCheck || userCheck?.softDeleted) return res.send(Responses.taskFailResp(commonMessage['USER_NOT_FOUND'][language ?? 'en']));
                }
            }
            if (value.group?.length) {
                for (const [index, group] of value?.group.entries()) {
                    const groupCheck = await GroupSchema.findById({ _id: ObjectId(group.groupId) });
                    if (!groupCheck) return res.send(Responses.taskFailResp(taskMessage['GROUP_NOT_FOUND'][language ?? 'en'], group.id));
                }
            }
            let updatedTask;
            if (result.type === 'user' && permission != 'admin' && managerLevelPermission !== true) {
                if (value.taskStatus) {
                    let permission = result?.userData?.userData.permission;
                    let access = await permissionModel.findOne({ permissionName: permission });
                    let AccessKeys = [];
                    let AccessValue = {};
                    Object.entries(access.permissionConfig).forEach(entry => {
                        const [key, value] = entry;
                        AccessKeys.push(key)
                        AccessValue = value;
                    })
                    if ((AccessKeys.includes('task') === false) && (AccessValue.edit == false)) {
                        return res.send(Responses.taskFailResp(`You do not have access, Please contact your admin for permission`));
                    }
                }
                updatedTask = await db.collection(taskCollectionName).findOneAndUpdate({ $and: [{ _id: ObjectId(id) }, { $or: [{ 'taskCreator.id': userId }, { "assignedTo.id": userId }] }] }, { $set: value }, { returnDocument: 'after' });
                if (!updatedTask.value) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            } else if (result.type === 'user' && permission != 'admin' && managerLevelPermission === true){
                // if (value.taskStatus) {
                    let access = await permissionModel.findOne({ permissionName: permission });
                    let permissions = result?.userData?.userData.permission;
                    let AccessKeys = [];
                    let AccessValue = {};
                    Object.entries(access.permissionConfig).forEach(entry => {
                        const [key, value] = entry;
                        AccessKeys.push(key)
                        AccessValue = value;
                    })
                    if ((AccessKeys.includes('task') === false) || (access.permissionConfig.task.edit == false)) {
                        return res.send(Responses.taskFailResp(`You do not have access to update task, Please contact your admin for permission`));
                    }
                    if((AccessKeys.includes('otherTask') === false) || (access.permissionConfig.otherTask.edit == false) && userTask?.length>0){
                        return res.send(Responses.taskFailResp(`You do not have access to update unassigned task, Please contact your admin for permission`));
                    }
                // }
                updatedTask = await db.collection(taskCollectionName).findOneAndUpdate({ _id: ObjectId(id) }, { $set: value }, { returnDocument: 'after' });
                if (!updatedTask.value) return res.send(Responses.taskFailResp(`You are not allowed to update this record`));
            }else{
                updatedTask = await db.collection(taskCollectionName).findOneAndUpdate({ _id: ObjectId(id) }, { $set: value }, { returnDocument: 'after' });
            }
            if (updatedTask.value.projectId) {
                let projectId = updatedTask.value.projectId;
                {
                    let progress = await calculateTaskProgress(db, taskCollectionName, projectId)
                    let status = progress < 100 ? 'Inprogress' : 'Done';
                    event.emit('projectProgress', projectDb, projectCollectionName, progress, status, projectId);
                }
            }
            Logger.info(`updatedTask: ${JSON.stringify(updatedTask)}`);
            updatedTask.value ? res.send(Responses.taskSuccessResp('Task updated', updatedTask.value)) : res.send(Responses.taskFailResp('Failed to update task. Invalid task Id'));
            let changed_property = [];
            Object.keys(task).forEach(entry => {
                // const [key] = entry;
                changed_property.push(`${entry}`);
            });
            let taskActivity = activityOfUser(`${Name + ' ' + lastName} Updated ${changed_property} in ${updatedTask.value.taskTitle} task`, 'Task', Name, 'Updated', organizationId, adminId, userProfilePic);
            taskActivity['taskId'] = `${updatedTask.value._id}`;
            event.emit('activity', taskActivity);

            const getTask = await db.collection(taskCollectionName).findOne({ _id: ObjectId(id) });
            if (process.env.node_env !== 'localDev') {
                event.emit('email', value, updatedTask, taskExist[0], reusable, db)
            }
            // Notification
            if (result.type === 'user') {
                // To Admin`
                const message = `Updated details of ${updatedTask.value.taskTitle} task`;
                await NotificationService.adminNotification(message, adminId, userId, { collection: 'Task', id: updatedTask.value._id.toString() });
                if (adminId != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId, creatorId, { collection: 'Task', id: updatedTask.value._id.toString() });
                }

            }
            // To Users
            if (getTask?.assignedTo?.length) {
                for (const user of getTask?.assignedTo) {
                    const message = `Updated details of ${updatedTask.value.taskTitle} task`;
                    await NotificationService.userNotification(message, userId, user.id, { collection: 'Task', id: updatedTask.value._id.toString() });
                }
            }
            // To new assigned users
            if (value?.assignedTo?.length) {
                for (const user of value?.assignedTo) {
                    if (getTask?.assignedTo.includes(user.id) === false) {
                        const message = `Assigned you task ${updatedTask.value.taskTitle}`;
                        await NotificationService.userNotification(message, userId, user.id, { collection: 'Task', id: updatedTask.value._id.toString() });
                    }
                }
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(taskMessage['TASK_UPDATE_FAILED'][language ?? 'en'], err));
        }
    }

    //Delete task based on project_id,task_id and admin_id and id when tasks delete cooment and
    //activity of task will delete automatically
    async deleteTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, isAdmin, firstName, _id, profilePic, orgId, lastName, creatorId, permission } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const projectId = req.query.project_id;
            const taskId = req.query.id;
            let adminId = result?.userData?.userData?._id.toString();
            const { value, error } = TaskValidation.deleteValidation({ projectId, taskId });
            if (error) {
                return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            }
            const taskCollectionName = reusable.collectionName.task;
            const subTaskCollection = reusable.collectionName.subTask;
            const projectCollectionName = reusable.collectionName.project;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            if (projectId && taskId) {
                let task = await db.collection(taskCollectionName).aggregate([{ $match: { _id: ObjectId(taskId) } }, { $match: { projectId: projectId } }]).toArray;
                let taskActivity = activityOfUser(`${firstName + ' ' + lastName} deleted the task ${ele.taskTitle}`, 'task', firstName, 'Deleted', orgId, _id, profilePic);
                taskActivity['taskId'] = taskId;
                taskActivity['projectId'] = projectId;
                event.emit('activity', taskActivity);
                task.forEach(async function (ele) {
                    // Notification
                    if (result.type === 'user' && permission != 'admin') {
                        // To Admin
                        const message = `Deleted task ${ele.taskTitle}`;
                        await NotificationService.adminNotification(message, adminId, _id, { collection: 'Task', id: null });
                        if (adminId != creatorId && _id != creatorId) {
                            await NotificationService.userNotification(message, creatorId, _id, { collection: 'Task', id: null });
                        }
                    }
                    // To Users
                    if (ele?.assignedTo?.length) {
                        for (const user of ele?.assignedTo) {
                            const message = `Deleted task ${ele.taskTitle}`;
                            await NotificationService.userNotification(message, _id, user.id, { collection: 'Task', id: null });
                        }
                    }
                    await db.collection(taskCollectionName).deleteOne({ _id: ele._id });
                });
                Logger.info({ "Task": task });
                const deleteComment = await taskComment.deleteMany({ task_id: taskId });
                const deleteActivity = await activityModel.deleteMany({ $and: [{ task_id: taskId }, { projectId: projectId }] });
                Logger.info({ "Task Activity Deleted": deleteActivity });
                Logger.info({ "Task Comment Deleted": deleteComment });
                return task.length
                    ? res.send(Responses.taskSuccessResp(taskMessage['TASK_DELETED'][language ?? 'en']))
                    : res.send(Responses.taskFailResp(taskMessage['DELETE_FAILED_INVALID_TASK_ID'][language ?? 'en']));
            } else if (!projectId && !taskId) {
                let data = await db
                    .collection(taskCollectionName)
                    .find({ 'taskCreator.id': adminId, taskStatus: { $eq: 'Done' } })
                    .toArray();
                let task = await db.collection(taskCollectionName).deleteMany({ 'taskCreator.id': adminId, taskStatus: { $eq: 'Done' } });

                for (const element of data) {
                    await taskComment.deleteMany({ task_id: element._id.toString() });
                    await db.collection(subTaskCollection).deleteMany({ taskId: element._id.toString() });
                    await subTaskCommentSchema.deleteMany({ task_id: element._id.toString() });
                }
                let taskActivity = activityOfUser(`${firstName + ' ' + lastName} deleted all tasks`, 'Task', firstName, 'Deleted', orgId, _id, profilePic);
                event.emit('activity', taskActivity);
                // Notification
                if (result.type === 'user') {
                    // To Admin
                    const message = `Deleted all tasks`;
                    await NotificationService.adminNotification(message, adminId, _id, { collection: 'Task', id: null });
                    if (adminId != creatorId && _id != creatorId) {
                        await NotificationService.userNotification(message, _id, creatorId, { collection: 'Task', id: null });
                    }
                }
                return task.deletedCount
                    ? res.send(Responses.taskSuccessResp(taskMessage['ALL_TASK_DELETED'][language ?? 'en'], task))
                    : res.send(Responses.taskFailResp(taskMessage['TASK_NOT_DONE'][language ?? 'en']));
            } else if (taskId) {
                let task = await db.collection(taskCollectionName).findOneAndDelete({ _id: ObjectId(taskId) });
                await db.collection(subTaskCollection).deleteMany({ taskId: taskId });
                await subTaskCommentSchema.deleteMany({ taskId: taskId });
                await taskComment.deleteMany({ task_id: taskId });

                let taskActivity = activityOfUser(`${firstName + ' ' + lastName} deleted the task ${task?.value?.taskTitle}`, 'Task', firstName, 'Deleted', orgId, _id, profilePic);
                taskActivity['taskId'] = taskId;
                event.emit('activity', taskActivity);
                if (task?.value) {
                    // Notification
                    if (result.type === 'user') {
                        // To Admin
                        const message = `Deleted task ${task?.value?.taskTitle}`;
                        await NotificationService.adminNotification(message, adminId, _id, { collection: 'Task', id: null });
                        if (adminId != creatorId && _id != creatorId) {
                            await NotificationService.userNotification(message, _id, creatorId, { collection: 'Task', id: null });
                        }
                    }
                    // To Users
                    if (task?.value?.assignedTo?.length) {
                        for (const user of task?.value?.assignedTo) {
                            const message = `Deleted task ${task?.value?.taskTitle}`;
                            await NotificationService.userNotification(message, _id, user.id, { collection: 'Task', id: null });
                        }
                    }
                    return res.send(Responses.taskSuccessResp(taskMessage['TASK_DELETED'][language ?? 'en'], task));
                }
                return res.send(Responses.taskFailResp(taskMessage['DELETE_FAILED_INVALID_TASK_ID'][language ?? 'en']));
            } else {
                let task = await db.collection(taskCollectionName).deleteMany({ projectId: projectId });
                await db.collection(subTaskCollection).deleteMany({ projectId: projectId });
                await subTaskCommentSchema.deleteMany({ project_id: projectId });
                const project = await db.collection(projectCollectionName).findOne({ _id: ObjectId(projectId) });
                await taskComment.deleteMany({ project_id: projectId });
                let taskActivity = activityOfUser(`${firstName + ' ' + lastName} deleted all tasks under project ${project.projectName}`, 'Task', firstName, 'Deleted', orgId, _id, profilePic);
                taskActivity['projectId'] = projectId;
                event.emit('activity', taskActivity);
                if (task?.deletedCount) {
                    // Notification
                    if (result.type === 'user') {
                        // To Admin
                        const message = `Deleted all tasks under project ${project.projectName}`;
                        await NotificationService.adminNotification(message, adminId, _id, { collection: 'Task', id: null });
                        if (adminId != creatorId && _id != creatorId) {
                            await NotificationService.userNotification(message, creatorId, _id, { collection: 'Task', id: null });
                        }
                    }
                    return res.send(Responses.taskSuccessResp(taskMessage['TASK_DELETED'][language ?? 'en'], task));
                }
                return res.send(Responses.taskFailResp(taskMessage['DELETE_FAILED_INVALID_TASK_ID'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.send(Responses.taskFailResp(taskMessage['TASK_DELETE_FAILED'][language ?? 'en']));
        }
    }

    // function to calculate progress of task based on status and assign value
    async calculateProgressForTask(db, response, subTaskCol, result, permission, Id) {
        if (result.type === 'user' && permission != 'admin' ) {
            for (let task of response) {
                let compltedTasks = 0, TotalTasks = 1;
                if ((task.taskStatus.toLowerCase() == 'done')) {
                    compltedTasks += 1;
                }
                const allSubTaskCount = await db.collection(subTaskCol).countDocuments({$and: [{taskId: task._id.toString()},{ $or: [
                    { 'subTaskAssignedTo.id': Id },
                    { 'subTaskCreator.id': Id }
                ],
                
            } ]});
                let subTaskCount = await db.collection(subTaskCol).countDocuments({$and:[{ taskId: task._id.toString(), subTaskStatus: new RegExp('^' + 'done', 'i') }, { $or: [
                    { 'subTaskAssignedTo.id': Id },
                    { 'subTaskCreator.id': Id }
                ],
                
            }]});
                let progressCount = allSubTaskCount > 0 ? Math.round((subTaskCount / allSubTaskCount) * 100) : task.progress;
                task.TotalSubtask = allSubTaskCount;
                task.compltedSubTasks = subTaskCount;
                task.pendingSubTasks = allSubTaskCount - subTaskCount;
                task.progress = isNaN(progressCount) ? 0 : progressCount;
                
            }
            return response;
        }
        else {
            for (let task of response) {
                let compltedTasks = 0, TotalTasks = 1;
                if ((task.taskStatus.toLowerCase() == 'done')) {
                    compltedTasks += 1;
                }
                const allSubTaskCount = await db.collection(subTaskCol).countDocuments({ taskId: task._id.toString() });
                let subTaskCount = await db.collection(subTaskCol).countDocuments({ taskId: task._id.toString(), subTaskStatus: new RegExp('^' + 'done', 'i') });
                let progressCount = allSubTaskCount > 0 ? Math.round((subTaskCount / allSubTaskCount) * 100) : task.progress;
                task.TotalSubtask = allSubTaskCount;
                task.compltedSubTasks = subTaskCount;
                task.pendingSubTasks = allSubTaskCount - subTaskCount;
                task.progress = isNaN(progressCount) ? 0 : progressCount;
            }
            return response;
        }
    }

    async searchTask(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, orgId: organizationId, _id, firstName, profilePic, adminId, lastName, permission } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const { keyword } = req.query;
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const sort = reusable.sort;
            let orderby = reusable.orderby || 'taskTitle';

            const sortBy = {};
            sortBy[orderby] = sort === 'asc' ? 1 : -1;
            let searchQuery = {};
            const searchQuerySubTask = {};
            let standAloneTask = req?.query?.standAloneTask ? req?.query?.standAloneTask : null;
            if (standAloneTask) searchQuery = { $and: [{ 'standAloneTask': JSON.parse(standAloneTask) }] }
            let fieldValue,
                obj = {},
                fields;
            const dynamicCollection = `configviewfieldschemas`;
            const dynamicDataBase = await checkCollection(dynamicCollection);
            const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
            configFields.forEach(entry => {
                fields = entry['taskViewFields'];
            });
            let viewAccess = viewFields(configFields, fields, fieldValue, obj);
            const extraAccess = {
                projectName: 1,
                projectCode: 1,
                projectLogo: 1,
                taskCreator: 1,
                progress: 1,
                reason: 1,
                completedDate: 1
            };
            let totalViewAccess = { ...viewAccess, ...extraAccess };
            Logger.info({ "viewAccess": viewAccess });
            let filterData = [];
            filterData = Object.keys(viewAccess);
            // if (orderby != '_id') {
            //     let outIn = filterData.filter(word => orderby.includes(word));
            //     if (outIn.length == 0) {
            //         return res.send(Responses.taskFailResp('Failed to search, please check config Fields'));
            //     }
            // }
            // let keyword = req?.query?.keyword;
            if (keyword) {
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Responses.taskFailResp('Failed to search, please check keyword'));
                }
                searchQuery.$or = [
                    { projectName: new RegExp(keyword, 'i') },
                    { taskTitle: new RegExp(keyword, 'i') },
                    { stageName: new RegExp(keyword, 'i') },
                    { taskType: new RegExp(keyword, 'i') },
                    { taskStatus: new RegExp(keyword, 'i') },
                    { priority: new RegExp(keyword, 'i') },
                    { 'assignedTo.lastName': new RegExp(keyword, 'i') },
                    { 'assignedTo.firstName': new RegExp(keyword, 'i') },
                    { 'group.groupId': new RegExp(keyword, 'i') },
                ];
                searchQuerySubTask.$or = [
                    { taskId: new RegExp(keyword, 'i') },
                    { subTaskTitle: new RegExp(keyword, 'i') },
                    { subTaskStageName: new RegExp(keyword, 'i') },
                    { subTaskType: new RegExp(keyword, 'i') },
                    { subTaskStatus: new RegExp(keyword, 'i') },
                    { priority: new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.lastName': new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.firstName': new RegExp(keyword, 'i') },
                ];
            }
            let resp, taskCount;
            const taskCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_taskfeatures`;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const subTaskCol = `org_${result?.userData?.userData?.orgId.toLowerCase()}_subtaskfeatures`;
            const userCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            if (result.type === 'user' && permission != 'admin') {
                resp = await db
                    .collection(taskCollectionName)
                    .aggregate(
                        [
                            {
                                $match: { $and: [searchQuery, { $or: [{ 'taskCreator.id': _id }, { 'assignedTo.id': _id }] }] },
                            },
                            {
                                $addFields: {
                                    taskId: { $toString: '$_id' },
                                },
                            },
                            {
                                $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                            },
                            {
                                $project: totalViewAccess,
                            },
                        ],
                        { collation: { locale: "en", numericOrdering: true } }
                    )
                    .sort(sortBy)
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();
            } else {
                resp = await db
                    .collection(taskCollectionName)
                    .aggregate(
                        [
                            {
                                $match: searchQuery,
                            },
                            {
                                $addFields: {
                                    taskId: { $toString: '$_id' },
                                },
                            },
                            {
                                $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                            },
                            {
                                $project: totalViewAccess,
                            },
                        ],
                        { collation: { locale: "en", numericOrdering: true } }
                    )
                    .sort(sortBy)
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();
            }
            if (result.type === 'user' && permission != 'admin') searchQuery['$or'] = [{ 'taskCreator.id': _id }, { 'assignedTo.id': _id }];
            taskCount = await db
                .collection(taskCollectionName)
                .aggregate(
                    [
                        {
                            $match: searchQuery,
                        }
                    ]
                ).toArray();
            await this.fetchCreator(resp, userCollectionName, db);
            resp = await this.user_GroupDetails(resp, db, userCollectionName);

            if (!resp.length) {
                const resp1 = await db.collection(subTaskCol).find(searchQuerySubTask).sort(sortBy).skip(skipValue).limit(limitValue).toArray();

                resp = await db
                    .collection(taskCollectionName)
                    .aggregate(
                        [
                            {
                                $match: { _id: { $in: resp1.map(d => ObjectId(d.taskId)) } },
                            },
                            {
                                $addFields: {
                                    taskId: { $toString: '$_id' },
                                },
                            },
                            {
                                $project: totalViewAccess,
                            },
                        ],
                        { collation: { locale: "en", numericOrdering: true } }
                    )
                    .sort(sortBy)
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();

                if (!resp.length) return res.send(Responses.taskFailResp(taskMessage['TASK_NOT_PRESENT'][language ?? 'en']));

                for (let item of resp1) {
                    const index = resp.findIndex(e => e.taskId == item.taskId);
                    if (!resp[index]?.subTasks?.length) resp[index].subTasks = [];
                    resp[index].subTasks.push(item);
                }
                await this.fetchCreator(resp, userCollectionName, db);
                resp = await this.user_GroupDetails(resp, db, userCollectionName);
            }
            let taskActivity = activityOfUser(`${firstName + ' ' + lastName} searched tasks by ${orderby}`, 'Task', firstName, 'Searched', organizationId, _id, profilePic);
            event.emit('activity', taskActivity);
            let data = { taskCount: taskCount?.length, skip: skipValue, resp };
            if (sort == 'asc') {
                if (orderby == 'priority') {
                    const order = ['Low', 'Medium', 'High']
                    data.resp.sort(
                        (x, y) => order.indexOf(x.priority) - order.indexOf(y.priority))

                }
            } else {
                if (orderby == 'priority') {
                    const order = ['High', 'Medium', 'Low']
                    data.resp.sort(
                        (x, y) => order.indexOf(x.priority) - order.indexOf(y.priority))

                }
            }
            Logger.info({ "Data": data });
            return res.send(Responses.taskSuccessResp(commonMessage['SEARCH_SUCCESS'][language ?? 'en'], data));
        } catch (error) {
            Logger.error({ "Error": error });
            return res.send(Responses.taskFailResp(commonMessage['SEARCH FAILED'][language ?? 'en']));
        }
    }

    async filterByKey(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, orgId: organizationId, firstName, _id, profilePic, lastName, adminId, permission } = result?.userData?.userData;
        try {
            let permissions = await getPermissions(organizationId,permission);
            let managerLevelPermission = permissions?.permissionConfig?.otherTask?.view; 
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const { keyword } = req.query;
            let sort = reusable.sort;
            let orderby = reusable.orderby || 'taskTitle';
            const sortBy = {};
            sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
            let searchQuery = {};
            const searchQuerySubTask = {};
            const obj = await removeObjectNull(req?.body);
            const { projectName, taskTitle, taskCreator, assignedTo, standAloneTask, projectId, taskStatus, taskCategory, taskType, taskStage, createdAt, updatedAt } = obj;
            let fieldValue,
                object = {},
                fields;

            const dynamicCollection = `configviewfieldschemas`;
            const dynamicDataBase = await checkCollection(dynamicCollection);
            const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: organizationId }).toArray();
            configFields.forEach(entry => {
                fields = entry['taskViewFields'];
            });
            let viewAccess = viewFields(configFields, fields, fieldValue, object);
            const extraAccess = {
                projectName: 1,
                projectCode: 1,
                projectLogo: 1,
                progress: 1,
                reason: 1,
                completedDate: 1
            };
            let totalViewAccess = { ...viewAccess, ...extraAccess };
            const projectCollectionName = reusable.collectionName.project;
            const taskCollectionName = reusable.collectionName.task;
            const subTaskCol = reusable.collectionName.subTask;
            const userCollectionName = reusable.collectionName.user;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const projectdb = await checkCollection(projectCollectionName);
            if (!projectdb) return res.status(400).send(Responses.taskFailResp(`Project ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            if (keyword) {
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Responses.taskFailResp('Failed to search, please check keyword'));
                }
                searchQuery.$or = [
                    { projectName: new RegExp(keyword, 'i') },
                    { taskTitle: new RegExp(keyword, 'i') },
                    { stageName: new RegExp(keyword, 'i') },
                    { taskType: new RegExp(keyword, 'i') },
                    { taskStatus: new RegExp(keyword, 'i') },
                    { priority: new RegExp(keyword, 'i') },
                    { 'assignedTo.lastName': new RegExp(keyword, 'i') },
                    { 'assignedTo.firstName': new RegExp(keyword, 'i') },
                    { 'group.groupId': new RegExp(keyword, 'i') },
                ];
                searchQuerySubTask.$or = [
                    { taskId: new RegExp(keyword, 'i') },
                    { subTaskTitle: new RegExp(keyword, 'i') },
                    { subTaskStageName: new RegExp(keyword, 'i') },
                    { subTaskType: new RegExp(keyword, 'i') },
                    { subTaskStatus: new RegExp(keyword, 'i') },
                    { priority: new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.lastName': new RegExp(keyword, 'i') },
                    { 'subTaskAssignedTo.firstName': new RegExp(keyword, 'i') },
                ];
            }
            let and = [];
            const match = {};

            if (projectName?.trim()) and.push({ projectName: new RegExp(projectName, 'i') });

            if (projectId) and.push({ projectId: projectId });

            if (taskTitle?.trim()) and.push({ taskTitle: new RegExp(taskTitle, 'i') });

            if (taskCreator?.trim()) and.push({ 'taskCreator.id': new RegExp(taskCreator, 'i') });

            if (taskStatus?.trim()) and.push({ taskStatus: new RegExp(taskStatus, 'i') });

            if (taskCategory?.trim()) and.push({ category: new RegExp(taskCategory, 'i') });

            if (taskStage?.trim()) and.push({ stageName: new RegExp(taskStage, 'i') });

            if (taskType?.trim()) and.push({ taskType: new RegExp(taskType, 'i') });

            if (standAloneTask) and.push({ standAloneTask: standAloneTask });

            if (assignedTo) {
                const idsToMatch = assignedTo
                    .filter(ele => ele.id && ele.id !== ' ')
                    .map(ele => ele.id);

                if (idsToMatch.length > 0) {
                    const query = {
                        'assignedTo.id': { $in: idsToMatch }
                    };
                    and.push(query);
                }
            }
            if (createdAt) {
                const { startDate, endDate } = createdAt;
                const filter = {};
              
                if (startDate) {
                  filter.$gte = moment(startDate).startOf('day').toDate();
                }
              
                if (endDate) {
                  filter.$lt = moment(endDate).endOf('day').toDate();
                }
              
                if (Object.keys(filter).length > 0) {
                  and.push({ createdAt: filter });
                }
              }
              
              if (updatedAt) {
                const { startDate, endDate } = updatedAt;
                const filter = {};
              
                if (startDate) {
                  filter.$gte = moment(startDate).startOf('day').toDate();
                }
              
                if (endDate) {
                  filter.$lt = moment(endDate).endOf('day').toDate();
                }
              
                if (Object.keys(filter).length > 0) {
                  and.push({ updatedAt: filter });
                }
              }

            if (and.length) match['$and'] = and;

            let totalCount = await db
                .collection(taskCollectionName)
                .aggregate([
                    {
                        $match: { $and: [searchQuery, match] },
                    },
                ]).toArray();
            let query = {}

            if (result.type === 'user' && permission != 'admin') {
                if (managerLevelPermission===false) {
                  query.$or = [{ 'taskCreator.id': _id }, { 'assignedTo.id': _id }];
                } 
              } else {
                query.$or = [
                  { 'taskCreator.id': adminId },
                  { 'taskCreator.id': { $ne: adminId } }
                ];
              }


            let resp = await db
                .collection(taskCollectionName)
                .aggregate([
                    {
                        $match: { $and: [searchQuery, query, match] }
                    },
                    { $addFields: { taskId: { $toString: '$_id' } } },
                    {
                        $lookup: { from: projectCollectionName, localField: 'projectId', foreignField: '_id', as: 'project' },
                    },
                    {
                        $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                    },
                    {
                        $project: totalViewAccess,
                    },
                ],
                    { collation: { locale: "en", numericOrdering: true } }
                )
                .sort(sortBy)
                .skip(skipValue)
                .limit(limitValue)
                .toArray();
            await this.fetchCreator(resp, userCollectionName, db);
            let taskActivity = activityOfUser(`${firstName + ' ' + lastName} filtered tasks`, 'Task', firstName, 'Filtered', organizationId, _id, profilePic);
            event.emit('activity', taskActivity);
            resp = await this.user_GroupDetails(resp, db, userCollectionName);

            resp.length
                ? res.send(Responses.taskSuccessResp(commonMessage['SEARCH_SUCCESS'][language ?? 'en'], { totalCount: totalCount.length, resp }))
                : res.send(Responses.taskSuccessResp(commonMessage['SEARCH_SUCCESS'][language ?? 'en'], { resp }))
        } catch (error) {
            Logger.error({ "Error": error });
            return res.send(Responses.taskFailResp('Failed to search'));
        }
    }
    async searchTaskDefaultValue(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        Logger.info({ "result": result });
        const { language, _id, orgId, profilePic, firstName, lastName,adminId } = result.userData?.userData;
        try {
            let skipValue = reusable.skip;
            let limitValue = reusable.limit;
            let searchQuery = {};
            let searchCategory = req?.query?.category;
            let keyword = req?.query?.keyword;
            let sort = reusable.sort || 'asc';
            const sortBy = {};
            let orderby;
            sortBy[orderby] = sort === 'asc' ? 1 : -1;


            let collectionName;
            switch (searchCategory) {
                case 'types':
                    if (keyword) {
                        searchQuery.$or = [{ taskType: new RegExp(keyword, 'i') }];
                    }
                    orderby = req?.query?.order || 'taskType';
                    collectionName = `tasktypes`;
                    break;
                case 'status':
                    if (keyword) {
                        searchQuery.$or = [{ taskStatus: new RegExp(keyword, 'i') }];
                    }
                    orderby = req?.query?.order || 'taskStatus';
                    collectionName = `taskstatuses`;
                    break;
                case 'category':
                    if (keyword) {
                        searchQuery.$or = [{ taskCategory: new RegExp(keyword, 'i') }];
                    }
                    orderby = req?.query?.order || 'taskCategory';
                    collectionName = `taskcategories`;
                    break;
                case 'stage':
                    if (keyword) {
                        searchQuery.$or = [{ taskStage: new RegExp(keyword, 'i') }];
                    }
                    orderby = req?.query?.order || 'taskStage';
                    collectionName = `taskstages`;
                    break;
            }

            const db = await checkCollection(collectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${collectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));

            let count = await db.collection(collectionName).find().toArray();
            
            searchQuery.adminId=adminId;
            
            let resp = await db
                .collection(collectionName)
                .aggregate(
                    [
                        {
                            $match: searchQuery,
                        },
                    ],
                    { collation: { locale: 'en' } }
                )
                .sort(sortBy)
                .skip(skipValue)
                .limit(limitValue)
                .toArray();

            let taskActivity = activityOfUser(`${firstName + ' ' + lastName} searched tasks default ${searchCategory} values`, 'Task', firstName, 'Searched', orgId, _id, profilePic);
            event.emit('activity', taskActivity);
            let data = { Count: count.length, skip: skipValue, resp };
            Logger.info({ "Data": data });
            return res.send(Responses.taskSuccessResp(commonMessage['SEARCH_SUCCESS'][language ?? 'en'], data));
        } catch (error) {
            Logger.error({ "Error": error });
            return res.send(Responses.taskFailResp(commonMessage['SEARCH FAILED'][language ?? 'en']));
        }
    }
    async postComment(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, user, orgId } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const taskId = req.params.id;
            const comment = req.body.comment;
            const userNameInput = req.body.userName;
            const { value, error } = TaskValidation.postCommentValidation({ comment });
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            if (comment == 'null') { return res.send(Responses.taskFailResp("Comment is not allowed to be empty")); }
            const adminId = result?.userData?.userData?._id;
            let taskCreatorName = result?.userData?.userData?.firstName;
            let taskCreatorProfilePic = result?.userData?.userData?.profilePic;
            const user = result?.userData?.userData;
            const name = `${user.firstName} ${user.lastName}`;
            const taskCollectionName = reusable.collectionName.task;
            const temp = await checkCollection(taskCollectionName);
            if (!temp) return res.send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let task = await temp.collection(taskCollectionName).findOne({ _id: ObjectId(taskId) });
            if (!task) { res.send(Responses.taskSuccessResp("Failed to add comment,task id not present")) }
            let projectId = task.projectId;
            let userName = userNameInput;
            let commentCreator = {
                creatorId: adminId,
                creatorName: taskCreatorName,
                creatorProfilePic: taskCreatorProfilePic,
            };
            let results = { taskId, projectId, comment, adminId, userName, commentCreator, isEdited: false, orgId: orgId };
            results.createdAt = new Date();
            results.updatedAt = new Date();
            let response = await taskComment.create(results);
            Logger.info({ "comment": response });
            if (response) {
                if (result.type === 'user') {
                    // To Admin
                    const message = `${name} commented on ${task.taskTitle} task`;
                    await NotificationService.adminCommentNotification(message, user.adminId, response.commentCreator.creatorId, { collection: 'TaskComment', id: response._id });
                } else {
                    // To user
                    const message = `${name} commented on ${task.taskTitle} task`;
                    await NotificationService.adminCommentNotification(message, user._id, response.commentCreator.creatorId, { collection: 'TaskComment', id: response._id });
                }
                const adminModel = `adminschemas`
                const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
                const db = await checkCollection(userCollection);
                if (response.userName) {
                    userNameInput?.map(async (ele) => {
                        const userDetails = await db.collection(userCollection).findOne({ userName: ele })
                       let projectId=null;
                        if (userDetails) {
                            const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${user.firstName + ' ' + user.lastName} tagged you on the comment`;;
                            await NotificationService.UserCommentNotification(message, response.commentCreator.creatorId, userDetails._id.toString(),taskId,projectId, { collection: 'ProjectComment', id: response._id });
                        }
                        const adminDetails = await db.collection(adminModel).findOne({ userName: ele })
                        if (adminDetails) {
                            const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${user.firstName + ' ' + user.lastName} tagged you on the comment`;
                            await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId,taskId,projectId, { collection: 'ProjectComment', id: response._id });
                        }

                    })
                }
            }
            response
                ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_ADDED'][language ?? 'en'], response))
                : res.send(Responses.taskFailResp(commentMessage['COMMENT_ADDED_FAILED'][language ?? 'en'], null));
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_ADDED_FAILED_INVALID_TASK-ID'][language ?? 'en'], err));
        }
    }
    async updateComment(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, firstName, lastName, adminId, _id } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const comment_id = req.params.id;
            const comment = req.body;
            const userNameInput = req.body.userName;
            const taskCreatorId = result?.userData?.userData?._id.toString();
            const { value, error } = TaskValidation.updateCommentValidaton(req.body);
            if (comment == 'null') { return res.send(Responses.taskFailResp("Comment is not allowed to be empty")); }
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            const isExist = await taskComment.findOne({ _id: comment_id })
            if (!isExist) { return res.send(Responses.taskFailResp("Invalid comment Id")) }
            let response = await taskComment.findOneAndUpdate({ _id: ObjectId(comment_id) }, { $set: value }, { returnDocument: 'after' });
            Logger.info({ "updateComment": response });
            if (result.type === 'user') {
                // To Admin
                const message = `${firstName + ' ' + lastName} updated comment`;
                await NotificationService.adminCommentNotification(message, adminId, isExist.commentCreator.creatorId, { collection: 'TaskComment', id: isExist._id });
            } else {
                // To user
                const message = `you updated comment`;
                await NotificationService.adminCommentNotification(message, _id, isExist.commentCreator.creatorId, { collection: 'TaskComment', id: isExist._id });
            }
            const adminModel = `adminschemas`
            const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollection);
            let task;
            if (response) {
                task = await db.collection(reusable.collectionName.task).findOne({ _id: ObjectId(response.taskId) });
            }
            if (response.userName) {
                userNameInput?.map(async (ele) => {
                    const userDetails = await db.collection(userCollection).findOne({ userName: ele });
                    let projectId=null;
                    if (userDetails) {
                        const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${firstName + ' ' + lastName} tagged you on the comment`;;
                        await NotificationService.UserCommentNotification(message, response.commentCreator.creatorId, userDetails._id,response.taskId,projectId, { collection: 'TaskComment', id: isExist._id });
                    }
                    const adminDetails = await db.collection(adminModel).findOne({ userName: ele })
                    if (adminDetails) {
                        const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${firstName + ' ' + lastName} tagged you on the comment`;
                        await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId,response.taskId,projectId, { collection: 'TaskComment', id: isExist._id });
                    }

                })
            }
            return res.send(Responses.taskSuccessResp(commentMessage['COMMENT_UPDATED'][language ?? 'en'], response))

        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_UPDATE_FAILED'][language ?? 'en']));
        }
    }
    async getComments(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language, orgId } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const task_id = req.query.task_id;
            const comment_id = req.query.comment_id;
            const skipValue = reusable.skip;
            const limitValue = reusable.limit;
            const sortBy = {};
            sortBy[reusable.orderby || 'createdAt'] = reusable.sort.toString() === 'desc' ? -1 : 1;
            const { value, error } = TaskValidation.commentValidation({ task_id, comment_id });
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            if (task_id && comment_id) {
                let comments = await taskComment
                    .find({ _id: ObjectId(req.query.comment_id), taskId: req.query.task_id })
                    .skip(skipValue)
                    .limit(limitValue)
                return comments
                    ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_FETCHED'][language ?? 'en'], comments))
                    : res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en'], null));
            }
            //fetching based on subtask id
            else if (task_id) {
                const value = await taskComment.find({ taskId: task_id, orgId: orgId }).sort(sortBy).skip(skipValue).limit(limitValue)
                return value.length
                    ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_FETCHED'][language ?? 'en'], value))
                    : res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en'], null));
            } else {
                //fetching based on comment id
                let response = await taskComment.findOne({ _id: ObjectId(comment_id) });
                return response
                    ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_FETCHED'][language ?? 'en'], response))
                    : res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en'], null));
            }
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_FETCHED_INVALID_TASK-ID'][language ?? 'en'], err));
        }
    }

    async deleteComment(req, res, next) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { language } = result?.userData?.userData;
        Logger.info({ "result": result });
        try {
            const taskId = req?.query?.task_id || null;
            const commentId = req?.query?.comment_id || null;
            const { value, error } = TaskValidation.commentValidation(req.query);
            if (error) return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            let response;
            if (commentId && !taskId) response = await taskComment.deleteOne({ _id: ObjectId(commentId) });
            else if (commentId && taskId) response = await taskComment.deleteMany({ taskId: taskId, _id: ObjectId(commentId) });
            else response = await taskComment.deleteMany({ taskId: taskId });
            response.deletedCount > 0
                ? res.send(Responses.taskSuccessResp(commentMessage['COMMENT_DELETED'][language ?? 'en']))
                : res.send(Responses.commentSuccessResp(commentMessage['COMMENT_NOT_FETCHED'][language ?? 'en']));
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(commentMessage['COMMENT_NOT_DELETED_INVALID_TASK-ID'][language ?? 'en'], err));
        }
    }

    async deleteMultipleTask(req, res) {
        const result = req.verified;
        const reusable = new Reuse(req);
        const { firstName: userName, adminId: Id, _id: userId, profilePic: userProfilePic, orgId: organizationId, language } = result.userData?.userData;
        try {
            const data = req?.body;
            const TaskId = data.TaskId;
            const { value, error } = TaskValidation.deleteMultiple(data);
            if (error) {
                Logger.error(error);
                return res.send(Responses.validationfailResp(commonMessage['VALIDATION_FAILED'][language ?? 'en'], error));
            }
            const taskCollectionName = reusable.collectionName.task;
            const subTaskCollection = reusable.collectionName.subTask;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${taskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));

            let exist = [];
            let notExist = [];

            for (const ele of TaskId) {
                const userData = await db
                    .collection(taskCollectionName)
                    .aggregate([{ $match: { _id: ObjectId(ele.id), taskStatus: { $eq: 'Done' } } }])
                    .toArray();
                userData.length == 0 ? notExist.push({ id: ele.id }) : exist.push({ id: ele.id });
            }
            if (notExist.length > 0 && exist.length == 0) {
                return res.status(400).send(Responses.taskFailResp('Task is not present/Incomplete for the given Id, please check the ID', notExist));
            }
            if (notExist.length == 0 && exist.length == 0) {
                return res.status(400).send(Responses.taskFailResp('Please provide valid Task Id'));
            }
            let response = 0;
            if (exist.length > 0) {
                for (const ele of exist) {
                    let count = await db.collection(taskCollectionName).deleteMany({ _id: ObjectId(ele.id) });
                    await db.collection(subTaskCollection).deleteMany({ taskId: ele.id.toString() });
                    await subTaskCommentSchema.deleteMany({ task_id: ele.id.toString() });
                    await db.collection(commentCollectionName).deleteMany({ task_id: ele.id.toString() });
                    if (count.deletedCount) {
                        response++;
                    }
                }
            }
            return res.send(Responses.taskSuccessResp(taskMessage['TASK_DELETED'][language ?? 'en'], { deletedCount: response, deletedTasks: exist }));
        } catch (err) {
            Logger.error({ "err": err });
            return res.send(Responses.taskFailResp(taskMessage['TASK_DELETE_FAILED'][language ?? 'en']));
        }
    }
    async fetchaTaskByuserId(req, res) {
        const result = req.verified;
        const reusable = new Reuse(req);
        let { } = result?.userData?.userData;
        try {
            const userId = req.body;
            const taskCollectionName = reusable.collectionName.task;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`${taskCollectionName} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const subDb = await checkCollection(reusable.collectionName.subTask);
            if (!subDb) return res.send(Response.projectFailResp(`SubTask ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const userDb = await checkCollection(userCollection);
            if (!userDb) return res.status(400).send(Responses.taskFailResp(`${userCollection} ${commonMessage['COLLECTION_NOT_PRESENT'][language ?? 'en']}`));
            let alluserValid = [];
            userId.map(ele => {
                alluserValid.push(ObjectId(ele.userId))
            })
            const isValid = await userDb.collection(userCollection).find({
                $and: [
                    { _id: { $in: alluserValid } },
                    // Add additional conditions here, if needed
                ]
            }).toArray();
            if (isValid.length != alluserValid.length) {
                return res.send(Responses.taskFailResp("Invalid user Id,plaese check"));
            } else {
                let alluserIds = [];
                userId.map(ele => {
                    alluserIds.push(ele.userId)
                })
                const allTask = await db.collection(taskCollectionName).aggregate([
                    {
                        $match: {
                            $and: [
                                { assignedTo: { $elemMatch: { id: { $in: alluserIds } } } },
                            ]
                        }
                    },

                ]).toArray();
                let alltasksWithSubtasks = await Promise.all(allTask.map(async ele => {
                    const allSubtask = await subDb.collection(reusable.collectionName.subTask)
                        .aggregate([
                            { $match: { $and: [{ taskId: ele._id.toString() }, { subTaskAssignedTo: { $elemMatch: { id: { $in: alluserIds } } } }] } },
                        ])
                        .toArray();
                    ele.subTasks = allSubtask;

                    return ele;
                }));
                alltasksWithSubtasks = await this.user_GroupDetails(alltasksWithSubtasks, db, userCollection);
                let allTaskAndSubTasks = {
                    taskCount: allTask.length,
                    tasks: alltasksWithSubtasks,
                }
                return res.send(Responses.taskSuccessResp("Successfully fetched all Task and Subtask assingend to user", allTaskAndSubTasks));
            }
        } catch (err) {
            return res.send(Responses.taskFailResp("Failed to fetch task and subTask", err.message));
        }

    }
    async fetchCreator(tasks, collectionName, db) {
        for (const task of tasks) {
            task.taskCreator = await creatorDetails(task.taskCreator, collectionName, db);
            if (task?.project?.length) {
                task.project[0].projectCreatedBy = await creatorDetails(task.project[0].projectCreatedBy, collectionName, db);
            }
            if (task?.subTasks?.length) {
                for (const subtask of task.subTasks) {
                    subtask.subTaskCreator = await creatorDetails(subtask.subTaskCreator, collectionName, db);
                }
            }
        }
    }
    async getReports(req, res) {
        const reusable = new Reuse(req);
        const result = req.verified;
        const { _id: Id, language, orgId, adminId, permission } = result?.userData?.userData;
        const skipValue = reusable.skip;
        const limitValue = reusable.limit;
        try {

            let startDate = req.query.startDate;
            let endDate = req.query.endDate;
            let fieldValue,
                obj = {},
                fields;
            const dynamicCollection = `configviewfieldschemas`;
            const dynamicDataBase = await checkCollection(dynamicCollection);
            const configFields = await dynamicDataBase.collection(dynamicCollection).find({ orgId: orgId }).toArray();
            configFields.forEach(entry => {
                fields = entry['taskViewFields'];
            });
            let viewAccess = viewFields(configFields, fields, fieldValue, obj);
            const extraAccess = {
                projectName: 1,
                projectCode: 1,
                projectLogo: 1,
                progress: 1,
                completedDate: 1,
                reason: 1,
            };
            let totalViewAccess = { ...viewAccess, ...extraAccess };
            Logger.info({ "viewAccess": viewAccess });
            const taskCollectionName = reusable.collectionName.task;
            const subTaskCol = reusable.collectionName.subTask;
            const db = await checkCollection(taskCollectionName);
            if (!db) return res.status(400).send(Responses.taskFailResp(`Task ${commonMessage['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const userCollection = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            let completedOnTime = 0, exceededTimeCount = 0;
            let assignedMembers = [];
            let query = {};
            if (startDate && endDate) {
                query.$and = [{
                    createdAt: {
                        $gte: new Date(startDate),
                        $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                    }
                }]

            }
            result.type === 'user' && !permission == 'admin' ? query.$or = [{ 'taskCreator.id': Id }, { 'assignedTo.id': Id }] : query.$or = [{ 'taskCreator.id': adminId }, { 'taskCreator.id': { $ne: adminId } }];

            let totalCount = await db
                .collection(taskCollectionName)
                .find({}).toArray();

            let allTasks = await db
                .collection(taskCollectionName)
                .aggregate(
                    [
                        {
                            $addFields: {
                                taskId: { $toString: '$_id' },
                            },
                        },
                        {
                            $match: query,
                        },
                        {
                            $lookup: { from: subTaskCol, localField: 'taskId', foreignField: 'taskId', as: 'subTasks' },
                        },
                        {
                            $project: totalViewAccess,
                        },
                    ],
                )
                .toArray();
            await this.fetchCreator(allTasks, reusable.collectionName.user, db);
            allTasks = await this.calculateProgressForTask(db, allTasks, subTaskCol, result, permission, Id);
            allTasks = await this.user_GroupDetails(allTasks, db, userCollection);

            allTasks.filter(item => {
                let completedDate, dueDate;
                if (item.dueDate) dueDate = new Date(item.dueDate).toISOString().slice(0, 10);

                if (item.completedDate) completedDate = new Date(item.completedDate).toISOString().slice(0, 10);

                if (dueDate === completedDate && item.taskStatus == 'Done' || dueDate > completedDate && item.taskStatus == 'Done') {
                    completedOnTime++;
                    item.assignedTo.forEach(mem => {
                        const fullName = mem.firstName + mem.lastName;
                        assignedMembers.push(fullName)
                    })
                }
                else if (dueDate < completedDate && item.taskStatus == 'Done' || dueDate > new Date() && item.taskStatus !== 'Done') {
                    exceededTimeCount++;
                }
            });
            const uniqueMembers = [...new Set(assignedMembers)];

            let data = { totalCount: totalCount.length, newlyAdded: allTasks.length, onTimeSubmittedTasks: completedOnTime, exceededDueDate: exceededTimeCount, pendingTasks: (allTasks.length - (completedOnTime + exceededTimeCount)), ontimeCompletedMembers: uniqueMembers, tasks: allTasks };
            res.send(Responses.taskSuccessResp(taskMessage['TASK_FETCHED'][language ?? 'en'], data));

        }
        catch (err) {
            return res.send(Responses.taskFailResp("Failed to fetch task details", err.message));
        }

    }
}
export default new TaskService();
