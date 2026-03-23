import mongoose from 'mongoose';
const subTaskCommentSchema = new mongoose.Schema(
    {
        taskId: { type: String },
        subtaskId: { type: String },
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
export default mongoose.model('subtaskComment', subTaskCommentSchema);