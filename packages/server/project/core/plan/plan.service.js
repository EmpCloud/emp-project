import Response from '../../response/response.js';
import PlanValidation from './plan.validation.js';
import Logger from '../../resources/logs/logger.log.js';
import planModel from './plan.model.js';
import { planMessageNew } from '../language/language.translator.js';
import adminSchema from '../admin/admin.model.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import config from 'config';
import { constantPlans } from './plan.constants.js';
import moment from 'moment';
import { activityOfUser, storePlanHistory } from '../../utils/activity.utils.js';
import event from '../event/eventEmitter.js';
import NotificationService from '../notifications/notifications.service.js';
import planHistoryModel from './planHistory.model.js';
import Reuse from '../../utils/reuse.js';
import { checkCollection } from '../../utils/user.utils.js';
import roleModel from '../roles/roles.model.js';
import { checkData } from '../../utils/project.utils.js';
import permissionModel from '../permissions/permission.model.js';
import groupSchema from '../groups/group.schema.js';
import { ObjectId } from 'mongodb';
import { projectMessageNew, CommentMessageNew } from '../language/language.translator.js';
import projectComment from '../../core/project/projectComment.schema.js';
import subTaskComment from '../config/defaults/subtaskComment.schema.js';
import taskComment from '../config/defaults/taskComment.schema.js';
import { UserMessageNew } from '../language/language.translator.js';
import taskCommentSchema from '../config/defaults/taskComment.schema.js';
import subtaskCommentSchema from '../config/defaults/subtaskComment.schema.js';
import projectCommentSchema from '../../core/project/projectComment.schema.js';

class PlanService {
    // need to work now it is pending
    async createPlan(req, res) {
        const result = req.verified;
        const { language, _id: Id } = result.userData?.userData?.language;
        try {
            const data = req.body;
            const { value, error } = PlanValidation.createPlan(data?.projectPlan);
            if (error) {
                res.send(Response.projectFailResp(planMessageNew['VALIDATION_FAIL'][language ?? 'en'], error));
            }
            const dataArray = value?.map(element => {
                return element;
            });
            for (let key of dataArray) {
                const planExist = await planModel.find({ planName: key?.planName });
                if (!planExist.length) {
                    key.adminId = Id;
                    const planData = await planModel.create(key);
                    planData
                        ? res.send(Response.projectSuccessResp(planMessageNew['PLAN_SUCCESS'][language ?? 'en'], planData))
                        : res.send(Response.projectFailResp(planMessageNew['PLAN_FAIL'][language ?? 'en'], error));
                } else {
                    res.send(Response.projectFailResp(planMessageNew['PLAN_EXIST'][language ?? 'en']));
                }
            }
        } catch (err) {
            Logger.error(err.message);
            res.send(Response.projectFailResp(planMessageNew['PLAN_ERROR'][language ?? 'en'], err));
        }
    }

    async getAllPlans(req, res) {
        const result = req.verified;
        const { firstName: Name, adminId: Id, _id: userId, orgId: organizationId, profilePic: userProfilePic, language: language } = result?.userData?.userData;
        try {
            const planId = req.query._id;
            let allPlans = planId ? await planModel.findOne({ _id: planId }) : await planModel.find({});
            let planActivity = activityOfUser(`${Name} viewed plans.`, 'Plan', Name, 'Viewed', organizationId, userId, userProfilePic);
            planActivity['planId'] = planId ?? 'All';
            event.emit('activity', planActivity);
            allPlans.length || allPlans
                ? res.send(Response.projectSuccessResp(planMessageNew['PLAN_FETCH_SUCCESS'][language ?? 'en'], allPlans))
                : res.send(Response.projectFailResp(planMessageNew['PLAN_FETCH_FAIL'][language ?? 'en']));
        } catch (err) {
            Logger.error(err);
            res.send(Response.projectFailResp(planMessageNew['PLAN_FETCH_ERROR'][language ?? 'en'], err));
        }
    }

    async getHistory(req, res) {
        const reuse = new Reuse(req);
        const { adminId: Id, _id: userId, orgId: organizationId, language: language } = reuse.result.userData?.userData;
        try {
            const sortBy = {};
            const sortValue = reuse.sort.toString() === 'desc' ? -1 : 1;
            if (reuse.orderby == 'duration') {
                sortBy['durationType'] = sortValue;
                sortBy['durationValue'] = sortValue;
            }
            else sortBy[reuse.orderby || 'createdAt'] = sortValue;

            const skip = reuse.skip;
            const limit = reuse.limit;
            let Plans = await planHistoryModel.find({ orgId: organizationId })
                .populate({ path: 'purchasedBy', select: 'firstName lastName profilePic' })
                .sort(sortBy).skip(skip).limit(limit);
            if (Plans.length === 0) return res.send(Response.projectSuccessResp(planMessageNew['PLAN_FETCH_SUCCESS'][language ?? 'en'], Plans))
            return res.send(Response.projectSuccessResp(planMessageNew['PLAN_FETCH_SUCCESS'][language ?? 'en'], Plans))

        } catch (err) {
            Logger.error(err);
            res.send(Response.projectFailResp(planMessageNew['PLAN_FETCH_ERROR'][language ?? 'en'], err));
        }
    }

    async assignPlan(req, res, next) {
        const reuse = new Reuse(req);

        const { _id: adminId, language: language, firstName: Name, lastName, orgId: organizationId, profilePic: userProfilePic } = reuse?.result?.userData?.userData;
        try {
            const planName = req.query.plan;
            const planFeature = req.body;
            const { value, error } = PlanValidation.assignPlanValidate({ planName });
            if (error) {
                res.send(Response.projectFailResp('Validation Failed.', error));
            }
            const planData = value.planName;
            let regex = new RegExp('^' + planData.toLowerCase(), 'i');
            let existPlan = constantPlans.filter(e => regex.test(e));
            let existName = existPlan[0];
            if (!existPlan.length) {
                return res.status(400).send(Response.languageFailResp('Please select valid Plan.'));
            }
            let result = await planHistoryModel.find({ orgId: organizationId });
            let details = await planModel.findOne({ planName: planName });

            let isPlanExist = await adminSchema.findOne({ _id: adminId });
            if (result.length > 0) {
                let alreadySelected = [];
                result.map(selectedPlan => {
                    constantPlans.map(all => {
                        if (selectedPlan.planName == all) {
                            let planIndex = constantPlans.indexOf(selectedPlan.planName)
                            alreadySelected.push(planIndex)
                        }
                    })
                })
                let count = [];
                let selectingValue = constantPlans.indexOf(planName)
                alreadySelected.map(selected => {
                    if (selectingValue < selected) {
                        count.push(selectingValue);

                    }
                })
                if (count.length > 0) {
                    res.status(400).send(Response.projectFailResp(`You can't down grade the plan`));

                }
            }
            if (isPlanExist.planName == existName && isPlanExist.planExpireDate > new Date()) {
                res.status(400).send(Response.projectFailResp(`You already activated ${planName} plan.`));
            } else {
                let { planName, createdAt, updatedAt, ...planData } = details.toJSON();
                let resultData
                if (Object.keys(planFeature).length === 0) {
                    let expireDate = new Date(moment().add(details.durationValue, details.durationType));
                    resultData = await adminSchema.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(adminId) },
                        { $set: { planName: existName, planStartDate: new Date(), planExpireDate: expireDate, planData: planData } },
                        { returnDocument: 'after' }
                    );
                    let planHistory = storePlanHistory(organizationId, details, adminId, expireDate)
                    event.emit('history', planHistory);
                } else {
                    let { _id, projectFeatureCount, taskFeatureCount, subTaskFeatureCount, userFeatureCount, currencyType, currencyLogo, durationType, durationValue, __v, createdAt, updatedAt, ...filterPlan } = details.toJSON()
                    filterPlan.projectFeatureCount = Number(planFeature.projectFeatureCount ?? details.projectFeatureCount);
                    filterPlan.taskFeatureCount = Number(planFeature.taskFeatureCount ?? details.taskFeatureCount);
                    filterPlan.subTaskFeatureCount = Number(planFeature.subTaskFeatureCount ?? details.subTaskFeatureCount);
                    filterPlan.userFeatureCount = Number(planFeature.userFeatureCount ?? details.userFeatureCount);
                    filterPlan.durationType = planFeature.durationType ?? details.durationType;
                    filterPlan.durationValue = planFeature.durationValue ?? details.durationValue;
                    let expireDate = new Date(moment().add(planFeature.durationValue, planFeature.durationType));
                    resultData = await adminSchema.findOneAndUpdate(
                        { _id: mongoose.Types.ObjectId(adminId) },
                        { $set: { planName: existName, planStartDate: new Date(), planExpireDate: expireDate, planData: filterPlan } },
                        { returnDocument: 'after' }
                    );
                    let planHistory = storePlanHistory(organizationId, filterPlan, adminId, expireDate)
                    event.emit('history', planHistory);
                }
                let { dashboardConfigData, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, emailValidateToken, emailTokenExpire, verificationEmailSentCount, ...filteredData } = resultData.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                let planActivity = activityOfUser(
                    `${Name} updated the ${details.planName} plan for ${details.durationValue} ${details.durationType}S `,
                    'Plan',
                    Name,
                    'Selected',
                    organizationId,
                    adminId,
                    userProfilePic
                );
                planActivity['planId'] = details.id;
                event.emit('activity', planActivity);

                // Admin Notification
                if (isPlanExist.isConfigSet === true) {
                    const message = `${Name + lastName} Updated ${details.planName} plan for ${details.durationValue} ${details.durationType}S`;
                    await NotificationService.adminNotification(message, adminId, adminId, { collection: 'plans', id: details._id.toString() });
                }
                res.status(200).send(Response.projectSuccessResp(planMessageNew['PLAN_ADD_SUCCESS'][language ?? 'en'], { filteredData, accessToken }));
            }
        } catch (err) {
            Logger.error(err);
            res.status(400).send(Response.projectFailResp(planMessageNew['PLAN_ADD_ERROR'][language ?? 'en'], err));
        }
    }
    async planUsage(req, res) {
        const reuse = new Reuse(req);
        let { planData, orgId } = reuse.result?.userData?.userData;
        try {
            const usageDDetailes = {
                projects: planData.projectFeatureCount,
                tasks: planData.taskFeatureCount,
                timeLineUsage: planData.TimelineManagement,
                users: planData.userFeatureCount,
                groups: planData.groupFeatureCount,
                subTasks: planData.subTaskFeatureCount,
                roles: planData.customizeRoles,
                permissions: planData.customizePermission,
                taskTypes: planData.customizeSubTaskType,
                taskStage: planData.customizeTaskStage,
                taskStatus: planData.customizeTaskStatus,
                categories: planData.categoriesCount
            }
            let remainingDeatiles = {};
            const db = await checkCollection(reuse.collectionName.project);
            const projectCount = await db.collection(reuse.collectionName.project).countDocuments();
            remainingDeatiles.usedProjects = projectCount;
            const taskCount = await db.collection(reuse.collectionName.task).countDocuments();
            remainingDeatiles.usedTasks = taskCount;
            const subTaskCount = await db.collection(reuse.collectionName.subTask).countDocuments();
            remainingDeatiles.usedSubTasks = subTaskCount;
            const rolesCount = await roleModel.find({ orgId: orgId, is_default: false });
            remainingDeatiles.usedRoles = rolesCount.length;
            const permissionCount = await permissionModel.find({ orgId: orgId, is_default: false });
            remainingDeatiles.usedPermissions = permissionCount.length;
            const groupCount = await groupSchema.find({ orgId: orgId })
            remainingDeatiles.usedGroups = groupCount
            let taskCategory = `taskcategories`;
            let totalGategory = await db.collection(taskCategory).find({ orgId: checkData.orgId, isDefault: false }).project({ taskCategory: 1 }).toArray()
            remainingDeatiles.usedGategories = totalGategory.length;
            let taskType = `tasktypes`;
            let totalTaskType = await db.collection(taskType).find({ orgId: checkData.orgId, isDefault: false }).project({ taskType: 1 }).toArray()
            remainingDeatiles.usedTaskType = totalTaskType.length;
            let taskstatus = `taskstatuses`;
            let totalTaskStatus = await db.collection(taskstatus).find({ orgId: checkData.orgId, isDefault: false }).project({ taskStatus: 1 }).toArray()
            remainingDeatiles.requireDeleteTaskstatus = totalTaskStatus.length;
            let taskStage = `taskstages`;
            let totalTaskStage = await db.collection(taskStage).find({ orgId: checkData.orgId, isDefault: false }).project({ taskStage: 1 }).toArray()
            remainingDeatiles.reaminingTaskStage = totalTaskStage.length;

            return res.send(Response.projectSuccessResp("SuccessFully fetched data usege deatiles", { usageDDetailes, remainingDeatiles }));
        } catch (err) {
            Logger.error(`${err}`)
            return res.status(400).send(Response.projectFailResp("Error", err));
        }
    }
    async downGradePlan(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId,userName,planExpireDate,email, profilePic: userProfilePic, language: language, orgId,planData} = reuse.result.userData?.userData;
        try {
            let data = {};
            const db = await checkCollection(reuse.collectionName.project);
            // let planData = await planModel.findOne({ planName: planName });
            // const planData2 = await planHistoryModel.findOne({ orgId: orgId }).sort({ createdAt: -1 });
            if(!planData)res.status(400).send(Response.projectFailResp("Plan History not Available", "Plan History not Available"));

            const totalProjects = await db.collection(reuse.collectionName.project).find({}).project({ projectName: 1 }).toArray();
            let requireDeleteProject = totalProjects.length - planData.projectFeatureCount;
            let actualProject = planData.projectFeatureCount
            let existingProject = totalProjects.length
            let projectMessage = requireDeleteProject>0?`To comply with your current plan, please remove ${requireDeleteProject} Project's.`:'You are within the limit of the current plan.'
            data.project=[{
                actualProject,
                existingProject,
                projectMessage
            }]
            const totalTasks = await db.collection(reuse.collectionName.task).find({}).project({ taskTitle: 1 }).toArray();
            let requireDeleteTask = totalTasks.length - planData.taskFeatureCount;
            let  actualTask = planData.taskFeatureCount;
            let  existingTask = totalTasks.length;
            let  taskMessage = requireDeleteTask>0?`To comply with your current plan, please remove ${requireDeleteTask} Task's.`:'You are within the limit of the current plan.'
            data.Task=[{
                actualTask,
                existingTask,
                taskMessage
            }]
            const totalSubTasks = await db.collection(reuse.collectionName.subTask).find({}).project({ subTaskTitle: 1 }).toArray();
            let requireDeleteSubTask = totalSubTasks.length - planData.subTaskFeatureCount;
            let actualSubTask = planData.subTaskFeatureCount;
            let existingSubTask = totalSubTasks.length;
            let subTaskMessage = requireDeleteSubTask>0?`To comply with your current plan, please remove ${requireDeleteSubTask} SubTask's.`:'You are within the limit of the current plan.'
            data.SubTask=[{
                actualSubTask,
                existingSubTask,
                subTaskMessage
            }]
            let totalUsers = await db.collection(reuse.collectionName.user).find({ invitation: 1 }).project({ firstName: 1, lastName: 1 }).toArray();
            let requireDeleteUser = totalUsers.length - planData.userFeatureCount;
            let actualUsers = planData.userFeatureCount;
            let existingUsers = totalUsers.length;
            let usersMessage = requireDeleteUser>0?`To comply with your current plan, please remove ${requireDeleteUser} User's.`:'You are within the limit of the current plan.'
            data.Users=[{
                actualUsers,
                existingUsers,
                usersMessage
            }]
            let totalRoles = await roleModel.find({ orgId: checkData.orgId, is_default: false }).select("roles");
            let requireDeleteRoles = totalRoles.length - planData.customizeRoles;
            let actualRoles = planData.customizeRoles;
            let existingRoles = totalRoles.length;
            let rolesMessage = requireDeleteRoles>0?`To comply with your current plan, please remove ${requireDeleteRoles} Role's.`:'You are within the limit of the current plan.'
            data.Roles = [{
                actualRoles,
                existingRoles,
                rolesMessage
            }]
            let totalPermissions = await permissionModel.find({ orgId: checkData.orgId, is_default: false }).select('permissionName')
            let requireDeletePermissions = totalPermissions.length - planData.customizePermission;
            let actualPermissions = planData.customizePermission;
            let existingPermissions = totalPermissions.length;
            let permissionMessage = requireDeletePermissions>0?`To comply with your current plan, please remove ${requireDeletePermissions} Permission's.`:'You are within the limit of the current plan.'
            data.Permissions=[{
                actualPermissions,
                existingPermissions,
                permissionMessage
            }]
            let totalGroups = await groupSchema.find({ orgId: checkData.orgId }).select('groupName')
            let requireDeleteGroups = totalGroups.length - planData.groupFeatureCount;
            let actualGroups = planData.groupFeatureCount;
            let existingGroups = totalGroups.length;
            let groupsMessage = requireDeleteGroups>0?`To comply with your current plan, please remove ${requireDeleteGroups} Group's.`:'You are within the limit of the current plan.'
            data.Groups=[{
                actualGroups,
                existingGroups,
                groupsMessage
            }]
            let taskCategory = `taskcategories`;
            let totalGategory = await db.collection(taskCategory).find({ adminId:userId, isDefault: false }).project({ taskCategory: 1 }).toArray()
            let requireDeletecategories = totalGategory.length - planData.categoriesCount;
            let actualCategories = planData.categoriesCount;
            let existingCategories = totalGategory.length;
            let catagoriesMessage = requireDeletecategories>0?`To comply with your current plan, please remove ${requireDeletecategories} Category's.`:'You are within the limit of the current plan.'
            data.Categories=[{
                actualCategories,
                existingCategories,
                catagoriesMessage
            }]
            let taskType = `tasktypes`;
            let totalTaskType = await db.collection(taskType).find({ adminId:userId, isDefault: false }).project({ taskType: 1 }).toArray()
            let requireDeleteTaskType = totalTaskType.length - planData.customizeTaskType;
            let actualTaskType = planData.customizeTaskType;
            let existingTaskType = totalTaskType.length;
            let taskTypeMessage = requireDeleteTaskType>0?`To comply with your current plan, please remove ${requireDeleteTaskType} TaskType's.`:'You are within the limit of the current plan.'
            data.TaskType=[{
                actualTaskType,
                existingTaskType,
                taskTypeMessage
            }]
            let taskstatus = `taskstatuses`;
            let totalTaskStatus = await db.collection(taskstatus).find({ adminId:userId, isDefault: false }).project({ taskStatus: 1 }).toArray()
            let requireDeleteTaskstatus = totalTaskStatus.length - planData.customizeTaskStatus;
            let actualTaskStatus = planData.customizeTaskStatus;
            let existingTaskStatus = totalTaskStatus.length;
            let taskStatusMessage = requireDeleteTaskstatus> 0?`To comply with your current plan, please remove ${requireDeleteTaskstatus} TaskStatus's.`:'You are within the limit of the current plan.'
            data.TaskStatus = [{
                actualTaskStatus,
                existingTaskStatus,
                taskStatusMessage
            }]
            let taskStage = `taskstages`;
            let totalTaskStage = await db.collection(taskStage).find({ adminId:userId, isDefault: false }).project({ taskStage: 1 }).toArray()
            let requireDeleteTaskStage = totalTaskStage.length - planData.customizeTaskStage;
            let actualTaskStages = planData.customizeTaskStage;
            let existingTaskStages = totalTaskStage.length;
            let taskStagesMessage = requireDeleteTaskStage>0?`To comply with your current plan, please remove ${requireDeleteTaskStage} TaskStage's.`:'You are within the limit of the current plan.'
            data.TaskStages=[{
                actualTaskStages,
                existingTaskStages,
                taskStagesMessage
            }]

            const deleteVariables = [
                requireDeleteProject,
                requireDeleteTask,
                requireDeleteSubTask,
                requireDeleteUser,
                requireDeleteRoles,
                requireDeletePermissions,
                requireDeleteGroups,
                requireDeletecategories,
                requireDeleteTaskType,
                requireDeleteTaskstatus,
                requireDeleteTaskStage
            ];
            let stable = deleteVariables.some(variable => variable > 0);
            if(stable===false){
                let planHistory = storePlanHistory(orgId, planData, userId, planExpireDate)
                event.emit('history', planHistory);  
                const newData = await adminSchema.findOneAndUpdate({ 
                    $or: [
                      { email: email },
                      { userName: userName }
                    ]
                  }, { $set: { lastLogin: Date.now() , planDowngrade:false } }, { returnDocument: 'after' });
            }else {
                const newData = await adminSchema.findOneAndUpdate({ 
                    $or: [
                        { email: email },
                        { userName: userName }
                    ]
                  }, { $set: { lastLogin: Date.now() , planDowngrade:true } }, { returnDocument: 'after' });
            }
            if (data) {
                return res.send(Response.projectSuccessResp("Please select data to Delete for plan downgrade", data));
            }
        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp("Failed to downgrade plan", err));
        }
    }
    async deleteData(req, res) {
        const result = req.verified;
        const reuse = new Reuse(req);
        let { orgId, planName } = result.userData?.userData;
        try {
            const data = req.body;
            let Ids = [];
            data?.selectProjectToDelete?.map(async (project) => {
                Ids.push(project._id);
                return Ids;
            })
            const db = await checkCollection(reuse.collectionName.project)
            if (Ids.length > 0) {
                await db.collection(reuse.collectionName.project).deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectTasksToDelete?.map(async (task) => {
                Ids.push(task._id);
                return Ids;
            })
            if (Ids.length > 0) {
                await db.collection(reuse.collectionName.task).deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectUsersToDelete?.map(async (user) => {
                Ids.push(user._id);
                return Ids;
            })
            if (Ids.length > 0) {
                await db.collection(reuse.collectionName.user).deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectSubTasksToDelete?.map(async (subTask) => {
                Ids.push(subTask._id);
                return Ids;
            })
            if (Ids.length > 0) {
                await db.collection(reuse.collectionName.subTask).deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectRolesToDelete?.map(async (role) => {
                Ids.push(role._id);
                return Ids;
            })
            if (Ids.length > 0) {
                await roleModel.deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectPermissionsToDelete?.map(async (permission) => {
                Ids.push(permission._id);
                return Ids;
            })
            if (Ids.length > 0) {
                await permissionModel.deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectGroupsToDelete?.map(async (group) => {
                Ids.push(group._id);
                return Ids;
            })
            if (Ids.length > 0) {
                await groupSchema.deleteMany({ _id: { $in: Ids } })
                Ids.slice(0, Ids.length)
            }
            data?.selectTaskStatusToDelete?.map(async (taskstatus) => {
                Ids.push(taskstatus._id);
                return Ids;
            })
            if (Ids.length > 0) {
                let taskstatus = `taskstatuses`;
                await db.collection(taskstatus).deleteMany({ _id: { $in: Ids } });
                Ids.slice(0, Ids.length)
            }
            data?.selectTaskCategoryToDelete?.map(async (category) => {
                Ids.push(category._id);
                return Ids;
            })
            if (Ids.length > 0) {
                let taskCategory = `taskcategories`;
                await db.collection(taskCategory).deleteMany({ _id: { $in: Ids } });
                Ids.slice(0, Ids.length)
            }
            data?.selectTaskTypesToDelete?.map(async (type) => {
                Ids.push(type._id);
                return Ids;
            })
            if (Ids.length > 0) {
                let taskType = `tasktypes`;
                await db.collection(taskType).deleteMany({ _id: { $in: Ids } });
                Ids.slice(0, Ids.length)
            }
            data?.selectTaskStagesToDelete?.map(async (stage) => {
                Ids.push(stage._id);
                return Ids;
            })
            if (Ids.length > 0) {
                let taskStage = `taskstages`;
                await db.collection(taskStage).deleteMany({ _id: { $in: Ids } });
                Ids.slice(0, Ids.length)
            }
            //Calculate data from plan info and existing data
            return res.send(Response.projectSuccessResp("Data deleted successfully you can now downGrade paln."))
        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp("Failed to delete data", err));
        }
    }
    async updatePlanExpired(req, res) {
        const result = req.verified;
        let { orgId } = result?.userData?.userData;
        try {

            const adminExist = await adminSchema.findOneAndUpdate({ orgId: orgId }, { $set: { planExpireDate: new Date() } }, { returnDocument: 'after' });
            let { dashboardConfigData, dashboardConfigCreatedAt, dashboardConfigUpdatedAt, emailValidateToken, emailTokenExpire, verificationEmailSentCount, ...filteredData } = adminExist.toJSON();
            let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
            if (adminExist) {
                return res.send(Response.projectSuccessResp("Successfully updated plan expired date", { filteredData, accessToken }))
            }

        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp("Failed to update plan expired data", err));
        }

    }

    //need to work it is pending
    async updatePlan(req, res) {
        const result = req.verified;
        const { language, _id: Id } = result?.userData?.userData?.language;
        try {
            const text = req.body;
            const { value, error } = PlanValidation.updatePlan(text);
            Logger.error(error);
            if (error) return res.status(400).send(Response.validationFailResp(planMessageNew['VALIDATION_FAIL'][language ?? 'en'], error));
            value.updatedAt = new Date();

            Logger.info(`success ${data}`);
            data
                ? res.send(Response.projectSuccessResp(planMessageNew['PLAN_UPDATE_SUCCESS'][language ?? 'en'], data))
                : res.status(400).send(Response.projectFailResp(planMessageNew['PLAN_UPDATE_FAIL'][language ?? 'en']));
        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp(planMessageNew['PLAN_UPDATE_ERROR'][language ?? 'en'], err.message));
        }
    }
    //need to work now it is for pending
    async deletePlan(req, res) {
        const result = req.verified;
        const language = result?.userData?.userData?.language;
        try {
            const planId = req.query.planId;
            const data = await planModel.deleteOne({ _id: planId });
            data.deletedCount
                ? res.status(200).send(Response.projectSuccessResp(planMessageNew['PLAN_DELETE_SUCCESS'][language ?? 'en'], data))
                : res.status(400).send(Response.projectFailResp(planMessageNew['PLAN_DELETE_FAIL'][language ?? 'en']));
        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp(planMessageNew['PLAN_DELETE_ERROR'][language ?? 'en'], err.message));
        }
    }

    async infoProjects(req,res) {
        const result = req.verified;
        const reuse = new Reuse(req);
        let { orgId, planName } = result.userData?.userData;
        try {
            const checkPlan = await adminSchema.findOne({ orgId: orgId })
            let data = {};
            let planData
            const db = await checkCollection(reuse.collectionName.project);
            const planData2 = await planHistoryModel.findOne({ orgId: orgId }).sort({ createdAt: -1 });
            planData=planData2.planData

            const skip = parseInt(reuse.skip, 10);
            const limit = parseInt(reuse.limit, 10);

            const totalProjects = await db
            .collection(reuse.collectionName.project)
            .aggregate([
                { $project: { projectName: 1, createdAt: 1 } },
                { $skip: skip },
                { $limit: limit }
            ])
            .toArray();        
        
            if(!totalProjects.length)return res.status(400).send(Response.projectFailResp("No Projects Available", "No Projects Available"));
            const totalProjectCount = await db.collection(reuse.collectionName.project).countDocuments();

            let requireDeleteProject = totalProjectCount - planData.projectFeatureCount;

            data.deleteProject = requireDeleteProject;
            data.selectProjectToDelete = totalProjects;

            data.pagination = {
                total: totalProjects.length,
                overAllTotalCount: totalProjectCount
            };
            if (data) {
                return res.send(Response.projectSuccessResp("Delete extra Projects to sustain current Plan", data));
            }


        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp("Something went wrong!", err));
        }
    }

    async deleteProjects(req, res) {
        const reuse = new Reuse(req);
        const { firstName: userName, lastName: lastName, adminId: Id, _id: userId, profilePic: userProfilePic, orgId: organizationId, language: language, creatorId, permission } = reuse.result.userData?.userData;
        try {
            const projectIds = req.body.projectIds;
            let fullName = userName + " " + lastName
            const db = await checkCollection(reuse.collectionName.project);
            if (!db) return res.send(Response.projectFailResp(`Project ${projectMessageNew['FEATURE_NOT_ENABLED'][language ?? 'en']}`));
            let response, getProject;
            if (Array.isArray(projectIds) && projectIds.length > 0) {
                for (let projectId of projectIds) {
                    let getProject = await db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(projectId) });
            
                    if (reuse.result.type === 'user' && permission !== 'admin') {
                        response = await db.collection(reuse.collectionName.project).deleteOne({ _id: ObjectId(projectId), 'projectCreatedBy.Id': userId });
                        if (response.deletedCount == 0) {
                            return res.send(Response.projectFailResp(`You can't delete projects which are created by someone else`));
                        }
                    } else {
                        response = await db.collection(reuse.collectionName.project).deleteOne({ _id: ObjectId(projectId) });
                    }
            
                    if (response.deletedCount) {
                        await projectComment.deleteMany({ project_id: projectId });
                        await taskComment.deleteMany({ project_id: projectId });
                        await db.collection(reuse.collectionName.task).deleteMany({ projectId: projectId });
                        await db.collection(reuse.collectionName.subTask).deleteMany({ projectId: projectId });
                        await subTaskComment.deleteMany({ project_id: projectId });
            
                        let activityDetails = activityOfUser(
                            `${userName + ' ' + lastName} deleted the project ${getProject.projectName}`,
                            'Project',
                            userName,
                            'Deleted',
                            organizationId,
                            userId,
                            userProfilePic
                        );
                        activityDetails['projectId'] = projectId;
                        event.emit('activity', activityDetails);
                    }
                }
            
                res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_DELETE_SUCCESS'][language ?? 'en']));
            } 
        } catch (err) {
            Logger.error(`error ${err}`);
            return res.send(Response.projectFailResp(projectMessageNew['PROJECT_DELETE_FAIL'][language ?? 'en'], err.message));
        }
    }

    async infoUser(req,res) {
        const result = req.verified;
        const reuse = new Reuse(req);
        let { orgId, planName } = result.userData?.userData;
        try {
            const checkPlan = await adminSchema.findOne({ orgId: orgId })
            let data = {};
            let planData
            const db = await checkCollection(reuse.collectionName.user);
            const planData2 = await planHistoryModel.findOne({ orgId: orgId }).sort({ createdAt: -1 });
            planData=planData2.planData

            const skip = parseInt(reuse.skip, 10);
            const limit = parseInt(reuse.limit, 10);
            const totalUsers = await db.collection(reuse.collectionName.user).aggregate([
                { $match: { invitation: 1 } }, 
                { $project: { firstName: 1, lastName: 1 } },
                { $skip: skip }, 
                { $limit: limit }  
            ]).toArray()
            console.log(totalUsers);
            if(!totalUsers.length)return res.status(400).send(Response.projectFailResp("No Users Available", "No Users Available"));
            const totalUserCount = await db.collection(reuse.collectionName.user).countDocuments();

            let requireDeleteUser = totalUserCount - planData.userFeatureCount;

            data.deleteUsers = requireDeleteUser;
            data.selectUsersToDelete = totalUsers;

            data.pagination = {
                total: totalUsers.length,
                overAllTotalCount: totalUserCount
            };
            if (data) {
                return res.send(Response.projectSuccessResp("Delete extra Projects to sustain current Plan", data));
            }


        } catch (err) {
            Logger.error(err);
            return res.status(400).send(Response.projectFailResp("Something went wrong!", err));
        }
    }
}

export default new PlanService();
