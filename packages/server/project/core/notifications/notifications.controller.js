import NotificationService from './notifications.service.js';

class NotificationController {
    async fetchNotification(req, res) {
        /* #swagger.tags = ['Notifications']
                           #swagger.description = 'This route is used for fetching the notifications' */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */
        return await NotificationService.fetchNotification(req, res);
    }
    async readNotification(req, res) {
        /* #swagger.tags = ['Notifications']
                           #swagger.description = 'This route is used for marking the notifications as read' */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */
         /*	#swagger.parameters['notificationId'] = {
                                in: 'query',
                                description: 'Mark Single Notification as Read',
                        } */
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'Mark All Notifications as Read',
                                schema: { $ref: "#/definitions/notificationRead" }
                        } */
       
        return await NotificationService.readNotification(req, res);
    }
    async deleteNotification(req, res) {
        /* #swagger.tags = ['Notifications']
                           #swagger.description = 'This route is used for deleting the notifications' */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */
        /*	    #swagger.parameters['notificationId'] = {
                     in: 'query',
                     description: 'Delete single notification',
                     required: false
                     
        } */
        return await NotificationService.deleteNotification(req, res);
    }
}

export default new NotificationController();
