import ClientService from './client.service.js';
class ClientController {
    async clientCreate(req, res, next) {
        /* 	#swagger.tags = ['Client']
                        #swagger.description = 'This routes is used for add the client ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Client Details',
                             required: true,
                             schema: { $ref: "#/definitions/createClient" }
    } */
        return await ClientService.clientCreate(req, res, next);
    }
    
    async createCompany(req, res, next) {
        /* 	#swagger.tags = ['Client']
                        #swagger.description = 'This routes is used for add the client ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Client Details',
                             required: true,
                             schema: { $ref: "#/definitions/createCompany" }
    } */
        return await ClientService.createCompany(req, res, next);
    }

    async fetchClient(req, res, next) {
        /* 	#swagger.tags = ['Client']
                            #swagger.description = 'This routes is used for Fetch the client details' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['clientId'] = {
                            in: 'query',
                            description: 'client Id',
                            }
      */
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
        return await ClientService.fetchClient(req, res, next);
    }

    async fetchCompany(req, res, next) {
        /* 	#swagger.tags = ['Client']
                            #swagger.description = 'This routes is used for Fetch the company details' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['companyId'] = {
                            in: 'query',
                            description: 'company Id',
                            }
      */
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
        return await ClientService.fetchCompany(req, res, next);
    }

    async updateClient(req, res, next) {
        /* 	#swagger.tags = ['Client']
                        #swagger.description = 'This routes is used for update the client ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
     /*  #swagger.parameters['clientId'] = {
                            in: 'query',
                            required: true,
                            description: 'client Id',
                            }
    */
    /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Client Details',
                             required: true,
                             schema: { $ref: "#/definitions/createClient" }
    } */
        return await ClientService.updateClient(req, res, next);
    }
    async updateCompany(req, res, next) {
        /* 	#swagger.tags = ['Client']
                        #swagger.description = 'This routes is used for update the company details ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
     /*  #swagger.parameters['companyId'] = {
                            in: 'query',
                            required: true,
                            description: 'company Id',
                            }
    */
    /*	#swagger.parameters['data'] = {
                             in: 'body',
                             description: 'Company Details',
                             required: true,
                             schema: { $ref: "#/definitions/createCompany" }
    } */
        return await ClientService.updateCompany(req, res, next);
    }
    async deleteClient(req, res, next) {
        /* 	#swagger.tags = ['Client']
                        #swagger.description = 'This routes is used for delete the client ' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
     /*  #swagger.parameters['clientId'] = {
                            in: 'query',
                            description: 'client Id',
                            }
    */
     /*  #swagger.parameters['companyId'] = {
                            in: 'query',
                            description: 'company Id',
                            }
    */
        return await ClientService.deleteClient(req, res, next);
    }
    async clientDetails(req, res, next) {
        /* 	#swagger.tags = ['Client']
                            #swagger.description = 'This routes is used for Fetch the client details' */
        /* #swagger.security = [{
               "AccessToken": []
    }] */
        /*  #swagger.parameters['clientId'] = {
                            in: 'query',
                            description: 'client Id',
                            }
      */
       /*  #swagger.parameters['companyId'] = {
                            in: 'query',
                            description: 'company Id',
                            }
      */
      /*  #swagger.parameters['startDate'] = {
                            in: 'query',
                            description: 'startDate',
                            }
      */
     /*  #swagger.parameters['endDate'] = {
                            in: 'query',
                            description: 'endDate',
                            }
      */
        return await ClientService.clientDetails(req, res, next);
    }
}
export default new ClientController();