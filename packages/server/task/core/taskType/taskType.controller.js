import TaskTypeService from './taskType.service.js';

class TaskTypeController {
    // ---------------Task Type---------------

    async createTaskType(req, res, next) {
        /* 	#swagger.tags = ['Task Type'] 
        #swagger.description = 'Creates the Task Type '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateTaskType" }
                    } */
        /*  #swagger.responses[200] = {
                             description: 'Success response',   
                             schema: { $ref: "#/definitions/createTaskTypeSuc" }                  
     }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createTaskTypeFail" }                  
    }*/

        return await TaskTypeService.createTaskType(req, res, next);
    }

    async getTaskType(req, res, next) {
        /* 	#swagger.tags = ['Task Type'] 
     #swagger.description = 'Fetch the task type by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task type id',
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
         /*	#swagger.parameters['keyword'] = {
                          in: 'query',
                          description: 'Keyword for search',
                          }
        */
        /*	#swagger.parameters['order'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['taskType','isDefault','isOverwrite', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/getTaskTypeSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getTaskTypeFail" }                  
    }*/
        return await TaskTypeService.getTaskType(req, res, next);
    }

    async updateTaskType(req, res, next) {
        /* 	#swagger.tags = ['Task Type'] 
     #swagger.description = 'Update the task type details'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'Task type id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Task type edit/update',
                            // schema: { $ref: "#/definitions/UpdateTaskType" }
                    } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/updTaskTypeSuc" }                  
            }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updTaskTypeFail" }                  
    }*/

        return await TaskTypeService.updateTaskType(req, res, next);
    }

    async deleteTaskType(req, res, next) {
        /* 	#swagger.tags = ['Task Type'] 
     #swagger.description = 'Delete the task type by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task type id',
                            }
     */
        /*  #swagger.responses[200] = {
                                   description: 'Success response',   
                                   schema: { $ref: "#/definitions/dltTaskTypeSuc" }                  
           }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskTypeFail" }                  
    }*/
        return await TaskTypeService.deleteTaskType(req, res, next);
    }

    async searchTaskType(req, res, next) {
        /* 	#swagger.tags = ['Task Type'] 
     #swagger.description = 'Search task type based on keyword'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['keyword'] = {
                            in: 'query',
                            description: 'Keyword for search',
                            }
     */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'Order for sort ex- asc/desc',
                            enum: ["asc", "desc"]
                            }
     */
        /*	#swagger.parameters['order'] = {
                            in: 'query',
                            description: 'order by field ex- taskType',
                            enum: ["taskType", "createdAt"]
                            }
     */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type: 'integer',
                            minimum: 0,
                            description: 'skip value',
                            }
     */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                            minimum: 0,
                            description: 'limit value',
                            }
     */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/srchTaskTypeSuc" }                  
            }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/srchTaskTypeFail" }                  
    }*/
        return await TaskTypeService.searchTaskType(req, res, next);
    }

    async deleteMultiTaskType(req, res, next) {
        /* 	#swagger.tags = ['Task Type'] 
     #swagger.description = 'Delete the task type by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Provide taskType Ids',
                        required: true,
                        schema: { $ref: "#/definitions/taskTypeIds" }
    } */ 
        /*  #swagger.responses[200] = {
                                   description: 'Success response',   
                                   schema: { $ref: "#/definitions/dltTaskTypeSuc" }                  
           }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskTypeFail" }                  
    }*/
        return await TaskTypeService.deleteMultiTaskType(req, res, next);
    }
}

export default new TaskTypeController();
