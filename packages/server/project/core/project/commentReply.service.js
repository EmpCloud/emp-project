import projectCommentSchema from "./projectComment.schema.js";
import Response from "../../response/response.js";
import logger from "../../resources/logs/logger.log.js";
import NotificationService from '../notifications/notifications.service.js';
import Reuse from '../../utils/reuse.js';
import projectValidate from "./project.validate.js";
import { checkCollection } from "../../utils/project.utils.js";
import adminModel from "../admin/admin.model.js";
import { ObjectId } from "mongodb";
class CommentReplyService {
    async addReply(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId, profilePic } = reuse.result.userData?.userData;
        try {
            const reply = req.body;
            const userNameInput = req.body.userName;
            const { value, error } = projectValidate.addComment(reply)
            if (error) {
                if (error) return res.send(Response.validationFailResp("Validation failed", error.details[0].message));
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
            const db = await checkCollection(reuse.collectionName.user)
            const response = await projectCommentSchema.findOneAndUpdate({ _id: req.query.commentId }, { $push: { reply: replyedDetailes } }, { returnDocument: 'after' })
            let projectDetails;
            if( response ){
                projectDetails = await  db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(response.projectId) });
            }
            if (response.userName) {
                userNameInput?.map(async (ele) => {
                    const userDetails = await db.collection(reuse.collectionName.user).findOne({ userName: ele });
                    let taskId=null
                    if (userDetails) {
                        const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails.projectName} project`;;
                        await NotificationService.UserCommentNotication(message, response.commentCreator.creatorId, userDetails._id.toString(),taskId,response.projectId, { collection: 'ProjectComment', id: response._id });
                    }
                    const adminDetails = await adminModel.findOne({ userName: ele })
                    if (adminDetails) {
                        const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails.projectName} project`;
                        await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId,taskId,response.projectId, { collection: 'ProjectComment', id: response._id });
                    }

                })
            }
            return res.send(Response.projectSuccessResp("Added reply successfully", response));
        } catch (err) {
            logger.error(`${err}`)
            return res.send(Response.projectFailResp("Failed add reply", err))
        }
    }
    async updateReply(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId, language, adminName, planData, creatorId, profilePic } = reuse.result.userData?.userData;
        try {
            const reply = req?.body;
            const replyId = req?.query.commentReplyedId;
            const userNameInput = req?.body?.userName;
            const { value, error } = projectValidate.updateCommentValidate(req.body)
            if (error) {
                if (error) return res.send(Response.validationFailResp("Validation failed", error.details[0].message));
            }
            // const db = await checkCollection(reuse.collectionName.user)
            const response = await projectCommentSchema.findOneAndUpdate({ "reply._id": ObjectId(replyId) }, { $set: { "reply.$.comment": reply.comment, "reply.$.userName": userNameInput, "reply.$.isEdited": true,"reply.$.updatedAt":new Date() } }, {
                returnOriginal: false
            })
            let projectDetails;
            if( response ){
                projectDetails = await  db.collection(reuse.collectionName.project).findOne({ _id: ObjectId(response.projectId) });
            }
            if (response) {
                userNameInput?.map(async (ele) => {
                    const userDetails = await db.collection(reuse.collectionName.user).findOne({ userName: ele });
                    let taskId=null;
                    if (userDetails) {
                        const message = (userDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails.projectName} project`;;
                        await NotificationService.UserCommentNotication(message, response.commentCreator.creatorId, userDetails._id.toString(),taskId,response.projectId, { collection: 'ProjectComment', id: response._id });
                    }
                    const adminDetails = await adminModel.findOne({ userName: ele })
                    if (adminDetails) {
                        const message = (adminDetails._id == response.commentCreator.creatorId) ? `You tagged your name on the comment in ${projectDetails.projectName} project` : `${name + ' ' + lastName} tagged you on the comment in ${projectDetails.projectName} project`;
                        await NotificationService.adminCommentNotification(message, adminDetails._id, response.commentCreator.creatorId,taskId,response.projectId, { collection: 'ProjectComment', id: response._id });
                    }

                })
            }
            return res.send(Response.projectSuccessResp("Updated Reply successfully", response));
        } catch (err) {
            logger.error(`${err}`)
            return res.send(Response.projectFailResp("Failed add reply", err))
        }
    }
    async deleteReply(req, res) {
        const reuse = new Reuse(req);
        const { firstName: name, lastName: lastName, adminId: Id, _id: userId, orgId: organizationId } = reuse.result.userData?.userData;
        try {
            const replyId = req?.query.replyedId;
            const commentId = req?.query.commentId;
            let count = 0;
            const commentExist = await projectCommentSchema.findOne({ "_id": commentId })
            const isExist = await projectCommentSchema.findOne({ "reply._id": ObjectId(replyId) });
            if (commentExist) {
                let response;
                if (userId == commentExist.commentCreator.creatorId) {
                    if (!commentId) {
                        response = await projectCommentSchema.updateOne({
                            "reply._id": ObjectId(replyId)
                        }, {
                            $pull: {
                                reply: { _id: ObjectId(replyId) }
                            }
                        })
                    } else {
                        response = await projectCommentSchema.updateOne({
                            "reply.commentId": ObjectId(commentId)
                        }, {
                            $pull: {
                                reply: { commentId: commentId }
                            }
                        })
                    }
                }
                if (response.modifiedCount === 1) {
                    return res.send(Response.projectSuccessResp("Reply Deleted successfully", response));
                }
            }
            if (!isExist) {
                return res.send(Response.projectFailResp("Reply is not present please check this Id"))
            } else {
                isExist?.reply.map(ele => {
                    if (userId != ele.replyedUserDetails?.Id) {
                        count++;
                        return count;
                    }
                })
                if (count > 0) {
                    return res.send(Response.projectFailResp("You can't delete reply"))
                }
            }
            const response = await projectCommentSchema.updateOne({
                "reply._id": ObjectId(replyId)
            }, {
                $pull: {
                    reply: { _id: ObjectId(replyId) }
                }
            })
            if (response.modifiedCount === 1) {
                return res.send(Response.projectSuccessResp("Reply Deleted successfully", response));
            } else {
                return res.send(Response.projectFailResp('Reply not found or delete failed'));
            }

        } catch (err) {
            logger.error(`${err}`)
            return res.send(Response.projectFailResp("Failed delete reply", err))
        }

    }
}
export default new CommentReplyService();
