import { apiAuthenticationHeader } from '@HELPER/function';
import getFingerprint from '@HELPER/getFingerprint';
import Cookies from 'js-cookie';

import axios from 'axios';

export const registerAdmin = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin/add', data);
};
export const isEmpUser = async function (data) {
    return await axios.post(process.env.PROJECT_API + '/admin/isEmp-user', data);
};