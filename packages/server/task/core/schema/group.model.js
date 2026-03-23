import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
    adminId: { type: String },
    groupName: { type: String, required: true },
    groupDescription: { type: String },
    groupLogo: { type: String },
    groupCreatedBy: {
        userId: String,
        userName: String,
        userProfilePic: String,
    },
    groupUpdatedBy: {
        userId: String,
        userName: String,
        userProfilePic: String,
    },
    assignedMembers: [{ userId: String }],
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model('userGroup', groupSchema);
