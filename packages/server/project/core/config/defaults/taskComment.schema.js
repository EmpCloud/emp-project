import mongoose from 'mongoose';
const TaskCommentSchema = new mongoose.Schema(
    {
        taskId: { type: String },
        comment: { type: String },
        superUserId: { type: String },
        isEdited: { type: Boolean },
        commentCreator: {
            creatorId: { type: String },
            creatorName: { type: String },
            creatorProfilePic: { type: String },
        },
    },
    { timestamps: true }
);
export default mongoose.model('taskComment', TaskCommentSchema);