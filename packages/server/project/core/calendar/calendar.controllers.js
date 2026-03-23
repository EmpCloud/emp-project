import CalendarService from './calendar.service.js';

class CalendarControllers {
    async addEvent(req, res, next) {
        /* #swagger.tags = ['Calendar']
                           #swagger.description = 'This route is used to create event'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Event Details',
                             required: true,
                             schema: { $ref: "#/definitions/createEvent" }
    } */
        return await CalendarService.addEvent(req, res, next);
    }

    async getEvents(req, res, next) {
        /* #swagger.tags = ['Calendar']
                           #swagger.description = 'This route is used to get events'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['eventId'] = {
                        in: 'query',
                        description: 'Event Id',
    }*/
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum:0,
                            description: 'Skip Values',
    }*/
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
    } */
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ["eventName", "description", "startTime", "endTime", "createdAt", ],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        return await CalendarService.getEvents(req, res, next);
    }

    async updateEvent(req, res, next) {
        /* #swagger.tags = ['Calendar']
                           #swagger.description = 'This route is used to update an event'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['id'] = {
                        in: 'path',
                        description: 'Event Id',
                        required: true,
    }*/
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Event Details',
                             required: true,
                             schema: { $ref: "#/definitions/updateEvent" }
    } */
        return await CalendarService.updateEvent(req, res, next);
    }

    async deleteEvents(req, res, next) {
        /* #swagger.tags = ['Calendar']
                           #swagger.description = 'This route is used to delete events'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['eventId'] = {
                        in: 'query',
                        description: 'Event Id',
    }*/
        return await CalendarService.deleteEvents(req, res, next);
    }

    async searchEvents(req, res, next) {
        /* #swagger.tags = ['Calendar']
                           #swagger.description = 'This route is used to search events based on keyword'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['keyword'] = {
                        in: 'query',
                        description: 'Keyword to search',
    }*/
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum:0,
                            description: 'Skip Values',
    }*/
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
    } */
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ["eventName", "description", "startTime", "endTime", "createdAt", ],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        return await CalendarService.searchEvents(req, res, next);
    }

    async filterEvents(req, res, next) {
        /* #swagger.tags = ['Calendar']
                   #swagger.description = 'This routes is used for filter the event details of user'  */
        /* #swagger.security = [{
          "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Event filter details',
                        required: true,
                        schema: { $ref: "#/definitions/filterEventDetails" }
    } */

        return await CalendarService.filterEvents(req, res, next);
    }
}

export default new CalendarControllers();
