import SockClient from '../../project.server.js';
import { checkCollection, checkData, deleteManyByAdmin, deleteManyByUser, deleteOneByAdmin, deleteOneByUser } from '../../utils/project.utils.js';
import Logger from '../../resources/logs/logger.log.js';
import Response from '../../response/response.js';
import { ObjectId } from 'mongodb';
import notificationModel from './notification.schema.js';

class NotificationService {
    async fetchNotification(req, res) {
        const result = req.verified;
        Logger.info(`result: ${result}`);
        if (result.state === true) {
            try {
                const { _id } = result?.userData?.userData;
                const userCollectionName = `org_${result?.userData?.userData?.orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';
                const notificationCollectionName = 'notificationmodels'
                const db = await checkCollection(notificationCollectionName);
                if (!db) return res.status(400).send(Response.notificationFailResp('Notification collection not present'));

                const notifications = await db
                    .collection(notificationCollectionName)
                    .aggregate([{ $match: { sentTo: { $in: [_id.toString()] } } },

                    { $addFields: { sentBy: { $toObjectId: '$sentBy' } } },
                    {
                        $lookup: {
                            from: adminCollectionName,
                            localField: 'sentBy',
                            foreignField: '_id',
                            as: 'adminData',
                        },
                    },
                    {
                        $lookup: {
                            from: userCollectionName,
                            localField: 'sentBy',
                            foreignField: '_id',
                            as: 'userData',
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            message: 1,
                            sentBy: {
                                $cond: { if: { $eq: ['$adminData', []] }, then: '$userData', else: '$adminData' },
                            },
                            sentTo: 1,
                            isComment: 1,
                            isRead: 1,
                            taskId:1,
                            projectId:1,
                            category: 1,
                            createdBy: 1,
                            createdAt: 1,
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            message: 1,
                            'sentBy._id': 1,
                            'sentBy.firstName': 1,
                            'sentBy.lastName': 1,
                            'sentBy.profilePic': 1,
                            sentTo: 1,
                            isRead: 1,
                            taskId:1,
                            projectId:1,
                            isComment: 1,
                            category: 1,
                            createdBy: 1,
                            createdAt: 1,
                        },
                    },
                    { $sort: { _id: -1 } },
                    ]).toArray()

                return res.status(200).send(Response.notificationSuccessResp('Notifications fetched successfully', notifications));
            } catch (err) {
                Logger.error(`error ${err}`);
                return res.status(400).send(Response.notificationFailResp('Failed to fetch notifications', err));
            }
        } else {
            return res.send(result);
        }
    }

    async readNotification(req, res) {
        const result = req.verified;
        Logger.info(`result: ${result}`);
        if (result.state === true) {
            try {
                const { notificationId } = req?.query;
                const read = req?.body;
                if (!notificationId) {
                    let read_array = [];
                    for (const id of read.ids) {
                        read_array.push(ObjectId(id));
                    }
                    const setRead = await notificationModel.updateMany({ _id: { $in: read_array } }, { $set: { isRead: true } }, { returnDocument: 'after' });
                    return res.status(200).send(Response.notificationSuccessResp(`All notifications marked as read`));
                } else {
                    const setRead = await notificationModel.findOneAndUpdate({ _id: ObjectId(notificationId) }, { $set: { isRead: true } }, { returnDocument: 'after' });
                    return res.status(200).send(Response.notificationSuccessResp(`Notification marked as read`));
                }
            } catch (err) {
                Logger.error(`error ${err}`);
                return res.status(400).send(Response.notificationSuccessResp('Failed to mark as read', err));
            }
        } else {
            return res.send(result);
        }
    }

    async deleteNotification(req, res) {
        const result = req.verified;
        Logger.info(`result: ${result}`);
        if (result.state === true) {
            try {
                const { _id, orgId } = result?.userData?.userData;
                const { notificationId } = req?.query;
                // Check if data exist, then delete

                let deleted;
                if (notificationId) {
                    const isDataExist = await notificationModel.findOne({ _id: notificationId });
                    if (isDataExist === null) {
                        return res.status(400).send(Response.notificationFailResp('Invalid Notification Id'));
                    }
                    deleted = await notificationModel.deleteOne({ _id: ObjectId(notificationId) });
                    return res.status(200).send(Response.notificationSuccessResp('Deleted notification', deleted));
                }
                else {
                    deleted = await notificationModel.deleteMany({ sentTo: _id });
                    if (deleted.deletedCount == 0) {
                        return res.status(400).send(Response.notificationFailResp('Notifications not found'));
                    }
                    return res.status(200).send(Response.notificationSuccessResp('Deleted notifications', deleted));
                }
            } catch (err) {
                Logger.error(`error ${err}`);
                return res.status(400).send(Response.notificationFailResp('Failed deleting notifications, either Invalid Id', err));
            }
        } else {
            return res.send(result);
        }
    }

    async adminNotification(message, adminId, userId, category) {
        // const result1 = await SockClient.notification(message, adminId);
        const result = await notificationModel.create({
            sentBy: userId,
            message: message,
            sentTo: [adminId.toString()],
            isRead: false,
            createdBy: {
                userId: userId,
            },
            createdAt: new Date(),
        });
    }
     async adminCommentNotification(message,adminId,userId,taskId,project_id,category){
        await SockClient.notification(message, adminId);
        await notificationModel.create({
            sentBy: userId.toString(),
            message: message,
            sentTo: [adminId],
            taskId:taskId,
            projectId: project_id,
            isComment: true,
            category: category,
            isRead: false,
            createdBy: {
                userId: userId.toString(),
            },
            createdAt: new Date(),
        });

     }
     async UserCommentNotication(message,Id,userId,taskId,project_id,category){
        await SockClient.notification(message, userId);
        await notificationModel.create({
            sentBy: Id,
            message: message,
            taskId:taskId,
            projectId: project_id,
            sentTo: [userId],
            isComment:true,
            category: category,
            isRead: false,
            createdBy: {
                userId: Id,
            },
            createdAt: new Date(),
        });
     }
    async userNotification(message, Id, userId, category) {
        await SockClient.notification(message, userId);
        await notificationModel.create({
            sentBy: Id,
            message: message,
            sentTo: [userId],
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
