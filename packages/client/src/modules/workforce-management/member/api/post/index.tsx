import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const memberEmailVerification = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/verify-user', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const loginMember = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/user-login', data);
};
export const forgotPasswordMember = async function (orgId, email) {
    return await axios.post(process.env.PROJECT_API + '/forgot-password', {orgId: orgId,email: email,});
};
export const setPasswordMember = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/set-password', data);
};
