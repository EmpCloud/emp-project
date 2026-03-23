import JwtAuth from "./jwt.service.js";
import Response from "./response/response.js";

class TokenVerification {
  async verifyToken(event) {
    const token = JSON.stringify(event.headers["x-access-token"]);
    if (!token) {
      return Response.tokenFailResp("Access token is required");
    }
    try {
      const accessToken = token && token.split(" ")[1];
      let userData = JSON.parse(await JwtAuth.verify(accessToken));
      console.log(`userData`, userData);
      return {
        state: true,
        data: userData,
      };
    } catch (err) {
      return Response.tokenFailResp("Invalid access token");
    }
  }
}

export default new TokenVerification();
