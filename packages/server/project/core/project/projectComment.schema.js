import mongoose from 'mongoose';
const ProjectCommentSchema = new mongoose.Schema(
    {
        projectId: { type: String },
        comment: { type: String },
        superUserId: { type: String },
        isEdited: { type: Boolean },
        orgId: { type: String },
        userName: [{ type: String }],
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
        commentCreator: {
            creatorId: { type: String },
            creatorName: { type: String },
            creatorProfilePic: { type: String },
        },
    },
    { timestamps: true }
);


export default mongoose.model('projectComment', ProjectCommentSchema);