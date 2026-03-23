import { checkCollection, checkData, updateOneByAdmin, updateOneByUser, deleteOneByUser, deleteOneByAdmin, deleteManyByUser, deleteManyByAdmin } from '../../utils/project.utils.js';
import Response from '../../response/response.js';
import logger from '../../resources/logs/logger.log.js';
import MessageValidation from './message.validate.js';
import mongoose from 'mongoose';
import fs from 'fs';
import emoji from 'node-emoji';
import Reuse from '../../utils/reuse.js';
import messageModel from './message.model.js'

/*
If there is any code that can are being used at other places, place them in the reuse.js 
in the utils folder.

the reuse files have the collection names, limit, skip, sort, etc.

To use them create a new object and then use it
e.g.   const reuse = new Reuse(req)
       \\ for group collection name
       reuse.collectionName.project ==> this will give the collection name
*/

class MessageService {
    async getMessages(req, res) {
        const reuse = new Reuse(req);
        logger.info(`result: ${reuse.result}`);
        if (reuse.result.state === true) {
            try {
                const { _id: loggedUserId, isAdmin } = reuse.result?.userData?.userData;
                const chatChannel_id = req.query.chatChannel_id;
                const messageId = req.query.messageId;

                //To check collection is present or not in database
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.chatFailResp(`${reuse.collectionName.user} not present`));

                const projectFields = {
                    _id: 1,
                    content: 1,
                    'sender._id': 1,
                    'sender.email': 1,
                    'sender.profilePic': 1,
                    chatChannel: 1,
                    content: 1,
                    options: 1,
                    question: 1,
                    isReplied: 1,
                    isEdited: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = reuse.collectionName.user;
                }
                // Get All Messages inside specific chatChannel/conversation
                if (chatChannel_id) {
                    // Check if data exist
                    const isDataExist = await checkData(chatChannel_id, db, reuse.collectionName.chatChannel);
                    if (isDataExist === null) {
                        return res.status(400).send(Response.chatFailResp('Chat-channel not found, invalid chatChannel-id'));
                    }
                    const messageSchemaName=`messagemodel`
                    const mesgDb = await checkCollection(messageSchemaName);
                    if (!mesgDb) return res.status(400).send(Response.chatFailResp(`${messageSchemaName} is not present`));
                    const messages = await mesgDb
                        .collection(messageSchemaName)
                        .aggregate([
                            { $match: { chatChannel: chatChannel_id } },
                            { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                            {
                                $lookup: {
                                    from: collectionName,
                                    localField: 'sender',
                                    foreignField: '_id',
                                    as: 'sender',
                                },
                            },
                            {
                                $lookup: {
                                    from: reuse.collectionName.chatChannel,
                                    localField: 'chatChannel',
                                    foreignField: '_id',
                                    as: 'chatChannel',
                                },
                            },
                            { $project: projectFields },
                        ])
                        .toArray();
                    if (reuse.result.type === 'user') {
                        messages[0].chatChannel[0].users.includes(loggedUserId)
                            ? res.status(200).send(Response.chatSuccessResp('Messages fetching successful', messages))
                            : res.status(200).send(Response.chatSuccessResp('You are not allowed to view this record.'));
                    } else {
                        return res.status(200).send(Response.chatSuccessResp('Messages fetching successful', messages));
                    }
                }
                // Get Single Message
                if (messageId) {
                    const isMessageExist = await messageModel.findOne({ _id: ObjectId(messageId) });
                    if (isMessageExist === null) {
                        return res.status(400).send(Response.chatFailResp('Message not found, invalid messageId'));
                    }
                    const messages = await mesgDb
                    .collection(messageSchemaName)
                        .aggregate([
                            { $match: { _id: mongoose.Types.ObjectId(messageId) } },
                            { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                            {
                                $lookup: {
                                    from: collectionName,
                                    localField: 'sender',
                                    foreignField: '_id',
                                    as: 'sender',
                                },
                            },
                            {
                                $lookup: {
                                    from: reuse.collectionName.chatChannel,
                                    localField: 'chatChannel',
                                    foreignField: '_id',
                                    as: 'chatChannel',
                                },
                            },
                            { $project: projectFields },
                        ])
                        .toArray();
                    if (reuse.result.type === 'user') {
                        if (messages[0].createdBy.userId === loggedUserId) {
                            return res.status(200).send(Response.chatSuccessResp('Messages fetching successful', messages));
                        } else {
                            return res.status(200).send(Response.chatSuccessResp('You are not allowed to view this record.'));
                        }
                    } else {
                        return res.status(200).send(Response.chatSuccessResp('Messages fetching successful', messages));
                    }
                }
                // Get All Messages
                if (!chatChannel_id && !messageId) {
                    if (reuse.result.type === 'user') {
                        const channels = await db
                            .collection(reuse.collectionName.chatChannel)
                            .aggregate([{ $match: { users: loggedUserId } }, { $addFields: { _id: { $toString: '$_id' } } }, { $project: { _id: 1 } }])
                            .toArray();
                        const userChannel = [];
                        channels.forEach(key => {
                            userChannel.push(key._id);
                        });
                        const messages =  await mesgDb
                        .collection(messageSchemaName)
                            .aggregate([
                                { $match: { chatChannel: { $in: userChannel } } },
                                { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                                {
                                    $lookup: {
                                        from: collectionName,
                                        localField: 'sender',
                                        foreignField: '_id',
                                        as: 'sender',
                                    },
                                },
                                {
                                    $lookup: {
                                        from: reuse.collectionName.chatChannel,
                                        localField: 'chatChannel',
                                        foreignField: '_id',
                                        as: 'chatChannel',
                                    },
                                },
                                { $project: projectFields },
                            ])
                            .toArray();
                        return res.status(200).send(Response.chatSuccessResp('Messages fetching successful', messages));
                    } else {
                        const messages = await db.collection(reuse.collectionName.message).find({}).toArray();
                        return res.status(200).send(Response.chatSuccessResp('Messages fetching successful', messages));
                    }
                }
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to fetch message, invalid Chat-Id/Message-Id', err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async sendMessage(req, res) {
        const reuse = new Reuse(req);
        logger.info(`result: ${reuse.result}`);
        if (reuse.result.state === true) {
            try {
                const { _id: loggedUserId, isAdmin } = reuse.result.userData.userData;
                const { content, chatChannel_id } = req?.body;
                const { messageId } = req.query;
                const { value, error } = MessageValidation.sendMsg({ content });
                logger.info('Value: ', value);
                logger.error('Error: ', error);
                if (error) return res.status(400).send(Response.validationFailResp('validation failed', error));

                //To check collection is present or not in database
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.chatFailResp(`${reuse.collectionName.user} not present`));

                // Check if data exist
                const isDataExist = await checkData(chatChannel_id, db, reuse.collectionName.chatChannel);
                if (isDataExist === null) {
                    return res.status(400).send(Response.chatFailResp('Chat-channel not found, invalid chatChannel-id'));
                }
                if (messageId) {
                    const isMessageExist = await messageModel.findOne({ _id: ObjectId(messageId) });
                    if (isMessageExist === null) {
                        return res.status(400).send(Response.chatFailResp('Message not found, invalid messageId'));
                    } else {
                        await db.collection(reuse.collectionName.message).findOneAndUpdate({ _id: mongoose.Types.ObjectId(messageId) }, { $set: { isReplied: true } }, { returnDocument: 'after' });
                    }
                }

                const newMessage = {
                    sender: loggedUserId,
                    content: emoji.emojify(content), // Handling content comprising emojis & text
                    chatChannel: chatChannel_id,
                    isReplied: false,
                    isEdited: false,
                    createdBy: {
                        userId: loggedUserId,
                    },
                    createdAt: new Date(),
                };
                const createdMessage = await messageModel.create(newMessage);
                const project = {
                    _id: 1,
                    'sender._id': 1,
                    'sender.email': 1,
                    'sender.profilePic': 1,
                    content: 1,
                    chatChannel: 1,
                    isReplied: 1,
                    isEdited: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = reuse.collectionName.user;
                }
                const messageSchemaName=`messagemodel`
                const mesgDb = await checkCollection(messageSchemaName);
                if (!mesgDb) return res.status(400).send(Response.chatFailResp(`${messageSchemaName} is not present`));
                const messages = await mesgDb
                    .collection(messageSchemaName)
                    .aggregate([
                        { $match: { _id: createdMessage.insertedId } },
                        { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'sender',
                            },
                        },
                        {
                            $lookup: {
                                from: reuse.collectionName.chatChannel,
                                localField: 'chatChannel',
                                foreignField: '_id',
                                as: 'chatChannel',
                            },
                        },
                        { $project: project },
                    ])
                    .toArray();

                await db
                    .collection(reuse.collectionName.chatChannel)
                    .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $set: { latestMessage: createdMessage.insertedId.toString() } }, { returnDocument: 'after' });
                return res.status(200).send(Response.chatSuccessResp(messageId ? 'Message Replied' : 'Message Sended', messages));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to Send Message, Invalid chatChannel_id/messageId', err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async editMessage(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { _id: loggedUserId } = result?.userData?.userData;
                const { messageId, content } = req.body;
                const updateMsg = {
                    content: content,
                    isEdited: true,
                };
                const isMessageExist = await messageModel.findOne({ _id: ObjectId(messageId) });
                if (isMessageExist === null) {
                    return res.status(400).send(Response.chatFailResp('Message not found, invalid messageId'));
                }

                let editedMsg;
                if (result.type === 'user') {
                    editedMsg = await updateOneByUser(messageId, loggedUserId,messageModel, updateMsg);
                    if (!editedMsg) return res.send(Response.chatFailResp(`You are not allowed to update this record`));
                } else {
                    //query to update the record based on given id and data
                    editedMsg = await updateOneByAdmin(messageId, messageModel, updateMsg);
                }
                return res.status(200).send(Response.chatSuccessResp('Message edited..', editedMsg.value));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to edit message, invalid messageId'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async deleteMessage(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { _id } = result?.userData?.userData;
                const { messageId } = req?.body;
                const { chatChannel_id } = req?.query;
                const messageCollectionName = `messagemodel`;
                const db = await checkCollection(messageCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${messageCollectionName} not present`));

                // Delete all messages inside a chatChannel/conversation
                let deleteConversation;
                if (chatChannel_id) {
                    if (result.type === 'user') {
                        let deleteAll = await messageModel.deleteMany({ chatChannel: chatChannel_id,'createdBy.userId':userId });
                        if (deleteAll.deletedCount === 0) return res.send(Response.chatFailResp(`Invalid chatChannel id. You are not allowed to delete this record`));
                    } else {
                        deleteConversation =await messageModel.deleteMany({ chatChannel: chatChannel_id });
                        if (deleteConversation.deletedCount === 0) {
                            return res.status(200).send(Response.chatFailResp('Failed to delete message, invalid chatChannel-id', deleteConversation));
                        }
                    }
                    return res.status(200).send(Response.chatSuccessResp('All Messages/Conversation deleted for the chatChannel', deleteConversation));
                }

                // Delete selected message
                let deletedMsg,
                    deleteCount = 0;
                if (result.type === 'user') {
                    for (let ids of messageId) {
                        deletedMsg= await messageModel.deleteOne({ _id: ObjectId(ids), 'createdBy.userId': _id });
                        if (deletedMsg.deletedCount === 0) {
                            return res.send(Response.chatFailResp(`${deleteCount} messages deleted & messageId ${ids} is either invalid or You are not allowed to delete this record`));
                        }
                        deleteCount++;
                    }
                } else {
                    for (let ids of messageId) {
                        deletedMsg= await messageModel.deleteOne({ _id: ObjectId(ids) });
                        
                        if (deletedMsg.deletedCount === 0) {
                            return res.status(400).send(Response.chatFailResp(`${deleteCount} messages deleted & Invalid messageId ${ids}`));
                        }
                        deleteCount++;
                    }
                }

                // Delete uploaded file too
                if (deletedMsg?.value?.content.includes('uploads'))
                    fs.unlink(`./assets/${deletedMsg.value.content}`, function (err) {
                        if (err) return res.status(400).send(Response.chatFailResp('File not found'));
                        else {
                            return res.status(200).send(Response.chatSuccessResp('Deleted selected file'));
                        }
                    });

                return res.status(200).send(Response.chatSuccessResp('Selected Messages deleted'));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to delete message, invalid message-id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async forwardMessage(req, res) {
        const reuse = new Reuse(req);
        logger.info(`result: ${reuse.result}`);
        if (reuse.result.state === true) {
            try {
                const { _id: loggedUserId } = reuse.result.userData.userData;
                const { forwardTo } = req?.body;
                const { messageId } = req.query;

                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.chatFailResp(`${reuse.collectionName.user} not present`));

                const isMessageExist = await messageModel.findOne({ _id: ObjectId(messageId) });
                if (isMessageExist === null) {
                    return res.status(400).send(Response.chatFailResp('Message not found, invalid messageId'));
                }
                for (const ids of forwardTo) {
                    const isChatExist = await db.collection(reuse.collectionName.chatChannel).findOne({ _id: mongoose.Types.ObjectId(ids) });
                    if (!isChatExist) return res.send(Response.chatFailResp('Chat not found, invalid chatChannel-channel id'));
                }

                if (forwardTo.length) {
                    for (const chatChannel_id of forwardTo) {
                        const forwardMsg = {
                            sender: loggedUserId,
                            content: isMessage.content,
                            chatChannel: chatChannel_id,
                            isForwarded: true,
                            isReplied: isMessage.isReplied,
                            isEdited: isMessage.isEdited,
                            createdBy: {
                                userId: loggedUserId,
                            },
                            createdAt: new Date(),
                        };
                        const forwardedMessage = await messageModel.craete(forwardMsg);
                        await db
                            .collection(reuse.collectionName.chatChannel)
                            .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $set: { latestMessage: forwardedMessage.insertedId.toString() } }, { returnDocument: 'after' });
                    }
                }
                return res.status(200).send(Response.chatSuccessResp('Message Forwarded successfully'));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to Send Message, Invalid chatChannel-channel-id/message-id', err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async uploadFiles(req, res) {
        const reuse = new Reuse(req);
        if (reuse.result.state === true) {
            try {
                const { chatChannel_id } = req?.query;
                const loggedUserId = reuse.result.userData.userData._id;

                // Get files info
                const { uploaded_arry, failed_arry } = req;
                const data = {
                    message: `${uploaded_arry.length} files Uploaded, ${failed_arry.length} failed`,
                    failedData: failed_arry,
                };
                //To check collection is present or not in database
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.chatFailResp(`${reuse.collectionName.user} not present`));

                const isChatExist = await db.collection(reuse.collectionName.chatChannel).findOne({ _id: mongoose.Types.ObjectId(chatChannel_id) });
                if (!isChatExist) return res.send(Response.chatFailResp('Chat not found, invalid chatChannel-id'));

                let createdMessage;
                if (uploaded_arry.length) {
                    for (let item of uploaded_arry) {
                        const fileUrl = `${item.path.substr(6)}`;
                        const content = fileUrl.replaceAll('\\', '/');
                        const newMessage = {
                            sender: loggedUserId,
                            content: content,
                            chatChannel: chatChannel_id,
                            createdAt: new Date(),
                        };
                        createdMessage = await messageModel.create(newMessage);
                    }
                } else {
                    return res.status(400).send(Response.chatFailResp('Failed Upload. Invalid Files', data.failedData));
                }
                const project = {
                    _id: 1,
                    'sender._id': 1,
                    'sender.email': 1,
                    'sender.profilePic': 1,
                    content: 1,
                    chatChannel: 1,
                    isEdited: 1,
                    isReplied: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                const messageSchemaName=`messagemodel`
                    const mesgDb = await checkCollection(messageSchemaName);
                    if (!mesgDb) return res.status(400).send(Response.chatFailResp(`${messageSchemaName} is not present`));
                const messages = await mesgDb
                    .collection(messageSchemaName)
                    .aggregate([
                        { $match: { _id: createdMessage.insertedId } },
                        { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                        {
                            $lookup: {
                                from: reuse.collectionName.user,
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'sender',
                            },
                        },
                        {
                            $lookup: {
                                from: reuse.collectionName.chatChannel,
                                localField: 'chatChannel',
                                foreignField: '_id',
                                as: 'chatChannel',
                            },
                        },
                        { $project: project },
                    ])
                    .toArray();

                await db
                    .collection(reuse.collectionName.chatChannel)
                    .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $set: { latestMessage: createdMessage.insertedId.toString() } }, { returnDocument: 'after' });
                return res.status(200).send(Response.chatSuccessResp(data, messages));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed Upload. Invalid Files', err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async createPoll(req, res) {
        const reuse = new Reuse(req);
        logger.info(`result: ${reuse.result}`);
        if (reuse.result.state === true) {
            try {
                const { _id: loggedUserId, isAdmin } = reuse.result.userData.userData;
                const { question } = req?.body;
                const { chatChannel_id, options } = req?.query;
                const { value, error } = MessageValidation.addPoll({ question, options });
                logger.info('Value: ', value);
                logger.error('Error: ', error);
                if (error) return res.status(400).send(Response.validationFailResp('validation failed', error));

                //To check collection is present or not in database
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.chatFailResp(`${reuse.collectionName.user} not present`));

                // Check if data exist
                const isDataExist = await checkData(chatChannel_id, db, reuse.collectionName.chatChannel);
                if (isDataExist === null) {
                    return res.status(400).send(Response.chatFailResp('Chat-channel not found, invalid chatChannel-id'));
                }
                // Poll Options as key-value pair
                let option = [];
                const arr = options.split(',');
                for (let keys of arr) {
                    if (keys !== 'undefined') option.push({ text: keys, voted: [] });
                }
                const newPoll = {
                    sender: loggedUserId,
                    content: 'poll',
                    question: question,
                    options: option,
                    isVoted: false,
                    chatChannel: chatChannel_id,
                    createdBy: {
                        userId: loggedUserId,
                    },
                    createdAt: new Date(),
                };

                const createdPoll = await messageModel.create(newPoll);
                const project = {
                    _id: 1,
                    'sender._id': 1,
                    'sender.email': 1,
                    'sender.profilePic': 1,
                    content: 1,
                    question: 1,
                    options: 1,
                    isVoted: 1,
                    chatChannel: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = reuse.collectionName.user;
                }
                const messageSchemaName=`messagemodel`
                const mesgDb = await checkCollection(messageSchemaName);
                if (!mesgDb) return res.status(400).send(Response.chatFailResp(`${messageSchemaName} is not present`));
                const poll = await mesgDb
                    .collection(messageSchemaName)
                    .aggregate([
                        { $match: { _id: createdPoll.insertedId } },
                        { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'sender',
                            },
                        },
                        {
                            $lookup: {
                                from: reuse.collectionName.chatChannel,
                                localField: 'chatChannel',
                                foreignField: '_id',
                                as: 'chatChannel',
                            },
                        },
                        { $project: project },
                    ])
                    .toArray();

                await db
                    .collection(reuse.collectionName.chatChannel)
                    .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $set: { latestMessage: createdPoll.insertedId.toString() } }, { returnDocument: 'after' });
                return res.status(200).send(Response.chatSuccessResp('Poll created successfully', poll));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to create poll, Invalid chatChannel-channel-id/user-id', err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }

    async votePoll(req, res) {
        const reuse = new Reuse(req);
        logger.info(`result: ${reuse.result}`);
        if (reuse.result.state === true) {
            try {
                const { _id: loggedUserId, isAdmin } = reuse.result.userData.userData;
                const { messageId } = req?.query;
                const { selectedOption } = req?.body;
                //To check collection is present or not in database
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(reuse.collectionName.user);
                if (!db) return res.status(400).send(Response.chatFailResp(`${reuse.collectionName.user} not present`));

                const isMessageExist = await messageModel.findOne({ _id: ObjectId(messageId) });
                if (isMessageExist === null) {
                    return res.status(400).send(Response.chatFailResp('Message not found, invalid messageId'));
                }

                // Check if already voted
                if (isMessageExist.isVoted === true) return res.status(400).send(Response.chatFailResp('You already voted to this poll'));

                // Check for valid selected option and add vote
                let option = isMessageExist.options;
                let errCount = null;
                for (const key of option) {
                    if (key.text != selectedOption) errCount += 1;
                }
                if (errCount === option.length) return res.status(400).send(Response.chatFailResp('Invalid. Please select a valid option.'));

                // Add userId as a vote for the selected option in poll message
                for (const key of option) {
                    if (key.text === selectedOption) {
                        key.voted.push(loggedUserId);
                    } else {
                        continue;
                    }
                }

                let votedPoll;
                if (reuse.result.type === 'user') {
                    votedPoll = await updateOneByUser(messageId, loggedUserId, messageModel, { options: option, isVoted: true });
                    if (!votedPoll) return res.send(Response.chatFailResp(`You are not allowed to update this record`));
                } else {
                    votedPoll = await updateOneByAdmin(messageId, db, messageModel, { options: option, isVoted: true });
                }
                const project = {
                    _id: 1,
                    'sender._id': 1,
                    'sender.email': 1,
                    'sender.profilePic': 1,
                    content: 1,
                    question: 1,
                    options: 1,
                    chatChannel: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = reuse.collectionName.user;
                }
                const messageSchemaName=`messagemodel`
                const mesgDb = await checkCollection(messageSchemaName);
                if (!mesgDb) return res.status(400).send(Response.chatFailResp(`${messageSchemaName} is not present`));
                const poll = await  mesgDb
                    .collection(messageSchemaName)
                    .aggregate([
                        { $match: { _id: votedPoll.value._id } },
                        { $addFields: { sender: { $toObjectId: '$sender' }, chatChannel: { $toObjectId: '$chatChannel' } } },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'sender',
                                foreignField: '_id',
                                as: 'sender',
                            },
                        },
                        {
                            $lookup: {
                                from: reuse.collectionName.chatChannel,
                                localField: 'chatChannel',
                                foreignField: '_id',
                                as: 'chatChannel',
                            },
                        },
                        { $project: project },
                    ])
                    .toArray();

                await db
                    .collection(reuse.collectionName.chatChannel)
                    .findOneAndUpdate({ _id: mongoose.Types.ObjectId(isMessageExist.chatChannel) }, { $set: { latestMessage: votedPoll.value._id.toString() } }, { returnDocument: 'after' });
                return res.status(200).send(Response.chatSuccessResp('Added Vote in Poll successfully', poll));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to add vote, invalid selected option', err));
            }
        } else {
            return res.status(400).send(reuse.result);
        }
    }
}

export default new MessageService();
