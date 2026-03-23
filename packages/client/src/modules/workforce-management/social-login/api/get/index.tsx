import axios from 'axios';
const googleLogin = async function (data: string) {
    return await axios.post(process.env.PROJECT_API + '/social/google-callback?code=' + data);
};
const twitterLogin = async function (token: any, secret: any, verifier: any) {
    return await axios.post(`${process.env.PROJECT_API}/social/twitter-callback?requestToken=${token}&requestSecret=${secret}&verifier=${verifier}`);
};
const facebookLogin = async function (data: string) {
    return await axios.post(process.env.PROJECT_API + '/social/facebook-callback?code=' + data);
};

export { googleLogin, twitterLogin, facebookLogin };
