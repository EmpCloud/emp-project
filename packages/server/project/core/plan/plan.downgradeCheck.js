import Response from '../../response/response.js';
import Logger from '../../resources/logs/logger.log.js';
import planHistoryModel from './planHistory.model.js';
import Reuse from '../../utils/reuse.js';
import { checkCollection } from '../../utils/user.utils.js';
import roleModel from '../roles/roles.model.js';
import { checkData } from '../../utils/project.utils.js';
import permissionModel from '../permissions/permission.model.js';
import groupSchema from '../groups/group.schema.js';
import { storePlanHistory } from '../../utils/activity.utils.js';
import event from '../event/eventEmitter.js';
import adminModel from '../admin/admin.model.js';



class PlanDowngradeService {
 async downGradePlan(res,organizations,adminRegisterData, planDatas, _id, planExpireDate,adminRegisterDatas) {
    let organization = organizations.toLowerCase();
    let collectionName = {
        project: `org_${organization}_projectfeatures`,
        action: `org_${organization}_projectactivityfeatures`,
        user: `org_${organization}_users`,
        group: `org_${organization}_groups`,
        task: `org_${organization}_taskfeatures`,
        subTask: `org_${organization}_subtaskfeatures`,
        
        taskActivity: `org_${organization}_taskactivityfeatures`,
        taskComment: `org_${organization}_taskcommentfeatures`,
        subTaskActivity: `org_${organization}_subtaskactivityfeatures`,
        subTaskComment: `org_${organization}_subtaskcommentfeatures`,
        projectComment: `org_${organization}_projectcomments`,
        planActivity: `org_${organization}_plan_histories`,
        permissionActivity: `org_${organization}_permissionactivities`,
        userActivity: `org_${organization}_useractivities`,
        configActivity: `org_${organization}_configactivitylogs`,
        chat: `org_${organization}_chats`,
        message: `org_${organization}_messages`,
        notification: `org_${organization}_notifications`,
        chatChannel: `org_${organization}_chatchannels`,
    }
    console.log(collectionName,'collectionName');
    try{
        let planData
        const db = await checkCollection(collectionName.project);
        // const planData2 = await planHistoryModel.findOne({ orgId: organizations }).sort({ createdAt: -1 });
        planData=adminRegisterDatas.planData
        const totalProjects = await db.collection(collectionName.project).find({}).project({ projectName: 1 }).toArray();
        let requireDeleteProject = totalProjects.length - planData.projectFeatureCount;


        const totalTasks = await db.collection(collectionName.task).find({}).project({ taskTitle: 1 }).toArray();
        let requireDeleteTask = totalTasks.length - planData.taskFeatureCount;


        const totalSubTasks = await db.collection(collectionName.subTask).find({}).project({ subTaskTitle: 1 }).toArray();
        let requireDeleteSubTask = totalSubTasks.length - planData.subTaskFeatureCount;


        let totalUsers = await db.collection(collectionName.user).find({ invitation: 1 }).project({ firstName: 1, lastName: 1 }).toArray();
        let requireDeleteUser = totalUsers.length - planData.userFeatureCount;


        let totalRoles = await roleModel.find({ orgId: organization, is_default: false }).select("roles");
        let requireDeleteRoles = totalRoles.length - planData.customizeRoles;


        let totalPermissions = await permissionModel.find({ orgId: organization, is_default: false }).select('permissionName')
        let requireDeletePermissions = totalPermissions.length - planData.customizePermission;


        let totalGroups = await groupSchema.find({ orgId: organization }).select('groupName')
        let requireDeleteGroups = totalGroups.length - planData.groupFeatureCount;


        let taskCategory = `taskcategories`;
        let totalGategory = await db.collection(taskCategory).find({ adminId: _id, isDefault: false }).project({ taskCategory: 1 }).toArray()
        let requireDeletecategories = totalGategory.length - planData.categoriesCount;


        let taskType = `tasktypes`;
        let totalTaskType = await db.collection(taskType).find({ adminId: _id, isDefault: false }).project({ taskType: 1 }).toArray()
        let requireDeleteTaskType = totalTaskType.length - planData.customizeTaskType;


        let taskstatus = `taskstatuses`;
        let totalTaskStatus = await db.collection(taskstatus).find({ adminId: _id, isDefault: false }).project({ taskStatus: 1 }).toArray()
        let requireDeleteTaskstatus = totalTaskStatus.length - planData.customizeTaskStatus;


        let taskStage = `taskstages`;
        let totalTaskStage = await db.collection(taskStage).find({ adminId: _id, isDefault: false }).project({ taskStage: 1 }).toArray()
        let requireDeleteTaskStage = totalTaskStage.length - planData.customizeTaskStage;

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
        // console.log(stable);
        if(!stable){
            let planHistory = storePlanHistory(adminRegisterData, planDatas, _id, planExpireDate)
            event.emit('history', planHistory);  
            const newData = await adminModel.findOneAndUpdate({ 
                $or: [
                    { email: adminRegisterDatas.email },
                    { userName: adminRegisterDatas.userName }
                ]
              }, { $set: { lastLogin: Date.now() , planDowngrade:false } }, { returnDocument: 'after' });

        }else{
            const newData = await adminModel.findOneAndUpdate({ 
                $or: [
                    { email: adminRegisterDatas.email },
                    { userName: adminRegisterDatas.userName }
                ]
              }, { $set: { lastLogin: Date.now() , planDowngrade:true } }, { returnDocument: 'after' });
        }
    
         return  stable;
        
    }catch(err){
        console.log(err);
    }

}
}

export default new PlanDowngradeService();