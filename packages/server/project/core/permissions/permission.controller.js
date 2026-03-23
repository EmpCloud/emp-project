import PermissionService from './permission.service.js';

class PermissionController {
    async create(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used for create the Permissions' */
        /* #swagger.security = [{
                   "AccessToken": []
        }]*/
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'User Details',
                                required: true,
                                schema: { $ref: "#/definitions/CreatePermissions" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/permissionSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/permissionFail" }                  
        }*/
        /*  #swagger.responses[429] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/permissionPlan" }                  
    }*/
        return await PermissionService.create(req, res, next);
    }

    async fetchPermissions(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used for fetch the Permissions' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'Skip Values',
        }*/
         /* #swagger.parameters['custom'] = {
                                 in: 'query',
                                 description: 'select PermissionType',  
                                 enum: [true, false],           
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type:'integer',
                            minimum: 0,
                            description: 'results limit',
        }*/
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['permissionName', 'is_default', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/permissionFetch" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/permissionFetchFail" }                  
        }*/
        return await PermissionService.fetchPermissions(req, res, next);
    }

    async updatePermissions(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used for Update the Permissions' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	    #swagger.parameters['permissionId'] = {
                 in: 'query',
                 required: true
        }*/
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'User Details',
                                required: true,
                                schema: { $ref: "#/definitions/UpdatePermission" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/updatePermissions" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/updatePermissionsFail" }                  
        }*/

        return await PermissionService.updatePermissions(req, res, next);
    }
    async updateNewPermission(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used to add additional Permissions' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	    #swagger.parameters['permissionId'] = {
                 in: 'query',
                 required: true
        }*/
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'User Details',
                                required: true,
                                schema: { $ref: "#/definitions/additionalPermission" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/updatePermissions" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/updatePermissionsFail" }                  
        }*/

        return await PermissionService.updateNewPermission(req, res, next);
    }

    async deletePermissions(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used for delete the Permissions' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
        /*	    #swagger.parameters['permissionId'] = {
                 in: 'query',
                 required: false
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/deletePermissions" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/deletePermissionsFail" }                  
        }*/
        return await PermissionService.deletePermissions(req, res, next);
    }
    async multideletePermissions(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used for delete the Permissions' */
        /* #swagger.security = [{
                   "AccessToken": []
            }] */
           /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Permission Ids',
                             required: true,
                             schema: { $ref: "#/definitions/multiDeletePermission" }
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/deletePermissions" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/deletePermissionsFail" }                  
        }*/
        return await PermissionService.multideletePermissions(req, res, next);
    }

    async searchPermissions(req, res, next) {
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used to secrch the Permissions' */
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
           /*	#swagger.parameters['keyword'] = {
                            in: 'query',
                            description: 'Keyword to be searched',
    }*/
        /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['permissionName', 'is_default', 'createdAt', 'updatedAt'],
        }*/
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/permissionFetch" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/permissionFetchFail" }                  
        }*/
        return await PermissionService.searchPermissions(req, res, next);
    }
    async addPermissionConfig(req,res,next){
        // #swagger.ignore = true
        /* #swagger.tags = ['Permissions']
                           #swagger.description = 'This routes is used to add  permissionConfig to the Permissions' */
                                   /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Permission Ids',
                             required: true,
                             schema: { $ref: "#/definitions/addPermissionConfig" }
        } */
        return await PermissionService.addPermissionConfig(req,res,next);
    }
}
export default new PermissionController();
