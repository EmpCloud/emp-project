import mongoose from 'mongoose';
const activitySchema = new mongoose.Schema(
    {
        activityType: {
            type: String,
            enum: [
                'Project',
                'Config',
                'Task',
                'Plan',
                'Permission',
                'User',
                'SubTask',
                'Admin',
                'Roles',
                'Group',
                'TaskStatus',
                'TaskType',
                'TaskStage',
                'TaskCategory',
                'SubTaskType',
                'SubTaskStatus',
            ],
        },
        projectId: { type: String },
        taskId: { type: String },
        userId: { type: String },
        permissionId: { type: String },
        configId: { type: String },
        planId: { type: String },
        adminId: { type: String },
        activity: { type: String },
        orgId: { type: String },
        roleId: { type: String },
        groupId: { type: String },
        category: {
            type: String,
            enum: ['Created', 'Updated', 'Viewed', 'Deleted', 'Searched', 'Filtered', 'Login', 'Registered', 'Verified', 'UpdatedPassword', 'Reset Password', 'Selected', 'Restored'],
        },
        userDetails: {
            id: { type: String },
            name: { type: String },
            profilePic: { type: String, trim: true },
        },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);
export default mongoose.model('activitySchema', activitySchema);
