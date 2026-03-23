
import socialLoginService from './socialLogin.service.js'
class SocialLoginController {
  async socialLogin(req, res, next) {
    /* 	#swagger.tags = ['Social-login']
                    #swagger.description = 'Social Login for FaceBook,Google,Twitter' */
    /*	#swagger.parameters['network'] = {
                           in: 'query',
                           default: 'Facebook',
                           enum:["Facebook","Google","Twitter"]
                   } */
    return await socialLoginService.socialLogin(req, res, next);
  }

  async googleCallback(req, res, next) {
    /* 	#swagger.tags = ['Social-login']
        #swagger.description = 'Google code ' */

    /*	#swagger.parameters['code'] = {
                             in: 'query',
                             require:true
                  } */
    return await socialLoginService.googleCallback(req, res, next);
  }
  async facebookCallback(req, res, next) {
    /* 	#swagger.tags = ['Social-login']
        #swagger.description = 'Facebook code ' */
    /*	#swagger.parameters['code'] = {
          in: 'query',
          require:true
  } */
    return await socialLoginService.facebookCallback(req, res, next);
  }
  async twitterCallback(req, res, next) {
    /* 	#swagger.tags = ['Social-login']
          #swagger.description = 'Twitter code ' */
    /*	#swagger.parameters['requestToken'] = {
          in: 'query',
          require:true
  } */
    /*	#swagger.parameters['requestSecret'] = {
              in: 'query',
              required: true,
              }
          #swagger.parameters['verifier'] = {
              in: 'query',
              required: true,
              }
      } */

    return await socialLoginService.twitterCallback(req, res, next);
  }
}
export default new SocialLoginController();