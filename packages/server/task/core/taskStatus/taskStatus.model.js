import mongoose from 'mongoose';

const TaskStatusSchema = new mongoose.Schema({
    adminId: { type: String },
    taskStatus: { type: String }, //1-TODO, 2-Progress, 3-Review, 4-Done, 5-Hold
    isDefault: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    }},
    { timestamps: true }
);

export default mongoose.model('taskstatus', TaskStatusSchema);
