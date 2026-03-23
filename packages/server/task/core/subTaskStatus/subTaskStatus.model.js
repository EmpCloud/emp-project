import mongoose from 'mongoose';

const SubTaskStatusSchema = new mongoose.Schema({
    adminId: { type: String },
    subTaskStatus: { type: String }, //1-To Do, 2-In Progress
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('sub_task_status', SubTaskStatusSchema);
