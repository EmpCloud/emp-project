import mongoose from 'mongoose';

const TaskTypeSchema = new mongoose.Schema({
    adminId: { type: String },
    taskType: { type: String }, // 1- New feature, 2- Improvement, 3-Bug 4-Epic
    isDefault: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    }},
    { timestamps: true }
);

export default mongoose.model('tasktype', TaskTypeSchema);
