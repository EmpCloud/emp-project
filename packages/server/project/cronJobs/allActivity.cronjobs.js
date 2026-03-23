import failedDataModel from '../core/users/failedData.model.js'
import activitySchema from '../core/activity/activity.model.js';
import Logger from '../resources/logs/logger.log.js';
import  underscore  from 'underscore';
import {dataDeleteActivity} from '../utils/activity.utils.js'

class ActivityService {
    async planActivityRemove() {
        try {
            const adminData = await activitySchema.find({ activityType: 'Plan' });
            dataDeleteActivity(adminData, 25 * 24 * 60 * 60 * 1000);
        } catch (error) {
            Logger.error(error.message);
        }
    }
    async projectActivityRemove() {
        try {
            const adminData = await activitySchema.find({ activityType: 'Project' });
            dataDeleteActivity(adminData, 33 * 24 * 60 * 60 * 1000);
        } catch (error) {
            Logger.error(error.message);
        }
    }
    async permissionActivityRemove() {
        try {
            const adminData = await activitySchema.find({ activityType: 'Permission' });
            dataDeleteActivity(adminData, 25 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }

    async configActivityRemove() {
        try {
            const adminData = await activitySchema.find({ activityType: 'Config',category:'Viewed' });
            dataDeleteActivity(adminData, 45 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }

    async userActivityRemove() {
        try {
            const adminData = await activitySchema.find({ activityType: 'User' });
            dataDeleteActivity(adminData, 45 * 24 * 60 * 60 * 1000);
        } catch (error) {
            Logger.error(error.message);
        }
    }

    async taskActivityRemove() {
        try {

            const adminData = await activitySchema.find({ activityType: 'task' });
            dataDeleteActivity(adminData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async subTaskActivityRemove() {
        try {

            const adminData = await activitySchema.find({ activityType: 'subTask' });
            dataDeleteActivity(adminData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async userGroupActivityRemove() {
        try {

            const adminData = await activitySchema.find({ activityType: 'Group' });
            dataDeleteActivity(adminData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async adminActivityRemove() {
        try {

            const adminData = await activitySchema.find({ activityType: 'Admin' });
            dataDeleteActivity(adminData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async rolesActivityRemove() {
        try {

            const roleData = await activitySchema.find({ activityType: 'Roles' });
            dataDeleteActivity(roleData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async subTaskStatusActivityRemove() {
        try {

            const subTaskStatusData = await activitySchema.find({ activityType: 'subTaskStatus' });
            dataDeleteActivity(subTaskStatusData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async subTaskTypeActivityRemove() {
        try {

            const subTaskTypeData = await activitySchema.find({ activityType: 'subTaskType' });
            dataDeleteActivity(subTaskTypeData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async TaskCategoryActivityRemove() {
        try {

            const TaskCategoryData = await activitySchema.find({ activityType: 'TaskCategory' });
            dataDeleteActivity(TaskCategoryData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async TaskStageActivityRemove() {
        try {

            const TaskStageData = await activitySchema.find({ activityType: 'TaskStage' });
            dataDeleteActivity(TaskStageData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async TaskStatusActivityRemove() {
        try {

            const TaskStatusData = await activitySchema.find({ activityType: 'TaskStatus' });
            dataDeleteActivity(TaskStatusData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }
    async TaskTypeActivityRemove() {
        try {

            const TaskTypeData = await activitySchema.find({ activityType: 'TaskType' });
            dataDeleteActivity(TaskTypeData, 28 * 24 * 60 * 60 * 1000);

        } catch (error) {
            Logger.error(error.message);
        }
    }

    async restoreFailedData() {
        try {
            let restoredDatas =[];
            const failedData = await failedDataModel.find({});
            if(!failedData.length) return;
            for (const item of failedData) {
                let result;
                switch (item.category){
                    case 'activity':
                    result = await activitySchema.create(item.details)
                    restoredDatas.push({id:item._id})
                    break;

                    // case 'notification':
                    // await SockClient.notification(item?.details?.message,item?.details?.id );
                    // restoredDatas.push({id:item._id})
                    // break;

                }
            }
           
           let objectIds = underscore.pluck(restoredDatas,'id');
           let res =await failedDataModel.deleteMany({ _id: { $in: objectIds } })
          
        } catch (error) {
            Logger.error(error.message);
        }
    }
}

export default new ActivityService();
