import mongoose from 'mongoose';

const TaskStageSchema = new mongoose.Schema({
    adminId: { type: String },
    taskStage: { type: String },
    isDefault: { type: Boolean, default: false },
    createdBy:{
        userId:{ type : String},
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const TaskStageModel = mongoose.model('taskstage', TaskStageSchema);

export const SaveDefaultTaskStageData = async (data, adminId) => {
    try {
        for (let element of data) {
            element.adminId = adminId;
            element.createdBy.userId = adminId;
            await new TaskStageModel(element).save();
        }
        return true;
    } catch (error) {
        return error;
    }
};

export let defaultTaskStages = [
    {
        adminId: '',
        taskStage: 'Default',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStage: 'Initiation',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStage: 'Planning',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStage: 'Execution',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStage: 'Production',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStage: 'Development',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
    {
        adminId: '',
        taskStage: 'Closure',
        isDefault: true,
        createdBy:{
            userId: ''
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
    },
];
export default TaskStageModel;