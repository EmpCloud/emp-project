import { apiAuthenticationHeader } from '@HELPER/function';
import getFingerprint from '@HELPER/getFingerprint';
import Cookies from 'js-cookie';

import axios from 'axios';
export const adminIsEmailExist = async function (email) {
    return await axios.post(process.env.PROJECT_API + '/admin/is-email-exist?email=' + email);
};
export const adminEmailVerificationApi = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin/verify-admin', data, apiAuthenticationHeader);
};
// export const loginAdmin = async function (data,uni) {
export const loginAdmin = async function (data,uni) {
    // return await axios.post(process.env.PROJECT_API + '/admin/signIn-signUp?uni='+uni, data);
    return await axios.post(process.env.PROJECT_API + '/admin/fetch?uni='+uni, data);
};
export const registerAdmin = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin/add', data);
};
export const getResendMail = async function (data) {
  return await axios.post(process.env.PROJECT_API + '/admin/email-verification-token-generate',data);
};
export const forgotPasswordAdmin = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin/forgot-password-mail?email=' + data, {}, apiAuthenticationHeader);
};
export const resetPasswordAdmin = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin/reset-password', data, apiAuthenticationHeader);
};
export const sendDataToApi = async (imageUrl,datas) => {
    
    const cookie = Cookies.get('token');
    try {
      const FormData = require('form-data');
      let data = new FormData();
      data.append('files', imageUrl);
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.PROJECT_API + `/upload/upload-file?category=User&categoryId=${datas}`,
        headers: {'x-access-token': cookie},
        data: data,
      };

      let res = await axios.request(config);
      alert(res.data.data.filesUrls[0].message);
      const returnedUrl = res.data.data.filesUrls[0].url;
      return returnedUrl;
      
    } catch (error) {
      alert(error.message);
    }
  };
