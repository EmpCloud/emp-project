import RoleService from './roles.service.js';

class RolesController {
    async create(req, res, next) {
        /* #swagger.tags = ['Roles']
                           #swagger.description = 'This routes is used for create the Roles' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'User Details',
                                required: true,
                                schema: { $ref: "#/definitions/CreateRoles" }
                        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/rolesCreate" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/rolesFail" }                  
        }*/
        /*  #swagger.responses[429] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/rolesPlan" }                  
    }*/
        return await RoleService.create(req, res, next);
    }

    async fetchRoles(req, res, next) {
        /* #swagger.tags = ['Roles']
                           #swagger.description = 'This routes is used for fetch the roles' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /* #swagger.parameters['roleName'] = {
                                in: 'query',
                                description: 'RoleName Values',                  
                        } */
        /* #swagger.parameters['custom'] = {
                                 in: 'query',
                                 description: 'select RoleType',  
                                 enum: [true, false],        
        } */
        /*	#swagger.parameters['skip'] = {
                           in: 'query',
                           type: 'integer',
                           minimum: 0,
                           description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                             minimum: 0,
                            description: 'results limit',
        } */
        /*	#swagger.parameters['orderBy'] = {
                             in: 'query',
                             description: 'keyword to be ordered',
        } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/rolesFetch" }                  
       }*/
        /*  #swagger.responses[400] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/rolesFetchFail" }                  
        }*/
        return await RoleService.fetchRoles(req, res, next);
    }

    async fetchRoleByPermissions(req, res, next) {
        /* #swagger.tags = ['Roles']
                           #swagger.description = 'This routes is used for fetch roles by permission' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /* #swagger.parameters['roleName'] = {
                                in: 'query',
                                required: true,
                                description: 'RoleName Values',                  
                        } */
        /* #swagger.parameters['permission'] = {
                                in: 'query',
                                required: true,
                                description: 'permission Values',                  
                        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/rolesFetchPermission" }                  
        }*/
        /*  #swagger.responses[400] = {
                                 description: 'Fail response',   
                                 schema: { $ref: "#/definitions/rolesPermissionFail" }                  
        }*/
        return await RoleService.fetchRoleByPermissions(req, res, next);
    }
    async updateRoles(req, res, next) {
        /* #swagger.tags = ['Roles']
                           #swagger.description = 'This routes is used for update the roles' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	    #swagger.parameters['roleId'] = {
                 in: 'query',
                 required: true
        }*/
        /*	    #swagger.parameters['roleName'] = {
                  in: 'body',
                  required: true,
                  schema: { $ref: "#/definitions/UpdateRoleName" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/rolesUpdateSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                                 description: 'Fail response',   
                                 schema: { $ref: "#/definitions/rolesUpdateFail" }                  
        }*/

        return await RoleService.updateRoles(req, res, next);
    }

    async deleteRoles(req, res, next) {
        /* #swagger.tags = ['Roles']
                           #swagger.description = 'This routes is used for delete the Roles' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	    #swagger.parameters['roleId'] = {
                 in: 'query',
                 description: 'delete role  ',
                 
        } */
        /*  #swagger.responses[200] = {
                                 description: 'Success response',   
                                 schema: { $ref: "#/definitions/rolesDelete" }                  
        }*/
        /*  #swagger.responses[400] = {
                                 description: 'Fail response',   
                                 schema: { $ref: "#/definitions/rolesDeleteFail" }                  
        }*/
        return await RoleService.deleteRoles(req, res, next);
    }
    async multiDeleteRoles(req, res, next) {
        /* #swagger.tags = ['Roles']
                           #swagger.description = 'This routes is used for delete the Roles' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
       /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Roles Ids',
                             required: true,
                             schema: { $ref: "#/definitions/multiDeleteRoles" }
        } */
        /*  #swagger.responses[200] = {
                                 description: 'Success response',   
                                 schema: { $ref: "#/definitions/rolesDelete" }                  
        }*/
        /*  #swagger.responses[400] = {
                                 description: 'Fail response',   
                                 schema: { $ref: "#/definitions/rolesDeleteFail" }                  
        }*/
        return await RoleService.multiDeleteRoles(req, res, next);
    }

    async search(req, res, next) {
        /* 	#swagger.tags = ['Roles']
                            #swagger.description = 'This routes is used for search Roles' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	#swagger.parameters['skip'] = {
                                in: 'query',
                                type: 'integer',
                                minimum: 0,
                                description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                                in: 'query',
                                type: 'integer',
                                minimum: 0,
                                description: 'limit value',
        } */
        /*	#swagger.parameters['keyword'] = {
                                in: 'query',
                                description: 'Keyword to be searched',
        } */
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
        } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
        } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/searchSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/searchFail" }                  
        }*/
        return await RoleService.search(req, res, next);
    }

    async filter(req, res, next) {
        /* #swagger.tags = ['Roles']
                       #swagger.description = 'This routes is used for filter the role details'  */
        /* #swagger.security = [{
              "AccessToken": []
    }] */
     /*	#swagger.parameters['skip'] = {
                           in: 'query',
                           type: 'integer',
                           minimum: 0,
                           description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                             minimum: 0,
                            description: 'results limit',
        } */ 
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
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
                            schema: { $ref: "#/definitions/roleFilterDetails" }
    } */
        return await RoleService.filter(req, res, next);
    }
}
export default new RolesController();
