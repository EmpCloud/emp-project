import fieldService from './customFields.service.js'
class FieldsController {
    async configFields(req, res, next) {
        /* #swagger.tags = ['Custom-fields']
                   #swagger.description = 'This routes used for create the Admin Field Configurations'  */
        /* #swagger.security = [{
         "AccessToken": []
  }] */

        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Fields config Details valid values(1:field enable,2:field enable and validation required,0:field disable)',
                        required: true,
                        schema: { $ref: "#/definitions/CreateFieldConfig" }
} */
        return await fieldService.configFields(req, res, next);
    }
    async configViewFields(req, res, next) {
        /* #swagger.tags = ['Custom-fields']
                   #swagger.description = 'This routes used for create the Admin Field View Configurations'  */
        /* #swagger.security = [{
         "AccessToken": []
  }] */

        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Fields config Details valid values(1:view enable,0:view disable)',
                        required: true,
                        schema: { $ref: "#/definitions/ViewFieldConfig" }
} */
        return await fieldService.configViewFields(req, res, next);
    }
    async DefaultFiledAccess(req, res, next) {
        /* #swagger.tags = ['Custom-fields']
                   #swagger.description = 'This routes used for create the Admin Field View Configurations'  */
        /* #swagger.security = [{
         "AccessToken": []
  }] */
        return await fieldService.DefaultFiledAccess(req, res, next);
    }
    async addNewDynamicFields(req, res, next) {
        /* #swagger.tags = ['Custom-fields']
                   #swagger.description = 'This routes used for create the Admin Field Configurations'  */
        /* #swagger.security = [{
         "AccessToken": []
  }] */

        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Create config fields',
                        required: true,
                        schema: { $ref: "#/definitions/CreateDynamicFields" }
} */
        return await fieldService.addNewDynamicFields(req, res, next);
    }
}
export default new FieldsController();
