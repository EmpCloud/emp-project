import taskComment from "./task.comment.js";
import Response from "../../response/response.js";
import logger from "../../resources/logs/logger.log.js";
import NotificationService from '../notifications/notifications.service.js';
import Reuse from '../../utils/reuse.js';
import taskValidate from "./task.validate.js";
import { checkCollection } from "../../utils/common.utils.js"
// import adminModel from "../admin/admin.model.js";
import { ObjectId } from "mongodb";

class CommentReplyService {
    async addReply(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId, profilePic } = reuse.result.userData?.userData;
        try {
            const reply = req.body;
            const userNameInput = req.body.userName;
            const { value, error } = taskValidate.postCommentValidation(reply)
            if (error) {
                if (error) return res.send(Response.validationfailResp("Validation failed", error.details[0].message));
            }
            let replyedDetailes = {
                comment: value.comment,
                commentId: req.query.commentId,
                isEdited: false,
                userName: value.userName,
                replyedUserDetails: {
                    Id: userId,
                    name: name + ' ' + lastName,
                    profilePic: profilePic,
                },
                createdAt: new Date(),
                updatedAt: new Date()
            }
            const adminModel = `adminschemas`;
            const db = await checkCollection(reuse.collectionName.user)
            const response = await taskComment.findOneAndUpdate({ _id: req.query.commentId }, { $push: { reply: replyedDetailes } }, { returnDocument: 'after' })
            let task;
            if( response ){
                task = await db.collection(reuse.collectionName.task).findOne({ _id: ObjectId(response?.taskId) });
                if (reuse.result.type === 'user') {
                    // To Admin
                    let message = `${name} replied to the comment on ${task.taskTitle} task`;
                    await NotificationService.adminCommentNotification(message, Id, response.commentCreator.creatorId, { collection: 'TaskComment', id: response._id });

                     // To user
                     message = `${name} replied to your comment on ${task.taskTitle} task`;
                     await NotificationService.UserCommentNotification(message, userId, response.commentCreator.creatorId, { collection: 'TaskComment', id: response._id });
                } else {
                    // To user
                    const message = `${name} replied to your comment on ${task.taskTitle} task`;
                    await NotificationService.adminCommentNotification(message, userId, response.commentCreator.creatorId, { collection: 'TaskComment', id: response._id });
                }
            }
            if (response.userName) {
                userNameInput?.map(async (ele) => {
                    const userDetails = await db.collection(reuse.collectionName.user).findOne({ userName: ele });
                    let projectId=null;
                    if (userDetails) {
                        const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${name + ' ' + lastName} tagged you on the comment`;;
                        await NotificationService.UserCommentNotification(message, response.commentCreator.creatorId, userDetails._id.toString(),response.taskId,projectId, { collection: 'ProjectComment', id: response._id });
                    }
                    const adminDetails = await db.collection(adminModel).findOne({ userName: ele })
                    if (adminDetails) {
                        const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${name + ' ' + lastName} tagged you on the comment`;
                        await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId,response.taskId,projectId, { collection: 'ProjectComment', id: response._id });
                    }

                })
            }
            return res.send(Response.taskSuccessResp("Added reply successfully", response));
        } catch (err) {
            logger.error(`${err}`)
            return res.send(Response.taskFailResp("Failed add reply", err))
        }
    }
    async updateReply(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId, language, adminName, planData, creatorId, profilePic } = reuse.result.userData?.userData;
        try {
            const reply = req?.body;
            const replyId = req?.query.commentReplyedId;
            const userNameInput = req?.body?.userName;
            const { value, error } = taskValidate.updateCommentValidaton(req.body)
            if (error) {
                if (error) return res.send(Response.validationfailResp("Validation failed", error.details[0].message));
            }
            // const db = await checkCollection(reuse.collectionName.user)
            const response = await taskComment.findOneAndUpdate({ "reply._id": ObjectId(replyId) }, { $set: { "reply.$.comment": reply.comment, "reply.$.userName": userNameInput, "reply.$.isEdited": true } }, {
                returnOriginal: false
            })
            if (response) {
                const adminModel = `adminschemas`;
                const db = await checkCollection(reuse.collectionName.user)    
                let task = await db.collection(reuse.collectionName.task).findOne({ _id: ObjectId(response.taskId) });
        
                userNameInput?.map(async (ele) => {
                    const userDetails = await db.collection(reuse.collectionName.user).findOne({ userName: ele });
                    let projectId=null;
                    if (userDetails) {
                        const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${name + ' ' + lastName} tagged you on the comment`;;
                        await NotificationService.UserCommentNotification(message, response.commentCreator.creatorId, userDetails._id,response.taskId,projectId, { collection: 'ProjectComment', id: response._id });
                    }
                    const adminDetails = await db.cokkection(adminModel).findOne({ userName: ele })
                    if (adminDetails) {
                        const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment` : `${name + ' ' + lastName} tagged you on the comment`;
                        await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId,response.taskId,projectId, { collection: 'ProjectComment', id: response._id });
                    }

                })
            }
            return res.send(Response.taskSuccessResp("Updated Reply successfully", response));
        } catch (err) {
            logger.error(`${err}`)
            return res.send(Response.taskFailResp("Failed update reply", err))
        }
    }
    async deleteReply(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId } = reuse.result.userData?.userData;
        try {
            const replyId = req?.query.replyedId;
            const commentId = req?.query.commentId;
            let count = 0;
            const commentExist = await taskComment.findOne({ "_id": commentId })
            const isExist = await taskComment.findOne({ "reply._id": ObjectId(replyId) });
            if (commentExist) {
                let response;
                if (userId == commentExist.commentCreator.creatorId) {
                    if (!commentId) {
                        response = await taskComment.updateOne({
                            "reply._id": ObjectId(replyId)
                        }, {
                            $pull: {
                                reply: { _id: ObjectId(replyId) }
                            }
                        })
                    } else {
                        response = await taskComment.updateOne({
                            "reply.commentId": ObjectId(commentId)
                        }, {
                            $pull: {
                                reply: { commentId: commentId }
                            }
                        })
                    }
                }
                if (response.modifiedCount === 1) {
                    return res.send(Response.taskSuccessResp("Reply Deleted successfully", response));
                }
            }
            if (!isExist) {
                return res.send(Response.taskFailResp("Reply is not present please check this Id"))
            } else {
                isExist?.reply.map(ele => {
                    if (userId != ele.replyedUserDetails?.Id) {
                        count++;
                        return count;
                    }
                })
                if (count > 0) {
                    return res.send(Response.taskFailResp("You can't delete reply"))
                }
            }
            const response = await taskComment.updateOne({
                "reply._id": ObjectId(replyId)
            }, {
                $pull: {
                    reply: { _id: ObjectId(replyId) }
                }
            })
            if (response.modifiedCount === 1) {
                return res.send(Response.taskSuccessResp("Reply Deleted successfully", response));
            } else {
                return res.send(Response.taskFailResp('Reply not found or delete failed'));
            }

        } catch (err) {
            logger.error(`${err}`)
            return res.send(Response.taskFailResp("Failed delete reply", err))
        }

    }
}
export default new CommentReplyService();
