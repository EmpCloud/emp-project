import ShortcutKeysService from './shortcutKeys.service.js';

class ShortcutKeysController {
    async createShortcutKey(req, res, next) {
        /* #swagger.tags = ['Shortcut-Keys']
                           #swagger.description = 'This routes is used for create Shortcut Key' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'Create shortcut key for a feature',
                                required: true,
                                schema: { $ref: "#/definitions/createShortcutKey" }
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/shortCutKeySuc" }                  
       }*/
        /*  #swagger.responses[400] = {
                                 description: 'Fail response',   
                                 schema: { $ref: "#/definitions/shortCutKeyFail" }                  
        }*/
        return await ShortcutKeysService.createShortcutKey(req, res, next);
    }

    async readShortcutKeys(req, res, next) {
        /* #swagger.tags = ['Shortcut-Keys']
                       #swagger.description = 'This routes is used for fetch Shortcut Key' */
        /* #swagger.security = [{
                   "AccessToken": []
        }] */
        /*	    #swagger.parameters['id'] = {
                 in: 'query',
                 description: 'Get shortcutKey  by Id  ',
                 
        }*/
        /*	#swagger.parameters['sort'] = {
                            in: 'query',
                            description: 'Get By Category-shortCutType',
                            enum: ['global', 'page', 'subPage'],
        } */
        /*	#swagger.parameters['skip'] = {
                                 in: 'query',
                                 type: 'integer',
                                 description: 'Skip Values',
        } */

        /*	#swagger.parameters['limit'] = {
                                in: 'query',
                                type: 'integer',
                                description: 'Results limit',
        } */
        /*	#swagger.parameters['filter'] = {
                              in: 'query',
                              type: 'boolean',
                              description: 'Filter key which is default or not',
        } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/shortKeyFetch" }                  
        }*/
        /*  #swagger.responses[400] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/shortKeyFetchFail" }                  
        }*/
        return await ShortcutKeysService.readShortcutKeys(req, res, next);
    }

    async updateShortcutKey(req, res, next) {
        /* #swagger.tags = ['Shortcut-Keys']
                               #swagger.description = 'This routes is used for update Shortcut Key' */
        /* #swagger.security = [{
                       "AccessToken": []
        }] */
        /*	#swagger.parameters['id'] = {
                     in: 'query',
                     required: true,
                     description: 'Update shortcutKey  ',
                     
        } */
        /*	#swagger.parameters['data'] = {
                                    in: 'body',
                                    description: 'Update shortcut key for a feature',
                                    required: true,
                                    schema: { $ref: "#/definitions/updateShortcutKey" }
        } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/shortKeyUpdateSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/shortKeyUpdateFail" }                  
        }*/
        return await ShortcutKeysService.updateShortcutKey(req, res, next);
    }

    async deleteShortcutKey(req, res, next) {
        /* #swagger.tags = ['Shortcut-Keys']
                              #swagger.description = 'This routes is used for delete Shortcut Key' */
        /* #swagger.security = [{
                       "AccessToken": []
        }] */
        /*	    #swagger.parameters['id'] = {
                     in: 'query',
                     description: 'delete shortcutKey  ',
                     
        } */
        /*  #swagger.responses[200] = {
                                    description: 'Success response',   
                                    schema: { $ref: "#/definitions/shortKeyDeleteSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                                    description: 'Fail response',   
                                    schema: { $ref: "#/definitions/shortKeyDeleteFail" }                  
        }*/
        return await ShortcutKeysService.deleteShortcutKey(req, res, next);
    }
}

export default new ShortcutKeysController();
