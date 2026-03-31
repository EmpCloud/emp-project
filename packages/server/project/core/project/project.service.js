import Response from '../../response/response.js';
import ProjectValidation from './project.validate.js';
import Logger from '../../resources/logs/logger.log.js';
import {
    checkCollection,
    totalHours,
    fetchRemainingHours,
    fetchActualHours,
    viewFields,
    removeObjectNull,
    addNewDynamicFields,
    subtractAndFormat,
    configSelectFields,
    creatorDetails,
} from '../../utils/project.utils.js';
import { projectMessageNew, CommentMessageNew } from '../language/language.translator.js';
import { ObjectId } from 'mongodb';
import { configViewFieldSchema } from '../customFields/customFields.model.js';
import { activityOfUser } from '../../utils/activity.utils.js';
import { configFieldsAdd } from '../../utils/customFields.utils.js';
import event from '../event/eventEmitter.js';
import NotificationService from '../notifications/notifications.service.js';
import Reuse from '../../utils/reuse.js';
import adminSchema from '../admin/admin.model.js'
import projectComment from './projectComment.schema.js';
import subTaskComment from '../config/defaults/subtaskComment.schema.js';
import taskComment from '../config/defaults/taskComment.schema.js';
import groupSchema from '../groups/group.schema.js';
import moment from 'moment';
import clientModel from '../client/client.model.js';
import companyModel from '../client/company.module.js';
import adminModel from '../admin/admin.model.js';
import permissionModel from '../permissions/permission.model.js';
import { projectObj } from '../customFields/fields.constants.js';
import companyModule from '../client/company.module.js';
import planModel from '../plan/plan.model.js';
import { getPermissions } from '../../utils/project.utils.js';

/*
If there is any code that can are being used at other places, place them in the reuse.js 
in the utils folder.

the reuse files have the collection names, limit, skip, sort, etc.

To use them create a new object and then use it
e.g.   const reuse = new Reuse(req)
       \\ for group collection name
       reuse.collectionName.project ==> this will give the collection name
*/

class ProjectService {
    async create(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId, profilePic, language, adminName, planData, creatorId, permission, isAdmin } = reuse.result.userData?.userData;
        try {
            const data = req.body;
            Logger.info(data);
            const project = data?.project;

            // given Dynamic Fields adding in project
            const extraFieldValues = await configFieldsAdd(organizationId, project, res, language, organizationId);
            if (extraFieldValues.Error) {
                return res.send(Response.projectFailResp(projectMessageNew['VALIDATION_FAILED'][language ?? 'en'], extraFieldValues.Error));
            } else {
                const { value, error } = ProjectValidation.createProject(project);
                if (error) {
                    Logger.error(error);
                    return res.send(Response.projectFailResp(projectMessageNew['VALIDATION_FAILED'][language ?? 'en'], error?.details[0]?.message));
                }
                addNewDynamicFields(value, extraFieldValues.obj);
                //add valid clientCompany name in projects
                let isCompany, notExist = [];
                if (data.project[0].clientCompany?.length > 0) {
                    data.project[0]?.clientCompany?.map(async (client) => {
                        isCompany = await companyModel.findOne({ "clientCompany.companyName": client.companyName })
                        if (!isCompany) {
                            notExist.push(client)
                        }
                        return notExist;
                    })
                    if (notExist.length > 0) {
                        return res.status(429).send(Response.projectFailResp("Provided clientCompany is not valid,please check"));
                    }
                }
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']));
                // #1202 — Safely read projectFeatureCount with fallback for SSO users whose planData may be null
                const projectPlanCount = planData?.projectFeatureCount ?? 50;
                const projectCount = await db.collection(reuse.collectionName.project).find({ superUserId: Id }).toArray();
                let user, admin;
                projectCount.map(async (ele) => {
                    user = await adminModel.findOne({ _id: ele.projectCreatedBy.Id })
                    if (user) {
                        await db.collection(reuse.collectionName.project).findOneAndUpdate({ _id: ObjectId(ele._id) }, { $set: { "projectCreatedBy.isAdmin": user.isAdmin } }, { returnDocument: 'after' })
                    } else {
                        admin = await db.collection(reuse.collectionName.user).findOne({ _id: ObjectId(ele.projectCreatedBy.Id) });
                        await db.collection(reuse.collectionName.project).findOneAndUpdate({ _id: ObjectId(ele._id) }, { $set: { "projectCreatedBy.isAdmin": admin.isAdmin } }, { returnDocument: 'after' })
                    }
                })
                projectCount.map(async (assign) => {
                    assign?.userAssigned?.map(async (ele) => {
                        user = await adminModel.findOne({ _id: ele.id })
                        if (user) {
                            await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: ObjectId(assign._id) }, { $set: { "userAssigned.$[].isAdmin": user.isAdmin } }, { returnDocument: 'after' })
                        } else {
                            admin = await db.collection(reuse.collectionName.user).findOne({ _id: ObjectId(ele.id) });
                            await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: ObjectId(assign._id) }, { $set: { "userAssigned.$[].isAdmin": admin.isAdmin } }, { returnDocument: 'after' })
                        }
                    })
                })
                const projectTotalCount = projectCount.length + project.length;
                if (projectTotalCount > projectPlanCount) {
                    if (projectPlanCount - projectCount.length == 0) {
                        return res.status(429).send(Response.projectFailResp(projectMessageNew['PROJECT_PLAN_LIMIT'][language ?? 'en']));
                    } else {
                        return res.status(206).send(Response.projectFailResp(`Project adding limit is reaching in your plan, You can add only ${projectPlanCount - projectCount.length} project`));
                    }
                }
                //Iterating through the array of input JSON object
                const dataArray = value?.map(element => {
                    return element;
                });
                const totalIncomingProjects = dataArray.length;
                let ans = [];
                let errorCount = 0;
                for (const key of dataArray) {
                    //Creating the project
                    let isProjectExist = await db.collection(reuse.collectionName.project).findOne({ projectName: key?.projectName });
                    if (isProjectExist) {
                        ans.push(projectMessageNew['PROJECT_NAME_EXIST'][language ?? 'en']);
                        errorCount += 1;
                        break;
                    }
                    isProjectExist = await db.collection(reuse.collectionName.project).findOne({ projectCode: key?.projectCode });
                    if (isProjectExist) {
                        ans.push(projectMessageNew['PROJECT_CODE_EXIST'][language ?? 'en']);
                        errorCount += 1;
                        break;
                    }
                    if (!isProjectExist) {
                        //Checking if the user is present there in the users database
                        if (key?.userAssigned?.length) {
                            for (const [index, user] of key?.userAssigned.entries()) {
                                const userCheck = await db.collection(reuse.collectionName.user).findOne({ _id: ObjectId(user.id) });
                                user.isAdmin = userCheck?.isAdmin
                                if (!userCheck || userCheck.softDeleted) return res.send(Response.projectFailResp(projectMessageNew['USER_NOT_FOUND'][language ?? 'en'], user.id));
                                if (userCheck.invitation != 1) return res.send(Response.projectFailResp('Unable to assign user,please check invitation status of the user.'));
                                //if (userCheck.isSuspended === false) return res.send(Response.projectFailResp('Unable to assign user,user is suspended.'));
                                key.userAssigned[index].role = userCheck.role;
                            }
                        }
                        if (key?.group?.length) {
                            for (const group of key?.group) {
                                const groupCheck = await groupSchema.findOne({ _id: ObjectId(group.groupId) });
                                if (!groupCheck) return res.send(Response.projectFailResp(projectMessageNew['GROUP_NOT_FOUND'][language ?? 'en'], group.id));
                            }
                        }
                        /* code for calculate remaining or exceeded time

                        if (key?.estimationTime && key?.actualHours) {
                            if (key.actualHours <= key.estimationTime) {
                                key.remainingHours = subtractAndFormat(key.estimationTime, key.actualHours);
                            } else {
                                key.exceededHours = subtractAndFormat(key.actualHours, key.estimationTime);
                                key.remainingHours = '00:00';
                            }
                        }
                        */
                        key.adminName = adminName;
                        key.superUserId = Id;
                        key.softDeleted = false;
                        key.createdAt = new Date();
                        key.projectCreatedBy = {
                            Id: userId,
                            isAdmin: isAdmin
                            //Name: name,
                            //ProfilePic: profilePic,
                        };
                        //Creation of project
                        let fullName = name + " " + lastName;
                        const permissionCheck = await permissionModel.findOne({ permissionName: permission });
                        if (reuse.result.type === 'user' && permissionCheck.permissionConfig.project.create == false) {
                            return res.send(Response.projectFailResp(`You don't have permission to create Project`));
                        }
                        const response = await db.collection(reuse.collectionName.project).insertOne(key);
                        //Adding project to particuler client and company name
                        let projectIds = [{
                            id: response.insertedId.toString()
                        }]
                        if (notExist.length == 0) {
                            data.project[0]?.clientCompany?.map(async (client) => {
                                let findClient = await companyModel.findOne({ clientCompany: client.companyName })
                                if (findClient) {
                                    await companyModule.findByIdAndUpdate({ _id: findClient._id.toString() }, { $addToSet: { projectIds: projectIds } })
                                    findClient?.clientName?.map(async (Id) => {
                                        await clientModel.findByIdAndUpdate({ _id: Id.id }, { $addToSet: { projectIds: projectIds } })
                                    })
                                }
                            })
                        }
                        let projectDetails = activityOfUser(`${fullName} created the ${key.projectName} project.`, 'Project', name, 'Created', organizationId, userId, profilePic);
                        projectDetails['projectId'] = response.insertedId.toString();
                        event.emit('activity', projectDetails);
                        // Notification
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${fullName} Created ${key.projectName} project.`
                            await NotificationService.adminNotification(message, Id, userId, { collection: 'project', id: response.insertedId.toString() });
                            if (Id != creatorId && userId != creatorId) {
                                await NotificationService.userNotification(message, userId, creatorId, { collection: 'project', id: response.insertedId.toString() });
                            }
                        }
                        // To Users
                        if (key?.userAssigned?.length) {
                            for (const user of key?.userAssigned) {
                                const message = `${fullName} Added you in ${key.projectName} project.`;
                                await NotificationService.userNotification(message, userId, user.id, { collection: 'project', id: response.insertedId.toString() });
                            }
                            if (process.env.node_env !== 'localDev') {
                                event.emit('mail', key, reuse, db);
                            }
                        }
                        ans.push(Response.projectSuccessResp(projectMessageNew['PROJECT_CREATE_SUCCESS'][language ?? 'en'], { response, data: key }));
                    } else {
                        ans.push(Response.projectPartialSuccessResp(projectMessageNew['PROJECT_EXIST'][language ?? 'en']));
                        Logger.error('Project already exists');
                        errorCount += 1;
                    }
                }
                if (errorCount == totalIncomingProjects) {
                    return res.send(Response.projectPartialSuccessResp(projectMessageNew['PROJECT_EXIST'][language ?? 'en'], ans));
                } else if (errorCount > 0 && errorCount < totalIncomingProjects) {
                    return res.status(206).send(Response.projectPartialSuccessResp(projectMessageNew['PROJECT_EXIST'][language ?? 'en'], ans));
                } else {
                    const projectTotal = await db.collection(reuse.collectionName.project).countDocuments({});
                    const resp = {
                        projectCreatedCount: projectTotal,
                        projectRemainingCount: projectPlanCount - projectTotal,
                        ProjectData: ans,
                    };
                    return res.status(200).send(Response.projectSuccessResp(projectMessageNew['PROJECT_CREATE_SUCCESS'][language ?? 'en'], resp));
                }
            }
        } catch (err) {
            Logger.error(err);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_CREATE_FAILED'][language ?? 'en'], err));
        }
    }

    async postComment(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        if (reuse.result.state === true) {
            const { firstName: name, lastName: lastName, adminId: Id, _id: userId, profilePic: profilePic, language: language, orgId } = reuse.result.userData?.userData;
            try {
                const project_id = req?.query?.projectId;
                const comment = req?.body?.comment;
                const userNameInput = req?.body?.userName;
                if (comment == 'null') { return res.send(Response.commentFailResp("Comment is not allowed to be empty")) }
                const { error } = ProjectValidation.addComment({ comment });
                if (error) return res.send(Response.validationFailResp(CommentMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.details[0].message));
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(project_id) });
                if (!projectDetails) return res.send(Response.commentFailResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en']));
                const commentDetails = {
                    projectId: project_id,
                    comment: comment,
                    superUserId: Id,
                    isEdited: false,
                    orgId: orgId,
                    userName: userNameInput,
                    commentCreator: {
                        creatorId: userId,
                        creatorName: name,
                        creatorProfilePic: profilePic,
                    },
                    createdAt: new Date(),
                };
                const response = await projectComment.create(commentDetails);
                let taskId = null;
                if (response) {
                    if (reuse.result.type === 'user') {
                        // To Admin
                        const message = `${name + ' ' + lastName} commented on ${projectDetails.projectName} project`;
                        await NotificationService.adminCommentNotification(message, Id, response.commentCreator.creatorId, taskId, project_id, { collection: 'ProjectComment', id: response._id });
                    } else {
                        // To user
                        const message = `${name + ' ' + lastName} commented on ${projectDetails.projectName} project`;
                        await NotificationService.adminCommentNotification(message, Id, response.commentCreator.creatorId, taskId, project_id, { collection: 'ProjectComment', id: response._id });
                    }
                    if (response.userName) {
                        userNameInput?.map(async (ele) => {
                            const userDetails = await db.collection(reuse.collectionName.user).findOne({ userName: ele })
                            if (userDetails) {
                                const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails?.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails?.projectName} project`;
                                await NotificationService.UserCommentNotication(message, response.commentCreator.creatorId, userDetails._id.toString(), taskId, project_id, { collection: 'ProjectComment', id: response._id });
                            }
                            const adminDetails = await adminModel.findOne({ userName: ele })
                            if (adminDetails) {
                                const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails?.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails?.projectName} project`;
                                await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId, taskId, project_id, { collection: 'ProjectComment', id: response._id });
                            }

                        })
                    }
                }
                response
                    ? res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_ADD_SUCCESS'][language ?? 'en'], response))
                    : res.send(Response.commentFailResp(CommentMessageNew['COMMENT_ID_FOUND'][language ?? 'en']));
            } catch (err) {
                Logger.error(err);
                return res.send(Response.commentFailResp(CommentMessageNew['COMMENT_ADD_FAILED'][language ?? 'en'], err.message));
            }
        } else {
            return res.send(reuse.result);
        }
    }

    async getAll(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, profilePic: userProfilePic, language: language, orgId: organizationId ,permission} = reuse.result.userData?.userData;
        try {
            let permissions = await getPermissions(organizationId,permission);
            let managerLevelPermission = permissions?.permissionConfig?.otherProject?.view; 
            let projectsData = [];
            const sortBy = {};
            let orderby = reuse.orderby || 'createdAt';
            let extranlSort;
            if (orderby == 'taskCount' || orderby == 'subTaskCount' || orderby == 'progress') {
                extranlSort = orderby
                orderby = 'createdAt'
            }
            sortBy[orderby] = reuse.sort.toString() === 'asc' ? 1 : -1;
            let fullName = name + " " + lastName;
            let fieldValue,
                obj = {},
                fields;
            const configFields = await configViewFieldSchema.find({ orgId: organizationId });
            configFields.forEach(entry => {
                fields = entry['projectViewFields'];
            });
            let viewAccess, totalViewAccess;
            if (fields && fields.length > 0) {
                viewAccess = viewFields(fields, fieldValue, obj);
                const extraAccess = {
                    clientName: 1,
                    clientCompany: 1,
                    onHoldTasks: 1,
                    toatalOverDueTasks: 1,
                    toatalOverDueSubTasks: 1,
                    reason: 1,
                    completedDate: 1
                };
                totalViewAccess = { ...viewAccess, ...extraAccess };
            } else {
                totalViewAccess = {
                    projectName: 1, projectCode: 1, description: 1, startDate: 1, endDate: 1,
                    estimationDate: 1, plannedBudget: 1, actualBudget: 1, currencyType: 1,
                    userAssigned: 1, status: 1, progress: 1, group: 1, superUserId: 1,
                    adminName: 1, projectLogo: 1, softDeleted: 1, createdAt: 1, updatedAt: 1,
                    projectCreatedBy: 1, clientName: 1, clientCompany: 1,
                    onHoldTasks: 1, toatalOverDueTasks: 1, toatalOverDueSubTasks: 1,
                    reason: 1, completedDate: 1, labels: 1, priority: 1, url: 1, checkBox: 1,
                };
                viewAccess = totalViewAccess;
            }
            let filterData = [];
            filterData = Object.keys(totalViewAccess);
            if (orderby != '_id') {
                let outIn = filterData.filter(word => orderby.includes(word));
                if (outIn.length == 0) {
                    return res.send(Response.projectFailResp('Failed to search, please check config Fields'));
                }
            }
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const projectId = req?.query.id;
            let totalOverDueTasks, totalOverDueSubTasks, onHoldTasks;

            if (!projectId) {
                let projectCount, projects;
                if (reuse.result.type === 'user') {
                    if (reuse.result.userData?.userData.permission == 'admin') {
                        projectCount = await db.collection(reuse.collectionName.project).countDocuments({ superUserId: Id, softDeleted: false });
                        projects = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([{ $match: { superUserId: Id, softDeleted: false } }, { $sort: sortBy }, { $skip: reuse.skip }, { $limit: reuse.limit }, { $project: totalViewAccess }])
                            .toArray();

                    }
                    else {

                        const matchQuery = {
                            superUserId: Id,
                            softDeleted: false,
                          };
                          
                          if (managerLevelPermission===false) {
                            matchQuery.$or = [
                              { 'projectCreatedBy.Id': userId },
                              { 'userAssigned.id': userId },
                            ];
                          }
                          console.log(matchQuery,'matchQuery');
                          projectCount = await db
                            .collection(reuse.collectionName.project)
                            .countDocuments(matchQuery);
                          
                          projects = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([
                              { $match: matchQuery },
                              { $sort: sortBy },
                              { $skip: reuse.skip },
                              { $limit: reuse.limit },
                              { $project: totalViewAccess },
                            ])
                            .toArray();
                          
                    }
                } else {

                    projectCount = await db.collection(reuse.collectionName.project).countDocuments({ superUserId: Id, softDeleted: false });
                    projects = await db
                        .collection(reuse.collectionName.project)
                        .aggregate([{ $match: { superUserId: Id, softDeleted: false } }, { $sort: sortBy }, { $skip: reuse.skip }, { $limit: reuse.limit }, { $project: totalViewAccess }])
                        .toArray();
                    projects?.map(async (user) => {
                        user?.clientCompany?.map(async (ele) => {
                            const findData = await companyModel.findOne({ _id: ele?.id })
                            findData?.clientName?.map(async (ele2) => {
                                const FindClient = await clientModel.findOne({ _id: ele2?.id })
                                user.clientCompany.push({ clientName: FindClient?.clientName, clientId: FindClient?._id })
                            })

                        })
                    })
                }
                await Promise.all(
                    projects?.map(async project => {
                        //to get count of total task and completed task
                        const totalTaskCount = await db
                            .collection(reuse.collectionName.task)
                            .find({ projectId: ObjectId(project?._id).toString() })
                            .toArray();
                        let holdCount = 0;
                        totalTaskCount.map(hold => {
                            if (hold.taskStatus == 'Onhold') {
                                holdCount++;
                            }
                        })
                        onHoldTasks = holdCount;
                        let count = 0;
                        totalTaskCount.map(over => {
                            if (over.taskStatus != "Done" && over.dueDate < new Date()) {
                                count++;
                            }
                        })
                        totalOverDueTasks = count;
                        const taskCompleted = await db
                            .collection(reuse.collectionName.task)
                            .countDocuments({ projectId: ObjectId(project?._id).toString(), taskStatus: { $regex: new RegExp('^' + 'done', 'i') } });
                        //to get count of total subtask and completed subtask
                        const totalSubTaskCount = await db
                            .collection(reuse.collectionName.subTask)
                            .find({ projectId: ObjectId(project?._id).toString() })
                            .toArray();
                        let subtaskCount = 0
                        totalSubTaskCount.map(over => {
                            if (over.subTaskStatus != "Done" && over.dueDate < new Date()) {
                                subtaskCount++;
                            }
                        })
                        totalOverDueSubTasks = subtaskCount;
                        let projectStatus, ProjectCount = 1;
                        if (project.status.toLowerCase() == 'done') {
                            projectStatus = + 1;
                        }
                        let progressCount = totalTaskCount.length > 0 ? Math.round((taskCompleted / totalTaskCount.length) * 100) : project.progress;

                        let userAssignedCorrect = [];
                        if (project?.userAssigned) {
                            for (const [index, value] of project.userAssigned.entries()) {
                                const userDetails = await db
                                    .collection(reuse.collectionName.user)
                                    .aggregate([
                                        { $match: { _id: ObjectId(value.id), softDeleted: false, isSuspended: false } },
                                        {
                                            $project: reuse.userObj,
                                        },
                                    ])
                                    .toArray();
                                if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                            }
                        }
                        filterData.map(ele => {
                            switch (ele) {
                                case 'userAssigned':
                                    project.userAssigned = userAssignedCorrect ?? [];
                                    break;
                                case 'memberCount':
                                    project.memberCount = project?.userAssigned?.length ?? null;
                                    break;
                                case 'taskCount':
                                    project.taskCount = totalTaskCount?.length ?? 0;
                                    break;
                                case 'taskDetails':
                                    project.taskDetails = totalTaskCount ?? [];
                                    break;
                                case 'subTaskCount':
                                    project.subTaskCount = totalSubTaskCount?.length ?? 0;
                                    break;
                                case 'subTaskDetails':
                                    project.subTaskDetails = totalSubTaskCount ?? [];
                                    break;
                                case 'progress':
                                    project.progress = isNaN(progressCount) ? 0 : progressCount;
                                    break;
                                case 'onHoldTasks':
                                    project.onHoldTasks = onHoldTasks ?? 0;
                                case 'totalOverDueTasks':
                                    project.totalOverDueTasks = totalOverDueTasks ?? 0;
                                case 'totalOverDueSubTasks':
                                    project.totalOverDueSubTasks = totalOverDueSubTasks ?? 0;

                            }
                        });
                        let groupExist = [];
                        if (project?.group) {
                            for (const [index, value] of project.group.entries()) {
                                const groupDetails = await groupSchema
                                    .find({ _id: ObjectId(value.groupId) }, reuse.groupObj)
                                if (groupDetails.length) groupExist[index] = groupDetails[0];
                            }
                            project.group = groupExist;
                        }
                        if (project?.taskDetails?.length) await this.userDetails(project, db, reuse.collectionName.user);
                        await this.fetchCreator(project, reuse.collectionName.user, db);
                        let data = {
                            project: project,
                        };
                        projectsData.push(data);
                    })
                );
                let sortedArr = [];
                projects.forEach(project => {
                    sortedArr.push(projectsData.find(entry => entry.project._id == project._id));
                });
                let resultData = [];
                sortedArr.map(s => {
                    resultData.push(s?.project);
                });
                const resp = {
                    projectCount: projectCount,
                    skip: reuse.skip,
                    project: resultData,
                };
                if (reuse.sort == 'asc') {
                    if (extranlSort == 'Task Count') {
                        resp.project.sort(function (a, b) {
                            return a.taskCount - b.taskCount
                        })
                    }
                    if (extranlSort == 'SubTask Count') {
                        resp.project.sort(function (a, b) {
                            return a.subTaskCount - b.subTaskCount
                        })
                    }
                    if (extranlSort == 'progress') {
                        resp.project.sort(function (a, b) {
                            return a.progress - b.progress
                        })
                    }
                } else {
                    if (extranlSort == 'Task Count') {
                        resp.project.sort(function (a, b) {
                            return b.taskCount - a.taskCount
                        })
                    }
                    if (extranlSort == 'SubTask Count') {
                        resp.project.sort(function (a, b) {
                            return b.taskCount - a.taskCount
                        })
                    }
                    if (extranlSort == 'progress') {
                        resp.project.sort(function (a, b) {
                            return b.progress - a.progress
                        })
                    }
                }
                let projectViewDetails = activityOfUser(`${fullName} viewed All projects.`, 'Project', name, 'Viewed', organizationId, userId, userProfilePic);
                projectViewDetails['projectId'] = projectId ?? 'All';
                event.emit('activity', projectViewDetails);
                Logger.info(`success ${resp}`);
                return res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_FETCH_SUCCESS'][language ?? 'en'], resp));
            } else {
                const projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });

                projectDetails?.clientCompany?.map(async (ele) => {
                    const findData = await companyModel.findOne({ _id: ele?.id })
                    findData?.clientName?.map(async (ele2) => {
                        const FindClient = await clientModel.findOne({ _id: ele2?.id })
                        projectDetails.clientCompany.push({ clientName: FindClient?.clientName, clientId: FindClient?._id })
                    })

                })

                //to get count of total task and completed task
                const totalTaskCount = await db.collection(reuse.collectionName.task).find({ projectId: projectDetails._id.toString() }).toArray();
                let count = 0;
                totalTaskCount.map(over => {
                    if (over.taskStatus != "Done" && over.dueDate < new Date()) {
                        count++;
                    }
                })
                totalOverDueTasks = count;
                const taskCompleted = await db
                    .collection(reuse.collectionName.task)
                    .countDocuments({ projectId: projectDetails._id.toString(), taskStatus: { $regex: new RegExp('^' + 'done', 'i') } });
                //to get count of total subtask and completed subtask
                const totalSubTask = await db.collection(reuse.collectionName.subTask).find({ projectId: projectDetails._id.toString() }).toArray();
                let subtaskCount = 0
                totalSubTask.map(over => {
                    if (over.subTaskStatus != "Done" && over.dueDate < new Date()) {
                        subtaskCount++;
                    }
                })
                totalOverDueSubTasks = subtaskCount;
                let projectStatus, ProjectCount = 1;
                if (projectDetails.status.toLowerCase() == 'done') {
                    projectStatus = + 1;
                }
                const subtaskCompleted = await db
                    .collection(reuse.collectionName.subTask)
                    .countDocuments({ projectId: ObjectId(projectDetails?._id).toString(), subTaskStatus: { $regex: new RegExp('^' + 'done', 'i') } });
                let progressCount = totalTaskCount.length > 0 ? Math.round((taskCompleted / totalTaskCount.length) * 100) : projectDetails.progress;
                let groupExist = [];
                if (projectDetails?.group) {
                    for (const [index, value] of projectDetails.group.entries()) {
                        const groupDetails = await groupSchema
                            .find({ _id: ObjectId(value.groupId) }, reuse.groupObj);
                        if (groupDetails.length) groupExist[index] = groupDetails[0];
                    }
                    projectDetails.group = groupExist;
                }
                let userAssignedCorrect = [];
                if (projectDetails?.userAssigned) {
                    for (const value of projectDetails?.userAssigned) {
                        const userDetails = await db
                            .collection(reuse.collectionName.user)
                            .aggregate([
                                { $match: { _id: ObjectId(value.id), softDeleted: false, isSuspended: false } },
                                {
                                    $project: reuse.userObj,
                                },
                            ])
                            .toArray();
                        if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                    }
                }
                await this.fetchCreator(projectDetails, reuse.collectionName.user, db);
                projectDetails.userAssigned = userAssignedCorrect ?? [];
                projectDetails.memberCount = userAssignedCorrect?.length ?? 0;
                projectDetails.taskCount = totalTaskCount?.length ?? 0;
                projectDetails.taskDetails = totalTaskCount ?? [];
                projectDetails.completedTask = taskCompleted;
                projectDetails.pendingTak = totalTaskCount?.length - taskCompleted;
                projectDetails.completedSubTask = subtaskCompleted;
                projectDetails.pendingSubTak = totalSubTask?.length - subtaskCompleted;
                projectDetails.subTaskCount = totalSubTask?.length ?? 0;
                projectDetails.subTaskDetails = totalSubTask ?? [];
                projectDetails.progress = isNaN(progressCount) ? 0 : progressCount;
                projectDetails.totalOverDueTasks = totalOverDueTasks;
                projectDetails.totalOverDueSubTasks = totalOverDueSubTasks;
                projectDetails.onHoldTasks = onHoldTasks ?? 0;
                Logger.info(`success ${projectDetails}`);
                if (projectDetails?.taskDetails?.length || projectDetails?.subTaskDetails?.length) await this.userDetails(projectDetails, db, reuse.collectionName.user);
                const value = {
                    project: projectDetails,
                };
                let projectViewDetails = activityOfUser(`${fullName} viewed ${projectDetails.projectName} project.`, 'Project', name, 'Viewed', organizationId, userId, userProfilePic);
                projectViewDetails['projectId'] = projectId ?? 'All';
                event.emit('activity', projectViewDetails);
                projectDetails
                    ? res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_FETCH_SUCCESS'][language ?? 'en'], value))
                    : res.send(Response.projectFailResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en']));
            }
        } catch (err) {
            Logger.error(`err ${err}`);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_FETCH_FAIL'][language ?? 'en']));
        }
    }

    async getComment(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        if (reuse.result.state === true) {
            const language = reuse.result.userData?.userData.language;
            const orgId = reuse.result.userData?.userData?.orgId;
            try {
                const projectId = req?.query?.projectId;
                const commentId = req?.query?.commentId;
                const sortBy = {};
                sortBy[reuse.orderby || 'createdAt'] = reuse.sort.toString() === 'desc' ? -1 : 1;
                //checking collection
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}, you unable to add comment`));
                if (!projectId && !commentId) {
                    return res.send(Response.commentFailResp(CommentMessageNew['ATLEST_ID_REQUIRED'][language ?? 'en']));
                }
                if (projectId && commentId) {
                    const isPresent = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });

                    if (!isPresent) {
                        res.send(Response.commentFailResp('Comments not present, please check project Id'));
                    }
                    let response = await projectComment
                        .find({ _id: ObjectId(req.query.commentId), projectId: req?.query?.projectId })

                    Logger.info(`success ${response}`);
                    response.length
                        ? res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_FETCH_SUCCESS'][language ?? 'en'], response))
                        : res.send(Response.commentFailResp(CommentMessageNew['COMMENT_ID_FOUND'][language ?? 'en']));
                    //fetching comments under one project
                } else if (projectId) {
                    const projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) })
                    if (!projectDetails) {
                        res.send(Response.commentSuccessResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en'], null));
                    }
                    const response = await projectComment.find({ projectId: projectId, orgId: orgId }).sort(sortBy).limit(reuse.limit).skip(reuse.skip)
                    Logger.info(`success ${response}`);
                    response.length
                        ? res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_FETCH_SUCCESS'][language ?? 'en'], response))
                        : res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_PRO_FAIL'][language ?? 'en'], null));
                    //fetching comment based on comment Id
                } else {
                    let response = await projectComment.findOne({ _id: ObjectId(commentId) });
                    Logger.info(`success ${response}`);
                    response
                        ? res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_FETCH_SUCCESS'][language ?? 'en'], response))
                        : res.send(Response.commentFailResp(CommentMessageNew['COMMENT_ID_FOUND'][language ?? 'en']));
                }
            } catch (err) {
                Logger.error(err);
                return res.send(Response.commentFailResp(CommentMessageNew['COMMENT_FETCH_FAIL'][language ?? 'en'], err.message));
            }
        } else {
            return res.send(reuse.result);
        }
    }

    async update(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId, profilePic: profilePic, language: language, creatorId, permission } = reuse.result.userData?.userData;
        try {

            const text = req.body;
            let fullName = name + " " + lastName
            const db = await checkCollection(reuse.collectionName.project);

            let permissions = await getPermissions(organizationId,permission);
            let managerLevelPermission = permissions?.permissionConfig?.otherProject?.edit; 
            const userProject = await db
            .collection(reuse.collectionName.project)
            .find({
              _id: ObjectId(req.params.id),
              'userAssigned.id': { $ne: userId } // NOTE: userId should be a string here
            })
            .toArray(); 


            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const projectExist = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(req.params.id) });
            if (!projectExist) {
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en']))
            }
            if (!text.startDate) {
                text['startDate'] = projectExist.startDate;
            }
            if (!text.estimationDate) {
                text['estimationDate'] = projectExist.estimationDate;
            }
            let { startDate, estimationDate, ...info } = text;
            const { value, error } = ProjectValidation.updateProject(text);
            if (error) {
                Logger.error(`error ${error}`);
                return res.send(Response.validationFailResp(error?.details[0]?.message, error?.details[0]?.message));
            }
            //add valid clientCompany name in projects
            let isCompany, notExist = [];
            if (text?.clientCompany?.length > 0) {
                text?.clientCompany?.map(async (client) => {
                    isCompany = await companyModel.findOne({ clientCompany: client.companyName })
                    if (!isCompany) {
                        notExist.push(client)
                    }
                    return notExist;
                })
                if (notExist?.length > 0) {
                    return res.status(429).send(Response.projectFailResp("Provided clientCompany is not valid,please check"));
                }
            }
            const isProjectExist = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(req.params.id) });
            const isProjectNameExist = await db.collection(reuse.collectionName.project).findOne({ _id: { $ne: ObjectId(req.params.id) }, projectName: value?.projectName });
            if (isProjectNameExist) {
                Logger.error('Project already exists');
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_EXIST'][language ?? 'en']));
            }
            if (value.projectCode) {
                const isProjectCodeExist = await db
                    .collection(reuse.collectionName.project)
                    .findOne({ _id: { $ne: ObjectId(req.params.id) }, projectCode: { $regex: new RegExp('^' + value?.projectCode.toLowerCase(), 'i') } });
                if (isProjectCodeExist) {
                    Logger.error('Project Code already exists');
                    return res.send(Response.projectFailResp(projectMessageNew['PROJECT_CODE_EXISTS'][language ?? 'en']));
                }
            }
            if (value.status) {
                const taskCollectionName = reuse.collectionName.task;
                const db = await checkCollection(taskCollectionName);
                if (!db) return res.send(Response.projectFailResp(`Task ${CommentMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                let statusCheck = await db.collection(taskCollectionName).find({ projectId: req.params.id }).toArray();
                if (statusCheck.length == 0) {
                    if (value.status === 'Inprogress') {
                        value.progress = 50;
                    }
                    else if (value.status === 'Done') {
                        value.progress = 100;
                        value.completedDate = new Date()
                    }
                    else {
                        value.progress = projectExist.progress
                    }
                }
                if (statusCheck.length > 0) {
                    let count = 0;
                    statusCheck.map(ele => {
                        if (ele.taskStatus == 'Done') {
                            count++;
                        }
                    })
                    if (statusCheck.length != count && value.status == 'Done') {
                        return res.send(Response.projectFailResp('Not able to update project status as Done, please check status of tasks'));
                    }
                }
            }
            if (value?.userAssigned?.length) {
                for (const ele of value?.userAssigned) {
                    let userExist = await db
                        .collection(reuse.collectionName.user)
                        .find({ _id: ObjectId(ele.id), softDeleted: false })
                        .toArray();
                    ele.isAdmin = userExist?.isAdmin;
                    if (!userExist.length) return res.send(Response.projectFailResp(projectMessageNew['USER_NOT_FOUND'][language ?? 'en']));
                }
            }
            if (value?.group?.length) {
                for (const group of value?.group) {
                    const groupCheck = await groupSchema.findOne({ _id: ObjectId(group.groupId) });
                    if (!groupCheck) return res.send(Response.projectFailResp(projectMessageNew['GROUP_NOT_FOUND'][language ?? 'en'], group.id));
                }
            }
            value.updatedAt = new Date();
            value.updatedBy = userId;
            let data
            if (reuse.result.type === 'user' && permission != 'admin'&& managerLevelPermission !== true) {
                data = await db.collection(reuse.collectionName.project).findOneAndUpdate(
                    {
                        $and: [
                            { _id: ObjectId(req.params.id) },
                            { $or: [{ 'projectCreatedBy.Id': userId }, { 'userAssigned.id': userId }] }
                        ]
                    }, { $set: value }, { returnDocument: 'after' })
                if (!data.value) {
                    return res.send(Response.projectFailResp(`You don't have access to edit project`));
                }
            } else if(reuse.result.type === 'user' && permission != 'admin' && managerLevelPermission === true){
                let access = await permissionModel.findOne({ permissionName: permission });
                let AccessKeys = [];
                let AccessValue = {};
                Object.entries(access?.permissionConfig).forEach(entry => {
                    const [key, value] = entry;
                    AccessKeys.push(key)
                    AccessValue = value;
                })
                if ((AccessKeys.includes('project') === false) || (access.permissionConfig.project.edit == false)) {
                    return res.send(Response.projectFailResp(`You do not have access to update project, Please contact your admin for permission`));
                }
                if((AccessKeys.includes('otherProject') === false) || (access.permissionConfig.otherProject.edit == false) && userProject?.length>0){
                    return res.send(Response.projectFailResp(`You do not have access to update unassigned Project, Please contact your admin for permission`));
                }


                data = await db.collection(reuse.collectionName.project).findOneAndUpdate(
                    { 
                        _id: ObjectId(req.params.id)
                    }, { $set: value }, { returnDocument: 'after' })
                if (!data.value) {
                    return res.send(Response.projectFailResp(`You don't have access to edit other project`));
                }
            }else {
                data = await db.collection(reuse.collectionName.project).findOneAndUpdate(
                    { _id: ObjectId(req.params.id) }, { $set: value }, { returnDocument: 'after' });
            }
            //Adding project Ids to particular client and comapny modules
            let projectIds = [{
                id: data.value._id
            }
            ]
            if (notExist?.length == 0) {
                text?.clientCompany?.map(async (client) => {
                    let findClient = await companyModel.findOne({ clientCompany: client.companyName })
                    if (findClient) {
                        await companyModule.findByIdAndUpdate({ _id: findClient._id.toString() }, { $addToSet: { projectIds: projectIds } })
                        findClient?.clientName?.map(async (Id) => {
                            await clientModel.findByIdAndUpdate({ _id: Id.id }, { $addToSet: { projectIds: projectIds } })
                        })

                    }
                })
            }
            let changed_property = [];

            Object.keys(info).forEach(entry => {
                changed_property.push(`${entry}`);
            });

            //Activity part
            let activityDetails = activityOfUser(`${fullName} updated ${changed_property} in ${data.value.projectName} project`, 'Project', name, 'Updated', organizationId, userId, profilePic);
            activityDetails['projectId'] = req.params.id;
            event.emit('activity', activityDetails);

            // Notification part
            if (reuse.result.type === 'user') {
                // To Admin`
                const message = `${fullName} updated ${changed_property} in ${data.value.projectName} project `;
                await NotificationService.adminNotification(message, Id, userId, { collection: 'project', id: data.value._id.toString() });
                if (Id != creatorId && userId != creatorId) {
                    await NotificationService.userNotification(message, userId, creatorId, { collection: 'project', id: data.value._id.toString() });
                }
            }
            // To Users
            if (isProjectExist?.userAssigned?.length) {
                for (const user of isProjectExist?.userAssigned) {
                    const message = `${fullName} updated ${changed_property} in ${data.value.projectName} project`;
                    await NotificationService.userNotification(message, userId, user.id, { collection: 'project', id: data.value._id.toString() });
                }
            }
            // To new added users
            if (value?.userAssigned?.length) {
                for (const user of value?.userAssigned) {
                    if (isProjectExist?.userAssigned.includes(user.id) === false) {
                        const message = `${fullName} Added you in project ${data.value.projectName}`;
                        await NotificationService.userNotification(message, userId, user.id, { collection: 'project', id: data.value._id.toString() });
                    }
                }
            }
            if (process.env.node_env !== 'localDev') {
                event.emit('email', value, data, isProjectExist, reuse, db);
            }
            Logger.info(`success ${data}`);
            if (data.value) {
                const taskdb = await checkCollection(reuse.collectionName.task);
                if (!taskdb) return res.send(Response.projectFailResp(`task ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                let updateValue =
                {
                    projectName: data?.value?.projectName,
                    projectCode: data.value.projectCode
                }
                await taskdb.collection(reuse.collectionName.task).updateMany({ projectId: data?.value?._id.toString() }, { $set: updateValue }, { returnDocument: 'after' });
                Logger.info(`Updated projectName, projectCode in tasks`);
                res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_UPDATE_SUCCESS'][language ?? 'en'], data.value))
            }
            else { return res.send(Response.projectFailResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en'])); }
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_UPDATE_FAIL'][language ?? 'en']));
        }
    }

    async updateComment(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        if (reuse.result.state === true) {
            const { language, _id: userId, userName, adminId: Id, firstName: name, lastName: lastName, profilePic } = reuse.result.userData?.userData;
            try {
                const comment = req.body.comment;
                const userNameInput = req.body.userName;
                if (comment == 'null') { return res.send(Response.commentFailResp("Comment is not allowed to be empty")); }
                const { value, error } = ProjectValidation.updateCommentValidate({ comment, userNameInput });

                if (error) return res.send(Response.validationFailResp(CommentMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.details[0].message));
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}, you unable to add comment`));
                value.updatedAt = new Date();
                let response;
                if (reuse.result.type === 'user') {
                    response = await projectComment.findOneAndUpdate({ _id: ObjectId(req.query.commentId), 'commentCreator.Id': userId }, { $set: value }, { returnDocument: 'after' });
                } else {
                    response = await projectComment.findOneAndUpdate({ _id: ObjectId(req.query.commentId) }, { $set: value }, { returnDocument: 'after' });
                }
                let projectDetails;
                if (response) {
                    projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(response.projectId) });
                }
                if (reuse.result.type === 'user') {
                    // To Admin
                    const message = `${name + ' ' + lastName} updated comment in ${projectDetails.projectName}`;
                    await NotificationService.adminCommentNotification(message, Id, response.commentCreator.creatorId, taskId, response.projectId, { collection: 'ProjectComment', id: response._id });
                } else {
                    // To user
                    const message = `${name + ' ' + lastName} updated comment in ${projectDetails.projectName}`;
                    await NotificationService.adminCommentNotification(message, userId, response.commentCreator.creatorId, taskId, response.projectId, { collection: 'ProjectComment', id: response._id });
                }
                if (response.userName) {
                    userNameInput?.map(async (ele) => {
                        const userDetails = await db.collection(reuse.collectionName.user).findOne({ userName: ele })
                        let taskId = null;
                        if (userDetails) {
                            const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails.projectName} project`;;
                            await NotificationService.UserCommentNotication(message, response.commentCreator.creatorId, userDetails._id, taskId, response.projectId, { collection: 'ProjectComment', id: response._id });
                        }
                        const adminDetails = await adminModel.findOne({ userName: ele })
                        if (adminDetails) {
                            const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails.projectName} project`;
                            await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId, taskId, response.projectId, { collection: 'ProjectComment', id: response._id });
                        }

                    })
                }

                response
                    ? res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_UPDATE_SUCCESS'][language ?? 'en'], response))
                    : res.send(Response.commentFailResp(CommentMessageNew['COMMENT_ID_FOUND'][language ?? 'en']));
            } catch (err) {
                Logger.error(err);
                return res.send(Response.commentFailResp(CommentMessageNew['COMMENT_UPDATE_FAIL'][language ?? 'en'], err.message));
            }
        } else {
            return res.send(reuse.result);
        }
    }

    async delete(req, res) {
        const reuse = new Reuse(req);
        const { firstName: userName, lastName: lastName, adminId: Id, _id: userId, profilePic: userProfilePic, orgId: organizationId, language: language, creatorId, permission } = reuse.result.userData?.userData;
        try {
            const projectId = req.query.id;
            let fullName = userName + " " + lastName
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let response, getProject;
            if (projectId) {
                getProject = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });
                if (getProject.status != 'Done') {
                    return res.send(Response.projectFailResp(projectMessageNew['PROJECT_STATUS_NOT_DONE'][language ?? 'en']));
                }
                if (reuse.result.type === 'user' && permission != 'admin') {
                    response = await db.collection(reuse.collectionName.project).deleteOne({ _id: ObjectId(projectId), 'projectCreatedBy.Id': userId });
                    if (response.deletedCount == 0) return res.send(Response.projectFailResp(`You can't delete projects which are created by someone else`));
                } else {
                    response = await db.collection(reuse.collectionName.project).deleteOne({ _id: ObjectId(projectId) });
                }
                if (response.deletedCount) {
                    await projectComment.deleteMany({ project_id: projectId });
                    await taskComment.deleteMany({ project_id: projectId });
                    await db.collection(reuse.collectionName.task).deleteMany({ projectId: projectId });
                    await db.collection(reuse.collectionName.subTask).deleteMany({ projectId: projectId });
                    await subTaskComment.deleteMany({ project_id: projectId });
                }
                let activityDetails = activityOfUser(`${userName + ' ' + lastName} deleted the project ${getProject.projectName}`, 'Project', userName, 'Deleted', organizationId, userId, userProfilePic);
                activityDetails['projectId'] = projectId;
                event.emit('activity', activityDetails);

                // Notification
                if (reuse.result.type === 'user') {
                    // To Admin
                    const message = `${fullName} Deleted the project ${getProject.projectName}`;
                    await NotificationService.adminNotification(message, Id, userId, { collection: 'project', id: getProject._id.toString() });
                    if (Id != creatorId && userId != creatorId) {
                        await NotificationService.userNotification(message, userId, creatorId, { collection: 'project', id: getProject._id.toString() });
                    }
                }
                // To Users
                if (getProject?.userAssigned?.length) {
                    for (const user of getProject?.userAssigned) {
                        const message = ` ${fullName} Deleted the project ${getProject.projectName}`;
                        await NotificationService.userNotification(message, userId, user.id, { collection: 'project', id: getProject._id.toString() });
                    }
                }
                response.deletedCount
                    ? res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_DELETE_SUCCESS'][language ?? 'en'], response))
                    : res.send(Response.projectFailResp(projectMessageNew['PROJECT_DELETE_FAIL'][language ?? 'en']));
            } else {
                getProject = reuse.result.type === 'user' && permission != 'admin' ?
                    await db.collection(reuse.collectionName.project).find({ 'projectCreatedBy.Id': userId }).toArray()

                    : await db.collection(reuse.collectionName.project).find({ superUserId: Id }).toArray();

                let doneProjects = [];
                let notDoneProjects = [];
                if (getProject) {
                    for (const project of getProject) {

                        const projectData = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([{ $match: { _id: ObjectId(project._id), status: { $eq: 'Done' } } }])
                            .toArray();
                        projectData?.length == 0 ? notDoneProjects.push({ id: project._id }) : doneProjects.push({ id: project._id });

                    }
                    if (notDoneProjects.length > 0 && doneProjects.length == 0) {
                        return res.status(400).send(Response.projectFailResp('No completed projects found', notDoneProjects,));
                    }
                    if (notDoneProjects.length == 0 && doneProjects.length == 0) {
                        return res.status(400).send(Response.projectFailResp('No Projects Found'));
                    }
                    let removedCount = 0;
                    if (doneProjects?.length > 0) {
                        for (const ele of doneProjects) {
                            let count = await db.collection(reuse.collectionName.project).deleteMany({ _id: ObjectId(ele.id) });
                            await projectComment.deleteMany({ project_id: ele.id.toString() });
                            await taskComment.deleteMany({ project_id: ele.id.toString() });
                            await db.collection(reuse.collectionName.task).deleteMany({ projectId: ele.id.toString() });
                            await subTaskComment.deleteMany({ project_id: ele.id.toString() });
                            await db.collection(reuse.collectionName.subTask).deleteMany({ projectId: ele.id.toString() });
                            if (count?.deletedCount) {
                                removedCount++;
                            }
                        }
                        //activity of delete project by user or admin
                        let activityDetails = activityOfUser(`${fullName} deleted all the projects `, 'Project', userName, 'Deleted', organizationId, userId, userProfilePic);
                        activityDetails['projectId'] = projectId ?? 'All';
                        event.emit('activity', activityDetails);
                        // Notification
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${fullName} Deleted all projects`;
                            await NotificationService.adminNotification(message, Id, userId, { collection: 'project', id: null });
                            if (Id != creatorId && userId != creatorId) {
                                await NotificationService.userNotification(message, userId, creatorId, { collection: 'project', id: null });
                            }
                        }
                        res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_DELETE_SUCCESS'][language ?? 'en'], { deletedCount: removedCount, deletedProject: doneProjects }));
                    }
                }

            }
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_DELETE_FAIL'][language ?? 'en'], err.message));
        }
    }

    async deleteComment(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        if (reuse.result.state === true) {
            const { language, _id: userId } = reuse.result.userData?.userData;
            try {
                const project_id = req?.query?.projectId;
                const commentId = req?.query?.commentId;
                let response;
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}, you unable to add comment`));
                if (project_id) {
                    if (reuse.result.type === 'user') {
                        return res.send(Response.commentFailResp(projectMessageNew['USER_DELETE_ACCESS'][language ?? 'en']));
                    }
                    const commentDetails = await projectComment.findOne({ projectId: project_id });
                    if (!commentDetails) return res.send(Response.commentFailResp(projectMessageNew['PROJECT_ID_NOT_FOUND'][language ?? 'en']));
                    response = await projectComment.deleteMany({ projectId: project_id });
                }
                if (commentId) {
                    if (reuse.result.type === 'user') {
                        response = await projectComment.deleteOne({ _id: ObjectId(req?.query?.commentId), 'commentCreator.Id': userId });
                    } else {
                        response = await projectComment.deleteOne({ _id: ObjectId(req?.query?.commentId) });
                    }
                }
                response.deletedCount
                    ? res.send(Response.commentSuccessResp(CommentMessageNew['COMMENT_DELETE_SUCCESS'][language ?? 'en'], response))
                    : res.send(Response.commentFailResp(CommentMessageNew['COMMENT_DELETE_FAIL'][language ?? 'en']));
            } catch (err) {
                Logger.error(err);
                return res.send(Response.commentFailResp(CommentMessageNew['COMMENT_DELETE_FAIL'][language ?? 'en'], err.message));
            }
        } else {
            return res.send(reuse.result);
        }
    }

    async search(req, res) {
        const reuse = new Reuse(req);
        const { adminId: Id, _id: userId, language, firstName, lastName, orgId: organizationId, profilePic: userProfilePic } = reuse.result.userData?.userData;
        try {
            let projectsData = [];
            let orderby = reuse.orderby || '_id';
            let fieldValue,
                obj = {},
                fields;
            let extranlSort
            if (orderby == 'taskCount' || orderby == 'subTaskCount') {
                extranlSort = orderby
                orderby = '_id'
            }
            const configFields = await configViewFieldSchema.find({ orgId: organizationId });
            configFields.forEach(entry => {
                fields = entry['projectViewFields'];
            });
            let viewAccess, totalViewAccess;
            if (fields && fields.length > 0) {
                viewAccess = viewFields(fields, fieldValue, obj);
                const extraAccess = {
                    clientName: 1,
                    clientCompany: 1,
                    reason: 1,
                    completedDate: 1
                };
                totalViewAccess = { ...viewAccess, ...extraAccess };
            } else {
                // No config fields found — use a default projection that includes all common fields
                totalViewAccess = {
                    projectName: 1, projectCode: 1, description: 1, startDate: 1, endDate: 1,
                    estimationDate: 1, plannedBudget: 1, actualBudget: 1, currencyType: 1,
                    userAssigned: 1, status: 1, progress: 1, group: 1, superUserId: 1,
                    adminName: 1, projectLogo: 1, softDeleted: 1, createdAt: 1, updatedAt: 1,
                    projectCreatedBy: 1, clientName: 1, clientCompany: 1, reason: 1, completedDate: 1,
                    labels: 1, priority: 1, url: 1, checkBox: 1,
                };
                viewAccess = totalViewAccess;
            }
            let filterData = [];
            filterData = Object.keys(viewAccess);
            if (orderby != '_id') {
                let outIn = filterData.filter(word => orderby.includes(word));
                if (outIn.length == 0) {
                    return res.send(Response.projectFailResp('Failed to search, please check config Fields'));
                }
            }
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let query = {};
            if (req?.query.keyword) {
                let keyword = req?.query.keyword;
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Response.projectFailResp('Failed to search, please check keyword'));
                }
                Logger.info(keyword);
                query.$or = [
                    { projectName: new RegExp(keyword, 'i') },
                    { projectCode: new RegExp(keyword, 'i') },
                    { status: new RegExp(keyword, 'i') },
                    { 'sponsor.firstName': new RegExp(keyword, 'i') },
                    { 'members.firstName': new RegExp(keyword, 'i') },
                    { 'manager.firstName': new RegExp(keyword, 'i') },
                    { 'owner.firstName': new RegExp(keyword, 'i') },
                    { plannedBudget: parseInt(keyword) },
                    { actualBudget: parseInt(keyword) },
                    { updatedAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { createdAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    { currency: new RegExp(keyword, 'i') },
                    { description: new RegExp(keyword, 'i') },
                    { clientName: new RegExp(keyword, 'i') },
                    { clientCompany: new RegExp(keyword, 'i') }
                ];
            }
            const sortBy = {};
            sortBy[orderby || 'projectName'] = reuse.sort.toString() === 'asc' ? 1 : -1;
            let projectComplete, resp;
            if (reuse.result.type === 'user') {
                if (reuse.result.userData?.userData.permission == 'admin') {
                    projectComplete = await db.collection(reuse.collectionName.project).countDocuments({
                        $and: [
                            query, { superUserId: Id }
                        ]
                    });
                    resp = await db
                        .collection(reuse.collectionName.project)
                        .aggregate([
                            { $match: { $and: [query, { superUserId: Id }] } }, //{ collation: { locale: 'en', caseFirst: 'upper' } })
                            { $sort: sortBy },
                            { $skip: reuse.skip },
                            { $limit: reuse.limit },
                            { $project: totalViewAccess },
                        ])
                        .toArray();
                }
                else {
                    projectComplete = await db.collection(reuse.collectionName.project).countDocuments({
                        $or: [
                            { 'projectCreatedBy.Id': userId },
                            { 'userAssigned.id': userId },
                        ],
                        $and: [
                            query
                        ]
                    });
                    resp = await db
                        .collection(reuse.collectionName.project)
                        .aggregate([
                            { $match: { $and: [query, { $or: [{ 'projectCreatedBy.Id': userId }, { 'userAssigned.id': userId }] }] } }, // { collation: { locale: 'en', caseFirst: 'upper' } }
                            { $sort: sortBy },
                            { $skip: reuse.skip },
                            { $limit: reuse.limit },
                            { $project: totalViewAccess },
                        ])
                        .toArray();
                }

            } else {
                projectComplete = await db.collection(reuse.collectionName.project).countDocuments({
                    $and: [
                        query, { superUserId: Id }
                    ]
                });
                resp = await db
                    .collection(reuse.collectionName.project)
                    .aggregate([
                        { $match: { $and: [query, { superUserId: Id }] } }, //{ collation: { locale: 'en', caseFirst: 'upper' } })
                        { $sort: sortBy },
                        { $skip: reuse.skip },
                        { $limit: reuse.limit },
                        { $project: totalViewAccess },
                    ])
                    .toArray();
            }

            for (let project of resp) {
                const totalTaskCount = await db
                    .collection(reuse.collectionName.task)
                    .find({ projectId: ObjectId(project?._id).toString() })
                    .toArray();
                const taskCompleted = await db
                    .collection(reuse.collectionName.task)
                    .countDocuments({ projectId: ObjectId(project?._id).toString(), taskStatus: { $regex: new RegExp('^' + 'done', 'i') } });
                const totalSubTaskCount = await db
                    .collection(reuse.collectionName.subTask)
                    .find({ projectId: ObjectId(project?._id).toString() })
                    .toArray();

                const subtaskCompleted = await db
                    .collection(reuse.collectionName.subTask)
                    .countDocuments({ projectId: ObjectId(project?._id).toString(), subTaskStatus: { $regex: new RegExp('^' + 'done', 'i') } });

                let progressCount = totalTaskCount.length > 0 ? Math.round((taskCompleted / totalTaskCount.length) * 100) : project.progress
                let userAssignedCorrect = [];
                if (project?.userAssigned) {
                    for (const [index, value] of project.userAssigned.entries()) {
                        const userDetails = await db
                            .collection(reuse.collectionName.user)
                            .aggregate([
                                { $match: { _id: ObjectId(value.id), softDeleted: false, isSuspended: false } },
                                {
                                    $project: reuse.userObj,
                                },
                            ])
                            .toArray();
                        if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                    }
                    project.userAssigned = userAssignedCorrect;
                    project.memberCount = userAssignedCorrect?.length;
                    project.taskCount = totalTaskCount?.length;
                    project.completedTask = taskCompleted
                    project.pendingTak = totalTaskCount?.length - taskCompleted
                    project.completedSubTask = subtaskCompleted
                    project.pendingSubTak = totalSubTaskCount?.length - subtaskCompleted
                    project.taskDetails = totalTaskCount;
                    project.subTaskCount = totalSubTaskCount?.length;
                    project.subTaskDetails = totalSubTaskCount;
                    project.progress = isNaN(progressCount) ? 0 : progressCount;
                }
                let groupExist = [];
                if (project?.group) {
                    for (const value of project.group) {
                        const groupDetails = await groupSchema.find({ _id: ObjectId(value.groupId) }, reuse.groupObj)

                        if (groupDetails.length) groupExist.push(groupDetails[0]);
                    }
                    project.group = groupExist;
                }

                const clientCompanies = project?.clientCompany;

                if (clientCompanies) {
                    for (let i = 0; i < clientCompanies.length; i++) {
                        const ele = clientCompanies[i];
                        const findData = await companyModel.findOne({ _id: ele?.id });
                        if (findData) {
                            const clientNames = findData.clientName;

                            for (let j = 0; j < clientNames.length; j++) {
                                const ele2 = clientNames[j];
                                const FindClient = await clientModel.findOne({ _id: ele2?.id });

                                if (FindClient) {
                                    project.clientCompany.push({ clientName: FindClient?.clientName, clientId: FindClient?._id });
                                }
                            }
                        }
                    }
                }

                if (project?.taskDetails?.length) await this.userDetails(project, db, reuse.collectionName.user);
                await this.fetchCreator(project, reuse.collectionName.user, db);
                let filterData = {
                    project,
                };
                projectsData.push(filterData);
            }
            let resultData = [];
            projectsData.map(p => resultData.push(p.project));
            let data = {
                skip: reuse.skip,
                projectCount: projectComplete,
                project: resultData,
            };
            if (reuse.sort == 'asc') {
                if (extranlSort == 'taskCount') {
                    data.project.sort(function (a, b) {
                        return a.taskCount - b.taskCount
                    })
                }
                if (extranlSort == 'subTaskCount') {
                    data.project.sort(function (a, b) {
                        return a.subTaskCount - b.subTaskCount
                    })
                }
            } else {
                if (extranlSort == 'taskCount') {
                    data.project.sort(function (a, b) {
                        return b.taskCount - a.taskCount
                    })
                }
                if (extranlSort == 'subTaskCount') {
                    data.project.sort(function (a, b) {
                        return b.taskCount - a.taskCount
                    })
                }
            }
            Logger.info(data);
            let activityDetails = activityOfUser(`${firstName + lastName} searched the project`, 'Project', firstName, 'Searched', organizationId, userId, userProfilePic);
            Logger.info(activityDetails);
            event.emit('activity', activityDetails);
            return res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_SEARCH'][language ?? 'en'], data));
        } catch (error) {
            Logger.error(`error ${error}`);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_SEARCH_FAIL'][language ?? 'en'], error));
        }
    }

    async filter(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language, orgId: organizationId, firstName: name, lastName, profilePic: userProfilePic ,permission} = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const skipValue = reuse.skip;
                const limitValue = reuse.limit;
                const sortBy = {};
                let orderby = reuse.orderby || 'createdAt';
                let extranlSort;
                if (orderby == 'taskCount' || orderby == 'subTaskCount' || orderby == 'progress') {
                    extranlSort = orderby
                    orderby = 'createdAt'
                }
                sortBy[orderby] = reuse.sort.toString() === 'asc' ? 1 : -1;
                const obj = await removeObjectNull(req?.body);
                const { value, error } = ProjectValidation.filterValidation(obj);
                Logger.error(error);
                if (error) return res.send(Response.projectFailResp(projectMessageNew['VALIDATION_FAILED'][language ?? 'en'], error?.details[0]?.message));
                if (JSON.stringify(value) == '{}') {
                    return res.send(Response.projectFailResp(projectMessageNew['FIELD_NOT_SELECTED'][language ?? 'en']));
                }
                let fieldValue,
                    object = {},
                    fields;
                const configFields = await configViewFieldSchema.find({ orgId: organizationId });
                configFields.forEach(entry => {
                    fields = entry['projectViewFields'];
                });
                let viewAccess = viewFields(fields, fieldValue, object);
                const extraAccess = {
                    clientName: 1,
                    clientCompany: 1,
                    reason: 1,
                    completedDate: 1
                };
                let totalViewAccess = { ...viewAccess, ...extraAccess };
                const db = await checkCollection(reuse.collectionName.project);

                let permissions = await getPermissions(organizationId,permission);
                let managerLevelPermission = permissions?.permissionConfig?.otherProject?.view; 
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                let query = [];
                let response,
                    myFilters = {};

                if (req?.body?.projectCode) {
                    Logger.info(req?.body?.projectCode);
                    query.push({ projectCode: new RegExp(req?.body?.projectCode, 'i') });
                }

                if (req?.body?.projectName) {
                    Logger.info(req?.body?.projectName);
                    query.push({ projectName: new RegExp(req?.body?.projectName, 'i') });
                }
                if (req?.body?.clientCompany) {
                    Logger.info(req?.body?.clientCompany);
                    query.push({ clientCompany: new RegExp(req?.body?.clientCompany, 'i') })
                }
                if (req?.body?.currencyType) {
                    Logger.info(req?.body?.currencyType);
                    query.push({ currencyType: new RegExp(req?.body?.currencyType, 'i') });
                }
                if (req?.body?.status) {
                    Logger.info(req?.body?.status);
                    query.push({ status: new RegExp(req?.body?.status, 'i') });
                }

                if (req?.body?.user) {
                    Logger.info(req?.body?.user);
                    req?.body?.user.forEach(ele => {
                        query.push({ userAssigned: { $elemMatch: { id: ele.id } } });
                    });
                }
                if (req?.body?.sponsor) {
                    Logger.info(req?.body?.sponsor);
                    req?.body?.sponsor.forEach(ele => {
                        query.push({ userAssigned: { $elemMatch: { id: ele.id } } });
                    });
                }
                if (req?.body?.manager) {
                    Logger.info(req?.body?.manager);
                    req?.body.manager.forEach(ele => {
                        query.push({ userAssigned: { $elemMatch: { id: ele.id } } });
                    });
                }
                if (req?.body?.owner) {
                    Logger.info(req?.body?.owner);
                    req?.body?.owner.forEach(ele => {
                        query.push({ userAssigned: { $elemMatch: { id: ele.id } } });
                    });
                }
                if (req?.body?.actualBudget) {
                    const { min, max } = req.body.actualBudget;
                    const budgetFilter = {};
                  
                    if (min !== undefined && min !== null && min !== '') {
                      budgetFilter.$lte = parseInt(min);
                    }
                  
                    if (max !== undefined && max !== null && max !== '') {
                      budgetFilter.$gte = parseInt(max);
                    }
                  
                    if (Object.keys(budgetFilter).length > 0) {
                      query.push({ actualBudget: budgetFilter });
                    }
                  }
                  
                  if (req?.body?.plannedBudget) {
                    const min = parseInt(req.body.plannedBudget.min, 10);
                    const max = parseInt(req.body.plannedBudget.max, 10);
                  
                    const filter = {};
                    if (!isNaN(max)) filter.$gte = max;
                    if (!isNaN(min)) filter.$lte = min;
                  
                    if (Object.keys(filter).length > 0) {
                      query.push({ plannedBudget: filter });
                    }
                  }
                  

                  if (req?.body?.createdAt) {
                    const { startDate, endDate } = req.body.createdAt;
                    const filter = {};
                  
                    if (startDate) {
                      filter.$gte = moment(startDate).startOf('day').toDate();
                    }
                  
                    if (endDate) {
                      filter.$lt = moment(endDate).endOf('day').toDate();
                    }
                  
                    if (Object.keys(filter).length > 0) {
                      query.push({ createdAt: filter });
                    }
                  }
                  
                  if (req?.body?.updatedAt) {
                    const { startDate, endDate } = req.body.updatedAt;
                    const filter = {};
                  
                    if (startDate) {
                      filter.$gte = moment(startDate).startOf('day').toDate();
                    }
                  
                    if (endDate) {
                      filter.$lt = moment(endDate).endOf('day').toDate();
                    }
                  
                    if (Object.keys(filter).length > 0) {
                      query.push({ updatedAt: filter });
                    }
                  }
                  
                if (reuse.result.type === 'user') {
                    if (managerLevelPermission===true) {
                    }
                    else {
                        query.push({ $or: [{ 'projectCreatedBy.Id': userId }, { 'userAssigned.id': userId }] });
                    }
                }
                if (query.length) myFilters['$and'] = query;
                response = await db
                    .collection(reuse.collectionName.project)
                    .aggregate([
                        {
                            $match: myFilters,
                        },
                        { $sort: sortBy },
                        { $project: totalViewAccess },
                    ])
                    .skip(skipValue)
                    .limit(limitValue)
                    .toArray();
                let filteredResultCount = await db
                    .collection(reuse.collectionName.project)
                    .aggregate([
                        {
                            $match: myFilters,
                        },
                        { $project: totalViewAccess }
                    ]).toArray()
                let activityDetails = activityOfUser(`${name + lastName} filtered the projects`, 'Project', name, 'Filtered', organizationId, userId, userProfilePic);
                Logger.info(activityDetails);
                event.emit('activity', activityDetails);
                let resultData = [];

                for (let resp of response) {
                    const totalTaskCount = await db.collection(reuse.collectionName.task).countDocuments({ projectId: resp._id.toString() });
                    const taskCompleted = await db.collection(reuse.collectionName.task).countDocuments({ projectId: resp._id.toString(), taskStatus: { $regex: new RegExp('^' + 'done', 'i') } });
                    const progressCount = totalTaskCount > 0 ? Math.round((taskCompleted / totalTaskCount) * 100) : resp.progress
                    let userAssignedCorrect = [];
                    if (resp?.userAssigned) {
                        for (const value of resp?.userAssigned) {
                            const userDetails = await db
                                .collection(reuse.collectionName.user)
                                .aggregate([
                                    { $match: { _id: ObjectId(value.id), softDeleted: false, isSuspended: false } },
                                    {
                                        $project: reuse.userObj,
                                    },
                                ])
                                .toArray();
                            if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                        }
                    }
                    resp.userAssigned = userAssignedCorrect ?? [];
                    resp.progress = isNaN(progressCount) ? 0 : progressCount;
                    resp.projectCreatedBy = await creatorDetails(resp.projectCreatedBy, reuse.collectionName.user, db);
                    resultData.push(resp);
                }
                if (reuse.sort == 'asc') {
                    if (extranlSort == 'Task Count') {
                        resultData.project.sort(function (a, b) {
                            return a.taskCount - b.taskCount
                        })
                    }
                    if (extranlSort == 'SubTask Count') {
                        resultData.project.sort(function (a, b) {
                            return a.subTaskCount - b.subTaskCount
                        })
                    }
                    if (extranlSort == 'progress') {
                        resultData.project.sort(function (a, b) {
                            return a.progress - b.progress
                        })
                    }
                } else {
                    if (extranlSort == 'Task Count') {
                        resultData.project.sort(function (a, b) {
                            return b.taskCount - a.taskCount
                        })
                    }
                    if (extranlSort == 'SubTask Count') {
                        resultData.project.sort(function (a, b) {
                            return b.taskCount - a.taskCount
                        })
                    }
                    if (extranlSort == 'progress') {
                        resultData.project.sort(function (a, b) {
                            return b.progress - a.progress
                        })
                    }
                }
                const val = {
                    projectCount: filteredResultCount?.length,
                    project: resultData,
                };
                res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_SEARCH'][language ?? 'en'], val));
            } catch (error) {
                Logger.error(`error ${error}`);
                return res.send(Response.projectFailResp('Failed to search', error));
            }
        } else {
            return res.send(reuse.result);
        }
    }

    async getStat(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        const { _id: userId, language } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const projectId = req?.query.projectId;
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                let projectDetails, totalTasks, SubTasks;
                if (reuse.result.type === 'user') {
                    projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId), $or: [{ 'projectCreatedBy.Id': userId }, { 'userAssigned.id': userId }] });
                    if (!projectDetails) {
                        return res.send(Response.projectFailResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en']));
                    }
                }
                projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });
                totalTasks = await db
                    .collection(reuse.collectionName.task)
                    .aggregate([
                        { $match: { projectId: ObjectId(projectDetails._id).toString() } },
                        {
                            $project: reuse.taskObj,
                        },
                    ])
                    .toArray();
                for (const ele of totalTasks) {
                    SubTasks = await db
                        .collection(reuse.collectionName.subTask)
                        .aggregate([
                            { $match: { taskId: ObjectId(ele._id).toString() } },
                            {
                                $project: reuse.subTaskObj,
                            },
                        ])
                        .toArray();
                    ele.subTaskUnderTask = {
                        SubTasks,
                    };
                }
                projectDetails
                    ? res.send(
                        Response.projectSuccessResp(projectMessageNew['PROJECT_FETCH_SUCCESS'][language ?? 'en'], {
                            project: projectDetails,
                            taskCount: totalTasks,
                        })
                    )
                    : res.send(Response.projectFailResp(projectMessageNew['PROJECT_ID_FOUND'][language ?? 'en']));
            } catch (err) {
                Logger.error(`err ${err}`);
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_FETCH_FAIL'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async projectExist(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        const language = reuse.result.userData?.userData.language;
        if (reuse.result.state === true) {
            try {
                const projectName = req.query.projectName;
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const isProjectExist = await db.collection(reuse.collectionName.project).find({ projectName: projectName }).toArray();
                Logger.info(isProjectExist);
                isProjectExist.length
                    ? res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_EXIST'][language ?? 'en']))
                    : res.send(Response.projectFailResp(projectMessageNew['PROJECT_NOT_EXIST'][language ?? 'en']));
            } catch (err) {
                Logger.error(`err ${err}`);
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_FAIL_EXIST'][language ?? 'en'], err.message));
            }
        }
    }

    async projectStatus(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        const language = reuse.result.userData?.userData.language;
        if (reuse.result.state === true) {
            try {
                let Todo = 0,
                    Inprogress = 0,
                    Pending = 0,
                    Review = 0,
                    Done = 0;
                const db = await checkCollection(reuse.collectionName.project);
                if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const projectData = await db.collection(reuse.collectionName.project).find({}).toArray();
                projectData.map(p => {
                    if (p.status == 'Todo') {
                        Todo++;
                    }
                    if (p.status == 'Inprogress') {
                        Inprogress++;
                    }
                    if (p.status == 'Pending') {
                        Pending++;
                    }
                    if (p.status == 'Review') {
                        Review++;
                    }
                    if (p.status == 'Done') {
                        Done++;
                    }
                });
                let response = {
                    Total: projectData?.length ?? 0,
                    Todo: Todo,
                    Inprogress: Inprogress,
                    Onhold: Pending,
                    Inreview: Review,
                    Done: Done,
                };
                res.send(Response.projectSuccessResp('success', response));
            } catch (err) {
                Logger.error(`err ${err}`);
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_FAIL_EXIST'][language ?? 'en'], err.message));
            }
        }
    }

    async removeMember(req, res) {
        const reuse = new Reuse(req);
        Logger.info(reuse.result);
        if (reuse.result.state === true) {
            const { _id: userId, adminId, language: language, orgId: organizationId, firstName: name, lastName, profilePic: userProfilePic, creatorId } = reuse.result.userData?.userData;
            try {
                const text = req.body;
                let exist = [];
                let notExist = [];
                const db = await checkCollection(reuse.collectionName.project);
                const isProjectExist = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(req.params.id) });
                if (!isProjectExist) {
                    Logger.error('Please check Project Id');
                    return res.send(Response.projectFailResp(projectMessageNew['PROJECT_NOT_EXIST'][language ?? 'en']));
                } else {
                    if (text?.userAssigned?.length) {
                        for (const ele of text?.userAssigned) {
                            let userExist = await db
                                .collection(reuse.collectionName.project)
                                .find({ 'userAssigned.id': ele.id, _id: ObjectId(req.params.id) })
                                .toArray();
                            userExist.length == 0 ? notExist.push(ele.id) : exist.push(ele.id);
                        }
                    }
                    if (exist.length > 0) {
                        const data = await db
                            .collection(reuse.collectionName.project)
                            .findOneAndUpdate({ _id: ObjectId(req.params.id) }, { $pull: { userAssigned: { id: { $in: exist } } } }, { returnDocument: 'after' });
                        const removedUsers = [];
                        const removedUserIds = [];
                        for (const id of exist) {
                            const removed = await db.collection(reuse.collectionName.user).findOne({ _id: ObjectId(id) });
                            removedUsers.push(removed.firstName);
                            removedUserIds.push(removed._id.toString());
                        }
                        Logger.info(`success ${data}`);
                        let activityDetails = activityOfUser(
                            `${name} removed ${removedUsers} from project ${data?.value?.projectName}`,
                            'Project',
                            name,
                            'Deleted',
                            organizationId,
                            userId,
                            userProfilePic
                        );
                        Logger.info(activityDetails);
                        event.emit('activity', activityDetails);
                        // Notification
                        if (reuse.result.type === 'user') {
                            // To Admin
                            const message = `${name + lastName} Removed ${removedUsers} from project ${data?.value?.projectName}`;
                            await NotificationService.adminNotification(message, adminId, userId, { collection: 'project', id: data?.value?._id.toString() });
                            if (adminId != creatorId && userId != creatorId) {
                                await NotificationService.userNotification(message, creatorId, userId, { collection: 'project', id: data?.value?._id.toString() });
                            }
                        }
                        // To Users
                        if (removedUserIds?.length) {
                            for (const user of removedUserIds) {
                                const message = `${name + lastName} Removed you from project ${data?.value?.projectName}`;
                                await NotificationService.userNotification(message, userId, user, { collection: 'project', id: data?.value?._id.toString() });
                            }
                        }
                        if (data.value) res.send(Response.projectSuccessResp(projectMessageNew['MEMBER_REMOVE_SUCCESS'][language ?? 'en'], data.value));
                    } else if (notExist.length > 0 && exist.length == 0) {
                        return res.status(400).send(Response.projectFailResp(`${notExist} ${projectMessageNew['USER_NOT_FOUND'][language ?? 'en']}`));
                    }
                }
            } catch (err) {
                Logger.error(`err ${err}`);
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_FETCH_FAIL'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    //-------------Time calculation for completed task,project and subTask------------------ */
    async timeCalculate(req, res) {
        const reuse = new Reuse(req);
        if (reuse?.result?.state == true) {
            try {
                if (!req?.query?.projectId && !req?.query?.taskId && !req?.query?.subTaskId) {
                    res.send(Response.projectFailResp('Please enter any one Id to check time.'));
                }
                const { projectId, taskId, subTaskId } = req?.query;
                const projectDb = await checkCollection(reuse.collectionName.project);
                if (!projectDb) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const taskDb = await checkCollection(reuse.collectionName.task);
                if (!taskDb) return res.send(Response.projectFailResp(`Task ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                const subTaskDb = await checkCollection(reuse.collectionName.subTask);
                if (!subTaskDb) return res.send(Response.projectFailResp(`subTask ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                if (projectId) {
                    const isPresent = await projectDb.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });
                    if (!isPresent) {
                        return res.send(Response.projectFailResp('Project is not present for the given Id, please check the ID'));
                    }
                    if (isPresent.remainingHours == 0) {
                        const isTaskPresent = await taskDb.collection(reuse.collectionName.task).find({ projectId: projectId }).toArray();
                        let totalTaskHours;
                        if (isTaskPresent.length > 0) {
                            const allTime = fetchRemainingHours(isTaskPresent);
                            const totalRemainingHours = totalHours(allTime);
                            const allHours = fetchActualHours(isTaskPresent);
                            totalTaskHours = totalHours(allHours);
                            if (totalRemainingHours == 0) {
                                let promises = isTaskPresent.map(async function (key) {
                                    let totalActualTime = 0;
                                    const isSubTaskPresent = await subTaskDb.collection(reuse.collectionName.subTask).find({ taskId: key._id.toString() }).toArray();
                                    if (isSubTaskPresent.length) {
                                        let allTime = fetchRemainingHours(isSubTaskPresent);
                                        const totalRemainingHours = totalHours(allTime);
                                        if (totalRemainingHours == 0) {
                                            const allHours = fetchActualHours(isSubTaskPresent);
                                            const totalActualHours = totalHours(allHours);
                                            totalActualTime = totalActualTime + totalActualHours;
                                        }
                                    } else {
                                        const isTaskPresent = await taskDb.collection(reuse.collectionName.task).findOne({ _id: ObjectId(key._id.toString()) });
                                        totalActualTime = totalActualTime + isTaskPresent.actualHours;
                                    }
                                    return totalActualTime;
                                });

                                let value = await Promise.all(promises);
                                let totalActualTime = totalHours(value);
                                res.send(Response.projectSuccessResp('project is in progress.', { totalActualTime: totalActualTime }));
                            } else {
                                res.send(Response.projectSuccessResp('project is in progress.', { tillConsumedHours: totalTaskHours }));
                            }
                        }
                        res.send(Response.projectSuccessResp('project is in progress.', { tillConsumedHours: isPresent.actualHours }));
                    } else {
                        res.send(Response.projectSuccessResp('project is in progress.', { tillConsumedHours: isPresent.actualHours }));
                    }
                } else if (taskId) {
                    const isPresent = await taskDb.collection(reuse.collectionName.task).findOne({ _id: ObjectId(taskId) });
                    if (!isPresent) {
                        res.send(Response.projectFailResp('Task is not present for the given Id, please check the ID'));
                    }
                    if (isPresent.remainingHours == 0) {
                        const isSubTaskPresent = await subTaskDb.collection(reuse.collectionName.subTask).find({ taskId: taskId }).toArray();
                        let totalActualHours;
                        if (isSubTaskPresent.length) {
                            let allTime = fetchRemainingHours(isSubTaskPresent);
                            const totalRemainingHours = totalHours(allTime);
                            const allHours = fetchActualHours(isSubTaskPresent);
                            totalActualHours = totalHours(allHours);
                            if (totalRemainingHours == 0) {
                                res.send(Response.projectSuccessResp('Task is completed', { totalHours: totalActualHours }));
                            } else {
                                res.send(Response.projectSuccessResp('Task is in progress', { tillConsumedHours: totalActualHours }));
                            }
                        } else {
                            res.send(Response.projectSuccessResp('Task is in progress', { tillConsumedHours: isPresent.actualHours }));
                        }
                    } else {
                        res.send(Response.projectSuccessResp('Task is in progress', { tillConsumedHours: isPresent.actualHours }));
                    }
                } else if (subTaskId) {
                    const isPresent = await subTaskDb.collection(reuse.collectionName.subTask).findOne({ _id: ObjectId(subTaskId) });
                    if (!isPresent) {
                        res.send(Response.projectFailResp('subTask is not present for the given Id, please check the ID'));
                    }
                    const { actualHours: actualHours, remainingHours: remainingHours } = isPresent;
                    if (remainingHours == 0) {
                        let data = { totalHours: actualHours };
                        res.send(Response.projectSuccessResp('subTask is completed ', data));
                    } else {
                        res.send(Response.projectSuccessResp('subTask is in progress.'));
                    }
                }
            } catch (err) {
                Logger.error(`error ${err}`);
                return res.send(Response.projectFailResp('Failed to find time or status of the project', err));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async userDetails(project, db, userCollectionName) {
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

            for (const task of project.taskDetails) {
                let users = [];
                if (task.assignedTo?.length) {
                    for (const user of task.assignedTo) {
                        const userDetails = await db
                            .collection(userCollectionName)
                            .aggregate([
                                {
                                    $match: { _id: ObjectId(user.id), softDeleted: false, isSuspended: false },
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
            }

            if (project?.subTaskDetails?.length) {
                for (const subtask of project.subTaskDetails) {
                    let users = [];
                    if (subtask.subTaskAssignedTo?.length) {
                        for (const user of subtask.subTaskAssignedTo) {
                            const userDetails = await db
                                .collection(userCollectionName)
                                .aggregate([
                                    {
                                        $match: { _id: ObjectId(user.id), softDeleted: false, isSuspended: false },
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
                }
            }
        } catch (err) {
            Logger.error(`err in userDetails function ${err}`);
        }
    }
    async fetchCreator(project, collectionName, db) {
        project.projectCreatedBy = await creatorDetails(project?.projectCreatedBy, collectionName, db)
        if (project?.taskDetails) {
            for (const x of project.taskDetails) {
                x.taskCreator = await creatorDetails(x.taskCreator, collectionName, db);
            }
        }
        if (project?.subTaskDetails) {
            for (const x of project.subTaskDetails) {
                x.subTaskCreator = await creatorDetails(x.subTaskCreator, collectionName, db);
            }
        }
    }
    async deleteMultipleProject(req, res) {
        const reuse = new Reuse(req);
        const { firstName: userName, adminId: Id, _id: userId, profilePic: userProfilePic, orgId: organizationId, language: language, planName: planName } = reuse.result.userData?.userData;
        try {
            const data = req?.body;
            const ProjectId = data.ProjectId;
            const { error } = ProjectValidation.deleteMultiple(data);
            if (error) {
                Logger.error(error);
                return res.send(Response.projectFailResp(projectMessageNew['VALIDATION_FAILED'][language ?? 'en'], error));
            }
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let exist = [];
            let notExist = [];
            for (const ele of ProjectId) {
                const userData = await db
                    .collection(reuse.collectionName.project)
                    .aggregate([{ $match: { _id: ObjectId(ele.id), status: { $eq: 'Done' } } }])
                    .toArray();
                userData.length == 0 ? notExist.push({ id: ele.id }) : exist.push({ id: ele.id });
            }
            if (notExist.length > 0 && exist.length == 0) {
                return res.status(400).send(Response.projectFailResp(notExist, 'Project is not present/Incomplete for the given Id, please check the ID'));
            }
            if (notExist.length == 0 && exist.length == 0) {
                return res.status(400).send(Response.projectFailResp('Please provide valid project Id'));
            }
            let response = 0;
            if (exist.length > 0) {
                if (req.body.planDownGrade === false) {
                    for (const ele of exist) {
                        let count = await db.collection(reuse.collectionName.project).deleteMany({ _id: ObjectId(ele.id) });
                        await projectComment.deleteMany({ project_id: ele.id.toString() });
                        await taskComment.deleteMany({ project_id: ele.id.toString() });
                        await db.collection(reuse.collectionName.task).deleteMany({ projectId: ele.id.toString() });
                        await subTaskComment.deleteMany({ project_id: ele.id.toString() });
                        await db.collection(reuse.collectionName.subTask).deleteMany({ projectId: ele.id.toString() });
                        if (count.deletedCount) {
                            response++;
                        }
                    }
                } else if (req.body.planDownGrade === true) {
                    let downPlanData = await planModel.findOne({ planName: req.body.planName })
                    let upPlanData = await planModel.findOne({ planName: planName });
                    let deleteProject = upPlanData.projectFeatureCount - downPlanData.projectFeatureCount
                    if (ProjectId.length == deleteProject) {

                        for (const ele of exist) {
                            let count = await db.collection(reuse.collectionName.project).deleteMany({ _id: ObjectId(ele.id) });
                            await projectComment.deleteMany({ project_id: ele.id.toString() });
                            await taskComment.deleteMany({ project_id: ele.id.toString() });
                            await db.collection(reuse.collectionName.task).deleteMany({ projectId: ele.id.toString() });
                            await subTaskComment.deleteMany({ project_id: ele.id.toString() });
                            await db.collection(reuse.collectionName.subTask).deleteMany({ projectId: ele.id.toString() });
                            if (count.deletedCount) {
                                response++;
                            }
                        }
                    } else {
                        return res.send(Response.projectSuccessResp("You can't delete fewer or additional projects in selected plan."))
                    }
                }
            }
            return res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_DELETE_SUCCESS'][language ?? 'en'], { deletedCount: response, deletedProject: exist }));
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_DELETE_FAIL'][language ?? 'en'], err.message));
        }
    }
    async ProjectUserProgress(req, res) {
        const reuse = new Reuse(req);
        let { language } = reuse?.result?.userData?.userData;
        try {
            let projectId = req.query.projectId;
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const taskDb = await checkCollection(reuse.collectionName.task);
            if (!taskDb) return res.send(Response.projectFailResp(`Task ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const subDb = await checkCollection(reuse.collectionName.subTask);
            if (!subDb) return res.send(Response.projectFailResp(`SubTask ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const userDb = await checkCollection(reuse.collectionName.user);
            if (!subDb) return res.send(Response.projectFailResp(`User ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const projectOne = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) })
            if (!projectOne) { return res.send(Response.projectSuccessResp("Provided projectId not found,please check project ID")) }
            let allUserDetails = [];
            const promises = projectOne.userAssigned?.map(async (ele) => {
                let userDetails = {};
                const user_details = await userDb.collection(reuse.collectionName.user).findOne({ _id: ObjectId(ele.id) })
                userDetails.userId = ele.id;
                userDetails.Name = user_details.firstName + ' ' + user_details.lastName;
                userDetails.profilePic = user_details.profilePic;
                userDetails.role = user_details.role;
                const alltask = await taskDb.collection(reuse.collectionName.task).find({ projectId: projectId, assignedTo: { $elemMatch: { id: ele.id } } }).toArray();
                let count = 0;
                alltask.map(over => {
                    if (over.taskStatus != "Done" && over.dueDate < new Date()) {
                        count++;
                    }
                })
                userDetails.overDueTasks = count;
                userDetails.totalTaskCount = alltask.length ?? 0;
                const copmletedTask = await taskDb.collection(reuse.collectionName.task).aggregate([{ $match: { $and: [{ projectId: projectId }, { assignedTo: { $elemMatch: { id: ele.id } } }, { taskStatus: 'Done' }] } }]).toArray();
                userDetails.allCompletedTask = copmletedTask.length ?? 0;
                userDetails.pendingTask = alltask.length - copmletedTask.length;
                const allsubtask = await subDb.collection(reuse.collectionName.subTask).aggregate([{ $match: { $and: [{ projectId: projectId }, { subTaskAssignedTo: { $elemMatch: { id: ele.id } } }] } }]).toArray();
                let subtaskCount = 0;
                allsubtask.map(overSub => {
                    if (overSub.subTaskStatus != "Done" && overSub.dueDate < new Date()) {
                        subtaskCount++;
                    }
                })
                userDetails.overDueSubTasks = subtaskCount;
                userDetails.totalSubTask = allsubtask.length ?? 0;
                const completedsubtask = await subDb.collection(reuse.collectionName.subTask).aggregate([{ $match: { $and: [{ projectId: projectId }, { subTaskAssignedTo: { $elemMatch: { id: ele.id } } }, { subTaskStatus: 'Done' }] } }]).toArray();
                userDetails.completedSubtask = completedsubtask.length ?? 0;
                userDetails.remainingSubtask = allsubtask.length - completedsubtask.length;
                let userAllTask = (userDetails.totalTaskCount + userDetails.totalSubTask) ?? 0;
                let UserAllCompletedTask = (userDetails.allCompletedTask + userDetails.completedSubtask) ?? 0;
                let userProgress = Math.round(UserAllCompletedTask / userAllTask * 100);
                if (isNaN(userProgress)) userProgress = 0;
                userDetails.performance = userProgress;
                allUserDetails.push(userDetails);
            }
            )
            await Promise.all(promises)
            return res.send(Response.projectSuccessResp("Successfully fetched user details", allUserDetails));

        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp("Error while fectching userDetials", err.message))
        }
    }
    async getAnalytics(req, res) {
        const reuse = new Reuse(req);
        let { language } = reuse?.result?.userData?.userData;
        try {
            let projectId = req.query.projectId;
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let analytics = [];
            const projectData = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) })
            if (!projectData) { return res.send(Response.projectSuccessResp("Invalid ProjectId")) }
            let projectStartDate = new Date(projectData?.startDate);
            let projectEndDate = new Date(projectData?.endDate)
            let currentDate = new Date(projectStartDate);
            if (req.query.basedOn == 'daywise') {
                while (currentDate <= new Date()) {
                    let formattedDate = currentDate.toISOString().split('T')[0];
                    const taskCreated = await db
                        .collection(reuse.collectionName.task)
                        .aggregate([
                            {
                                $match: {
                                    projectId: projectId,
                                    $expr: {
                                        $eq: [
                                            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                                            formattedDate
                                        ]
                                    }
                                }
                            }
                        ]).toArray()

                    const taskOverdue = await db
                        .collection(reuse.collectionName.task)
                        .find({
                            $or: [
                                {
                                    projectId: projectId,
                                    dueDate: { $lt: new Date(formattedDate) },
                                    createdAt: { $lt: new Date(formattedDate) },
                                    taskStatus: { $not: { $regex: new RegExp('^done', 'i') } }
                                },
                                {
                                    projectId: projectId,
                                    $expr: {
                                        $gt: [
                                            { $dateToString: { format: '%Y-%m-%d', date: '$completedDate' } },
                                            formattedDate
                                        ]
                                    },
                                    dueDate: { $lt: new Date(formattedDate) },
                                    createdAt: { $lt: new Date(formattedDate) }
                                }
                            ]
                        })
                        .toArray();
                    const taskPending = await db
                        .collection(reuse.collectionName.task)
                        .find({
                            $or: [
                                {
                                    projectId: projectId,
                                    dueDate: { $gte: new Date(formattedDate) },
                                    $expr: {
                                        $lte: [
                                            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                                            formattedDate
                                        ]
                                    },
                                    taskStatus: { $not: { $regex: new RegExp('^done', 'i') } }
                                },
                                {

                                    projectId: projectId,
                                    dueDate: { $gte: new Date(formattedDate) },

                                    $expr: {
                                        $lte: [
                                            { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                                            formattedDate
                                        ]
                                    },
                                    completedDate: { $gt: new Date(formattedDate) },

                                }
                            ]
                        })
                        .toArray();

                    analytics.push({
                        date: formattedDate,
                        totalTaskcreated: taskCreated?.length,
                        totalTaskPending: taskPending?.length,
                        totalTaskOverdue: taskOverdue?.length
                    })
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                return res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_ANALYTICS_FETCHED'][language ?? 'en'], { analytics, projectStartDate: projectStartDate, projectEndDate: projectEndDate }));
            }
            else {
                while (currentDate <= projectEndDate) {
                    const parsedDate = moment(currentDate);

                    const yearMonth = currentDate.toISOString().slice(0, 7);
                    const firstDayOfMonth = parsedDate.clone().startOf('month').format('YYYY-MM-DD');
                    const lastDayOfMonth = parsedDate.clone().endOf('month').add(1, 'day').format('YYYY-MM-DD');
                    const taskCreated = await db
                        .collection(reuse.collectionName.task)
                        .aggregate([
                            {
                                $match: {
                                    projectId: projectId,
                                    createdAt: {
                                        $gte: new Date(firstDayOfMonth),
                                        $lt: new Date(lastDayOfMonth)
                                    }
                                }
                            }
                        ]).toArray()
                    const taskOverdue = await db
                        .collection(reuse.collectionName.task)
                        .find({
                            $or: [{
                                projectId: projectId,
                                dueDate: {
                                    $gte: new Date(firstDayOfMonth),
                                    $lt: new Date(lastDayOfMonth)
                                },
                                taskStatus: {
                                    $ne: { $regex: new RegExp('^done', 'i') }
                                }
                            },
                            {
                                projectId: projectId,
                                dueDate: {
                                    $gte: new Date(firstDayOfMonth),
                                    $lt: new Date(lastDayOfMonth)
                                },
                                completedDate: { $gt: new Date("$dueDate") },
                            },
                            ]
                        })
                        .toArray();
                    const taskPending = await db
                        .collection(reuse.collectionName.task)
                        .find({
                            projectId: projectId,
                            dueDate: {
                                $gt: new Date()
                            },
                            $or: [
                                {
                                    createdAt: { $lt: new Date(firstDayOfMonth) }
                                },
                                {
                                    createdAt: { $lt: new Date(lastDayOfMonth) }
                                }
                            ],
                            taskStatus: {
                                $ne: { $regex: new RegExp('^' + 'done', 'i') }
                            }
                        })
                        .toArray();
                    analytics.push({
                        month: yearMonth,
                        totalTaskcreated: taskCreated?.length,
                        totalTaskPending: taskPending?.length,
                        totalTaskOverdue: taskOverdue?.length

                    })
                    currentDate.setMonth(currentDate.getMonth() + 1);
                }
                return res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_ANALYTICS_FETCHED'][language ?? 'en'], { analytics, projectStartDate: projectStartDate, projectEndDate: projectEndDate }));
            }

        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp("Error while fectching analytics", err.message))
        }
    }
}

export default new ProjectService();
