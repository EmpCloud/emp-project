import mongoose from 'mongoose';
const notificationSchema = new mongoose.Schema({
    sentBy: { type: String, required: true },
    message: { type: String, required: true },
    sentTo: { type: Array },
    isRead: { type: Boolean, default: false },
    createdBy: {
        userId: { type: String },
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: { type: Date },
});
export const SaveDefaultNotification = async (schemaName, data, orgId) => {
    try {
        const orgsSchemaModel = mongoose.model(schemaName, notificationSchema);
        for (let element of data) {
            element.orgId = orgId;
            await new orgsSchemaModel(element).save();
        }
        return true;
    } catch (error) {
        return error;
    }
};
export const defaultNotification = [
    {
        sentBy: '644b71a751e8a276fb831607',
        message: 'Updated Basic plan for 60 DAYS',
        sentTo: ['644b71a751e8a276fb831607'],
        isRead: false,
        category: {
            collection: 'plans',
            id: '6434fd8f125098fa361ef2ba',
        },
        createdBy: {
            userId: '644b71a751e8a276fb831607',
        },
        createdAt: Date.now(),
    },
    {
        sentBy: '644b71a751e8a276fb831607',
        message: 'Added you in task New Feature',
        sentTo: ['644b9b8a51e8a276fb8319bf', '6466049204c7011926408c23'],
        isRead: false,
        category: {
            collection: 'task',
            id: '6434fd8f125098fa361ef2ba',
        },
        createdBy: {
            userId: '644b71a751e8a276fb831607',
        },
        createdAt: Date.now(),
    },
    {
        sentBy: '644b9b8a51e8a276fb8319bf',
        message: 'Added you in task Create Demo ApI',
        sentTo: ['644b71a751e8a276fb831607', '6466049204c7011926408c23'],
        isRead: false,
        category: {
            collection: 'project',
            id: '6434fd8f125098fa361ef2ba',
        },
        createdBy: {
            userId: '644b9b8a51e8a276fb8319bf',
        },
        createdAt: Date.now(),
    },
    {
        sentBy: '6466049204c7011926408c23',
        message: 'Added you in project Chat-UI',
        sentTo: ['644b9b8a51e8a276fb8319bf', '644b71a751e8a276fb831607'],
        isRead: false,
        category: {
            collection: 'project',
            id: '6434fd8f125098fa361ef2ba',
        },
        createdBy: {
            userId: '6466049204c7011926408c23',
        },
        createdAt: Date.now(),
    },
    {
        sentBy: '6466049204c7011926408c23',
        message: 'Updated Basic plan for 60 DAYS',
        sentTo: ['6466049204c7011926408c23'],
        isRead: false,
        category: {
            collection: 'plans',
            id: '6434fd8f125098fa361ef2ba',
        },
        createdBy: {
            userId: '6466049204c7011926408c23',
        },
        createdAt: Date.now(),
    },
    {
        sentBy: '644b9b8a51e8a276fb8319bf',
        message: 'Updated Basic plan for 60 DAYS',
        sentTo: ['644b9b8a51e8a276fb8319bf'],
        isRead: false,
        category: {
            collection: 'plans',
            id: '6434fd8f125098fa361ef2ba',
        },
        createdBy: {
            userId: '644b9b8a51e8a276fb8319bf',
        },
        createdAt: Date.now(),
    },
];
