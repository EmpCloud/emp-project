import mongoose from 'mongoose';
const groupSchema = new mongoose.Schema({
    adminId: { type: String },
    groupName: { type: String, required: true },
    groupDescription: { type: String },
    groupLogo: { type: String },
    groupCreatedBy: {
        userId: String,
        userName: String,
        isAdmin:Boolean,
        userProfilePic: String,
    },
    groupUpdatedBy: {
        userId: String,
        userName: String,
        isAdmin:Boolean,
        userProfilePic: String,
    },
    assignedMembers: [
        {
            userId: String,
            orgId: String,
            isAdmin:Boolean,
            firstName: String,
            lastName: String,
            password: String,
            profilePic: String,
            email: String,
            role: String,
            permission: String,
            empMonitorId: String,
            verified: Boolean,
            createdAt: Date,
        },
    ],
    orgId: { type: String }
},
{ timestamps: true });
export default mongoose.model('groupSchema',groupSchema);