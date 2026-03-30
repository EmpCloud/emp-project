import activitySchema from './activity.model.js';
import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import ActivityValidation from './activity.validate.js';
import { projectMessageNew, ActivityMessageNew } from '../language/language.translator.js';
import { creatorDetails, checkCollection } from '../../utils/project.utils.js';
import config from 'config';
import Reuse from '../../utils/reuse.js'

class ActivityService {
    async activityFetch(req, res, next) {
        const reuse = new Reuse(req);
        const result = req.verified;
        const { orgId, language, isAdmin, _id } = reuse.result.userData?.userData;
        if (result.state == true) {
            try {
                const skipValue = +req?.query?.skip || config.get('skip');
                const limitValue = +req.query.limit || config.get('limit');
                let { ActivityType: activityName, ActivityTypeId: typeId, category } = req?.query;
                const { error } = ActivityValidation.activityFetch(req?.query);
                if (error) return res.send(Response.validationFailResp(projectMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.message));
                const sortBy = {};
                sortBy[req?.query?.orderBy || 'createdAt'] = req?.query?.sort?.toString() === 'asc' ? 1 : -1;
                let condition = { orgId: orgId };
                if (activityName && typeId) {
                    if (activityName == 'Project') condition.projectId = typeId;
                    if (activityName == 'User') condition.userId = typeId;
                    if (activityName == 'Permission') condition.permissionId = typeId;
                    if (activityName == 'Config') condition.configId = typeId;
                    if (activityName == 'plan') condition.planId = typeId;
                    if (activityName == 'Task') condition.taskId = typeId;
                    if (activityName == 'subTask') condition.subTaskId = typeId;
                    if (activityName == 'Admin') condition.adminId = typeId;
                    if (activityName == 'Roles') condition.rolesId = typeId;
                    if (activityName == 'Group') condition.groupId = typeId;
                    if (activityName == 'subTaskStatus') condition.subTaskStatusId = typeId;
                    if (activityName == 'subTaskType') condition.subTaskTypeId = typeId;
                    if (activityName == 'TaskType') condition.TaskTypeId = typeId;
                    if (activityName == 'TaskStage') condition.TaskStageId = typeId;
                    if (activityName == 'TaskCategory') condition.TaskCategoryId = typeId;
                    if (activityName == 'TaskStatus') condition.TaskStatus = typeId;
                    (category) ? condition.category = category : null;
                } else if (activityName && !typeId) condition.activityType = activityName;
                if (activityName && !typeId && category) {
                    (category == 'Created/Updated') ? condition.$or = [{ category: 'Created' }, { category: 'Updated' }] : condition.category = category
                } else if (!activityName && !typeId && category) {
                    (category == 'Created/Updated') ? condition.$or = [{ category: 'Created' }, { category: 'Updated' }] : condition.category = category
                }
                const activityCount = await activitySchema.aggregate([{
                    $match: {
                        $and: [
                            condition,
                            { category: { $ne: 'Viewed' } }
                        ]
                    }
                }]);
                let activity;
                if (category != 'Viewed') {
                    if (isAdmin == true) {
                        activity = await activitySchema.aggregate([{
                            $match: {
                                $and: [
                                    condition,
                                    { category: { $ne: 'Viewed' } }
                                ]
                            }
                        }]).sort(sortBy).skip(skipValue).limit(limitValue);
                    } else {
                        condition['userDetails.id'] = _id
                        condition.orgId = orgId
                        activity = await activitySchema.aggregate([{
                            $match: {
                                $and: [
                                    condition,
                                    { category: { $ne: 'Viewed' } }
                                ]
                            }
                        }]).sort(sortBy).skip(skipValue).limit(limitValue);
                    }
                } else if (isAdmin == true) {
                    activity = await activitySchema.aggregate([{ $match: condition }]).sort(sortBy).skip(skipValue).limit(limitValue);

                } else {
                    condition['userDetails.id'] = _id
                    condition.orgId = orgId
                    activity = await activitySchema.aggregate([{ $match: condition }]).sort(sortBy).skip(skipValue).limit(limitValue);
                }
                activity.length > 0
                    ? res.send(Response.projectSuccessResp(ActivityMessageNew['ACTIVITY_FETCH_SUCCESS'][language ?? 'en'], { totalActivityCount: activityCount.length, activity }))
                    : res.send(Response.projectFailResp(ActivityMessageNew['ACTIVITY_FILTER_FAIL'][language ?? 'en']));
            } catch (err) {
                Logger.error(err);
                return res.send(Response.projectFailResp(ActivityMessageNew['ACTIVITY_FETCH_FAIL'][language ?? 'en'], err));
            }
        } else {
            res.send(result);
        }
    }

    async activitySearch(req, res, next) {
        const result = req.verified;
        const { orgId, language } = result?.userData?.userData;
        if (result.state == true) {
            try {
                const skipValue = +req?.query?.skip || config.get('skip');
                const limitValue = +req.query.limit || config.get('limit');
                const activityName = req?.query?.ActivityType;
                const typeId = req?.query?.ActivityTypeId;
                let condition = {};
                if (typeId && activityName) {
                    if (activityName == 'Project') condition.projectId = typeId;
                    if (activityName == 'User') condition.userId = typeId;
                    if (activityName == 'Permission') condition.permissionId = typeId;
                    if (activityName == 'Config') condition.configId = typeId;
                    if (activityName == 'plan') condition.planId = typeId;
                    if (activityName == 'Task') condition.taskId = typeId;
                    if (activityName == 'subTask') condition.subTaskId = typeId;
                    if (activityName == 'Admin') condition.adminId = typeId;
                    if (activityName == 'Roles') condition.rolesId = typeId;
                    if (activityName == 'Group') condition.groupId = typeId;
                    if (activityName == 'subTaskStatus') condition.subTaskStatusId = typeId;
                    if (activityName == 'subTaskType') condition.subTaskTypeId = typeId;
                    if (activityName == 'TaskType') condition.TaskTypeId = typeId;
                    if (activityName == 'TaskStage') condition.TaskStageId = typeId;
                    if (activityName == 'TaskCategory') condition.TaskCategoryId = typeId;
                    if (activityName == 'TaskStatus') condition.TaskStatus = typeId;
                }
                let sort = req?.query?.sort || 'asc';
                let orderby = req?.query?.orderBy || '_id';
                const sortBy = {};
                sortBy[orderby] = sort.toString() === 'asc' ? 1 : -1;
                let query = {};
                if (req?.query.keyword) {
                    let keyword = req?.query.keyword;
                    Logger.info(keyword);
                    query.$or = [
                        { activityType: new RegExp(keyword, 'i') },
                        { category: new RegExp(keyword, 'i') },
                        { 'userDetails.name': new RegExp(keyword, 'i') },
                        { 'userDetails.id': new RegExp(keyword, 'i') },
                        { 'userDetails.profilePic': new RegExp(keyword, 'i') },
                        { updatedAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                        { createdAt: { $gte: new Date(keyword), $lt: new Date(new Date(keyword).setHours(23, 59, 59, 999)) } },
                    ];
                }
                let fetchActivity,activityCount;
                if (activityName && typeId) {
                    fetchActivity = await activitySchema
                        .aggregate([{ $match: { $and: [query, { orgId: orgId }, { activityType: activityName }, condition] } }])
                        .sort(sortBy)
                        .skip(skipValue)
                        .limit(limitValue);
                        activityCount = await activitySchema.aggregate([{ $match: { $and: [query, { orgId: orgId }, { activityType: activityName },{ category: { $ne: 'Viewed' } }, condition] } }])

                } else if(activityName&&!typeId) {
                    fetchActivity = await activitySchema
                        .aggregate([{ $match: { $and: [query, { orgId: orgId }, { activityType: activityName }] } }])
                        .sort(sortBy)
                        .skip(skipValue)
                        .limit(limitValue);
                    activityCount = await activitySchema.aggregate([{ $match: { $and: [query, { orgId: orgId }, { activityType: activityName },{ category: { $ne: 'Viewed' } }] } }])
                } else {
                    fetchActivity = await activitySchema
                        .aggregate([{ $match: { $and: [query, { orgId: orgId }] } }])
                        .sort(sortBy)
                        .skip(skipValue)
                        .limit(limitValue);
                    activityCount = await activitySchema.aggregate([{ $match: { $and: [query, { orgId: orgId },{ category: { $ne: 'Viewed' } }] } }])
                }
                fetchActivity.length > 0 ? res.send(Response.projectSuccessResp(projectMessageNew['PROJECT_SEARCH'][language ?? 'en'], {count:activityCount?.length,fetchActivity})) : res.send(Response.projectFailResp(projectMessageNew['PROJECT_SEARCH_FAIL'][language ?? 'en']));
            } catch (err) {
                Logger.error(err);
                return res.send(Response.projectFailResp(projectMessageNew['PROJECT_SEARCH_FAIL'][language ?? 'en'], err));
            }
        } else {
            res.send(result);
        }
    }

    async activityFilter(req, res, next) {
        const result = req.verified;
        const { language } = result.userData?.userData;
        if (result.state == true) {
            try {
                const data = req?.body;
                let query = [];
                const { value, error } = ActivityValidation.activityFilterValidation(data);
                if (error) return res.send(Response.projectFailResp(projectMessageNew['VALIDATION_FAILED'][language ?? 'en'], error.message));
                if (JSON.stringify(value) == '{}') {
                    return res.send(Response.projectFailResp(projectMessageNew['FIELD_NOT_SELECTED'][language ?? 'en']));
                }
                let resp,
                    myFilters = {},
                    condition = {};
                if (req?.body?.firstName != null) condition['userDetails.name'] = new RegExp(req?.body.firstName, 'i');
                if (req?.body?.activityType != null) condition.activityType = new RegExp('^' + req?.body.activityType, 'i');
                if (req?.body?.projectId != null) condition.projectId = req?.body.projectId;
                if (req?.body?.taskId != null) condition.taskId = req?.body.taskId;
                if (req?.body?.subTaskId != null) condition.taskId = req?.body.subTaskId;
                if (req?.body?.planId != null) condition.planId = req?.body.planId;
                if (req?.body?.configId != null) condition.configId = req?.body.configId;
                if (req?.body?.permissionId != null) condition.permissionId = req?.body.permissionId;

                if (req?.body?.adminId != null) condition.adminId = req?.body.adminId;

                if (req?.body?.roleId != null) condition.roleId = req?.body.roleId;

                if (req?.body?.groupId != null) condition.groupId = req?.body.groupId;

                if (req?.body?.category != null) condition.category = new RegExp('^' + req?.body.category, 'i');

                if (req?.body?.subTaskStatusId != null) condition.subTaskStatusId = req?.body.subTaskStatusId;

                if (req?.body?.subTaskTypeId != null) condition.subTaskTypeId = req?.body.subTaskTypeId;

                if (req?.body?.taskTypeId != null) condition.taskTypeId = req?.body.taskTypeId;

                if (req?.body?.taskStatusId != null) condition.taskStatusId = req?.body.taskStatusId;

                if (req?.body?.taskStageId != null) condition.taskStageId = req?.body.taskStageId;

                if (req?.body?.taskCategoryId != null) condition.taskCategoryId = req?.body.taskCategoryId;

                if (req?.body?.activityUserId != null) condition['userDetails.id'] = req?.body.activityUserId;
                query.push(condition)

                if (this.req?.body?.date.startDate !== undefined || this.req?.body?.date.endDate !== undefined) {
                    Logger.info(req?.body.date);
                    query.push({
                        createdAt: {
                            $gte: new Date(req?.body.date.startDate),
                            $lt: new Date(new Date(req?.body.date.endDate).setHours(23, 59, 59, 999)),
                        },
                    });
                }
                if (query.length)
                    myFilters['$and'] = query;
                resp = await activitySchema.aggregate([
                    {
                        $match: myFilters,
                    },
                ]);

                res.send(Response.projectSuccessResp(ActivityMessageNew['ACTIVITY_FILTER_SUCCESS'][language ?? 'en'], resp));
            } catch (err) {
                Logger.error(`error ${err}`);

                return res.send(Response.activityFailResp(ActivityMessageNew['ACTIVITY_FILTER_FAIL'][language ?? 'en'], err));
            }
        } else {
            res.send(result);
        }
    }
}

export default new ActivityService();
