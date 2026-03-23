import mongoose from 'mongoose';

const TaskTypeSchema = new mongoose.Schema({
    adminId: { type: String },
    taskType: { type: String }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    isDefault: { type: Boolean, default: false },
    createdBy:{
        userId:{ type : String},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const TaskTypeModel = mongoose.model('tasktype', TaskTypeSchema)

export const SaveDefaultTaskTypeData = async (data, adminId) => {
    try {
        for (let element of data) {
            element.adminId = adminId;
            element.createdBy.userId = adminId;
            await new TaskTypeModel(element).save();
        }
        return true;
    } catch (error) {
        return error;
    }
};

export let defaultTaskTypes = [
    {
        adminId: '',
        taskType: 'Default',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskType: 'Feature',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskType: 'Improvement',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskType: 'Bug',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskType: 'Security',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskType: 'Deployment',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];
export default TaskTypeModel;