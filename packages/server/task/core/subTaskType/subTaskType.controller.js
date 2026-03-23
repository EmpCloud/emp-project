import SubTaskTypeService from './subTaskType.service.js';

class SubTaskTypeController {
    // -------------Sub Task Type---------------

    async createSubTaskType(req, res, next) {
        /* 	#swagger.tags = ['subTaskType'] 
        #swagger.description = 'Creates the Task Type for sub-task '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateSubTaskType" }
                    } */
        /*  #swagger.responses[200] = {
                             description: 'Success response',   
                             schema: { $ref: "#/definitions/createSubTaskTypeSuc" }                  
     }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createSubTaskTypeFail" }                  
    }*/

        return await SubTaskTypeService.createSubTaskType(req, res, next);
    }

    async getSubTaskType(req, res, next) {
        /* 	#swagger.tags = ['subTaskType'] 
     #swagger.description = 'Fetch the task type by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'subTask type id',
                            required: false,
                            }
     */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
        }*/
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
        }*/
        /*	#swagger.parameters['order'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['subTaskType','isDefault', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/getSubTaskTypeSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getSubTaskTypeFail" }                  
    }*/
        return await SubTaskTypeService.getSubTaskType(req, res, next);
    }

    async updateSubTaskType(req, res, next) {
        /* 	#swagger.tags = ['subTaskType'] 
     #swagger.description = 'Update the task type details'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'subTask type id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Task type edit/update',
                            // schema: { $ref: "#/definitions/UpdateSubTaskType" }
                    } */
        /*  #swagger.responses[200] = {
                                       description: 'Success response',   
                                       schema: { $ref: "#/definitions/updSubTaskTypeSuc" }                  
               }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updSubTaskTypeFail" }                  
    }*/

        return await SubTaskTypeService.updateSubTaskType(req, res, next);
    }

    async deleteSubTaskType(req, res, next) {
        /* 	#swagger.tags = ['subTaskType'] 
     #swagger.description = 'Delete the task type by Id from subtask'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'subTask type id',
                            required: false,
                            }
     */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/dltSubTaskTypesSuc" }                  
            }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltSubTaskTypesFail" }                  
    }*/
        return await SubTaskTypeService.deleteSubTaskType(req, res, next);
    }
}

export default new SubTaskTypeController();
