import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    id: { type: Number },
    projectName: { type: String },
    projectId: { type: String },
    stageName: { type: String, trim: true },
    category: { type: String }, //  general ,  Problem ticket,  incident ,  service Req
    taskTitle: { type: String },
    taskType: { type: String }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    taskDetails: { type: String },
    taskCreator: {
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
    assignedTo: [
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
    taskStatus: { type: String }, // 1- Todo , 2- Inprogress, 3- Pending 4-Review 5-Done 6-Hold

    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('task_management', TaskSchema);
