import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    sender: { type: String, trim: true }, // Logined user info from user collection
    content: { type: String, trim: true }, // Actual message body
    chatChannel: { type: String, trim: true }, // Chat-channel id from chatChannel collection
    isEdited: { type: Boolean, default: false },
    isReplied: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});
export default mongoose.model("messageModel",messageSchema)