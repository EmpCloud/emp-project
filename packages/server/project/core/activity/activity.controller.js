import activityService from './activity.service.js';
class ActivityController {
    async activityFetch(req, res, next) {
        /* #swagger.tags = ['Activity']
                   #swagger.description = 'This routes is used for filter the all activity details of user'  */
        /* #swagger.security = [{
          "AccessToken": []
        }] */

        /*	#swagger.parameters['ActivityType'] = {
                        in: 'query',
                        description: 'Activity type to fetch activity details',
                        enum : ['Project','Task','SubTask','User','Permission','Config','Plan','Admin','Roles','Group','TaskStatus','TaskType','TaskStage','TaskCategory','SubTaskType','SubTaskStatus']
        } */
        /*	#swagger.parameters['ActivityTypeId'] = {
                        in: 'query',
                        description: 'ActivityType Ids(projectId,userId,planId,configId,permissionId,taskId,subTaskId,adminId,roleId,groupId,taskTypeId,taskStatusId,taskStageId,taskCategoryId,subTaskTypeId,subTaskStatusId)',
        } */
        /*	#swagger.parameters['category'] = {
                        in: 'query',
                        description: 'Category to fetch activity details',
                        enum : ['Updated','Created','Created/Updated','Viewed', 'Deleted', 'Searched', 'Filtered', 'Login', 'Registered', 'Verified', 'UpdatedPassword', 'Reset Password', 'Selected', 'Restored']
        } */
        /*	#swagger.parameters['orderBy'] = {
                             in: 'query',
                             description: 'keyword to be ordered',
                             enum: ['createdAt','activity'],
        } */
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
    }*/
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
    }*/

        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
    }*/

return await activityService.activityFetch(req, res, next);

    }
    async activitySearch(req, res, next) {
        /* 	#swagger.tags = ['Activity']
                        #swagger.description = 'This routes is used for search the Projects by skip,limit and sort' */
        /* #swagger.security = [{
               "AccessToken": []
    }]*/
    /*	#swagger.parameters['ActivityType'] = {
                        in: 'query',
                        description: 'Activity type to fetch activity details',
                        enum : ['Project','Task','SubTask','User','Permission','Config','Plan','Admin','Roles','Group','TaskStatus','TaskType','TaskStage','TaskCategory','SubTaskType','SubTaskStatus']
        } */
        /*	#swagger.parameters['ActivityTypeId'] = {
                        in: 'query',
                        description: 'ActivityType Ids(projectId,userId,planId,configId,permissionId,taskId,subTaskId,adminId,roleId,groupId,taskTypeId,taskStatusId,taskStageId,taskCategoryId,subTaskTypeId,subTaskStatusId)',
        } */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
    }*/

        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
    }*/
        /*	#swagger.parameters['keyword'] = {
                            in: 'query',
                            description: 'Keyword to be searched',
    }*/
        /*	#swagger.parameters['orderBy'] = {
                        in: 'query',
                        description: 'keyword to be ordered',
                        enum: ["activityType","category", "userDetails.name", "userDetails.id", "userDetails.profilePic", "updatedAt", "createdAt"],
    }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
    }*/
        /*	#swagger.parameters['orderBy'] = {
                        in: 'query',
                        description: 'keyword to be ordered',
    }*/
    return await activityService.activitySearch(req,res,next)
}
    async activityFilter(req, res, next) {
        /* #swagger.tags = ['Activity']
                   #swagger.description = 'This routes is used for filter the all activity details of user'  */
        /* #swagger.security = [{
          "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'project filter  Details',
                        required: true,
                        schema: { $ref: "#/definitions/allActivityFilterDetails" }
    } */

        return await activityService.activityFilter(req, res, next);
    }
}
export default new ActivityController();
