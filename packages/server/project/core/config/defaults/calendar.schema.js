import mongoose from 'mongoose';
import deleteDummy from './delete.dummydocument.js';

const CalendarSchema = new mongoose.Schema({
    eventName: { type: String },
    description: { type: String },
    attendees: [
        {
            id: { type: String },
        },
    ],
    invitedUsers: { type: Number, default: 0 },
    attendedUsers: { type: Number, default: 0 },
    eventStatus: { type: String, enum: ['queue', 'done', 'cancelled', 'postponed', 'rescheduled'], default: ['queue'] },
    isRescheduled: { type: Boolean, default: false },
    isCanceled: { type: Boolean, default: false },
    isPostponed: { type: Boolean, default: false },
    reminder: { type: Boolean, default: false },
    creatorId: { type: String },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date, default: Date.now() },
});

export const SaveCalenderData = async (schemaName, data) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, CalendarSchema);

        await new orgsSchemaModel(data).save();
        deleteDummy(schemaName);
        return true;
    } catch (error) {
        return error;
    }
};
export let CalenderData = {
    creatorId: '12345645533',
    attendees: [
        {
            id: '1',
        },
        {
            id: '2',
        },
    ],
    eventName: 'Board Meeting ',
    startTime: new Date(),
    endTime: new Date(),
};
