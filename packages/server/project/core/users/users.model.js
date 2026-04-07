import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String },
    password: { type: String, required: true },
    profilePic: { type: String ,default:null},
    email: { type: String, required: true },
    role: { type: String, default: null },
    permission: { type: String, default: 'Read' },
    empMonitorId: { type: String },
    empcloudUserId: { type: String, index: true },
    verified: { type: Boolean, default: false },
    isSuspended:{ type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model('userSchema', userSchema);
