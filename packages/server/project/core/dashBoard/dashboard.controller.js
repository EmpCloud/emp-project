import DashboardService from '../../core/dashBoard/dashboard.service.js';

class ConfigController {
    async createDashboardConfig(req, res, next) {
        /* #swagger.tags = ['DashboardConfig']
                       #swagger.description = 'This routes is used for create the Dashboard Configurations'  */
        /* #swagger.security = [{
             "AccessToken": []
    }]*/

        /* #swagger.parameters['id'] = {
                    in: 'query',
                    description: 'select Dashboard Configuration valid values (1:ProjectManagement, 2:TaskManagement, 3: SubTaskManagement, 4: MemberManagement, 5: ActivityManagement)',
    }*/
        /*  #swagger.responses[200] = {
                            description: 'Success',   
                            schema: { $ref: "#/definitions/dashboardConfigSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dashboardConfigFail" }                  
    }*/
        return await DashboardService.createDashboardConfig(req, res, next);
    }
    async fetchConfig(req, res, next) {
        /* #swagger.tags = ['DashboardConfig']
                       #swagger.description = 'This routes is used for fetch the Dashboard Config details'  */

        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /* #swagger.parameters['id'] = {
                         in: 'query',
                         description: 'select Dashboard Configuration valid values (1:ProjectManagement, 2:TaskManagement, 3: SubTaskManagement, 4: MemberManagement, 5: ActivityManagement)',
         }*/
        /*  #swagger.responses[200] = {
                            description: 'Success',   
                            schema: { $ref: "#/definitions/dashboardConfigFetch" }                  
    }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dashboardConfigFetchFail" }                  
    }*/
        return await DashboardService.fetchConfig(req, res, next);
    }
    async updateDashboardConfig(req, res, next) {
        /* #swagger.tags = ['DashboardConfig']
                       #swagger.description = 'This routes is used for update the Dashboard Configurations'  */
        /* #swagger.security = [{
             "AccessToken": []
    }]*/
        /* #swagger.parameters['id'] = {
                         in: 'query',
                         description: 'select Dashboard Configuration valid values (1:ProjectManagement, 2:TaskManagement, 3: SubTaskManagement, 4: MemberManagement, 5: ActivityManagement)',
         }*/
        /*	#swagger.parameters['dashboardConfig'] = {
                    in: 'body',
                              description: 'Dashboard config edit/update',
                              schema: { $ref: "#/definitions/dashboardConfig" }
                      } */
        /*  #swagger.responses[200] = {
                                  description: 'Success',   
                                  schema: { $ref: "#/definitions/dashboardConfigUpdate" }                  
    }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dashboardConfigUpdateFail" }                  
    }*/

        return await DashboardService.updateDashboardConfig(req, res, next);
    }
}
export default new ConfigController();
