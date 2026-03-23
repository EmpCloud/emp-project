import axios from "axios";
export const googleLogin = async function (data) {
    return await axios.post(
        process.env.PROJECT_API+ "/social/google-callback?code="+data
  
     
    );
  };
  export const twitterLogin = async function (token,secret,verifier) {
    return await axios.post(
        
        `${process.env.PROJECT_API}/social/twitter-callback?requestToken=${token}&requestSecret=${secret}&verifier=${verifier}`
  
     
    );
  };
  export const facebookLogin = async function (data) {
    return await axios.post(
        process.env.PROJECT_API+ "/social/facebook-callback?code="+data
  
     
    );
  };