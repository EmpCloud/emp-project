import jwtService from './jwt.service.js';
import Responses from "./response/response.js";

class TokenVerification{

async verifyToken(req) {
    const token = JSON.stringify(req.headers["x-access-token"]);
    if (!token) {
        return Responses.adminFailResp("Access token is required");
    }
    try {
        const accessToken = token && token.split(' ')[1];
        let userData = await jwtService.verify(accessToken);
        return {
            state: true,
            data: JSON.parse(userData),
        };
    } catch (err) {
        return Responses.adminFailResp("Invalid access token");
    }
}

}

export default new TokenVerification();
