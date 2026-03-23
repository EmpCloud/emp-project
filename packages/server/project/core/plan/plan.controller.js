import PlanService from './plan.service.js';
class PlanController {
    async createPlan(req, res, next) {
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'Creates the Plans details for the Project' */
        /* #swagger.security = [{
               "AccessToken": []
    }]*/
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/CreateProjectPlan" }
    }*/
        return await PlanService.createPlan(req, res, next);
    }

    async getAllPlans(req, res, next) {
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'This routes is used for Fetch the Plans details' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['_id'] = {
                            in: 'query',
                            description: 'plan Id',
                            }
    */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/fetchPlan" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/fetchPlanFail" }                  
    }*/
        return await PlanService.getAllPlans(req, res, next);
    }
    async getHistory(req, res, next) {
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'This routes is used for Fetch the Plans history' */
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
                                 enum: ['expireDate', 'startDate','planName','duration'],
            } */
        /*	#swagger.parameters['sort'] = {
                        in: 'query',
                        description: 'sorting parameters(asc or desc)',
                        enum: ['asc', 'desc'],
    }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/fetchPlan" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/fetchPlanFail" }                  
    }*/
        return await PlanService.getHistory(req, res, next);
    }
    async assignPlan(req, res, next) {
        /* #swagger.tags = ['Plan']
                       #swagger.description = 'This routes is used for select the Plans '  */
        /* #swagger.security = [{
              "AccessToken": []
    }]*/

        /*	#swagger.parameters['plan'] = {
                            in: 'query',
                            description: 'Plan Names',
                            required: true,
                            enum: ['Standard','Premium','Pro','Enterprise'],
                            
    }*/
        /*	#swagger.parameters['data'] = {
                           in: 'body',
                           description: 'plan feature details ',
                           schema: { $ref: "#/definitions/UpdatePlan" }
   }*/

        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/assignPlanSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/assignPlanFail" }                  
    }*/
        return await PlanService.assignPlan(req, res, next);
    }
    async planUsage(req, res) {
        /* 	#swagger.tags = ['Plan']
                                    #swagger.description = 'This routes is used for Fetch the Plans usage Data' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        return await PlanService.planUsage(req, res);
    }
    async downGradePlan(req, res) {
        /* #swagger.tags = ['Plan']
                       #swagger.description = 'This routes is used for downgrade the Plans '  */
        /* #swagger.security = [{
              "AccessToken": []
    }]*/
        return await PlanService.downGradePlan(req, res);
    }
    async updatePlanExpired(req, res) {

        /* #swagger.tags = ['Plan']
                              #swagger.description = 'This routes is used for delete the data to downgrade Plans '  */
        /* #swagger.security = [{
              "AccessToken": []
    }]*/
        return await PlanService.updatePlanExpired(req, res);
    }
    async deleteData(req, res) {
        /* #swagger.tags = ['Plan']
                       #swagger.description = 'This routes is used for delete the data to downgrade Plans '  */
        /* #swagger.security = [{
              "AccessToken": []
    }]*/
        /*	#swagger.parameters['data'] = {
                           in: 'body',
                           description: 'Delete the data to downgrade Plans',
                           required: true,
                           schema: { $ref: "#/definitions/deleteData" }
                           
                           
   }*/
        return await PlanService.deleteData(req, res);
    }


    async updatePlan(req, res, next) {
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'Update the Plan details ' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'User Details',
                            required: true,
                            schema: { $ref: "#/definitions/UpdateProjectPlan" }
    }*/

        return await PlanService.updatePlan(req, res, next);
    }

    async deletePlan(req, res, next) {
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'Delete the Plan details ' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*  #swagger.parameters['planId'] = {
                            in: 'query',
                            description: 'plan Id',
                            }
    */
        return await PlanService.deletePlan(req, res, next);
    }

    async infoProjects(req,res,next){
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'Delete the Plan details ' */
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
        return await PlanService.infoProjects(req,res,next);
    }
    async infoUser(req,res,next){
        /* 	#swagger.tags = ['Plan']
                            #swagger.description = 'Delete the Plan details ' */
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
        return await PlanService.infoUser(req,res,next);
    }
    async deleteProjects(req,res,next){
        /* 	#swagger.tags = ['Plan']
                        #swagger.description = 'This routes is used for delete the Projects' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                        in: 'body',
                        description: 'Provide project Ids',
                        required: true,
                        schema: { $ref: "#/definitions/projectIds" }
    } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/deleteSuccess" }                  
    }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/deleteProFail" }                  
    }*/        
        return await PlanService.deleteProjects(req,res,next);
    }
}

export default new PlanController();
