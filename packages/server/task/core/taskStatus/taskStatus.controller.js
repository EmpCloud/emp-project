import TaskStatusService from './taskStatus.service.js';

class TaskStatusController {
    // ---------------Task Status---------------

    async createTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Task Status'] 
        #swagger.description = 'Creates the Task Status '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Status Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateTaskStatus" }
                    } */
        /*  #swagger.responses[200] = {
                            description: 'Success response',   
                            schema: { $ref: "#/definitions/createTaskStatusSuc" }                  
    }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createTaskStatusFail" }                  
    }*/

        return await TaskStatusService.createTaskStatus(req, res, next);
    }

    async getTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Task Status'] 
     #swagger.description = 'Fetch the task status by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task Status id',
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
                            enum: ['taskStatus','isDefault','isOverwrite', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/getTaskStatusSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getTaskStatusFail" }                  
    }*/

        return await TaskStatusService.getTaskStatus(req, res, next);
    }

    async updateTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Task Status'] 
     #swagger.description = 'Update the task status details'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'Task Status id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Task Status edit/update',
                            // schema: { $ref: "#/definitions/UpdateTaskStatus" }
                    } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/updTaskStatusSuc" }                  
            }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updTaskStatusFail" }                  
    }*/

        return await TaskStatusService.updateTaskStatus(req, res, next);
    }

    async deleteTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Task Status'] 
     #swagger.description = 'Delete the task status by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task Status id',
                            }
     */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/dltTaskStatusSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskStatusFail" }                  
    }*/

        return await TaskStatusService.deleteTaskStatus(req, res, next);
    }

    async searchTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Task Status'] 
     #swagger.description = 'Search task status based on keyword'*/
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
                            description: 'order by field ex- taskStatus',
                            enum: ["taskStatus", "createdAt"]
                            }
     */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type: 'integer',
                            description: 'skip value must be integer',
                            }
     */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                            description: 'limit value must be integer',
                            }
     */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/srchTaskStatusSuc" }                  
            }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/srchTaskStatusFail" }                  
    }*/
        return await TaskStatusService.searchTaskStatus(req, res, next);
    }

    async deleteMultiTaskStatus(req, res, next) {
        /* 	#swagger.tags = ['Task Status'] 
     #swagger.description = 'Delete the task status by Id's'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Provide status Ids',
                        required: true,
                        schema: { $ref: "#/definitions/statusIds" }
    } */  
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/dltTaskStatusSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskStatusFail" }                  
    }*/

        return await TaskStatusService.deleteMultiTaskStatus(req, res, next);
    }
}

export default new TaskStatusController();
