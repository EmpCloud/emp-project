import SubTaskStatusService from './subTaskStatus.service.js';

class SubTaskStatusController {
    // -------------Sub Task Status---------------

    async createSubTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Sub Task Status'] 
        #swagger.description = 'Creates the Sub Task Status '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Sub Task Status Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateSubTaskStatus" }
                    } */
        /*  #swagger.responses[200] = {
                             description: 'Success response',   
                             schema: { $ref: "#/definitions/createSubTaskStatusSuc" }                  
     }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createSubTaskStatusFail" }                  
    }*/

        return await SubTaskStatusService.createSubTaskStatus(req, res, next);
    }

    async getSubTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Sub Task Status'] 
     #swagger.description = 'Fetch the subtask status by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Sub Task Status id',
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
                            enum: ['subTaskStatus','isDefault', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                               description: 'Success response',   
                               schema: { $ref: "#/definitions/getSubTaskStatusSuc" }                  
       }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getSubTaskStatusFail" }                  
    }*/
        return await SubTaskStatusService.getSubTaskStatus(req, res, next);
    }

    async updateSubTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Sub Task Status'] 
     #swagger.description = 'Update the subtask status details'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'Sub Task Status id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Sub Task Status edit/update',
                            // schema: { $ref: "#/definitions/UpdateSubTaskStatus" }
                    } */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/updSubTaskStatusSuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updSubTaskStatusFail" }                  
    }*/

        return await SubTaskStatusService.updateSubTaskStatus(req, res, next);
    }

    async deleteSubTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Sub Task Status'] 
     #swagger.description = 'Delete the subtask status by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Sub Task Status id',
                            required: false,
                            }
     */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/dltSubTaskStatusSuc" }                  
            }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltSubTaskStatusFail" }                  
    }*/
        return await SubTaskStatusService.deleteSubTaskStatus(req, res, next);
    }
}

export default new SubTaskStatusController();
