import Response from '../response/response.js';
import config from 'config';
import jwt from 'jsonwebtoken';
import { UserAccess } from './routeChecker.js';

async function userToken(req, res, next) {
    try {
        const token = JSON.stringify(req.header('x-access-token'));
        if (!token) return res.status(401).send(Response.tokenFailResp('Access token is required .....'));

        jwt.verify(JSON.parse(token), config.get('token_secret'), async (error, userData) => {
            if (error == 'JsonWebTokenError: invalid signature') {
                jwt.verify(JSON.parse(token), config.get('user_token_secret'), async error => {
                    if (error) return res.status(401).send(Response.tokenFailResp('Invalid access token'));
                    else return res.send(Response.tokenFailResp('Access Denied, User not allow to access this route.'));
                });
            } else if (userData != null) {
                if (userData?.userData?.verified == false) {
                    return res.status(402).send(Response.tokenFailResp('email is not verified'));
                }
                // if (userData?.userData?.planName == null && (req.path !== '/select' && req.path !== '/get')) {
                //     return res.status(402).send(Response.tokenFailResp("please choose plan."))
                // }
                const result = {
                    state: true,
                    userData,
                };
                req.verified = result;
                next();
            }
        });
    } catch (e) {
        logger.info(e);
        return res.status(401).send(Response.tokenFailResp('Invalid access token'));
    }
}

export default userToken;
