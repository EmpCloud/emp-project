import TaskCategoryService from './taskCategory.service.js';

class TaskCategoryController {
    // ---------------Task Category---------------

    async createTaskCategory(req, res, next) {
        /* 	#swagger.tags = ['Task Category'] 
        #swagger.description = 'Creates the Task Category '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateTaskCategory" }
                    } */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/createTaskCategorySuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createTaskCategoryFail" }                  
    }*/

        return await TaskCategoryService.createTaskCategory(req, res, next);
    }

    async getTaskCategoryById(req, res, next) {
        /* 	#swagger.tags = ['Task Category'] 
     #swagger.description = 'Fetch the task category by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task category id',
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
                            enum: ['taskCategory','isDefault', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                         description: 'Success response',   
                                         schema: { $ref: "#/definitions/getTaskCategorySuc" }                  
                 }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getTaskCategoryFail" }                  
    }*/

        return await TaskCategoryService.getTaskCategoryById(req, res, next);
    }

    async updateTaskCategory(req, res, next) {
        /* 	#swagger.tags = ['Task Category'] 
     #swagger.description = 'Update the task category details'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'Task category id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Task category edit/update',
                            // schema: { $ref: "#/definitions/UpdateTaskCategory" }
                    } */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/updTaskCategorySuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updTaskCategoryFail" }                  
    }*/

        return await TaskCategoryService.updateTaskCategory(req, res, next);
    }

    async deleteTaskCategoryById(req, res, next) {
        /* 	#swagger.tags = ['Task Category'] 
     #swagger.description = 'Delete the task category by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'query',
                            description: 'Task category id',
                            required: false,
                            }
     */
        /*  #swagger.responses[200] = {
                                           description: 'Success response',   
                                           schema: { $ref: "#/definitions/dltTaskCategorySuc" }                  
                   }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskCategoryFail" }                  
    }*/
        return await TaskCategoryService.deleteTaskCategoryById(req, res, next);
    }

    async deleteMultiTaskCategoryById(req,res,next){
        /* 	#swagger.tags = ['Task Category'] 
     #swagger.description = 'Delete the task category by Id'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Provide Categories Ids',
                        required: true,
                        schema: { $ref: "#/definitions/categoryIds" }
    } */       

        /*  #swagger.responses[200] = {
                                           description: 'Success response',   
                                           schema: { $ref: "#/definitions/dltTaskCategorySuc" }                  
                   }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltTaskCategoryFail" }                  
    }*/
        return await TaskCategoryService.deleteMultiTaskCategoryById(req,res,next);
    }
}

export default new TaskCategoryController();
