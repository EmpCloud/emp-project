import mongoose from 'mongoose';

const TaskStageSchema = new mongoose.Schema({
    adminId: { type: String },
    taskStage: { type: String },
    isDefault: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    }},
    { timestamps: true }
);

export default mongoose.model('taskstage', TaskStageSchema);
