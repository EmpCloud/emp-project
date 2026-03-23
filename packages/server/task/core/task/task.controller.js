import TaskService from './task.service.js';
import commentReplyService from './task.commentReply.service.js'
class TaskController {
   async createTask(req, res, next) {
      /* 	#swagger.tags = ['Task'] 
      #swagger.description = 'Create the task '*/
      /* #swagger.security = [{
             "AccessToken": []
    }] */
      /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Task details: taskTitle is required field',
                          required: true,
                          schema: { $ref: "#/definitions/CreateTask" }
                  } */
      /*  #swagger.responses[200] = {
                                      description: 'Success response',   
                                      schema: { $ref: "#/definitions/createTaskSuc" }                  
              }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/createTaskFail" }                  
  }*/

      return await TaskService.createTask(req, res, next);
   }

   async getTasks(req, res, next) {
      /* 	#swagger.tags = ['Task']
   #swagger.description = 'Fetch the all Tasks, 
    => if projectId is given all the tasks under project is fetched
    => if taskId is given a particular task is fetched
    => if both ids not given then all the tasks under project and standalone are fetched
    => if both ids given fetch based on both conditions' */
      /* #swagger.security = [{
            "AccessToken": []
   }] */
      /*	#swagger.parameters['projectId'] = {
                          in: 'query',
                          description: 'projectId is optional if given fetch all the tasks under it',
                          }
  */
      /*	#swagger.parameters['Id'] = {
                           in: 'query',
                           description: 'taskId is optional if given fetch details for the particular task',
                           }
   */
     /*	#swagger.parameters['CreatedDate'] = {
                           in: 'query',
                           description: 'Fetch recent created task',
                           }
   */
     /*	#swagger.parameters['UpdatedDate'] = {
                           in: 'query',
                           description: 'Fetch recent updated task',
                           }
   */

      /*	#swagger.parameters['sort'] = {
                           in: 'query',
                           description: 'Order of the result ex- asc/desc',
                           enum: ["asc", "desc"]
                           }
    */
      /*	#swagger.parameters['order'] = {
                          in: 'query',
                          description: 'Based on order result will be grouped',
                          enum: ["taskTitle", "createdAt", "category", "priority", "taskType","stageName","assignedTo"]
                          }
   */
      /*	#swagger.parameters['standAloneTask'] = {
                           in: 'query',
                           description: 'standAloneTask are individual task',
                           enum: ['true', 'false']
                           }
    */
      /*	#swagger.parameters['skip'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'Skip value must be integer (optional)',
                          }
   */
      /*	#swagger.parameters['limit'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'limit value must be integer (optional)',
                          }
   */
      /*  #swagger.responses[200] = {
                                     description: 'Success response',   
                                     schema: { $ref: "#/definitions/getTasksSuc" }                  
             }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/getTasksFail" }                  
  }*/
      return await TaskService.getTasks(req, res, next);
   }
   async fetchaTaskByuserId(req, res, next) {
      /* 	#swagger.tags = ['Task']
   #swagger.description = 'Fetch the all Tasks'*/
      /* #swagger.security = [{
            "AccessToken": []
   }] */
      /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Fetch task and subtask by userId',
                          schema: { $ref: "#/definitions/alluserIds" }
                          }
  */
      return await TaskService.fetchaTaskByuserId(req, res, next);
   }
   async taskStatus(req, res, next) {
      /* 	#swagger.tags = ['Task']
                 #swagger.description = 'Display status with count of project and task ' */
      /* #swagger.security = [{
         "AccessToken": []
  }] */
      /*  #swagger.parameters['projectId'] = {
                        in: 'query',
                        description: 'fetch by projectId'
    }
 */
      /*  #swagger.parameters['taskId'] = {
                        in: 'query',
                        description: 'fetch by taskId'

    }
 */
      return await TaskService.taskStatus(req, res, next);
   }

   async updateTask(req, res, next) {
      /* 	#swagger.tags = ['Task'] 
   #swagger.description = 'Update the task details based on taskId'*/
      /* #swagger.security = [{
          "AccessToken": []
   }] */
      /*	#swagger.parameters['id'] = {
                          in: 'path',
                          description: 'taskId',
                          required: true,
                          }
   */
      /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'Enter the fields that has to be updated',
                          schema: { $ref: "#/definitions/UpdateTask" }
                  } */
      /*  #swagger.responses[200] = {
                                      description: 'Success response',   
                                      schema: { $ref: "#/definitions/updateTaskSuc" }                  
              }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/updateTaskFail" }                  
  }*/

      return await TaskService.updateTask(req, res, next);
   }

   async deleteTask(req, res, next) {
      /* 	#swagger.tags = ['Task'] 
   #swagger.description = 'Delete the task by Id'*/
      /* #swagger.security = [{
          "AccessToken": []
   }] */
      /*	#swagger.parameters['project_id'] = {
                          in: 'query',
                          description: 'project id',
                          
                          }
   */
      /*	#swagger.parameters['id'] = {
                          in: 'query',
                          description: 'task id',
                        
                          }
   */
      /*  #swagger.responses[200] = {
                              description: 'Success response',   
                              schema: { $ref: "#/definitions/deleteTaskSuc" }                  
      }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/deleteTaskFail" }                  
  }*/
      return await TaskService.deleteTask(req, res, next);
   }

   async searchTask(req, res, next) {
      /* 	#swagger.tags = ['Task'] 
   #swagger.description = 'Search task based on keyword'*/
      /* #swagger.security = [{
          "AccessToken": []
   }] */
      /*	#swagger.parameters['keyword'] = {
                          in: 'query',
                          description: 'Keyword to search (optional)',
                          }
   */
      /*	#swagger.parameters['sort'] = {
                          in: 'query',
                          description: 'Order for search ex- asc/desc',
                          enum: ["asc", "desc"]
                          }
   */
      /*	#swagger.parameters['order'] = {
                          in: 'query',
                          description: 'Based on order result will be grouped',
                          enum: ["taskTitle", "createdAt", "createdBy", "assignedTo","priority"]
                          }
   */
      /*	#swagger.parameters['standAloneTask'] = {
                             in: 'query',
                             description: 'standAloneTask are individual task',
                             enum: ['true', 'false']
                             }
      */
      /*	#swagger.parameters['skip'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'Skip value must be integer (optional)',
                          }
   */
      /*	#swagger.parameters['limit'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'limit value must be integer (optional)',
                          }
   */
      /*  #swagger.responses[200] = {
                              description: 'Success response',   
                              schema: { $ref: "#/definitions/searchTaskSuc" }                  
      }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/searchTaskFail" }                  
  }*/
      return await TaskService.searchTask(req, res, next);
   }

   async filterByKey(req, res, next) {
      /* 	#swagger.tags = ['Task']
      #swagger.description = 'Filter by key.'*/
      /* #swagger.security = [{
             "AccessToken": []
    }] */
      /*	#swagger.parameters['skip'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'Skip value must be integer (optional)',
                          }
   */
      /*	#swagger.parameters['limit'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'limit value must be integer (optional)',
                          }
   */
    /*	#swagger.parameters['sort'] = {
                           in: 'query',
                           description: 'Order of the result ex- asc/desc',
                           enum: ["asc", "desc"]
                           }
    */
      /*	#swagger.parameters['order'] = {
                          in: 'query',
                          description: 'Based on order result will be grouped',
                          enum: ["taskTitle", "createdAt"]
                          }
   */
    /*	#swagger.parameters['keyword'] = {
                          in: 'query',
                          description: 'Keyword to search (optional)',
                          }
   */
      /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'keys',
                          required: true,
                          schema: { $ref: "#/definitions/FilterByKeyTask" }
                  } */
      /*  #swagger.responses[200] = {
                                  description: 'Success response',   
                                  schema: { $ref: "#/definitions/filterKeyTaskSuc" }                  
          }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/filterKeyTaskFail" } 
                         }*/
      return await TaskService.filterByKey(req, res, next);
   }

   async searchTaskDefaultValue(req, res, next) {
      /* 	#swagger.tags = ['Task'] 
   #swagger.description = 'Search task default values based on category'*/
      /* #swagger.security = [{
          "AccessToken": []
   }] */
      /*	#swagger.parameters['category'] = {
                         in: 'query',
                         description: 'what you need to search',
                         enum: ["status", "types","category","stage"],
                         required:true
                         }
  */
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
                          description: 'order by field bydefault-category',
                          enum: ["createdAt","updatedAt"]
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

      return await TaskService.searchTaskDefaultValue(req, res, next);
   }

   async postComment(req, res, next) {
      /* 	#swagger.tags = ['Task comment'] 
   #swagger.description = 'post the comment for the task'*/
      /* #swagger.security = [{
          "AccessToken": []
   }] */
      /*	#swagger.parameters['id'] = {
                          in: 'path',
                          description: 'Task id',
                          required: true,
                          }
   */
      /*	#swagger.parameters['data'] = {
                          in: 'body',
                          description: 'comment details',
                          schema: { $ref: "#/definitions/CommentTask" }
                  } */
      /*  #swagger.responses[200] = {
description: 'Success response',   
schema: { $ref: "#/definitions/addTaskCommentSuc" }                  
}*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/addTaskCommentFail" }                  
  }*/
      return await TaskService.postComment(req, res, next);
   }

   async updateComment(req, res, next) {
      /* 	#swagger.tags = ['Task comment'] 
   #swagger.description = 'edit the comment for the task'*/
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
                          schema: { $ref: "#/definitions/CommentTask" }
                  } */
      /*  #swagger.responses[200] = {
description: 'Success response',   
schema: { $ref: "#/definitions/updTaskCommentSuc" }                  
}*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/updTaskCommentFail"}  }*/
      return await TaskService.updateComment(req, res, next);
   }

   async getComments(req, res, next) {
      /* 	#swagger.tags = ['Task comment'] 
   #swagger.description = 'get the comments for the task'*/
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
      /*	#swagger.parameters['task_id'] = {
                          in: 'query',
                          description: 'Task id',
                          }
   */
      /*	#swagger.parameters['comment_id'] = {
                          in: 'query',
                          description: 'Comment id',
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
                              schema: { $ref: "#/definitions/getTaskCommentsSuc" }                  
      }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/getTaskCommentsFail" }  }*/
      return await TaskService.getComments(req, res, next);
   }

   async deleteComment(req, res, next) {
      /* 	#swagger.tags = ['Task comment'] 
   #swagger.description = 'delete the comment  for the task'*/
      /* #swagger.security = [{
          "AccessToken": []
   }] */
      /*	#swagger.parameters['task_id'] = {
                          in: 'query',
                          description: 'task id',
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
                              schema: { $ref: "#/definitions/dltTaskCommentSuc" }                  
      }*/
      /*  #swagger.responses[400] = {
                          description: 'Fail response',   
                          schema: { $ref: "#/definitions/dltTaskCommentFail" }  }*/
      return await TaskService.deleteComment(req, res, next);
   }
   async multipleTaskDelete(req, res, next) {
      /* 	#swagger.tags = ['Task']
                  #swagger.description = 'This routes is used to delete multiple Tasks' */
      /* #swagger.security = [{
           "AccessToken": []
    }] */
      /*	#swagger.parameters['data'] = {
                         in: 'body',
                         description: 'Task Ids',
                         required: true,
                         schema: { $ref: "#/definitions/deleteMultipleTask" }
} */
      return await TaskService.deleteMultipleTask(req, res, next);
   }

   async getReports(req,res,next){
        /* 	#swagger.tags = ['Task']
                  #swagger.description = 'This routes is used to delete multiple Tasks' */
      /* #swagger.security = [{
           "AccessToken": []
    }] */
   /*	#swagger.parameters['startDate'] = {
                           in: 'query',
                           description: 'startDate',
                           }
   */
   /*	#swagger.parameters['endDate'] = {
                           in: 'query',
                           description: 'endDate',
                           }
   */
        /*	#swagger.parameters['skip'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'Skip value must be integer (optional)',
                          }
   */
   /*	#swagger.parameters['limit'] = {
                          in: 'query',
                          type: 'integer',
                          description: 'limit value must be integer (optional)',
                          }
   */
      return await TaskService.getReports(req, res, next);
   }
   async addReply(req, res, next) {
      /* 	#swagger.tags = ['Task comment']
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
                           schema: { $ref: "#/definitions/CommentTask" }
  }*/
      
      return await commentReplyService.addReply(req, res, next);
  }
  async updateReply(req, res, next) {
      /* 	#swagger.tags = ['Task comment']
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
                           schema: { $ref: "#/definitions/CommentTask" }
  }*/
      
      return await commentReplyService.updateReply(req, res, next);
  }
  async deleteReply(req, res, next) {
      /* 	#swagger.tags = ['Task comment']
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

}

export default new TaskController();
