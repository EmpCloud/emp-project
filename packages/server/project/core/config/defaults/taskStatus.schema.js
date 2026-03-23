import mongoose from 'mongoose';

const TaskStatusSchema = new mongoose.Schema({
    adminId: { type: String },
    taskStatus: { type: String }, //1-TODO, 2-Progress, 3-Review, 4-Done, 5-Hold
    isDefault: { type: Boolean, default: false },
    createdBy:{
        userId:{ type : String},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const TaskStatusModel = mongoose.model('taskstatus', TaskStatusSchema);

export const SaveDefaultTaskStatusData = async (data, adminId) => {
    try {
        for (let element of data) {
            element.adminId = adminId;
            element.createdBy.userId = adminId;
            await new TaskStatusModel(element).save();
        }
        return true;
    } catch (error) {
        return error;
    }
};

export const defaultTaskStatus = [
    {
        adminId: '',
        taskStatus: 'Todo',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStatus: 'Inprogress',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStatus: 'Done',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStatus: 'Onhold',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStatus: 'Inreview',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];

export default TaskStatusModel;
