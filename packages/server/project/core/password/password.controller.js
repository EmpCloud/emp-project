import PasswordService from './password.service.js';

class PasswordControllers {

    async getPassword(req, res, next) {
        /* #swagger.tags = ['Password']
                           #swagger.description = 'This route is used to get events'  */
        /*  #swagger.parameters['secretKey'] = {
                         in: 'query',
                         description: 'enter secret key ',
     }*/

        /*  #swagger.parameters['encryptedPassWord'] = {
                            in: 'query',
                            description: 'enter password to decrypt',
        }*/

        return await PasswordService.getPassword(req, res, next);
    }

}

export default new PasswordControllers();
