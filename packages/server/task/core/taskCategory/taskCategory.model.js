import mongoose from 'mongoose';

const TaskCategorySchema = new mongoose.Schema({
    adminId: { type: String },
    taskCategory: { type: String },
    isDefault: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    }},
    { timestamps: true }
);

export default mongoose.model('taskcategory', TaskCategorySchema);
