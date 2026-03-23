import MessageService from './messages.service.js';

class MessageController {
    async getMessages(req, res) {
        /* 	#swagger.tags = ['Messages']
                     #swagger.description = 'This route is used for Fetching Messages' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['chatChannel_id'] = {
                            in: 'query',
                            description: 'Enter the private/group chat-channel id, to fetch all messages inside this.',
    } */
        /*	#swagger.parameters['messageId'] = {
                            in: 'query',
                            description: 'Fetch a particular message',
    } */
        return await MessageService.getMessages(req, res);
    }
    async sendMessage(req, res) {
        /* 	#swagger.tags = ['Messages']
                            #swagger.description = 'This route is used for Sending Message' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['messageId'] = {
                        in: 'query',
                        description: 'Add id, if replying for the selected message',
                        schema: { $ref: "#/definitions/replyMessage" }
        } */
        /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Add message & Chat-Channel for which the conversation has to be made ',
                          required: true,
                          schema: { $ref: "#/definitions/sendMessage" }
  } */
        return await MessageService.sendMessage(req, res);
    }
    async editMessage(req, res) {
        /* 	#swagger.tags = ['Messages']
                           #swagger.description = 'This route is used for Editing the Message' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Edit a message',
                          required: true,
                          schema: { $ref: "#/definitions/editMessage" }
  } */
        return await MessageService.editMessage(req, res);
    }
    async replyMessage(req, res) {
        /* 	#swagger.tags = ['Messages']
                     #swagger.description = 'This route is used for Replying for the specific message' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['messageId'] = {
                            in: 'query',
                            description: 'Reply for the selected message',
                            required: true,
                            schema: { $ref: "#/definitions/replyMessage" }
    } */
        return await MessageService.replyMessage(req, res);
    }
    async deleteMessage(req, res) {
        /* 	#swagger.tags = ['Messages']
                     #swagger.description = 'This route is used for Deleting the message' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Delete selected messages',
                            required: true,
                            schema: { $ref: "#/definitions/deleteMessage" }
    } */
        /*	#swagger.parameters['chatChannel_id'] = {
                            in: 'query',
                            description: 'Delete all messages for a chat-channel/conversation',
    } */
        return await MessageService.deleteMessage(req, res);
    }
    async forwardMessage(req, res) {
        /* 	#swagger.tags = ['Messages']
                            #swagger.description = 'This route is used for Forwarding Messages' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['messageId'] = {
                           in: 'query',
                           description: 'Id of the message to be forwarded',
        } */
        /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Add Chat-Channel Ids for which the message has to be forwarded',
                          required: true,
                          schema: { $ref: "#/definitions/forwardMessage" }
  } */
        return await MessageService.forwardMessage(req, res);
    }
    async createPoll(req, res) {
        /* 	#swagger.tags = ['Messages']
                           #swagger.description = 'This route is used for creating the Poll' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['chatChannel_id'] = {
                          in: 'query',
                          description: 'Add chat-channel id in which the poll has to be created',
                          required: true,
  } */
        /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Add poll question',
                          required: true,
                          schema: { $ref: "#/definitions/createPoll" }
  } */
        /*	#swagger.parameters['options'] = {
                          in: 'query',
                          description: 'Add poll options.',
                          type: 'array',
                          uniqueItems: true,
                          
  } */
        return await MessageService.createPoll(req, res);
    }
    async votePoll(req, res) {
        /* 	#swagger.tags = ['Messages']
                           #swagger.description = 'This route is used for Voting in Poll' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /*	#swagger.parameters['messageId'] = {
                          in: 'query',
                          description: 'Add Id the poll message for which the vote has to be added',
                          required: true,
  } */
        /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Select a option to add your vote',
                          required: true,
                          schema: { $ref: "#/definitions/votePoll" }
  } */
        return await MessageService.votePoll(req, res);
    }
    async uploadFiles(req, res) {
        /* 	#swagger.tags = ['Messages']
                     #swagger.description = 'This route is used for Uploading Images' */
        /* #swagger.security = [{
                 "AccessToken": []
      }] */
        /* #swagger.parameters['chatChannel_id'] = {
                            in: 'query',
                            description: 'Add Chat-Channel among whom the image has to be send',
      } */
        /*  #swagger.consumes = ['multipart/form-data']
        /*	#swagger.parameters['files'] = {
                            in: 'formData',
                            type: 'array',
                            required: true,
                            description: 'Add files...',
                            collectionFormat: 'multi',
                            items: { type: 'file' }
    } */
        return await MessageService.uploadFiles(req, res);
    }
}

export default new MessageController();
