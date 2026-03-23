import { apiAuthenticationHeader } from '@HELPER/function';
import axios from 'axios';
import Cookies from 'js-cookie';
export const fetchAdminConfig = async function () {
    return await axios.get(process.env.PROJECT_API + '/admin-config/fetch', {
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': Cookies.get('token'),
        },
    });
};
