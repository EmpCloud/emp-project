import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const readAllNotifications = async function (data) {
    return await axios.put(process.env.PROJECT_API + '/notifications/mark-read/', data, {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};

export const readSingleNotification = async function (id) {
    return await axios.put(
        process.env.PROJECT_API + '/notifications/mark-read?notificationId=' + id,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
