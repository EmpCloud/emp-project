import autoReportService from './autoReport.service.js';

class AutoReport {
    async sendAutoReport(req, res) {
        /* #swagger.tags = ['Auto-Report']
                           #swagger.description = 'This route is used to send Auto report'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Event Details',
                             required: true,
                             schema: { $ref: "#/definitions/sendReport" }
    } */
        return await autoReportService.sendAutoReport(req, res);
    }

    async fetchReportDetails(req, res) {
        /* #swagger.tags = ['Auto-Report']
                           #swagger.description = 'This route is used to Fetch Auto report Details'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['searchQuery'] = {
                              in: 'query',
                              description: 'Enter the searchQuery',
                              
        }*/

            /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['reportsTitle','frequency'],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type: 'integer',
                            minimum: 0,
                            description: 'Skip Values',
    } */

        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                            minimum: 0,
                            description: 'results limit',
    } */
        return await autoReportService.fetchReportDetails(req, res);
    }
    async updateReport(req, res, next) {
        /* 	#swagger.tags = ['Auto-Report']
                        #swagger.description = 'This routes is used for update the report details ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
     /*  #swagger.parameters['Id'] = {
                            in: 'query',
                            required: true,
                            description: 'Report Id',
                            }
    */
    /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Company Details',
                             required: true,
                             schema: { $ref: "#/definitions/sendReport" }
    } */
        return await autoReportService.updateReport(req, res, next);
    }
    async deleteReport(req, res, next) {
        /* 	#swagger.tags = ['Auto-Report']
                        #swagger.description = 'This routes is used for delete the report ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
     /*  #swagger.parameters['Id'] = {
                            in: 'query',
                            description: 'Report Id',
                            }
    */
     
        return await autoReportService.deleteReport(req, res, next);
    }
    async sendTestMailReport(req, res) {
        /* #swagger.tags = ['Auto-Report']
                           #swagger.description = 'This route is used to send Auto report'  */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Event Details',
                             required: true,
                             schema: { $ref: "#/definitions/sendReport" }
    } */
        return await autoReportService.sendTestMailReport(req, res);
    }
}
export default new AutoReport();
