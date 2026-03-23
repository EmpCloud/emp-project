import mongoose from 'mongoose';

const chatChannelSchema = mongoose.Schema(
    {
        chatName: { type: String, trim: true }, // Private or Group chat name
        isGroupChat: { type: Boolean, default: false },
        admin: { type: String, trim: true }, // Admin Id
        users: [
            { type: Array }, // Participants/UserIds inside chat from users collection
        ],
        groupLogo: { type: String },
        latestMessage: {
            type: String,
            trim: true, // Message data from message collection,
        },
        groupAdmin: {
            type: String,
            trim: true, // Admin/User data,
        },
        createdBy: {
            type: String,
            trim: true,
        },
        createdAt: { type: Date, default: Date.now() },
        updatedAt: { type: Date, default: Date.now() },
    },
    { timestamps: true }
);

export const SaveDefaultChatChannel = async (schemaName, adminId) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, chatChannelSchema);
        for (let element of data) {
            element.adminId = adminId;
            await new orgsSchemaModel(element).save();
        }
        return true;
    } catch (error) {
        return error;
    }
};

export let chatChannel = [
    {
        chatName: 'private',
        isGroupChat: false,
        users: ['63c8e98edc2db6c581b0d403', '63c8f464dc2db6c581b0d40a'],
        latestMessage: '63c8f8f4dc2db6c581b0d438',
    },
    {
        chatName: 'private',
        isGroupChat: false,
        admin: '63c8e98edc2db6c581b0d403',
        users: ['63c8e98edc2db6c581b0d403'],
        latestMessage: '63c8f8f4dc2db6c581b0d438',
    },
    {
        chatName: 'Test',
        isGroupChat: true,
        users: ['63c8e98edc2db6c581b0d403', '63c8f464dc2db6c581b0d40a'],
        groupAdmin: '63c8f95fdc2db6c581b0d444',
    },
];
