import ProjectService from './project.service.js';
import commentReplyService from './commentReply.service.js'
class ProjectController {
    async create(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for create the Project' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'User Details',
                             required: true,
                             schema: { $ref: "#/definitions/createProject" }
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/projectCreate" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/projectCreateFail" }                  
    }*/
        /*  #swagger.responses[429] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/projectFeaturePlan" }                  
    }*/
        return await ProjectService.create(req, res, next);
    }
    async postComment(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                          #swagger.description = 'This routes is used for add the comment to the Project' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['projectId'] = {
                        in: 'query',
                        description: 'Project Id',
                        required: true,
                        }
    */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'project comments',
                             required: true,
                             schema: { $ref: "#/definitions/postComment" }
    }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/commentSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/commentFail" }                  
    }*/
        return await ProjectService.postComment(req, res, next);
    }
    async getAll(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for Fetch all the Projects of specific admin' */
        /* #swagger.security = [{
            "AccessToken": []
    }] */
        /*  #swagger.parameters['id'] = {
                        in: 'query',
                        description: 'Project Id',
    }*/
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            description: 'Skip Values',
    } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            description: 'results limit',
    } */
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ["projectName", "endDate", "projectCode", "userAssigned", "startDate", "createdAt", "updatedAt", "status", "progress","taskCount","subTaskCount","clientName","clientCompany","reason","completedDate"],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/projectFetch" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/projectFetchFail" }                  
    }*/

        return await ProjectService.getAll(req, res, next);
    }
    async getComment(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                      #swagger.description = 'This routes is used for fetch the specific comments of the project' */
        /* #swagger.security = [{
             "AccessToken": []
    }] */
        /*  #swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'fetch by projectId',
                          }
    */
        /*  #swagger.parameters['commentId'] = {
                            in: 'query',
                            description: 'fetch by commentId',
                          }
    */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum:0,
                            description: 'Skip Values',
    }*/
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
    } */
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ["comment", "createdAt", "updatedAt", ],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/commentFetch" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/commentFetchFail" }                  
    }*/
        return await ProjectService.getComment(req, res, next);
    }
    async update(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for update or Modify the Specific project details' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/updateProject" }
    }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/updateProSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/updateProFail" }                  
    }*/

        return await ProjectService.update(req, res, next);
    }
    async updateComment(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                          #swagger.description = 'This routes is used for update specific comment of the Project' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['commentId'] = {
                        in: 'query',
                        description: 'comment Id',
                        required: true,
                        }
    */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'comment edit/update',
                            schema: { $ref: "#/definitions/Updatecomment" }
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/commentUpdateSuc" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/commentUpdateFail" }                  
    }*/
        return await ProjectService.updateComment(req, res, next);
    }
    async delete(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for delete the Projects' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['id'] = {
                       in: 'query',
                       description: 'Delete by project_id',
    }*/

        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/deleteSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/deleteProFail" }                  
    }*/

        return await ProjectService.delete(req, res, next);
    }
    async deleteComment(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                        #swagger.description = 'This routes is used for delete the project comments' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'Delete by project_id',
                            }
    */
        /*  #swagger.parameters['commentId'] = {
                           in: 'query',
                           description: 'Delete by comment_id',
                           }
    */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/commentDeleteSuc" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/commentDeleteFail" }                  
    }*/
        return await ProjectService.deleteComment(req, res, next);
    }

    async search(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for search the Projects by skip,limit and sort' */
        /* #swagger.security = [{
               "AccessToken": []
    }]*/
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
                            description: 'Keyword to be searched',
    }*/
        /*	#swagger.parameters['orderBy'] = {
                        in: 'query',
                        description: 'keyword to be ordered',
                        enum: ["projectName", "endDate", "projectCode", "startDate", "createdAt", "updatedAt", "status", "progress","taskCount","subTaskCount","userAssigned","clientName","clientCompany","reason","completedDate"],
    }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
    }*/
        /*	#swagger.parameters['orderBy'] = {
                        in: 'query',
                        description: 'keyword to be ordered',
    }*/
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
    }*/
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/searchSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/searchFail" }                  
    }*/
        return await ProjectService.search(req, res, next);
    }
    async filter(req, res, next) {
        /* #swagger.tags = ['Project']
                       #swagger.description = 'This routes is used for filter the Project details'  */
        /* #swagger.security = [{
              "AccessToken": []
    }] */
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
     /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ["projectName", "endDate", "projectCode", "userAssigned", "startDate", "createdAt", "updatedAt", "status", "progress","taskCount","subTaskCount","reason","completedDate"],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'project filter  Details',
                            required: true,
                            schema: { $ref: "#/definitions/FilterDetails" }
    } */
        /*  #swagger.responses[200] = {
                              description: 'Success response',   
                              schema: { $ref: "#/definitions/filterSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/filterFail" }                  
    }*/
        return await ProjectService.filter(req, res, next);
    }
    async getStat(req, res, next) {
        /* 	#swagger.tags = ['Project']
                     #swagger.description = 'Display Stats of projects' */
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*  #swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'fetch by project_id',
                            required: true,

        }
   */
        return await ProjectService.getStat(req, res, next);
    }
    async projectExist(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for checking  Project is already exist or not' */
        /* #swagger.security = [{
            "AccessToken": []
    }] */
        /*  #swagger.parameters['projectName'] = {
                        in: 'query',
                        required: true,
                        description: 'Check project is exist or not',
    }*/
        /*  #swagger.responses[200] = {
                            description: 'Success response',   
                            schema: { $ref: "#/definitions/projectExist" }                  
  }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/projectNotExist" }                  
    }*/
        return await ProjectService.projectExist(req, res, next);
    }
    async projectStatus(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for checking  Project is already exist or not' */
        /* #swagger.security = [{
            "AccessToken": []
    }] */
        return await ProjectService.projectStatus(req, res, next);
    }
    async removeMember(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used to remove assigned users from project' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['projectId'] = {
                            in: 'body',
                            description: 'project Details',
                            required: true,
                            schema: { $ref: "#/definitions/removeMember" }
    }*/

        return await ProjectService.removeMember(req, res, next);
    }

    async timeCalculate(req, res, next) {
        /* 	#swagger.tags = ['Project']
                      #swagger.description = 'This routes is used for getting Total Hours consumed for completing project,task or subTask ' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'project Id',
                            }
    */
        /*  #swagger.parameters['taskId'] = {
                            in: 'query',
                            description: 'task Id',
                            }
    */
        /*  #swagger.parameters['subTaskId'] = {
                            in: 'query',
                            description: 'subTask Id',
                            }
    */

        return await ProjectService.timeCalculate(req, res, next);
    }
    async multipleProjectDelete(req, res, next) {
        /* 	#swagger.tags = ['Project']
                      #swagger.description = 'This routes is used to delete multiple projects' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
     /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Project Ids',
                             required: true,
                             schema: { $ref: "#/definitions/deleteMultipleProject" }
    } */

        return await ProjectService.deleteMultipleProject(req, res, next);
    }
    async ProjectUserProgress(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for delete the project comments' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'Fetch user details by project_id',
                            }
    */
        return await ProjectService.ProjectUserProgress(req, res, next);
    }
    async getAnalytics(req, res, next) {
        /* 	#swagger.tags = ['Project']
                        #swagger.description = 'This routes is used for task analytics' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'Fetch task analytics by project_id',
                            required:true
                            }
    */
     /*  #swagger.parameters['basedOn'] = {
                            in: 'query',
                            description: 'Analytics based on day or month',
                            enum:['daywise','monthwise'],
                            required:true
                            }
    */
        return await ProjectService.getAnalytics(req, res, next);
    }
    async addReply(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                          #swagger.description = 'This routes is used for add the comment to the Project' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['commentId'] = {
                        in: 'query',
                        description: 'Comment Id',
                        required: true,
                        }
    */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'project comments',
                             required: true,
                             schema: { $ref: "#/definitions/postComment" }
    }*/
        
        return await commentReplyService.addReply(req, res, next);
    }
    async updateReply(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                          #swagger.description = 'This routes is used for add the comment to the Project' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['commentReplyedId'] = {
                        in: 'query',
                        description: 'commentReplyedId Id',
                        required: true,
                        }
    */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'project comments',
                             required: true,
                             schema: { $ref: "#/definitions/postComment" }
    }*/
        
        return await commentReplyService.updateReply(req, res, next);
    }
    async deleteReply(req, res, next) {
        /* 	#swagger.tags = ['Project-comment']
                          #swagger.description = 'This routes is used for add the comment to the Project' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
         /*  #swagger.parameters['commentId'] = {
                        in: 'query',
                        description: 'comment Id',
                        }
    */
        /*  #swagger.parameters['replyedId'] = {
                        in: 'query',
                        description: 'commentReplyed Id',
                        }
    */
        return await commentReplyService.deleteReply(req, res, next);
    }

}

export default new ProjectController();
