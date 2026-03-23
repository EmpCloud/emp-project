import mongoose from 'mongoose';

const TaskCategorySchema = new mongoose.Schema({
    adminId: { type: String },
    taskCategory: { type: String },
    isDefault: { type: Boolean, default: false },
    createdBy:{
        userId:{ type : String},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const TaskCategoryModel = mongoose.model('taskcategory', TaskCategorySchema);

export const SaveDefaultTaskCategoryData = async (data, adminId) => {
    try {
        for (let element of data) {
            element.adminId = adminId;
            element.createdBy.userId = adminId;
            await new TaskCategoryModel(element).save();
        }
        return true;
    } catch (error) {
        return error;
    }
};

export let defaultTaskCategory = [
    {
        adminId: '',
        taskCategory: 'Default',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Task',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Bug',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Epic',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Service',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Incident',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Problem',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskCategory: 'Change',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];
export default TaskCategoryModel