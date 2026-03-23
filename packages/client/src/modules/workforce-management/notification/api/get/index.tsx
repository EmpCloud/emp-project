import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const fetchNotification = async function () {
    return await axios.get(process.env.PROJECT_API + '/notifications/get', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
