import { checkCollection, checkData, updateOneByUser, updateOneByAdmin, deleteOneByAdmin, deleteOneByUser } from '../../utils/project.utils.js';
import Response from '../../response/response.js';
import ChatValidation from './chatChannel.validate.js';
import logger from '../../resources/logs/logger.log.js';
import adminSchema from '../admin/admin.model.js';
import mongoose from 'mongoose';

class ChatService {
    // Read Chats ------------
    async privateChatChannel(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { userId } = req.body;
                const { _id: loggedUserId, isAdmin, adminId, orgId } = result?.userData?.userData;

                // Check collection present or not
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const messageCollectionName = `org_${orgId.toLowerCase()}_messages`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';

                const db = await checkCollection(userCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${userCollectionName} not present`));

                let chatChannel, isChatChannel, addedChatChannel, projectFields;
                projectFields = {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                    latestMessage: 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                if (isAdmin === true) {
                    chatChannel = {
                        chatName: 'private',
                        isGroupChat: false,
                        admin: loggedUserId,
                        users: [userId],
                        createdBy: {
                            userId: loggedUserId,
                        },
                        createdAt: new Date(),
                    };
                    isChatChannel = await db.collection(chatChannelCollection).findOne({
                        isGroupChat: false,
                        admin: loggedUserId.toString(),
                        users: { $elemMatch: { $eq: userId } },
                    });
                    addedChatChannel = await db
                        .collection(chatChannelCollection)
                        .aggregate([
                            {
                                $match: {
                                    isGroupChat: false,
                                    admin: loggedUserId.toString(),
                                    users: { $elemMatch: { $eq: userId } },
                                },
                            },
                            { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } }, latestMessage: { $toObjectId: '$latestMessage' }, admin: { $toObjectId: '$admin' } } },
                            {
                                $lookup: {
                                    from: adminCollectionName,
                                    localField: 'admin',
                                    foreignField: '_id',
                                    as: 'admin',
                                },
                            },
                            {
                                $lookup: {
                                    from: userCollectionName,
                                    localField: 'users',
                                    foreignField: '_id',
                                    as: 'users',
                                },
                            },
                            {
                                $lookup: {
                                    from: messageCollectionName,
                                    localField: 'latestMessage',
                                    foreignField: '_id',
                                    as: 'latestMessage',
                                },
                            },
                            { $project: projectFields },
                        ])
                        .toArray();
                } else {
                    chatChannel = {
                        chatName: 'private',
                        isGroupChat: false,
                        admin: userId === adminId ? userId : null,
                        users: userId === adminId ? [loggedUserId] : [loggedUserId, userId],
                        createdBy: {
                            userId: loggedUserId,
                        },
                        createdAt: new Date(),
                    };
                    if (userId === adminId) {
                        isChatChannel = await db.collection(chatChannelCollection).findOne({
                            isGroupChat: false,
                            admin: userId,
                            users: { $elemMatch: { $eq: loggedUserId } },
                        });
                        addedChatChannel = await db
                            .collection(chatChannelCollection)
                            .aggregate([
                                {
                                    $match: {
                                        isGroupChat: false,
                                        admin: userId,
                                        users: { $elemMatch: { $eq: loggedUserId } },
                                    },
                                },
                                {
                                    $addFields: {
                                        users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } },
                                        latestMessage: { $toObjectId: '$latestMessage' },
                                        admin: { $toObjectId: '$admin' },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: adminCollectionName,
                                        localField: 'admin',
                                        foreignField: '_id',
                                        as: 'admin',
                                    },
                                },
                                {
                                    $lookup: {
                                        from: userCollectionName,
                                        localField: 'users',
                                        foreignField: '_id',
                                        as: 'users',
                                    },
                                },
                                {
                                    $lookup: {
                                        from: messageCollectionName,
                                        localField: 'latestMessage',
                                        foreignField: '_id',
                                        as: 'latestMessage',
                                    },
                                },
                                { $project: projectFields },
                            ])
                            .toArray();
                    } else {
                        isChatChannel = await db.collection(chatChannelCollection).findOne({
                            isGroupChat: false,
                            $and: [{ users: { $elemMatch: { $eq: loggedUserId } } }, { users: { $elemMatch: { $eq: userId } } }],
                        });
                        addedChatChannel = await db
                            .collection(chatChannelCollection)
                            .aggregate([
                                {
                                    $match: {
                                        isGroupChat: false,
                                        $and: [{ users: { $elemMatch: { $eq: loggedUserId } } }, { users: { $elemMatch: { $eq: userId } } }],
                                    },
                                },
                                {
                                    $addFields: {
                                        users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } },
                                        latestMessage: { $toObjectId: '$latestMessage' },
                                        admin: { $toObjectId: '$admin' },
                                    },
                                },
                                {
                                    $lookup: {
                                        from: adminCollectionName,
                                        localField: 'admin',
                                        foreignField: '_id',
                                        as: 'admin',
                                    },
                                },
                                {
                                    $lookup: {
                                        from: userCollectionName,
                                        localField: 'users',
                                        foreignField: '_id',
                                        as: 'users',
                                    },
                                },
                                {
                                    $lookup: {
                                        from: messageCollectionName,
                                        localField: 'latestMessage',
                                        foreignField: '_id',
                                        as: 'latestMessage',
                                    },
                                },
                                { $project: projectFields },
                            ])
                            .toArray();
                    }
                }
                // Check if Chat-channel already created, if not create it.
                if (isChatChannel) {
                    return res.status(400).send(Response.chatFailResp('Chat-Channel already created', addedChatChannel));
                } else {
                    const createdChatChannel = await db.collection(chatChannelCollection).insertOne(chatChannel);
                    // Send info joining the collections
                    const projectFields = {
                        _id: 1,
                        chatName: 1,
                        isGroupChat: 1,
                        'admin._id': 1,
                        'admin.firstName': 1,
                        'admin.lastName': 1,
                        'admin.profilePic': 1,
                        'users._id': 1,
                        'users.firstName': 1,
                        'users.lastName': 1,
                        'users.profilePic': 1,
                        latestMessage: 1,
                        createdBy: 1,
                        createdAt: 1,
                        updatedAt: 1,
                    };
                    const addedChatChannel = await db
                        .collection(chatChannelCollection)
                        .aggregate([
                            { $match: { _id: createdChatChannel.insertedId } },
                            { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } }, admin: { $toObjectId: '$admin' }, latestMessage: { $toObjectId: '$latestMessage' } } },
                            {
                                $lookup: {
                                    from: adminCollectionName,
                                    localField: 'admin',
                                    foreignField: '_id',
                                    as: 'admin',
                                },
                            },
                            {
                                $lookup: {
                                    from: userCollectionName,
                                    localField: 'users',
                                    foreignField: '_id',
                                    as: 'users',
                                },
                            },
                            {
                                $lookup: {
                                    from: messageCollectionName,
                                    localField: 'latestMessage',
                                    foreignField: '_id',
                                    as: 'latestMessage',
                                },
                            },
                            { $project: projectFields },
                        ])
                        .toArray();
                    return res.status(200).send(Response.chatSuccessResp('Chat-channel Created', addedChatChannel));
                }
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to create the chat-channel, invalid User/Admin Id passed'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async fetchChatChannel(req, res) {
        const result = req.verified;
        logger.info(`result: ${result}`);
        if (result.state === true) {
            try {
                const { _id: loggedUserId, orgId } = result.userData.userData;

                //To check collection is present or not in database
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const messageCollectionName = `org_${orgId.toLowerCase()}_messages`;
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(userCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${userCollectionName} not present`));

                // Send info joining the collections
                const projectFields = {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                    latestMessage: 1,
                    'groupAdmin._id': 1,
                    'groupAdmin.firstName': 1,
                    'groupAdmin.lastName': 1,
                    'groupAdmin.profilePic': 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let chats;
                if (result.type === 'user') {
                    chats = await db
                        .collection(chatChannelCollection)
                        .aggregate([
                            { $match: { users: { $in: [loggedUserId] } } },
                            {
                                $addFields: {
                                    users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } },
                                    admin: { $toObjectId: '$admin' },
                                    latestMessage: { $toObjectId: '$latestMessage' },
                                    groupAdmin: { $toObjectId: '$groupAdmin' },
                                },
                            },
                            {
                                $lookup: {
                                    from: adminCollectionName,
                                    localField: 'admin',
                                    foreignField: '_id',
                                    as: 'admin',
                                },
                            },
                            {
                                $lookup: {
                                    from: userCollectionName,
                                    localField: 'users',
                                    foreignField: '_id',
                                    as: 'users',
                                },
                            },
                            {
                                $lookup: {
                                    from: messageCollectionName,
                                    localField: 'latestMessage',
                                    foreignField: '_id',
                                    as: 'latestMessage',
                                },
                            },
                            {
                                $lookup: {
                                    from: userCollectionName,
                                    localField: 'groupAdmin',
                                    foreignField: '_id',
                                    as: 'groupAdmin',
                                },
                            },
                            { $project: projectFields },
                        ])
                        .toArray();
                } else {
                    chats = await db
                        .collection(chatChannelCollection)
                        .aggregate([
                            { $match: { admin: loggedUserId.toString() } },
                            {
                                $addFields: {
                                    users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } },
                                    admin: { $toObjectId: '$admin' },
                                    latestMessage: { $toObjectId: '$latestMessage' },
                                    groupAdmin: { $toObjectId: '$groupAdmin' },
                                },
                            },
                            {
                                $lookup: {
                                    from: adminCollectionName,
                                    localField: 'admin',
                                    foreignField: '_id',
                                    as: 'admin',
                                },
                            },
                            {
                                $lookup: {
                                    from: userCollectionName,
                                    localField: 'users',
                                    foreignField: '_id',
                                    as: 'users',
                                },
                            },
                            {
                                $lookup: {
                                    from: messageCollectionName,
                                    localField: 'latestMessage',
                                    foreignField: '_id',
                                    as: 'latestMessage',
                                },
                            },
                            {
                                $lookup: {
                                    from: userCollectionName,
                                    localField: 'groupAdmin',
                                    foreignField: '_id',
                                    as: 'groupAdmin',
                                },
                            },
                            { $project: projectFields },
                        ])
                        .toArray();
                }

                return res.status(200).send(Response.chatSuccessResp('Chat-Channels fetching successful', chats));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to fetch chat-channel', err));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async groupChatChannel(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { chatName, users, groupLogo } = req.body;
                const { _id: loggedUserId, isAdmin, orgId } = result.userData.userData;
                const { value, error } = ChatValidation.createGroup({ chatName, users });
                logger.info('Value: ', value);
                logger.error('Error: ', error);
                if (error) return res.status(400).send(Response.validationFailResp('validation failed', error));

                // Adding Users & Group Name
                if (users.length < 2) {
                    return res.send(Response.chatFailResp('More than 2 users are required to form a group chat'));
                }

                // Check collection & insert data
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(userCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${userCollectionName} not present`));

                for (let id of users) {
                    const userFind = await db.collection(userCollectionName).findOne({ _id: mongoose.Types.ObjectId(id) });
                    if (!userFind) return res.send(Response.chatFailResp('User not found, invalid id'));
                }
                users.push(loggedUserId);

                if (isAdmin === true) {
                    var groupChatChannel = {
                        chatName: chatName,
                        admin: loggedUserId,
                        users: users,
                        isGroupChat: true,
                        groupLogo: groupLogo,
                        groupAdmin: loggedUserId,
                        createdBy: {
                            userId: loggedUserId,
                        },
                        createdAt: new Date(),
                    };
                } else {
                    var groupChatChannel = {
                        chatName: chatName,
                        users: users,
                        isGroupChat: true,
                        groupLogo: groupLogo,
                        groupAdmin: loggedUserId,
                        createdBy: {
                            userId: loggedUserId,
                        },
                        createdAt: new Date(),
                    };
                }

                const createdChatChannel = await db.collection(chatChannelCollection).insertOne(groupChatChannel);
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = userCollectionName;
                }
                // Send info joining the collections
                const projectFields = {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                    'groupAdmin._id': 1,
                    'groupAdmin.firstName': 1,
                    'admin.lastName': 1,
                    'groupAdmin.profilePic': 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                const addedChat = await db
                    .collection(chatChannelCollection)
                    .aggregate([
                        { $match: { _id: createdChatChannel.insertedId } },

                        { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } }, admin: { $toObjectId: '$admin' }, groupAdmin: { $toObjectId: '$groupAdmin' } } },
                        {
                            $lookup: {
                                from: adminCollectionName,
                                localField: 'admin',
                                foreignField: '_id',
                                as: 'admin',
                            },
                        },
                        {
                            $lookup: {
                                from: userCollectionName,
                                localField: 'users',
                                foreignField: '_id',
                                as: 'users',
                            },
                        },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'groupAdmin',
                                foreignField: '_id',
                                as: 'groupAdmin',
                            },
                        },
                        { $project: projectFields },
                    ])
                    .toArray();
                return res.status(200).send(Response.chatSuccessResp('Group Chat-Channel Created', addedChat));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to create Group, invalid User Id passed'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async groupMembers(req, res) {
        const result = req.verified;
        const { orgId } = result?.userData?.userData;
        if (result.state === true) {
            try {
                const { chatChannel_id } = req.query;
                // Check collection is present or not
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(userCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${userCollectionName} not present`));
                const projectFields = {
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                };
                const members = await db
                    .collection(chatChannelCollection)
                    .aggregate([
                        { $match: { _id: mongoose.Types.ObjectId(chatChannel_id) } },
                        { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } } } },
                        {
                            $lookup: {
                                from: adminCollectionName,
                                localField: 'admin',
                                foreignField: '_id',
                                as: 'admin',
                            },
                        },
                        {
                            $lookup: {
                                from: userCollectionName,
                                localField: 'users',
                                foreignField: '_id',
                                as: 'users',
                            },
                        },
                        { $project: projectFields },
                    ])
                    .toArray();
                return res.status(200).send(Response.chatSuccessResp('Group Members fetched', members));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to fetch members, invalid chat id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async deleteChatChannel(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { _id, orgId } = result?.userData?.userData;
                const { chatChannel_id } = req.query;

                // Check collection & remove the chatChannel
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const db = await checkCollection(chatChannelCollection);
                if (!db) return res.status(400).send(Response.chatFailResp(`${chatChannelCollection} not present`));

                // Check if data exist, then delete
                const isDataExist = await checkData(chatChannel_id, db, chatChannelCollection);
                if (isDataExist === null) {
                    return res.status(400).send(Response.chatFailResp('Failed to delete chat-channel, invalid chatChannel id'));
                }
                let removed, deleted;
                if (isDataExist?.users.includes(_id.toString()) === true) {
                    // Remove user from chat-channel
                    removed = await db
                        .collection(chatChannelCollection)
                        .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $pull: { users: _id.toString() } }, { returnDocument: 'after' });

                    // Remove chat-channel when no users present
                    if (removed?.value?.users?.length === 0) {
                        deleted = await db.collection(chatChannelCollection).findOneAndDelete({ _id: mongoose.Types.ObjectId(chatChannel_id), 'createdBy.userId': _id.toString() });
                        deleted.value === null
                            ? res.status(400).send(Response.chatFailResp(`You are removed from chat-channel successfully. But, you aren't allowed to delete this record.`))
                            : res.status(200).send(Response.notificationFailResp('Deleted chat-channel', deleted));
                    } else {
                        return res.status(400).send(Response.notificationFailResp(`Removed this chat-channel for you`));
                    }
                } else {
                    res.status(400).send(Response.chatFailResp('Invalid. User not a part of this chat-channel'));
                }
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to delete chat-channel, invalid chatChannel id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async renameGroup(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { _id, orgId } = result?.userData?.userData;
                const { chatName, chatChannel_id } = req.body;
                const { value, error } = ChatValidation.renameGroup({ chatName });
                logger.info('Value: ', value);
                logger.error('Error: ', error);
                if (error) return res.status(400).send(Response.validationFailResp('validation failed', error));
                // Check collection & update data
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(userCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${userCollectionName} not present`));

                // Check if data exist, then update
                const isDataExist = await checkData(chatChannel_id, db, chatChannelCollection);
                if (isDataExist === null) {
                    return res.status(404).json(Response.chatFailResp('No group chat exist with this chatChannel id'));
                }
                let updated, collectionName;
                if (result.type === 'user') {
                    collectionName = userCollectionName;
                    updated = await updateOneByUser(chatChannel_id, _id, db, chatChannelCollection, value);
                    if (!updated) return res.send(Response.chatFailResp(`You are not allowed to delete this record`));
                } else {
                    collectionName = adminCollectionName;
                    //query to delete the record based on given id and data
                    updated = await updateOneByAdmin(chatChannel_id, db, chatChannelCollection, value);
                }
                const projectFields = {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                    'groupAdmin._id': 1,
                    'groupAdmin.firstName': 1,
                    'admin.lastName': 1,
                    'groupAdmin.profilePic': 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                const updatedData = await db
                    .collection(chatChannelCollection)
                    .aggregate([
                        { $match: { _id: updated.value._id } },
                        { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } }, admin: { $toObjectId: '$admin' }, groupAdmin: { $toObjectId: '$groupAdmin' } } },
                        {
                            $lookup: {
                                from: adminCollectionName,
                                localField: 'admin',
                                foreignField: '_id',
                                as: 'admin',
                            },
                        },
                        {
                            $lookup: {
                                from: userCollectionName,
                                localField: 'users',
                                foreignField: '_id',
                                as: 'users',
                            },
                        },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'groupAdmin',
                                foreignField: '_id',
                                as: 'groupAdmin',
                            },
                        },
                        { $project: projectFields },
                    ])
                    .toArray();
                return res.status(200).send(Response.chatSuccessResp('Group Name Updated', updatedData));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to rename Group, invalid chat id'));
            }
        } else {
            return res.status(400).send(result);
        }
    }

    async removeFromGroup(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { _id, isAdmin, orgId } = result?.userData?.userData;
                const { chatChannel_id, userId } = req.body;
                // Check collection
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(chatChannelCollection);
                if (!db) return res.status(400).send(Response.chatFailResp(`${chatChannelCollection} not present`));

                // Check if data exist
                const isDataExist = await checkData(chatChannel_id, db, chatChannelCollection);
                if (isDataExist === null) {
                    return res.status(404).json(Response.chatFailResp('No group chat exist with this chatChannel id'));
                }
                if (isDataExist.users.includes(userId) === false) return res.status(404).json(Response.chatFailResp('Invalid User-Id passed'));

                // Remove the user
                let removed;
                if (result.type === 'user') {
                    removed = await db
                        .collection(chatChannelCollection)
                        .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id), 'createdBy.userId': _id }, { $pull: { users: userId } }, { returnDocument: 'after' });
                    if (removed.value === null) return res.status(404).json(Response.chatFailResp('You are not allowed to delete this record'));
                } else {
                    removed = await db.collection(chatChannelCollection).findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $pull: { users: userId } }, { returnDocument: 'after' });
                }

                const projectFields = {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                    'groupAdmin._id': 1,
                    'groupAdmin.firstName': 1,
                    'admin.lastName': 1,
                    'groupAdmin.profilePic': 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = userCollectionName;
                }
                const removedUser = await db
                    .collection(chatChannelCollection)
                    .aggregate([
                        { $match: { _id: removed.value._id } },
                        { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } }, admin: { $toObjectId: '$admin' }, groupAdmin: { $toObjectId: '$groupAdmin' } } },
                        {
                            $lookup: {
                                from: adminCollectionName,
                                localField: 'admin',
                                foreignField: '_id',
                                as: 'admin',
                            },
                        },
                        {
                            $lookup: {
                                from: userCollectionName,
                                localField: 'users',
                                foreignField: '_id',
                                as: 'users',
                            },
                        },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'groupAdmin',
                                foreignField: '_id',
                                as: 'groupAdmin',
                            },
                        },
                        { $project: projectFields },
                    ])
                    .toArray();
                return res.status(200).send(Response.chatSuccessResp('User Removed from group', removedUser));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to Remove User, invalid chat id', err));
            }
        } else {
            return res.status(400).send(result);
        }
    }
    async addToGroup(req, res) {
        const result = req.verified;
        if (result.state === true) {
            try {
                const { _id, isAdmin, orgId } = result?.userData?.userData;
                const { chatChannel_id, userId } = req.body;
                // Check collection & add user
                const chatChannelCollection = `org_${orgId.toLowerCase()}_chatchannels`;
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const adminCollectionName = 'adminschemas';
                const db = await checkCollection(chatChannelCollection);
                if (!db) return res.status(400).send(Response.chatFailResp(`${chatChannelCollection} not present`));

                // Check if data exist
                const isDataExist = await checkData(chatChannel_id, db, chatChannelCollection);
                if (isDataExist === null) {
                    return res.status(404).json(Response.chatFailResp('No group chat exist with this chatChannel id'));
                }
                if (isDataExist.users.includes(userId) === false) return res.status(404).json(Response.chatFailResp('Invalid User-Id passed'));

                // Add the user
                let add;
                if (result.type === 'user') {
                    add = await db
                        .collection(chatChannelCollection)
                        .findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id), 'createdBy.userId': _id }, { $push: { users: userId } }, { returnDocument: 'after' });
                    if (add.value === null) res.status(404).json(Response.chatFailResp('You are not allowed to delete this record'));
                } else {
                    add = await db.collection(chatChannelCollection).findOneAndUpdate({ _id: mongoose.Types.ObjectId(chatChannel_id) }, { $push: { users: userId } }, { returnDocument: 'after' });
                }

                const projectFields = {
                    _id: 1,
                    chatName: 1,
                    isGroupChat: 1,
                    'admin._id': 1,
                    'admin.firstName': 1,
                    'admin.lastName': 1,
                    'admin.profilePic': 1,
                    'users._id': 1,
                    'users.firstName': 1,
                    'users.lastName': 1,
                    'users.profilePic': 1,
                    'groupAdmin._id': 1,
                    'groupAdmin.firstName': 1,
                    'admin.lastName': 1,
                    'groupAdmin.profilePic': 1,
                    createdBy: 1,
                    createdAt: 1,
                    updatedAt: 1,
                };
                let collectionName;
                if (isAdmin === true) {
                    collectionName = adminCollectionName;
                } else {
                    collectionName = userCollectionName;
                }
                const addedUser = await db
                    .collection(chatChannelCollection)
                    .aggregate([
                        { $match: { _id: add.value._id } },
                        { $addFields: { users: { $map: { input: '$users', in: { $toObjectId: '$$this' } } }, admin: { $toObjectId: '$admin' }, groupAdmin: { $toObjectId: '$groupAdmin' } } },
                        {
                            $lookup: {
                                from: adminCollectionName,
                                localField: 'admin',
                                foreignField: '_id',
                                as: 'admin',
                            },
                        },
                        {
                            $lookup: {
                                from: userCollectionName,
                                localField: 'users',
                                foreignField: '_id',
                                as: 'users',
                            },
                        },
                        {
                            $lookup: {
                                from: collectionName,
                                localField: 'groupAdmin',
                                foreignField: '_id',
                                as: 'groupAdmin',
                            },
                        },
                        { $project: projectFields },
                    ])
                    .toArray();
                return res.status(200).send(Response.chatSuccessResp('User Added to Group', addedUser));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to Add User, invalid chatChannel_id', err));
            }
        } else {
            return res.status(400).send(result);
        }
    }
    async fetchUsers(req, res) {
        const result = req.verified;
        logger.info(`result: ${result}`);
        if (result.state === true) {
            try {
                const { email, orgId } = result.userData.userData;
                //To check collection is present or not in database
                const userCollectionName = `org_${orgId.toLowerCase()}_users`;
                const db = await checkCollection(userCollectionName);
                if (!db) return res.status(400).send(Response.chatFailResp(`${userCollectionName} not present`));

                const adminData = await adminSchema.find({ email: email }, { firstName: 1, lastName: 1, profilePic: 1 });
                const projectFields = {
                    firstName: 1,
                    lastName: 1,
                    profilePic: 1,
                };
                let users = await db
                    .collection(userCollectionName)
                    .aggregate([{ $match: { email: { $ne: email } } }, { $project: projectFields }])
                    .toArray();
                const participants = {
                    users: adminData.concat(users),
                };
                console.log(participants);
                return res.status(200).send(Response.chatSuccessResp('Users fetching successful', participants));
            } catch (err) {
                logger.error(`error ${err}`);
                return res.status(400).send(Response.chatFailResp('Failed to fetch users', err));
            }
        }
    }
}

export default new ChatService();
