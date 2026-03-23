import mongoose, { STATES } from 'mongoose';

const adminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    userName: { type: String, required: true },
    profilePic: { type: String },
    password: { type: String, required: true },
    countryCode: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    orgId: { type: String, required: true },
    orgName: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    empMonitorId: { type: String },
    isEmpMonitorUser: { type: Boolean, default: false },
    isConfigSet: { type: Boolean, default: false },
    lastLogin: {type:Date, default:Date.now()},
    verified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model('adminSchema', adminSchema);
