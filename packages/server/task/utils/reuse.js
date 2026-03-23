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
            subTaskType: `org_${organization}_subtasktypes`,
            subTaskStatus: `org_${organization}_subtaskstatuses`,
            taskActivity: `org_${organization}_taskactivityfeatures`,
            taskComment: `org_${organization}_taskcommentfeatures`,
            subTaskActivity: `org_${organization}_subtaskactivityfeatures`,
            subTaskStatus: `org_${organization}_subtaskstatuses`,
            taskStage: `org_${organization}_taskstages`,
            taskType: `org_${organization}_tasktypes`,
            taskStatus: `org_${organization}_taskstatuses`,
            taskCategory: `org_${organization}_taskcategories`,
            subTaskComment: `org_${organization}_subtaskcommentfeatures`,
            notification: `org_${organization}_notifications`,
        };
        this.userObj = {
            _id: 1,
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            permission: 1,
            isSuspended: 1,
            profilePic: 1,
            isAdmin: 1,
            verified: 1,
            orgId: 1,
            createdAt: 1,
        };
        this.skip = +req?.query?.skip || config.get('skip');
        this.limit = +req?.query?.limit || config.get('limit');
        this.sort = req?.query?.sort || 'asc';
        this.orderby = req?.query?.order;
        this.result = req?.verified;
    }
}

export default Reuse;
