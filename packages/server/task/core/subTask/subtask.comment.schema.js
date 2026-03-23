import mongoose from 'mongoose';
const subTaskCommentSchema = new mongoose.Schema(
    {
        taskId: { type: String },
        subtaskId: { type: String },
        comment: { type: String },
        superUserId: { type: String },
        isEdited: { type: Boolean },
        orgId:{type: String},
        userName:[{type:String}],
        commentCreator: {
            creatorId: { type: String },
            creatorName: { type: String },
            creatorProfilePic: { type: String },
        },
        reply: [{
            commentId: { type: String },
            comment: { type: String },
            userName: [{ type: String }],
            isEdited: { type: Boolean },
            replyedUserDetails: {
                Id: { type: String },
                name: { type: String },
                profilePic: { type: String }
            },
            createdAt:{type:Date},
            updatedAt:{type:Date}
        }],
    },
    { timestamps: true }
);
export default mongoose.model('subtaskComment', subTaskCommentSchema);