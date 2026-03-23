import mongoose from 'mongoose';

const permissionSchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    permissionName: { type: String },
    permissionConfig: { type: Object },
    is_default: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

let permissionModel = mongoose.model('permissionSchema', permissionSchema);
export default permissionModel;