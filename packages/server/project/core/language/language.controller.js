import LanguageService from './language.service.js';
class LanguageController {
    async updateLanguage(req, res, next) {
        /* 	#swagger.tags = ['Language']
                            #swagger.description = 'This routes is used for update the language  ' */
        /* #swagger.security = [{
                 "AccessToken": []
        }]*/

        /*	#swagger.parameters['language'] = {
                                 in: 'query',
                                 description: 'select language',
                                 required: true,
                                 enum: ['English', 'Spanish', 'Indonesian', 'French ', 'Arabic'],
                                
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/languageUpdateSuc" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/languageFail" }                  
        }*/
        return await LanguageService.updateLanguage(req, res, next);
    }
}
export default new LanguageController();
