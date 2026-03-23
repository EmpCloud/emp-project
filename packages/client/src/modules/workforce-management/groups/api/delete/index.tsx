import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const deleteAllGroup = async function () {
    return await axios.delete(process.env.PROJECT_API + '/groups/delete', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteGroupById = async function (id) {
    return await axios.delete(process.env.PROJECT_API + '/groups/delete?groupId=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
