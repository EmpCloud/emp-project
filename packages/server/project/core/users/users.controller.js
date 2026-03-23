import UserService from './users.service.js';

class UserController {
    async createUser(req, res, next) {
        /* #swagger.tags = ['Users']
                            #swagger.description = 'This routes is used for create the Users' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'User Details',
                                required: true,
                                schema: { $ref: "#/definitions/CreateUser" }
        } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/userCreate" }                  
        }*/
        /*  #swagger.responses[400] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/userCreateFail" }                  
        }*/
        /*  #swagger.responses[429] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/userPlan" }                  
        }*/
        return await UserService.createUser(req, res, next);
    }

    async fetchUser(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for fetch the Users' */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */
          /* #swagger.parameters['userId'] = {
                in: 'query',
                required: false,
                description: 'user Id',
        }*/
         /* #swagger.parameters['startDate'] = {
                in: 'query',
                required: false,
                description: 'startDate',
        }*/
         /* #swagger.parameters['endDate'] = {
                in: 'query',
                required: false,
                description: 'endDate',
        }*/
        /* #swagger.parameters['projectId'] = {
                in: 'query',
                required: false,
                description: 'project Id'
        }*/
         /* #swagger.parameters['taskId'] = {
                in: 'query',
                required: false,
                description: 'task Id'
        }*/
        /* #swagger.parameters['search'] = {
                in: 'query',
                required: false,
                description: 'provide search'
        }*/
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
        } */
        /*	#swagger.parameters['invitationStatus'] = {
                              in: 'query',
                              description: 'Filter by invitation status... 0-pending , 1-accepted, 2-rejected',
                              type: 'integer',
                              enum: [0,1,2]
        } */
         /*	#swagger.parameters['suspensionStatus'] = {
                              in: 'query',
                              description: 'Filter by suspension status... true-suspended , false-all members except suspended',
                              type: 'boolean',
                              enum: [true,false]
        } */
        /*	#swagger.parameters['orderBy'] = {
                             in: 'query',
                             description: 'keyword to be ordered',
                             enum:["firstName","lastName","email", "role", "permission", "empMonitorId", "isAdmin", "verified", "softDeleted","projectCount","taskCount","performance"],
         } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
        } */
        /*  #swagger.responses[200] = {
                               description: 'Success response',   
                               schema: { $ref: "#/definitions/userFetchSuc" }                  
       }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/userFetchFail" }                  
        }*/
        return await UserService.fetchUser(req, res, next);
    }
    async fetchUserByRoles(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for user the Users by role name' */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */
        /* #swagger.parameters['role'] = {
                                in: 'query',
                                required: true
        } */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/fetchRoleByUser" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/fetchRoleByUserFail" }                  
        }*/
        return await UserService.fetchUserByRoles(req, res, next);
    }

    async updateUser(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for update the Users' */
        /* #swagger.security = [{
                  "AccessToken": []
        }]*/
        /* #swagger.parameters['userId'] = {
                in: 'query',
                required: true
        }*/
        /*  #swagger.parameters['data'] = {
                in: 'body',
                required: true,
                schema: { $ref: "#/definitions/UpdateUser" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/userUpdateSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/userUpdateFail" }                  
        }*/
        return await UserService.updateUser(req, res, next);
    }

    async deleteUser(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for delete the Users' */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */
        /* #swagger.parameters['userId'] = {
                               in: 'query',
                               required: false
        } */
         /* #swagger.parameters['invitationStatus'] = {
                               in: 'query',
                               required: false,
                               enum:['0','1','2']
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/userDeleteSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/userDeleteFail" }                  
        }*/
        return await UserService.deleteUser(req, res, next);
    }
    async multiDeleteUsers(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for delete the users' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
           /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Users Ids',
                             required: true,
                             schema: { $ref: "#/definitions/multiDeleteUsers" }
        } */
        return await UserService.multiDeleteUsers(req, res, next);
    }

    async searchUser(req, res, next) {
        /* 	#swagger.tags = ['Users']
                        #swagger.description = 'This routes is used for search the Users with skip,limit and sort' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	#swagger.parameters['skip'] = {
                                in: 'query',
                                type:'integer',
                                minimum: 0,
                                description: 'Skip Values',
        } */

        /*	#swagger.parameters['limit'] = {
                                in: 'query',
                                type:'integer',
                                minimum:0,
                                description: 'results limit',
        } */
        /*	#swagger.parameters['keyword'] = {
                                in: 'query',
                                description: 'Keyword to be searched',
        } */
        /*	#swagger.parameters['orderBy'] = {
                                in: 'query',
                                description: 'keyword to be ordered',
                                enum:["firstName","lastName","email", "role", "permission", "empMonitorId", "isAdmin", "verified", "softDeleted"],
        } */
        /*	#swagger.parameters['invitationStatus'] = {
                              in: 'query',
                              description: 'Filter by invitation status... 0-pending , 1-accepted, 2-rejected',
                              type: 'integer',
                              enum: [0,1,2]
        } */
        /*	#swagger.parameters['sort'] = {
                                in: 'query',
                                description: 'sorting parameters(asc or desc)',
                                enum: ['asc', 'desc'],
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/searchScu" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/searchFail" }                  
        }*/
        return await UserService.searchUser(req, res, next);
    }

    async filter(req, res, next) {
        /* #swagger.tags = ['Users']
                       #swagger.description = 'This routes is used for filter the User details'  */
        /* #swagger.security = [{
              "AccessToken": []
    }] */
        /*	#swagger.parameters['invitationStatus'] = {
                             in: 'query',
                              description: 'Filter by invitation status... 0-pending , 1-accepted, 2-rejected',
                              type: 'integer',
                              enum: [0,1,2]
        } */
        /*	#swagger.parameters['skip'] = {
                                in: 'query',
                                type:'integer',
                                minimum: 0,
                                description: 'Skip Values',
        } */

        /*	#swagger.parameters['limit'] = {
                                in: 'query',
                                type:'integer',
                                minimum:0,
                                description: 'results limit',
        } */
        /*	#swagger.parameters['orderBy'] = {
                                in: 'query',
                                description: 'keyword to be ordered',
                                enum:["firstName","lastName","email", "role", "permission", "performance", "projectCount", "taskCount"],
        } */
        /*	#swagger.parameters['sort'] = {
                                in: 'query',
                                description: 'sorting parameters(asc or desc)',
                                enum: ['asc', 'desc'],
        } */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'user filter  Details',
                            required: true,
                            schema: { $ref: "#/definitions/userFilterDetails" }
    } */
        return await UserService.filter(req, res, next);
    }

    async fetchRecoverable(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'Fetch the Recoverable Users' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
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
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/recoverableUser" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/recoverableUserFail" }                  
        }*/

        return await UserService.fetchRecoverable(req, res, next);
    }

    async restoreUser(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'Delete the Roles' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	    #swagger.parameters['userId'] = {
                in: 'query',
                required: true
      } */
        return await UserService.restoreUser(req, res, next);
    }

    async forceDelete(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'Delete the Roles' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	    #swagger.parameters['userId'] = {
                 in: 'query',
                 required: false
       } */
       /*	    #swagger.parameters['softDeleted'] = {
                 in: 'query',
                 required: false,
                 enum: [true,false]
       } */

        return await UserService.forceDelete(req, res, next);
    }

    async stats(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'Display user stats' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	    #swagger.parameters['userId'] = {
                 in: 'query',
                 required: true
       } */

        return await UserService.getStat(req, res, next);
    }

    async getUser(req, res, next) {
        /* #swagger.tags = ['Users']
                       #swagger.description = 'This routes is used for fetch the Users' */
        /* #swagger.security = [{
              "AccessToken": []
    }] */
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
                         enum:["firstName","lastName","email", "role", "department", "emp_id"],
     } */
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
    } */
    /*	#swagger.parameters['search'] = {
                        in: 'query',
                        description: 'keyword to be searched',
    } */
        /*  #swagger.responses[200] = {
                           description: 'Success response',   
                           schema: { $ref: "#/definitions/userFetchSuc" }                  
   }*/
        /*  #swagger.responses[400] = {
                            description: 'Fail response',   
                            schema: { $ref: "#/definitions/userFetchFail" }                  
    }*/
        return await UserService.getUser(req, res, next);
    }
    async suspendUser(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used to make user suspend or resume'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['userId'] = {
                                in: 'query',
                                description: 'User Id',
                                required: true,                        
        } */
        /*	#swagger.parameters['data'] = {
                                 in: 'body',
                                 description: 'user suspend or resume',
                                 required: true,
                                 schema: { $ref: "#/definitions/suspendUser" }
        }*/
        return await UserService.suspendUser(req, res, next);
    }
    
    async updateProfile(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used to update user Profile'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['userId'] = {
                                in: 'query',
                                description: 'User Id',
                                required: true,                        
        } */
        /*	#swagger.parameters['data'] = {
                                 in: 'body',
                                 required: true,
                                 schema: { $ref: "#/definitions/updateProfile" }
        }*/
        return await UserService.updateProfile(req, res, next);
    }
    async resendVerifyMail(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used to resend verification mail to user'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['userId'] = {
                                in: 'query',
                                description: 'User Id',
                                required: true,                        
        } */
        return await UserService.resendVerifyMail(req, res, next);
    }
    async updateUserPassword(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'Admin update password API'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Password ',
                                  required: true,
                                  schema: { $ref: "#/definitions/UpdateUserPassword" }
          } */

        return await UserService.updateUserPassword(req, res);
    }
    async fetchSuspend(req,res){
         /* #swagger.tags = ['Users']
                           #swagger.description = 'Fetch Suspended user'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
          /*    #swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
        } */
        return await UserService.fetchSuspend(req, res);
    }

    async bulkUserRegister(req, res, next) {
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for bulk user register'  */

        /* #swagger.security = [{
                  "AccessToken": []
        }] */

        /*
        #swagger.consumes = ['multipart/form-data'] 
        #swagger.parameters['files'] = {
                in: 'formData',
                type: 'array',
                minItems: 1,
                maxItems: 10,
                required: true,
                "collectionFormat": "multi",
                description: 'The file to upload',
                items: { type: 'file' }
                }*/
        return await UserService.bulkUserRegister(req, res, next);
    }
    async downloadForBulkUpdate(req,res,next){
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for bulk user download'  */

        /* #swagger.security = [{
                  "AccessToken": []
        }] */
        /*    #swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
        } */
        return await UserService.downloadForBulkUpdate(req,res,next);
    }
    async bulkUserUpdate(req,res,next){
        /* #swagger.tags = ['Users']
                           #swagger.description = 'This routes is used for bulk user Update'  */

        /* #swagger.security = [{
                  "AccessToken": []
        }] */

        /*
        #swagger.consumes = ['multipart/form-data'] 
        #swagger.parameters['files'] = {
                in: 'formData',
                type: 'array',
                minItems: 1,
                maxItems: 10,
                required: true,
                "collectionFormat": "multi",
                description: 'The file to upload',
                items: { type: 'file' }
                }*/
        return await UserService.bulkUserUpdate(req,res,next);
    }
}
export default new UserController();
