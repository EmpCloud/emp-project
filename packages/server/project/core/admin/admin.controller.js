import AdminService from './admin.service.js';

class AdminController {
    async addAdmin(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for creating an organization with Admin Details'  */

        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'Admin  Details',
                                required: true,
                                schema: { $ref: "#/definitions/AdminDetails" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success',   
                                schema: { $ref: "#/definitions/SuccessMessage" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/FailMessage" }                  
        }*/

        return await AdminService.addAdmin(req, res, next);
    }

    async fetchAdmin(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for fetching an admin details with access token'  */

        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'Admin  Details',
                                  required: true,
                                  schema: { $ref: "#/definitions/AdminCreds" }
        }*/
        /*  #swagger.responses[200] = {
                              description: 'Success response',   
                              schema: { $ref: "#/definitions/fetchSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/fetchFail" }                  
        }*/

        return await AdminService.fetchAdmin(req, res, next);
    }
    async isEmpUser(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for Redirecting from EMP Monitor to Work force management'  */

        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'Encrypted email',
                                  required: true,
                                  schema:{$ref:"#/definitions/EncryptedMail"}
        }*/
        /*  #swagger.responses[200] = {
                              description: 'Success response',   
                              schema: { $ref: "#/definitions/fetchSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/empIsAdminFail" }                  
        }*/

        return await AdminService.isEmpUser(req, res, next);
    }

    async verifyAdmin(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for sending verify mail to admin mail Id'  */
        /*	#swagger.parameters['data'] = {
                                 in: 'body',
                                 description: 'Admin Email Verification',
                                 required: true,
                                 schema: { $ref: "#/definitions/AdminVerification" }
        }*/
        /*  #swagger.responses[200] = {
                              description: 'Success response',   
                              schema: { $ref: "#/definitions/adminVerify" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/adminVerifyFail" }                  
        }*/

        return await AdminService.verifyAdmin(req, res, next);
    }
    async isEmailExist(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used to check whether admin Mail is exist or not'  */

        /*	#swagger.parameters['email'] = {
                              in: 'query',
                              description: 'Enter the Email',
                              required: true,
                              
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/existSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/existFail" }                  
        }*/

        return await AdminService.isEmailExist(req, res, next);
    }
    async isOrgExist(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used to check whether organization is exist or not '  */

        /*	#swagger.parameters['OrgId'] = {
                              in: 'query',
                              description: 'Enter the OrgId',
                              required: true,
                              
        }*/
        /*  #swagger.responses[200] = {
                                 description: 'Success response',   
                                 schema: { $ref: "#/definitions/existOrg" }                  
         }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/existOrgFail" }                  
        }*/

        return await AdminService.isOrgExist(req, res, next);
    }
    async updateAdmin(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for update admin details'  */
        /* #swagger.security = [{
                  "AccessToken": []
        }] */

        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'Admin  Details',
                                required: true,
                                schema: { $ref: "#/definitions/UpdateAdmin" }
        } */
        /*  #swagger.responses[200] = {
                               description: 'Success response',   
                               schema: { $ref: "#/definitions/adminUpdSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/adminUpdFail" }                  
        }*/

        return await AdminService.updateAdmin(req, res, next);
    }
    async forgotPassword(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used to send verification Mail and verificationToken for reset Password'  */

        /*	#swagger.parameters['email'] = {
                                in: 'query',
                                description: 'Admin email',
                                required: true,
                                
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/existOrg" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/existOrgFail" }                  
        }*/

        return await AdminService.forgotPassword(req, res, next);
    }
    async resetPassword(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for resetting Admin New password'  */

        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'Admin Reset Password Details',
                                required: true,
                                schema: { $ref: "#/definitions/AdminResetPassword" }
        } */
        /*  #swagger.responses[200] = {
                                description: 'Success response',   
                                schema: { $ref: "#/definitions/resetSuccess" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/resetFail" }                  
        }*/

        return await AdminService.resetPassword(req, res, next);
    }

    async generateToken(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'Admin email token generation API'  */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'Admin Email ',
                                  required: true,
                                  schema: { $ref: "#/definitions/AdminEmail" }
          } */

        return await AdminService.generateToken(req, res, next);
    }
    async updatePassword(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'Admin update password API'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['data'] = {
                                  in: 'body',
                                  description: 'Admin Password ',
                                  required: true,
                                  schema: { $ref: "#/definitions/AdminPassword" }
          } */

        return await AdminService.updatePassword(req, res, next);
    }
    async AdminDelete(req, res, next) {
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'Admin update password API'  */
        /* #swagger.security = [{
               "AccessToken": []
        }] */
        /*	#swagger.parameters['email'] = {
                                in: 'query',
                                description: 'Admin email',
                                required: true,
                                
        } */
        /*	#swagger.parameters['orgId'] = {
                                in: 'query',
                                description: 'orgnaization Id',
                                required: true,
                                
        } */

        return await AdminService.AdminDelete(req, res, next);
    }

    async adminSignInSignUp(req,res,next){
        /* #swagger.tags = ['Admin']
                           #swagger.description = 'This routes is used for SignIn and SignUp Admin'  */

        /*	#swagger.parameters['data'] = {
                                in: 'body',
                                description: 'Admin  Details',
                                required: true,
                                schema: { $ref: "#/definitions/AdminDetail" }
        }*/
        /*  #swagger.responses[200] = {
                                description: 'Success',   
                                schema: { $ref: "#/definitions/SuccessMessage" }                  
        }*/
        /*  #swagger.responses[400] = {
                                description: 'Fail response',   
                                schema: { $ref: "#/definitions/FailMessage" }                  
        }*/

        return await AdminService.adminSignInSignUp(req,res,next);
    }
}
export default new AdminController();
