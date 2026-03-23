import axios from 'axios';
import { apiAuthenticationHeader } from '@HELPER/function';
import Cookies from 'js-cookie';
export const selectPlan = async function (data) {
    return await axios.post(
        process.env.PROJECT_API + '/plan/select?plan=' + data,
        {},
        {
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': Cookies.get('token'),
            },
        }
    );
};
