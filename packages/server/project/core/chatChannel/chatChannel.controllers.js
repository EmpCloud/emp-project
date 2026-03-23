import ChatService from './chatChannel.services.js';

class ChatController {
    async privateChatChannel(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
        #swagger.description = 'This route is used for creating a private Chat-channel' */
        /* #swagger.security = [{
            "AccessToken": []
        }] */
        /*	#swagger.parameters['userId'] = {
                                    in: 'body',
                                    description: 'Create chat-channel with a user',
                                    required: true,
                                    schema: { $ref: "#/definitions/createChat" }
            } */
        return await ChatService.privateChatChannel(req, res);
    }
    async groupChatChannel(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
        #swagger.description = 'This route is used for Creating a Group Chat-Channel' */
        /* #swagger.security = [{
            "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
            in: 'body',
            description: 'Add Group Name & User Ids ( more than 2 users form a group chat )',
            required: true,
            schema: { $ref: "#/definitions/groupChat" }
        } */
        return await ChatService.groupChatChannel(req, res);
    }
    async fetchChatChannel(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
        #swagger.description = 'This routes is used for Fetching Chat-Channels' */
        /* #swagger.security = [{
            "AccessToken": []
        }] */
        return await ChatService.fetchChatChannel(req, res);
    }
    async groupMembers(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
                              #swagger.description = 'This route is for fetching Group Members' */
        /* #swagger.security = [{
            "AccessToken": []
        }] */
        /*	#swagger.parameters['chatChannel_id'] = {
            in: 'query',
            description: 'Get all users inside a group using its chat-channel-id',
            required: true,
        } */
        return await ChatService.groupMembers(req, res);
    }
    async renameGroup(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
        #swagger.description = 'This route is used to Rename the Group' */
        /* #swagger.security = [{
            "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
            in: 'body',
            description: 'Update the Group Name for the Chat-channel id',
            required: true,
            schema: { $ref: "#/definitions/renameGroup" }
        } */
        return await ChatService.renameGroup(req, res);
    }
    async removeFromGroup(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
        #swagger.description = 'This route is used to Removing the user from Group' */
        /* #swagger.security = [{
            "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
            in: 'body',
            description: 'Remove user from the group chat',
            required: true,
                                    schema: { $ref: "#/definitions/removeFromGroup" }
                                } */
        return await ChatService.removeFromGroup(req, res);
    }
    async addToGroup(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
                                #swagger.description = 'This route is used for Adding the user to Group' */
        /* #swagger.security = [{
                                    "AccessToken": []
                                }] */
        /*	#swagger.parameters['data'] = {
                                    in: 'body',
                                    description: 'Add user to group chat',
                                    required: true,
                                    schema: { $ref: "#/definitions/addToGroup" }
                                } */
        return await ChatService.addToGroup(req, res);
    }
    async fetchUsers(req, res, next) {
        /* 	#swagger.tags = ['Chat-channel']
                                #swagger.description = 'This route is used for Fetching All Users' */
        /* #swagger.security = [{
                                    "AccessToken": []
                                }] */
        return await ChatService.fetchUsers(req, res, next);
    }
    async deleteChatChannel(req, res) {
        /* 	#swagger.tags = ['Chat-channel']
                                                    #swagger.description = 'This route is used for deleting Chat-Channel' */
        /* #swagger.security = [{
                                           "AccessToken": []
                                }] */
        /*	#swagger.parameters['chatChannel_id'] = {
                                    in: 'query',
                                    description: 'Delete the conversation chat-channel',
                                    required: true,
                                    schema: { $ref: "#/definitions/deleteChat" }
                                } */
        return await ChatService.deleteChatChannel(req, res);
    }
}

export default new ChatController();
