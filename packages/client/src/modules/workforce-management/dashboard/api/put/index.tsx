import axios from 'axios';
import { apiAuthenticationHeader } from '../../../../../helper/function';
import Cookies from 'js-cookie';

export const updateDashboardConfig = async function (id,data) {
    return await axios.put(
        process.env.PROJECT_API + '/dashboard-view/config-update?id='+id, data ,  {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        });
};
