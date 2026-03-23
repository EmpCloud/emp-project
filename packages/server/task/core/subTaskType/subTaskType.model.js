import mongoose from 'mongoose';

const SubTaskTypeSchema = new mongoose.Schema({
    adminId: { type: String },
    subTaskType: { type: String }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model('sub_task_type', SubTaskTypeSchema);
