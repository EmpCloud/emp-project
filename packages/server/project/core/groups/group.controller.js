import GroupService from './group.service.js';

class GroupController {
    async createGroup(req, res, next) {
        /* 	#swagger.tags = ['User-Groups']
                            #swagger.description = 'Creates the Groups for the Users' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Group Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateGroup" }
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success',   
                                schema: { $ref: "#/definitions/groupSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/groupFail" }                  
    }*/

        return await GroupService.createGroup(req, res, next);
    }

    async fetchGroup(req, res, next) {
        /* 	#swagger.tags = ['User-Groups']
                            #swagger.description = 'Fetch the User Groups' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['groupId'] = {
                            in: 'query',
                            description: 'Group Id',
                            required: false,
                            }
     */
    /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['groupName', 'groupDescription','assignedMembers','adminId','groupUpdatedBy','groupCreatedBy'],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
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
        /*  #swagger.responses[200] = {
                                description: 'Success',   
                                schema: { $ref: "#/definitions/groupFetchSuccess" }                  
   }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/groupFetchFail" }                  
    }*/

        return await GroupService.fetchGroup(req, res, next);
    }

    async updateGroup(req, res, next) {
        /* 	#swagger.tags = ['User-Groups']
                            #swagger.description = 'Update the User Groups ' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Update User Details',
                            required: true,
                            schema: { $ref: "#/definitions/UpdateGroup" }
    } */
        /*	#swagger.parameters['groupId'] = {
                            in: 'query',
                            type: 'string',
                            required : true,
                            description: 'Group Id to be updated',
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success',   
                                schema: { $ref: "#/definitions/groupUpdateSuc" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/groupUpdateFail" }                  
    }*/

        return await GroupService.updateGroup(req, res, next);
    }

    async multideleteGroups(req, res, next) {
        /* 	#swagger.tags = ['User-Groups']
                            #swagger.description = 'Delete the Group details ' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Groups Ids',
                             required: true,
                             schema: { $ref: "#/definitions/multiDeleteGroup" }
        } */
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/groupDeleteFail" }                  
    }*/ /*	#swagger.parameters['groupId'] = {
                            in: 'query',
                            type: 'string',
                            description: 'Group Id to be deleted',
    } */

        return await GroupService.multideleteGroups(req, res, next);
    }
    async deleteGroup(req, res, next) {
        /* 	#swagger.tags = ['User-Groups']
                            #swagger.description = 'Delete the Group details ' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        
        /*  #swagger.responses[200] = {
                                description: 'Success',   
                                schema: { $ref: "#/definitions/groupDelete" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/groupDeleteFail" }                  
    }*/ /*	#swagger.parameters['groupId'] = {
                            in: 'query',
                            type: 'string',
                            description: 'Group Id to be deleted',
    } */

        return await GroupService.deleteGroup(req, res, next);
    }
    async searchGroup(req, res, next) {
        /* 	#swagger.tags = ['User-Groups']
                    #swagger.description = 'This routes is used for search the group of users with skip,limit and sort' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type: 'integer',
                            minimum:0,
                            description: 'Skip Values',
    } */

        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
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
                            enum: ['groupName', 'groupDescription','assignedMembers','adminId','groupUpdatedBy','groupCreatedBy'],
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
        return await GroupService.searchGroup(req, res, next);
    }
    async groupFilter(req, res, next) {
        /* #swagger.tags = ['User-Groups']
                       #swagger.description = 'This routes is used for filter the Group details'  */
        /* #swagger.security = [{
              "AccessToken": []
        }] */
        /*	#swagger.parameters['skip'] = {
                            in: 'query',
                            type: 'integer',
                            minimum:0,
                            description: 'Skip Values',
        } */
        /*	#swagger.parameters['limit'] = {
                            in: 'query',
                            type: 'integer',
                            minimum:0,
                            description: 'results limit',
    } */
           /*	#swagger.parameters['orderBy'] = {
                            in: 'query',
                            description: 'keyword to be ordered',
                            enum: ['groupName', 'groupDescription','assignedMembers','adminId','groupUpdatedBy','groupCreatedBy'],
    } */
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'sorting parameters(asc or desc)',
                            enum: ['asc', 'desc'],
    } */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'group filter Details',
                            required: true,
                            schema: { $ref: "#/definitions/groupFilterDetails" }
    } */
        return await GroupService.groupFilter(req, res, next);
    }
}

export default new GroupController();
