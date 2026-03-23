import unauthorizedService from './unauthorized.service.js';

class unauthorizedController {
    async verifyUser(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'User email verification API'  */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Email Verification',
                                  required: true,
                                  schema: { $ref: "#/definitions/UserVerification" }
          } */

        return await unauthorizedService.verifyUser(req, res, next);
    }
    async setPassword(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'Set the Password for the User'  */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'Sets the Password for the User',
                                  required: true,
                                  schema: { $ref: "#/definitions/UserPasswordSet" }
          } */

        return await unauthorizedService.setPassword(req, res, next);
    }
    async UserLogin(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'User Login API'  */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Login API',
                                  required: true,
                                  schema: { $ref: "#/definitions/UserCreds" }
          } */

        return await unauthorizedService.UserLogin(req, res, next);
    }
    async resetPassword(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'Update the Admin details'  */

        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Login API',
                                  required: true,
                                  schema: { $ref: "#/definitions/resetPassword" }
          } */
        return await unauthorizedService.resetPassword(req, res, next);
    }

    async forgotPassword(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'Recover the Admin password '  */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Email ',
                                  required: true,
                                  schema: { $ref: "#/definitions/forgetPassword" }
        } */
        return await unauthorizedService.forgotPassword(req, res, next);
    }
    async generateToken(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'User email token generation API'  */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Email ',
                                  required: true,
                                  schema: { $ref: "#/definitions/forgetPassword" }
          } */

        return await unauthorizedService.generateToken(req, res, next);
    }
    async updatePassword(req, res, next) {
        /* #swagger.tags = ['Open-User']
                           #swagger.description = 'User update password API'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'User Password ',
                                  required: true,
                                  schema: { $ref: "#/definitions/AdminPassword" }
          } */

        return await unauthorizedService.updatePassword(req, res, next);
    }
}
export default new unauthorizedController();
