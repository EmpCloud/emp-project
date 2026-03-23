import mongoose from 'mongoose';

const ObjectId = mongoose.Schema.ObjectId;

const SubTaskSchema = new mongoose.Schema({
    id: { type: Number },
    projectName: { type: String },
    projectId: { type: String },
    taskId: { type: ObjectId },
    subTaskStageName: { type: String, trim: true }, //
    subTaskCategory: { type: String }, //  general ,  Problem ticket,  incident ,  service Req
    subTaskTitle: { type: String },
    subTaskType: { type: Number, default: 1 }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    subTaskDetails: { type: String },
    subTaskCreator: {
        id: { type: String },
        orgId: { type: String },
        email: { type: String },
        firstName: { type: String },
        lastName: { type: String },
        role: { type: String },
        verified: { type: Boolean },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        profilePic: { type: String },
    },
    dueDate: { type: Date },
    estimationTime: { type: String },
    estimationDate: { type: Date },
    subTaskAssignedTo: [
        {
            id: { type: String },
            orgId: { type: String },
            email: { type: String },
            firstName: { type: String },
            lastName: { type: String },
            role: { type: String },
            verified: { type: Boolean },
            createdAt: { type: Date, default: Date.now },
            updatedAt: { type: Date, default: Date.now },
            profilePic: { type: String },
        },
    ],
    attachment: { type: [String] },
    epicLink: { type: [String] },
    priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'Medium',
    }, // 1- High , 2- Medium, 3- Low
    subTaskStatus: { type: Number, default: 1 },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
export default mongoose.model('subtask_management', SubTaskSchema);
