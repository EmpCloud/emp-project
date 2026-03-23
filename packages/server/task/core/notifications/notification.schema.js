import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    sentBy: { type: String, required: true},
    message: { type: String, required: true },
    sentTo: { type: Array },
    isComment: {type:Boolean},
    isRead: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    }},
    { timestamps: true }
);
export default mongoose.model('notificationModel',notificationSchema);