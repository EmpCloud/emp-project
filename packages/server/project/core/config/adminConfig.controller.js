import ConfigService from './adminConfig.service.js';

class ConfigController {
    async createAdminConfig(req, res, next) {
        /* #swagger.tags = ['Config']
                       #swagger.description = 'This routes used for create the Admin Configurations'  */
        /* #swagger.security = [{
             "AccessToken": []
      }] */

        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Config Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateAdminConfig" }
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/adminConfigSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/adminConfigFail" }                  
    }*/
        return await ConfigService.createAdminConfig(req, res, next);
    }
    async fetchAdminConfig(req, res, next) {
        /* #swagger.tags = ['Config']
                             #swagger.description = 'This routes used for fetch the Admin Configurations' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.responses[200] = {
                               description: 'Success response',   
                               schema: { $ref: "#/definitions/configFetch" }                  
   }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/configFetchFail" }                  
    }*/

        return await ConfigService.fetchAdminConfig(req, res, next);
    }
    async updateAdminConfig(req, res, next) {
        /* #swagger.tags = ['Config']
                       #swagger.description = 'This routes used for update the Admin Configurations'  */
        /* #swagger.security = [{
             "AccessToken": []
      }] */

        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Config details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateAdminConfig" }
    } */
        /*  #swagger.responses[200] = {
                               description: 'Success response',   
                               schema: { $ref: "#/definitions/configUpdate" }                  
   }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/configUpdateFail" }                  
    }*/
        return await ConfigService.updateAdminConfig(req, res, next);
    }
   
}
export default new ConfigController();
