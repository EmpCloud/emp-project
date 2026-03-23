import Response from '../../response/response.js';
import UserValidation from './users.validate.js';
import { checkCollection, removeObjectNull, checkingFieldValues, filterFieldsValues, viewFields, creatorDetails } from '../../utils/project.utils.js';
import Logger from '../../resources/logs/logger.log.js';
import mongoose from 'mongoose';
import adminModel from '../admin/admin.model.js';
import MailResponse from '../../mailService/mailTemplate.js';
import PasswordGenerator from 'generate-password';
import uuidv1 from 'uuidv1';
import moment from 'moment';
import axios from 'axios';
import { UserMessageNew ,commonMessage} from '../language/language.translator.js';
import planModel from '../plan/plan.model.js';
import { ObjectId } from 'mongodb';
import config from 'config';
import { configFieldSchema, configViewFieldSchema } from '../customFields/customFields.model.js';
import { activityOfUser, dataDeleteActivity } from '../../utils/activity.utils.js';
import { removeDuplicates } from '../../utils/user.utils.js';
import event from '../event/eventEmitter.js';
import NotificationService from '../notifications/notifications.service.js';
import Reuse from '../../utils/reuse.js';
import permissionModel from '../permissions/permission.model.js';
import roleModel from '../roles/roles.model.js';
import projectCommentSchema from '../project/projectComment.schema.js';
import Password from '../../utils/passwordEncoderDecoder.js';
import usersValidate from './users.validate.js';
import XLSX from 'xlsx'
import usersModel from './users.model.js';
import fs from 'fs'
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

class UserService {
    async createUserOld(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language, _id } = reuse?.result?.userData?.userData?.language;
        Logger.info(reuse.result);
        if (reuse.result.state === true) {
            try {
                if (reuse.result.userData.userData.isEmpMonitorUser) return res.send(Response.projectFailResp('this service is disabled for you.'));
                const data = req?.body;
                Logger.info(data);
                const userEmail = data?.email;
                //validating data before creating new user
                const { value, error } = UserValidation.createUser(data);
                //to send validation error response
                Logger.error(error);
                if (error) return res.status(400).send(Response.validationFailResp(UserMessageNew['VALIDATION_FAIL'][language ?? 'en'], error));
                value.orgId = orgId;
                value.adminId = _id;
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                //to check user is already exist with emailId and organizationId in collection
                const isDataExist = await db.collection(reuse.collectionName.user).findOne({ email: userEmail });
                if (!isDataExist) {
                    value.createdAt = new Date();
                    //if user not exist then it will create new user
                    let userData = await db.collection(reuse.collectionName.user).insertOne(value);
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_ADD_SUCCESS'][language ?? 'en'], userData));
                } else {
                    //to give response if user already exists in collection
                    Logger.error('user email already exists');
                    res.send(Response.projectFailResp(`${UserMessageNew['USER_EXIST'][language ?? 'en']} ${orgId}`));
                }
            } catch (err) {
                //to handle catch error response
                Logger.error(err);
                res.send(Response.projectFailResp(UserMessageNew['USER_ADD_FAIL'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async createUser(req, res) {
        const reuse = new Reuse(req);
        const { orgId, adminId, language, profilePic: userProfilePic, firstName: userName, _id: userId, planData, email: adminEmail, isEmpMonitorUser, lastName, orgName, permission: userPermission, isAdmin} = reuse.result?.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let existUser = [];
                let failedUser = [];
                let newUser = [];
                let emp_ids = [];
                let users = req?.body?.users;
                if (!req?.body?.users) {
                    return res.status(400).send(Response.projectFailResp(UserMessageNew['INCORRECT_FIELD'][language ?? 'en']));
                }
                let userValues = [];
                users.forEach(entry => {
                    userValues.push(Object.keys(entry));
                });
                let configUserFields = [],
                    enabledFields = [],
                    requiredFields = [],
                    unRequiredFields = [];
                const configFields = await configFieldSchema.find({ orgId: orgId });
                configFields.forEach(entry => {
                    entry['userFields'].map(run => {
                        configUserFields.push(run);
                    });
                });
                checkingFieldValues(configUserFields, enabledFields, requiredFields, unRequiredFields);
                let outIn = filterFieldsValues(userValues, requiredFields);
                const isPresented = requiredFields.filter(word => !outIn.includes(word));
                let output;
                if (isPresented.length > 0) {
                    return res.send(Response.projectFailResp(isPresented.length > 1 ? `Validation failed,${isPresented} fields required` : `Validation failed,${isPresented} field required`));
                }
                let totalEnabledFields = requiredFields.concat(enabledFields);
                Logger.info(totalEnabledFields);
                output = filterFieldsValues(userValues, unRequiredFields);
                let insertedResult = {};
                if (output.length > 0) {
                    res.send(Response.projectFailResp(`Validation failed,${output} fields are not enabled `));
                } else {
                    if (reuse.result.userData.userData.isEmpMonitorUser) {
                        users.map(e => {
                            delete e.role;
                            delete e.department;
                            delete e.emp_code;
                            return e;
                        });
                    }
                    const isAdmin = await users.find(user => user.email === adminEmail);
                    if (isAdmin) return res.status(400).send(Response.projectFailResp(UserMessageNew['USER_CREATE_FAIL'][language ?? 'en']));
                    // check for the users null validation pending...
                    users = removeDuplicates(users, 'email');
                    const promises = await users?.map(async user => {
                        const userEmail = user?.email;
                        const { value, error } = UserValidation.createUser(user);
                        if (error) {
                            failedUser.push({ user, err: error.message });
                            return;
                        }
                        const role = value?.role.toLowerCase();
                        const permission = value?.permission;
                        Logger.error(error);
                        if (error) return res.status(400).send(Response.validationFailResp(UserMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                        const db = await checkCollection(reuse.collectionName.user);
                        if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                        const userTotalCount = await db.collection(reuse.collectionName.user).find({ orgId: orgId, invitation: 1 }).toArray();
                        let presentUser = userTotalCount.length + users.length;
                        if (presentUser > planData.userFeatureCount) {
                            if (planData.userFeatureCount - userTotalCount.length == 0) {
                                return res.status(429).send(Response.projectFailResp(UserMessageNew['USER_PLAN_LIMIT'][language ?? 'en']));
                            }
                        }
                        const roleExist = await roleModel.findOne({ roles: role });
                        const permissionExist = await permissionModel.findOne({ permissionName: permission });
                        if (!roleExist) {
                            failedUser.push({ user, err: `${role} Role not exist please select valid role` });
                            return;
                        } else if (!permissionExist) {
                            failedUser.push({ user, err: `${permission} permission not exist please select valid permission` });
                            return;
                        } else {
                            const isDataExist = await db.collection(reuse.collectionName.user).findOne({ email: new RegExp('^' + userEmail, 'i') });
                            if (!isDataExist) {
                                value.orgId = orgId;
                                value.adminId = isAdmin ? reuse.result?.userData?.userData._id : adminId;
                                let password = PasswordGenerator.generate({ length: 10, numbers: true });
                                value.password = await Password.encryptText(password, config.get('encryptionKey'));
                                (value.verified = false), //default values should work
                                    (value.emailValidateToken = uuidv1()),
                                    (value.emailTokenExpire = moment().add(1, 'day')?._d),
                                    (value.isAdmin = false);
                                value.createdAt = new Date();
                                value.softDeleted = false;
                                value.email = value.email.toLowerCase();
                                value.role = roleExist.roles.toLowerCase();
                                value.creatorId = userId;
                                value.invitation = 0;

                                //if user not exist then it will create new user
                                const permissionCheck = await permissionModel.findOne({ permissionName: userPermission });
                                if (reuse.result.type === 'user' && permissionCheck.permissionConfig.user.create == false) {
                                    return res.send(Response.projectFailResp(`You don't have permission to create User`));
                                }
                                if (reuse.result.type != 'user') {
                                    value.userName = '@' + value.firstName + value.lastName + '_' + orgName.split(' ')[0];//to update the status if it is an emp user
                                    newUser.push(value);
                                } else {
                                    const adminData = await adminModel.findOne({ _id: adminId })
                                    value.userName = '@' + value.firstName + value.lastName + '_' + adminData.orgName.split(' ')[0];//to update the status if it is an emp user
                                    newUser.push(value);
                                }
                                insertedResult = await db.collection(reuse.collectionName.user).insertOne(value);
                                //storing the activity
                                let userActivityDetails = activityOfUser(`${userName + lastName} added  ${value.firstName + value.lastName} user`, 'User', userName, 'Registered', orgId, userId, userProfilePic);
                                userActivityDetails['userId'] = insertedResult.insertedId.toString();
                                event.emit('activity', userActivityDetails);
                                emp_ids.push(value.emp_id);
                            } else {
                                existUser.push(value);
                            }
                        }
                    });
                    await Promise.all(promises);
                    //after successfully creating user calculation total user count and subscription user count
                    let userCount, resp;
                    const db = await checkCollection(reuse.collectionName.user);
                    userCount = await db.collection(reuse.collectionName.user).countDocuments({});
                    resp = {
                        userCreatedCount: userCount,
                        userRemainingCount: planData.userFeatureCount - userCount,
                        userDetails: newUser,
                    };

                    if (newUser.length && process.env.node_env !== 'localDev') {
                        let mailResponse = await MailResponse.sendUserVerificationMail(newUser);
                        Logger.info(`Mail invitation response ${mailResponse}`);
                    }
                    if (existUser.length && newUser.length && failedUser.length) {
                        res.send(Response.projectPartialSuccessResp(`User created successfully`, { resp, existUser, msg: 'users failed to add', failedUser }));
                    } else if (existUser.length && newUser.length) {
                        res.send(Response.projectPartialSuccessResp(`User created successfully`, { resp, existUser }));
                    } else if (failedUser.length && newUser.length) {
                        res.send(Response.projectPartialSuccessResp(`User created successfully`, { resp, msg: 'users failed to add', failedUser }));
                    } else if (failedUser.length && existUser.length) {
                        res.send(Response.projectFailResp(`User already exist with organization`, { resp, msg: 'users failed to add', failedUser }));
                    } else if (failedUser.length) {
                        res.send(Response.projectFailResp(`${failedUser[0]?.err}`, { failedUser }));
                    } else if (newUser.length) {
                        res.send(Response.projectSuccessResp('New user created successfully', resp));
                    } else if (existUser.length) {
                        res.send(Response.projectFailResp(`Users  already exist with organization`, { userCreatedCount: userCount, existUser }));
                    }
                }
                if (emp_ids?.length && isEmpMonitorUser) {
                    const data = { emp_id: emp_ids, register: true, secretKey: config.get('emp_secret_key') };
                    await axios.post(config.get('update_emp_users_status'), data);
                }
            } catch (err) {
                Logger.error(err);
                res.send(Response.projectFailResp(UserMessageNew['ORG_FOUND'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    //To fetch all users from user collection
    async fetchUser(req, res) {
        const reuse = new Reuse(req);
        if (reuse.result.state === true) {
            const { orgId, language, firstName, lastName, profilePic, _id, adminId } = reuse.result.userData?.userData;
            try {
                const userId = req.query.userId;
                const startDate = req.query.startDate;
                const endDate = req.query.endDate;
                const projectId = req?.query?.projectId;
                const taskId = req?.query?.taskId;
                const sortBy = {};
                let dataValue;
                const status = req?.query?.invitationStatus;
                const suspensionStatus = req?.query?.suspensionStatus;
                let search = req.query.search;
                let searchFilter = {};
                if (search) {
                    let regex = new RegExp(search, 'i'); // case-insensitive
                    searchFilter = {
                        $or: [
                            { firstName: regex },
                            { lastName: regex },
                            { email: regex },
                            { orgId: regex },
                            { empMonitorId: regex },
                            { permission: regex }
                        ]
                    };
                }
                let orderby = reuse.orderby || 'firstName';
                let extranlSort;
                if (orderby == 'projectCount' || orderby == 'taskCount' || orderby == 'performance') {
                    extranlSort = orderby;
                    orderby = 'firstName';
                }
                sortBy[orderby] = reuse.sort.toString() === 'asc' ? 1 : -1;
                Logger.info(`sortBy ${sortBy}`);
                let fieldValue,
                    obj = {},
                    fields;
                const configFields = await configViewFieldSchema.find({ orgId: orgId });
                configFields.forEach(entry => {
                    fields = entry['userViewFields'];
                });
                let viewAccess = viewFields(fields, fieldValue, obj);
                const extraAccess = {
                    userName: 1,
                    isSuspended: 1
                };
                const totalViewAccess = { ...viewAccess, ...extraAccess }
                let filterData = [];
                filterData = Object.keys(totalViewAccess);

                if (orderby != 'firstName') {
                    let outIn = filterData.filter(word => orderby.includes(word));
                    if (outIn.length == 0) {
                        return res.send(Response.projectFailResp('Failed to search, please check config Fields'));
                    }
                }
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                //to get total number of users count
                const totalUserCount = await db.collection(reuse.collectionName.user).countDocuments({ orgId: orgId, softDeleted: false,isSuspended: false });
                //fetch data based on given org_id and store in data variable.

                //adding newly added keys in the user schema for old admins
                let suspendKeyExists = await db
                    .collection(reuse.collectionName.user).find({ "isSuspended": { $exists: false } }).toArray()
                if (suspendKeyExists.length) await db
                    .collection(reuse.collectionName.user).updateMany({ "isSuspended": { $exists: false } }, { $set: { isSuspended: false } })
                if (userId) {
                    let projects, asignedTasks;
                    let taskCompleted = 0;
                    const projectNameCount = {};

                    let data = await db
                        .collection(reuse.collectionName.user)
                        .aggregate(
                            [
                                { $match: { _id: mongoose.Types.ObjectId(userId), softDeleted: false } },

                                {
                                    $project: totalViewAccess,
                                },
                            ],
                            { collation: { locale: 'en', strength: 2 } }
                        )
                        .toArray();
                    if (data.length > 0) {
                        let userActivityDetails = activityOfUser(`${firstName + lastName} viewed ${data[0].firstName + data[0].lastName} user details `, 'User', firstName, 'Viewed', orgId, _id, profilePic);
                        userActivityDetails['userId'] = userId;
                        //adding username for old users that are created earlier
                        if (!data[0].userName) {
                            const adminData = await adminModel.findOne({ _id: adminId })
                            await db.collection(reuse.collectionName.user).updateOne({ _id: mongoose.Types.ObjectId(userId), }, { $set: { userName: '@' + data[0].firstName + data[0].lastName + '_' + adminData.orgName.split(' ')[0] } })
                        }
                        event.emit('activity', userActivityDetails);
                    }
                    if (startDate && endDate) {
                        projects = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([{
                                $match: {
                                    $and: [{ 'userAssigned.id': userId.toString() }, {
                                        createdAt: {
                                            $gte: new Date(startDate),
                                            $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                        }
                                    }]
                                }
                            }])
                            .toArray();

                        projects.map(async project => {
                            const taskUnderProject = await db
                                .collection(reuse.collectionName.task)
                                .aggregate([
                                    {
                                        $match: {
                                            $and: [{ 'assignedTo.id': userId.toString() }, { projectId: project._id.toString() }, {
                                                createdAt: {
                                                    $gte: new Date(startDate),
                                                    $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                                }
                                            }]
                                        }
                                    },
                                ])
                                .toArray();
                            const compltedTasks = await db
                                .collection(reuse.collectionName.task)
                                .aggregate([
                                    {
                                        $match: {
                                            $and: [{ 'assignedTo.id': userId.toString() }, { projectId: project._id.toString() }, { taskStatus: new RegExp('^' + 'done', 'i') }, {
                                                createdAt: {
                                                    $gte: new Date(startDate),
                                                    $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                                }
                                            }]
                                        }
                                    },
                                ])
                                .toArray();
                            const projectProgressCount =
                                taskUnderProject.length > 0
                                    ? Math.round((compltedTasks.length / taskUnderProject.length) * 100)
                                    : project.progress;


                            project.TotalTaskCount = taskUnderProject.length,
                                project.CompletedTasks = compltedTasks.length,
                                project.projectProgress = isNaN(projectProgressCount) ? 0 : projectProgressCount;

                        });
                        asignedTasks = await db
                            .collection(reuse.collectionName.task)
                            .aggregate([{
                                $match: {
                                    $and: [{ 'assignedTo.id': userId.toString() }, {
                                        createdAt: {
                                            $gte: new Date(startDate),
                                            $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                        }
                                    }]
                                }
                            }])
                            .toArray();

                        asignedTasks.map(async ele => {
                            const subtaskUnderTask = await db
                                .collection(reuse.collectionName.subTask)
                                .aggregate([
                                    {
                                        $match: {
                                            $and: [{ taskId: ele._id.toString() }, { 'subTaskAssignedTo.id': userId.toString() }, {
                                                createdAt: {
                                                    $gte: new Date(startDate),
                                                    $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                                }
                                            }]
                                        }
                                    },
                                ])
                                .toArray();

                            const compltedsubTasks = await db
                                .collection(reuse.collectionName.subTask)
                                .aggregate([
                                    {
                                        $match: {
                                            $and: [{ taskId: ele._id.toString() }, { 'subTaskAssignedTo.id': userId.toString() }, { subTaskStatus: new RegExp('^' + 'done', 'i') }, {
                                                createdAt: {
                                                    $gte: new Date(startDate),
                                                    $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                                }
                                            }],
                                        },
                                    },
                                ])
                                .toArray();
                            if (ele.taskStatus.toLowerCase() == 'done') {
                                taskCompleted++;
                            }

                            const taskProgress = subtaskUnderTask.length > 0 ? Math.round((compltedsubTasks.length / subtaskUnderTask.length) * 100) : ele.progress;
                            ele.subtask = subtaskUnderTask,
                                ele.Totalsubtasks = subtaskUnderTask.length,
                                ele.CompltedSubTasks = compltedsubTasks.length,
                                ele.TaskProgress = isNaN(taskProgress) ? 0 : taskProgress;

                        });

                        let asignedSubTasks = await db
                            .collection(reuse.collectionName.subTask)
                            .aggregate([
                                {
                                    $match: {
                                        $and: [{ 'subTaskAssignedTo.id': userId.toString() }, {
                                            createdAt: {
                                                $gte: new Date(startDate),
                                                $lt: new Date(new Date(endDate).setHours(23, 59, 59, 999))
                                            }
                                        }]
                                    }
                                },
                            ])
                            .toArray();
                        projects = await this.user_GroupDetails(projects, db, reuse.collectionName.user);
                        asignedTasks = await this.user_GroupDetails(asignedTasks, db, reuse.collectionName.user);
                        asignedSubTasks = await this.user_GroupDetails(asignedSubTasks, db, reuse.collectionName.user);
                        let performance = Math.round((taskCompleted / (asignedTasks.length)) * 100)
                        dataValue = {
                            User: data,
                            TotalProjects: projects?.length,
                            Project_details: projects,
                            TotalTasks: asignedTasks.length,
                            Task_details: asignedTasks,
                            TotalSubTasks: asignedSubTasks?.length,
                            SubTask_details: asignedSubTasks,
                            PendingTasks: (asignedTasks.length) - taskCompleted,
                            progress: isNaN(performance) ? 0 : performance

                        }
                    }
                    else {
                        projects = await db
                            .collection(reuse.collectionName.project)
                            .find({ 'userAssigned.id': userId.toString() })
                            .toArray();

                        projects.map(async project => {
                            const taskUnderProject = await db
                                .collection(reuse.collectionName.task)
                                .aggregate([
                                    { $match: { $and: [{ 'assignedTo.id': userId.toString() }, { projectId: project._id.toString() }] } },
                                ])
                                .toArray();
                            const compltedTasks = await db
                                .collection(reuse.collectionName.task)
                                .aggregate([
                                    { $match: { $and: [{ 'assignedTo.id': userId.toString() }, { projectId: project._id.toString() }, { taskStatus: new RegExp('^' + 'done', 'i') }] } },
                                ])
                                .toArray();
                            const projectProgressCount =
                                taskUnderProject.length > 0
                                    ? Math.round((compltedTasks.length / taskUnderProject.length) * 100)
                                    : project.progress;
                            project.TotalTaskCount = taskUnderProject.length,
                                project.CompletedTasks = compltedTasks.length,
                                project.projectProgress = isNaN(projectProgressCount) ? 0 : projectProgressCount;
                        });

                        asignedTasks = await db
                            .collection(reuse.collectionName.task)
                            .find({ 'assignedTo.id': userId.toString() })
                            .toArray();

                        asignedTasks.map(async ele => {
                            const subtaskUnderTask = await db
                                .collection(reuse.collectionName.subTask)
                                .aggregate([
                                    { $match: { $and: [{ taskId: ele._id.toString() }, { 'subTaskAssignedTo.id': userId.toString() }] } },
                                ])
                                .toArray();

                            const compltedsubTasks = await db
                                .collection(reuse.collectionName.subTask)
                                .aggregate([
                                    {
                                        $match: {
                                            $and: [{ taskId: ele._id.toString() }, { 'subTaskAssignedTo.id': userId.toString() }, { subTaskStatus: new RegExp('^' + 'done', 'i') }],
                                        },
                                    },
                                ])
                                .toArray();
                            if (ele.taskStatus.toLowerCase() == 'done') {
                                taskCompleted++;
                            }

                            const taskProgress = subtaskUnderTask.length > 0 ? Math.round((compltedsubTasks.length / subtaskUnderTask.length) * 100) : ele.progress;
                            ele.subTask = subtaskUnderTask,
                                ele.Totalsubtasks = subtaskUnderTask.length,
                                ele.CompltedSubTasks = compltedsubTasks.length,
                                ele.TaskProgress = isNaN(taskProgress) ? 0 : taskProgress;

                        });
                        let asignedSubTasks = await db
                            .collection(reuse.collectionName.subTask)
                            .aggregate([
                                { $match: { 'subTaskAssignedTo.id': userId.toString() } },
                            ])
                            .toArray();
                        projects = await this.user_GroupDetails(projects, db, reuse.collectionName.user);
                        asignedTasks = await this.user_GroupDetails(asignedTasks, db, reuse.collectionName.user);
                        asignedSubTasks = await this.user_GroupDetails(asignedSubTasks, db, reuse.collectionName.user);
                        let performance = Math.round((taskCompleted / (asignedTasks.length)) * 100)
                        dataValue = {
                            User: data,
                            TotalProjects: projects?.length,
                            Project_details: projects,
                            TotalTasks: asignedTasks.length,
                            Task_details: asignedTasks,
                            TotalSubTasks: asignedSubTasks?.length,
                            SubTask_details: asignedSubTasks,
                            PendingTasks: (asignedTasks.length) - taskCompleted,
                            progress: isNaN(performance) ? 0 : performance

                        }
                    }
                    await this.fetchCreator(dataValue, reuse.collectionName.user, db)
                    return res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], dataValue));
                }
                else if (projectId) {

                    const projectDetails = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });

                    if (!projectDetails) return res.send(Response.projectFailResp('Invalid ProjectId'))
                    let userAssignedCorrect = [];
                    if (projectDetails?.userAssigned) {
                        for (const value of projectDetails?.userAssigned) {
                            const userDetails = await db
                                .collection(reuse.collectionName.user)
                                .aggregate([
                                    { $match: { _id: ObjectId(value.id), softDeleted: false ,...searchFilter} },
                                    {
                                        $project: reuse.userObj,
                                    },
                                ])
                                .toArray();
                            if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                        }
                    }
                    if (!userAssignedCorrect.length) return res.send(Response.projectSuccessResp('No members are assigned to the project '));
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], { users: userAssignedCorrect}));
                } else if (taskId) {
                    const taskDetails = await db.collection(reuse.collectionName.task).findOne({ _id: ObjectId(taskId) });
                    if (!taskDetails) return res.send(Response.projectFailResp('Invalid taskId'))
                    let userAssignedCorrect = [];
                    if (taskDetails?.assignedTo) {
                        for (const value of taskDetails?.assignedTo) {
                            const userDetails = await db
                                .collection(reuse.collectionName.user)
                                .aggregate([
                                    { $match: { _id: ObjectId(value.id), softDeleted: false } },
                                    {
                                        $project: reuse.userObj,
                                    },
                                ])
                                .toArray();
                            if (userDetails.length) userAssignedCorrect.push(userDetails[0]);
                        }
                    }
                    if (!userAssignedCorrect.length) return res.send(Response.projectSuccessResp('No members are assigned to the task '));
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], { users: userAssignedCorrect }));
                } else {
                    let userData;

                    if (status || suspensionStatus) {
                        let query;
                        if (status && !suspensionStatus) {
                            query = { orgId: orgId, softDeleted: false, invitation: parseInt(status) }
                        }
                        else if (suspensionStatus && !status) {
                            query = { orgId: orgId, softDeleted: false, isSuspended: JSON.parse(suspensionStatus) }
                        }
                        else if (status && suspensionStatus) {
                            query = {$and:[{ orgId: orgId}, {softDeleted: false},{isSuspended:JSON.parse(suspensionStatus)},{invitation: parseInt(status) }]
                            }}
                        if (reuse.result.type === 'user') {
                            userData = await db
                                .collection(reuse.collectionName.user)
                                .aggregate(
                                    [
                                        { $match: query },

                                        {
                                            $project: totalViewAccess,
                                        },
                                    ],
                                    { collation: { locale: 'en', strength: 2 } }
                                )
                                .sort(sortBy)
                                .skip(reuse.skip)
                                .limit(reuse.limit)
                                .toArray();


                        } else {
                            userData = await db
                                .collection(reuse.collectionName.user)
                                .aggregate(
                                    [
                                        { $match: query },

                                        {
                                            $project: totalViewAccess,
                                        },
                                    ],
                                    { collation: { locale: 'en', strength: 2 } }
                                )
                                .sort(sortBy)
                                .skip(reuse.skip)
                                .limit(reuse.limit)
                                .toArray();
                        }
                    }
                    else {
                        // Get All Users
                        if (reuse.result.type === 'user') {
                            userData = await db
                                .collection(reuse.collectionName.user)
                                .aggregate(
                                    [
                                        { $match: { orgId: orgId, softDeleted: false } },

                                        {
                                            $project: totalViewAccess,
                                        },
                                    ],
                                    { collation: { locale: 'en', strength: 2 } }
                                )
                                .sort(sortBy)
                                .skip(reuse.skip)
                                .limit(reuse.limit)
                                .toArray();

                        } else {
                            userData = await db
                                .collection(reuse.collectionName.user)
                                .aggregate(
                                    [
                                        { $match: { orgId: orgId, softDeleted: false } },

                                        {
                                            $project: totalViewAccess,
                                        },
                                    ],
                                    { collation: { locale: 'en', strength: 2 } }
                                )
                                .sort(sortBy)
                                .skip(reuse.skip)
                                .limit(reuse.limit)
                                .toArray();
                        }
                    }
                    let totalUsers = await db.collection(reuse.collectionName.user).find({ orgId: orgId, softDeleted: false, isSuspended:false }).toArray();
                    let acceptedInvitationCount = 0,
                        rejectedInvitationCount = 0,
                        pendingInvitationCount = 0;
                    totalUsers.map(ele => {
                        if (ele.invitation == 1) {
                            acceptedInvitationCount++;
                        }
                        if (ele.invitation == 2) {
                            rejectedInvitationCount++;
                        }
                        if (ele.invitation == 0) {
                            pendingInvitationCount++;
                        }
                    });

                    const invitationCount = {
                        acceptedInvitationCount,
                        rejectedInvitationCount,
                        pendingInvitationCount,
                    };

                    for (const element of userData) {
                        const projects = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([
                                { $match: { 'userAssigned.id': element._id.toString() } },
                                {
                                    $project: {
                                        _id: 1,
                                        projectName: 1,
                                        projectCode: 1,
                                        status: 1,
                                    },
                                },
                            ])
                            .toArray();

                        const independentTask = await db
                            .collection(reuse.collectionName.task)
                            .aggregate([
                                { $match: { 'assignedTo.id': element._id.toString(), standAloneTask: true } },
                                {
                                    $project: {
                                        _id: 1,
                                        taskTitle: 1,
                                        taskStatus: 1,
                                        standAloneTask: 1,
                                    },
                                },
                            ])
                            .toArray();

                        const projectTask = await db
                            .collection(reuse.collectionName.task)
                            .aggregate([
                                { $match: { 'assignedTo.id': element._id.toString(), standAloneTask: false } },
                                {
                                    $project: {
                                        _id: 1,
                                        taskTitle: 1,
                                        taskStatus: 1,
                                        standAloneTask: 1,
                                    },
                                },
                            ])
                            .toArray();

                        const subtask = await db
                            .collection(reuse.collectionName.subTask)
                            .aggregate([
                                { $match: { 'subTaskAssignedTo.id': element._id.toString() } },
                                {
                                    $project: {
                                        _id: 1,
                                        subTaskTitle: 1,
                                        subTaskStatus: 1,
                                    },
                                },
                            ])
                            .toArray();
                        filterData.map(ele => {
                            switch (ele) {
                                case 'Project_details':
                                    element.Project_details = {
                                        TotalProjectCount: projects.length,
                                        projects,
                                    };
                                    break;
                                case 'task_details':
                                    element.task_details = {
                                        TotalTaskCount: independentTask?.length + projectTask?.length,
                                        TotalTasks: { independentTask: independentTask?.length, projectUnderTask: projectTask?.length },
                                        independentTask,
                                        projectTask,
                                    };
                                    break;
                                case 'subTask_details':
                                    element.subTask_details = {
                                        TotalSubtaskCount: subtask.length,
                                        subtask,
                                    };
                                    break;
                            }
                        });

                        //Calculating ProgressCount
                        let projectCompleted = 0;
                        let taskCompleted = 0;
                        let subtaskCompleted = 0;
                        let totalProjectCount = projects?.length;
                        let totalTaskCount = independentTask?.length + projectTask?.length;
                        let totalSubTaskCount = subtask?.length;

                        for (let item of projects) {
                            if (item.status.toLowerCase() == 'done') {
                                projectCompleted += 1;
                            }
                        }
                        for (let item of independentTask) {
                            if (item.taskStatus.toLowerCase() == 'done') {
                                taskCompleted += 1;
                            }
                        }
                        for (let item of projectTask) {
                            if (item.taskStatus.toLowerCase() == 'done') {
                                taskCompleted += 1;
                            }
                        }
                        for (let item of subtask) {
                            if (item.subTaskStatus.toLowerCase() == 'done') {
                                subtaskCompleted += 1;
                            }
                        }
                        // var progressCount = Math.round(((projectCompleted + taskCompleted + subtaskCompleted) / (totalProjectCount + totalTaskCount + totalSubTaskCount)) * 100);
                        //element.Progress = isNaN(progressCount) ? 0 : progressCount;
                        // element.PendingTasks = ((totalProjectCount + totalTaskCount + totalSubTaskCount) - (projectCompleted + taskCompleted + subtaskCompleted));
                        element.PendingTasks = totalTaskCount - taskCompleted;
                        let performance = Math.round((taskCompleted / totalTaskCount) * 100)
                        element.progress = isNaN(performance) ? 0 : performance;
                    }
                    let response = {
                        TotalUserCount: totalUserCount,
                        InvitationCount: invitationCount,
                        users: userData,
                    };

                    if (reuse.sort == 'asc') {
                        if (extranlSort == 'projectCount') {
                            response.users.sort(function (a, b) {
                                return a.Project_details.TotalProjectCount - b.Project_details.TotalProjectCount;
                            });
                        }
                        if (extranlSort == 'taskCount') {
                            response.users.sort(function (a, b) {
                                return a.task_details.TotalTaskCount - b.task_details.TotalTaskCount;
                            });
                        }
                        if (extranlSort == 'performance') {
                            response.users.sort(function (a, b) {
                                return a.progress - b.progress;
                            });

                        }

                    } else {

                        if (extranlSort == 'projectCount') {
                            response.users.sort(function (a, b) {
                                return b.Project_details.TotalProjectCount - a.Project_details.TotalProjectCount;
                            });
                        }
                        if (extranlSort == 'taskCount') {
                            response.users.sort(function (a, b) {
                                return b.task_details.TotalTaskCount - a.task_details.TotalTaskCount;
                            });
                        }
                        if (extranlSort == 'performance') {
                            response.users.sort(function (a, b) {
                                return b.progress - a.progress;
                            });
                        }

                    }
                    let userActivityDetails = activityOfUser(`${firstName + lastName} viewed all users details `, 'User', firstName, 'Viewed', orgId, _id, profilePic);
                    userActivityDetails['userId'] = 'All';
                    event.emit('activity', userActivityDetails);

                    //check and send  data in response if id found. if not then fail response
                    return res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], response));
                }
            } catch (err) {
                Logger.error(err);
                return res.send(Response.projectFailResp(UserMessageNew['ORG_FOUND'][language ?? 'en'], err));
            }

        } else {
            res.send(reuse.result);
        }
    }

    async fetchUserByRoles(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language, firstName, lastName, profilePic, _id: adminId } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let roleName = req?.query?.role;
                let fieldValue,
                    obj = {},
                    fields;
                const configFields = await configViewFieldSchema.find({ orgId: orgId });
                configFields.forEach(entry => {
                    fields = entry['userViewFields'];
                });
                let viewAccess = viewFields(fields, fieldValue, obj);

                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                //To check collection is present or not in database
                const totalRoleCount = await db.collection(reuse.collectionName.user).countDocuments({ adminId: adminId, softDeleted: false });
                const rolesDetails = await roleModel.findOne({ roles: roleName.toLowerCase() });
                if (rolesDetails) {
                    let data = await db
                        .collection(reuse.collectionName.user)
                        .aggregate([{ $match: { role: rolesDetails.roles, softDeleted: false, isSuspended: false } }, { $project: viewAccess }])
                        .skip(reuse.skip)
                        .limit(reuse.limit)
                        .toArray();
                    let userActivityDetails = activityOfUser(`${firstName + lastName} viewed users under ${roleName} role `, 'User', firstName, 'Viewed', orgId, adminId, profilePic);
                    userActivityDetails['userId'] = 'All';
                    event.emit('activity', userActivityDetails);
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], { TotalUserCount: totalRoleCount, data: data, count: data.length }));
                } else {
                    res.send(Response.projectFailResp(UserMessageNew['ROLE_NOT_FOUND'][language ?? 'en']));
                }
            } catch (err) {
                Logger.log(err);
                res.send(Response.projectFailResp(UserMessageNew['ROLES_FETCH_NAME_FAIL'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    //To update user data in collection
    async updateUser(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language, firstName, lastName, profilePic, _id, adminId, isEmpMonitorUser: empUser, creatorId, permission: userPermission, isAdmin } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const userId = req?.query?.userId;
                const reqData = req?.body;
                const role = reqData.role;
                const permission = reqData.permission;

                //validating data before updating existing record
                const { value, error } = UserValidation.updateUser(reqData);
                //to send validation error response
                Logger.error(error);
                if (error) return res.status(400).send(Response.validationFailResp(UserMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                let isExist = await db.collection(reuse.collectionName.user).findOne({ _id: mongoose.Types.ObjectId(userId) });
                if (!isExist) return res.send(Response.projectFailResp(UserMessageNew['USER_UPDATE_FAIL'][language ?? 'en']));
                if (isExist?.emp_id) {
                    if ((reqData?.firstName && reqData.firstName !== isExist?.firstName) || (reqData?.lastName && isExist.lastName !== reqData?.lastName))
                        return res.status(400).send(Response.projectFailResp(UserMessageNew['CREATE_FAIL'][language ?? 'en']));
                }
                if (role) {
                    const roleExist = await roleModel.findOne({ roles: role });
                    if (!roleExist) {
                        return res.send(Response.projectFailResp(`${role} Role not exist please select valid role`));
                    }
                }
                if (permission) {
                    const permissionExist = await permissionModel.findOne({
                        permissionName: permission,
                    });
                    if (!permissionExist) {
                        return res.send(Response.projectFailResp(`${permission} permission not exist please select valid permission`));
                    }
                }
                let data;
                value.updatedAt = new Date();
                if (reuse.result.type === 'user') {
                    if (reqData.firstName || reqData.profilePic) {
                        let condition = { "commentCreator.creatorId": userId }
                        let updateOperation = { $set: { "commentCreator.creatorName": reqData.firstName, "commentCreator.creatorProfilePic": reqData.profilePic } }
                        await projectCommentSchema.updateMany(condition, updateOperation)
                        let activityCondition = { "userDetails.id": userId }
                        let updateActivity = { $set: { "userDetails.name": reqData.firstName, "userDetails.profilePic": reqData.profilePic } }
                        await projectCommentSchema.updateMany(activityCondition, updateActivity);
                    }
                    const permissionCheck = await permissionModel.findOne({
                        permissionName: userPermission.toLowerCase(),
                    });
                    if (permissionCheck.permissionConfig.user.edit == true) {
                        data = await db
                            .collection(reuse.collectionName.user)
                            .findOneAndUpdate(
                                { _id: mongoose.Types.ObjectId(userId), softDeleted: false },
                                { $set: value },
                                { returnDocument: 'after' }
                            );
                    }
                    if (!data.value) return res.send(Response.projectFailResp(`You are not allowed to update this record`));
                } else {
                    if (reqData.firstName || reqData.profilePic) {
                        let condition = { "commentCreator.creatorId": userId }
                        let updateOperation = { $set: { "commentCreator.creatorName": reqData.firstName, "commentCreator.creatorProfilePic": reqData.profilePic } }
                        await projectCommentSchema.updateMany(condition, updateOperation)
                        let activityCondition = { "userDetails.id": userId }
                        let updateActivity = { $set: { "userDetails.name": reqData.firstName, "userDetails.profilePic": reqData.profilePic } }
                        await projectCommentSchema.updateMany(activityCondition, updateActivity);
                    }
                    //query to update the record based on given id and data
                    data = await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId), softDeleted: false }, { $set: value }, { returnDocument: 'after' });
                }
                const userActivityDetails = {
                    userId: userId,
                    activity: `${firstName + lastName} updated the user details `,
                    orgId: orgId,
                    category: 'Updated',
                    userDetails: {
                        id: _id,
                        name: firstName,
                        profilePic: profilePic,
                    },
                    createdAt: new Date(),
                    updatedAt: new Date(),
                };
                event.emit('activity', userActivityDetails);
                //check and send response if data found. else send fail response
                if (data.value) {
                    // Send Notification for updated values
                    const { firstName, lastName, role, permission } = isExist;
                    const initialValues = { firstName, lastName, role, permission };
                    let updatedValues = {};
                    // let message = [];
                    Object.entries(reqData).forEach(entry => {
                        const [key, value] = entry;
                        if (initialValues[key] !== reqData[key]) {
                            updatedValues[key] = value;
                        }
                    });
                    if (reuse.result.type === 'user') {
                        const msgAdmin = `Updated user profile details.`;
                        await NotificationService.adminNotification(msgAdmin, adminId, _id, { collection: 'user', id: data.value._id.toString() })
                    }
                    let message = `upadted your profile detailes`;
                    await NotificationService.userNotification(message, _id, userId, { collection: 'user', id: null });
                    if (adminId != creatorId && _id != creatorId) {
                        let msg = `Upadted profile detailes`
                        await NotificationService.userNotification(msg, _id, creatorId, { collection: 'user', id: null });
                    }

                    res.send(Response.projectSuccessResp(UserMessageNew['USER_UPDATE_SUCCESS'][language ?? 'en'], data));
                }
            } catch (err) {
                Logger.error(`error ${err}`);
                return res.send(Response.projectFailResp(UserMessageNew['USER_UPDATE_FAILED'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    //to delete user
    async deleteUser(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language, firstName, lastName, profilePic, _id: deletedById, adminId,permission} = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const userId = req?.query?.userId;
                const InvitationStatus = req?.query?.invitationStatus;
                let permissions = await getPermissions(orgId,permission);
                let managerLevelPermission = permissions?.permissionConfig?.user?.delete; 
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                //if get userId from request fetch records
                let dataFound;
                if (userId) {
                    if (reuse.result.type === 'user' && permission != 'admin') {
                        if (managerLevelPermission===false) return res.send(Response.projectFailResp("You do not have permission to delete Users"));

                        dataFound = await db
                            .collection(reuse.collectionName.user)
                            .find({ _id: ObjectId(userId), creatorId: deletedById, softDeleted: false })
                            .toArray();
                        if (dataFound.length == 0) return res.send(Response.projectFailResp("You lack permission to delete a user you did not create."));
                    } else {
                        dataFound = await db
                            .collection(reuse.collectionName.user)
                            .find({ _id: ObjectId(userId), softDeleted: false })
                            .toArray();
                    }
                    //check for given userId any task and project assigned or not
                    const projectsAssign = await db.collection(reuse.collectionName.project).countDocuments({ 'userAssigned.id': dataFound[0]._id.toString() });
                    const taskAssign = await db.collection(reuse.collectionName.task).countDocuments({ 'assignedTo.id': dataFound[0]._id.toString() });
                    //check if given userId don't have any task and project delete that user
                    if (projectsAssign == 0 && taskAssign == 0) {
                        let data = await db
                            .collection(reuse.collectionName.user)
                            .findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { softDeleted: true, deletedAt: new Date() } }, { returnDocument: 'after' });
                        let userActivityDetails = activityOfUser(`${firstName + lastName} deleted the ${dataFound[0].firstName + dataFound[0].lastName} user `, 'User', firstName, 'Deleted', orgId, deletedById, profilePic);
                        userActivityDetails['userId'] = userId;
                        event.emit('activity', userActivityDetails);
                        res.send(Response.projectSuccessResp(UserMessageNew['DELETE_SUCCESS'][language ?? 'en'], data));
                    }
                    //if user assigned to any task and project then send response
                    else {
                        res.send(Response.projectFailResp(UserMessageNew['USER_DELETE_FAIL'][language ?? 'en']));
                    }
                }
                //if not given UserID deleting multiple users by admin Id
                else {
                    let query = reuse.result.type === 'user' ? { $and: [{ creatorId: deletedById }, { softDeleted: false }] }
                        : { $and: [{ adminId: adminId }, { softDeleted: false }] }
                    //get data based on adminId

                    if (InvitationStatus) query.$and.push({ invitation: Number(InvitationStatus) })

                    dataFound = await db.collection(reuse.collectionName.user).aggregate([{ $match: query }]).toArray();
                    //counter to seperate  assigned or not assigned project and task
                    let userNotFound = 0;
                    let userFound = 0;
                    if (dataFound.length) {
                        //iterating each records to check the user is present in any task or project
                        for (const element of dataFound) {
                            const projects = await db.collection(reuse.collectionName.project).countDocuments({ 'userAssigned.id': element._id.toString(), softDeleted: false });
                            const task = await db
                                .collection(reuse.collectionName.task)
                                .countDocuments({ $or: [{ 'assignedTo.id': element._id.toString() }, { 'taskCreator.id': element._id.toString() }] });
                            const userId = element._id;
                            //if any user found who don't hae any task or project we delete and store count in userFound counter
                            if (projects == 0 && task == 0) {
                                await db.collection(reuse.collectionName.user).findOneAndUpdate({ _id: userId }, { $set: { softDeleted: true, deletedAt: new Date() } });
                                userFound++;
                            }
                            //if any user found with task or project assigned will increment userNotFound counter
                            else {
                                userNotFound++;
                            }
                        }
                        //here we send response for deleted users with userFound counter
                        if (userFound) {
                            let userActivityDetails = activityOfUser(`${firstName + lastName} deleted the all users `, 'User', firstName, 'Deleted', orgId, deletedById, profilePic);
                            userActivityDetails['userId'] = 'All';
                            event.emit('activity', userActivityDetails);
                            res.send(Response.userDeleteSuccessResp(UserMessageNew['DELETE_SUCCESS'][language ?? 'en'], `${userFound}`));
                        }
                        //here we send response for users who have task and project assigned
                        else if (userNotFound) {
                            res.send(Response.projectFailResp(UserMessageNew['DELETE_ALL_USER_FAIL'][language ?? 'en']));
                        }
                    } else {
                        res.send(Response.projectFailResp(UserMessageNew['USER_NOTFOUND'][language ?? 'en']));
                    }
                }
            } catch (err) {
                Logger.error(`error ${err}`);
                res.send(Response.projectFailResp(UserMessageNew['USER_DELETE_FAILED'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async searchUser(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, firstName, lastName, _id, profilePic } = reuse.result.userData?.userData;
        try {
            let { keyword } = req.query;
            const status = req?.query?.invitationStatus;
            const sortBy = {};
            const orderby = reuse.orderby || 'email';
            sortBy[orderby] = reuse.sort?.toString() === 'desc' ? -1 : 1;
            let fieldValue,
                obj = {},
                fields;

            const configFields = await configViewFieldSchema.find({ orgId: orgId });
            configFields.forEach(entry => {
                fields = entry['userViewFields'];
            });
            let viewAccess = viewFields(fields, fieldValue, obj);
            const extraAccess = {
                userName: 1,
                isSuspended: 1
            };
            const totalViewAccess = { ...viewAccess, ...extraAccess }
            let filterData = [];
            filterData = Object.keys(viewAccess);
            if (orderby != 'email') {
                let outIn = filterData.filter(word => orderby.includes(word));
                if (outIn.length == 0) {
                    return res.send(Response.projectFailResp('Failed to search, please check config Fields'));
                }
            }
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));

            const query = {};
            if (keyword) {
                Logger.info(keyword);
                const middleSpecial = /^[.\^\(\)\&$\#]+$/;
                const texts = middleSpecial.test(keyword);
                if (texts == true) {
                    return res.send(Response.projectFailResp('Failed to search, please check keyword'));
                }
                if (keyword === 'true' || keyword === 'false') {
                    query['$or'] = [{ isAdmin: JSON.parse(keyword) }, { verified: JSON.parse(keyword) }];
                } else {
                    query['$or'] = [
                        { email: new RegExp(keyword, 'i') },
                        { role: new RegExp(keyword, 'i') },
                        { permission: new RegExp(keyword, 'i') },
                        { profilePic: new RegExp(keyword, 'i') },
                        {
                            $expr: {
                                $regexMatch: {
                                    input: {
                                        $concat: ['$firstName', ' ', '$lastName'],
                                    },
                                    regex: keyword,
                                    options: 'i',
                                },
                            },
                        },
                    ];
                }
            }
            let data;
            // Filter Search Users By Invitation Status 0=pending, 1=accepted, 2=rejected
            if (status) {
                query.invitation = parseInt(status);
                data = await db
                    .collection(reuse.collectionName.user)
                    .aggregate([{ $match: {$and:[query, {softDeleted:false},{isSuspended:false}]} },{ $project: totalViewAccess }, { $sort: sortBy },
                        { $skip: reuse.skip },
                        { $limit: reuse.limit },])
    
                        .toArray();
            }
            // Search in all users
            else {
                data = await db
                    .collection(reuse.collectionName.user)
                    .aggregate([{ $match: {$and:[query, {softDeleted:false},{isSuspended:false}]} }, { $project: totalViewAccess }, { $sort: sortBy },
                    { $skip: reuse.skip },
                    { $limit: reuse.limit },])
                    .toArray();
            }
            const userCount = await db.collection(reuse.collectionName.user).countDocuments(query);
            for (const element of data) {
                const projects = await db
                    .collection(reuse.collectionName.project)
                    .aggregate([
                        { $match: { 'userAssigned.id': element._id.toString() } },
                        {
                            $project: {
                                _id: 1,
                                projectName: 1,
                                status: 1,
                            },
                        },
                    ])
                    .toArray();

                const task = await db
                    .collection(reuse.collectionName.task)
                    .aggregate([
                        { $match: { 'assignedTo.id': element._id.toString() } },
                        {
                            $project: {
                                _id: 1,
                                taskTitle: 1,
                                taskStatus: 1,
                            },
                        },
                    ])
                    .toArray();

                const subtask = await db
                    .collection(reuse.collectionName.subTask)
                    .aggregate([
                        { $match: { 'subTaskAssignedTo.id': element._id.toString() } },
                        {
                            $project: {
                                _id: 1,
                                subTaskTitle: 1,
                                subTaskStatus: 1,
                            },
                        },
                    ])
                    .toArray();
                let taskCompleted = 0;
                for (let item of task) {
                    if (item.taskStatus.toLowerCase() === 'done') {
                        taskCompleted += 1;
                    }
                }

                element.Project_details = {
                    TotalProjectCount: projects.length,
                    projects,
                };
                element.task_details = {
                    TotalTaskCount: task.length,
                    task,
                };
                element.subTask_details = {
                    TotalSubtaskCount: subtask.length,
                    subtask,
                };
                let progressCount = Math.round(((taskCompleted) / (task?.length)) * 100);
                element.progress = isNaN(progressCount) ? 0 : progressCount;

            }
            const resData = {
                skipValue: reuse.skip,
                TotalUserCount: userCount,
                user: data,
            };

            let userActivityDetails = activityOfUser(`${firstName + lastName} searched the user Details by ${orderby} `, 'User', firstName, 'Searched', orgId, _id, profilePic);
            event.emit('activity', userActivityDetails);
            Logger.info(data);
            return res.send(Response.projectSuccessResp(UserMessageNew['SEARCH_SUCCESS'][language ?? 'en'], resData));
        } catch (error) {
            Logger.error(`error ${error}`);
            return res.send(Response.projectFailResp(UserMessageNew['SEARCH_FAIL'][language ?? 'en'], error));
        }
    }

    async filter(req, res) {
        const reuse = new Reuse(req);
        const { _id: userId, language: language, orgId: organizationId, firstName: firstName, lastName, profilePic: profilePic } = reuse.result?.userData?.userData;
        try {
            const skipValue = reuse.skip;
            const limitValue = reuse.limit;
            const sortBy = {};
            let orderby = reuse.orderby || 'firstName';
            let extranlSort;
            if (orderby == 'projectCount' || orderby == 'taskCount' || orderby == 'performance') {
                extranlSort = orderby;
                orderby = 'firstName';
            }
            sortBy[orderby] = reuse.sort.toString() === 'asc' ? 1 : -1;
            const obj = await removeObjectNull(req?.body);
            const status = req?.query?.invitationStatus;
            let fieldValue,
                object = {},
                fields;
            const configFields = await configViewFieldSchema.find({ orgId: organizationId });
            configFields.forEach(entry => {
                fields = entry['userViewFields'];
            });
            let viewAccess = viewFields(fields, fieldValue, object);
            const extraAccess = {
                userName: 1,
                isSuspended: 1
            };
            const totalViewAccess = { ...viewAccess, ...extraAccess }
            const { value, error } = UserValidation.userFilter(obj);
            Logger.error(error);
            if (error) return res.send(Response.projectFailResp(UserMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
            if (JSON.stringify(value) == '{}') {
                return res.send(Response.projectFailResp(UserMessageNew['FIELD_NOT_SELECTED'][language ?? 'en']));
            }
            const db = await checkCollection(reuse.collectionName.user);
            if (!db) return res.send(Response.projectFailResp(`Project ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let query = [];
            let myFilters = {};
            let aggregateArr = [];
            if (req?.body.firstName) {
                Logger.info(req?.body.firstName);
                query.push({ firstName: new RegExp(req?.body.firstName, 'i') });
            }
            if (req?.body.lastName) {
                Logger.info(req?.body.lastName);
                query.push({ lastName: new RegExp(req?.body.lastName, 'i') });
            }
            if (req?.body.email) {
                Logger.info(req?.body.email);
                query.push({ email: new RegExp(req?.body.email, 'i') });
            }
            if (req?.body.role) {
                Logger.info(req?.body.role);
                query.push({ role: new RegExp(req?.body.role, 'i') });
            }
            if (req?.body.empmonitor && req?.body.empmonitor !== '0') {
                Logger.info(req?.body.empmonitor);
                let stringToBoolean = {
                    '1': true,
                    '2': false
                }
                query.push({ "emp_id": { $exists: stringToBoolean[req?.body?.empmonitor] } });
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
            if (req?.query?.invitationStatus) {
                query.push({ invitation: parseInt(status) });
            }
            let minProjectCount = req?.body?.projectCount?.min, maxProjectCount = req?.body?.projectCount?.max;

            let minTaskCount = req?.body?.taskCount?.min, maxTaskCount = req?.body?.taskCount?.max;
            aggregateArr.push(
                {
                    $match: myFilters,
                },
                {
                    $project: totalViewAccess,
                }
            );
            if (query.length) myFilters['$and'] = query;
            let count = await db.collection(reuse.collectionName.user).aggregate(aggregateArr).toArray();
            let resp = await db.collection(reuse.collectionName.user).aggregate(aggregateArr).sort(sortBy).skip(skipValue).limit(limitValue)
                .toArray();
            for (const element of resp) {
                const projects = await db
                    .collection(reuse.collectionName.project)
                    .aggregate([
                        { $match: { 'userAssigned.id': element._id.toString() } },
                        {
                            $project: {
                                _id: 1,
                                projectName: 1,
                                status: 1,
                            },
                        },
                    ])
                    .toArray();
                const task = await db
                    .collection(reuse.collectionName.task)
                    .aggregate([
                        { $match: { 'assignedTo.id': element._id.toString() } },
                        {
                            $project: {
                                _id: 1,
                                taskTitle: 1,
                                taskStatus: 1,
                            },
                        },
                    ])
                    .toArray();
                const subtask = await db
                    .collection(reuse.collectionName.subTask)
                    .aggregate([
                        { $match: { 'subTaskAssignedTo.id': element._id.toString() } },
                        {
                            $project: {
                                _id: 1,
                                subTaskTitle: 1,
                                subTaskStatus: 1,
                            },
                        },
                    ])
                    .toArray();
                element.Project_details = {
                    TotalProjectCount: projects.length,
                    projects,
                };
                element.task_details = {
                    TotalTaskCount: task.length,
                    task,
                };
                element.subTask_details = {
                    TotalSubtaskCount: subtask.length,
                    subtask,
                };
                //Calculating ProgressCount
                let projectCompleted = 0;
                let taskCompleted = 0;
                let subtaskCompleted = 0;
                let totalProjectCount = projects.length;
                let totalTaskCount = task.length;
                let totalSubTaskCount = subtask.length;
                for (let item of projects) {
                    if (item.status.toLowerCase() === 'done') {
                        projectCompleted += 1;
                    }
                }
                for (let item of task) {
                    if (item.taskStatus.toLowerCase() === 'done') {
                        taskCompleted += 1;
                    }
                }
                for (let item of subtask) {
                    if (item.subTaskStatus.toLowerCase() === 'done') {
                        subtaskCompleted += 1;
                    }
                }
                let progressCount = Math.round(((taskCompleted) / (totalTaskCount)) * 100);
                element.progress = isNaN(progressCount) ? 0 : progressCount;
            }

            if (req?.body?.projectCount) {
                const { min: minProjectCount, max: maxProjectCount } = req.body.projectCount;
              
                resp = resp.filter(user => {
                  const count = user?.Project_details?.TotalProjectCount ?? 0;
                  const meetsMin = minProjectCount !== undefined ? count >= minProjectCount : true;
                  const meetsMax = maxProjectCount !== undefined ? count <= maxProjectCount : true;
                  return meetsMin && meetsMax;
                });
              }
              
              if (req?.body?.taskCount) {
                const { min: minTaskCount, max: maxTaskCount } = req.body.taskCount;
              
                resp = resp.filter(user => {
                  const count = user?.task_details?.TotalTaskCount ?? 0;
                  const meetsMin = minTaskCount !== undefined ? count >= minTaskCount : true;
                  const meetsMax = maxTaskCount !== undefined ? count <= maxTaskCount : true;
                  return meetsMin && meetsMax;
                });
              }
              
            if (reuse.sort == 'asc') {
                if (extranlSort == 'projectCount') {
                    resp.sort(function (a, b) {
                        return a.Project_details.TotalProjectCount - b.Project_details.TotalProjectCount;
                    });
                }
                if (extranlSort == 'taskCount') {
                    resp.sort(function (a, b) {
                        return a.task_details.TotalTaskCount - b.task_details.TotalTaskCount;
                    });
                }
                if (extranlSort == 'performance') {
                    resp.users.sort(function (a, b) {
                        return a.progress - b.progress;
                    });
                }
            } else {
                if (extranlSort == 'projectCount') {
                    resp.sort(function (a, b) {
                        return b.Project_details.TotalProjectCount - a.Project_details.TotalProjectCount;
                    });
                }
                if (extranlSort == 'taskCount') {
                    resp.sort(function (a, b) {
                        return b.task_details.TotalTaskCount - a.task_details.TotalTaskCount;
                    });
                }
                if (extranlSort == 'performance') {
                    resp.sort(function (a, b) {
                        return b.progress - a.progress;
                    });
                }
            }
            let userActivityDetails = activityOfUser(`${firstName + lastName} Filtered the user Details`, 'User', firstName, 'Filtered', organizationId, userId, profilePic);
            event.emit('activity', userActivityDetails);
            res.send(Response.projectSuccessResp(UserMessageNew['USER_SEARCH'][language ?? 'en'], { count: count?.length, users: resp }));
        } catch (error) {
            Logger.error(`error ${error}`);
            return res.send(Response.projectFailResp('Failed to search', error));
        }
    }

    async fetchRecoverable(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId, _id, firstName, lastName, profilePic } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const orgId = reuse.result.userData.userData.orgId;
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.send(Response.projectFailResp(`${reuse.collectionName.user},${UserMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
                const usersCount = await db.collection(reuse.collectionName.user).countDocuments({ orgId: orgId, softDeleted: true });
                const obj = await removeObjectNull(req?.body);
                let fieldValue,
                    object = {},
                    fields;

                const configFields = await configViewFieldSchema.find({ orgId: orgId });
                configFields.forEach(entry => {
                    fields = entry['userViewFields'];
                });
                let viewAccess = viewFields(fields, fieldValue, object);
                let users = await db
                    .collection(reuse.collectionName.user)
                    .aggregate([
                        { $match: { orgId: orgId, softDeleted: true } },
                        {
                            $project: viewAccess,
                        },
                    ])
                    .skip(reuse.skip)
                    .limit(reuse.limit)
                    .toArray();
                if (!users.length) {
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], { users: users, count: users.length }));
                } else {
                    for (const element of users) {
                        const projects = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([
                                { $match: { 'userAssigned.id': element._id.toString() } },
                                {
                                    $project: reuse.projectObj,
                                },
                            ])
                            .toArray();
                        const task = await db
                            .collection(reuse.collectionName.task)
                            .aggregate([
                                { $match: { 'assignedTo.id': element._id.toString() } },
                                {
                                    $project: reuse.taskObj,
                                },
                            ])
                            .toArray();
                        const subtask = await db
                            .collection(reuse.collectionName.subTask)
                            .aggregate([
                                { $match: { 'subTaskAssignedTo.email': element.email } },
                                {
                                    $project: reuse.subTaskObj,
                                },
                            ])
                            .toArray();
                        element.Project_details = {
                            'Total project count': projects.length,
                            projects,
                        };
                        element.task_details = {
                            'Total task count': task.length,
                            task,
                        };
                        element.subTask_details = {
                            'Total sub-task count': subtask.length,
                            subtask,
                        };
                    }
                    let response = {
                        users: users,
                        count: usersCount,
                    };

                    //check and send  data in response if id found. if not then fail response
                    let userActivityDetails = activityOfUser(`${firstName + lastName} viewed Recoverable users details`, 'User', firstName, 'Viewed', orgId, _id, profilePic);
                    event.emit('activity', userActivityDetails);
                    //check and send  data in response if id found. if not then fail response
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], response));
                }
            } catch (e) {
                Logger.error(e);
                return res.send(Response.projectFailResp(UserMessageNew['USER_FETCH_FAIL'][language ?? 'en']));
            }
        } else {
            Logger.info(reuse.result);
            return res.send(reuse.result);
        }
    }

    async restoreUser(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language, firstName, lastName, profilePic, _id: restoredById } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const userId = req?.query?.userId;
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`${reuse.collectionName.user},${UserMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
                //query to update the record based on given id and data
                const data = await db
                    .collection(reuse.collectionName.user)
                    .findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId), softDeleted: true }, { $set: { softDeleted: false }, $unset: { deletedAt: '' } }, { returnDocument: 'after' });
                let userActivityDetails = activityOfUser(`${firstName + ' ' + lastName} restored ${data.value.firstName + ' ' + data.value.firstName} user`, 'User', firstName, 'Restored', orgId, restoredById, profilePic);
                userActivityDetails['userId'] = userId;
                event.emit('activity', userActivityDetails);
                //check and send response if data found. else send fail response
                data.value != null
                    ? res.send(Response.projectSuccessResp(UserMessageNew['USER_UPDATE_SUCCESS'][language ?? 'en'], data))
                    : res.send(Response.projectFailResp(UserMessageNew['USER_UPDATE_FAIL'][language ?? 'en']));
            } catch (err) {
                Logger.error(err);
                return res.send(Response.projectFailResp(UserMessageNew['USER_UPDATE_FAILED'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async forceDelete(req, res) {
        const reuse = new Reuse(req);
        const { orgId, language, firstName, lastName, profilePic, _id: adminId, isEmpMonitorUser, creatorId } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let emp_ids = [];
                const userId = req?.query?.userId;
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`${reuse.collectionName.user},${UserMessageNew['COLLECTION_SEARCH-FAILED'][language ?? 'en']}`));
                if (userId) {
                    let dataFound = await db
                        .collection(reuse.collectionName.user)
                        .find({ _id: mongoose.Types.ObjectId(userId) })
                        .toArray();
                    if (!dataFound.length) return res.send(Response.projectFailResp(UserMessageNew['USER_NOT_FOUND'][language ?? 'en']));
                    let data = await db.collection(reuse.collectionName.user).findOneAndDelete({ _id: mongoose.Types.ObjectId(userId) });
                    if (dataFound[0].emp_id) emp_ids.push(dataFound[0].emp_id);
                    if (isEmpMonitorUser && emp_ids?.length) {
                        const data = { emp_id: emp_ids, register: false, secretKey: config.get('emp_secret_key') };
                        await axios.post(config.get('update_emp_users_status'), data);
                    }
                    let activity = `${firstName + ' ' + lastName} deleted the ${dataFound[0].firstName + ' ' + dataFound[0].lastName} user permanently `;
                    let categoryType = 'Deleted';
                    let activityName = 'User';
                    let userActivityDetails = activityOfUser(activity, activityName, firstName, categoryType, orgId, adminId, profilePic);
                    userActivityDetails['userId'] = userId;
                    event.emit('activity', userActivityDetails);
                    // Notification to Admin
                    const message = `${firstName + lastName} Removed the user ${data.value.firstName}`;
                    await NotificationService.adminNotification(message, adminId.toString(), adminId, { collection: 'users', id: null });
                    // if (adminId != creatorId && _id != creatorId) {
                    //     await NotificationService.userNotification(message, creatorId, adminId, { collection: 'users', id: null });
                    // }

                    res.send(Response.projectSuccessResp(UserMessageNew['DELETE_SUCCESS'][language ?? 'en'], data));
                } else {
                    let query = { adminId: adminId }
                    let stringToBoolean = {
                        'true': true,
                        'false': false
                    }
                    if (req?.query?.softDeleted) query.softDeleted = stringToBoolean[req?.query?.softDeleted];
                    //get data based on adminId
                    let dataFound = await db.collection(reuse.collectionName.user).find(query).toArray();
                    let ans = [];
                    //iterating each records to check the user is present in any task or project
                    for (const element of dataFound) {
                        const fullName = element.firstName + ' ' + element.lastName;
                        const projects = await db.collection(reuse.collectionName.project).countDocuments({ 'userAssigned.id': element._id.toString(), softDeleted: false });
                        const task = await db
                            .collection(reuse.collectionName.task)
                            .countDocuments({ $or: [{ 'assignedTo.id': element._id.toString() }, { 'taskCreator.id': element._id.toString() }] });
                        const userId = element._id;
                        //if any user found who don't hae any task or project we delete and store count in userFound counter
                        if (projects == 0 && task == 0) {
                            const data = await db.collection(reuse.collectionName.user).deleteOne({ _id: userId });
                            data.deletedUser = fullName;
                            ans.push(data);
                            if (element.emp_id) emp_ids.push(element.emp_id);
                        }
                        //if any user found with task or project assigned will increment userNotFound counter
                        else {
                            ans.push({ error: `Cannot delete user ${fullName} with id ${userId}` });
                        }
                    }
                    if (isEmpMonitorUser && emp_ids?.length) {
                        const data = { emp_id: emp_ids, register: false, secretKey: config.get('emp_secret_key') };
                        await axios.post(config.get('update_emp_users_status'), data);
                    }
                    let userActivityDetails = activityOfUser(`${firstName + ' ' + lastName} deleted the user permanently `, 'User', firstName, 'Deleted', orgId, adminId, profilePic);
                    userActivityDetails['userId'] = 'All';
                    event.emit('activity', userActivityDetails);
                    // Notification to Admin
                    let usersDeleted = [];
                    for (let item of ans) {
                        usersDeleted.push(item.deletedUser);
                    }
                    const message = `${firstName + lastName} Removed user ${usersDeleted}`;
                    await NotificationService.adminNotification(message, adminId.toString(), adminId, { collection: 'users', id: null });
                    if (adminId != creatorId && _id != creatorId) {
                        await NotificationService.userNotification(message, creatorId, adminId, { collection: 'users', id: null });
                    }
                    res.send(Response.userDeleteSuccessResp(UserMessageNew['DELETE_SUCCESS'][language ?? 'en'], ans));
                }
            } catch (err) {
                Logger.error(`err ${err}`);
                res.send(Response.projectFailResp(UserMessageNew['USER_DELETE_FAILED'][language ?? 'en'], err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async getStat(req, res) {
        const reuse = new Reuse(req);
        const { language, orgId } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                const userId = req.query.userId;
                //define collection name here to find collection in database
                let fieldValue,
                    object = {},
                    fields;

                const configFields = await configViewFieldSchema.find({ orgId: orgId });
                configFields.forEach(entry => {
                    fields = entry['userViewFields'];
                });
                let viewAccess = viewFields(fields, fieldValue, object);
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                let data = await db
                    .collection(reuse.collectionName.user)
                    .aggregate([
                        { $match: { _id: mongoose.Types.ObjectId(userId), softDeleted: false } },
                        {
                            $project: viewAccess,
                        },
                    ])
                    .toArray();
                if (!data.length) {
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], { user: data }));
                } else {
                    for (const element of data) {
                        const projects = await db
                            .collection(reuse.collectionName.project)
                            .aggregate([
                                { $match: { 'userAssigned.id': element._id.toString() } },
                                {
                                    $project: {
                                        _id: 1,
                                        projectName: 1,
                                    },
                                },
                            ])
                            .toArray();
                        const task = await db
                            .collection(reuse.collectionName.task)
                            .aggregate([
                                { $match: { 'assignedTo.id': element._id.toString() } },
                                {
                                    $project: {
                                        _id: 1,
                                        taskTitle: 1,
                                    },
                                },
                            ])
                            .toArray();
                        for (const ele of task) {
                            const SubTasks = await db
                                .collection(reuse.collectionName.subTask)
                                .aggregate([
                                    { $match: { taskId: mongoose.Types.ObjectId(ele._id).toString(), 'subTaskAssignedTo.id': userId } },
                                    {
                                        $project: {
                                            _id: 1,
                                            subTaskTitle: 1,
                                        },
                                    },
                                ])
                                .toArray();
                            ele.subTaskUnderTask = {
                                SubTasks,
                            };
                        }
                        element.Project = {
                            projects,
                        };
                        element.tasks = {
                            task,
                        };
                    }
                    let response = {
                        data: data,
                    };
                    res.send(Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], response));
                }
            } catch (err) {
                Logger.error(err);
                res.send(Response.projectFailResp(UserMessageNew['USER_NOT_FOUND'][language ?? 'en']));
            }
        } else {
            res.send(reuse.result);
        }
    }

    async getUser(req, res) {
        const reuse = new Reuse(req);
        if (reuse.result.state === true) {
            const { orgId, language, firstName, lastName, isEmpMonitorUser, planName } = reuse.result.userData?.userData;
            try {
                if (isEmpMonitorUser) {
                    const wmId = reuse.result.userData.userData._id;
                    const data = {
                        wmId: wmId,
                        org_id: orgId,
                        secretKey: config.get('emp_secret_key'),
                        skip: reuse.skip,
                        limit: +req?.query?.limit,
                        orderBy: reuse.orderby || 'firstName',
                        sort: reuse.sort,
                        search: req?.query?.search,
                    };
                    let response = await axios.post(config.get('fetch_emp_users_link'), data);
                    // let userActivityDetails = activityOfUser(`${firstName+' '+ lastName} viewd user `, 'User', firstName, 'Viewed', orgId, adminId, profilePic);
                    // userActivityDetails['userId'] = 'All';
                    // event.emit('activity', userActivityDetails);
                    if (response) {
                        if (!response.data.data) return res.send(Response.projectSuccessResp(UserMessageNew['USER_NOTFOUND'][language ?? 'en'], { user_data: [], count: 0 }));
                        const plan = planName;
                        const db = await checkCollection(reuse.collectionName.user);
                        if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                        //to get total number of users count
                        const UserCount = await db.collection(reuse.collectionName.user).countDocuments({ orgId: orgId, softDeleted: false });
                        const planUser = await planModel.findOne({ planName: plan });
                        const rem_users = planUser.userFeatureCount - UserCount;
                        return res.send(
                            Response.projectSuccessResp(UserMessageNew['USER_FETCH_SUCCESS'][language ?? 'en'], {
                                total_remaining_empUser_count: response?.data?.total_count,
                                activated_wm_users: UserCount,
                                remaining_users_plan: rem_users,
                                user_data: response?.data?.data,
                                count: response?.data?.count,
                            })
                        );
                    }
                } else {
                    return res.send(Response.projectFailResp(UserMessageNew['NOT_AUTHORIZED'][language ?? 'en']));
                }
            } catch (err) {
                Logger.error(err);
                res.send(Response.projectFailResp(UserMessageNew['ORG_FOUND'][language ?? 'en']));
            }
        }
    }

    async suspendUser(req, res) {
        const result = req.verified;
        try {
            const { orgId, language, firstName, lastName, adminId, profilePic } = result.userData?.userData;
            let userId = req?.query?.userId;
            let suspendUSer = req?.body.isSuspended;

            const { error } = UserValidation.validateUserState(req.body);
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));
            const userCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let userExist = await db.collection(userCollectionName).findOne({ _id: mongoose.Types.ObjectId(userId) });
            if (!userExist) {
                return res.send(Response.projectFailResp(`User not found. Please checked Provided UserId`));
            }
            if (suspendUSer === true) {
                let UpdateUser = await db.collection(userCollectionName).findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { isSuspended: suspendUSer, suspendedAt: new Date() } }, { returnDocument: 'after' });
                UpdateUser ? res.send(Response.projectSuccessResp(`User suspended successfully`)) : res.send(Response.projectFailResp(`User is already suspended`));
                let userActivityDetails = activityOfUser(`${firstName + ' ' + lastName} suspended the ${UpdateUser.firstName + UpdateUser.lastName} user `, 'User', firstName, 'Updated', orgId, adminId, profilePic);
                userActivityDetails['userId'] = userId;
                event.emit('activity', userActivityDetails);
            }
            if (suspendUSer === false) {
                let UpdateUser = await db.collection(userCollectionName).findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { isSuspended: suspendUSer, suspendedAt: new Date() } }, { returnDocument: 'after' });
                UpdateUser ? res.send(Response.projectSuccessResp(`User resumed successfully`)) : res.send(Response.projectFailResp(`User is already resumed`));
                let userActivityDetails = activityOfUser(`${firstName + ' ' + lastName} resumed the ${UpdateUser.firstName + UpdateUser.lastName} user `, 'User', firstName, 'Updated', orgId, adminId, profilePic);
                userActivityDetails['userId'] = userId;
                event.emit('activity', userActivityDetails);
            }
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error in update user state details.', err.message));
        }
    }

    async updateProfile(req, res) {
        const result = req.verified;
        let { orgId, language, adminId, creatorId, _id: Id } = result?.userData?.userData;
        try {
            let userId = req?.query?.userId;
            let data = req?.body;
            const { value, error } = UserValidation.updateProfile(data);
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));
            const profilePic = value?.profilePic;
            if (profilePic) {
                if (
                    !(
                        profilePic?.includes('.jpeg') ||
                        profilePic?.includes('.png') ||
                        profilePic?.includes('.jpg') ||
                        profilePic?.includes('.svg+xml') ||
                        profilePic?.includes('.svg') ||
                        profilePic?.includes('https') ||
                        profilePic?.includes('http')
                    ) &&
                    profilePic
                ) {
                    return res.status(400).send(Response.validationFailResp('Invalid Input,Provide valid image extension or url for Profile Pic'));
                }
            }
            const userCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let userExist = await db.collection(userCollectionName).findOne({ _id: mongoose.Types.ObjectId(userId) });
            if (!userExist) {
                return res.send(Response.projectFailResp(`User not found. Please checked Provided UserId`));
            }
            let UpdateProfile = await db.collection(userCollectionName).findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: value }, { returnDocument: 'after' });
            let userActivityDetails = activityOfUser(`${UpdateProfile.value.firstName + UpdateProfile.value.lastName} updated the profile pic`, 'User', UpdateProfile.value.firstName, 'Updated', orgId, adminId, profilePic);
            userActivityDetails['userId'] = userId;
            event.emit('activity', userActivityDetails);
            if (result.type === 'user') {
                const msgAdmin = `Updated user profile details .`;
                await NotificationService.adminNotification(msgAdmin, adminId, Id, { collection: 'user', id: userId })
            }
            let message = `upadted your profile detailes`;
            await NotificationService.userNotification(message, Id, userId, { collection: 'user', id: userId });
            if (adminId != creatorId && _id != creatorId) {
                let msg = `Upadted profile detailes`
                await NotificationService.userNotification(msg, Id, creatorId, { collection: 'user', id: userId });
            }
            UpdateProfile
                ? res.send(Response.projectSuccessResp(`User Profile picture updated successfully`, UpdateProfile.value))
                : res.send(Response.projectFailResp(`unable to update User Profile picture.`));
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Error in update user profile picture.', err.message));
        }
    }
    async resendVerifyMail(req, res) {
        const result = req.verified;
        try {
            let userId = req?.query?.userId;
            if (!userId) return res.status(400).send(Response.projectFailResp(`userId required`));
            const userCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let userExist = await db.collection(userCollectionName).find({ _id: mongoose.Types.ObjectId(userId) }).toArray()
            if (!userExist) {
                return res.send(Response.projectFailResp(`User not found. Please checked Provided UserId`));
            }
            if (userExist[0].verified == true) return res.send(Response.projectFailResp(`User Already Verified`));
            if (userExist[0].invitation == 2) await db.collection(userCollectionName).findOneAndUpdate({ _id: mongoose.Types.ObjectId(userId) }, { $set: { invitation: 0 } })

            const current_day = new Date();
            const token_expire = userExist[0].emailTokenExpire;
            let data;
            if (new Date(moment(current_day).format('YYYY-MM-DD')) >= new Date(moment(token_expire).format('YYYY-MM-DD'))) {
                data = await db
                    .collection(userCollectionName)
                    .findOneAndUpdate({ email: userExist[0].email }, { $set: { emailValidateToken: uuidv1(), emailTokenExpire: new Date(moment().add(1, 'day')), verificationEmailSentCount: 1 } });
            }
            //checking email sending restriction for a day
            else if (userExist[0].verificationEmailSentCount >= config.get('verificationEmailSentCount') && new Date(token_expire) > new Date(current_day)) {
                return res.send(Response.projectFailResp('Verification mail sent limit reached,Please try next day.'));
            }
            //increasing the count every time after mail sent
            else if (current_day <= token_expire) {
                data = await db.collection(userCollectionName).findOneAndUpdate(
                    { email: userExist[0].email },
                    {
                        $set: {
                            emailValidateToken: uuidv1(),
                            emailTokenExpire: new Date(moment(current_day).add(1, 'day')),
                            verificationEmailSentCount: userExist[0].verificationEmailSentCount + 1,
                        },
                    },
                    { returnDocument: 'after' }
                );
            }
            if (process.env.node_env !== 'localDev') {
                let mailResponse = await MailResponse.sendUserVerificationMail([data.value]);
                return mailResponse
                    ? res.send(Response.projectSuccessResp(`User verification Mail send successfully`))
                    : res.send(Response.projectFailResp(`Something went wrong,Please try again`))
            }
            res.send(Response.projectSuccessResp(`User verification Mail send successfully`))
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp('Something went wrong.', err.message));
        }
    }
    async updateUserPassword(req, res) {
        const result = req.verified;
        const { language, email } = result.userData?.userData;
        try {
            const { oldPassword } = req?.body;
            const userCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            const userData = await db.collection(userCollectionName).findOne({ email: email });
            if (!userData) { return res.send(Response.projectFailResp("Can't update password")); }
            let decryptedPassword = await Password.decryptText(userData.password, config.get('encryptionKey'));
            if (oldPassword !== decryptedPassword) return res.send(Response.projectFailResp(AdminMessageNew['ADMIN_CURRENT_PASSWORD_FAIL'][language ?? 'en']));
            const newPassword = req?.body?.newPassword ? await Password.encryptText(req.body.newPassword, config.get('encryptionKey')) : null;
            const { error } = await usersValidate.updatePassword(req.body);
            if (error) return res.send(Response.projectFailResp(CommentMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.message));
            const resultData = await db.collection(userCollectionName).findOneAndUpdate({ email: email }, { $set: { password: newPassword } }, { returnDocument: 'after' });
            res.send(Response.projectSuccessResp("password updated successfully", resultData));
        } catch (err) {
            Logger.error(`Error in catch ${err}`);
            res.send(Response.projectFailResp("Failed to update password", err.message));
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
                isSuspended:1
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
            for (const [idx, project] of response.entries()) {
                if (project.userAssigned?.length) {
                    let users = [];
                    for (const [index, user] of project.userAssigned.entries()) {
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
                    project.userAssigned = users;
                }
                if (project?.group?.length) {
                    for (const [index, value] of project.group.entries()) {
                        const groupDetails = await GroupSchema.aggregate([
                            { $match: { _id: ObjectId(value.groupId) } },
                            {
                                $project: groupObj,
                            },
                        ]);
                        if (groupDetails.length) {
                            project.group[index] = groupDetails[0];
                            let users = [];
                            for (const user of project.group[index].assignedMembers) {
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
                            project.group[index].assignedMembers = users;
                        }
                    }
                }
            }

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
                if (task?.subTask?.length) {
                    for (const [index1, subtask] of task.subTask.entries()) {
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
            for (const [idx, subTasks] of response.entries()) {
                if (subTasks.subTaskAssignedTo?.length) {
                    let users = [];
                    for (const [index, user] of subTasks.subTaskAssignedTo.entries()) {
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
                    subTasks.subTaskAssignedTo = users;
                }
            }
            return response;
        } catch (err) {
            Logger.error({ "err": err });
        }
    }
    async multiDeleteUsers(req, res) {
        const reuse = new Reuse(req);
        const { language, planName } = reuse.result.userData?.userData;
        if (reuse.result.state === true) {
            try {
                let response;
                const userCollectionName = `org_${reuse.result?.userData?.userData?.orgId.toLowerCase()}_users`;
            const db = await checkCollection(userCollectionName);
            if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
                response=await db.collection(userCollectionName).deleteMany({_id: { $in: req.body.usersIds.map(user=>ObjectId(user.id) )} });
                response.deletedCount > 0 ?
                    res.send(Response.projectSuccessResp("Users deleted successfully.")) :
                    res.send(Response.projectFailResp("Failed to delete users,please check provided Ids"));
            } catch (err) {
                return res.send(Response.projectFailResp("Error while deleting users", err.message));
            }
        } else {
            res.send(reuse.result);
        }
    }
    async fetchCreator(data, collectionName, db) {

        for (const project of data?.Project_details) {
            project.projectCreatedBy = await creatorDetails(project.projectCreatedBy, collectionName, db);
        }
        for (const task of data?.Task_details) {
            task.taskCreator = await creatorDetails(task.taskCreator, collectionName, db);
            if (task?.subTask?.length) {
                for (const subtask of task.subTask) {
                    subtask.subTaskCreator = await creatorDetails(subtask.subTaskCreator, collectionName, db);
                }
            }
        }
    }
    async fetchSuspend(req, res) {
        const reuse = new Reuse(req);
        const { language, email, _id, orgId } = reuse.result.userData?.userData;
        try {
            let skipValue=+req?.query?.skip|| 0;
            let limitValue=+req?.query?.limit|| 10;
            const db = await checkCollection(reuse?.collectionName.user);
            const fetchusers = await db.collection(reuse?.collectionName.user).find({ orgId: orgId, isSuspended: true }).skip(skipValue).limit(limitValue).toArray();
            const count = await db.collection(reuse.collectionName.user).countDocuments({ orgId: orgId, isSuspended: true })
            return res.send(Response.projectSuccessResp("Sucessfully fetched suspended user", {count,fetchusers}))
        } catch (err) {
            Logger.error(`${err}`);
            return res.send(Response.projectFailResp("Failed to fetch suspended user", err))
        }
    }

    async bulkUserRegister(req,res){
        const reuse = new Reuse(req);
        const { orgId, adminId, language, profilePic: userProfilePic, firstName: userName, _id: userId, planData, email: adminEmail, isEmpMonitorUser, lastName, orgName, permission: userPermission, isAdmin} = reuse.result?.userData?.userData;
        try{
            if (req.files.length===0) return res.send(Response.FailResp(commonMessage['COMMON_ERROR'],'Please provide a file'));
            if (Array.isArray(req.files) && req.files.length > 1) return res.send(Response.FailResp('Please upload only one file'));
                      
            const {value,error:docError}= await this.uploadUserDoc(req,"bulk");
            if(docError) return res.send(Response.projectFailResp(`Error in uploaded document!`,docError));
            if(!value || value.length===0) return res.send(Response.FailResp(commonMessage['COMMON_ERROR']['en'],`Unsupported file format`));

            // const {error,value}= await this.validateUsers(data,"bulk",reuse);
            // if (error?.length) return res.send(Response.projectFailResp(`An error occurred while processing the bulk registration`, error[0]));
            value.orgId = orgId;
            value.adminId = userId;
            // res.send(value);


            const db = await checkCollection(reuse.collectionName.user);
            //To check collection is present or not in database
            if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));


            //User creation code 
            const userTotalCount = await db.collection(reuse.collectionName.user).find({ orgId: orgId, invitation: 1 }).toArray();
            let presentUser = userTotalCount.length + value?.length;
            if (presentUser > planData.userFeatureCount) {
                if ((planData.userFeatureCount - userTotalCount.length) === 0 || (planData.userFeatureCount - userTotalCount.length) <= data?.length) {
                    return res.status(429).send(Response.projectFailResp(`${UserMessageNew['USER_PLAN_LIMIT'][language ?? 'en']} maxUserFeatures=${planData.userFeatureCount}, existingUserCount=${userTotalCount?.length}, providedDataCount=${data?.length}`));
                }
            }
                let existUser = [];
                let failedUser = [];
                let newUser = [];
                let emp_ids = [];
                let users = value;
                let userValues = [];
                users.forEach(entry => {
                    userValues.push(Object.keys(entry));
                });
                let configUserFields = [],
                    enabledFields = [],
                    requiredFields = [],
                    unRequiredFields = [];
                const configFields = await configFieldSchema.find({ orgId: orgId });
                configFields.forEach(entry => {
                    entry['userFields'].map(run => {
                        configUserFields.push(run);
                    });
                });
                checkingFieldValues(configUserFields, enabledFields, requiredFields, unRequiredFields);
                let outIn = filterFieldsValues(userValues, requiredFields);
                const isPresented = requiredFields.filter(word => !outIn.includes(word));
                let output;
                if (isPresented.length > 0) {
                    return res.send(Response.projectFailResp(isPresented.length > 1 ? `Validation failed,${isPresented} fields required` : `Validation failed,${isPresented} field required`));
                }
                let totalEnabledFields = requiredFields.concat(enabledFields);
                Logger.info(totalEnabledFields);
                output = filterFieldsValues(userValues, unRequiredFields);
                let insertedResult = {};
                if (output.length > 0) {
                    res.send(Response.projectFailResp(`Validation failed,${output} fields are not enabled `));
                } else {
                    if (reuse.result.userData.userData.isEmpMonitorUser) {
                        users.map(e => {
                            delete e.role;
                            delete e.department;
                            delete e.emp_code;
                            return e;
                        });
                    }
                    const isAdmin = await users.find(user => user.email === adminEmail);
                    if (isAdmin) return res.status(400).send(Response.projectFailResp(UserMessageNew['USER_CREATE_FAIL'][language ?? 'en']));
                    // check for the users null validation pending...
                    users = removeDuplicates(users, 'email');
                    const promises = await users?.map(async user => {
                        const userEmail = user?.email;
                        const { value, error } = UserValidation.createUser(user);
                        if (error) {
                            failedUser.push({ user, err: error.message });
                            return;
                        }
                        const role = value?.role.toLowerCase();
                        const permission = value?.permission;
                        Logger.error(error);
                        if (error) return res.status(400).send(Response.validationFailResp(UserMessageNew['VALIDATION_FAIL'][language ?? 'en'], error.message));
                        const db = await checkCollection(reuse.collectionName.user);
                        if (!db) return res.status(400).send(Response.projectFailResp(`Invitation ${UserMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));

                        const roleExist = await roleModel.findOne({ roles: role });
                        const permissionExist = await permissionModel.findOne({ permissionName: permission });
                        if (!roleExist) {
                            failedUser.push({ user, err: `${role} Role not exist please select valid role` });
                            return;
                        } else if (!permissionExist) {
                            failedUser.push({ user, err: `${permission} permission not exist please select valid permission` });
                            return;
                        } else {
                            const isDataExist = await db.collection(reuse.collectionName.user).findOne({ email: new RegExp('^' + userEmail, 'i') });
                            if (!isDataExist) {
                                value.orgId = orgId;
                                value.adminId = isAdmin ? reuse.result?.userData?.userData._id : adminId;
                                let password = PasswordGenerator.generate({ length: 10, numbers: true });
                                value.password = await Password.encryptText(orgId, config.get('encryptionKey'));
                                (value.verified = false), //default values should work
                                    (value.emailValidateToken = uuidv1()),
                                    (value.emailTokenExpire = moment().add(1, 'day')?._d),
                                    (value.isAdmin = false);
                                value.createdAt = new Date();
                                value.softDeleted = false;
                                value.email = value.email.toLowerCase();
                                value.role = roleExist.roles.toLowerCase();
                                value.creatorId = userId;
                                value.invitation = 0;

                                //if user not exist then it will create new user
                                const permissionCheck = await permissionModel.findOne({ permissionName: userPermission });
                                if (reuse.result.type === 'user' && permissionCheck.permissionConfig.user.create == false) {
                                    return res.send(Response.projectFailResp(`You don't have permission to create User`));
                                }
                                if (reuse.result.type != 'user') {
                                    value.userName = '@' + value.firstName + value.lastName + '_' + orgName.split(' ')[0];//to update the status if it is an emp user
                                    newUser.push(value);
                                } else {
                                    const adminData = await adminModel.findOne({ _id: adminId })
                                    value.userName = '@' + value.firstName + value.lastName + '_' + adminData.orgName.split(' ')[0];//to update the status if it is an emp user
                                    newUser.push(value);
                                }
                                insertedResult = await db.collection(reuse.collectionName.user).insertOne(value);
                                //storing the activity
                                let userActivityDetails = activityOfUser(`${userName + lastName} added  ${value.firstName + value.lastName} user`, 'User', userName, 'Updated', orgId, userId, userProfilePic);
                                userActivityDetails['userId'] = insertedResult.insertedId.toString();
                                event.emit('activity', userActivityDetails);
                                emp_ids.push(value.emp_id);
                            } else {
                                existUser.push(value);
                            }
                        }
                    });
                    await Promise.all(promises);
                    //after successfully creating user calculation total user count and subscription user count
                    let userCount, resp;
                    const db = await checkCollection(reuse.collectionName.user);
                    userCount = await db.collection(reuse.collectionName.user).countDocuments({});
                    resp = {
                        userCreatedCount: userCount,
                        userRemainingCount: planData.userFeatureCount - userCount,
                        userDetails: newUser,
                    };
                    if (newUser.length) {
                        let mailResponse = await MailResponse.sendUserVerificationMail(newUser);
                        Logger.info(`Mail invitation response ${mailResponse}`);
                    }
                    if (existUser.length && newUser.length && failedUser.length) {
                        res.send(Response.projectPartialSuccessResp(`User created successfully`, { resp, existUser, msg: 'users failed to add', failedUser }));
                    }else if (existUser.length) {
                        res.send(Response.projectFailResp(`Users  already exist with organization`, { userCreatedCount: userCount, existUser }));
                    } else if (newUser.length) {
                        res.send(Response.projectSuccessResp('New user created successfully', resp));
                    } 
                }
                if (emp_ids?.length && isEmpMonitorUser) {
                    const data = { emp_id: emp_ids, register: true, secretKey: config.get('emp_secret_key') };
                    await axios.post(config.get('update_emp_users_status'), data);
                }


        }catch(error){
            Logger.error(`${error}`);
            return res.send(Response.projectFailResp("Failed to fetch suspended user", error));
        }
        
    }

    async uploadUserDoc(req,bulk){ //check for bulk update & register

        let requiredFields=[   'email','firstName','lastName'];

        if(bulk){
            requiredFields=['firstName','lastName','email'];
        }

        let headers=[];
        let inValidFields=[];
        req.file=req.files[0];
        const fileExtension = req.file.originalname.split('.').pop();
        let doc=[];
        if(['xls', 'xlsx'].includes(fileExtension)){
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Check if sheetData is not empty and get headers from the first object
            headers = sheetData.length > 0 ? Object.keys(sheetData[0]) : [];
            doc= sheetData;
        }
        const extraFields = headers.filter(header => !requiredFields.includes(header));
        if (extraFields.length > 0) {
            inValidFields.push(extraFields);
        }
        // Delete the file before returning
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.error('Error deleting file:', err);
        }

        if(inValidFields.length>0){
            return {value:null,error:inValidFields}
        } 
        // Check for duplicate emails in input data
        let emailMap = new Map();
        let duplicateEmailErrors = [];

        doc.forEach((user, index) => {
            const email = user.email;
            if (!email) return; // skip empty emails

            if (emailMap.has(email)) {
                duplicateEmailErrors.push({
                    at: `row ${index + 2}`,
                    message: `Error: Duplicate email "${email}" found in input data (also found at row ${emailMap.get(email) + 2})`
                });
            } else {
                emailMap.set(email, index);
            }
        });

        // If any duplicates found in the input
        if (duplicateEmailErrors.length > 0) {
            return { error: duplicateEmailErrors, value: null };
        }

        // No duplicates in input, proceed
        let data = doc; // continue using this as the clean input
        return {value:data,error:null}
    }

    async validateUsers(data, bulk ,reuse) {

        // console.log(data);
        let requiredField = [
            'email',
            'firstName',
            'lastName'
        ];
    
        if (bulk) {
            requiredField = ['email'];
        }
    
        let validationErrors = [];
        let validRecords = [];
    
        // Regular expression to validate timezone format like "(UTC +08:00) Singapore, Asia"
  
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
    
        data.forEach((item, index) => {
            let isValid = true;
            let errorFound = false; // Flag to track if an error is already found for this row
    
            if(bulk){
                  // Password validation in bulk mode
                  if (!errorFound && item.password && !passwordRegex.test(item.password)) {
                    validationErrors.push({
                        at: `row ${index + 2}`,
                        message: `Password required minimum 8 characters, at least one uppercase letter, one number, and one special character.`
                    });
                    isValid = false;
                    errorFound = true;
                }
                
            }
            // Check for required fields non bulk 
            requiredField.forEach((field) => {
                if (!errorFound && (!item.hasOwnProperty(field) || item[field] === null || item[field] === undefined || item[field] === "")) {
                    validationErrors.push({
                        at: `row ${index + 2}`,
                        message: `Error: Missing "${field}" in record`
                    });
                    isValid = false;
                    errorFound = true; // Mark that an error was found
                }
  
              // Password validation in non-bulk mode
              if (!errorFound && field === 'password' && item[field] && !passwordRegex.test(item[field])) {
                validationErrors.push({
                    at: `row ${index + 2}`,
                    message: `Password required minimum 8 characters, at least one uppercase letter, one number, and one special character.`
                });
                  isValid = false;
                  errorFound = true;
                }
  
            });
          if (isValid) validRecords.push(item);
        });
    
        // Extract fields for checking duplicates
        const emails = data.map(user => user.email);

        // console.log(emails,'emails');
        // Database query to find existing records with matching fields
        const db = await checkCollection(reuse?.collectionName.user);
        const Users = await db.collection(reuse?.collectionName.user).find({
            email: { $in: emails }
        }).toArray();

        // Database query to check for admin emails in adminSchema
        const Admins = await adminModel.find({
          email: { $in: emails }
        });
  
        // // Check for duplicates in the data and push them to validationErrors
        // if (!bulk) {
            data.forEach((item, index) => {
                let errorFound = false; // Reset error flag for each row

                      // ✅ Email validation using Joi
                      if (!errorFound && item.email && usersValidate.validateEmails({email:item?.email}).error) {
                        validationErrors.push({
                            at: `row ${index + 2}`,
                            message: `Invalid email format: "${item.email}"`
                        });
                        errorFound = true;
                    }
                // Check against Users for duplicates
                Users.forEach((user) => {
                    if (!errorFound && item.email === user.email) {
                        validationErrors.push({
                            at: `row ${index + 2}`,
                            message: `Error: Duplicate email "${item.email}" found`
                        });
                        errorFound = true;
                    }
    
                });
  
                // Check against Admins for admin email usage
                Admins.forEach((admin) => {
                  if (!errorFound && item.email === admin.email) {
                      validationErrors.push({
                          at: `row ${index + 2}`,
                          message: `Error: Email "${item.email}" is reserved for admin accounts and cannot be used`
                      });
                      errorFound = true;
                  }
              });

            });
        // }
        if (validationErrors.length > 0) {
            return { error: validationErrors, value: null };
        }
        return { error: null, value: validRecords };
    }
    async downloadForBulkUpdate(req,res,next){
        const reuse = new Reuse(req);
        const { orgId, adminId, language, profilePic: userProfilePic, firstName: userName, _id: userId, planData, email: adminEmail, isEmpMonitorUser, lastName, orgName, permission: userPermission, isAdmin} = reuse.result?.userData?.userData;
        try{
            let skipValue=+req?.query?.skip|| 0;
            let limitValue=+req?.query?.limit|| 10;
            const db = await checkCollection(reuse.collectionName.user);
            const users = await db
            .collection(reuse.collectionName.user)
            .find(
              { orgId: orgId, invitation: 1 },
              {
                projection: {
                  password: 0,
                  _id: 0,
                  role: 0,
                  permission: 0,
                  verificationEmailSentCount: 0,
                  softDeleted: 0,
                  verified: 0,
                  forgotPasswordToken: 0,
                  forgotTokenExpire: 0,
                  passwordEmailSentCount: 0,
                  adminId: 0,
                  emailValidateToken: 0,
                  emailTokenExpire: 0,
                  isAdmin: 0,
                  createdAt: 0,
                  creatorId: 0,
                  invitation: 0,
                  isSuspended: 0,
                  profilePic: 0,
                  orgId: 0,
                  lastLogin: 0,
                  updatedAt: 0
                }
              }
            )
            .skip(skipValue)  
            .limit(limitValue) 
            .toArray();          
            let totalUserCount = await db.collection(reuse.collectionName.user).countDocuments({ orgId: orgId, invitation: 1 })

            return res.send(Response.projectSuccessResp("Successfully fetched suspended user", {totalUserCount,users}))

        }catch(error){
            Logger.error(`${error}`);
            return res.send(Response.projectFailResp("Failed to Fetch User's",error));
        }
    }
    async bulkUserUpdate(req,res,next){
        const reuse = new Reuse(req);
        const { orgId, adminId, language, profilePic: userProfilePic, firstName: userName, _id: userId, planData, email: adminEmail, isEmpMonitorUser, lastName, orgName, permission: userPermission, isAdmin} = reuse.result?.userData?.userData;
        try{
            const db = await checkCollection(reuse.collectionName.user);
            if (req.files.length===0) return res.send(Response.projectFailResp(commonMessage['COMMON_ERROR'],'Please provide a file'));
            if (Array.isArray(req.files) && req.files.length > 1) return res.send(Response.projectFailResp('Please upload only one file'));
            
            const {value:data,error:docError}= await this.validateUploadUserDoc(req,"bulk");
            
            if(docError) return res.send(Response.projectFailResp(`The following field's are not allowed`,docError));
            const updateErrors=[];
        
        await Promise.all(
            data.map(async (value,index)=>{
                const ExistEmail= await db.collection(reuse.collectionName.user).findOne({email:value.email.toLowerCase()});
                // console.log(ExistEmail,'ExistEmail');
                if(!ExistEmail) updateErrors.push({
                    row: index + 1,
                    email: value.email.toLowerCase(),
                    message: `email not exist: ${value.email.toLowerCase()} at row no. ${index + 1}`,
                });

                if(value.userName){
                    const ExistUsername= await db.collection(reuse.collectionName.user).findOne({userName:value.userName});
                    if(ExistUsername) updateErrors.push({
                        row: index + 1,
                        userName: value.userName,
                        message: `userName: ${value.userName} already exists at row no. ${index + 1}`,
                    })
                }

              // Check if role exists and update value.role with _id
              if(value.role){
                const ExistRole = await roleModel.findOne({orgId,roles:value.role.toLowerCase()});
                if(!ExistRole) {
                  updateErrors.push({
                    row: index + 1,
                    role:value.role,
                    message:`Role ${value.role} not exist : at row no. ${index + 1}`
                  })
              }else{
                value.role=ExistRole.roles
              }
              }
            }))
            
            if(updateErrors?.length>0) return res.send(Response.projectFailResp(`Cannot update error found:`,updateErrors));
            
            const permissionCheck = await permissionModel.findOne({ permissionName: userPermission });

            if (reuse.result.type === 'user' || (permissionCheck!==null && permissionCheck.permissionConfig.user.edit == false)) {
                return res.send(Response.projectFailResp(`You don't have permission to Edit User's`));
            }

            const updateUser = await Promise.all(
                data.map(async (value) => {
                  const result = await db.collection(reuse.collectionName.user).findOneAndUpdate(
                    { email: value.email.toLowerCase() },
                    {
                      $set: {
                        firstName: value.firstName,
                        lastName: value.lastName,
                        userName: value.userName,
                        location: value.location,
                        role: value.role,
                        creatorId: adminId ?? userId,
                      },
                    },
                    { returnDocument: 'after', upsert: false } // 'new' is deprecated, use returnDocument
                  );
              
                //   console.log(result, 'result');
              
                  if (result.value) {
                    // only log activity if update actually happened
                    const updatedUser = result.value;
                    let userActivityDetails = activityOfUser(
                      `${userName} updated ${updatedUser.firstName} ${updatedUser.lastName} user`,
                      'User',
                      userName,
                      'Updated',
                      orgId,
                      userId,
                      userProfilePic
                    );
                    userActivityDetails['userId'] = updatedUser._id.toString();
                    event.emit('activity', userActivityDetails);
                  }
              
                  return result?.value;
                })
              );

        if(updateUser?.length){
            res.send(Response.projectSuccessResp("Bulk user's updated successfully", updateUser));
        }


        } catch (err) {
            Logger.error(`${err}`);
            console.log(err);
            return res.send(Response.projectFailResp("Failed to update Bulk user's", err))
        }

    }

    async validateUploadUserDoc(req,bulk){ //check for bulk update & register

        let requiredFields=['firstName','lastName','role','email'];

        if(bulk){
            requiredFields=['firstName','lastName','role','email'];
        }

        let headers=[];
        let inValidFields=[];
        req.file=req.files[0];
        const fileExtension = req.file.originalname.split('.').pop();
        let doc=[];
        if(['xls', 'xlsx'].includes(fileExtension)){
            const workbook = XLSX.readFile(req.file.path);
            const sheetName = workbook.SheetNames[0];
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

            // Check if sheetData is not empty and get headers from the first object
            headers = sheetData.length > 0 ? Object.keys(sheetData[0]) : [];
            doc= sheetData;
        }
        const extraFields = headers.filter(header => !requiredFields.includes(header));
        if (extraFields.length > 0) {
            inValidFields.push(extraFields);
        }
        // Delete the file before returning
        try {
            fs.unlinkSync(req.file.path);
        } catch (err) {
            console.error('Error deleting file:', err);
        }

        if(inValidFields.length>0){
            return {value:null,error:inValidFields}
        } 


        // No duplicates in input, proceed
        let data = doc; // continue using this as the clean input
        return {value:data,error:null}
    }



}
export default new UserService();
