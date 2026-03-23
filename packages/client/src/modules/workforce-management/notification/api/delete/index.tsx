import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';

export const deleteNotification = async function (id) {
    return await axios.delete(process.env.PROJECT_API + '/notifications/delete?notificationId=' + id, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
export const deleteAllNotification = async function () {
    return await axios.delete(process.env.PROJECT_API + '/notifications/delete', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
