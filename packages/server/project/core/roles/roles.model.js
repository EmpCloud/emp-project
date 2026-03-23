import mongoose from 'mongoose';

const rolesSchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    roles: { type: String },
    is_default: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

let roleModel = mongoose.model('rolesSchema', rolesSchema);
export default roleModel;

export const defaultRole = [
    {
        orgId: '',
        roles: 'member',
        is_default: true,
    },
    {
        orgId: '',
        roles: 'sponsor',
        is_default: true,
    },
    {
        orgId: '',
        roles: 'owner',
        is_default: true,
    },
    {
        orgId: '',
        roles: 'manager',
        is_default: true,
    },
];
