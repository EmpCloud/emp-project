import config from 'config';

class Reuse {
    constructor(req) {
        const organization = req?.verified?.userData?.userData?.orgId.toLowerCase();
        this.collectionName = {
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
        };
        this.skip = +req?.query?.skip || config.get('skip');
        this.limit = +req?.query?.limit || config.get('limit');
        this.sort = req?.query?.sort || 'asc';
        this.orderby = req?.query?.orderBy;
        this.result = req?.verified;
        this.userObj = {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            isSuspended :1,
            permission: 1,
            profilePic: 1,
            isAdmin: 1,
            verified: 1,
            orgId: 1,
            userName: 1,
            createdAt: 1,
        };
        this.groupObj = {
            _id: 1,
            adminId: 1,
            groupName: 1,
            groupDescription: 1,
            groupLogo: 1,
            assignedMembers: 1,
            createdAt: 1,
        };
        this.subTaskObj = {
            _id: 1,
            projectId: 1,
            subTaskTitle: 1,
            subTaskStatus: 1,
        };
        this.taskObj = {
            _id: 1,
            projectId: 1,
            taskTitle: 1,
            taskStatus: 1,
        };
        this.projectObj = {
            _id: 1,
            projectName: 1,
            status: 1,
        };
    }
}

export default Reuse;
