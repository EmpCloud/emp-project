import SockClient from '../../task.server.js';
import { checkCollection } from '../../utils/common.utils.js';
import notificationSchema from './notification.schema.js';

class NotificationService {
    async adminNotification(message, adminId, userId, category) {
        await SockClient.notification(message, adminId);
       
        const notify = await notificationSchema.create({
            sentBy: userId.toString(),
            message: message,
            sentTo: [adminId],
            category: category,
            createdBy: {
                userId: userId.toString(),
            },
            createdAt: new Date(),
        });
    }
    async userNotification(message, Id, userId, category) {
        await SockClient.notification(message, userId);
        const notify = await notificationSchema.create({
            sentBy: Id.toString(),
            message: message,
            sentTo: [userId],
            category: category,
            createdBy: {
                userId: Id.toString(),
            },
            createdAt: new Date(),
        });
    }
    async adminCommentNotification(message,adminId,userId,taskId,projectId,category){
        await SockClient.notification(message, adminId);
        await notificationSchema.create({
            sentBy: userId.toString(),
            message: message,
            sentTo: [adminId],
            taskId:taskId,
            projectId:projectId,
            isComment: true,
            category: category,
            isRead: false,
            createdBy: {
                userId: userId.toString(),
            },
            createdAt: new Date(),
        });

     }
     async UserCommentNotification(message,Id,userId,taskId,projectId,category){
        await SockClient.notification(message, userId);
        await notificationSchema.create({
            sentBy: Id,
            message: message,
            sentTo: [userId],
            taskId:taskId,
            projectId:projectId,
            isComment:true,
            category: category,
            isRead: false,
            createdBy: {
                userId: Id,
            },
            createdAt: new Date(),
        });
     }
}
export default new NotificationService();
