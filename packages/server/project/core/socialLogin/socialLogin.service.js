import Response from '../../response/response.js';
import logger from '../../resources/logs/logger.log.js';
import config from 'config';
import helper from '../../utils/social.utils.js'
import socialLoginValidation from './socialLogin.validate.js';
import TwitterHelper from '../../utils/twitter.utils.js'
import jwt from 'jsonwebtoken';
import adminModel from '../admin/admin.model.js';

class socialLoginService {
    constructor() {
        this.twtConnect = new TwitterHelper(config.get('twitter_api'));
    }
    async socialLogin(req, res, next) {
        try {
            const { value, error } = socialLoginValidation.validateNetwork(req.query);
            if (error) return res.send(Response.validationFailResp('Validation failed', error.message));
            const { network } = req.query;
            let redirectUrl = '';
            if (network == 'Facebook') {
                redirectUrl = `https://www.facebook.com/dialog/oauth?response_type=code&redirect_uri=${encodeURIComponent(config.get('facebook_api.redirect_url'))}&client_id=${config.get(
                    'facebook_api.app_id'
                )}&scope=${config.get('facebook_api.login_scopes')}`;
                return res.send(Response.SocialCallbackResponse(res, redirectUrl, null, 'Navigated to Facebook'));
            }
            if (network == 'Google') {
                redirectUrl = `https://accounts.google.com/o/oauth2/v2/auth?redirect_uri=${encodeURIComponent(
                    config.get('google_api.redirect_url')
                )}&prompt=consent&response_type=code&client_id=${config.get('google_api.client_id')}&scope=${config.get('google_api.login_scopes')}&access_type=offline`;
                return res.send(Response.SocialCallbackResponse(res, redirectUrl, null, 'Navigated to Google'));
            }
            if (network == 'Twitter') {
                const twitter_response = await this.twtConnect.requestTokenLogin();
                const tokens = {
                    requestToken: twitter_response.requestToken,
                    requestSecret: twitter_response.requestSecret,
                };
                redirectUrl = `https://api.twitter.com/oauth/authenticate?oauth_token=${tokens.requestToken}`;
                return res.send(Response.SocialCallbackResponse(res, redirectUrl, tokens, 'navigate to twitter'));
            }
        } catch (err) {
            logger.log(`Error in catch social Login ${err}`);
            res.send(Response.projectFailResp('Failed social login', err.message));
        }
    }

    async facebookCallback(req, res, next) {
        try {
            const { code } = req.query;
            const { value, error } = socialLoginValidation.validateCode(req.query);
            if (error) return res.send(Response.validationFailResp('Validation error', error.message));
            const access_token = await helper.getFbToken(code, res);
            const parseData = await helper.getFbUserProfileInfo(access_token);
            if (!parseData.email || !parseData.firstName) { res.send(Response.projectFailResp("Failed to login from facebook data,plaese check")) }
            const isDataExist = await adminModel.findOne({ email: parseData?.email });
            logger.info(isDataExist)
            if (!isDataExist) {
                parseData.email = parseData.email.toLowerCase(); // converting the any email into lowercase
                let resultData = await adminModel.create(parseData);
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = resultData.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            } else {
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = isDataExist.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            }
        } catch (error) {
            logger.log(`Error in catch Facebook Login ${error}`);
            res.send(Response.projectFailResp('Failed facebook login', error.message));
        }
    }

    async googleCallback(req, res, next) {
        try {
            const { code } = req.query;
            const { value, error } = socialLoginValidation.validateCode(req.query);
            if (error) return res.send(Response.validationFailResp('Validation failed', error.message));
            const g_token = await helper.getGoogleAccessToken(code, config.get('google_api.redirect_url'), res);
            const googlerawuserInfo = await helper.getGoogleProfileInformation(g_token);
            const parseData = await helper.parsedataGoogle(googlerawuserInfo, g_token);
            if (!parseData.email || !parseData.firstName) { res.send(Response.projectFailResp("Failed to login from facebook data,plaese check")) }
            const isDataExist = await adminModel.findOne({ email: parseData?.email });
            logger.info(isDataExist)
            if (!isDataExist) {
                parseData.email = parseData.email.toLowerCase(); // converting the any email into lowercase
                let resultData = await adminModel.create(parseData);
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = resultData.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            } else {
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = isDataExist.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            }
        } catch (error) {
            logger.log(`Error in catch Google Login ${error}`);
            res.send(Response.projectFailResp('failed google login', error.message));
        }
    }
    async twitterCallback(req, res, next) {
        try {
            const { requestToken } = req.query;
            const { requestSecret } = req.query;
            const { verifier } = req.query;
            const { value, error } = socialLoginValidation.validateTwitterData(req.query);
            if (error) return res.send(Response.validationFailResp('validation failed', error.message));
            const parseData = await helper.getTwitterData(requestToken, requestSecret, verifier, res);
            if (!parseData.firstName) { res.send(Response.projectFailResp("Failed to login from facebook data,plaese check")) }
            if (parseData?.statusCode) {
                res.send(Response.FailResp(parseData?.data));
            }
            const isDataExist = await adminModel.findOne({ userName: parseData?.userName });
            logger.info(isDataExist);
            if (!isDataExist) {
                parseData.email = parseData.email.toLowerCase(); // converting the any email into lowercase
                let resultData = await adminModel.create(parseData);
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = resultData.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            } else {
                let { forgotPasswordToken, forgotTokenExpire, password, dashboardConfig, emailValidateToken, emailTokenExpire, ...filteredData } = isDataExist.toJSON();
                let accessToken = jwt.sign({ userData: filteredData }, config.get('token_secret'), { expiresIn: '24h' });
                res.send(Response.projectSuccessResp(`success`, { userData: filteredData, accessToken }));
            }
        } catch (error) {
            logger.log(`Error in catch twitter Login ${error}`);
            res.send(Response.projectFailResp('Failed to login twitter', error.message));
        }
    }
}
export default new socialLoginService();
