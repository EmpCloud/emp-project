import { apiAuthenticationHeader } from '@HELPER/function';
import axios from 'axios';
import Cookies from 'js-cookie';

export const getPermisssionGroup = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/permission/fetch?' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const getPermissionSearch = async function (condition = '') {
    return await axios.get(process.env.PROJECT_API + '/permission/search' + condition, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};