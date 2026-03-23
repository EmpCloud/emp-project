import DefaultScreenConfigService from './defaultScreenConfig.service.js';

class defaultScreenConfigConfigController {
    async fetchScreenConfig(req, res, next) {
        /* 	#swagger.tags = ['Screen-Config']
                            #swagger.description = 'Fetch default screen config' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */

        return await DefaultScreenConfigService.fetchScreenConfig(req, res, next);
    }

    async updateScreenConfig(req, res, next) {
        /* 	#swagger.tags = ['Screen-Config']
                            #swagger.description = 'Update default screen config' */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                            in: 'body',
                            description: 'Update default screen config',
                            required: true,
                            schema: { $ref: "#/definitions/ScreenConfig" }
    } */
        return await DefaultScreenConfigService.updateScreenConfig(req, res, next);
    }
}

export default new defaultScreenConfigConfigController();
