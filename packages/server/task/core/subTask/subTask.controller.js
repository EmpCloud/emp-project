import SubTaskService from './subTask.service.js';
import commentReplyService from './subtask.commentReply.service.js'

class SubTaskController {
    async createSubTask(req, res, next) {
        /* 	#swagger.tags = ['SubTask'] 
        #swagger.description = 'Creates the Sub Task '*/
        /* #swagger.security = [{
               "AccessToken": []
      }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'sub Task details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateSubTask" }
                    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/createSubTaskSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/createSubTaskFail" }                  
    }*/

        return await SubTaskService.createSubTask(req, res, next);
    }

    async getSubTask(req, res, next) {
        /* 	#swagger.tags = ['SubTask'] 
     #swagger.description = 'Fetch the Sub task by Id'*/
        /* #swagger.security = [{
             "AccessToken": []
      }] */
        /*	#swagger.parameters['subTaskId'] = {
                            in: 'query',
                            description: 'SubTask id',
                            required: false,
                            }
     */
        /*	#swagger.parameters['taskId'] = {
                            in: 'query',
                            description: 'taskId',
                            required: false,
                            }
     */
        /*	#swagger.parameters['projectId'] = {
                            in: 'query',
                            description: 'ProjectId',
                            required: false,
                            }
     */
    /*	#swagger.parameters['userId'] = {
                            in: 'query',
                            description: 'based on users',
                            required: false,
                            }
     */
        /*	#swagger.parameters['status'] = {
                            in: 'query',
                            description: 'based on status',
                            required: false,
                            enum: ["Todo", "Inprogress","Done","Onhold","Inreview"]
                            }
     */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sort asc/desc',
                            enum: ["asc", "desc"]
                            }
     */
        /*	#swagger.parameters['order'] = {
                            in: 'query',
                            description: 'order by provided field eg.subTaskTitle ',
                            enum: ["subTaskTitle","subTaskStageName","subTaskType","subTaskStatus","createdAt","updatedAt"]
                            }
     */
        /*	#swagger.parameters['skip'] = {
                           in: 'query',
                           type: 'integer',
                           description: 'skip value',
                           }
    */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                            description: 'limit the search result',
                            }
    */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/getSubTasksSuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getSubTasksFail" }                  
    }*/
        return await SubTaskService.getSubTask(req, res, next);
    }

    async updateSubTask(req, res, next) {
        /* 	#swagger.tags = ['SubTask'] 
     #swagger.description = 'Update the Sub task details for the Project'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'subTask id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'sub-Task edit/update',
                            schema: { $ref: "#/definitions/UpdateSubTask" }
                    } */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/updSubTaskSuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updSubTaskFail" }                  
    }*/

        return await SubTaskService.updateSubTask(req, res, next);
    }

    async deleteSubTasks(req, res, next) {
        /* 	#swagger.tags = ['SubTask'] 
    #swagger.description = 'Delete all the sub tasks'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['taskId'] = {
                           in: 'query',
                           description: 'Task Id',
                           required: false,
                           }
    */
        /*	#swagger.parameters['subTaskId'] = {
                            in: 'query',
                            description: 'sub-Task Id',
                            required: false,
                            }
     */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/dltSubTasksSuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltSubTasksFail" }                  
    }*/
        return await SubTaskService.deleteSubTasks(req, res, next);
    }

    async searchSubTask(req, res, next) {
        /* 	#swagger.tags = ['SubTask'] 
     #swagger.description = 'Search sub task'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['keyword'] = {
                            in: 'query',
                            description: 'search key',
                            }
     */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type: 'integer',
                            description: 'skip value',
                            }
     */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                            description: 'limit the search result',
                            }
    */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sort asc/desc',
                            enum: ["asc", "desc"]
                            }
     */
        /*	#swagger.parameters['order'] = {
                            in: 'query',
                            description: 'order by field ex- subTaskTitle',
                            }
     */
        /*  #swagger.responses[200] = {
                                        description: 'Success response',   
                                        schema: { $ref: "#/definitions/srchSubTaskSuc" }                  
                }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/srchSubTaskFail" }                  
    }*/
        return await SubTaskService.searchSubTask(req, res, next);
    }

    async postComment(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment'] 
     #swagger.description = 'post the comment for the subtask'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'subtask id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'comment details',
                            schema: { $ref: "#/definitions/CommentSubTask" }
                    } */
        /*  #swagger.responses[200] = {
description: 'Success response',   
schema: { $ref: "#/definitions/addSubTaskCommentSuc" }                  
}*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/addSubTaskCommentFail" }                  
    }*/
        return await SubTaskService.postComment(req, res, next);
    }
    async updateComment(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment'] 
     #swagger.description = 'edit the comment for the subtask'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['id'] = {
                            in: 'path',
                            description: 'Comment id',
                            required: true,
                            }
     */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'comment details',
                            schema: { $ref: "#/definitions/CommentSubTask" }
                    } */
        /*  #swagger.responses[200] = {
description: 'Success response',   
schema: { $ref: "#/definitions/updSubTaskCommentSuc" }                  
}*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/updSubTaskCommentFail" }                  
    }*/
        return await SubTaskService.updateComment(req, res, next);
    }

    async getComments(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment'] 
     #swagger.description = 'get the comments for the subtask'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['subtask_id'] = {
                            in: 'query',
                            description: 'subtask id',
                            
                            }
     */
        /*	#swagger.parameters['comment_id'] = {
                            in: 'query',
                            description: 'subtask id',
                            
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
                            schema: { $ref: "#/definitions/getSubTaskCommentsSuc" }                  
    }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/getSubTaskCommentsFail" }                  
    }*/
        return await SubTaskService.getComments(req, res, next);
    }
    async deleteComment(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment'] 
     #swagger.description = 'delete the comment  for the subtask'*/
        /* #swagger.security = [{
            "AccessToken": []
     }] */
        /*	#swagger.parameters['subtask_id'] = {
                            in: 'query',
                            description: 'subtask id',
                            default: null,
                            }
     */
        /*	#swagger.parameters['comment_id'] = {
                            in: 'query',
                            description: 'Comment id',
                            default: null,
                            }
     */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/dltSubTaskCommentSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/dltSubTaskCommentFail" }                  
    }*/
        return await SubTaskService.deleteComment(req, res, next);
    }
    async multipleSubtaskDelete(req, res, next) {
        /* 	#swagger.tags = ['SubTask']
                      #swagger.description = 'This routes is used to delete multiple SubTasks' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'SubTask Ids',
                             required: true,
                             schema: { $ref: "#/definitions/deleteMultipleSubTask" }
    } */
        return await SubTaskService.deleteMultipleSubTask(req, res, next);
    }

    async addReply(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment']
                          #swagger.description = 'This routes is used for add reply to the comment' */
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
                             description: 'add reply to comments',
                             required: true,
                             schema: { $ref: "#/definitions/CommentSubTask" }
    }*/
        
        return await commentReplyService.addReply(req, res, next);
    }
    async updateReply(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment']
                          #swagger.description = 'This routes is used for update reply in the comment' */
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
                             description: 'Update reply',
                             required: true,
                             schema: { $ref: "#/definitions/CommentSubTask" }
    }*/
        
        return await commentReplyService.updateReply(req, res, next);
    }
    async deleteReply(req, res, next) {
        /* 	#swagger.tags = ['SubTask comment']
                          #swagger.description = 'This routes is used for delete reply from the comment' */
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
    async filterSubTask(req,res,next){
        /* 	#swagger.tags = ['SubTask']
                          #swagger.description = 'This route is used to fetch subtask. */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
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
    /*	#swagger.parameters['search'] = {
                          in: 'query',
                          type: 'string',
                          description: 'search value must be String',
                          }
     */
     /*	#swagger.parameters['projectId'] = {
                          in: 'query',
                          type: 'string',
                          required: true,
                          description: 'provide projectId',
                    }
    */
     /*	#swagger.parameters['filter'] = {
                            in: 'query',
                            description: 'based on type',
                            required: false,
                            enum: ["totalSubtask", "completedSubtask","pendingSubtask","OverDueSubTask","OverDueTask","pendingTask"]
                            }
     */
        return await SubTaskService.filterSubTask(req,res,next);
    }

}
export default new SubTaskController();
