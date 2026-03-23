import TaskStageService from './taskStage.service.js';

class TaskStageController {
    // ---------------Task Stage---------------

    async createTaskStage(req, res, next) {
        /* 	#swagger.tags = ['Task Stage'] 
        #swagger.description = 'Creates the Task Stage '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateTaskStage" }
                    } */
        /*  #swagger.responses[200] = {
                                       description: 'Success response',   
                                       schema: { $ref: "#/definitions/createTaskStageSuc" }                  
               }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createTaskStageFail" }                  
    }*/

        return await TaskStageService.createTaskStage(req, res, next);
    }

    async getTaskStageById(req, res, next) {
        /* 	#swagger.tags = ['Task Stage'] 
     #swagger.description = 'Fetch the task stage by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task stage id',
                            required: false
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
                            enum: ['taskStage','isDefault', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/getTaskStageSuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getTaskStageFail" }                  
    }*/

        return await TaskStageService.getTaskStageById(req, res, next);
    }

    async updateTaskStage(req, res, next) {
        /* 	#swagger.tags = ['Task Stage'] 
     #swagger.description = 'Update the task stage details'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'Task stage id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Task stage edit/update',
                            // schema: { $ref: "#/definitions/UpdateTaskStage" }
                    } */
        /*  #swagger.responses[200] = {
                                       description: 'Success response',   
                                       schema: { $ref: "#/definitions/updTaskStageSuc" }                  
               }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updTaskStageFail" }                  
    }*/

        return await TaskStageService.updateTaskStage(req, res, next);
    }

    async deleteTaskStageById(req, res, next) {
        /* 	#swagger.tags = ['Task Stage'] 
     #swagger.description = 'Delete the task stage by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task stage id',
                            required: false,
                            }
     */
        /*  #swagger.responses[200] = {
                                       description: 'Success response',   
                                       schema: { $ref: "#/definitions/dltTaskStageSuc" }                  
               }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskStageFail" }                  
    }*/
        return await TaskStageService.deleteTaskStageById(req, res, next);
    }

    async deleteMultiTaskStageById(req, res, next) {
        /* 	#swagger.tags = ['Task Stage'] 
     #swagger.description = 'Delete the task stage by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Provide status Ids',
                        required: true,
                        schema: { $ref: "#/definitions/taskStagesIds" }
    } */  
        /*  #swagger.responses[200] = {
                                       description: 'Success response',   
                                       schema: { $ref: "#/definitions/dltTaskStageSuc" }                  
               }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskStageFail" }                  
    }*/
        return await TaskStageService.deleteMultiTaskStageById(req, res, next);
    }
}

export default new TaskStageController();
