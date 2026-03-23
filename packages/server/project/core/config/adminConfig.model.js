import mongoose from 'mongoose';

const configSchema = new mongoose.Schema({
    orgId: { type: String, required: true },
    projectFeature: { type: Boolean, default: false },
    taskFeature: { type: Boolean, default: false },
    subTaskFeature: { type: Boolean, default: false },
    shortcutKeyFeature: { type: Boolean, default: false },
    chatFeature: { type: Boolean, default: false },
    invitationFeature: { type: Boolean, default: false },
    calendar: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export default mongoose.model('configSchema', configSchema);
